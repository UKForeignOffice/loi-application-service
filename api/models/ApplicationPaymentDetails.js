/**
* Model ApplicationPaymentDetails.js
* @module Model ApplicationPaymentDetails
*/

var Sequelize = require('sequelize');

module.exports = {
    attributes: {
        id:{
            type: 'number',
            columnName: 'application_id',
            allowNull: false,
            autoIncrement: true
        },
        payment_complete:{
            type: 'boolean',
            allowNull: false,
            defaultsTo: false
        },
        payment_amount:{
            type: 'number',
            columnType: 'float',
            allowNull: false,
            defaultsTo: 0.00
        },
        payment_reference:{
            type: 'number',
            allowNull: true
        },
        payment_status:{
            type: 'string',
            allowNull: true
        },
        oneclick_reference:{
            type: 'string',
            allowNull: true
        }
    },

    options: {
        tableName: 'ApplicationPaymentDetails',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};
