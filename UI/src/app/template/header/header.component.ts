import { Component } from '@angular/core';
import { TemplateService } from '../../shared/services/template.service';
import { AdalService } from './../../shared/services/adal.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent  {

    searchModel : string;
    isCollapse: boolean;
    isOpen: boolean;
    searchActived: boolean = false;
    user:any;
    constructor(private tplSvc: TemplateService,private adal:AdalService) {
        this.user=this.adal.userInfo;
        console.log(this.user)
    }
    logout()
    {
        this.adal.logout();
    }
    ngOnInit(): void {
        this.tplSvc.isSideNavCollapseChanges.subscribe(isCollapse => this.isCollapse = isCollapse);
        this.tplSvc.isSidePanelOpenChanges.subscribe(isOpen => this.isOpen = isOpen);
    }    

    toggleSideNavCollapse() {
        this.isCollapse = !this.isCollapse;
        this.tplSvc.toggleSideNavCollapse(this.isCollapse);
    }

    toggleSidePanelOpen() {
        this.isOpen = !this.isOpen;
        this.tplSvc.toggleSidePanelOpen(this.isOpen);
    }

    toggleSearch () {
        this.searchActived = !this.searchActived;
        console.log(this.searchActived)
    }
}
