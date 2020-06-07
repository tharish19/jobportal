import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdalService } from '../../shared/services/adal.service';

@Component({
    templateUrl: 'sign-in.component.html'
})

export class SignInComponent {

    constructor(private router: Router, private adalService: AdalService) {
        if (!this.adalService.userInfo) {
            this.adalService.login();
        } else {
            this.router.navigate(['/jobs']);
        }

    }
}
