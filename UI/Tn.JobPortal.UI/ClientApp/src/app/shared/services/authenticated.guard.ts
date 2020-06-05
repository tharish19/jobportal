import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { AdalService } from './adal.service';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationGuard implements CanActivate {

  constructor(private identityService: IdentityService,
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
    this.identityService.token = this.adalService.accessToken;
    return true;
  }
}
