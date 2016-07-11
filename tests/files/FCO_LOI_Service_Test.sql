--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.1
-- Dumped by pg_dump version 9.4.1
-- Started on 2016-03-29 17:12:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 2180 (class 1262 OID 99052)
-- Name: FCO-LOI-Service-Test; Type: DATABASE; Schema: -; Owner: postgres
--
select pg_terminate_backend(pid) from pg_stat_activity where datname='FCO-LOI-Service-Test';

DROP DATABASE IF EXISTS "FCO-LOI-Service-Test";


CREATE DATABASE "FCO-LOI-Service-Test" WITH TEMPLATE = template0;


ALTER DATABASE "FCO-LOI-Service-Test" OWNER TO postgres;

\connect "FCO-LOI-Service-Test"

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2181 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 205 (class 3079 OID 11855)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2183 (class 0 OID 0)
-- Dependencies: 205
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 218 (class 1255 OID 99053)
-- Name: dashboard_data(integer, integer, integer, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

--
-- TOC entry 172 (class 1259 OID 99056)
-- Name: useradditionalapplicationinfo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE useradditionalapplicationinfo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE useradditionalapplicationinfo_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 173 (class 1259 OID 99058)
-- Name: AdditionalApplicationInfo; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "AdditionalApplicationInfo" (
    special_instructions text,
    user_ref text,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('useradditionalapplicationinfo_seq'::regclass) NOT NULL
);


ALTER TABLE "AdditionalApplicationInfo" OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 99065)
-- Name: AddressDetails; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "AddressDetails" (
    application_id integer,
    full_name text,
    postcode text,
    house_name text,
    street text,
    town text,
    county text,
    country text,
    type text,
    "updatedAt" timestamp without time zone,
    "createdAt" timestamp without time zone,
    id integer
);


ALTER TABLE "AddressDetails" OWNER TO postgres;

--
-- TOC entry 2184 (class 0 OID 0)
-- Dependencies: 174
-- Name: TABLE "AddressDetails"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE "AddressDetails" IS 'Temp';


--
-- TOC entry 175 (class 1259 OID 99071)
-- Name: Application; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "Application" (
    application_id integer NOT NULL,
    submitted text,
    "createdAt" date,
    "updatedAt" date,
    "serviceType" integer,
    unique_app_id text,
    feedback_consent boolean,
    application_reference text,
    case_reference text,
    user_id integer,
    application_guid text,
    application_start_date timestamp with time zone DEFAULT ('now'::text)::timestamp with time zone
);


ALTER TABLE "Application" OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 99078)
-- Name: userdocumentcount_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE userdocumentcount_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userdocumentcount_seq OWNER TO postgres;

--
-- TOC entry 177 (class 1259 OID 99080)
-- Name: ApplicationPaymentDetails; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "ApplicationPaymentDetails" (
    application_id integer NOT NULL,
    payment_complete boolean DEFAULT false NOT NULL,
    payment_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_reference text,
    id integer DEFAULT nextval('userdocumentcount_seq'::regclass) NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    payment_status text,
    oneclick_reference text
);


ALTER TABLE "ApplicationPaymentDetails" OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 99089)
-- Name: ApplicationReference; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "ApplicationReference" (
    "lastUsedID" integer,
    "createdAt" date,
    "updatedAt" date,
    id integer
);


ALTER TABLE "ApplicationReference" OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 99092)
-- Name: applicationtype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE applicationtype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE applicationtype_seq OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 99094)
-- Name: ApplicationTypes; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "ApplicationTypes" (
    "applicationType" text,
    id integer DEFAULT nextval('applicationtype_seq'::regclass) NOT NULL,
    casebook_description text
);


ALTER TABLE "ApplicationTypes" OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 99101)
-- Name: doc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE doc_id_seq OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 99103)
-- Name: AvailableDocuments; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "AvailableDocuments" (
    doc_id integer DEFAULT nextval('doc_id_seq'::regclass) NOT NULL,
    "updatedAt" date,
    "createdAt" date,
    html_id text,
    certification_notes text,
    delete_additional_notes text,
    legislation_allowed boolean,
    photocopy_allowed boolean,
    certification_required boolean,
    doc_type_id text,
    doc_title text,
    doc_title_start text,
    doc_title_mid text,
    additional_detail text,
    eligible_check_option_1 text,
    eligible_check_option_2 text,
    eligible_check_option_3 text,
    legalisation_clause text,
    kind_of_document text,
    extra_title_text text,
    synonyms text,
    accept_text text
);


ALTER TABLE "AvailableDocuments" OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 99110)
-- Name: DocumentTypes; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "DocumentTypes" (
    doc_type text,
    doc_type_title text,
    doc_type_id integer,
    "updatedAt" date,
    "createdAt" date
);


ALTER TABLE "DocumentTypes" OWNER TO postgres;

--
-- TOC entry 2185 (class 0 OID 0)
-- Dependencies: 183
-- Name: COLUMN "DocumentTypes".doc_type_title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "DocumentTypes".doc_type_title IS '
';


--
-- TOC entry 2186 (class 0 OID 0)
-- Dependencies: 183
-- Name: COLUMN "DocumentTypes".doc_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "DocumentTypes".doc_type_id IS '
';


--
-- TOC entry 184 (class 1259 OID 99116)
-- Name: exported_data; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE exported_data
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE exported_data OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 99118)
-- Name: ExportedApplicationData; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "ExportedApplicationData" (
    application_id integer,
    "applicationType" text,
    first_name character varying(255),
    last_name character varying(255),
    telephone character varying(25),
    email character varying(255),
    doc_count integer,
    special_instructions text,
    user_ref text,
    postage_return_title text,
    postage_return_price numeric,
    postage_send_title text,
    postage_send_price numeric,
    main_house_name text,
    main_street text,
    main_town text,
    main_county text,
    main_country text,
    main_full_name text,
    alt_house_name text,
    alt_street text,
    alt_town text,
    alt_county text,
    alt_country text,
    alt_full_name text,
    feedback_consent boolean,
    total_docs_count_price numeric,
    unique_app_id text,
    id integer DEFAULT nextval('exported_data'::regclass),
    "createdAt" date,
    "updatedAt" date,
    payment_reference text,
    payment_amount numeric,
    "submittedJSON" json,
    main_postcode text,
    alt_postcode text
);


ALTER TABLE "ExportedApplicationData" OWNER TO postgres;

--
-- TOC entry 2187 (class 0 OID 0)
-- Dependencies: 185
-- Name: COLUMN "ExportedApplicationData".telephone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "ExportedApplicationData".telephone IS '
';


--
-- TOC entry 186 (class 1259 OID 99125)
-- Name: postagesavailable_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE postagesavailable_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE postagesavailable_seq OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 99127)
-- Name: PostagesAvailable; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "PostagesAvailable" (
    title text,
    price numeric,
    type text,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('postagesavailable_seq'::regclass) NOT NULL,
    casebook_description text,
    pretty_title text
);


ALTER TABLE "PostagesAvailable" OWNER TO postgres;

--
-- TOC entry 2188 (class 0 OID 0)
-- Dependencies: 187
-- Name: COLUMN "PostagesAvailable".type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "PostagesAvailable".type IS 'for sending or receiving';


--
-- TOC entry 188 (class 1259 OID 99134)
-- Name: SubmissionAttempts; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "SubmissionAttempts" (
    submission_id integer NOT NULL,
    application_id integer NOT NULL,
    retry_number integer NOT NULL,
    "timestamp" timestamp with time zone,
    submitted_json json,
    status text,
    response_status_code text,
    response_body text,
    "createdAt" date,
    "updatedAt" date
);


ALTER TABLE "SubmissionAttempts" OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 99140)
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "SubmissionAttempts_submission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "SubmissionAttempts_submission_id_seq" OWNER TO postgres;

--
-- TOC entry 2189 (class 0 OID 0)
-- Dependencies: 189
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "SubmissionAttempts_submission_id_seq" OWNED BY "SubmissionAttempts".submission_id;


--
-- TOC entry 190 (class 1259 OID 99142)
-- Name: UserDetails; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "UserDetails" (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    telephone character varying(25),
    email character varying(255),
    "createdAt" text,
    "updatedAt" text,
    application_id integer,
    has_email text
);


ALTER TABLE "UserDetails" OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 99148)
-- Name: UserDocumentCount; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "UserDocumentCount" (
    doc_count integer,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('userdocumentcount_seq'::regclass) NOT NULL,
    price integer
);


ALTER TABLE "UserDocumentCount" OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 99152)
-- Name: UserDocuments; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "UserDocuments" (
    application_id integer NOT NULL,
    doc_id integer,
    user_doc_id integer NOT NULL,
    "updatedAt" date,
    "createdAt" date,
    certified boolean,
    this_doc_count integer
);


ALTER TABLE "UserDocuments" OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 99155)
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "UserDocuments_application_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "UserDocuments_application_id_seq" OWNER TO postgres;

--
-- TOC entry 2190 (class 0 OID 0)
-- Dependencies: 193
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "UserDocuments_application_id_seq" OWNED BY "UserDocuments".application_id;


--
-- TOC entry 194 (class 1259 OID 99157)
-- Name: userpostagedetails_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE userpostagedetails_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userpostagedetails_seq OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 99159)
-- Name: UserPostageDetails; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE "UserPostageDetails" (
    postage_available_id integer,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('userpostagedetails_seq'::regclass) NOT NULL
);


ALTER TABLE "UserPostageDetails" OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 99163)
-- Name: application_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE application_application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE application_application_id_seq OWNER TO postgres;

--
-- TOC entry 2191 (class 0 OID 0)
-- Dependencies: 196
-- Name: application_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE application_application_id_seq OWNED BY "Application".application_id;


--
-- TOC entry 197 (class 1259 OID 99165)
-- Name: application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE application_id_seq OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 99167)
-- Name: applicationpaymentdetails_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE applicationpaymentdetails_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE applicationpaymentdetails_seq OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 99169)
-- Name: country; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE country (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "in_EU" boolean DEFAULT false,
    casebook_mapping text
);


ALTER TABLE country OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 99176)
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE country_id_seq OWNER TO postgres;

--
-- TOC entry 2192 (class 0 OID 0)
-- Dependencies: 200
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE country_id_seq OWNED BY country.id;


--
-- TOC entry 201 (class 1259 OID 99178)
-- Name: postages_available_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE postages_available_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE postages_available_seq OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 99180)
-- Name: userdocuments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE userdocuments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userdocuments_id_seq OWNER TO postgres;

--
-- TOC entry 2193 (class 0 OID 0)
-- Dependencies: 202
-- Name: userdocuments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE userdocuments_id_seq OWNED BY "UserDocuments".user_doc_id;


--
-- TOC entry 203 (class 1259 OID 99182)
-- Name: vw_ApplicationPrice; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW "vw_ApplicationPrice" AS
 SELECT udc.application_id,
    udc.price AS documents_price,
    upd.postage_available_id AS selected_postage_method,
    pa.price AS selected_postage_price,
    ((udc.price)::numeric + pa.price) AS total_price
   FROM (("UserDocumentCount" udc
     JOIN "UserPostageDetails" upd ON ((udc.application_id = upd.application_id)))
     JOIN "PostagesAvailable" pa ON (((upd.postage_available_id = pa.id) AND (pa.type = 'return'::text))));


ALTER TABLE "vw_ApplicationPrice" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 99187)
-- Name: yourdetails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE yourdetails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE yourdetails_id_seq OWNER TO postgres;

--
-- TOC entry 2194 (class 0 OID 0)
-- Dependencies: 204
-- Name: yourdetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE yourdetails_id_seq OWNED BY "UserDetails".id;


--
-- TOC entry 1992 (class 2604 OID 99189)
-- Name: application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Application" ALTER COLUMN application_id SET DEFAULT nextval('application_application_id_seq'::regclass);


--
-- TOC entry 2000 (class 2604 OID 99190)
-- Name: submission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "SubmissionAttempts" ALTER COLUMN submission_id SET DEFAULT nextval('"SubmissionAttempts_submission_id_seq"'::regclass);


--
-- TOC entry 2001 (class 2604 OID 99191)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "UserDetails" ALTER COLUMN id SET DEFAULT nextval('yourdetails_id_seq'::regclass);


--
-- TOC entry 2003 (class 2604 OID 99192)
-- Name: user_doc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "UserDocuments" ALTER COLUMN user_doc_id SET DEFAULT nextval('userdocuments_id_seq'::regclass);


--
-- TOC entry 2006 (class 2604 OID 99193)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY country ALTER COLUMN id SET DEFAULT nextval('country_id_seq'::regclass);


