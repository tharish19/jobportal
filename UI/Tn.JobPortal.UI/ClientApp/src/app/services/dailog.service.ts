import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(public dialog: MatDialog) {
    }

    openAlertDialog(_bodyText: string, _isSuccessErrorWarning: string) {
        return this.dialog.open(AlertDialogComponent, {
            data: { bodyText: _bodyText, isSuccessErrorWarning: _isSuccessErrorWarning, isConfirmCancel: false }
        });
    }

    openConfirmDialog(_bodyText: string, _isConfirmCancel: boolean) {
        return this.dialog.open(ConfirmDialogComponent, {
            data: { bodyText: _bodyText, isSuccessErrorWarning: null, isConfirmCancel: _isConfirmCancel }
        });
    }
}
