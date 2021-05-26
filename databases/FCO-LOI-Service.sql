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
-- Name: dashboard_data(integer, integer, integer, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dashboard_data(_user_id integer, _limit integer, _offset integer, _orderby text, _direction text, query_string text, _secondaryorderby text DEFAULT NULL::text, _secondarydirection text DEFAULT NULL::text) RETURNS TABLE("createdDate" timestamp with time zone, unique_app_id text, applicationtype text, doc_count integer, payment_amount numeric, user_ref text, result_count integer)
    LANGUAGE plpgsql
    AS $_$
  declare	result_count integer;
BEGIN
IF _secondaryorderby IS NULL THEN
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
	app.application_start_date as "createdDate",
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
ELSE
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
	app.application_start_date as "createdDate",
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
	order by ' ||  _orderby || ' ' || _direction || ',' || _secondaryorderby || ' ' || _secondarydirection || ' 
	LIMIT $2 OFFSET $3'
USING _user_id, _limit, _offset;
 END IF;
END;
$_$;


ALTER FUNCTION public.dashboard_data(_user_id integer, _limit integer, _offset integer, _orderby text, _direction text, query_string text, _secondaryorderby text, _secondarydirection text) OWNER TO postgres;

--
-- Name: find_documents(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_documents(_keywords text) RETURNS TABLE(doc_id integer, doc_title text, doc_title_start text, doc_title_mid text, kind_of_document text)
    LANGUAGE sql COST 1000
    AS $$
SELECT doc_id, doc_title, doc_title_start, doc_title_mid, kind_of_document
FROM "AvailableDocuments"
WHERE doc_title ilike '%' || _keywords || '%'
OR doc_title_start ilike '%' || _keywords || '%'
OR synonyms ilike '%' || _keywords || '%'
ORDER BY doc_title
--LIMIT 20;
$$;


ALTER FUNCTION public.find_documents(_keywords text) OWNER TO postgres;

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

--
-- Name: useradditionalapplicationinfo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.useradditionalapplicationinfo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.useradditionalapplicationinfo_seq OWNER TO postgres;

SET default_tablespace = '';

--
-- Name: AdditionalApplicationInfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdditionalApplicationInfo" (
    special_instructions text,
    user_ref text,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('public.useradditionalapplicationinfo_seq'::regclass) NOT NULL
);


ALTER TABLE public."AdditionalApplicationInfo" OWNER TO postgres;

--
-- Name: AddressDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AddressDetails" (
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
    id integer,
    organisation text,
    telephone text,
    email text,
    "mobileNo" text
);


ALTER TABLE public."AddressDetails" OWNER TO postgres;

--
-- Name: TABLE "AddressDetails"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."AddressDetails" IS 'Temp';


--
-- Name: Application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Application" (
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
    application_start_date timestamp with time zone DEFAULT ('now'::text)::timestamp with time zone,
    company_name text,
    "doc_reside_EU" boolean,
    residency boolean,
    "submissionAttempts" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Application" OWNER TO postgres;

--
-- Name: userdocumentcount_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.userdocumentcount_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userdocumentcount_seq OWNER TO postgres;

--
-- Name: ApplicationPaymentDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApplicationPaymentDetails" (
    application_id integer NOT NULL,
    payment_complete boolean DEFAULT false NOT NULL,
    payment_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_reference text,
    id integer DEFAULT nextval('public.userdocumentcount_seq'::regclass) NOT NULL,
    "createdAt" date,
    "updatedAt" date,
    payment_status text,
    oneclick_reference text
);


ALTER TABLE public."ApplicationPaymentDetails" OWNER TO postgres;

--
-- Name: ApplicationReference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApplicationReference" (
    "lastUsedID" integer,
    "createdAt" date,
    "updatedAt" date,
    id integer
);


ALTER TABLE public."ApplicationReference" OWNER TO postgres;

--
-- Name: applicationtype_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applicationtype_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applicationtype_seq OWNER TO postgres;

--
-- Name: ApplicationTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApplicationTypes" (
    "applicationType" text,
    id integer DEFAULT nextval('public.applicationtype_seq'::regclass) NOT NULL,
    casebook_description text
);


ALTER TABLE public."ApplicationTypes" OWNER TO postgres;

--
-- Name: doc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doc_id_seq OWNER TO postgres;

--
-- Name: AvailableDocuments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AvailableDocuments" (
    doc_id integer DEFAULT nextval('public.doc_id_seq'::regclass) NOT NULL,
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
    accept_text text,
    eligible_check_option_4 text,
    eligible_check_option_5 text,
    eligible_check_option_6 text
);


ALTER TABLE public."AvailableDocuments" OWNER TO postgres;

--
-- Name: DocumentTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DocumentTypes" (
    doc_type text,
    doc_type_title text,
    doc_type_id integer,
    "updatedAt" date,
    "createdAt" date
);


ALTER TABLE public."DocumentTypes" OWNER TO postgres;

--
-- Name: COLUMN "DocumentTypes".doc_type_title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DocumentTypes".doc_type_title IS '
';


--
-- Name: COLUMN "DocumentTypes".doc_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."DocumentTypes".doc_type_id IS '
';


--
-- Name: exported_data; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exported_data
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exported_data OWNER TO postgres;

--
-- Name: ExportedApplicationData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExportedApplicationData" (
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
    id integer DEFAULT nextval('public.exported_data'::regclass),
    "createdAt" date,
    "updatedAt" date,
    payment_reference text,
    payment_amount numeric,
    "submittedJSON" json,
    main_postcode text,
    alt_postcode text,
    user_id integer,
    company_name text,
    main_organisation text,
    alt_organisation text,
    main_telephone text,
    main_email text,
    alt_telephone text,
    alt_email text,
    "mobileNo" text,
    "main_mobileNo" text,
    "alt_mobileNo" text
);


ALTER TABLE public."ExportedApplicationData" OWNER TO postgres;

--
-- Name: COLUMN "ExportedApplicationData".telephone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."ExportedApplicationData".telephone IS '
';


--
-- Name: postagesavailable_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postagesavailable_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.postagesavailable_seq OWNER TO postgres;

--
-- Name: PostagesAvailable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostagesAvailable" (
    title text,
    price numeric,
    type text,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('public.postagesavailable_seq'::regclass) NOT NULL,
    casebook_description text,
    pretty_title text,
    send_country text
);


ALTER TABLE public."PostagesAvailable" OWNER TO postgres;

--
-- Name: COLUMN "PostagesAvailable".type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."PostagesAvailable".type IS 'for sending or receiving';


