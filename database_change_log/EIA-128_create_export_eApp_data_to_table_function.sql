-- Run against FCO-LOI-Service fco_service

CREATE OR REPLACE FUNCTION public.populate_exportedeApostilleAppdata(_application_id integer) RETURNS integer
AS $$
DECLARE
    rows_affected integer;
BEGIN
WITH rows AS (
    INSERT INTO "ExportedEAppData" (
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
        feedback_consent,
        unique_app_id,
        user_id,
        company_name,
        "createdAt"
    )
    select
        app.application_id,
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
        (select feedback_consent AS feedback_consent from "Application"
        where application_id = _application_id),
        (select unique_app_id AS unique_app_id from "Application"
        where application_id = _application_id),
        (select user_id AS user_id from "Application"
        where application_id = _application_id),
        (select company_name AS company_name from "Application"
        where application_id = _application_id),
        NOW()
        from "Application" app
        join "ApplicationTypes" aty on aty.id = app."serviceType"
        join "UserDetails" ud on ud.application_id = app.application_id
        join "UserDocumentCount" udc on udc.application_id = app.application_id
        join "AdditionalApplicationInfo" aai on aai.application_id = app.application_id
        join "ApplicationPaymentDetails" pymt on aai.application_id = pymt.application_id
        where app.application_id = _application_id
        and not exists(select * from "ExportedEAppData" where application_id = _application_id)
        RETURNING 1
)

SELECT count(*) into rows_affected FROM Rows;
RETURN rows_affected;
END;
$$
LANGUAGE plpgsql VOLATILE COST 100;
