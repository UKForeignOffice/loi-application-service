/**
* Model ExportedApplicationData.js
* @module Model ExportedApplicationData
*/

module.exports = {
    attributes: {

        application_id: {
            type: Sequelize.INTEGER()
        },
        "applicationType": {
            type: Sequelize.STRING()
        },
        first_name: {
            type: Sequelize.STRING()
        },
        last_name: {
            type: Sequelize.STRING()
        },
        telephone: {
            type: Sequelize.STRING()
        },
      mobile_no: {
        type: Sequelize.STRING()
      },
        email: {
            type: Sequelize.STRING()
        },
        doc_count: {
            type: Sequelize.INTEGER()
        },
        special_instructions: {
            type: Sequelize.STRING()
        },
        user_ref: {
            type: Sequelize.STRING()
        },
        postage_return_title: {
            type: Sequelize.STRING()
        },
        postage_return_price: {
            type: Sequelize.INTEGER()
        },
        postage_send_title: {
            type: Sequelize.STRING()
        },
        postage_send_price: {
            type: Sequelize.INTEGER()
        },
        main_full_name: {
            type: Sequelize.STRING()
        },
        main_address_line1: {
            type: Sequelize.STRING()
        },
        main_address_line2: {
            type: Sequelize.STRING()
        },
        main_address_line3: {
            type: Sequelize.STRING()
        },
        main_town: {
            type: Sequelize.STRING()
        },
        main_county: {
            type: Sequelize.STRING()
        },
        main_country: {
            type: Sequelize.STRING()
        },
        alt_full_name: {
            type: Sequelize.STRING()
        },
        alt_address_line1: {
            type: Sequelize.STRING()
        },
        alt_address_line2: {
            type: Sequelize.STRING()
        },
        alt_address_line3: {
            type: Sequelize.STRING()
        },
        alt_town: {
            type: Sequelize.STRING()
        },
        alt_county: {
            type: Sequelize.STRING()
        },
        alt_country: {
            type: Sequelize.STRING()
        },
        total_docs_count_price: {
            type: Sequelize.STRING()
        },
        feedback_consent: {
            type: Sequelize.BOOLEAN()
        },
        unique_app_id: {
            type: Sequelize.STRING()
        },
        createdAt: {
            type: Sequelize.DATE()
        },
        updatedAt: {
            type: Sequelize.DATE()
        },
        payment_reference: {
            type: Sequelize.STRING()
        },
        payment_amount: {
            type: Sequelize.INTEGER()
        },
        submittedJSON: {
            type: Sequelize.JSON()
        }


},
options: {
    tableName: 'ExportedApplicationData'
}
}
;

