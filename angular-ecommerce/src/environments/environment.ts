// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Add the custom environment config
  fredsshopApiUrl: "http://localhost:8443/api",
  // fredsshopApiUrl: "http://freudsshop.us-east-2.elasticbeanstalk.com/api", // pointing towards AWS
  stripePublishableKey: "pk_test_51L5IuWANMeQDotHMyiGAWDvGn1NlHrMMG7BFN4p53pCSfv89Quxjbj51NdlkwCEAxXfQdCssfnsQGmmuZqcSB0Ya00DMWs8wYz"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
