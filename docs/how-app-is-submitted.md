
# How an application is submitted

This process uses a kind of psuedo queing system, basically changing the application submitted value based on if it's in the queue, if it has failed submission or if it has been submitted.

## Pre applicaiton submission

1. This happens int the `ApplicationController.exportAppData` method.

2. All the applicaiton data is stored to the exports table using a postgres stored procedure, so no Javascript code.
(accumulates all the data in a format the casebook API understands)

3. Then changes submitted value of the applicaiton in the Application table to `queued`


#### The `loi-submission-service` takes control from this point.

4. The submission service looks for the queued application

5. Then gets the relevant applicaiton information from the `ExportedApplicationData` table

6. Formats the address correctly, then formats the rest of the data to JSON

7. Makes a POST request to the casebook `submitApplicaiton` api endpoint

8. If successful, the submitted value in the Applications table changes to `submitted`

9. If unsuccessful it will increment the submission attempts and adds that to the database


## Post applicaiton submission

1. This happens int the `ApplicationController.confirmation` method.

2. Each function after the async.series runs one after the other and amalgamates in a results object that looks a bit likt this:

```js
results = {
    Application: {},
    UsersBasicDetails: {},
    PostageDetails: {},
    totalPricePaid: {},
    documentsSelected: {},
    AdditionalApplicationInfo: {},
}
```

The object key values are taken from the key values used in the `async.series`.
https://caolan.github.io/async/v3/docs.html#series

3. After that it redirect to the `applicationSubmissionSuccessful.ejs` page
