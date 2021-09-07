-- Table: public.PaymentsCleanupJob

-- DROP TABLE public."PaymentsCleanupJob";

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