--
-- Name: SubmissionAttempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SubmissionAttempts" (
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


ALTER TABLE public."SubmissionAttempts" OWNER TO postgres;

--
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SubmissionAttempts_submission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SubmissionAttempts_submission_id_seq" OWNER TO postgres;

--
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SubmissionAttempts_submission_id_seq" OWNED BY public."SubmissionAttempts".submission_id;


--
-- Name: UserDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserDetails" (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255),
    telephone character varying(25),
    email character varying(255),
    "createdAt" text,
    "updatedAt" text,
    application_id integer,
    has_email text,
    "mobileNo" text
);


ALTER TABLE public."UserDetails" OWNER TO postgres;

--
-- Name: UserDocumentCount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserDocumentCount" (
    doc_count integer,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('public.userdocumentcount_seq'::regclass) NOT NULL,
    price integer
);


ALTER TABLE public."UserDocumentCount" OWNER TO postgres;

--
-- Name: UserDocuments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserDocuments" (
    application_id integer NOT NULL,
    doc_id integer,
    user_doc_id integer NOT NULL,
    "updatedAt" date,
    "createdAt" date,
    certified boolean,
    this_doc_count integer
);


ALTER TABLE public."UserDocuments" OWNER TO postgres;

--
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserDocuments_application_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserDocuments_application_id_seq" OWNER TO postgres;

--
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserDocuments_application_id_seq" OWNED BY public."UserDocuments".application_id;


--
-- Name: userpostagedetails_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.userpostagedetails_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userpostagedetails_seq OWNER TO postgres;

--
-- Name: UserPostageDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserPostageDetails" (
    postage_available_id integer,
    application_id integer,
    "createdAt" date,
    "updatedAt" date,
    id integer DEFAULT nextval('public.userpostagedetails_seq'::regclass) NOT NULL,
    postage_type text
);


ALTER TABLE public."UserPostageDetails" OWNER TO postgres;

--
-- Name: application_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_application_id_seq OWNER TO postgres;

--
-- Name: application_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_application_id_seq OWNED BY public."Application".application_id;


--
-- Name: application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_id_seq OWNER TO postgres;

--
-- Name: applicationpaymentdetails_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applicationpaymentdetails_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applicationpaymentdetails_seq OWNER TO postgres;

--
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "in_EU" boolean DEFAULT false,
    casebook_mapping text
);


ALTER TABLE public.country OWNER TO postgres;

--
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.country_id_seq OWNER TO postgres;

--
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;


--
-- Name: postages_available_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postages_available_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.postages_available_seq OWNER TO postgres;

--
-- Name: userdocuments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.userdocuments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userdocuments_id_seq OWNER TO postgres;

--
-- Name: userdocuments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.userdocuments_id_seq OWNED BY public."UserDocuments".user_doc_id;


--
-- Name: vw_ApplicationPrice; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."vw_ApplicationPrice" AS
 SELECT udc.application_id,
    udc.price AS documents_price,
    upd.postage_available_id AS selected_postage_method,
    pa.price AS selected_postage_price,
    ((udc.price)::numeric + pa.price) AS total_price
   FROM ((public."UserDocumentCount" udc
     JOIN public."UserPostageDetails" upd ON ((udc.application_id = upd.application_id)))
     JOIN public."PostagesAvailable" pa ON (((upd.postage_available_id = pa.id) AND (pa.type = 'return'::text))));


ALTER TABLE public."vw_ApplicationPrice" OWNER TO postgres;

--
-- Name: yourdetails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.yourdetails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.yourdetails_id_seq OWNER TO postgres;

--
-- Name: yourdetails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yourdetails_id_seq OWNED BY public."UserDetails".id;


--
-- Name: Application application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application" ALTER COLUMN application_id SET DEFAULT nextval('public.application_application_id_seq'::regclass);


--
-- Name: SubmissionAttempts submission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubmissionAttempts" ALTER COLUMN submission_id SET DEFAULT nextval('public."SubmissionAttempts_submission_id_seq"'::regclass);


--
-- Name: UserDetails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDetails" ALTER COLUMN id SET DEFAULT nextval('public.yourdetails_id_seq'::regclass);


--
-- Name: UserDocuments user_doc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDocuments" ALTER COLUMN user_doc_id SET DEFAULT nextval('public.userdocuments_id_seq'::regclass);


--
-- Name: country id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);


--
-- Data for Name: AdditionalApplicationInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AdditionalApplicationInfo" (special_instructions, user_ref, application_id, "createdAt", "updatedAt", id) FROM stdin;
\.


--
-- Data for Name: AddressDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AddressDetails" (application_id, full_name, postcode, house_name, street, town, county, country, type, "updatedAt", "createdAt", id, organisation, telephone, email, "mobileNo") FROM stdin;
\.


--
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Application" (application_id, submitted, "createdAt", "updatedAt", "serviceType", unique_app_id, feedback_consent, application_reference, case_reference, user_id, application_guid, application_start_date, company_name, "doc_reside_EU", residency, "submissionAttempts") FROM stdin;
\.


--
-- Data for Name: ApplicationPaymentDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApplicationPaymentDetails" (application_id, payment_complete, payment_amount, payment_reference, id, "createdAt", "updatedAt", payment_status, oneclick_reference) FROM stdin;
\.


--
-- Data for Name: ApplicationReference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApplicationReference" ("lastUsedID", "createdAt", "updatedAt", id) FROM stdin;
2	2021-01-01	2021-05-26	1
\.


--
-- Data for Name: ApplicationTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApplicationTypes" ("applicationType", id, casebook_description) FROM stdin;
Standard	1	Postal Service
Premium	2	Premium Service
Drop-off	3	MK Drop Off Service
\.


