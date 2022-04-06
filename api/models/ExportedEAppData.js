module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ExportedEAppData', {
        application_id: {
            type: DataTypes.INTEGER,
        },
        applicationType: {
            type: DataTypes.STRING,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        telephone: {
            type: DataTypes.STRING,
        },
        mobileNo: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        doc_count: {
            type: DataTypes.INTEGER,
        },
        user_ref: {
            type: DataTypes.STRING,
        },
        feedback_consent: {
            type: DataTypes.BOOLEAN,
        },
        unique_app_id: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        payment_reference: {
            type: DataTypes.STRING,
        },
        payment_amount: {
            type: DataTypes.INTEGER,
        },
    })
};
