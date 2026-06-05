-- Seed admin user for Qoşa Qala
DO $$
DECLARE
  admin_id uuid;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'admin@qosaqala.az';
  IF existing_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'admin@qosaqala.az', crypt('Admin123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false,
      '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, jsonb_build_object('sub', admin_id::text, 'email', 'admin@qosaqala.az'), 'email', admin_id::text, now(), now(), now());
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (existing_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;