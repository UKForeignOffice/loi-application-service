/**
* Model AvailableDocuments.js
* @module Model AvailableDocuments
*/


module.exports = {

    attributes: {
        doc_id: {
            type: Sequelize.INTEGER(),
            primaryKey: true
        },
        doc_title:{
            type: Sequelize.STRING
        },
        doc_title_start:{
          type: Sequelize.STRING
        },
        doc_title_mid:{
          type: Sequelize.STRING
        },
        doc_type_id: {
            type: Sequelize.STRING
        },
        html_id: {
            type: Sequelize.STRING
        },
        certification_required:{
            type: Sequelize.BOOLEAN
        },
        additional_detail:{
            type: Sequelize.STRING
        },
        legislation_allowed:{
            type: Sequelize.BOOLEAN
        },
        photocopy_allowed:{
            type: Sequelize.BOOLEAN
        },
        certification_notes:{
            type: Sequelize.STRING
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        createdAt: {
            type: Sequelize.DATE
        },
        eligible_check_option_1: {
            type: Sequelize.STRING
        },
        eligible_check_option_2: {
            type: Sequelize.STRING
        },
        eligible_check_option_3: {
            type: Sequelize.STRING
        },
        eligible_check_option_4: {
            type: Sequelize.STRING
        },
        eligible_check_option_5: {
            type: Sequelize.STRING
        },
        eligible_check_option_6: {
            type: Sequelize.STRING
        },
        legalisation_clause: {
            type: Sequelize.STRING
        },
        kind_of_document: {
            type: Sequelize.STRING
        },
        synonyms: {
            type: Sequelize.STRING
        },
        extra_title_text: {
            type: Sequelize.STRING
        }
    },
    options: {
        tableName: 'AvailableDocuments',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

