import { OnInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { IConsultants } from 'src/app/Interfaces/IConsultants';
import { AdalService } from 'src/app/shared/services/adal.service';

@Component({
    selector: 'app-add-consultant',
    templateUrl: './add-consultant.component.html',
    styleUrls: ['./add-consultant.component.scss'],
})
export class AddConsultantComponent implements OnInit {
    consultantData: IConsultants;
    addConsultantForm: FormGroup;
    selectedMembers = [];
    selectedJobRoles = [];
    jobRoleList: any[] = [];
    membersList: any[] = [];
    mask = '000-000-0000';

    constructor(public dialogRef: MatDialogRef<AddConsultantComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public formBuilder: FormBuilder,
        private apiService: ApiService,
        private adalService: AdalService) {
        this.dialogRef.disableClose = true;
        this.consultantData = data.consultantData;
        this.jobRoleList = data.jobRoles;
        this.membersList = data.membersList;
    }

    ngOnInit() {
        this.addConsultantForm = this.createFormGroup();
        if (this.consultantData !== null) {
            this.addConsultantForm.controls.consultantName.setValue(this.consultantData.consultantName);
            this.addConsultantForm.controls.mobileNumber.setValue(this.consultantData.mobileNumber);
            this.addConsultantForm.controls.email.setValue(this.consultantData.email);
            this.addConsultantForm.controls.jobTitle.setValue(this.consultantData.jobTitle);
            this.selectedMembers = this.consultantData.memberIdList;
            this.selectedJobRoles = this.consultantData.jobRoleIdList;
        }
    }

    createFormGroup() {
        return this.formBuilder.group({
            consultantName: ['', [Validators.required, Validators.maxLength(150)]],
            mobileNumber: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]{10}')]],
            email: ['', [Validators.required, Validators.maxLength(150)]],
            jobTitle: ['', Validators.required],
            members: [null, Validators.required],
            jobRoles: [null, Validators.required]
        });
    }
    close() {
        this.dialogRef.close();
    }
    cancel() {
        this.addConsultantForm.reset();
    }
    save() {
        if (this.addConsultantForm.valid) {
            const consultantObj: IConsultants = {
                consultantId: (this.consultantData !== null) ? this.consultantData.consultantId : 0,
                consultantName: this.addConsultantForm.controls.consultantName.value,
                mobileNumber: this.addConsultantForm.controls.mobileNumber.value,
                email: this.addConsultantForm.controls.email.value,
                jobTitle: this.addConsultantForm.controls.jobTitle.value,
                memberIdList: this.selectedMembers,
                jobRoleIdList: this.selectedJobRoles,
                insertedBy: this.adalService.userInfo.userName,
                members: null,
                jobRoles: null
            };
            this.apiService.AddOrUpdateConsultant(consultantObj).subscribe((response) => {
                if (response) {
                    consultantObj.consultantId = response;
                    this.dialogRef.close({
                        consultantData: consultantObj
                    });
                }
            });
        } else {
            this.addConsultantForm.markAllAsTouched();
        }
    }
}
