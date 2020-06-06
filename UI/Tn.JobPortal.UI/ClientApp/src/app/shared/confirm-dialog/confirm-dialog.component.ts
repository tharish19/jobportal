import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { IDialogModel } from 'src/app/Interfaces/IDialog';
import { DialogEnum } from '../services/dialog.enum';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogModel, router: Router) {
    router.events.subscribe(val => { if (val instanceof NavigationEnd) {
      this.dialogRef.close();
    }});
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  onCloseConfirm() {
    this.dialogRef.close(DialogEnum.Confirm);
  }
  onCloseCancel() {
    this.dialogRef.close(DialogEnum.Cancel);
  }

}
