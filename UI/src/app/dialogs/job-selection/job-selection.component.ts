import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-job-selection',
  templateUrl: './job-selection.component.html',
  styleUrls: ['./job-selection.component.scss']
})
export class JobSelectionComponent implements OnInit {
  selectedValue;
  constructor(public dialogRef: MatDialogRef<JobSelectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.dialogRef.disableClose = true;

               }

  ngOnInit(): void {
  }
  optionSelect(value) {
    this.selectedValue = value;
    this.dialogRef.close();
  }
}
