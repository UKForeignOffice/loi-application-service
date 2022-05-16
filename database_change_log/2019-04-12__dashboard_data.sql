-- Function: public.dashboard_data(integer, integer, integer, text, text, text, text, text)

-- DROP FUNCTION public.dashboard_data(integer, integer, integer, text, text, text, text, text);

CREATE OR REPLACE FUNCTION public.dashboard_data(
    IN _user_id integer,
    IN _limit integer,
    IN _offset integer,
    IN _orderby text,
    IN _direction text,
    IN query_string text,
    IN _secondaryorderby text DEFAULT NULL::text,
    IN _secondarydirection text DEFAULT NULL::text)
  RETURNS TABLE("createdDate" timestamp with time zone, unique_app_id text, applicationtype text, doc_count integer, payment_amount numeric, user_ref text, main_postcode text, result_count integer) AS
$BODY$
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
	ead.user_ref,
	ead.main_postcode, '
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
	ead.user_ref,
	ead.main_postcode, '
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
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.dashboard_data(integer, integer, integer, text, text, text, text, text)
  OWNER TO postgres;
