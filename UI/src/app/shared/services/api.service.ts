import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  // API_KEY = 'https://rest-api-jobs.azurewebsites.net';
  API_KEY = 'http://localhost:53138';
  token: any = 'my-auth-token';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor() {
  }

  public get getAdalConfig(): any {
    return {
      tenant: 'tekninjas.com',
      clientId: '9b9508ee-8fe2-4769-8de8-de6871c7c730',
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/'
    };
  }
}
