
# Document checker

## Searching for a document
This tool has two ways of working, client side and server side.

The client side triggers a typeahead when the user starts typing in the input.


### Client side:

1. Clickling on a typeahead result, the search button, or one of the links from the top search this function gets triggered, main.js > ajaxSearch()

2. This makes a GET call to the follwoing url `/select-documents` with the search term string as a param.
_NOTE: This code uses the String.substr() method which is depreciated_

3. This returns HTML from `documentCheckerResults.ejs` specific to the searchTerm

4. The data for documents that can be legalised is retrieved using the find_documents stored function

5. This gets data from the **AvailableDocuments** table

6. The results html is for the Documents/Actions table and contains both links to Select or Remove a document type which shows and hides using on css.

7. Clicking on Select or Remove triggers either the `/add-document-ajax/:doc_id` or `/remove-document-ajax/:doc_id` GET api calls respectively.

8. These either add or remove a document from the session


### Server side:

1. Only works when search button is clicks on ENTER key is hit

2. This makes a GET to `action="/select-documents"` me from the <form> in documentsCheckerDocsSelector.ejs

3. Because `/select-documents` is a GET and not a POST the searchTerm is passed in as a query param

3. This returns HTML that is used to render the Document/Action table


## Displaying selected documents

1. This is rendered by the `docukentsCheckerBasker.ejs` template

2. It reads the documents that have been added to the session and renders the bottom section based on that.

3. When a document quantity is updated on the **server** this makes a POST request to `/manual-update-doc-count` which updates the document quantity in the session and redirects to the same page

4. When this happens on the **client** a POST call is made to `/update-doc-count` which updates the document quantity in the session and returns 'Pass'

_NOTE: all the Promises in the DocumentCheckerController do not have their errors handled_

## Important files
documentsCheckerSearch.ejs - search input
DocumentCheckerController.js
docukentsCheckerBasker.ejs - button section, selected documents
