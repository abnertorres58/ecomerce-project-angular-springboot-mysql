import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import  myAppConfig  from '../../config/my-app-config'
import * as OktaSignIn from '@okta/okta-signin-widget';



// noinspection TypeScriptValidateTypes
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    // @ts-ignore
    this.oktaSignin = new OktaSignIn({

      // logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }

  // ngOnInit(): void {
  //   this.oktaSignin.remove();
  //   this.oktaSignin.renderEl({
  //       el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
  //
  //     (response) => {
  //       if (response.status === 'SUCCESS') {
  //         console.log("**** Loging successfull");
  //         this.oktaAuth.signInWithRedirect();
  //       }
  //     },
  //     (error) => {
  //       throw error;
  //     }
  //   );
  // }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.showSignInToGetTokens({
      el: '#okta-sign-in-widget'},
      (response) => {
              if (response.status === 'SUCCESS') {
                console.log("**** Loging successfull");
              }
            },
            (error) => {
              throw error;
            }
      ).then((tokens) => {
      // Add tokens to storage
      this.oktaAuth.handleLoginRedirect(tokens);
    }).catch((err) => {
      throw err;
    });
  }
}
