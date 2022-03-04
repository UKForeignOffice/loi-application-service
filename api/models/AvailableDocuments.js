module.exports = function(sequelize, DataTypes) {

  return sequelize.define('AvailableDocuments', {
    doc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    doc_title:{
      type: DataTypes.STRING
    },
    doc_title_start:{
      type: DataTypes.STRING
    },
    doc_title_mid:{
      type: DataTypes.STRING
    },
    doc_type_id: {
      type: DataTypes.STRING
    },
    html_id: {
      type: DataTypes.STRING
    },
    certification_required:{
      type: DataTypes.BOOLEAN
    },
    additional_detail:{
      type: DataTypes.STRING
    },
    legislation_allowed:{
      type: DataTypes.BOOLEAN
    },
    photocopy_allowed:{
      type: DataTypes.BOOLEAN
    },
    certification_notes:{
      type: DataTypes.STRING
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    eligible_check_option_1: {
      type: DataTypes.STRING
    },
    eligible_check_option_2: {
      type: DataTypes.STRING
    },
    eligible_check_option_3: {
      type: DataTypes.STRING
    },
    eligible_check_option_4: {
      type: DataTypes.STRING
    },
    eligible_check_option_5: {
      type: DataTypes.STRING
    },
    eligible_check_option_6: {
      type: DataTypes.STRING
    },
    legalisation_clause: {
      type: DataTypes.STRING
    },
    kind_of_document: {
      type: DataTypes.STRING
    },
    synonyms: {
      type: DataTypes.STRING
    },
    extra_title_text: {
      type: DataTypes.STRING
    }
  });
};

