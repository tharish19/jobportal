import { OnInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { IConsultants } from 'src/app/Interfaces/IConsultants';

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

    constructor(public dialogRef: MatDialogRef<AddConsultantComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public formBuilder: FormBuilder,
        private apiService: ApiService) {
        this.consultantData = data.consultantData;
    }

    ngOnInit() {
        this.addConsultantForm = this.createFormGroup();
        this.apiService.GetJobSearchTerms().subscribe(res => {
            this.jobRoleList = res;
            this.jobRoleList.map((_x, i) => {
                if (this.jobRoleList[i].jobRole.indexOf('"') >= 0) {
                    this.jobRoleList[i].jobRole = this.jobRoleList[i].jobRole.replace(/"/ig, '');
                }
            });
        });
        this.membersList = [{ memberId: 1, displayName: 'Sri Jasti', mail: 'sri@tekninjas.com' },
        { memberId: 2, displayName: 'Naveen Kumar', mail: 'naveen@tekninjas.com' },
        { memberId: 3, displayName: 'Vasanth Nemala', mail: 'vasanth@tekninjas.com' },
        { memberId: 4, displayName: 'Vijay Yasaram', mail: 'vijay.y@tekninjas.com' },
        { memberId: 5, displayName: 'Srikanth Anapagadda', mail: 'srikanth.a@tekninjas.com' },
        { memberId: 6, displayName: 'MS Flow', mail: 'flow@tekninjas.com' }];
    }

    createFormGroup() {
        return this.formBuilder.group({
            consultantName: ['', [Validators.required, Validators.maxLength(150)]],
            mobileNumber: ['', Validators.required],
            email: ['', Validators.required],
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
            let consultantObj = {
                consultantId: null,
                consultantName: this.addConsultantForm.controls.consultantName.value,
                mobileNumber: this.addConsultantForm.controls.mobileNumber.value,
                email: this.addConsultantForm.controls.email.value,
                jobTitle: this.addConsultantForm.controls.jobTitle.value,
                memberIDList: this.selectedMembers,
                jobsearchidList: this.selectedJobRoles
            };
            // this.apiService.AddOrUpdateConsultant(consultantObj).subscribe((response) => {

            // });
        } else {
            this.addConsultantForm.markAllAsTouched();
        }
    }
}
