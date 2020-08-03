/**
* Model ExportedApplicationData.js
* @module Model ExportedApplicationData
*/

var Sequelize = require('sequelize');

module.exports = {
    attributes: {
        id: {
          type: 'integer',
          autoIncrement: true
        },
        application_id: {
            type: 'number'
        },
        applicationType: {
            type: 'string'
        },
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        telephone: {
            type: 'string'
        },
        mobile_no: {
          type: 'string'
        },
        email: {
            type: 'string'
        },
        doc_count: {
            type: 'number'
        },
        special_instructions: {
            type: 'string'
        },
        user_ref: {
            type: 'string'
        },
        postage_return_title: {
            type: 'string'
        },
        postage_return_price: {
            type: 'number'
        },
        postage_send_title: {
            type: 'string'
        },
        postage_send_price: {
            type: 'number'
        },
        main_full_name: {
            type: 'string'
        },
        main_address_line1: {
            type: 'string'
        },
        main_address_line2: {
            type: 'string'
        },
        main_address_line3: {
            type: 'string'
        },
        main_town: {
            type: 'string'
        },
        main_county: {
            type: 'string'
        },
        main_country: {
            type: 'string'
        },
        alt_full_name: {
            type: 'string'
        },
        alt_address_line1: {
            type: 'string'
        },
        alt_address_line2: {
            type: 'string'
        },
        alt_address_line3: {
            type: 'string'
        },
        alt_town: {
            type: 'string'
        },
        alt_county: {
            type: 'string'
        },
        alt_country: {
            type: 'string'
        },
        total_docs_count_price: {
            type: 'string'
        },
        feedback_consent: {
            type: 'boolean'
        },
        unique_app_id: {
            type: 'string'
        },
        createdAt: {
            type: 'ref',
            columnType: 'timestamp',
        },
        updatedAt: {
            type: 'ref',
            columnType: 'timestamp',
        },
        payment_reference: {
            type: 'string'
        },
        payment_amount: {
            type: 'number'
        },
        submittedJSON: {
            type: 'json'
        }
},
options: {
    tableName: 'ExportedApplicationData'
}
}
;