--
-- Data for Name: AvailableDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AvailableDocuments" (doc_id, "updatedAt", "createdAt", html_id, certification_notes, delete_additional_notes, legislation_allowed, photocopy_allowed, certification_required, doc_type_id, doc_title, doc_title_start, doc_title_mid, additional_detail, eligible_check_option_1, eligible_check_option_2, eligible_check_option_3, legalisation_clause, kind_of_document, extra_title_text, synonyms, accept_text, eligible_check_option_4, eligible_check_option_5, eligible_check_option_6) FROM stdin;
224	\N	\N	diploma	\N	\N	t	t	t	7	Diploma 	Diploma	diploma	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	education,qualifications,diploma	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
240	\N	\N	letter-of-enrolment	\N	\N	t	t	t	2,16	Letter of Enrolment 	Letter of enrolment	letter of enrolment	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	education,letter of enrolment	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
199	\N	\N	bank-statement	\N	\N	t	t	t	2,17	Bank Statement 	Bank statement	bank statement		Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	personal,financial,finance,identity,finances,id,money,identification,bank statement	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
209	\N	\N	companies-house-document	\N	\N	t	t	t	1,3	Companies House Document	Companies House document	Companies House document	\N	Your original *replaceme* signed by an official of Companies House	Your original *replaceme* not signed by an official of Companies House <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Document	\N	business,company,companies house document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
203	\N	\N	certificate-of-incorporation	\N	\N	t	t	t	1,3	Certificate of Incorporation 	Certificate of incorporation	certificate of incorporation	\N	Your original *replaceme* signed by an official of Companies House	Your original *replaceme* not signed by an official of Companies House <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	\N	\N	business,company,legal,certificate of incorporation	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
204	\N	\N	certificate-of-memorandum	\N	\N	t	t	t	1,3	Certificate of Memorandum 	Certificate of memorandum	certificate of memorandum	\N	Your original *replaceme* signed by an official of Companies House	Your original *replaceme* not signed by an official of Companies House <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*    	must be certified by a solicitor or notary public in the UK	\N	\N	business,company,legal,certificate of memorandum	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
214	\N	\N	court-of-bancruptcy-document	\N	\N	t	t	t	6	Court of Bankruptcy Document	Court of Bankruptcy document	Court of Bankruptcy document	\N	Your original court document stamped or sealed by the court, or signed by an official of the court	Your original court document not stamped sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>   	must be certified by a solicitor or notary public in the UK	Document	\N	legal,financial,business,finance,finances,court of bankruptcy document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
225	\N	\N	disclosure-scotland-document	\N	\N	t	f	t	9	Disclosure Scotland Document	Disclosure Scotland document	Disclosure Scotland document		Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* without a signature from an official of the iussuing authority <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Document	\N	criminal,legal,disclosure scotland document	We accept the *replaceme* in the following formats. Please confirm which one you will send:	\N	\N	\N
226	\N	\N	doctors-medical	\N	\N	t	t	t	10	Doctor's Letter 	Doctor's letter 	doctor's letter 	\N	Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	medical,health,doctor's letter	We accept the document in the following formats. Please confirm which one you will send.	\N	\N	\N
227	\N	\N	driving-license	\N	\N	f	t	t	15, 4	Driving Licence 	Driving licence	driving licence	\N	A copy of your *replaceme*, certified, signed and dated by a UK solicitor or notary <span>certification required</span> 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	must be certified by a solicitor or notary public in the UK	\N	\N	personal,identification,id,identity,driving licence	We can only legalise a certified copy of your *replaceme*. We cannot legalise the original document.	\N	\N	\N
232	\N	\N	fit-note	\N	\N	t	t	t	10	Fit Note 	Fit note	fit note	\N	Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	(UK)	medical,health,fit note	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
235	\N	\N	high-court-of-justice-document	\N	\N	t	t	t	6	High Court of Justice Document	High Court of Justice document	High Court of Justice document	\N	Your original court document, stamped or sealed by the court, or signed by an official of the court 	Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span> 	must be certified by a solicitor or notary public in the UK	Document	\N	legal,high court of justice document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
197	\N	\N	affidavit	\N	\N	t	t	t	3	Affidavit 	Affidavit	affidavit	\N	Your original *replaceme* signed and dated by a UK solicitor or notary	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	Personal,Legal,Criminal,affidavit	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
217	\N	\N	criminal-records-check	\N	\N	t	f	t	9	Criminal Records Check 	Criminal records check	criminal records check	\N	Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* without a signature from an official of the issuing authority <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	legal,police,criminal records check	We accept the *replaceme* in the following formats. Please confirm which one you will send:	\N	\N	\N
245	\N	\N	medical-report	\N	\N	t	t	t	10	Medical Report 	Medical report	medical report	\N	Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	(UK)	medical,health,medical report	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
237	\N	\N	home-office-document	\N	\N	t	t	t	8	Home Office Document	Home Office (HO) document	Home Office (HO) document	\N	Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	must be certified by a solicitor or notary public in the UK	Document	\N	government,home office document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
222	\N	\N	department-of-business-innovation-and-skills-bis	\N	\N	t	t	t	1,3	Department of Business, Innovation and Skills (BIS) Document	Department of Business, Innovation and Skills (BIS) document	Department of Business, Innovation and Skills (BIS) document		Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Document	(BIS)	business,government,department of business, innovation and skills document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
223	\N	\N	department-of-health-document	\N	\N	t	t	t	8	Department of Health Document	Department of Health  (DH) document	Department of Health  (DH) document		Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Document	\N	health,government,medical,department of health document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
233	\N	\N	government-issued-document	\N	\N	t	t	t	8	Government Issued Document	Government issued document	government issued document	\N	Your original *replaceme* signed by an official from the issuing authority	Your original *replaceme* not signed by an official from the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Document	\N	government,government issued document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
234	\N	\N	grant-of-probate	\N	\N	t	t	t	6	Grant of Probate 	Grant of probate	grant of probate	\N	Your original court document, stamped or sealed by the court, or signed by an official of the court 	Your original court document, not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document<span>*replaceme*</span> 	must be certified by a solicitor or notary public in the UK		\N	legal,death,personal,grant of probate	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
196	\N	\N	acro-police-certificate	\N	\N	t	f	t	9	ACRO Police Certificate	ACRO police certificate	ACRO police certificate	\N	Your original *replaceme* signed by an official of the issuing authority.	Your original *replaceme* without a signature from an official of the issuing authority. <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Certificate	\N	Personal,Legal,Criminal,acro police certificate	We accept the *replaceme* in the following formats. Please confirm which one you will send:	\N	\N	\N
238	\N	\N	last-will-and-testament	\N	\N	t	t	t	3	Last Will and Testament 	Last will and testament	last will and testament	\N	Your original *replaceme* witnessed in the UK by a solicitor or notary 	A copy of your *replaceme* which has been deposited with the relevant court and containing an original signature or seal	A copy of your *replaceme* certified in the UK by a solicitor or notary <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	death,personal,last will and testament	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
198	\N	\N	articles-of-association	\N	\N	t	t	t	1	Articles of Association 	Articles of association	articles of association	\N	Your original *replaceme* signed by an official of Companies House	Your original *replaceme* not signed by an official of Companies House <span>certification required</span> 	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	\N	\N	business,articles of association	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
242	\N	\N	letter-of-no-trace	\N	\N	t	f	f	4	Letter of No Trace 	Letter of no trace	letter of no trace	\N	Original letter of no trace signed by an official of the GRO	\N	\N	must be certified by a solicitor or notary public in the UK	\N	\N	marriage, legal, letter of no trace,	We can only accept the document in the following format. Please confirm that you will send us:	\N	\N	\N
202	\N	\N	certificate-of-freesale	\N	\N	t	t	t	1,3	Certificate of Freesale 	Certificate of freesale	certificate of freesale	\N	Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	\N	\N	business,company,legal,certificate of freesale	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
246	\N	\N	medical-test-results	\N	\N	t	t	t	10	Medical Test Results 	Medical test results	medical test results	\N	Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	(UK)	medical,health,medical test results	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
247	\N	\N	passport	\N	\N	f	t	t	4,11	Passport 	Passport	passport	\N	A copy of your *replaceme* certified, signed and dated by a UK solicitor or notary <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	must be certified by a solicitor or notary public in the UK	\N	\N	personal,identity,id,identification,passport	We can only legalise a certified copy of your *replaceme*. The copy must include the page which displays your digital or link signature. We cannot legalise the original document. Please confirm that you will send us:	\N	\N	\N
212	\N	\N	county-court-document	\N	\N	t	t	t	6	County Court Document	County Court document	County Court document	\N	Your original court document stamped or sealed by the court, or signed by an official of the court	Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  	must be certified by a solicitor or notary public in the UK	Document	\N	legal,county court document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
213	\N	\N	court-document	\N	\N	t	t	t	6	Court Document	Court document	court document	\N	Your original court document stamped or sealed by the court, or signed by an official of the court	Your original court document not stamped sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Document	\N	legal,court document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
248	\N	\N	Pet-export-document-from-defra	\N	\N	t	t	t	12	Pet Export Document from the Department of Environment, Food and Rural Affairs (DEFRA)	Pet export document from the Department of Environment, Food and Rural Affairs (DEFRA)	pet export document	\N	Your original *replaceme* signed by the named vet. The vet must be registered with <a href="https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs" target="_blank">DEFRA</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	from the Department of Environment. Food and Rural Affairs	(DEFRA)	pets,government,pet export document from the department of environment, food and rural affairs	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
219	\N	\N	decree-absolute	\N	\N	t	t	t	6	Decree Absolute 	Decree absolute	decree absolute	\N	Your original court document stamped sealed or signed by a court or an official of the court 	Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  	must be certified by a solicitor or notary public in the UK	\N	\N	marriage,legal,decree absolute,divorce	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
220	\N	\N	decree-nisi	\N	\N	t	t	t	6	Decree Nisi 	Decree nisi	decree nisi	\N	Your original court document stamped sealed or signed by a court or an official of the court 	Your original court document not stamped, sealed or signed by a court or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document<span>*replaceme*</span>  	must be certified by a solicitor or notary public in the UK	\N	\N	marriage,legal,decree nisi,divorce	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
249	\N	\N	police-disclosure-document	\N	\N	t	f	t	9	Police Disclosure Document	Police disclosure document	police disclosure document		Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	\N	must be certified by a solicitor or notary public in the UK	Document	\N	police,legal,criminal,police disclosure document	We accept the *replaceme* in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
250	\N	\N	power-of-attorney	\N	\N	t	t	t	3	Power of Attorney 	Power of attorney	power of attorney	\N	Your original *replaceme* <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	legal,personal,death,power of attorney	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
229	\N	\N	export-certificate	\N	\N	t	t	t	1	Export Certificate	Export certificate	export certificate	\N	Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme*  	must be certified by a solicitor or notary public in the UK	Certificate	\N	business,export certificate	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
230	\N	\N	family-division-of-the-high-court-of-justice-document	\N	\N	t	t	t	6	Family Division of the High Court of Justice Document	Family Division of the High Court of Justice document	Family Division of the High Court of Justice document	\N	Your original court document, stamped or sealed by the court, or signed by an official of the court	Your original court document, not stamped, sealed or signed by a court or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span>  	must be certified by a solicitor or notary public in the UK	Document	\N	legal,family division of the high court of justice document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
231	\N	\N	fingerprints-document	\N	\N	t	f	t	9	Fingerprints Document	Fingerprints document	fingerprints document	\N	Your original document, issued by the police, signed by an official of the police authority	Your original document, issued by a private institution <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Document	\N	personal,identification,id,criminal,identity,fingerprints document	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
257	\N	\N	statutory-declaration	\N	\N	t	t	t	3	Statutory Declaration 	Statutory declaration	statutory declaration	\N	Your original *replaceme* <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	legal,statutory declaration	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
236	\N	\N	hm-revenue-and-customs-document	\N	\N	t	t	t	8	HM Revenue and Customs Document	HM Revenue and Customs (HMRC) document	HM Revenue and Customs (HMRC) document		Your original *replaceme* signed by an official of the issuing authority	Your original *replaceme* not signed by an official of the issuing authority <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	must be certified by a solicitor or notary public in the UK	Document	\N	government,business,finance,finances,financial,hm revenue and customs document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
221	\N	\N	degree-certificate-uk	\N	\N	t	t	t	7	Degree Certificate or Transcript (UK)	Degree certificate or transcript (UK)	degree certificate or transcript (UK)	\N	Your original *replaceme*   <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	(UK)	education,qualifications,degree certificate or transcript	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
251	\N	\N	professional-qualification	\N	\N	t	t	t	7	Professional Qualification Certificate	Professional qualification certificate	professional qualification certificate	\N	Your original *replaceme*   <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Certificate	(UK) (e.g. issued by Royal Chartered Body such as Institute of Architects)	education,qualifications,professional certificate	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
254	\N	\N	school-document	\N	\N	t	t	t	7	School Document	School document	school document	\N	Your original *replaceme* <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Document	\N	education,school document	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
255	\N	\N	sheriff-court-document	\N	\N	t	t	t	6	Sheriff Court Document	Sheriff Court document	Sheriff Court document	\N	Your original court document stamped, sealed or signed by a court, or an official of the court	Your original court document not stamped, sealed or signed by a court, or an official of the court <span>certification required</span>	A photocopy <span>certification required</span> of your court document <span>*replaceme*</span> 	must be certified by a solicitor or notary public in the UK	Document	\N	legal,sheriff court document	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic court document produced from the original PDF or other electronic document <span>certification required</span> <span>*replaceme*</span>	\N	\N
256	\N	\N	sick-note	\N	\N	t	t	t	10	Sick Note 	Sick note	sick note	\N	Your original *replaceme* signed by the named doctor. The doctor must be registered with the <a href="http://www.gmc-uk.org/" target="_blank">General Medical Council</a>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	(UK)	medical,health,sick note	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
258	\N	\N	translation	\N	\N	t	t	t	14	Translation 	Translation	translation	\N	Your original *replaceme* <span>certification required</span>	A photocopy <span>certification required</span> of your *replaceme* 	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	personal,translation	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
260	\N	\N	vet-document	\N	\N	t	t	t	12	Veterinary Document	Veterinary document	veterinary document	\N	Your original *replaceme* signed by a vet. The vet must be registerd with the <a href="https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs" target="_blank">Department of Food and Rural Affairs</a>	A photocopy <span>certification required</span>of your *replaceme*	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Document	(UK)	animals,pets,veterinary document	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
241	\N	\N	letter-of-invitation	\N	\N	t	t	t	2	Letter of Invitation (to live in UK)	Letter of invitation (to live in UK)	letter of invitation (to live in UK)	\N	Your original *replaceme*   <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	 (to live in UK)	immigration,personal,letter of invitation	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
228	\N	\N	educational-certificate-uk	\N	\N	t	t	t	7	Educational Certificate (UK)	Educational certificate (UK)	educational certificate (UK)	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Certificate	(UK)	education,qualifications,educational certificate	We accept the document in the following formats.  Please confirm which one you will send:	\N	\N	\N
259	\N	\N	utility-bill	\N	\N	t	t	t	2,17	Utility Bill 	Utility bill	utility bill	\N	Your original *replaceme*   <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	personal,identity,id,financial,finances,finance,identification,utility bill	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
252	\N	\N	reference-from-an-employer	\N	\N	t	t	t	2,16	Reference from an Employer 	Reference from an employer	reference from an employer	\N	Your original *replaceme*   <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	employment,reference from an employer	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
239	\N	\N	letter-from-an-employer	\N	\N	t	t	t	2,16	Letter from an Employer 	Letter from an employer	letter from an employer	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	employment,personal,letter from an employer	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
253	\N	\N	religious-document	\N	\N	t	t	t	13	Religious Document	Religious document	UK religious document	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic religious certificate produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Document	\N	Personal, identity, ID, religious, birth, identification, baptism, Islamic divorce	We accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
207	\N	\N	change-of-name-deed	\N	\N	t	t	t	3	Change of Name Deed 	Change of name deed	change of name deed	\N	An original *replaceme* signed, certified and dated by a UK solicitor or notary public	An original *replaceme* produced by a council or court, signed with an original wet ink signature by a council or court official	An original *replaceme* not signed, certified and dated by a UK solicitor or notary public  <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	change of name, change of name deed, personal, identity, ID, identification	We will accept the document in the following formats. Please confirm which one you will send:	An original *replaceme* produced by a council or court not signed by a council or court official  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A print out of your *replaceme* which has been produced as a PDF/electronic document. The document may contain an electronic/digital signature or seal  <span>certification required</span>
206	\N	\N	certificate-of-no-impediment	\N	\N	t	f	f	4	Certificate of No Impediment 	Certificate of no impediment	certificate of no impediment		An original *replaceme* signed by the named registrar or duplicate produced by the register office signed by the named registrar or duplicate produced by the Register Office signed with an original ink signature of the named registrar	\N	\N	must be certified by a solicitor or notary public in the UK	\N	\N	marriage,divorce,personal,certificate of no impediment,divorce document	We can only accept the document in the following format. Please confirm that you will send us:	\N	\N	\N
201	\N	\N	birth-certificate	\N	\N	t	f	f	5	Birth Certificate (UK)	Birth Certificate (UK)	birth certificate (UK)	signed by a Registrar, or a certified copy issued by the General Register Office (GRO)	Your original UK birth certificate or a certified copy from either the General Register Office (GRO) or local register office	\N	\N	must be certified by a solicitor or notary public in the UK	Certificate (UK)	\N	birth, birth certificate, born, personal, identity, id, identification	We can only accept the document in the following format. Please confirm that you will send us:	\N	\N	\N
216	\N	\N	disclosure-and-barring-service-dbs-document	\N	\N	t	f	t	9	Disclosure and Barring Service (DBS) document	Disclosure and Barring Service (DBS) document	Disclosure and Barring Service (DBS) document	\N	Your original Disclosure and Barring Service (DBS) document without a signature from an official of the issuing authority <span>certification required</span>	\N	\N	must be certified by a solicitor or notary public in the UK	Document	 (CRB)	legal,police,criminal records bureau document	We can only accept the *replaceme* in the following format. Please confirm that you will send us:	\N	\N	\N
218	\N	\N	death-certificate	\N	\N	t	f	f	5	Death Certificate	Death certificate	death certificate	\N	An original *replaceme* signed by a registrar, or a certified copy issued by the General Register Office (GRO) or local register office	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	\N	must be certified by a solicitor or notary public in the UK	Certificate	\N	death,death certificate	We can only accept the document in the following format. Please confirm that you will send us:	\N	\N	\N
211	\N	\N	coroners-report	\N	\N	t	t	t	6	Coroner's Report 	Coroner's report	coroner's report	\N	Your original coroner’s report signed with a wet ink signature of the named coroner	Your original coroner’s report signed with a printed or electronic signature of the named coroner <span>certification required</span>	A photocopy of your coroner’s report <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	medical, death, coroner, coroners report, coroners certificate	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic coroner’s report produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
205	\N	\N	certificate-of-naturalisation	\N	\N	t	t	t	4	Certificate of Naturalisation 	Certificate of naturalisation	certificate of naturalisation	\N	Your original *replaceme*  <span>certification required</span>	A photocopy of your *replaceme*  <span>certification required</span>	A printout of your electronic *replaceme* produced from the original PDF or other electronic document <span>certification required</span>	must be certified by a solicitor or notary public in the UK	\N	\N	identity, personal, naturalisation, home office, certificate of naturalisation	We will accept the document in the following formats. Please confirm which one you will send:	\N	\N	\N
215	\N	\N	cremation-certificate	\N	\N	t	t	t	2	Cremation Certificate	Cremation certificate	cremation certificate	\N	Your original document signed by an official of the local council where the cremation took place	Your original document issued by a private crematorium <span>certification required</span>	A photocopy of your cremation certificate <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Certificate	\N	death, personal, cremation, crematorium, cremation certificate	We accept the document in the following formats. Please confirm which one you will send:	A printout of your electronic cremation certificate produced from the original PDF or other electronic document <span>certification required</span>	\N	\N
244	\N	\N	marriage-certificate-other	\N	\N	t	t	t	13	UK Marriage Certificate Issued By A Place Of Worship	UK Marriage Certificate Issued By A Place Of Worship	marriage certificate	\N	Your original certificate issued on official watermarked paper, signed with an original wet ink signature of the Rector, Vicar, Curate, Authorised Person for Marriages, Secretary for Marriages, Registering officer for the Society of Friends etc.	Your original Islamic marriage certificate <span>certification required</span>	A photocopy of your Islamic marriage certificate <span>certification required</span>	must be certified by a solicitor or notary public in the UK	Certificate	(UK issued by someone other than GRO)	marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office, church, Islamic marriage, Islamic, Greek orthodox	We will accept the document in the following formats. Please confirm which one you will send:	Your original Greek Orthodox marriage certificate <span>certification required</span>	A photocopy of your Greek Orthodox marriage certificate <span>certification required</span>	\N
243	\N	\N	marriage-certificate-gro	\N	\N	t	f	f	5	UK Marriage Certificate	UK Marriage Certificate	marriage certificate	\N	Original General Register Office (GRO) marriage certificate issued by a registrar or a certified copy issued by the GRO or register office	\N	\N	must be certified by a solicitor or notary public in the UK	Certificate	(UK issued by GRO)	marriage, personal, identity, Id, identification, marriage certificate, GRO, general register office	We can only accept the document in the following format. Please confirm that you will send us:	\N	\N	\N
208	\N	\N	civil-partnership-certificate	\N	\N	t	f	f	5	Civil Partnership and Conversion of Civil Partnership Certificate	Civil Partnership and Conversion of Civil Partnership Certificate	civil partnership or conversion of civil partnership certificate	\N	An original conversion of Civil Partnership to marriage certificate signed by a registrar or a certified copy issued by the General Register Office (GRO) or register office	An original civil partnership certificate signed by a registrar or a certified copy issued by the General Register Office (GRO) or register office	\N	must be certified by a solicitor or notary public in the UK	Certificate	\N	marriage, personal, civil partnership, wedding, conversion of civil partnership	We can only accept the document in the following formats. Please confirm that you will send us:	\N	\N	\N
\.


