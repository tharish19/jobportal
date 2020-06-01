import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { SucessDialogComponent as AlertDialogComponent } from './sucess-dialog/alert-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(public dialog: MatDialog) {
    }

    //   getSucessDialog(tittle: string, bodyText: string, IsShow: boolean) {
    //     return this.dialog.open(AlertDialogComponent, {
    //       data: { TittleText: tittle, BodyText: bodyText, isShow: IsShow }
    //     });
    //   }
}
