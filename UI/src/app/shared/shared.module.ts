import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,

        NgbModule
    ],
    imports: [
        RouterModule,
        CommonModule,

        NgbModule
    ],
    declarations: [

    ],
    providers: [
    ]
})

export class SharedModule { }
