-- Run against FCO-LOI-Service

CREATE TABLE public."UploadedDocumentUrls" (
    id serial,
    application_id integer,
    uploaded_url text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);