--
-- TOC entry 2145 (class 0 OID 99058)
-- Dependencies: 173
-- Data for Name: AdditionalApplicationInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "AdditionalApplicationInfo" (special_instructions, user_ref, application_id, "createdAt", "updatedAt", id) VALUES (NULL, '', 3798, '2016-03-03', '2016-03-03', 1537);
INSERT INTO "AdditionalApplicationInfo" (special_instructions, user_ref, application_id, "createdAt", "updatedAt", id) VALUES (NULL, '123456', 8072, '2016-03-23', '2016-03-23', 3775);
INSERT INTO "AdditionalApplicationInfo" (special_instructions, user_ref, application_id, "createdAt", "updatedAt", id) VALUES (NULL, '', 7887, '2016-03-23', '2016-03-23', 3689);
INSERT INTO "AdditionalApplicationInfo" (special_instructions, user_ref, application_id, "createdAt", "updatedAt", id) VALUES (NULL, 'Test 6', 7888, '2016-03-23', '2016-03-23', 3690);


--
-- TOC entry 2146 (class 0 OID 99065)
-- Dependencies: 174
-- Data for Name: AddressDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "AddressDetails" (application_id, full_name, postcode, house_name, street, town, county, country, type, "updatedAt", "createdAt", id) VALUES (8072, 'Mark Barlow', 'N14 6LS', '78', 'Oakfield Road', 'London', '', 'United Kingdom', 'main', '2016-03-23 18:22:47.83', '2016-03-23 18:22:47.83', NULL);
INSERT INTO "AddressDetails" (application_id, full_name, postcode, house_name, street, town, county, country, type, "updatedAt", "createdAt", id) VALUES (3798, 'LAura Bustaffa', 'W12 8JL', '8', 'Coverdale Road', 'LONDON', '', 'United Kingdom', 'main', '2016-03-03 16:29:30.46', '2016-03-03 16:29:30.46', NULL);


--
-- TOC entry 2147 (class 0 OID 99071)
-- Dependencies: 175
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "Application" (application_id, submitted, "createdAt", "updatedAt", "serviceType", unique_app_id, feedback_consent, application_reference, case_reference, user_id, application_guid, application_start_date) VALUES (8072, 'draft', '2016-03-23', '2016-03-29', 1, 'A-C-16-0323-4347-4460', true, NULL, NULL, 63, '7452fd1aa1bfa268875c4f864852dab8e1d07751', '2016-03-23 18:22:41.087045+00');
INSERT INTO "Application" (application_id, submitted, "createdAt", "updatedAt", "serviceType", unique_app_id, feedback_consent, application_reference, case_reference, user_id, application_guid, application_start_date) VALUES (3798, 'submitted', '2016-03-03', '2016-03-03', 1, 'A-C-16-0303-1303-D4EE', false, 'A-C-16-0303-1303-D4EE', 'LEG-10103', 109, '794f8e48cabb9f728669e3b6af2703f423ace4a1', '2016-03-03 16:28:39.886379+00');
INSERT INTO "Application" (application_id, submitted, "createdAt", "updatedAt", "serviceType", unique_app_id, feedback_consent, application_reference, case_reference, user_id, application_guid, application_start_date) VALUES (7887, 'draft', '2016-03-23', '2016-03-23', 2, 'A-A-16-0323-4162-31BD', true, NULL, NULL, 64, NULL, '2016-03-23 13:51:42.669191+00');
INSERT INTO "Application" (application_id, submitted, "createdAt", "updatedAt", "serviceType", unique_app_id, feedback_consent, application_reference, case_reference, user_id, application_guid, application_start_date) VALUES (7888, 'submitted', '2016-03-23', '2016-03-23', 2, 'A-A-16-0323-4163-8B9B', true, 'A-A-16-0323-4163-8B9B', 'LEG-10714', 64, NULL, '2016-03-23 13:51:58.421127+00');


--
-- TOC entry 2149 (class 0 OID 99080)
-- Dependencies: 177
-- Data for Name: ApplicationPaymentDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "ApplicationPaymentDetails" (application_id, payment_complete, payment_amount, payment_reference, id, "createdAt", "updatedAt", payment_status, oneclick_reference) VALUES (7887, false, 300.00, NULL, 6969, '2016-03-23', '2016-03-23', NULL, 'FCO-LOI-REF-38');
INSERT INTO "ApplicationPaymentDetails" (application_id, payment_complete, payment_amount, payment_reference, id, "createdAt", "updatedAt", payment_status, oneclick_reference) VALUES (7888, true, 300.00, '8514587411791352', 6971, '2016-03-23', '2016-03-23', 'AUTHORISED', 'FCO-LOI-REF-38');
INSERT INTO "ApplicationPaymentDetails" (application_id, payment_complete, payment_amount, payment_reference, id, "createdAt", "updatedAt", payment_status, oneclick_reference) VALUES (7888, true, 300.00, '8514587411791352', 6972, '2016-03-23', '2016-03-23', 'AUTHORISED', 'FCO-LOI-REF-38');
INSERT INTO "ApplicationPaymentDetails" (application_id, payment_complete, payment_amount, payment_reference, id, "createdAt", "updatedAt", payment_status, oneclick_reference) VALUES (3798, true, 90.00, '8814570226237412', 2616, '2016-03-03', '2016-03-03', 'AUTHORISED', 'FCO-LOI-REF-83');


--
-- TOC entry 2150 (class 0 OID 99089)
-- Dependencies: 178
-- Data for Name: ApplicationReference; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "ApplicationReference" ("lastUsedID", "createdAt", "updatedAt", id) VALUES (4389, NULL, '2016-03-29', NULL);


--
-- TOC entry 2152 (class 0 OID 99094)
-- Dependencies: 180
-- Data for Name: ApplicationTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "ApplicationTypes" ("applicationType", id, casebook_description) VALUES ('Standard', 1, 'Postal Service');
INSERT INTO "ApplicationTypes" ("applicationType", id, casebook_description) VALUES ('Premium', 2, 'Premium Service');
INSERT INTO "ApplicationTypes" ("applicationType", id, casebook_description) VALUES ('Drop-off', 3, 'MK Drop Off Service');