--
-- Data for Name: DocumentTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DocumentTypes" (doc_type, doc_type_title, doc_type_id, "updatedAt", "createdAt") FROM stdin;
personal	Personal Documents	2	\N	\N
legal	Legal Documents	3	\N	\N
identity	Identity Documents	4	\N	\N
general	GRO (General Registry Office)	5	\N	\N
court	Court Documents	6	\N	\N
education	Educational Documents	7	\N	\N
government	Government Department Documents	8	\N	\N
police	Police Documents	9	\N	\N
medical	Medical Documents	10	\N	\N
passport	Passport	11	\N	\N
pet	Pet Export	12	\N	\N
religious	Religious Document	13	\N	\N
translation	Translation	14	\N	\N
driving	Driving Licence	15	\N	\N
employment	Employment Document	16	\N	\N
financial	Financial Document	17	\N	\N
business	Business Documents	1	\N	\N
\.


--
-- Data for Name: ExportedApplicationData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExportedApplicationData" (application_id, "applicationType", first_name, last_name, telephone, email, doc_count, special_instructions, user_ref, postage_return_title, postage_return_price, postage_send_title, postage_send_price, main_house_name, main_street, main_town, main_county, main_country, main_full_name, alt_house_name, alt_street, alt_town, alt_county, alt_country, alt_full_name, feedback_consent, total_docs_count_price, unique_app_id, id, "createdAt", "updatedAt", payment_reference, payment_amount, "submittedJSON", main_postcode, alt_postcode, user_id, company_name, main_organisation, alt_organisation, main_telephone, main_email, alt_telephone, alt_email, "mobileNo", "main_mobileNo", "alt_mobileNo") FROM stdin;
\.


