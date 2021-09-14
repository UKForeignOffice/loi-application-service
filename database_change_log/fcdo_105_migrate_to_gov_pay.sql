CREATE TABLE public."PaymentsCleanupJob"
(
    id integer NOT NULL,
    lock boolean NOT NULL DEFAULT false,
    CONSTRAINT id_pkey PRIMARY KEY (id)
)
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE public."PaymentsCleanupJob"
    OWNER to postgres;

INSERT INTO public."PaymentsCleanupJob" (id, lock) VALUES (1, false);

CREATE TABLE public."AdditionalPaymentDetails"
(
    application_id text COLLATE pg_catalog."default" NOT NULL,
    payment_reference text COLLATE pg_catalog."default",
    payment_amount numeric(10,2) NOT NULL DEFAULT 0.00,
    payment_status text COLLATE pg_catalog."default",
    payment_complete boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT ('now'::text)::timestamp with time zone,
    updated_at timestamp with time zone DEFAULT ('now'::text)::timestamp with time zone,
    submitted text COLLATE pg_catalog."default",
    submission_attempts integer DEFAULT 0,
    casebook_response_code text COLLATE pg_catalog."default",
    CONSTRAINT "application_id_pk" PRIMARY KEY (application_id)
)
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE public."AdditionalPaymentDetails"
    OWNER to postgres;
