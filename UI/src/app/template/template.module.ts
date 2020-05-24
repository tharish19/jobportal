import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';

import { FooterComponent } from './footer/footer.component';
import { Sidebar_Directives } from '../shared/directives/side-nav.directive';


@NgModule({
    imports: [
        SharedModule,
        RouterModule
        
    ],
    exports: [
        HeaderComponent,
      
        FooterComponent,
        Sidebar_Directives
    ],
    declarations: [
        HeaderComponent,
        
        FooterComponent,
        Sidebar_Directives
    ],
    providers: []
})


export class TemplateModule { }
