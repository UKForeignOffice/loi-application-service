
# Database migrations

## Local DB

1. Author your migration in a .sql file and drop it into the `/database_change_log` folder.
2. Run the SQL file manually to apply the migration to the database
3. Commit the new file to Git

## Remote DB
1. The new migration file will be run manually against the remote database, as part of a deployment of the application.
