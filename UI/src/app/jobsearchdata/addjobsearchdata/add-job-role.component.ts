import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-job-role',
    templateUrl: './add-job-role.component.html',
    styleUrls: ['./add-job-role.component.scss'],
})
export class AddJobRoleComponent implements OnInit {
    jobRoleData: any;
    addJobRoleForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<AddJobRoleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public formBuilder: FormBuilder) {
        this.jobRoleData = data.jobSearchString;
    }
    createFormGroup() {
        return this.formBuilder.group({
            jobRole: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }
    ngOnInit() {
        this.addJobRoleForm = this.createFormGroup();
    }
    save() {

    }
    cancel() {

    }
    close() {
        this.dialogRef.close();
    }
}