--
-- Data for Name: PostagesAvailable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PostagesAvailable" (title, price, type, "createdAt", "updatedAt", id, casebook_description, pretty_title, send_country) FROM stdin;
European Courier	14.50	return	\N	\N	9	European Courier	European courier	EU
International Courier	25.00	return	\N	\N	10	International Courier	international courier	INT
Hello	5.5	TEST	2016-05-16	2016-05-16	0	\N	\N	\N
You'll arrange for the return of your documents by adding stamps on to a self-addressed envelope which you'll include with your documents - typically £1 to £8, the cost varies	0.00	return	\N	\N	7	Pre-paid Envelope	pre-paid envelope	UK
You'll post your documents from the UK	0.00	send	\N	\N	4	\N	\N	\N
You'll use a courier to send your documents from the UK	0.00	send	\N	\N	5	\N	\N	\N
You're overseas and will post or courier your documents to the UK	0.00	send	\N	\N	6	\N	\N	\N
The Legalisation Office will arrange for the return of your documents by courier (including to British Forces Post Office) from 9am to 5pm Monday to Friday, excluding bank holidays	5.50	return	\N	\N	8	UK Courier	UK courier delivery	UK
\.


--
-- Data for Name: SubmissionAttempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SubmissionAttempts" (submission_id, application_id, retry_number, "timestamp", submitted_json, status, response_status_code, response_body, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserDetails" (id, first_name, last_name, telephone, email, "createdAt", "updatedAt", application_id, has_email, "mobileNo") FROM stdin;
\.


