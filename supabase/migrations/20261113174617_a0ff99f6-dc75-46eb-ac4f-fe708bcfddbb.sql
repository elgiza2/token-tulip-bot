CREATE TABLE public.notm_users (
  id bigint PRIMARY KEY,
  username text, first_name text, photo_url text,
  balance numeric NOT NULL DEFAULT 0,
  ads_watched int NOT NULL DEFAULT 0,
  referrer_id bigint, ref_count int NOT NULL DEFAULT 0,
  paid_gram boolean NOT NULL DEFAULT false,
  joined_community boolean NOT NULL DEFAULT false,
  mining_started_at timestamptz,
  last_checkin date, last_game_at timestamptz,
  blocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.notm_user_servers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id bigint NOT NULL REFERENCES public.notm_users(id) ON DELETE CASCADE, server_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_tasks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, kind text NOT NULL DEFAULT 'link', url text, target int NOT NULL DEFAULT 1, reward numeric NOT NULL DEFAULT 1, active boolean NOT NULL DEFAULT true, sort int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_task_done (user_id bigint NOT NULL REFERENCES public.notm_users(id) ON DELETE CASCADE, task_id uuid NOT NULL REFERENCES public.notm_tasks(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (user_id, task_id));
CREATE TABLE public.notm_payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id bigint NOT NULL REFERENCES public.notm_users(id) ON DELETE CASCADE, purpose text NOT NULL, amount_ton numeric NOT NULL, memo text NOT NULL UNIQUE, status text NOT NULL DEFAULT 'pending', tx_hash text UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_withdrawals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id bigint NOT NULL REFERENCES public.notm_users(id) ON DELETE CASCADE, amount numeric NOT NULL, wallet text NOT NULL, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_gifts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id bigint NOT NULL REFERENCES public.notm_users(id) ON DELETE CASCADE, amount numeric NOT NULL, claimed boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_task_managers (username text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.notm_settings (key text PRIMARY KEY, value text NOT NULL);

DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['notm_users','notm_user_servers','notm_tasks','notm_task_done','notm_payments','notm_withdrawals','notm_gifts','notm_task_managers','notm_settings'] LOOP
  EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
END LOOP; END $$;

INSERT INTO public.notm_settings(key,value) VALUES ('cron_key', encode(extensions.gen_random_bytes(24),'hex')), ('community','');

INSERT INTO public.notm_tasks(title,kind,url,target,reward,sort) VALUES
('Daily check-in','checkin',NULL,1,0.5,0),
('Watch 5 ads','ads',NULL,5,1,1),
('Watch 10 ads','ads',NULL,10,2.5,2),
('Watch 25 ads','ads',NULL,25,6,3),
('Watch 50 ads','ads',NULL,50,14,4),
('Invite 1 friend','referral',NULL,1,3,5),
('Invite 3 friends','referral',NULL,3,10,6),
('Invite 5 friends','referral',NULL,5,18,7),
('Invite 10 friends','referral',NULL,10,40,8),
('Invite 25 friends','referral',NULL,25,120,9),
('Follow Notcoin on Telegram','link','https://t.me/notcoin',1,1,10);

CREATE INDEX ON public.notm_users(referrer_id);
CREATE INDEX ON public.notm_user_servers(user_id);