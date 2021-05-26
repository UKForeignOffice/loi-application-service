--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.21
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: get_next_payment_reference(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_next_payment_reference() RETURNS text
    LANGUAGE plpgsql
    AS $$

DECLARE	
    v_reference TEXT;
    
BEGIN

SELECT 'FCO-LOI-REF-'||nextval('next_payment_reference')::TEXT
INTO v_reference;

RETURN v_reference;

END;

$$;


ALTER FUNCTION public.get_next_payment_reference() OWNER TO postgres;

--
-- Name: populate_exportedapplicationdata(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.populate_exportedapplicationdata(_application_id integer) RETURNS integer
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
                    "mobileNo",
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
                    main_telephone,
                    "main_mobileNo",
                    main_email,
                    alt_full_name,
                    alt_organisation,
                    alt_house_name,
                    alt_street,
                    alt_town,
                    alt_county,
                    alt_country,
                    alt_postcode,
                    alt_telephone,
                    "alt_mobileNo",
                    alt_email,
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
                ud."mobileNo",
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
        (select Replace(house_name, 'N/A', '') AS main_house_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select street AS main_street from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select town AS main_town from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select county AS main_county from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select casebook_mapping AS main_country from "country" country, "AddressDetails" addd
        where country.name=addd.country and addd.type='main' and addd.application_id=_application_id),
        (select postcode AS main_postcode from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select telephone AS main_telephone from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select "mobileNo" AS "main_mobileNo" from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select email AS main_email from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id),
        (select full_name AS alt_full_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select organisation AS alt_organisation from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select Replace(house_name, 'N/A', '') AS alt_house_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select street AS alt_street from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select town AS alt_town from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select county AS alt_county from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select casebook_mapping AS alt_country from "country" country, "AddressDetails" addd
        where country.name=addd.country and addd.type='alt' and addd.application_id=_application_id),
        (select postcode AS alt_postcode from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
       (select telephone AS alt_telephone from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select "mobileNo" AS "alt_mobileNo" from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id),
        (select email AS alt_email from "AddressDetails" addd
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
 $$;


ALTER FUNCTION public.populate_exportedapplicationdata(_application_id integer) OWNER TO postgres;

SET default_tablespace = '';

--
-- Name: AccountDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AccountDetails" (
    id integer,
    complete boolean,
    "updatedAt" date,
    "createdAt" date,
    first_name text,
    last_name text,
    telephone text,
    company_name text,
    company_number text,
    user_id integer NOT NULL,
    feedback_consent boolean,
    "mobileNo" text
);


ALTER TABLE public."AccountDetails" OWNER TO postgres;

--
-- Name: SavedAddress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SavedAddress" (
    id bigint NOT NULL,
    user_id integer,
    full_name text,
    house_name text,
    street text,
    town text,
    county text,
    country text,
    postcode text,
    "updatedAt" date,
    "createdAt" date,
    organisation text,
    telephone text,
    email text,
    "mobileNo" text
);


ALTER TABLE public."SavedAddress" OWNER TO postgres;

--
-- Name: SavedAddress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SavedAddress_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SavedAddress_id_seq" OWNER TO postgres;

--
-- Name: SavedAddress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SavedAddress_id_seq" OWNED BY public."SavedAddress".id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    email text NOT NULL,
    password text,
    id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
    "updatedAt" date,
    "createdAt" date,
    "resetPasswordToken" text,
    "resetPasswordExpires" timestamp without time zone,
    "failedLoginAttemptCount" integer,
    "accountLocked" boolean,
    "passwordExpiry" timestamp without time zone,
    salt text,
    payment_reference text,
    "activationToken" text,
    activated boolean,
    "activationTokenExpires" date,
    "premiumEnabled" boolean DEFAULT false,
    "dropOffEnabled" boolean DEFAULT false,
    "accountExpiry" timestamp without time zone,
    "warningSent" boolean DEFAULT false,
    "expiryConfirmationSent" boolean DEFAULT false
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: next_payment_reference; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.next_payment_reference
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.next_payment_reference OWNER TO postgres;

--
-- Name: SavedAddress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedAddress" ALTER COLUMN id SET DEFAULT nextval('public."SavedAddress_id_seq"'::regclass);


--
-- Data for Name: AccountDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AccountDetails" (id, complete, "updatedAt", "createdAt", first_name, last_name, telephone, company_name, company_number, user_id, feedback_consent, "mobileNo") FROM stdin;
\.


--
-- Data for Name: SavedAddress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SavedAddress" (id, user_id, full_name, house_name, street, town, county, country, postcode, "updatedAt", "createdAt", organisation, telephone, email, "mobileNo") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (email, password, id, "updatedAt", "createdAt", "resetPasswordToken", "resetPasswordExpires", "failedLoginAttemptCount", "accountLocked", "passwordExpiry", salt, payment_reference, "activationToken", activated, "activationTokenExpires", "premiumEnabled", "dropOffEnabled", "accountExpiry", "warningSent", "expiryConfirmationSent") FROM stdin;
\.


--
-- Name: SavedAddress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SavedAddress_id_seq"', 142, true);


--
-- Name: next_payment_reference; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.next_payment_reference', 161, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 188, true);


--
-- Name: SavedAddress SavedAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SavedAddress"
    ADD CONSTRAINT "SavedAddress_pkey" PRIMARY KEY (id);


--
-- Name: AccountDetails user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccountDetails"
    ADD CONSTRAINT user_id PRIMARY KEY (user_id);


--
-- Name: Users user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT user_pk PRIMARY KEY (email);


--
-- PostgreSQL database dump complete
--

