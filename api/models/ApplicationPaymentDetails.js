/**
* Model ApplicationPaymentDetails.js
* @module Model ApplicationPaymentDetails
*/

module.exports = {
    attributes: {
        application_id:{
            type: Sequelize.INTEGER(),
            allowNull: false
        },
        payment_complete:{
            type: Sequelize.BOOLEAN(),
            allowNull: false,
            defaultValue: false
        },
        payment_amount:{
            type: Sequelize.DECIMAL,
            allowNull: false,
            defaultValue: 0.00
        },
        payment_reference:{
            type: Sequelize.INTEGER(),
            allowNull: true
        },
        oneclick_reference:{
            type: Sequelize.STRING,
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
