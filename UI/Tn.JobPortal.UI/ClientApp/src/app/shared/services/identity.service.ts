import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { Client } from '@microsoft/microsoft-graph-client';
// import { async } from '@angular/core/testing';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IdentityService {

  token: any = 'my-auth-token';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // public graphApi: Client;
  constructor() {
    //this.graphApi = Client.init({
    //  authProvider: async (done) =>
    //    done(null, this.token)
    //});
  }

  //async GetGroupMembers(): Promise<any[]> {
  //  // const options = {
  //  //   authProvider,
  //  // };

  //  // const client = Client.init(options);

  //  return await this.graphApi.api('/groups/eefd7503-f4ce-4702-87a2-066e8ee4082f/members').get();

  //  // return this.graphClient.api('https://graph.microsoft.com/v1.0/groups/eefd7503-f4ce-4702-87a2-066e8ee4082f/members');
  //}

  public get getAdalConfig(): any {
    return {
      tenant: environment.tenant,
      clientId: environment.clientId,
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/'
    };
  }
}