--
-- Data for Name: UserDocumentCount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserDocumentCount" (doc_count, application_id, "createdAt", "updatedAt", id, price) FROM stdin;
\.


--
-- Data for Name: UserDocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserDocuments" (application_id, doc_id, user_doc_id, "updatedAt", "createdAt", certified, this_doc_count) FROM stdin;
10684	221	5112	2021-05-26	2021-05-26	f	1
\.


--
-- Data for Name: UserPostageDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserPostageDetails" (postage_available_id, application_id, "createdAt", "updatedAt", id, postage_type) FROM stdin;
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.country (id, name, "in_EU", casebook_mapping) FROM stdin;
1	Afghanistan	f	Afghanistan
2	Akrotiri	t	Cyprus
3	Albania	f	Albania
4	Algeria	f	Algeria
5	Andorra	t	Andorra
6	Angola	f	Angola
7	Anguilla	f	Anguilla
8	Antigua and Barbuda	f	Antigua and Barbuda
9	Argentina	f	Argentina
10	Armenia	f	Armenia
11	Aruba	f	Aruba
12	Australia	f	Australia
13	Austria	t	Austria
14	Azerbaijan	f	Azerbaijan
15	Bahrain	f	Bahrain
16	Bangladesh	f	Bangladesh
17	Barbados	f	Barbados
18	Belarus	f	Belarus
29	Belgium	t	Belgium
20	Belize	f	Belize
21	Benin	f	Benin
22	Bermuda	f	Bermuda
23	Bhutan	f	Bhutan
24	Bolivia	f	Bolivia
25	Bonaire/St Eustatius/Saba	f	Bonaire,  Sint Eustatius and Saba
26	Bosnia and Herzegovina	f	Bosnia and Herzegovina
27	Botswana	f	Botswana
28	Brazil	f	Brazil
29	British Indian Ocean Territory	f	British Indian Ocean Territory
30	British Virgin Islands	f	British Virgin Islands
31	Brunei	f	Brunei
32	Bulgaria	t	Bulgaria
33	Burkina Faso	f	Burkina Faso
34	Burma	f	Burma
35	Burundi	f	Burundi
36	Cambodia	f	Cambodia
37	Cameroon	f	Cameroon
38	Canada	f	Canada
39	Cape Verde	f	Cape Verde
40	Cayman Islands	f	Cayman Islands
41	Central African Republic	f	Central African Republic
42	Chad	f	Chad
43	Chile	f	Chile
44	China	f	China
45	Colombia	f	Colombia
46	Comoros	f	Comoros
47	Congo	f	Congo
48	Congo (Democratic Republic)	f	Congo, Democratic Republic
49	Costa Rica	f	Costa Rica
50	Croatia	t	Croatia
51	Cuba	f	Cuba
52	Curaçao	f	Curaçao
53	Cyprus	t	Cyprus
54	Czech Republic	t	Czech Republic
55	Denmark	t	Denmark
56	Dhekelia	t	Cyprus
57	Djibouti	f	Djibouti
58	Dominica	f	Dominica
59	Dominican Republic	f	Dominican Republic
60	East Timor	f	Timor-Leste
61	Ecuador	f	Ecuador
62	Egypt	f	Egypt
63	El Salvador	f	El Salvador
64	Equatorial Guinea	f	Equatorial Guinea
65	Eritrea	f	Eritrea
66	Estonia	t	Estonia
67	Ethiopia	f	Ethiopia
68	Falkland Islands	f	Falkland Islands
69	Fiji	f	Fiji
70	Finland	t	Finland
71	France	t	France
72	French Guiana	f	French Guiana
73	French Polynesia	f	French Polynesia
74	Gabon	f	Gabon
75	Georgia	f	Georgia
76	Germany	t	Germany
77	Ghana	f	Ghana
78	Gibraltar	t	Gibraltar
79	Greece	t	Greece
80	Grenada	f	Grenada
81	Guadeloupe	f	Guadeloupe
82	Guatemala	f	Guatemala
83	Guinea	f	Guinea
84	Guinea-Bissau	f	Guinea-Bissau
85	Guyana	f	Guyana
86	Haiti	f	Haiti
87	Honduras	f	Honduras
98	Hong Kong	f	Hong Kong
89	Hungary	t	Hungary
90	Iceland	t	Iceland
91	India	f	India
92	Indonesia	f	Indonesia
93	Iran	f	Iran
94	Iraq	f	Iraq
95	Ireland	t	Ireland
96	Israel	f	Israel
97	Italy	t	Italy
98	Ivory Coast	f	Côte d'Ivoire
99	Jamaica	f	Jamaica
100	Japan	f	Japan
101	Jordan	f	Jordan
102	Kazakhstan	f	Kazakhstan
103	Kenya	f	Kenya
104	Kiribati	f	Kiribati
105	Kosovo	f	Kosovo
106	Kuwait	f	Kuwait
107	Kyrgyzstan	f	Kyrgyzstan
108	Laos	f	Laos
109	Latvia	t	Latvia
110	Lebanon	f	Lebanon
111	Lesotho	f	Lesotho
112	Liberia	f	Liberia
113	Libya	f	Libya
114	Liechtenstein	f	Liechtenstein
115	Lithuania	t	Lithuania
116	Luxembourg	t	Luxembourg
117	Macao	f	Macao
118	Macedonia	f	Macedonia
119	Madagascar	f	Madagascar
120	Malawi	f	Malawi
121	Malaysia	f	Malaysia
122	Maldives	f	Maldives
123	Mali	f	Mali
124	Malta	t	Malta
125	Marshall Islands	f	Marshall Islands
126	Martinique	f	Martinique
127	Mauritania	f	Mauritania
128	Mauritius	f	Mauritius
129	Mayotte	f	Mayotte
130	Mexico	f	Mexico
131	Micronesia	f	Micronesia
132	Moldova	f	Moldova
133	Monaco	t	Monaco
134	Mongolia	f	Mongolia
135	Montenegro	f	Montenegro
136	Montserrat	f	Montserrat
137	Morocco	f	Morocco
138	Mozambique	f	Mozambique
139	Namibia	f	Namibia
140	Nauru	f	Nauru
141	Nepal	f	Nepal
142	Netherlands	t	Netherlands
143	New Caledonia	f	New Caledonia
144	New Zealand	f	New Zealand
145	Nicaragua	f	Nicaragua
146	Niger	f	Niger
147	Nigeria	f	Nigeria
148	North Korea	f	North Korea
149	Norway	t	Norway
150	Oman	f	Oman
151	Pakistan	f	Pakistan
152	Palau	f	Palau
153	Panama	f	Panama
154	Papua New Guinea	f	Papua New Guinea
155	Paraguay	f	Paraguay
156	Peru	f	Peru
157	Philippines	f	Philippines
158	Pitcairn, Henderson, Ducie and Oeno Islands	f	Pitcairn Island
159	Poland	t	Poland
160	Portugal	t	Portugal
161	Qatar	f	Qatar
162	Réunion	f	Réunion
163	Romania	t	Romania
164	Russia	f	Russia
165	Rwanda	f	Rwanda
166	Saint-Barthélemy	f	Saint Barthélemy
167	Samoa	f	Samoa
168	San Marino	t	San Marino
169	Sao Tome and Principe	f	São Tomé and Príncipe
170	Saudi Arabia	f	Saudi Arabia
171	Senegal	f	Senegal
172	Serbia	f	Serbia
173	Seychelles	f	Seychelles
174	Sierra Leone	f	Sierra Leone
175	Singapore	f	Singapore
176	Slovakia	t	Slovakia
177	Slovenia	t	Slovenia
178	Solomon Islands	f	Solomon Islands
179	Somalia	f	Somalia
180	South Africa	f	South Africa
181	South Georgia and South Sandwich Islands	f	South Georgia and South Sandwich Islands
182	South Korea	f	South Korea
183	South Sudan	f	South Sudan
184	Spain	t	Spain
185	Sri Lanka	f	Sri Lanka
186	St Helena, Ascension and Tristan da Cunha	f	Saint Helena,  Ascension and Tristan da Cunha
187	St Kitts and Nevis	f	Saint Kitts and Nevis
188	St Lucia	f	Saint Lucia
189	St Maarten	f	St Maarten
190	St Martin	f	St Martin
191	St Pierre & Miquelon	f	St. Pierre and Miquelon
192	St Vincent	f	Saint Vincent and the Grenadines
193	Sudan	f	Sudan
194	Suriname	f	Suriname
196	Sweden	t	Sweden
197	Switzerland	t	Switzerland
198	Syria	f	Syria
199	Taiwan	f	Taiwan
200	Tajikistan	f	Tajikistan
201	Tanzania	f	Tanzania
202	Thailand	f	Thailand
203	The Bahamas	f	Bahamas
204	The Gambia	f	Gambia
205	The Occupied Palestinian Territories	f	The Occupied Palestinian Territories
206	Togo	f	Togo
207	Tonga	f	Tonga
208	Trinidad and Tobago	f	Trinidad and Tobago
209	Tunisia	f	Tunisia
210	Turkey	f	Turkey
211	Turkmenistan	f	Turkmenistan
212	Turks and Caicos Islands	f	Turks and Caicos Islands
213	Tuvalu	f	Tuvalu
214	Uganda	f	Uganda
215	Ukraine	f	Ukraine
216	United Arab Emirates	f	United Arab Emirates
217	United Kingdom	t	United Kingdom
218	United States	f	United States
219	Uruguay	f	Uruguay
220	Uzbekistan	f	Uzbekistan
221	Vanuatu	f	Vanuatu
222	Vatican City	t	Vatican City
223	Venezuela	f	Venezuela
224	Vietnam	f	Vietnam
225	Wallis and Futuna	f	Wallis and Futuna Islands
226	Western Sahara	f	Western Sahara
227	Yemen	f	Yemen
228	Zambia	f	Zambia
229	Zimbabwe	f	Zimbabwe
195	Eswatini	f	Swaziland
\.


