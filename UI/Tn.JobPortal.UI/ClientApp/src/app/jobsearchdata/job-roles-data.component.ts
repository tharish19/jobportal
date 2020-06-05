import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, process, State } from '@progress/kendo-data-query';
import { IJobRoles } from '../Interfaces/IJobRoles';
import { AppComponent } from '../app.component';
import { JobsService } from '../services/jobs.service';
import { MatDialog } from '@angular/material';
import { AddJobRoleComponent } from './addjobsearchdata/add-job-role.component';

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
    infoMessage: string;

    constructor(private rootComp: AppComponent,
        private jobsService: JobsService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.rootComp.cssClass = 'KendoCustomFilter_list';
        this.jobsService.GetJobSearchTerms().subscribe(res => {
            this.gridData = res;
        });
    }

    OpenEditJobRole(jobRoleId: number = null) {
        const dialogRef = this.dialog.open(AddJobRoleComponent, {
            panelClass: 'AddJobSearchData',
            width: '35%',
            data: {
                jobRoleData: (jobRoleId ? this.gridData.filter(x => x.jobRoleId === jobRoleId)[0] : null),
            }
        });
        dialogRef.afterClosed().subscribe(_result => {
            if (_result) {
                if (_result.jobRoleId !== 0 && _result.jobRoleId !== -1) {
                    this.gridData.push(_result);
                    this.infoMessage = _result.jobRole + ' is added.';
                } else {
                    this.gridData.filter(x => x.jobRoleId === _result.jobRoleId)[0].jobRole = _result.jobRole;
                    this.infoMessage = _result.jobRole + ' is updated.';
                }
                this.gridData = this.gridData;
                setTimeout(() => {
                    // if (this.isCleared == true) {
                        this.infoMessage = null;
                        // this.isCleared = true;
                    // }
                }, 3000);
            }
        });
    }

    delete(_jobRoleId: number) {
        const updatedJobRole = {
            jobRoleId: _jobRoleId,
            jobRole: this.gridData.filter(x => x.jobRoleId === _jobRoleId)[0].jobRole,
            isDeleted: true
        };
        this.jobsService.AddOrUpdateJobRole(updatedJobRole).subscribe(response => {
            if (response !== null) {
                const position = this.gridData.indexOf(this.gridData.filter(x => x.jobRoleId === _jobRoleId)[0]);
                this.gridData.splice(position, 1);
            } else {

            }
            this.gridData = this.gridData;
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
            const _refParentHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-content').offsetHeight;
            const _refChildHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-table-wrap').offsetHeight;
            if (_refParentHeight < _refChildHeight) {
                this.applyDynamicClass = true;
            }
        }
    }
}
