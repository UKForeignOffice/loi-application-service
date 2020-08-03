/**
* Model ApplicationType.js
* @module Model ApplicationType
*/

var Sequelize = require('sequelize');

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true
        },
        applicationType: {
            type: 'string',
            allowNull: false
        },
        updatedAt: {
            type: 'ref',
            columnType: 'timestamp',
            // allowNull: true
        },
        createdAt: {
            type: 'ref',
            columnType: 'timestamp',
            // allowNull: true
        }
    },
    options: {
        tableName: 'ApplicationTypes',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

