import { Component, OnInit, ViewChild } from '@angular/core';
import { IConsultants } from 'src/app/Interfaces/IConsultants';
import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, process, State } from '@progress/kendo-data-query';
import { AdalService } from 'src/app/shared/services/adal.service';
import { AppComponent } from 'src/app/app.component';
import { DialogService } from 'src/app/services/dailog.service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { AddConsultantComponent } from './add-consultant/add-consultant.component';
import { IJobRoles } from 'src/app/Interfaces/IJobRoles';

@Component({
  selector: 'app-consultant-list',
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss']
})
export class ConsultantListComponent implements OnInit {

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
  gridData: IConsultants[] = [];
  isAuthorizedUser = false;
  jobRoleList: IJobRoles[] = [];
  membersList = [{ memberId: 1, displayName: 'Naveen Kumar', mail: 'naveen@tekninjas.com' },
  { memberId: 2, displayName: 'Vasanth Nemala', mail: 'vasanth@tekninjas.com' },
  { memberId: 3, displayName: 'Sai Lakamsani', mail: 'sai@tekninjas.com' },
  { memberId: 4, displayName: 'Shilpa Pennamreddy', mail: 'shilpa.p@TekNinjas.com' },
  { memberId: 5, displayName: 'Sumanth Kota', mail: 'sumanth.k@tekninjas.com' },
  { memberId: 6, displayName: 'Vijay Yasaram', mail: 'vijay.y@tekninjas.com' },
  { memberId: 7, displayName: 'Sravan Sunkari', mail: 'sravan.s@tekninjas.com' },
  { memberId: 8, displayName: 'Srikanth Anapagadda', mail: 'srikanth.a@tekninjas.com' },
  { memberId: 9, displayName: 'Vinod Kumar', mail: 'vinod.k@tekninjas.com' },
  { memberId: 10, displayName: 'Siva Ramakrishna', mail: 'siva@tekninjas.com' },
  { memberId: 11, displayName: 'Nagarjuna Pathi', mail: 'nagarjuna@tekninjas.com' },
  { memberId: 12, displayName: 'MS Flow', mail: 'flow@tekninjas.com' },
  { memberId: 13, displayName: 'uipath1', mail: 'uipath1@tekninjas.com' },
  { memberId: 14, displayName: 'Adithya Vardhan', mail: 'adithya.v@tekninjas.com' },
  { memberId: 15, displayName: 'Arun Kumar Kattamreddy', mail: 'Arun.K@tekninjas.com' },
  { memberId: 16, displayName: 'Pavan Arradi', mail: 'pavan.a@tekninjas.com' },
  { memberId: 17, displayName: 'Sudha Kancharla', mail: 'sudha.k@tekninjas.com' },
  { memberId: 18, displayName: 'Kumar Bharani', mail: 'kumar.b@tekninjas.com' },
  { memberId: 19, displayName: 'Harish Mahadev', mail: 'harish.m@tekninjas.com' },
  { memberId: 20, displayName: 'Shiva Kasturi', mail: 'shiva.k@tekninjas.com' }];
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
    public dialog: MatDialog) { }

  ngOnInit() {
    this.gridData = [];
    this.GetJobRole();
    const userId = this.adalService.userInfo.userName;
    if (this.authorizedUsers.filter(o => o.toLowerCase() === userId.toLowerCase()).length > 0) {
      this.isAuthorizedUser = true;
    }
    this.rootComp.cssClass = 'KendoCustomFilter_list';
  }

  GetJobRole() {
    this.apiService.GetJobSearchTerms().subscribe(res => {
      this.jobRoleList = res;
      this.jobRoleList.map((_x, i) => {
        if (this.jobRoleList[i].jobRole.indexOf('"') >= 0) {
          this.jobRoleList[i].jobRole = this.jobRoleList[i].jobRole.replace(/"/ig, '');
        }
      });
      this.GetAllConsultants();
    });
  }

  GetAllConsultants() {
    this.apiService.GetAllConsultants().subscribe(result => {
      this.gridData = result;
      if (this.gridData && this.gridData.length > 0) {
        this.gridData.map((_x, i) => {
          let members = '';
          let roles = '';
          this.gridData[i].memberIdList.forEach(_ele => {
            members = members + ', ' + this.membersList.filter(x => x.mail === _ele)[0].displayName;
          });
          this.gridData[i].jobRoleIdList.forEach(_role => {
            roles = roles + ', ' + this.jobRoleList.filter(x => x.jobRoleId === _role)[0].jobRole;
          });
          this.gridData[i].members = members.replace(/^, (.*)/, '$1');
          this.gridData[i].jobRoles = roles.replace(/^, (.*)/, '$1');
        });
      } else {
        this.dialogService.openAlertDialog('No records available.', 'warning');
      }
    });
  }
  editConsultant(dataItem: any = null) {
    const consultantId = (dataItem) ? dataItem.consultantId : null;
    const dialogRef = this.dialog.open(AddConsultantComponent, {
      panelClass: 'AddConsultant',
      width: '60%',
      data: {
        jobRoles: this.jobRoleList,
        membersList: this.membersList,
        consultantData: (consultantId ? this.gridData.filter(x => x.consultantId === consultantId)[0] : null),
      }
    });
    dialogRef.afterClosed().subscribe((_result) => {
      if (_result) {
        if (consultantId) {
          this.GetAllConsultants();
          this.dialogService.openAlertDialog('Consultant \'' + _result.consultantData.consultantName + '\' is updated.', 'success');
        } else {
          this.GetAllConsultants();
          this.dialogService.openAlertDialog('Consultant \'' + _result.consultantData.consultantName + '\' is added.', 'success');
        }
      }
    });
  }

  delete(dataItem: any) {
    this.dialogService.openConfirmDialog('Do you wish to delete this Consultant?', true)
      .afterClosed().subscribe(res => {
        if (res) {
          this.apiService.DeleteConsultant(dataItem.consultantId).subscribe(response => {
            if (response) {
              this.gridData = this.gridData.filter(x => x.consultantId !== dataItem.consultantId);
              this.dialogService.openAlertDialog('Consultant \'' + dataItem.consultantName + '\' is deleted.', 'success');
              this.grid.data = this.gridData;
            } else {
              this.dialogService.openAlertDialog('An error occurred. Please try again.', 'success');
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
