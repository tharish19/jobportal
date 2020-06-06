import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IJobRoles } from 'src/app/Interfaces/IJobRoles';
import { JobsService } from 'src/app/services/jobs.service';

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
        public formBuilder: FormBuilder,
        private jobsService: JobsService) {
        this.jobRoleData = data.jobRoleData;
    }
    createFormGroup() {
        return this.formBuilder.group({
            jobRole: ['', [Validators.required, Validators.maxLength(100)]],
            extPhrase: []
        });
    }
    ngOnInit() {
        this.addJobRoleForm = this.createFormGroup();
        if (this.jobRoleData && this.jobRoleData.jobRoleId) {
            this.addJobRoleForm.controls.jobRole.setValue(this.jobRoleData.jobRole);
            if (this.jobRoleData.exactPhrase) {
                this.addJobRoleForm.controls.extPhrase.setValue(true);
            }
        }
    }
    save() {
        if (this.addJobRoleForm.valid) {
            let _jobRole = this.addJobRoleForm.controls.jobRole.value;
            if (this.addJobRoleForm.controls.extPhrase.value) {
                _jobRole = '"' + _jobRole + '"';
            }
            const updatedJobRole = {
                jobRoleId: (this.jobRoleData) ? this.jobRoleData.jobRoleId : 0,
                jobRole: _jobRole,
                isDeleted: false
            };
            this.jobsService.AddOrUpdateJobRole(updatedJobRole).subscribe(response => {
                if (response !== null) {
                    this.dialogRef.close({
                        jobRoleId: (response === 0) ? this.jobRoleData.jobRoleId : response,
                        jobRole: _jobRole,
                        exactPhrase: this.addJobRoleForm.controls.extPhrase.value
                    });
                } else {

                }
            });
        }
    }
    cancel() {
        this.addJobRoleForm.controls.jobRole.setValue('');
    }
    close() {
        this.dialogRef.close();
    }
}
