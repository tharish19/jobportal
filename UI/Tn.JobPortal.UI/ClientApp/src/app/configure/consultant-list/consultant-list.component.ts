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
  infoMessage: string;
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
    private jobsService: ApiService,
    public dialog: MatDialog) { }

  ngOnInit() {
    const userId = this.adalService.userInfo.userName;
    if (this.authorizedUsers.filter(o => o.toLowerCase() === userId.toLowerCase()).length > 0) {
      this.isAuthorizedUser = true;
    }
    this.rootComp.cssClass = 'KendoCustomFilter_list';
    this.gridData = [];
    // this.jobsService.GetAllConsultants().subscribe(res => {
    //   this.gridData = res;
    // });
  }

  editConsultant(dataItem: any = null) {
    const consultantId = (dataItem) ? dataItem.consultantId : null;
    const dialogRef = this.dialog.open(AddConsultantComponent, {
      panelClass: 'AddConsultant',
      width: '60%',
      data: {
        consultantData: (consultantId ? this.gridData.filter(x => x.consultantId === consultantId)[0] : null),
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      //   if (_result) {
      //     if (dataItem) {
      //       dataItem.jobRole = _result.jobRole.replace(/"/ig, '');
      //       dataItem.exactPhrase = _result.exactPhrase;
      //       this.infoMessage = 'Job Role \'' + _result.jobRole + '\' is updated.';
      //     } else {
      //       _result.jobRole = _result.jobRole.replace(/"/ig, '');
      //       this.gridData.push(_result);
      //       this.infoMessage = 'Job Role \'' + _result.jobRole + '\' is added.';
      //       this.grid.data = this.gridData;
      //     }
      //     setTimeout(() => {
      //       this.infoMessage = null;
      //     }, 5000);
      //   }
    });
  }

  delete(dataItem: any) {
    this.dialogService.openConfirmDialog('Do you wish to delete this Job Role?', true)
      .afterClosed().subscribe(res => {
        if (res) {
          this.infoMessage = 'Deleted.';
          setTimeout(() => {
            this.infoMessage = null;
          }, 5000);
          // const updatedJobRole = {
          //   jobRoleId: dataItem.jobRoleId,
          //   jobRole: dataItem.jobRole,
          //   isDeleted: true
          // };
          // this.jobsService.AddOrUpdateJobRole(updatedJobRole).subscribe(response => {
          //   if (response !== null) {
          //     this.gridData = this.gridData.filter(x => x.jobRoleId !== dataItem.jobRoleId);
          //     this.infoMessage = 'Job Role \'' + dataItem.jobRole + '\' is deleted.';
          //     this.grid.data = this.gridData;
          //   } else {
          //     this.infoMessage = 'An error occurred. Please try again.';
          //   }
          //   setTimeout(() => {
          //     this.infoMessage = null;
          //   }, 5000);
          // });
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
