/**
 * Model ExportedEAppData.js
 * @module Model ExportedEAppData
 */

module.exports = {
    attributes: {
        application_id: {
            type: Sequelize.INTEGER(),
        },
        applicationType: {
            type: Sequelize.STRING(),
        },
        first_name: {
            type: Sequelize.STRING(),
        },
        last_name: {
            type: Sequelize.STRING(),
        },
        telephone: {
            type: Sequelize.STRING(),
        },
        mobileNo: {
            type: Sequelize.STRING(),
        },
        email: {
            type: Sequelize.STRING(),
        },
        doc_count: {
            type: Sequelize.INTEGER(),
        },
        user_ref: {
            type: Sequelize.STRING(),
        },
        feedback_consent: {
            type: Sequelize.BOOLEAN(),
        },
        unique_app_id: {
            type: Sequelize.STRING(),
        },
        createdAt: {
            type: Sequelize.DATE(),
        },
        updatedAt: {
            type: Sequelize.DATE(),
        },
        payment_reference: {
            type: Sequelize.STRING(),
        },
        payment_amount: {
            type: Sequelize.INTEGER(),
        },
    },
    options: {
        tableName: 'ExportedEAppData',
    },
};
