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
  membersList = [];
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
    this.membersList = [{ memberId: 1, displayName: 'Sri Jasti', mail: 'sri@tekninjas.com' },
    { memberId: 2, displayName: 'Naveen Kumar', mail: 'naveen@tekninjas.com' },
    { memberId: 3, displayName: 'Vasanth Nemala', mail: 'vasanth@tekninjas.com' },
    { memberId: 4, displayName: 'Vijay Yasaram', mail: 'vijay.y@tekninjas.com' },
    { memberId: 5, displayName: 'Srikanth Anapagadda', mail: 'srikanth.a@tekninjas.com' },
    { memberId: 6, displayName: 'MS Flow', mail: 'flow@tekninjas.com' }];
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
      const _refParentHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-content').offsetHeight;
      const _refChildHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-table-wrap').offsetHeight;
      if (_refParentHeight < _refChildHeight) {
        this.applyDynamicClass = true;
      }
    }
  }
}
