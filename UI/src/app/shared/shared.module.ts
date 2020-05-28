import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterDropdownComponent } from './filter-dropdown/filter-dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        FilterDropdownComponent,
        NgbModule
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        PerfectScrollbarModule
    ],
    declarations: [
        FilterDropdownComponent
    ],
    providers: [
    ]
})

export class SharedModule { }
