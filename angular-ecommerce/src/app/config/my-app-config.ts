export default {

  oidc: {
    clientId: '0oa54mwi8xcsnqfMk5d7',
    issuer: 'https://dev-74646655.okta.com/oauth2/default',
    redirectUri: 'https://localhost:4200/login/callback',
    // redirectUri: 'http://localhost:8443/login/callback', // pointing towards port 8443
    // redirectUri: 'http://freudsshop.us-east-2.elasticbeanstalk.com/login/callback', // pointing towards aws
    scopes: ['openid', 'profile', 'email']
  }

}
