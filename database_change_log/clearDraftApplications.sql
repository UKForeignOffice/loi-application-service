SELECT application_id INTO TEMPORARY to_delete
FROM "Application"
WHERE submitted='draft' AND application_start_date < NOW() - INTERVAL '60 days';

DELETE FROM "UserDetails"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "AddressDetails"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "UserDocumentCount"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "UserDocuments"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "UserPostageDetails"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "AdditionalApplicationInfo"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "ApplicationPaymentDetails"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "ExportedApplicationData"
WHERE application_id in (SELECT * FROM to_delete);

DELETE FROM "Application"
WHERE application_id in (SELECT * FROM to_delete);

DROP TABLE to_delete;
