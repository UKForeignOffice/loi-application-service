/**
* Model UserDocuments.js
* @module Model UserDocuments
*/

var Sequelize = require('sequelize');

module.exports = {

    attributes: {
        id: {
          type: 'number',
          columnName: 'doc_id',
          required: true,
          allowNull: false,
        },
        application_id:{
            type: 'number',
            allowNull: false
        },
        certified: {
            type: 'boolean',
            allowNull: false
        },
        this_doc_count: {
            type: 'number',
            allowNull: false,
            defaultsTo: 1
        }
    },
    options: {
        tableName: 'UserDocuments',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

