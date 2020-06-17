// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tenant: 'tekninjas.com',
  // UAT:
  clientId: 'a0466aac-cfcd-4cb9-a123-c5f4ef3f6bb6',
  //// Prod:
  // clientId: '9b9508ee-8fe2-4769-8de8-de6871c7c730',
  userApiKey: 'http://localhost:53138/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
