/**
* Model ApplicationType.js
* @module Model ApplicationType
*/

module.exports = {

    attributes: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        applicationType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.VIRTUAL,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.VIRTUAL,
            allowNull: true
        }
    },
    options: {
        tableName: 'ApplicationTypes',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