--
-- TOC entry 2154 (class 0 OID 99103)
-- Dependencies: 182
-- Data for Name: AvailableDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (201, NULL, NULL, 'birth-certificate', NULL, NULL, true, false, false, '5', 'Birth Certificate (UK)', 'Birth certificate (UK)', 'birth certificate (UK)', 'signed by a Registrar, or a certified copy issued by the General Register Office (GRO)', NULL, NULL, NULL, 'can be legalised', 'Certificate (UK)', NULL, 'personal,identity,id,identification,birth certificate', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (259, NULL, NULL, 'utility-bill', NULL, NULL, true, true, true, '2,17', 'Utility Bill ', 'Utility bill', 'utility bill', NULL, NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'personal,identity,id,financial,finances,finance,identification,utility bill', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (212, NULL, NULL, 'county-court-document', NULL, NULL, true, true, true, '6', 'County Court Document', 'County Court document', 'County Court document', NULL, 'Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document stamped or sealed by the court, or signed by an official of the court ', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  ', 'can be legalised', 'Document', NULL, 'legal,county court document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (213, NULL, NULL, 'court-document', NULL, NULL, true, true, true, '6', 'Court Document', 'Court document', 'court document', NULL, 'Your original court document not stamped sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document stamped or sealed by the court, or signed by an official of the court ', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Document', NULL, 'legal,court document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (223, NULL, NULL, 'department-of-health-document', NULL, NULL, true, true, true, '8', 'Department of Health Document', 'Department of Health  (DH) document', 'Department of Health  (DH) document', '', 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Document', NULL, 'health,government,medical,department of health document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (230, NULL, NULL, 'family-division-of-the-high-court-of-justice-document', NULL, NULL, true, true, true, '6', 'Family Division of the High Court of Justice Document', 'Family Division of the High Court of Justice document', 'Family Division of the High Court of Justice document', NULL, 'Your original court document, not stamped, sealed or signed by a court or an official of the court <span>certification required</span>', 'Your original court document, stamped or sealed by the court, or signed by an official of the court', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  ', 'can be legalised', 'Document', NULL, 'legal,family division of the high court of justice document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (235, NULL, NULL, 'high-court-of-justice-document', NULL, NULL, true, true, true, '6', 'High Court of Justice Document', 'High Court of Justice document', 'High Court of Justice document', NULL, 'Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document, stamped or sealed by the court, or signed by an official of the court ', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span> ', 'can be legalised', 'Document', NULL, 'legal,high court of justice document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (242, NULL, NULL, 'letter-of-no-trace', NULL, NULL, true, false, false, '4', 'Letter of No Trace ', 'Letter of no trace', 'letter of no trace', NULL, 'An original *replaceme* signed by a Registrar, or a certified copy issued by the General Registry Office (GRO)', NULL, NULL, 'can be legalised', NULL, NULL, 'marriage,legal,letter of no trace', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (209, NULL, NULL, 'companies-house-document', NULL, NULL, true, true, true, '1,3', 'Companies House Document', 'Companies House document', 'Companies House document', NULL, 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>', 'Your original *replaceme* signed by an official of Companies House', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Document', NULL, 'business,company,companies house document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (236, NULL, NULL, 'hm-revenue-and-customs-document', NULL, NULL, true, true, true, '8', 'HM Revenue and Customs Document', 'HM Revenue and Customs (HMRC) document', 'HM Revenue and Customs (HMRC) document', '', 'Your original *replaceme* not signed by an official of the issuing authority', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme* ', 'can be legalised', 'Document', NULL, 'government,business,finance,finances,financial,hm revenue and customs document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (214, NULL, NULL, 'court-of-bancruptcy-document', NULL, NULL, true, true, true, '6', 'Court of Bankruptcy Document', 'Court of Bankruptcy document', 'Court of Bankruptcy document', NULL, 'Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document stamped or sealed by the court, or signed by an official of the court ', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>   ', 'can be legalised', 'Document', NULL, 'legal,financial,business,finance,finances,court of bankruptcy document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (229, NULL, NULL, 'export-certificate', NULL, NULL, true, true, true, '1', 'Export Certificate', 'Export certificate', 'export certificate', NULL, 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Certificate', NULL, 'business,export certificate', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (231, NULL, NULL, 'fingerprints-document', NULL, NULL, true, false, true, '9', 'Fingerprints Document', 'Fingerprints document', 'fingerprints document', NULL, 'Your original document, issued by the police, signed by an official of the police authority', 'Your original document, issued by a private institution <span>certification required</span>', NULL, 'can be legalised', 'Document', NULL, 'personal,identification,id,criminal,identity,fingerprints document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (243, NULL, NULL, 'marriage-certificate-gro', NULL, NULL, true, false, false, '5', 'Marriage Certificate (UK issued by GRO)', 'Marriage certificate, UK, issued by the General Register Office (GRO)', 'marriage certificate', NULL, 'An original *replaceme* signed by a Registrar, or a certified copy issued by the General Registry Office (GRO)', NULL, NULL, 'can be legalised', 'Certificate', '(UK issued by GRO)', 'marriage,personal,identity,id,identification,marriage certificate', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (258, NULL, NULL, 'translation', NULL, NULL, true, true, true, '14', 'Translation ', 'Translation', 'translation', NULL, 'Your original *replaceme* signed and dated by a UK solicitor or notary', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', NULL, NULL, 'personal,translation', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (253, NULL, NULL, 'religious-document', NULL, NULL, true, true, true, '13', 'Religious Document', 'Religious document', 'religious document', NULL, NULL, NULL, NULL, 'can be legalised', 'Document', NULL, 'personal,religious,religious document', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (247, NULL, NULL, 'passport', NULL, NULL, false, true, true, '4,11', 'Passport ', 'Passport', 'passport', NULL, 'A copy of your *replaceme* certified, signed and dated by a UK solicitor or notary ', NULL, NULL, 'can be legalised', NULL, NULL, 'personal,identity,id,identification,passport', 'We can only legalise a certified copy of your *replaceme*. We cannot legalise the original document. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (206, NULL, NULL, 'certificate-of-no-impediment', NULL, NULL, true, false, false, '4', 'Certificate of No Impediment ', 'Certificate of no impediment', 'certificate of no impediment', '', 'An original *replaceme* signed by a Registrar, or a certified copy issued by the General Register Office (GRO)', NULL, NULL, 'can be legalised', NULL, NULL, 'marriage,divorce,personal,certificate of no impediment,divorce document', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (207, NULL, NULL, 'change-of-name-deed', NULL, NULL, true, true, true, '3', 'Change of Name Deed ', 'Change of name deed', 'change of name deed', NULL, 'A photocopy of your <span>certification required</span>  *replaceme* ', 'An original *replaceme* signed and dated by a UK solicitor or notary.', NULL, 'can be legalised', NULL, NULL, 'personal,identity,id,identification,change of name deed', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (238, NULL, NULL, 'last-will-and-testament', NULL, NULL, true, true, true, '3', 'Last Will and Testament ', 'Last will and testament', 'last will and testament', NULL, 'Your original *replaceme* witnessed in the UK by a solicitor or notary ', 'A copy of your *replaceme* certified in the UK by a solicitor or notary <span>certification required</span>', 'A copy of your *replaceme* which has been deposited with the relevant court and containing an original signature or seal', 'can be legalised', NULL, NULL, 'death,personal,last will and testament', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (219, NULL, NULL, 'decree-absolute', NULL, NULL, true, true, true, '6', 'Decree Absolute ', 'Decree absolute', 'decree absolute', NULL, 'Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>', 'Your original court document stamped sealed or signed by a court or an official of the court ', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  ', 'can be legalised', NULL, NULL, 'marriage,legal,decree absolute,divorce', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (215, NULL, NULL, 'cremation-certificate', NULL, NULL, true, true, true, '2', 'Cremation Certificate', 'Cremation certificate', 'cremation certificate', NULL, 'Your original document signed by an official of the local council where the cremation took place', 'Your original document issued by a private crematorium <span>certification required</span>', NULL, 'can be legalised', 'Certificate', NULL, 'death,cremation certificate', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (218, NULL, NULL, 'death-certificate', NULL, NULL, true, false, false, '5', 'Death Certificate', 'Death certificate', 'death certificate', NULL, 'An original *replaceme* signed by a registrar, or a certified copy issued by the General Register Office (GRO)', NULL, NULL, 'can be legalised', 'Certificate', NULL, 'death,death certificate', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (244, NULL, NULL, 'marriage-certificate-other', NULL, NULL, true, true, true, '13', 'Marriage Certificate (UK issued by someone other than GRO)', 'Marriage certificate, UK, not issued by the General Register Office (GRO)', 'marriage certificate', NULL, 'Your original *replaceme* <span>certification required</span>', 'A photocopy <span>certification required</span> of your *replaceme*  ', NULL, 'can be legalised', 'Certificate', '(UK issued by someone other than GRO)', 'marriage,personal,identity,id,identification,marriage gro issued certificate', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (228, NULL, NULL, 'educational-certificate-uk', NULL, NULL, true, true, true, '7', 'Educational Certificate (UK)', 'Educational certificate (UK)', 'educational certificate (UK)', NULL, NULL, NULL, NULL, 'can be legalised if it has been awarded by an accredited institution in the UK', 'Certificate', '(UK)', 'education,qualifications,educational certificate', 'We accept the document in the following formats.  Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (221, NULL, NULL, 'degree-certificate-uk', NULL, NULL, true, true, true, '7', 'Degree Certificate or Transcript (UK)', 'Degree certificate or transcript (UK)', 'degree certificate or transcript (UK)', NULL, NULL, NULL, NULL, 'can be legalised if it has been awarded by a <a target="_blank" href="https://www.gov.uk/check-a-university-is-officially-recognised">recognised body</a>', NULL, '(UK)', 'education,qualifications,degree certificate or transcript', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (237, NULL, NULL, 'home-office-document', NULL, NULL, true, true, true, '8', 'Home Office Document', 'Home Office (HO) document', 'Home Office (HO) document', NULL, 'Your original *replaceme* not signed by an official of the issuing authority', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme* ', 'can be legalised', 'Document', NULL, 'government,home office document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (204, NULL, NULL, 'certificate-of-memorandum', NULL, NULL, true, true, true, '1,3', 'Certificate of Memorandum ', 'Certificate of memorandum', 'certificate of memorandum', NULL, 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>', 'Your original *replaceme* signed by an official of Companies House', 'A photocopy <span>certification required</span> of your *replaceme*    ', 'can be legalised', NULL, NULL, 'business,company,legal,certificate of memorandum', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (227, NULL, NULL, 'driving-license', NULL, NULL, false, true, true, '15, 4', 'Driving Licence ', 'Driving licence', 'driving licence', NULL, 'A copy of your *replaceme*, certified, signed and dated by a UK solicitor or notary <span>certification required</span> ', NULL, NULL, 'can be legalised', NULL, NULL, 'personal,identification,id,identity,driving licence', 'We can only legalise a certified copy of your *replaceme*. We cannot legalise the original document.');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (234, NULL, NULL, 'grant-of-probate', NULL, NULL, true, true, true, '6', 'Grant of Probate ', 'Grant of probate', 'grant of probate', NULL, 'Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document, stamped or sealed by the court, or signed by an official of the court ', 'A photocopy <span>certification required</span> of your court document<span>*replaceme*</span> ', 'can be legalised', '', NULL, 'legal,death,personal,grant of probate', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (246, NULL, NULL, 'medical-test-results', NULL, NULL, true, true, true, '10', 'Medical Test Results ', 'Medical test results', 'medical test results', NULL, 'Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, ', issued in the UK, can be legalised
', NULL, '(UK)', 'medical,health,medical test results', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (197, NULL, NULL, 'affidavit', NULL, NULL, true, true, true, '3', 'Affidavit ', 'Affidavit', 'affidavit', NULL, 'A photocopy of your *replaceme* <span>certification required</span>', 'Your original *replaceme* signed and dated by a UK solicitor or notary', NULL, 'can be legalised', NULL, NULL, 'Personal,Legal,Criminal,affidavit', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (198, NULL, NULL, 'articles-of-association', NULL, NULL, true, true, true, '1', 'Articles of Association ', 'Articles of association', 'articles of association', NULL, 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span> ', 'Your original *replaceme* signed by an official of Companies House', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', NULL, NULL, 'business,articles of association', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (202, NULL, NULL, 'certificate-of-freesale', NULL, NULL, true, true, true, '1,3', 'Certificate of Freesale ', 'Certificate of freesale', 'certificate of freesale', NULL, 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', NULL, NULL, 'business,company,legal,certificate of freesale', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (249, NULL, NULL, 'police-disclosure-document', NULL, NULL, true, false, true, '9', 'Police Disclosure Document', 'Police disclosure document', 'police disclosure document', '', 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', NULL, 'can be legalised', 'Document', NULL, 'police,legal,criminal,police disclosure document', 'We accept the *replaceme* in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (233, NULL, NULL, 'government-issued-document', NULL, NULL, true, true, true, '8', 'Government Issued Document', 'Government issued document', 'government issued document', NULL, 'Your original *replaceme* not signed by an official from the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official from the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Document', NULL, 'government,government issued document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (250, NULL, NULL, 'power-of-attorney', NULL, NULL, true, true, true, '3', 'Power of Attorney ', 'Power of attorney', 'power of attorney', NULL, 'Your original *replaceme* signed and dated by a UK solicitor or notary', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', NULL, NULL, 'legal,personal,death,power of attorney', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (216, NULL, NULL, 'criminal-records-bureau-crb-document', NULL, NULL, true, false, true, '9', 'Criminal Records Bureau (CRB) Document', 'Criminal Records Bureau (CRB) document ', 'Criminal Records Bureau (CRB) document ', NULL, 'Your original *replaceme* signed by an official of the issuing authority', 'Your original *replaceme* without a signature from an official of the issuing authority <span>certification required</span>', NULL, 'can be legalised', 'Document', ' (CRB)', 'legal,police,criminal records bureau document', 'We accept the *replaceme* in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (222, NULL, NULL, 'department-of-business-innovation-and-skills-bis', NULL, NULL, true, true, true, '1,3', 'Department of Business, Innovation and Skills (BIS) Document', 'Department of Business, Innovation and Skills (BIS) document', 'Department of Business, Innovation and Skills (BIS) document', '', 'Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', 'Document', '(BIS)', 'business,government,department of business, innovation and skills document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (241, NULL, NULL, 'letter-of-invitation', NULL, NULL, true, true, true, '2', 'Letter of Invitation (to live in UK)', 'Letter of invitation (to live in UK)', 'letter of invitation (to live in UK)', NULL, NULL, NULL, NULL, 'can be legalised', NULL, ' (to live in UK)', 'immigration,personal,letter of invitation', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (232, NULL, NULL, 'fit-note', NULL, NULL, true, true, true, '10', 'Fit Note ', 'Fit note', 'fit note', NULL, 'Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, ', issued in the UK, can be legalised', NULL, '(UK)', 'medical,health,fit note', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (240, NULL, NULL, 'letter-of-enrolment', NULL, NULL, true, true, true, '2,16', 'Letter of Enrolment ', 'Letter of enrolment', 'letter of enrolment', NULL, NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'education,letter of enrolment', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (211, NULL, NULL, 'coroners-report', NULL, NULL, true, true, true, '6', 'Coroner''s Report ', 'Coroner''s report', 'coroner''s report', NULL, 'Your original *replaceme* signed by a named coroner in the UK', 'A photocopy <span>certification required</span> of your *replaceme*  ', NULL, 'can be legalised', NULL, NULL, 'medical,death,coroners report', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (220, NULL, NULL, 'decree-nisi', NULL, NULL, true, true, true, '6', 'Decree Nisi ', 'Decree nisi', 'decree nisi', NULL, 'Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>', 'Your original court document stamped, sealed or signed by a court or an official of the court ', 'A photocopy <span>certification required</span> of your court document<span>*replaceme*</span>  ', 'can be legalised', NULL, NULL, 'marriage,legal,decree nisi,divorce', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (260, NULL, NULL, 'vet-document', NULL, NULL, true, true, true, '12', 'Veterinary Document', 'Veterinary document', 'veterinary document', NULL, 'Your original *replaceme* signed by a vet. The vet must be registerd with the <a href="https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs" target="_blank">Department of Food and Rural Affairs</a>', 'A photocopy <span>certification required</span>of your *replaceme*', NULL, 'can be legalised', 'Document', '(UK)', 'animals,pets,veterinary document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (255, NULL, NULL, 'sheriff-court-document', NULL, NULL, true, true, true, '6', 'Sheriff Court Document', 'Sheriff Court document', 'Sheriff Court document', NULL, 'Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>', 'Your original court document stamped, sealed or signed by a court, or an official of the court', 'A photocopy <span>certification required</span> of your court document <span>*replaceme*</span> ', 'can be legalised', 'Document', NULL, 'legal,sheriff court document', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (196, NULL, NULL, 'acro-police-certificate', NULL, NULL, true, false, true, '9', 'ACRO Police Certificate', 'ACRO police certificate', 'ACRO police certificate', NULL, 'Your original *replaceme* signed by an official of the issuing authority.', 'Your original *replaceme* without a signature from an official of the issuing authority. <span>certification required</span>', NULL, 'can be legalised', 'Certificate', NULL, 'Personal,Legal,Criminal,acro police certificate', 'We accept the *replaceme* in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (200, NULL, NULL, 'baptism-certificate', NULL, NULL, true, true, true, '13', 'Baptism Certificate', 'Baptism certificate', 'baptism certificate', NULL, NULL, NULL, NULL, 'can be legalised', 'Certificate', NULL, 'personal,identity,id,religious,birth,identification,baptism certificate', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (252, NULL, NULL, 'reference-from-an-employer', NULL, NULL, true, true, true, '2,16', 'Reference from an Employer ', 'Reference from an employer', 'reference from an employer', NULL, NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'employment,reference from an employer', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (205, NULL, NULL, 'certificate-of-naturalisation', NULL, NULL, true, true, true, '4', 'Certificate of Naturalisation ', 'Certificate of naturalisation', 'certificate of naturalisation', NULL, NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'identity,personal,certificate of naturalisation', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (203, NULL, NULL, 'certificate-of-incorporation', NULL, NULL, true, true, true, '1,3', 'Certificate of Incorporation ', 'Certificate of incorporation', 'certificate of incorporation', NULL, 'Your original *replaceme* not signed by an official of Companies House <span>certification required</span>', 'Your original *replaceme* signed by an official of Companies House', 'A photocopy <span>certification required</span> of your *replaceme*  ', 'can be legalised', NULL, NULL, 'business,company,legal,certificate of incorporation', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (256, NULL, NULL, 'sick-note', NULL, NULL, true, true, true, '10', 'Sick Note ', 'Sick note', 'sick note', NULL, 'Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', NULL, '(UK)', 'medical,health,sick note', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (257, NULL, NULL, 'statutory-declaration', NULL, NULL, true, true, true, '3', 'Statutory Declaration ', 'Statutory declaration', 'statutory declaration', NULL, 'Your original *replaceme* signed and dated by a UK solicitor or notary', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', NULL, NULL, 'legal,statutory declaration', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (245, NULL, NULL, 'medical-report', NULL, NULL, true, true, true, '10', 'Medical Report ', 'Medical report', 'medical report', NULL, 'Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, ', issued in the UK, can be legalised
', NULL, '(UK)', 'medical,health,medical report', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (199, NULL, NULL, 'bank-statement', NULL, NULL, true, true, true, '2,17', 'Bank Statement ', 'Bank statement', 'bank statement', '', NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'personal,financial,finance,identity,finances,id,money,identification,bank statement', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (217, NULL, NULL, 'criminal-records-check', NULL, NULL, true, false, true, '9', 'Criminal Records Check ', 'Criminal records check', 'criminal records check', NULL, 'Your original *replaceme* signed by an official of the issuing authority', 'Your original *replaceme* without a signature from an official of the issuing authority <span>certification required</span>', NULL, 'can be legalised', NULL, NULL, 'legal,police,criminal records check', 'We accept the *replaceme* in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (239, NULL, NULL, 'letter-from-an-employer', NULL, NULL, true, true, true, '2,16', 'Letter from an Employer ', 'Letter from an employer', 'letter from an employer', NULL, NULL, NULL, NULL, 'can be legalised', NULL, NULL, 'employment,personal,letter from an employer', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (254, NULL, NULL, 'school-document', NULL, NULL, true, true, true, '7', 'School Document', 'School document', 'school document', NULL, 'Your original *replaceme* signed and dated by a UK solicitor or notary', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', 'Document', NULL, 'education,school document', 'We will accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (210, NULL, NULL, 'conversion-of-civil-partnership', NULL, NULL, true, false, false, '5', 'Conversion of Civil Partnership to Marriage Certificate', 'Conversion of civil partnership to marriage certificate', 'conversion of civil partnership to marriage certificate', 'signed by a Registrar, or a certified copy issued by the General Register Office (GRO)', NULL, NULL, NULL, 'can be legalised', 'Certificate', NULL, 'marriage,personal,conversion of civil partnership to marriage certificate', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (225, NULL, NULL, 'disclosure-scotland-document', NULL, NULL, true, false, true, '9', 'Disclosure Scotland Document', 'Disclosure Scotland document', 'Disclosure Scotland document', '', 'Your original *replaceme* without a signature from an official of the iussuing authority <span>certification required</span>', 'Your original *replaceme* signed by an official of the issuing authority', NULL, 'can be legalised', 'Document', NULL, 'criminal,legal,disclosure scotland document', 'We accept the *replaceme* in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (224, NULL, NULL, 'diploma', NULL, NULL, true, true, true, '7', 'Diploma ', 'Diploma', 'diploma', NULL, NULL, NULL, NULL, 'can be legalised if it has been awarded by an institution that is accredited by:
 <ul>
 <li>UK Border Agency</li>
 <li>Scottish Wualigications Authority</li>
 <li>OfQual</li>
 <li>British Accreditation Council</li>
 <li>Open and Distance Learning Quality Council</li>
 <li>Association of Brish Language Schools</li>
 <li>Sport England</li>
 </ul>', NULL, NULL, 'education,qualifications,diploma', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (208, NULL, NULL, 'civil-partnership-certificate', NULL, NULL, true, false, false, '5', 'Civil Partnership Certificate', 'Civil partnership certificate', 'civil partnership certificate', NULL, 'An original *replaceme* signed by a registrar, or a certified copy issued by the General Register Office (GRO)', NULL, NULL, 'can be legalised', 'Certificate', NULL, 'marriage,personal,civil partnership certificate', 'We can only accept the document in the following format. Please confirm that you will send us:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (251, NULL, NULL, 'professional-qualification', NULL, NULL, true, true, true, '7', 'Professional Qualification Certificate', 'Professional qualification certificate', 'professional qualification certificate', NULL, NULL, NULL, NULL, 'can be legalised if it has been awarded by a <a target="_blank" href="https://www.gov.uk/check-a-university-is-officially-recognised">recognised body</a>', 'Certificate', '(UK) (e.g. issued by Royal Chartered Body such as Institute of Architects)', 'education,qualifications,professional certificate', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (248, NULL, NULL, 'Pet-export-document-from-defra', NULL, NULL, true, true, true, '12', 'Pet Export Document from the Department of Environment, Food and Rural Affairs (DEFRA)', 'Pet export document from the Department of Environment, Food and Rural Affairs (DEFRA)', 'pet export document', NULL, 'Your original *replaceme* signed by the named vet. The vet must be registered with <a href="https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs" target="_blank">DEFRA</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', 'from the Department of Environment. Food and Rural Affairs', '(DEFRA)', 'pets,government,pet export document from the department of environment, food and rural affairs', 'We accept the document in the following formats. Please confirm which one you will send:');
INSERT INTO "AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text) VALUES (226, NULL, NULL, 'doctors-medical', NULL, NULL, true, true, true, '10', 'Doctor''s Letter ', 'Doctor''s letter ', 'doctor''s letter ', NULL, 'Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>', 'A photocopy <span>certification required</span> of your *replaceme* ', NULL, 'can be legalised', NULL, NULL, 'medical,health,doctor''s letter', 'We accept the document in the following formats. Please confirm which one you will send.');


--
-- TOC entry 2155 (class 0 OID 99110)
-- Dependencies: 183
-- Data for Name: DocumentTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('personal', 'Personal Documents', 2, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('legal', 'Legal Documents', 3, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('identity', 'Identity Documents', 4, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('general', 'GRO (General Registry Office)', 5, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('court', 'Court Documents', 6, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('education', 'Educational Documents', 7, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('government', 'Government Department Documents', 8, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('police', 'Police Documents', 9, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('medical', 'Medical Documents', 10, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('passport', 'Passport', 11, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('pet', 'Pet Export', 12, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('religious', 'Religious Document', 13, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('translation', 'Translation', 14, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('driving', 'Driving Licence', 15, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('employment', 'Employment Document', 16, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('financial', 'Financial Document', 17, NULL, NULL);
INSERT INTO "DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") VALUES ('business', 'Business Documents', 1, NULL, NULL);


--
-- TOC entry 2157 (class 0 OID 99118)
-- Dependencies: 185
-- Data for Name: ExportedApplicationData; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode) VALUES (3798, 'Postal Service', 'LAura', 'Bustaffa', '07676894056', 'laura+fco@whatusersdo.com', 3, NULL, '', 'Pre-paid Envelope', 0.00, 'I will post my documents from the UK', 0.00, '8', 'Coverdale Road', 'LONDON', '', 'United Kingdom', 'LAura Bustaffa', NULL, NULL, NULL, NULL, NULL, NULL, false, 90, 'A-C-16-0303-1303-D4EE', 195, NULL, NULL, '8814570226237412', 90.00, NULL, 'W12 8JL', NULL);
INSERT INTO "ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode) VALUES (7888, 'Premium Service', 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', 4, NULL, 'Test 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 300, 'A-A-16-0323-4163-8B9B', 435, NULL, NULL, '8514587411791352', 300.00, NULL, NULL, NULL);
INSERT INTO "ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode) VALUES (7888, 'Premium Service', 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', 4, NULL, 'Test 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 300, 'A-A-16-0323-4163-8B9B', 436, NULL, NULL, '8514587411791352', 300.00, NULL, NULL, NULL);
INSERT INTO "ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode) VALUES (7888, 'Premium Service', 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', 4, NULL, 'Test 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 300, 'A-A-16-0323-4163-8B9B', 434, NULL, NULL, '8514587411791352', 300.00, NULL, NULL, NULL);
INSERT INTO "ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode) VALUES (7888, 'Premium Service', 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', 4, NULL, 'Test 6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 300, 'A-A-16-0323-4163-8B9B', 437, NULL, NULL, '8514587411791352', 300.00, NULL, NULL, NULL);


--
-- TOC entry 2159 (class 0 OID 99127)
-- Dependencies: 187
-- Data for Name: PostagesAvailable; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('I will post my documents from the UK', 0.00, 'send', NULL, NULL, 4, NULL, NULL);
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('I will use a courier to send my documents from the UK', 0.00, 'send', NULL, NULL, 5, NULL, NULL);
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('I am overseas and will post or courier my documents to the UK', 0.00, 'send', NULL, NULL, 6, NULL, NULL);
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('Courier delivery (including to British Forces Post Office)', 5.50, 'return', NULL, NULL, 8, 'Standard Royal Mail', 'UK courier delivery');
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('Pre-paid stamped, addressed, A4-sized envelope', 0.00, 'return', NULL, NULL, 7, 'Pre-paid Envelope', 'pre-paid envelope');
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('European Courier', 14.50, 'return', NULL, NULL, 9, 'European Courier', 'European courier');
INSERT INTO "PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title) VALUES ('International Courier', 25.00, 'return', NULL, NULL, 10, 'International Courier', 'international courier');


--
-- TOC entry 2160 (class 0 OID 99134)
-- Dependencies: 188
-- Data for Name: SubmissionAttempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "SubmissionAttempts" (submission_id, application_id, retry_number, "timestamp", submitted_json, status, response_status_code, response_body, "createdAt", "updatedAt") VALUES (189, 3798, 0, NULL, '{"legalisationApplication":{"userId":"legalisation","caseType":"Postal Service","timestamp":"1457022618849","applicant":{"forenames":"LAura","surname":"Bustaffa","primaryTelephone":"07676894056","mobileTelephone":"","eveningTelephone":"","email":"laura+fco@whatusersdo.com"},"fields":{"applicationReference":"A-C-16-0303-1303-D4EE","postalType":"Pre-paid Envelope","documentCount":3,"paymentReference":"8814570226237412","paymentAmount":90,"customerInternalReference":"","feedbackConsent":false,"companyName":"","companyRegistrationNumber":"","portalCustomerId":"","successfulReturnDetails":{"fullName":"LAura Bustaffa","address":{"companyName":"","flatNumber":"","premises":"","houseNumber":"8","street":"Coverdale Road","district":"","town":"LONDON","region":" ","postcode":"W12 8JL","country":"United Kingdom"}},"unsuccessfulReturnDetails":{"fullName":"LAura Bustaffa","address":{"companyName":"","flatNumber":"","premises":"","houseNumber":"8","street":"Coverdale Road","district":"","town":"LONDON","region":"","postcode":"W12 8JL","country":"United Kingdom"}},"additionalInformation":""}}}', 'submitted', '200', '{"applicationReference":"A-C-16-0303-1303-D4EE","caseReference":"LEG-10103"}', '2016-03-03', '2016-03-03');
INSERT INTO "SubmissionAttempts" (submission_id, application_id, retry_number, "timestamp", submitted_json, status, response_status_code, response_body, "createdAt", "updatedAt") VALUES (477, 7888, 0, NULL, '{"legalisationApplication":{"userId":"legalisation","caseType":"Premium Service","timestamp":"1458741153302","applicant":{"forenames":"Melanie","surname":"Bird","primaryTelephone":"0478419789","mobileTelephone":"","eveningTelephone":"","email":"melanie.bird@informed.com"},"fields":{"applicationReference":"A-A-16-0323-4163-8B9B","postalType":null,"documentCount":4,"paymentReference":"8514587411791352","paymentAmount":300,"customerInternalReference":"Test 6","feedbackConsent":true,"companyName":"","companyRegistrationNumber":"","portalCustomerId":"","additionalInformation":""}}}', 'submitted', '200', '{"applicationReference":"A-A-16-0323-4163-8B9B","caseReference":"LEG-10714"}', '2016-03-23', '2016-03-23');


CREATE FUNCTION dashboard_data(_user_id integer, _limit integer, _offset integer, _orderby text, _direction text, query_string text) RETURNS TABLE("createdDate" date, unique_app_id text, applicationtype text, doc_count integer, payment_amount numeric, user_ref text, result_count integer)
    LANGUAGE plpgsql
    AS $_$
  declare	result_count integer;
BEGIN

select count(*) into result_count
	from "Application" app inner join
	"ExportedApplicationData" ead
	on app.application_id = ead.application_id
	inner join
	"ApplicationTypes" ats
	on app."serviceType" = ats.id
	where app.user_id=_user_id

	and (
		(ead.unique_app_id ilike query_string)
	or
		(ead.user_ref ilike query_string)
	or
		(ats."applicationType" ilike query_string)
	);


  RETURN QUERY EXECUTE '
	select
	app."createdAt" as "createdDate",
	ead.unique_app_id,
	ats."applicationType",
	ead.doc_count,
	ead.payment_amount,
	ead.user_ref, '
	|| result_count || ' as result_count
	from "Application" app inner join
	"ExportedApplicationData" ead
	on app.application_id = ead.application_id
	inner join
	"ApplicationTypes" ats
	on app."serviceType" = ats.id
	where app.user_id=$1
	and (
		(ead.unique_app_id ilike ' || quote_literal(query_string)  || ')
	or
		(ats."applicationType" ilike ' || quote_literal(query_string)  || ')
	or
		(ead.user_ref ilike ' || quote_literal(query_string)  || ')
	)
	order by ' ||  _orderby || ' ' || _direction || '
	LIMIT $2 OFFSET $3'
USING _user_id, _limit, _offset;
END;
$_$;


ALTER FUNCTION public.dashboard_data(_user_id integer, _limit integer, _offset integer, _orderby text, _direction text, query_string text) OWNER TO postgres;

--
-- TOC entry 219 (class 1255 OID 99054)
-- Name: find_documents(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION find_documents(_keywords text) RETURNS TABLE(doc_id integer, doc_title text, doc_title_start text, doc_title_mid text, kind_of_document text)
    LANGUAGE sql COST 1000
    AS $$
SELECT doc_id, doc_title, doc_title_start, doc_title_mid, kind_of_document
FROM "AvailableDocuments"
WHERE doc_title ilike '%' || _keywords || '%'
OR synonyms ilike '%' || _keywords || '%'
ORDER BY doc_title;$$;


ALTER FUNCTION public.find_documents(_keywords text) OWNER TO postgres;

--
-- TOC entry 220 (class 1255 OID 99055)
-- Name: populate_exportedapplicationdata(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION populate_exportedapplicationdata(_application_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
                rows_affected integer;
BEGIN
WITH rows AS (
    INSERT INTO "ExportedApplicationData" (
                    application_id,
                    "applicationType",
                    first_name,
                    last_name,
                    telephone,
                    email,
                    doc_count,
                    user_ref,
                    payment_reference,
                    payment_amount,
                    postage_return_title,
                    postage_return_price,
                    postage_send_title,
                    postage_send_price,
                    main_full_name,
                    main_house_name,
                    main_street,
                    main_town,
                    main_county,
                    main_country,
                    main_postcode,
                    alt_full_name,
                    alt_house_name,
                    alt_street,
                    alt_town,
                    alt_county,
                    alt_country,
                    alt_postcode,
                    total_docs_count_price,
                    feedback_consent,
                    unique_app_id
    )
    select app.application_id,
                aty."casebook_description" as "applicationType",
                ud.first_name,
                ud.last_name,
                ud.telephone,
                ud.email,
        udc.doc_count,
        aai.user_ref,
        pymt.payment_reference,
        pymt.payment_amount,
        (select pa.casebook_description as postage_return_title from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='return' and upd.application_id=_application_id),
        (select pa.price as postage_return_price  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='return' and upd.application_id=_application_id),
        (select pa.title as postage_send_title  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id),
        (select pa.price as postage_send_price from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id),
        (select full_name AS main_full_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select house_name AS main_house_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select street AS main_street from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select town AS main_town from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select county AS main_county from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select country AS main_country from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select postcode AS main_postcode from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select full_name AS alt_full_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select house_name AS alt_house_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select street AS alt_street from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select town AS alt_town from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select county AS alt_county from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select country AS alt_country from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select postcode AS alt_postcode from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select price AS total_doc_count_price from "UserDocumentCount" where application_id=_application_id),
        (select feedback_consent AS feedback_consent from "Application" where application_id=_application_id),
        (select unique_app_id AS unique_app_id from "Application" where application_id=_application_id)
        from "Application" app
        join "ApplicationTypes" aty on aty.id=app."serviceType"
        join "UserDetails" ud on ud.application_id=app.application_id
        join "UserDocumentCount" udc on udc.application_id=app.application_id
        join "AdditionalApplicationInfo" aai on aai.application_id=app.application_id
        join "ApplicationPaymentDetails" pymt on aai.application_id=pymt.application_id
        where app.application_id=_application_id
        and not exists(select * from "ExportedApplicationData" where application_id = _application_id)

        RETURNING 1
)

SELECT count(*) into rows_affected FROM Rows;
RETURN rows_affected;
END;
$$;


ALTER FUNCTION public.populate_exportedapplicationdata(_application_id integer) OWNER TO postgres;

--
-- TOC entry 2195 (class 0 OID 0)
-- Dependencies: 189
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"SubmissionAttempts_submission_id_seq"', 509, true);


--
-- TOC entry 2162 (class 0 OID 99142)
-- Dependencies: 190
-- Data for Name: UserDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email) VALUES (5436, 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', '2016-03-23 13:51:50.950 +00:00', '2016-03-23 13:51:50.950 +00:00', 7887, 'true');
INSERT INTO "UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email) VALUES (5437, 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', '2016-03-23 13:52:09.601 +00:00', '2016-03-23 13:52:09.601 +00:00', 7888, 'true');
INSERT INTO "UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email) VALUES (5438, 'Melanie', 'Bird', '0478419789', 'melanie.bird@informed.com', '2016-03-23 13:52:14.027 +00:00', '2016-03-23 13:52:14.027 +00:00', 7888, 'true');
INSERT INTO "UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email) VALUES (5588, 'Mark', 'Barlow', '079058479339', 'mark.barlow@digital.fco.gov.uk', '2016-03-23 18:22:45.086 +00:00', '2016-03-23 18:22:45.086 +00:00', 8072, 'true');
INSERT INTO "UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email) VALUES (2782, 'LAura', 'Bustaffa', '07676894056', 'laura+fco@whatusersdo.com', '2016-03-03 16:29:17.243 +00:00', '2016-03-03 16:29:17.243 +00:00', 3798, NULL);


--
-- TOC entry 2163 (class 0 OID 99148)
-- Dependencies: 191
-- Data for Name: UserDocumentCount; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "UserDocumentCount" (doc_count, application_id, "createdAt", "updatedAt", id, price) VALUES (4, 7887, '2016-03-23', '2016-03-23', 6968, 300);
INSERT INTO "UserDocumentCount" (doc_count, application_id, "createdAt", "updatedAt", id, price) VALUES (4, 7888, '2016-03-23', '2016-03-23', 6970, 300);
INSERT INTO "UserDocumentCount" (doc_count, application_id, "createdAt", "updatedAt", id, price) VALUES (3, 3798, '2016-03-03', '2016-03-03', 2615, 90);
INSERT INTO "UserDocumentCount" (doc_count, application_id, "createdAt", "updatedAt", id, price) VALUES (2, 8072, '2016-03-23', '2016-03-23', 7161, 60);


--
-- TOC entry 2164 (class 0 OID 99152)
-- Dependencies: 192
-- Data for Name: UserDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7434, 220, 2492, '2016-03-14', '2016-03-14', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 227, 2765, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 231, 2769, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 233, 2771, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 239, 2777, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 213, 2577, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 219, 2582, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 242, 2587, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7454, 206, 2542, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7454, 249, 2541, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7455, 244, 2555, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7461, 208, 2597, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7461, 220, 2598, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 245, 2783, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 249, 2787, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 255, 2793, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 260, 2798, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 215, 2659, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7503, 236, 2802, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7506, 196, 2824, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7510, 236, 2833, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 206, 2713, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 197, 2725, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7169, 223, 2158, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7169, 253, 2159, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7169, 231, 2160, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 201, 2729, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 205, 2733, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7517, 201, 2847, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 209, 2746, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 215, 2751, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 221, 2757, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 225, 2761, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7175, 228, 2172, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7175, 202, 2173, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7175, 221, 2174, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 203, 2857, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 229, 2861, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 213, 2867, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 255, 2873, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 230, 2879, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7522, 206, 2886, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7529, 204, 2963, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 201, 2996, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 217, 3001, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 197, 3008, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 205, 3013, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 233, 3018, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 241, 3023, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 255, 3029, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7549, 201, 3035, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7597, 206, 3044, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7609, 247, 3054, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7609, 212, 3055, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7609, 213, 3056, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 205, 3065, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 211, 3070, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7663, 257, 3082, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7663, 201, 3083, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7679, 228, 3102, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7186, 221, 2211, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7708, 201, 3118, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7708, 247, 3119, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7708, 227, 3120, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7715, 251, 3142, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7732, 201, 3170, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7750, 200, 3182, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7750, 197, 3181, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7752, 234, 3191, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7761, 197, 3200, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7773, 247, 3209, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7793, 201, 3216, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7808, 251, 3224, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7194, 247, 2234, '2016-03-08', '2016-03-08', false, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7808, 234, 3225, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7228, 203, 2306, '2016-03-09', '2016-03-09', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7808, 226, 3226, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7228, 209, 2307, '2016-03-09', '2016-03-09', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7229, 201, 2308, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7844, 226, 3233, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7929, 201, 3241, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8036, 196, 3260, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8050, 199, 3271, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7235, 203, 2310, '2016-03-09', '2016-03-09', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7235, 209, 2311, '2016-03-09', '2016-03-09', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7238, 236, 2312, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7244, 221, 2313, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8054, 227, 3284, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8062, 199, 3294, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8073, 201, 3306, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8080, 207, 3327, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8080, 256, 3328, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8090, 201, 3335, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8098, 201, 3349, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 251, 2331, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 201, 2332, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 253, 2333, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 257, 2334, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 206, 2335, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 247, 2336, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 245, 2337, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 250, 2338, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 256, 2339, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 197, 2340, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 202, 2341, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 203, 2342, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 204, 2343, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 220, 2344, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 227, 2345, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 232, 2346, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 246, 2347, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 244, 2348, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 249, 2349, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 210, 2350, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 254, 2351, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 198, 2352, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 228, 2353, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 215, 2354, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 218, 2355, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 225, 2356, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 229, 2357, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 231, 2358, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 208, 2361, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 223, 2366, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 214, 2372, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 199, 2376, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 224, 2380, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 259, 2385, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 242, 2390, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 211, 2395, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7274, 221, 2400, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7297, 203, 2409, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7309, 235, 2421, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 217, 2434, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 222, 2439, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7370, 221, 2461, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7403, 200, 2468, '2016-03-11', '2016-03-11', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7417, 247, 2475, '2016-03-12', '2016-03-12', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 228, 2766, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 229, 2767, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 225, 2578, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 230, 2584, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 249, 2588, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7461, 242, 2599, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7441, 210, 2514, '2016-03-14', '2016-03-14', true, 4);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7447, 247, 2522, '2016-03-14', '2016-03-14', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7447, 221, 2523, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7447, 255, 2524, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 232, 2770, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 235, 2773, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 238, 2776, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 243, 2781, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 248, 2786, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7455, 242, 2556, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 253, 2791, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 254, 2660, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 258, 2796, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8074, 210, 3307, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8074, 244, 3309, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7506, 212, 2825, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 198, 2726, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 200, 2728, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 202, 2730, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 204, 2732, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7511, 203, 2834, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 212, 2748, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 217, 2753, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 223, 2759, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7517, 249, 2846, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 204, 2858, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 196, 2864, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 219, 2870, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 249, 2875, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7522, 202, 2887, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 248, 2895, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 196, 2896, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 197, 2897, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 198, 2898, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 200, 2900, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 205, 2905, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 207, 2907, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 211, 2911, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 213, 2913, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 218, 2918, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 222, 2922, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 228, 2928, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 234, 2934, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 240, 2940, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 245, 2945, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 252, 2951, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 257, 2956, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7532, 234, 2964, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7532, 251, 2965, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 198, 2995, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 220, 3003, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 224, 3006, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 206, 3012, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 209, 3017, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 240, 3022, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 258, 3027, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 243, 3032, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7553, 247, 3036, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7597, 221, 3045, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7609, 255, 3057, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 206, 3066, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 212, 3071, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7668, 257, 3084, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7677, 247, 3093, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7678, 227, 3094, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7699, 247, 3111, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7699, 227, 3112, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7715, 224, 3143, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7720, 201, 3154, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7731, 201, 3162, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7734, 203, 3171, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7734, 249, 3172, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7761, 196, 3201, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7781, 201, 3210, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7795, 202, 3217, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7820, 224, 3227, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7844, 251, 3234, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7930, 201, 3242, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8038, 212, 3261, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8050, 207, 3272, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8061, 209, 3285, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8066, 247, 3295, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8078, 207, 3319, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8087, 201, 3329, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8091, 206, 3336, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8098, 247, 3350, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8104, 209, 3374, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8108, 201, 3382, '2016-03-29', '2016-03-29', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 243, 2359, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 213, 2364, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 236, 2369, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 222, 2374, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 221, 2379, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 252, 2384, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 226, 2389, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 238, 2394, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 236, 2774, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 241, 2779, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7278, 221, 2402, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7298, 236, 2410, '2016-03-10', '2016-03-10', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7309, 255, 2424, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 218, 2435, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7371, 201, 2462, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 216, 2579, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 220, 2583, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7419, 247, 2476, '2016-03-12', '2016-03-12', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 250, 2589, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7438, 221, 2497, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7461, 248, 2600, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 247, 2785, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 252, 2790, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 257, 2795, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7504, 201, 2806, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7504, 206, 2807, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 257, 2835, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 206, 2836, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7468, 196, 2662, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 196, 2673, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 204, 2674, '2016-03-15', '2016-03-15', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 212, 2675, '2016-03-15', '2016-03-15', false, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 198, 2678, '2016-03-15', '2016-03-15', false, 8);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 216, 2681, '2016-03-15', '2016-03-15', false, 4);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 213, 2684, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 209, 2837, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 212, 2840, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7485, 201, 2734, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 213, 2749, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 218, 2754, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 222, 2758, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 209, 2859, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 197, 2865, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 220, 2871, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 242, 2876, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7523, 196, 2888, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 199, 2899, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 202, 2902, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 209, 2909, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 216, 2916, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 220, 2920, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 226, 2926, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 231, 2931, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 236, 2936, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 241, 2941, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 247, 2947, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 254, 2953, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 259, 2958, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 214, 2998, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 202, 2999, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 230, 3004, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 218, 3009, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 203, 3014, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 219, 3019, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 242, 3024, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 259, 3028, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7569, 203, 3037, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7569, 209, 3038, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7598, 221, 3046, '2016-03-17', '2016-03-17', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7610, 221, 3058, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7676, 201, 3095, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7681, 247, 3104, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7681, 227, 3105, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7699, 228, 3113, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7709, 201, 3122, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7709, 227, 3123, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7713, 201, 3144, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7716, 213, 3147, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7731, 206, 3163, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7756, 212, 3193, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7782, 206, 3211, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7796, 206, 3218, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7844, 234, 3235, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7942, 201, 3243, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 249, 3252, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 208, 3253, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 206, 3254, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 200, 3255, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8038, 213, 3262, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8074, 243, 3308, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8079, 201, 3320, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8092, 201, 3337, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8098, 227, 3351, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8109, 199, 3383, '2016-03-29', '2016-03-29', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8109, 227, 3384, '2016-03-29', '2016-03-29', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 196, 2360, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 216, 2365, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 260, 2371, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 233, 2375, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 239, 2381, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 237, 2387, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 200, 2391, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7291, 203, 2403, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 237, 2775, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7460, 213, 2592, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 242, 2780, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 246, 2784, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 251, 2789, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 214, 2453, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 219, 2457, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7375, 203, 2463, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 256, 2794, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7505, 212, 2808, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7432, 210, 2477, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7432, 244, 2478, '2016-03-14', '2016-03-14', true, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7432, 206, 2479, '2016-03-14', '2016-03-14', true, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7432, 208, 2480, '2016-03-14', '2016-03-14', true, 4);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7505, 213, 2809, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7441, 220, 2517, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7448, 213, 2527, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7507, 203, 2828, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7468, 212, 2663, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 206, 2676, '2016-03-15', '2016-03-15', false, 4);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 215, 2682, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 201, 2685, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7476, 206, 2690, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7476, 219, 2691, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7476, 220, 2692, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7478, 196, 2704, '2016-03-15', '2016-03-15', false, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7478, 202, 2705, '2016-03-15', '2016-03-15', false, 4);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7478, 204, 2706, '2016-03-15', '2016-03-15', false, 6);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7507, 209, 2829, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 213, 2838, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7488, 220, 2738, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 255, 2839, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 243, 2844, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7518, 221, 2849, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 222, 2860, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 214, 2863, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 212, 2866, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 217, 2869, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 250, 2874, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 235, 2877, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7524, 221, 2889, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 201, 2901, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 206, 2906, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 212, 2912, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 217, 2917, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 223, 2923, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 229, 2929, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 233, 2933, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 239, 2939, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 244, 2944, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 251, 2950, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 256, 2955, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 204, 2997, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 221, 3002, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 245, 3007, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 200, 3011, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 208, 3016, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 235, 3021, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 257, 3026, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 223, 3031, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7573, 209, 3039, '2016-03-17', '2016-03-17', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7600, 203, 3047, '2016-03-18', '2016-03-18', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7600, 209, 3048, '2016-03-18', '2016-03-18', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7611, 212, 3059, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7613, 201, 3074, '2016-03-18', '2016-03-18', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7613, 221, 3075, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7669, 221, 3086, '2016-03-20', '2016-03-20', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7682, 254, 3106, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7709, 247, 3124, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7714, 210, 3137, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7714, 221, 3140, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7713, 247, 3145, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7731, 249, 3164, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7764, 257, 3204, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7764, 224, 3205, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7784, 201, 3212, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7797, 212, 3219, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7824, 226, 3229, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7842, 201, 3236, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7943, 247, 3244, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 199, 3256, '2016-03-23', '2016-03-23', false, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8038, 255, 3263, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8051, 207, 3275, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8051, 199, 3276, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8051, 227, 3277, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8067, 207, 3300, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8067, 256, 3301, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8075, 210, 3310, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8075, 212, 3311, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8075, 257, 3312, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8088, 209, 3332, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8100, 247, 3352, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8100, 201, 3353, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8100, 227, 3354, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8103, 206, 3367, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 209, 2362, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 230, 2367, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 255, 2370, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 205, 2377, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 240, 2382, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 258, 2386, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 234, 2393, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7291, 209, 2404, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7493, 247, 2799, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7329, 206, 2427, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7508, 227, 2830, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7376, 209, 2464, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7413, 247, 2471, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 221, 2841, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 203, 2845, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7435, 249, 2487, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7435, 213, 2490, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7440, 221, 2500, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7440, 247, 2501, '2016-03-14', '2016-03-14', true, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7441, 243, 2515, '2016-03-14', '2016-03-14', true, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7525, 203, 2890, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7525, 209, 2891, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 203, 2903, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 208, 2908, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 215, 2915, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 219, 2919, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 225, 2925, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 232, 2932, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 237, 2937, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 242, 2942, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 249, 2948, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 202, 2677, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 197, 2683, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7481, 220, 2693, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7478, 257, 2707, '2016-03-15', '2016-03-15', false, 7);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 255, 2954, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 260, 2959, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 196, 2994, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 216, 3000, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 239, 3005, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 199, 3010, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 207, 3015, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 236, 3020, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 256, 3025, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7541, 222, 3030, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7573, 203, 3040, '2016-03-17', '2016-03-17', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7601, 201, 3049, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 209, 3060, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 199, 3061, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 202, 3062, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 208, 3067, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 201, 3076, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 243, 3079, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7680, 228, 3098, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7692, 201, 3107, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7702, 201, 3115, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7712, 206, 3125, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7714, 203, 3138, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7713, 227, 3146, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7716, 212, 3148, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7726, 206, 3157, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7765, 246, 3206, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7785, 201, 3213, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7804, 221, 3220, '2016-03-23', '2016-03-23', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7824, 251, 3230, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7851, 210, 3237, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7851, 203, 3238, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7943, 227, 3245, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 236, 3257, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8039, 196, 3264, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8041, 212, 3266, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8041, 255, 3268, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8052, 247, 3278, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8068, 207, 3302, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8068, 256, 3303, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8075, 254, 3313, '2016-03-23', '2016-03-23', false, 5);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8081, 201, 3322, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8088, 201, 3331, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8095, 206, 3347, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8101, 201, 3355, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8107, 228, 3378, '2016-03-28', '2016-03-28', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 212, 2363, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 235, 2368, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 248, 2373, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 217, 2378, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 241, 2383, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 219, 2388, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7248, 207, 2392, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7256, 247, 2396, '2016-03-09', '2016-03-09', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 196, 2571, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7306, 201, 2413, '2016-03-11', '2016-03-11', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7329, 210, 2428, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 197, 2572, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 202, 2573, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 208, 2451, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 217, 2455, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 221, 2458, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 212, 2576, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7414, 227, 2472, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 217, 2580, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7433, 243, 2483, '2016-03-14', '2016-03-14', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 234, 2585, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7435, 257, 2488, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 257, 2591, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7441, 206, 2516, '2016-03-14', '2016-03-14', true, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7500, 209, 2800, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7508, 201, 2831, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 210, 2842, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7519, 221, 2851, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7526, 209, 2892, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 204, 2904, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 199, 2679, '2016-03-15', '2016-03-15', false, 6);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 210, 2910, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 214, 2914, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 221, 2921, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 196, 2708, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 198, 2709, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 201, 2710, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 202, 2711, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 224, 2924, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 206, 2742, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 207, 2743, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 208, 2744, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 211, 2747, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 216, 2752, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 219, 2755, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 224, 2760, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 227, 2927, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 230, 2930, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 235, 2935, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 238, 2938, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 243, 2943, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 246, 2946, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 250, 2949, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 253, 2952, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7527, 258, 2957, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7542, 247, 3033, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7576, 257, 3041, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 203, 3063, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 207, 3068, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 257, 3077, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 210, 3080, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7670, 201, 3088, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7670, 227, 3089, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7670, 247, 3090, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7679, 201, 3099, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7679, 247, 3100, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7693, 201, 3108, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7706, 201, 3116, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7714, 201, 3139, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7727, 201, 3158, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7752, 221, 3187, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7752, 228, 3188, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7752, 251, 3190, '2016-03-22', '2016-03-22', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7757, 197, 3196, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7757, 200, 3197, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7765, 248, 3207, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7790, 201, 3214, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7807, 201, 3221, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7824, 234, 3231, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7909, 201, 3239, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7943, 201, 3246, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7968, 223, 3258, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8039, 247, 3265, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8041, 213, 3267, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8052, 196, 3279, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8062, 207, 3290, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8062, 205, 3291, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8062, 231, 3292, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8071, 207, 3304, '2016-03-23', '2016-03-23', false, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8077, 203, 3314, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8095, 201, 3346, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2483, 248, 1734, '2016-02-09', '2016-02-09', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2520, 196, 1735, '2016-02-10', '2016-02-10', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2525, 196, 1736, '2016-02-11', '2016-02-11', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2526, 196, 1737, '2016-02-11', '2016-02-11', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2527, 196, 1738, '2016-02-11', '2016-02-11', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2528, 196, 1739, '2016-02-11', '2016-02-11', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2529, 196, 1740, '2016-02-11', '2016-02-11', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2554, 197, 1741, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2554, 196, 1742, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2554, 198, 1743, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2556, 197, 1744, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2556, 196, 1745, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2556, 198, 1746, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2618, 201, 1856, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2619, 201, 1857, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2558, 201, 1750, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2558, 221, 1751, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2560, 221, 1753, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2561, 199, 1755, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2562, 199, 1756, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2608, 199, 1861, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2563, 201, 1758, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2608, 201, 1860, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2621, 199, 1862, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2566, 201, 1761, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2566, 199, 1762, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2621, 201, 1863, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2620, 201, 1858, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2620, 199, 1859, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2623, 236, 1864, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2569, 201, 1767, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2569, 199, 1768, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2570, 201, 1769, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2570, 199, 1770, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2624, 236, 1866, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2622, 236, 1867, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2625, 196, 1868, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7296, 203, 2406, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2574, 199, 1776, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2574, 201, 1777, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2576, 201, 1778, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2576, 199, 1779, '2016-02-17', '2016-02-17', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2627, 196, 1870, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7310, 247, 2414, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2628, 196, 1872, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 204, 2574, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2629, 202, 1875, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7309, 203, 2422, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 209, 2429, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 213, 2432, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2630, 236, 1879, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2631, 202, 1880, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2632, 202, 1881, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2580, 199, 1791, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2580, 201, 1792, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 220, 2437, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2633, 247, 1883, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2579, 199, 1799, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2579, 201, 1800, '2016-02-17', '2016-02-17', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2585, 196, 1801, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2585, 199, 1802, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2585, 201, 1803, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2634, 198, 1888, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2586, 199, 1808, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2587, 196, 1809, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2590, 199, 1810, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2591, 199, 1811, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2592, 196, 1812, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2593, 196, 1813, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2594, 199, 1814, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2595, 196, 1815, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2596, 196, 1816, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2637, 226, 1892, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2598, 196, 1819, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2597, 260, 1820, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2599, 196, 1821, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2600, 196, 1822, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2601, 196, 1823, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2602, 196, 1824, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2604, 196, 1826, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2603, 257, 1827, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2606, 196, 1828, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2605, 196, 1829, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2607, 196, 1830, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2607, 197, 1831, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2640, 198, 1893, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2640, 197, 1894, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2609, 196, 1835, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2640, 199, 1895, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2610, 202, 1837, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2641, 196, 1896, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2611, 196, 1840, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2612, 196, 1843, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2643, 199, 1897, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2613, 196, 1845, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2614, 196, 1846, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2643, 196, 1898, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2643, 201, 1899, '2016-02-18', '2016-02-18', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2615, 196, 1850, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2644, 196, 1901, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2616, 199, 1854, '2016-02-18', '2016-02-18', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2648, 199, 1904, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2648, 201, 1905, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2650, 221, 1906, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2652, 221, 1907, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2660, 196, 1921, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2661, 197, 1922, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2662, 198, 1923, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2658, 196, 1913, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 196, 1914, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 197, 1915, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 198, 1916, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 224, 1917, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 228, 1918, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 221, 1919, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2659, 251, 1920, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2663, 201, 1926, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2666, 203, 1927, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2667, 202, 1928, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2668, 202, 1929, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2670, 204, 1933, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2674, 205, 1935, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2675, 206, 1936, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2677, 207, 1937, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2679, 208, 1939, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2680, 208, 1940, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2683, 216, 1941, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2684, 217, 1942, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2686, 209, 1943, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2687, 212, 1944, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2688, 213, 1945, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2689, 213, 1946, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2691, 214, 1947, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2692, 218, 1948, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2693, 220, 1949, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2694, 219, 1950, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2695, 221, 1951, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2696, 201, 1952, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2697, 199, 1953, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2698, 221, 1955, '2016-02-19', '2016-02-19', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2701, 196, 1958, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2702, 196, 1959, '2016-02-22', '2016-02-22', true, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2704, 200, 1960, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2704, 201, 1961, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2705, 196, 1962, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2706, 243, 1963, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2706, 244, 1964, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2707, 248, 1965, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2708, 196, 1966, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2709, 197, 1967, '2016-02-22', '2016-02-22', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (2713, 197, 1968, '2016-02-23', '2016-02-23', false, NULL);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7271, 221, 2398, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7046, 221, 1978, '2016-03-07', '2016-03-07', true, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7296, 209, 2407, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7309, 214, 2423, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 208, 2430, '2016-03-11', '2016-03-11', false, 0);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 214, 2433, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 221, 2438, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7457, 217, 2558, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 213, 2450, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 209, 2454, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 220, 2459, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7399, 221, 2466, '2016-03-11', '2016-03-11', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7415, 236, 2473, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7457, 249, 2559, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7435, 212, 2489, '2016-03-14', '2016-03-14', true, 2);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7434, 210, 2491, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7434, 243, 2493, '2016-03-14', '2016-03-14', false, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 203, 2575, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 214, 2581, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 235, 2586, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7459, 255, 2590, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7490, 199, 2762, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7442, 201, 2518, '2016-03-14', '2016-03-14', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 226, 2764, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 230, 2768, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 234, 2772, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 240, 2778, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7455, 196, 2553, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7455, 206, 2554, '2016-03-14', '2016-03-14', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 257, 2656, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 246, 2657, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 258, 2658, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7463, 260, 2661, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7470, 196, 2668, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7471, 200, 2680, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 244, 2782, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 250, 2788, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7480, 213, 2712, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 196, 2724, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 199, 2727, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7484, 203, 2731, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 210, 2745, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 214, 2750, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7487, 220, 2756, '2016-03-15', '2016-03-15', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 254, 2792, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7491, 259, 2797, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7500, 203, 2801, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7506, 230, 2826, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7508, 247, 2832, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7516, 244, 2843, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 201, 2852, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 221, 2853, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 257, 2854, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 198, 2855, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 202, 2856, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 236, 2862, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 216, 2868, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 225, 2872, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7521, 234, 2878, '2016-03-16', '2016-03-16', true, 999);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7526, 203, 2893, '2016-03-16', '2016-03-16', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7127, 242, 2057, '2016-03-08', '2016-03-08', true, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7127, 206, 2058, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7127, 219, 2059, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7127, 220, 2060, '2016-03-08', '2016-03-08', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7529, 255, 2960, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7529, 197, 2961, '2016-03-16', '2016-03-16', true, 3);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7529, 201, 2962, '2016-03-16', '2016-03-16', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7548, 201, 3034, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7580, 201, 3042, '2016-03-17', '2016-03-17', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 204, 3064, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7612, 210, 3069, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 249, 3078, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7629, 244, 3081, '2016-03-18', '2016-03-18', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7679, 227, 3101, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7695, 248, 3109, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7707, 201, 3117, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7715, 228, 3141, '2016-03-21', '2016-03-21', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7749, 209, 3179, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7749, 249, 3180, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7752, 226, 3189, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7760, 197, 3198, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7760, 196, 3199, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7765, 245, 3208, '2016-03-22', '2016-03-22', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7792, 251, 3215, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7843, 224, 3232, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8036, 247, 3259, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8049, 201, 3269, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8049, 206, 3270, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8056, 206, 3282, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8054, 207, 3283, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8062, 259, 3293, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8071, 256, 3305, '2016-03-23', '2016-03-23', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8089, 203, 3334, '2016-03-24', '2016-03-24', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8097, 201, 3348, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8102, 201, 3359, '2016-03-25', '2016-03-25', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (8108, 213, 3381, '2016-03-29', '2016-03-29', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7272, 221, 2399, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7297, 209, 2408, '2016-03-10', '2016-03-10', true, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7490, 200, 2763, '2016-03-15', '2016-03-15', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7309, 221, 2420, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 212, 2431, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7368, 219, 2436, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 212, 2452, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 218, 2456, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7369, 222, 2460, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7400, 260, 2467, '2016-03-11', '2016-03-11', false, 1);
INSERT INTO "UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) VALUES (7416, 221, 2474, '2016-03-12', '2016-03-12', true, 1);


--
-- TOC entry 2196 (class 0 OID 0)
-- Dependencies: 193
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"UserDocuments_application_id_seq"', 1, false);


--
-- TOC entry 2167 (class 0 OID 99159)
-- Dependencies: 195
-- Data for Name: UserPostageDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "UserPostageDetails" (postage_available_id, application_id, "createdAt", "updatedAt", id) VALUES (4, 3798, '2016-03-03', '2016-03-03', 3050);
INSERT INTO "UserPostageDetails" (postage_available_id, application_id, "createdAt", "updatedAt", id) VALUES (7, 3798, '2016-03-03', '2016-03-03', 3051);
INSERT INTO "UserPostageDetails" (postage_available_id, application_id, "createdAt", "updatedAt", id) VALUES (4, 8072, '2016-03-23', '2016-03-23', 7329);
INSERT INTO "UserPostageDetails" (postage_available_id, application_id, "createdAt", "updatedAt", id) VALUES (7, 8072, '2016-03-23', '2016-03-23', 7330);


--
-- TOC entry 2197 (class 0 OID 0)
-- Dependencies: 196
-- Name: application_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('application_application_id_seq', 8113, true);


--
-- TOC entry 2198 (class 0 OID 0)
-- Dependencies: 197
-- Name: application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('application_id_seq', 52, true);


--
-- TOC entry 2199 (class 0 OID 0)
-- Dependencies: 198
-- Name: applicationpaymentdetails_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('applicationpaymentdetails_seq', 1, false);


--
-- TOC entry 2200 (class 0 OID 0)
-- Dependencies: 179
-- Name: applicationtype_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('applicationtype_seq', 3, true);


--
-- TOC entry 2171 (class 0 OID 99169)
-- Dependencies: 199
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (1, 'Afghanistan', false, 'Afghanistan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (2, 'Akrotiri', true, 'Cyprus');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (3, 'Albania', false, 'Albania');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (4, 'Algeria', false, 'Algeria');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (6, 'Angola', false, 'Angola');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (7, 'Anguilla', false, 'Anguilla');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (8, 'Antigua and Barbuda', false, 'Antigua and Barbuda');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (9, 'Argentina', false, 'Argentina');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (10, 'Armenia', false, 'Armenia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (11, 'Australia', false, 'Australia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (12, 'Austria', true, 'Austria');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (13, 'Azerbaijan', false, 'Azerbaijan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (14, 'Bahamas, The', false, 'Bahamas');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (15, 'Bahrain', false, 'Bahrain');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (16, 'Bangladesh', false, 'Bangladesh');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (17, 'Barbados', false, 'Barbados');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (18, 'Belarus', false, 'Belarus');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (19, 'Belgium', true, 'Belgium');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (20, 'Belize', false, 'Belize');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (21, 'Benin', false, 'Benin');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (22, 'Bermuda', false, 'Bermuda');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (23, 'Bhutan', false, 'Bhutan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (24, 'Bolivia', false, 'Bolivia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (25, 'Bosnia and Herzegovina', false, 'Bosnia and Herzegovina');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (26, 'Botswana', false, 'Botswana');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (27, 'Brazil', false, 'Brazil');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (29, 'British Indian Ocean Territory', false, 'British Indian Ocean Territory');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (30, 'British Virgin Islands', false, 'British Virgin Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (31, 'Brunei', false, 'Brunei');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (32, 'Bulgaria', true, 'Bulgaria');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (33, 'Burkina Faso', false, 'Burkina Faso');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (34, 'Burma', false, 'Burma');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (35, 'Burundi', false, 'Burundi');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (36, 'Cambodia', false, 'Cambodia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (37, 'Cameroon', false, 'Cameroon');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (38, 'Canada', false, 'Canada');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (39, 'Cape Verde', false, 'Cape Verde');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (40, 'Cayman Islands', false, 'Cayman Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (41, 'Central African Republic', false, 'Central African Republic');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (42, 'Chad', false, 'Chad');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (43, 'Chile', false, 'Chile');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (44, 'China', false, 'China');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (45, 'Colombia', false, 'Colombia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (46, 'Comoros', false, 'Comoros');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (48, 'Congo (Democratic Republic)', false, 'Congo, Democratic Republic');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (49, 'Costa Rica', false, 'Costa Rica');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (50, 'Croatia', true, 'Croatia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (51, 'Cuba', false, 'Cuba');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (52, 'Cyprus', true, 'Cyprus');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (53, 'Czech Republic', true, 'Czech Republic');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (54, 'Denmark', true, 'Denmark');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (55, 'Dhekelia', true, 'Cyprus');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (56, 'Djibouti', false, 'Djibouti');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (57, 'Dominica', false, 'Dominica');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (58, 'Dominican Republic', false, 'Dominican Republic');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (60, 'Ecuador', false, 'Ecuador');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (61, 'Egypt', false, 'Egypt');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (62, 'El Salvador', false, 'El Salvador');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (63, 'Equatorial Guinea', false, 'Equatorial Guinea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (64, 'Eritrea', false, 'Eritrea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (65, 'Estonia', true, 'Estonia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (66, 'Ethiopia', false, 'Ethiopia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (67, 'Falkland Islands', false, 'Falkland Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (68, 'Fiji', false, 'Fiji');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (69, 'Finland', true, 'Finland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (70, 'France', true, 'France');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (71, 'Gabon', false, 'Gabon');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (73, 'Georgia', false, 'Georgia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (74, 'Germany', true, 'Germany');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (75, 'Ghana', false, 'Ghana');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (76, 'Gibraltar', true, 'Gibraltar');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (77, 'Greece', true, 'Greece');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (78, 'Grenada', false, 'Grenada');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (79, 'Guatemala', false, 'Guatemala');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (80, 'Guinea', false, 'Guinea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (81, 'Guinea-Bissau', false, 'Guinea-Bissau');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (82, 'Guyana', false, 'Guyana');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (83, 'Haiti', false, 'Haiti');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (84, 'Honduras', false, 'Honduras');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (85, 'Hungary', true, 'Hungary');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (86, 'Iceland', false, 'Iceland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (87, 'India', false, 'India');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (88, 'Indonesia', false, 'Indonesia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (89, 'Iran', false, 'Iran');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (90, 'Iraq', false, 'Iraq');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (93, 'Ireland', true, 'Ireland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (94, 'Israel', false, 'Israel');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (95, 'Italy', true, 'Italy');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (97, 'Jamaica', false, 'Jamaica');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (98, 'Japan', false, 'Japan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (99, 'Jordan', false, 'Jordan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (100, 'Kazakhstan', false, 'Kazakhstan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (101, 'Kenya', false, 'Kenya');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (102, 'Kiribati ', false, 'Kiribati ');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (103, 'Kosovo', false, 'Kosovo');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (104, 'Kuwait', false, 'Kuwait');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (105, 'Kyrgyzstan', false, 'Kyrgyzstan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (106, 'Laos', false, 'Laos');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (107, 'Latvia', true, 'Latvia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (108, 'Lebanon', false, 'Lebanon');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (109, 'Lesotho', false, 'Lesotho');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (110, 'Liberia ', false, 'Liberia ');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (111, 'Libya', false, 'Libya');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (112, 'Liechtenstein', false, 'Liechtenstein');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (113, 'Lithuania', true, 'Lithuania');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (114, 'Luxembourg', true, 'Luxembourg');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (115, 'Macedonia', false, 'Macedonia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (116, 'Madagascar', false, 'Madagascar');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (117, 'Malawi', false, 'Malawi');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (118, 'Malaysia', false, 'Malaysia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (119, 'Maldives', false, 'Maldives');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (120, 'Mali', false, 'Mali');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (121, 'Malta', true, 'Malta');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (122, 'Marshall Islands ', false, 'Marshall Islands ');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (123, 'Mauritania', false, 'Mauritania');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (124, 'Mauritius', false, 'Mauritius');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (125, 'Mexico', false, 'Mexico');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (126, 'Micronesia', false, 'Micronesia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (127, 'Moldova', false, 'Moldova');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (128, 'Monaco', false, 'Monaco');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (129, 'Mongolia', false, 'Mongolia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (130, 'Montenegro', false, 'Montenegro');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (91, 'Montserrat', false, 'Montserrat');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (131, 'Morocco', false, 'Morocco');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (132, 'Mozambique', false, 'Mozambique');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (133, 'Namibia', false, 'Namibia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (134, 'Nauru', false, 'Nauru');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (135, 'Nepal', false, 'Nepal');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (136, 'Netherlands', true, 'Netherlands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (137, 'New Zealand', false, 'New Zealand');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (138, 'Nicaragua', false, 'Nicaragua');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (139, 'Niger', false, 'Niger');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (140, 'Nigeria', false, 'Nigeria');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (141, 'North Korea', false, 'North Korea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (142, 'Norway', false, 'Norway');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (5, 'Andorra', true, 'Andorra');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (47, 'Congo', false, 'Congo');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (96, 'Ivory Coast', false, 'CÃ´te d''Ivoire');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (59, 'East Timor', false, 'Timor-Leste');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (72, 'Gambia, The', false, 'Gambia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (143, 'Occupied Palestinian Territories', false, 'The Occupied Palestinian Territories');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (144, 'Oman', false, 'Oman');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (145, 'Pakistan', false, 'Pakistan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (149, 'Palau', false, 'Palau');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (150, 'Panama', false, 'Panama');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (151, 'Papua New Guinea', false, 'Papua New Guinea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (152, 'Paraguay', false, 'Paraguay');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (153, 'Peru', false, 'Peru');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (154, 'Philippines', false, 'Philippines');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (155, 'Pitcairn, Henderson, Ducie and Oeno Islands', false, 'Pitcairn Island');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (156, 'Poland', true, 'Poland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (157, 'Portugal', true, 'Portugal');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (158, 'Qatar', false, 'Qatar');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (159, 'Romania', true, 'Romania');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (160, 'Russia', false, 'Russia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (161, 'Rwanda', false, 'Rwanda');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (162, 'Samoa', false, 'Samoa');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (92, 'San Marino', false, 'San Marino');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (163, 'Sao Tome and Principe', false, 'SÃ£o TomÃ© and PrÃ­ncipe');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (164, 'Saudi Arabia', false, 'Saudi Arabia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (165, 'Senegal', false, 'Senegal');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (146, 'Serbia', false, 'Serbia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (147, 'Seychelles', false, 'Seychelles');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (148, 'Sierra Leone', false, 'Sierra Leone');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (166, 'Singapore', false, 'Singapore');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (167, 'Slovakia', true, 'Slovakia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (168, 'Slovenia', true, 'Slovenia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (169, 'Solomon Islands', false, 'Solomon Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (170, 'Somalia', false, 'Somalia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (171, 'South Africa', false, 'South Africa');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (172, 'South Georgia and South Sandwich Islands', false, 'South Georgia and South Sandwich Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (173, 'South Korea', false, 'South Korea');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (174, 'South Sudan', false, 'South Sudan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (175, 'Spain', true, 'Spain');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (176, 'Sri Lanka', false, 'Sri Lanka');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (177, 'St Helena, Ascension and Tristan da Cunha', false, 'Saint Helena, Ascension and Tristan da Cunha');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (180, 'St Vincent', false, 'Saint Vincent and the Grenadines');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (181, 'Sudan', false, 'Sudan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (182, 'Suriname', false, 'Suriname');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (183, 'Swaziland', false, 'Swaziland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (184, 'Sweden', true, 'Sweden');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (185, 'Switzerland', false, 'Switzerland');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (185, 'Syria', false, 'Syria');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (186, 'Taiwan', false, 'Taiwan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (187, 'Tajikistan', false, 'Tajikistan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (188, 'Tanzania', false, 'Tanzania');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (189, 'Thailand', false, 'Thailand');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (190, 'Togo', false, 'Togo');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (191, 'Tonga', false, 'Tonga');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (192, 'Trinidad and Tobago', false, 'Trinidad and Tobago');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (193, 'Tunisia', false, 'Tunisia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (194, 'Turkey', false, 'Turkey');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (195, 'Turkmenistan', false, 'Turkmenistan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (196, 'Turks and Caicos Islands', false, 'Turks and Caicos Islands');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (197, 'Tuvalu', false, 'Tuvalu');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (198, 'Uganda', false, 'Uganda');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (199, 'Ukraine', false, 'Ukraine');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (200, 'United Arab Emirates', false, 'United Arab Emirates');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (201, 'United Kingdom', true, 'United Kingdom');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (202, 'United States', false, 'United States');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (203, 'Uruguay ', false, 'Uruguay ');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (204, 'Uzbekistan', false, 'Uzbekistan');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (205, 'Vanuatu', false, 'Vanuatu');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (206, 'Vatican City', false, 'Vatican City');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (207, 'Venezuela', false, 'Venezuela');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (208, 'Vietnam', false, 'Vietnam');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (209, 'Yemen', false, 'Yemen');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (210, 'Zambia', false, 'Zambia');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (211, 'Zimbabwe', false, 'Zimbabwe');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (178, 'St Kitts and Nevis', false, 'Saint Kitts and Nevis');
INSERT INTO country (id, name, "in_EU", casebook_mapping) VALUES (179, 'St Lucia', false, 'Saint Lucia');


--
-- TOC entry 2201 (class 0 OID 0)
-- Dependencies: 200
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('country_id_seq', 1, false);


--
-- TOC entry 2202 (class 0 OID 0)
-- Dependencies: 181
-- Name: doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('doc_id_seq', 260, true);


--
-- TOC entry 2203 (class 0 OID 0)
-- Dependencies: 184
-- Name: exported_data; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('exported_data', 495, true);


--
-- TOC entry 2204 (class 0 OID 0)
-- Dependencies: 201
-- Name: postages_available_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('postages_available_seq', 1, false);


--
-- TOC entry 2205 (class 0 OID 0)
-- Dependencies: 186
-- Name: postagesavailable_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('postagesavailable_seq', 10, true);


--
-- TOC entry 2206 (class 0 OID 0)
-- Dependencies: 172
-- Name: useradditionalapplicationinfo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('useradditionalapplicationinfo_seq', 3785, true);


--
-- TOC entry 2207 (class 0 OID 0)
-- Dependencies: 176
-- Name: userdocumentcount_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('userdocumentcount_seq', 7179, true);


--
-- TOC entry 2208 (class 0 OID 0)
-- Dependencies: 202
-- Name: userdocuments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('userdocuments_id_seq', 3384, true);


--
-- TOC entry 2209 (class 0 OID 0)
-- Dependencies: 194
-- Name: userpostagedetails_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('userpostagedetails_seq', 7346, true);


--
-- TOC entry 2210 (class 0 OID 0)
-- Dependencies: 204
-- Name: yourdetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('yourdetails_id_seq', 5601, true);


--
-- TOC entry 2014 (class 2606 OID 99198)
-- Name: ApplicationPaymentDetails_pk; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "ApplicationPaymentDetails"
    ADD CONSTRAINT "ApplicationPaymentDetails_pk" PRIMARY KEY (id);


--
-- TOC entry 2010 (class 2606 OID 99200)
-- Name: Application_application_guid_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "Application"
    ADD CONSTRAINT "Application_application_guid_key" UNIQUE (application_guid);


--
-- TOC entry 2018 (class 2606 OID 99202)
-- Name: AvailableDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "AvailableDocuments"
    ADD CONSTRAINT "AvailableDocuments_pkey" PRIMARY KEY (doc_id);


--
-- TOC entry 2020 (class 2606 OID 99204)
-- Name: PostagesAvailable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "PostagesAvailable"
    ADD CONSTRAINT "PostagesAvailable_pkey" PRIMARY KEY (id);


--
-- TOC entry 2023 (class 2606 OID 99206)
-- Name: SubmissionAttempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "SubmissionAttempts"
    ADD CONSTRAINT "SubmissionAttempts_pkey" PRIMARY KEY (submission_id);


--
-- TOC entry 2008 (class 2606 OID 99208)
-- Name: UserAdditionalApplicationInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "AdditionalApplicationInfo"
    ADD CONSTRAINT "UserAdditionalApplicationInfo_pkey" PRIMARY KEY (id);


--
-- TOC entry 2027 (class 2606 OID 99210)
-- Name: UserDocumentCount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "UserDocumentCount"
    ADD CONSTRAINT "UserDocumentCount_pkey" PRIMARY KEY (id);


--
-- TOC entry 2029 (class 2606 OID 99212)
-- Name: UserDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "UserDocuments"
    ADD CONSTRAINT "UserDocuments_pkey" PRIMARY KEY (user_doc_id);


--
-- TOC entry 2031 (class 2606 OID 99214)
-- Name: UserPostageDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "UserPostageDetails"
    ADD CONSTRAINT "UserPostageDetails_pkey" PRIMARY KEY (id);


--
-- TOC entry 2012 (class 2606 OID 99216)
-- Name: application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "Application"
    ADD CONSTRAINT application_pkey PRIMARY KEY (application_id);


--
-- TOC entry 2025 (class 2606 OID 99218)
-- Name: person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "UserDetails"
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- TOC entry 2016 (class 2606 OID 99220)
-- Name: pk_application_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "ApplicationTypes"
    ADD CONSTRAINT pk_application_id PRIMARY KEY (id);


--
-- TOC entry 2021 (class 1259 OID 99221)
-- Name: FKI_SubmissionAttempts_Application; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX "FKI_SubmissionAttempts_Application" ON "SubmissionAttempts" USING btree (application_id);


--
-- TOC entry 2032 (class 2606 OID 99222)
-- Name: ApplicationPaymentDetails_Application_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "ApplicationPaymentDetails"
    ADD CONSTRAINT "ApplicationPaymentDetails_Application_fk" FOREIGN KEY (application_id) REFERENCES "Application"(application_id);


--
-- TOC entry 2033 (class 2606 OID 99227)
-- Name: FK_SubmissionAttempts_Application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "SubmissionAttempts"
    ADD CONSTRAINT "FK_SubmissionAttempts_Application" FOREIGN KEY (application_id) REFERENCES "Application"(application_id);

ALTER TABLE "PostagesAvailable"
ADD COLUMN send_country text;

UPDATE "PostagesAvailable"
   SET send_country='UK'
WHERE id=7 OR id=8;

UPDATE "PostagesAvailable"
   SET send_country='EU'
WHERE id=9;

 UPDATE "PostagesAvailable"
   SET send_country='INT'
WHERE id=10;

ALTER TABLE "UserPostageDetails"
ADD COLUMN postage_type text;

ALTER TABLE "Application"
ADD company_name text;
ALTER TABLE "ExportedApplicationData"
ADD user_id integer;
ALTER TABLE "ExportedApplicationData"
ADD company_name text;

ALTER TABLE "ExportedApplicationData"
ADD main_organisation text;

ALTER TABLE "ExportedApplicationData"
ADD alt_organisation text;
-- Function: populate_exportedapplicationdata(integer)

-- DROP FUNCTION populate_exportedapplicationdata(integer);

CREATE OR REPLACE FUNCTION populate_exportedapplicationdata(_application_id integer)
  RETURNS integer AS
$BODY$
declare
                rows_affected integer;
BEGIN
WITH rows AS (
    INSERT INTO "ExportedApplicationData" (
                    application_id,
                    "applicationType",
                    first_name,
                    last_name,
                    telephone,
                    email,
                    doc_count,
                    user_ref,
                    payment_reference,
                    payment_amount,
                    postage_return_title,
                    postage_return_price,
                    postage_send_title,
                    postage_send_price,
                    main_full_name,
                    main_organisation,
                    main_house_name,
                    main_street,
                    main_town,
                    main_county,
                    main_country,
                    main_postcode,
                    alt_full_name,
                    alt_organisation,
                    alt_house_name,
                    alt_street,
                    alt_town,
                    alt_county,
                    alt_country,
                    alt_postcode,
                    total_docs_count_price,
                    feedback_consent,
                    unique_app_id,
                    user_id,
                    company_name,
                    "createdAt"
    )
    select app.application_id,
                aty."casebook_description" as "applicationType",
                ud.first_name,
                ud.last_name,
                ud.telephone,
                ud.email,
        udc.doc_count,
        aai.user_ref,
        pymt.payment_reference,
        pymt.payment_amount,
        (select pa.casebook_description as postage_return_title from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='return' and upd.application_id=_application_id),
        (select pa.price as postage_return_price  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='return' and upd.application_id=_application_id),
        (select pa.title as postage_send_title  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id),
        (select pa.price as postage_send_price from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id),
        (select full_name AS main_full_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select organisation AS main_organisation from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select house_name AS main_house_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select street AS main_street from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select town AS main_town from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select county AS main_county from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select country AS main_country from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select postcode AS main_postcode from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select full_name AS alt_full_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select organisation AS alt_organisation from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select house_name AS alt_house_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select street AS alt_street from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select town AS alt_town from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select county AS alt_county from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select country AS alt_country from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select postcode AS alt_postcode from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select price AS total_doc_count_price from "UserDocumentCount"
        where application_id=_application_id),
        (select feedback_consent AS feedback_consent from "Application"
        where application_id=_application_id),
        (select unique_app_id AS unique_app_id from "Application"
        where application_id=_application_id),
        (select user_id AS user_id from "Application"
        where application_id=_application_id),
        (select company_name AS company_name from "Application"
        where application_id=_application_id),
        NOW()
        from "Application" app
        join "ApplicationTypes" aty on aty.id=app."serviceType"
        join "UserDetails" ud on ud.application_id=app.application_id
        join "UserDocumentCount" udc on udc.application_id=app.application_id
        join "AdditionalApplicationInfo" aai on aai.application_id=app.application_id
        join "ApplicationPaymentDetails" pymt on aai.application_id=pymt.application_id
        where app.application_id=_application_id
        and not exists(select * from "ExportedApplicationData" where application_id = _application_id)

        RETURNING 1
)

SELECT count(*) into rows_affected FROM Rows;
RETURN rows_affected;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION populate_exportedapplicationdata(integer)
  OWNER TO postgres;--
-- TOC entry 2182 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-03-29 17:12:43

--
-- PostgreSQL database dump complete
--

