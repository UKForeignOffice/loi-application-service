module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ExportedApplicationData', {

    application_id: {
      type: DataTypes.INTEGER
    },
    "applicationType": {
      type: DataTypes.STRING
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    telephone: {
      type: DataTypes.STRING
    },
    mobile_no: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    doc_count: {
      type: DataTypes.INTEGER
    },
    special_instructions: {
      type: DataTypes.STRING
    },
    user_ref: {
      type: DataTypes.STRING
    },
    postage_return_title: {
      type: DataTypes.STRING
    },
    postage_return_price: {
      type: DataTypes.INTEGER
    },
    postage_send_title: {
      type: DataTypes.STRING
    },
    postage_send_price: {
      type: DataTypes.INTEGER
    },
    main_full_name: {
      type: DataTypes.STRING
    },
    main_address_line1: {
      type: DataTypes.STRING
    },
    main_address_line2: {
      type: DataTypes.STRING
    },
    main_address_line3: {
      type: DataTypes.STRING
    },
    main_town: {
      type: DataTypes.STRING
    },
    main_county: {
      type: DataTypes.STRING
    },
    main_country: {
      type: DataTypes.STRING
    },
    alt_full_name: {
      type: DataTypes.STRING
    },
    alt_address_line1: {
      type: DataTypes.STRING
    },
    alt_address_line2: {
      type: DataTypes.STRING
    },
    alt_address_line3: {
      type: DataTypes.STRING
    },
    alt_town: {
      type: DataTypes.STRING
    },
    alt_county: {
      type: DataTypes.STRING
    },
    alt_country: {
      type: DataTypes.STRING
    },
    total_docs_count_price: {
      type: DataTypes.STRING
    },
    feedback_consent: {
      type: DataTypes.BOOLEAN
    },
    unique_app_id: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    payment_reference: {
      type: DataTypes.STRING
    },
    payment_amount: {
      type: DataTypes.INTEGER
    },
    submittedJSON: {
      type: DataTypes.JSON
    }
  });
};

