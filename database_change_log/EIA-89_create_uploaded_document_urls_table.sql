-- Run against FCO-LOI-Service

CREATE TABLE public."UploadedDocumentUrls" (
    id SERIAL,
    application_id integer,
    user_id integer,
    uploaded_url text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);
