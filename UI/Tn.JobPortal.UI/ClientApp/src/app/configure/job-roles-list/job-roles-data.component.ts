import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, process, State } from '@progress/kendo-data-query';
import { IJobRoles } from '../../Interfaces/IJobRoles';
import { AppComponent } from '../../app.component';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material';
import { AddJobRoleComponent } from './add-job-role/add-job-role.component';
import { DialogService } from '../../services/dailog.service';
import { AdalService } from '../../shared/services/adal.service';

@Component({
    selector: 'app-job-roles-data',
    templateUrl: './job-roles-data.component.html',
    styleUrls: ['./job-roles-data.component.scss'],
})
export class JobRolesDataComponent implements OnInit {

    @ViewChild(GridComponent, { static: false }) grid: GridComponent;

    applyDynamicClass = false;
    public gridView: GridDataResult;
    public filter: CompositeFilterDescriptor;
    public pageSize = 100;
    public state: State = {
        skip: 0
    };
    public skip = 0;
    public buttonCount = 5;
    public info = true;
    public type: 'numeric' | 'input' = 'numeric';
    public pageSizes = false;
    public previousNext = true;
    gridData: IJobRoles[] = [];
    isAuthorizedUser = false;
    authorizedUsers: any[] = ['Vasanth@tekninjas.com',
        'naveen@tekninjas.com',
        'sri@tekninjas.com',
        'vijay.y@tekninjas.com',
        'srikanth.a@tekninjas.com',
        'flow@tekninjas.com'];

    constructor(private adalService: AdalService,
        private rootComp: AppComponent,
        private dialogService: DialogService,
        private apiService: ApiService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        const userId = this.adalService.userInfo.userName;
        if (this.authorizedUsers.filter(o => o.toLowerCase() === userId.toLowerCase()).length > 0) {
            this.isAuthorizedUser = true;
        }
        this.rootComp.cssClass = 'KendoCustomFilter_list';
        this.apiService.GetJobSearchTerms().subscribe(res => {
            this.gridData = res;
            if (this.gridData && this.gridData.length > 0) {
                this.gridData.map((_x, i) => {
                    if (this.gridData[i].jobRole.indexOf('"') >= 0) {
                        this.gridData[i].jobRole = this.gridData[i].jobRole.replace(/"/ig, '');
                        this.gridData[i].exactPhrase = true;
                    } else {
                        this.gridData[i].exactPhrase = false;
                    }
                });
            } else {
                this.dialogService.openAlertDialog('No records available.', 'warning');
            }
        });
    }

    OpenEditJobRole(dataItem: any = null) {
        const jobRoleId = (dataItem) ? dataItem.jobRoleId : null;
        const dialogRef = this.dialog.open(AddJobRoleComponent, {
            panelClass: 'AddJobSearchData',
            width: '35%',
            data: {
                jobRoleData: (jobRoleId ? this.gridData.filter(x => x.jobRoleId === jobRoleId)[0] : null),
            }
        });
        dialogRef.afterClosed().subscribe(_result => {
            if (_result) {
                if (dataItem) {
                    dataItem.jobRole = _result.jobRole.replace(/"/ig, '');
                    dataItem.exactPhrase = _result.exactPhrase;
                    this.dialogService.openAlertDialog('Job Role \'' + _result.jobRole + '\' is updated.', 'success');
                } else {
                    _result.jobRole = _result.jobRole.replace(/"/ig, '');
                    this.gridData.push(_result);
                    this.dialogService.openAlertDialog('Job Role \'' + _result.jobRole + '\' is added.', 'success');
                    this.grid.data = this.gridData;
                }
            }
        });
    }

    delete(dataItem: any) {
        this.dialogService.openConfirmDialog('Do you wish to delete this Job Role?', true)
            .afterClosed().subscribe(res => {
                if (res) {
                    const updatedJobRole = {
                        jobRoleId: dataItem.jobRoleId,
                        jobRole: dataItem.jobRole,
                        isDeleted: true
                    };
                    this.apiService.AddOrUpdateJobRole(updatedJobRole).subscribe(response => {
                        if (response !== null) {
                            this.gridData = this.gridData.filter(x => x.jobRoleId !== dataItem.jobRoleId);
                            this.dialogService.openAlertDialog('Job Role \'' + dataItem.jobRole + '\' is deleted.', 'success');
                            this.grid.data = this.gridData;
                        } else {
                            this.dialogService.openAlertDialog('An error occurred. Please try again.', 'error');
                        }
                    });
                }
            });
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
        this.pageSize = event.take;
    }
    public filterChange(filter: CompositeFilterDescriptor): void {
        this.filter = filter;
    }
    filterData(data: any[]): any[] {
        return process(
            data,
            {
                group: this.state.group,
                sort: this.state.sort,
                filter: this.filter
            }).data;
    }
    ngAfterViewChecked(): void {
        if (this.grid !== undefined && this.grid !== null) { } {
            const _refParentHeight = (this.grid && this.grid.wrapper)
                ? this.grid.wrapper.nativeElement.querySelector('.k-grid-content').offsetHeight : null;
            const _refChildHeight = (this.grid && this.grid.wrapper)
                ? this.grid.wrapper.nativeElement.querySelector('.k-grid-table-wrap').offsetHeight : null;
            if (_refParentHeight < _refChildHeight) {
                this.applyDynamicClass = true;
            }
        }
    }
}