--
-- Name: SubmissionAttempts_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SubmissionAttempts_submission_id_seq"', 1634, true);


--
-- Name: UserDocuments_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserDocuments_application_id_seq"', 1, false);


--
-- Name: application_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_application_id_seq', 10684, true);


--
-- Name: application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_id_seq', 52, true);


--
-- Name: applicationpaymentdetails_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applicationpaymentdetails_seq', 1, false);


--
-- Name: applicationtype_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applicationtype_seq', 3, true);


--
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.country_id_seq', 1, false);


--
-- Name: doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doc_id_seq', 260, true);


--
-- Name: exported_data; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exported_data', 966, true);


--
-- Name: postages_available_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postages_available_seq', 1, false);


--
-- Name: postagesavailable_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.postagesavailable_seq', 10, true);


--
-- Name: useradditionalapplicationinfo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.useradditionalapplicationinfo_seq', 4673, true);


--
-- Name: userdocumentcount_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userdocumentcount_seq', 9012, true);


--
-- Name: userdocuments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userdocuments_id_seq', 5112, true);


--
-- Name: userpostagedetails_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userpostagedetails_seq', 8513, true);


--
-- Name: yourdetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yourdetails_id_seq', 7221, true);


--
-- Name: ApplicationPaymentDetails ApplicationPaymentDetails_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationPaymentDetails"
    ADD CONSTRAINT "ApplicationPaymentDetails_pk" PRIMARY KEY (id);


