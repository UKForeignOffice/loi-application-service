/**
 * Created by preciousr on 04/03/2016.
 */
/**
 * FCO LOI AccountDetails Management
 * AccountDetails Model
 *
 *
 */

var Sequelize = require('sequelize');

var attributes = {
    id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true
    },

    first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            notEmpty: {
                msg: JSON.stringify([{
                    "errInfo": 'You have not provided your first name',
                    "errSoltn": 'Please enter your first name',
                    "questionId" : 'first_name'
                }])
            }

        }
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            notEmpty: {
                msg: JSON.stringify([{
                    "errInfo": 'You have not provided your last name',
                    "errSoltn": 'Please enter your last name',
                    "questionId" : 'last_name'
                }])
            }
        }
    },
    telephone: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isNumeric:{
                msg: JSON.stringify([{
                    "errInfo": 'You have not provided a valid phone number',
                    "errSoltn": 'Please enter a valid phone number',
                    "questionId" : 'telephone'
                }])
            },
            len:{
                args: [0,12],
                msg: JSON.stringify([{
                    "errInfo": 'The telephone you have provided is too short',
                    "errSoltn": 'Please enter a valid phone number',
                    "questionId" : 'telephone'
                }])
            }
        }
    },
    company_name: {
        type: Sequelize.STRING,
        allowNull: true


    },
    company_number: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isNumeric:{
                msg: JSON.stringify([{
                    "errInfo": 'You have not provided a valid company number',
                    "errSoltn": 'Please enter a valid company number',
                    "questionId" : 'company number'
                }])
            },
            len:{
                args: [0,12],
                msg: JSON.stringify([{
                    "errInfo": 'The telephone you have provided is too short',
                    "errSoltn": 'Please enter a valid company number',
                    "questionId" : 'company'
                }])
            }
        }
    },
    feedback_consent: {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: JSON.stringify([{
                    "errInfo": 'You have not provided an answer to the feedback question.',
                    "errSoltn": 'Answer the feedback question.',
                    "questionId": 'feedback_consent'
                }])
            }
        }
    },
    complete : {type: 'boolean', default: false},
    user_id : {type: 'integer', allowNull:false}


};

var options = {
    freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;