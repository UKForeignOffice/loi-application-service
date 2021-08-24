
# Database migrations

## Local DB

1. Author your migration in a .sql file and drop it into the `/database_change_log` folder.
2. Run the SQL file manually to apply the migration to the database
3. Commit the new file to Git

## Remote DB
1. The new migration file will be run manually against the remote database, as part of a deployment of the application.

# E-Apostille

1. EIA-86_update_users_electronic_apostilles.sql
1. EIA-89_create_uploaded_document_urls_table.sql
1. EIA-101_update_dashboard_data_function.sql
1. EIA-128_add_eApostille_application_type.sql
1. EIA-128_add_filename_to_document_urls_table.sql
1. EIA-128_create_export_eApp_data_to_table_function.sql
1. EIA-128_create_ExportateEAppData_table.sql
