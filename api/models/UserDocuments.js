/**
* Model UserDocuments.js
* @module Model UserDocuments
*/

module.exports = {

    attributes: {
        application_id:{
            type: Sequelize.INTEGER(),
            allowNull: false
        },
        doc_id: {
            type: Sequelize.INTEGER(),
            allowNull: false,
            primaryKey: true
        },
        certified: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        this_doc_count: {
            type: Sequelize.INTEGER,
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

