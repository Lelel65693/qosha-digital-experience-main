import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/sync-reviews")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const urlObj = new URL(request.url);
          const reqToken = urlObj.searchParams.get("token");

          // Retrieve settings
          const { data: settingsRow, error: settingsError } = await supabaseAdmin
            .from("site_settings")
            .select("value")
            .eq("key", "google_reviews_settings")
            .maybeSingle();

          if (settingsError) {
            return new Response(JSON.stringify({ error: settingsError.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const settings = (settingsRow?.value as any) || {};
          const apiKey = settings.apiKey || process.env.GOOGLE_PLACES_API_KEY;
          const placeId = settings.placeId || process.env.GOOGLE_PLACE_ID;
          const webhookToken = settings.webhookToken;

          if (!apiKey || !placeId) {
            return new Response(
              JSON.stringify({ error: "Google API credentials not configured in settings." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Protect the endpoint if webhookToken is set in settings
          if (webhookToken && reqToken !== webhookToken) {
            return new Response(
              JSON.stringify({ error: "Unauthorized. Invalid token." }),
              { status: 401, headers: { "Content-Type": "application/json" } }
            );
          }

          // Fetch reviews from Google
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=az`;
          const res = await fetch(url);
          if (!res.ok) {
            return new Response(
              JSON.stringify({ error: `Google API failed: ${res.statusText}` }),
              { status: 502, headers: { "Content-Type": "application/json" } }
            );
          }

          const json = await res.json() as any;
          if (json.status !== "OK") {
            return new Response(
              JSON.stringify({ error: `Google API Error: ${json.error_message || json.status}` }),
              { status: 502, headers: { "Content-Type": "application/json" } }
            );
          }

          const reviews = json.result?.reviews || [];
          let insertedCount = 0;

          for (const r of reviews) {
            const author_name = r.author_name;
            const review_date = r.time ? new Date(r.time * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
            const content = r.text || "";

            if (!author_name || !content) continue;

            const { data: existing } = await supabaseAdmin
              .from("reviews")
              .select("id")
              .eq("author_name", author_name)
              .eq("review_date", review_date)
              .maybeSingle();

            if (existing) continue;

            const rating = Number(r.rating) || 5;

            const { error: insertError } = await supabaseAdmin
              .from("reviews")
              .insert({
                author_name,
                author_avatar: r.profile_photo_url || null,
                content,
                content_az: content,
                content_ru: content,
                content_en: content,
                rating,
                review_date,
                source: "google",
                status: "approved",
                is_featured: rating === 5
              });

            if (!insertError) {
              insertedCount++;
            }
          }

          return new Response(
            JSON.stringify({ success: true, synced: insertedCount }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
