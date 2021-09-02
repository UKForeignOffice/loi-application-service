## Tabled added for e-Apostille

There has been two new tables added to the FCO-LOI-Service database.

### 1. Uploaded document Urls

This table stores the S3 urls (as presigned urls) of uploaded documents. The urls expire after 24 hours (1440 minutes), and they are sent along with other applications details to Casebook for them to download and legalise the document.

### 2. ExportedEAppData

This table is similar to the ExportedApplicationData one apart from it only exports application data for eApps. This means no postage information or address informaiton is needed. Arguiably the ExportedApplicationData could have been used for regular and eApps but there would have been so much information that would need to be ignored it made more sense to have a new table with a seperate stored procedure to collect data for that table.