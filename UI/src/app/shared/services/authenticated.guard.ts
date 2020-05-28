import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';

import { AdalService } from './adal.service';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {

  constructor(private apiSer: ApiService,
    private router: Router,
    private adalService: AdalService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const navigationExtras: NavigationExtras = {
      queryParams: { redirectUrl: route.url }
    };

    if (!this.adalService.userInfo) {
      this.router.navigate(['login'], navigationExtras);
    }
    this.apiSer.token = this.adalService.accessToken;
    return true;
  }
}
