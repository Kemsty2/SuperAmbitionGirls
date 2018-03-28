/**
 * Created by LeKemsty on 07/03/2018.
 */
module.exports = {
    'facebookAuth': {
        'clientID' : '1616907168428310',
        'clientSecret':'72d4a1de22884406590e7ca47adc42ba',
        'callbackURL': 'https://www.superambitiongirls.com/users/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name']
    },

    'twitterAuth' : {
        'consumerKey': '9TzeuTGNeNMNBAEj4Ukg2QMQD',
        'consumerSecret': 'POPxW2EuUI67PFGCXtD7owsb0tD0izpzcOyMDrucTf4XTiLfb4',
        'callbackURL': 'https://www.superambitiongirls.com/users/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID' : '571284055306-1hlgcqo93kuo0pes7td9dvhucahnn933.apps.googleusercontent.com',
        'clientSecret': 'ivq5vmLg9V6wQSFPgbTEfS2J',
        'callbackURL': 'https://www.superambitiongirls.com/users/auth/google/callback'
    }
};