/**
* Model AvailableDocuments.js
* @module Model AvailableDocuments
*/

var Sequelize = require('sequelize');

module.exports = {

    attributes: {
        id: {
          type: 'integer',
          columnName: 'doc_id',
          autoIncrement: true

        },
        doc_title:{
            type: 'string'
        },
        doc_title_start:{
            type: 'string'
        },
        doc_title_mid:{
            type: 'string'
        },
        doc_type_id: {
            type: 'string'
        },
        html_id: {
           type: 'string'
        },
        certification_required:{
            type: 'boolean'
        },
        additional_detail:{
            type: 'string'
        },
        legislation_allowed:{
            type: 'boolean'
        },
        photocopy_allowed:{
            type: 'boolean'
        },
        certification_notes:{
            type: 'string'
        },
        updatedAt: {
            type: 'ref',
            columnType: 'timestamp',
        },
        createdAt: {
            type: 'ref',
            columnType: 'timestamp',
        },
        eligible_check_option_1: {
            type: 'string'
        },
        eligible_check_option_2: {
            type: 'string'
        },
        eligible_check_option_3: {
            type: 'string'
        },
        eligible_check_option_4: {
            type: 'string'
        },
        legalisation_clause: {
            type: 'string'
        },
        kind_of_document: {
            type: 'string'
        },
        synonyms: {
            type: 'string'
        },
        extra_title_text: {
            type: 'string'
        }
    },
    options: {
        tableName: 'AvailableDocuments',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

