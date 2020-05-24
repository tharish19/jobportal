import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../shared/services/template.service';

export type HeaderType = 'header-dark' | 'header-primary' | 'header-info' | 'header-success' | 'header-danger' | 'header-dark';
export type SideNavType = 'side-nav-dark' | 'side-nav-dark';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html'
})

export class CommonLayoutComponent implements OnInit {

    headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
    sidenavThemes = ['sidenav-default', 'side-nav-dark'];
    headerSelected: HeaderType;
    sidenavSelected : SideNavType;
    isCollapse : boolean;
    rtlActived: boolean = false;
    
    themeConfigOpen: boolean = false;

    constructor(private tplSvc: TemplateService) {
        
    }

    ngOnInit(){
        this.tplSvc.isSideNavCollapseChanges.subscribe(isCollapse => this.isCollapse = isCollapse);
    }

    changeHeader(headerTheme:HeaderType) {
        this.headerSelected = headerTheme;
    }

    changeSidenav(sidenavTheme:SideNavType) {
        this.sidenavSelected = sidenavTheme;
    }

    toggleThemeConfig() {
        this.themeConfigOpen = !this.themeConfigOpen;
    }
}
