var EU =["Austria","Andorra","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark", "Estonia","Finland",
    "France","Germany", "Greece","Hungary","Ireland","Italy","Latvia", "Lithuania", "Luxembourg","Malta",
    "Netherlands","Poland", "Portugal","Romania","Slovakia", "Slovenia", "Spain","Sweden","Iceland",
    "Norway", "Switzerland"
];
var nonValidEU = ['Albania', 'Armenia', 'Azerbaijan', 'Belarus', 'Bosnia and Herzegovina', 'Georgia',
    'Liechtenstein', 'Kazakhstan', 'Macedonia', 'Moldova', 'Montenegro', 'Russia', 'Serbia', 'Turkey', 'Ukraine'];

var LocationService = {

    getCountries: function() {
        countriesSQL = 'SELECT  name FROM "country" ORDER BY name ASC ';
        return sequelize.query(countriesSQL);
    },

    /**
     * Depending on the users address country, certain return address postage options must be hidden.
     * When a user updates their address country, then they must also change the selected return postage option, in case
     * their new country does not allow it, so this acts as a little checker, and if needed facilitates
     * redirecting the user back to the return postage options page after changing their country address.
     * @param country
     * @returns {number[]}
     */
    getReturnOption: function(country){
        if(country=='United Kingdom'){
            return [7,8];

        }
        else if(inEU(country)){
            return [9] ;//ID of EU Option
        }
        else{
            return [10]; //ID of International Option
        }

        function inEU(country) {
            for (var i = 0; i < EU.length; i++) {
                if (EU[i] == country) {
                    return true;
                }
            }
        }

    },

    postcodeLookup: function postcodeLookup(postcode) {
      var rp = require('request-promise');
      var options = JSON.parse(JSON.stringify(sails.config.customURLs.postcodeLookUpApiOptions));
      options.uri = options.uri+postcode;

      return rp({
        uri: options.uri,
        timeout: options.timeout
      },
        function(err){
          console.log(err)
        });
    }

};
module.exports = LocationService;
