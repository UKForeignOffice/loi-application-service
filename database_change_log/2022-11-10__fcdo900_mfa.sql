ALTER TABLE public."Users" ADD COLUMN "oneTimePasscodeExpiry" timestamp without time zone default now();
ALTER TABLE public."Users" ADD COLUMN "oneTimePasscodeAttempts" integer default 0;
ALTER TABLE public."Users" ADD COLUMN "mfaPreference" text default 'Email';

CREATE TABLE IF NOT EXISTS public."OneTimePasscodes"
(
  user_id integer NOT NULL,
  passcode text COLLATE pg_catalog."default",
  passcode_expiry timestamp without time zone
)
  WITH (
    OIDS = FALSE
    )
  TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."OneTimePasscodes"
  OWNER to fco_user;

CREATE FUNCTION delete_old_rows() RETURNS trigger
  LANGUAGE plpgsql
    AS $$
BEGIN
DELETE FROM "OneTimePasscodes" WHERE passcode_expiry < CURRENT_TIMESTAMP - INTERVAL '30 minutes';
RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_delete_old_rows
  AFTER INSERT ON "OneTimePasscodes"
  EXECUTE PROCEDURE delete_old_rows();
