# FCO Legalisation Service

## About

The FCO Legalisation Service (Get a Document Legalised) allows citizens to submit an application and pay for documents to be legalised. You can get certain official UK documents ‘legalised’ by asking the Legalisation Office to confirm that the signature, stamp or seal is from a UK public official.

You might need to do this if an official in another country has asked you to provide a UK document and they’ve said it must be legalised.

The Legalisation Office will check the document, including whether the signature, stamp or seal is genuine. They’ll legalise the document by attaching a stamped official certificate (an ‘apostille’) to it.

You cannot get documents issued outside the UK legalised using this service - get them legalised in the country they were issued.

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- Get added to the team KeyBase to access .env files
- Postgres 9.6
- Redis
- Node 12.18
- Clone:
  - https://github.com/UKForeignOffice/loi-address-service
  - https://github.com/UKForeignOffice/loi-application-service
  - https://github.com/UKForeignOffice/loi-notification-service
  - https://github.com/UKForeignOffice/loi-payment-service
  - https://github.com/UKForeignOffice/loi-submission-service
  - https://github.com/UKForeignOffice/loi-user-service

### Installation

Import the FCO-LOI-Service and FCO-LOI-User databases. These can be found in the 'databases' folder of this repo.

If PSQL isn't installed:

```
brew install libpq
```

Open the PSQL command line
```
psql -h localhost -p 5432 -U postgres
```
You'll be asked for the password for the postgres user; you can get this from the .env file for loi-application-service.

In the PSQL command line:
```
CREATE DATABASE "FCO-LOI-Service";
CREATE DATABASE "FCO-LOI-User";
```

Then type \q to exit to your shell, and enter:
```
psql -h localhost -p 5432 -U postgres -W -d FCO-LOI-Service < ./databases/FCO-LOI-Service.sql
psql -h localhost -p 5432 -U postgres -W -d FCO-LOI-User < ./databases/FCO-LOI-User.sql
```

From Keybase, drop each services .env file into the root of the appropriate repo.

Install node modules in each repo

`npm -i`

### Running

Run each service

```
cd loi-application-service
npm start

cd loi-user-service
npm start

cd loi-address-service
node server.js 7878

cd loi-notification-service
node server.js 1234

cd loi-payment-service
node server.js 4321

cd loi-submission-service
npm start
```

Browse to http://localhost:1337
