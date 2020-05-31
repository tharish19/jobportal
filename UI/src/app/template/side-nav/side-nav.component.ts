import { Component } from '@angular/core';
import { TemplateService } from '../../shared/services/template.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AdalService } from 'src/app/shared/services/adal.service';
declare const $: any;
@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html'
})
export class SideNavComponent {

    isCollapse: boolean;
    user;

    constructor(private tplSvc: TemplateService, private router: Router, private adalService: AdalService) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (window.innerWidth < 992) {
                    this.tplSvc.toggleSideNavCollapse(false);
                }
            }
        });
        this.user = adalService.userInfo;
    }

    ngOnInit() {
        this.tplSvc.isSideNavCollapseChanges.subscribe(isCollapse => this.isCollapse = isCollapse);
        $(".Profile_button").click(function (e) {
            $("#logoutbtn").toggle();
            e.stopPropagation();
        });
        $(document).click(function (e) {
            $("#logoutbtn").hide();
        });
    }
    logout() {
        this.adalService.logout();
    }
    toggleSideNavCollapse() {
        this.isCollapse = !this.isCollapse;
        this.tplSvc.toggleSideNavCollapse(this.isCollapse);
    }
}
