/**
 * Created by LeKemsty on 07/03/2018.
 */
module.exports = {
    'facebookAuth': {
        'clientID' : '1616907168428310',
        'clientSecret':'72d4a1de22884406590e7ca47adc42ba',
        'callbackURL': 'www.superambitiongirls.com/users/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name']
    },

    'twitterAuth' : {
        'consumerKey': ' csm22voaz0xtRLIs4kkpTl1zI',
        'consumerSecret': 'GWbmQ2vf4VkzzRRowH8ZQipadEfLXa2SVHvAfHYwoZBcekZo6u',
        'callbackURL': 'http://localhost:3000/users/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID' : ' 143766307213-3a0pa0p295kn6q7sst43hmna25jq7j5q.apps.googleusercontent.com ',
        'clientSecret': ' ntJUN7Au-Tf5sPVY1F4m5rLY ',
        'callbackURL': 'http://localhost:3000/users/auth/google/callback'
    }
};