--
-- Name: Application Application_application_guid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_application_guid_key" UNIQUE (application_guid);


--
-- Name: AvailableDocuments AvailableDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AvailableDocuments"
    ADD CONSTRAINT "AvailableDocuments_pkey" PRIMARY KEY (doc_id);


--
-- Name: PostagesAvailable PostagesAvailable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostagesAvailable"
    ADD CONSTRAINT "PostagesAvailable_pkey" PRIMARY KEY (id);


--
-- Name: SubmissionAttempts SubmissionAttempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubmissionAttempts"
    ADD CONSTRAINT "SubmissionAttempts_pkey" PRIMARY KEY (submission_id);


--
-- Name: AdditionalApplicationInfo UserAdditionalApplicationInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdditionalApplicationInfo"
    ADD CONSTRAINT "UserAdditionalApplicationInfo_pkey" PRIMARY KEY (id);


--
-- Name: UserDocumentCount UserDocumentCount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDocumentCount"
    ADD CONSTRAINT "UserDocumentCount_pkey" PRIMARY KEY (id);


--
-- Name: UserDocuments UserDocuments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDocuments"
    ADD CONSTRAINT "UserDocuments_pkey" PRIMARY KEY (user_doc_id);


--
-- Name: UserPostageDetails UserPostageDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserPostageDetails"
    ADD CONSTRAINT "UserPostageDetails_pkey" PRIMARY KEY (id);


--
-- Name: Application application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT application_pkey PRIMARY KEY (application_id);


--
-- Name: UserDetails person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserDetails"
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: ApplicationTypes pk_application_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationTypes"
    ADD CONSTRAINT pk_application_id PRIMARY KEY (id);


--
-- Name: FKI_SubmissionAttempts_Application; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FKI_SubmissionAttempts_Application" ON public."SubmissionAttempts" USING btree (application_id);


--
-- Name: idx_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_application_id ON public."Application" USING btree (application_id);


--
-- Name: ApplicationPaymentDetails ApplicationPaymentDetails_Application_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApplicationPaymentDetails"
    ADD CONSTRAINT "ApplicationPaymentDetails_Application_fk" FOREIGN KEY (application_id) REFERENCES public."Application"(application_id);


--
-- Name: SubmissionAttempts FK_SubmissionAttempts_Application; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubmissionAttempts"
    ADD CONSTRAINT "FK_SubmissionAttempts_Application" FOREIGN KEY (application_id) REFERENCES public."Application"(application_id);


--
-- PostgreSQL database dump complete
--

