import { IdentityService } from './identity.service';
import { Injectable } from '@angular/core';
import { adal } from 'adal-angular';

declare var AuthenticationContext: adal.AuthenticationContextStatic;
const createAuthContextFn: adal.AuthenticationContextStatic = AuthenticationContext;
@Injectable({
    providedIn: 'root'
})

export class AdalService {

    private context: adal.AuthenticationContext;

    constructor(private identityService: IdentityService) {
        this.context = new createAuthContextFn(identityService.getAdalConfig);
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
        return this.context.getCachedToken(this.identityService.getAdalConfig.clientId);
    }

    public get isAuthenticated() {
        return this.userInfo && this.accessToken;
    }
}
