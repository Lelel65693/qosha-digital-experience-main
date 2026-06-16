import { createFileRoute, redirect } from "@tanstack/react-router";

// QR Code system has been removed. Redirect to admin dashboard.
export const Route = createFileRoute("/admin/tables")({
  beforeLoad: () => {
    throw redirect({ to: "/admin", replace: true });
  },
  component: () => null,
});
