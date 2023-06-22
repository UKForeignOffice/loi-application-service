FUNCTION: public.populate_exportedapplicationdata(integer)

DROP FUNCTION IF EXISTS public.populate_exportedapplicationdata(integer);

CREATE OR REPLACE FUNCTION public.populate_exportedapplicationdata(
	_application_id integer)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
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
        where pa.type='return' and upd.application_id=_application_id LIMIT 1),
        (select pa.price as postage_return_price  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='return' and upd.application_id=_application_id LIMIT 1),
        (select pa.title as postage_send_title  from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id LIMIT 1),
        (select pa.price as postage_send_price from "UserPostageDetails" upd
        join "PostagesAvailable" pa on upd.postage_available_id=pa.id
        where pa.type='send' and upd.application_id=_application_id LIMIT 1),
        (select full_name AS main_full_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select organisation AS main_organisation from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select Replace(house_name, 'N/A', '') AS main_house_name from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select street AS main_street from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select town AS main_town from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select county AS main_county from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select casebook_mapping AS main_country from "country" country, "AddressDetails" addd
        where country.name=addd.country and addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select postcode AS main_postcode from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select telephone AS main_telephone from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select email AS main_email from "AddressDetails" addd
        where addd.type='main' and addd.application_id=_application_id LIMIT 1),
        (select full_name AS alt_full_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select organisation AS alt_organisation from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select Replace(house_name, 'N/A', '') AS alt_house_name from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select street AS alt_street from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select town AS alt_town from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select county AS alt_county from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select casebook_mapping AS alt_country from "country" country, "AddressDetails" addd
        where country.name=addd.country and addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select postcode AS alt_postcode from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select telephone AS alt_telephone from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select email AS alt_email from "AddressDetails" addd
        where addd.type='alt' and addd.application_id=_application_id LIMIT 1),
        (select price AS total_doc_count_price from "UserDocumentCount"
        where application_id=_application_id LIMIT 1),
        (select feedback_consent AS feedback_consent from "Application"
        where application_id=_application_id LIMIT 1),
        (select unique_app_id AS unique_app_id from "Application"
        where application_id=_application_id LIMIT 1),
        (select user_id AS user_id from "Application"
        where application_id=_application_id LIMIT 1),
        (select company_name AS company_name from "Application"
        where application_id=_application_id LIMIT 1),
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
$BODY$;

ALTER FUNCTION public.populate_exportedapplicationdata(integer)
    OWNER TO fco_service;
