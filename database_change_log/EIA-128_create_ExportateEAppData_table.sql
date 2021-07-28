-- Run against FCO-LOI-Service fco_service

CREATE TABLE public."ExportedEAppData"
(
    id integer DEFAULT nextval('exported_data'::regclass),
    application_id integer,
    "applicationType" text COLLATE pg_catalog."default",
    first_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    telephone character varying(25) COLLATE pg_catalog."default",
    mobile_number character varying(25) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    doc_count integer,
    user_ref text COLLATE pg_catalog."default",
    payment_reference text COLLATE pg_catalog."default",
    payment_amount numeric,
    feedback_consent boolean,
    unique_app_id text COLLATE pg_catalog."default",
    user_id integer,
    company_name text COLLATE pg_catalog."default",
    "createdAt" date,
    "updatedAt" date
)

TABLESPACE pg_default;

ALTER TABLE public."ExportedEAppData"
    OWNER to postgres;