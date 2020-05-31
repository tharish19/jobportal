import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IJobRoles } from 'src/app/Interfaces/IJobRoles';

@Component({
    selector: 'app-add-job-role',
    templateUrl: './add-job-role.component.html',
    styleUrls: ['./add-job-role.component.scss'],
})
export class AddJobRoleComponent implements OnInit {
    jobRoleData: IJobRoles;
    addJobRoleForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<AddJobRoleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public formBuilder: FormBuilder) {
        this.jobRoleData = data.jobRoleData;
    }
    createFormGroup() {
        return this.formBuilder.group({
            jobRole: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }
    ngOnInit() {
        this.addJobRoleForm = this.createFormGroup();
        if (this.jobRoleData && this.jobRoleData.jobRoleId) {
            this.addJobRoleForm.controls.jobRole.setValue(this.jobRoleData.jobRole);
        }
    }
    save() {
        this.dialogRef.close({ jobRoleId: this.jobRoleData.jobRoleId, jobRole: this.addJobRoleForm.controls.jobRole.value });
    }
    cancel() {
        this.addJobRoleForm.controls.jobRole.setValue('');
    }
    close() {
        this.dialogRef.close();
    }
}
