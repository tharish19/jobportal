
import { ApiService } from './api.service';

import { Injectable } from '@angular/core';

import { adal } from 'adal-angular';
declare var AuthenticationContext: adal.AuthenticationContextStatic;
let createAuthContextFn: adal.AuthenticationContextStatic = AuthenticationContext;
@Injectable({
  providedIn: 'root'
})

export class AdalService {

private context: adal.AuthenticationContext;

constructor(private configService: ApiService) {

this.context = new createAuthContextFn(configService.getAdalConfig);

    }

login() {

this.context.login();

    }

logout() {

this.context.logOut();

    }

handleCallback() {

this.context.handleWindowCallback();

    }

public get userInfo() {

return this.context.getCachedUser();

    }

public get accessToken() {

return this.context.getCachedToken(this.configService.getAdalConfig.clientId);

    }

public get isAuthenticated() {

return this.userInfo && this.accessToken;

    }

}