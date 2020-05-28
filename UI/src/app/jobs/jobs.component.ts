import { AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, process, State, distinct } from '@progress/kendo-data-query';

import { AppComponent } from '../app.component';
import { JobDetailsModel } from '../Interfaces/jobs';
import { JobsService } from '../services/jobs.service';
import { AdalService } from '../shared/services/adal.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { JobSelectionComponent } from '../dialogs/job-selection/job-selection.component';
import { JobStatus } from '../Interfaces/JobStatus';

declare var $: any;
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsComponent implements OnInit, AfterViewChecked {
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
  filterGridData: JobDetailsModel[] = [];
  searchTerms: any[] = [];
  filteredSearchTerms: any[] = [];
  searchQuery = new FormControl();
  currrentUserName;

  constructor(private adalService: AdalService,
    public dialog: MatDialog,
    private rootComp: AppComponent,
    private jobsService: JobsService) { }

  rowCallback(context: RowClassArgs) {
    const user = window.sessionStorage.getItem('currrentUserName');
    if (context.dataItem.jobStatus === '2' && context.dataItem.appliedBy.indexOf(user) >= 0) {
      return {
        notrelaventClass: true,
        submittedClass: false
      };
    }
    if (context.dataItem.appliedBy !== null && context.dataItem.appliedBy !== '') {
      return {
        notrelaventClass: false,
        submittedClass: true
      };
    }
  }

  getJobsData() {
    this.jobsService.GetJobDetails(this.adalService.userInfo.profile.name).subscribe(response => {
      this.filterGridData = response.jobDetails;
      this.searchQuery.setValue(response.userJobSearchString.split(','));
    }, (_err) => { });
  }
  showPopup(dataItem) {
    const statusDetails = new JobStatus();
    const dialogRef = this.dialog.open(JobSelectionComponent, {
      panelClass: 'RolePopUp_Custom',
      width: '50%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(_result => {
      statusDetails.jobStatus = dialogRef.componentInstance.selectedValue;
      statusDetails.jobID = dataItem.jobID;
      statusDetails.appliedBy = this.currrentUserName;
      statusDetails.AppliedOn = new Date();
      this.jobsService.SubmitFeedBack(statusDetails).subscribe(res => {
        alert('sucess');
        dataItem.appliedBy = dataItem.appliedBy ? dataItem.appliedBy + ', ' +
          +this.currrentUserName : this.currrentUserName;
      });
    });
  }
  copyInputMessage(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val.jobURL;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.showPopup(val);
  }

  getSearchTerms() {
    this.jobsService.GetJobSearchTerms().subscribe(res => {
      this.filteredSearchTerms = this.searchTerms = res;
      // console.log(res);
    });
  }
  onSearch() {
    this.jobsService.GetJobSearchResults(this.searchQuery.value, this.currrentUserName).subscribe(res => {
      this.filterGridData = res;
    });
  }
  onInputChange(event: string = '') {
    this.filteredSearchTerms = this.searchTerms.filter(
      employee => String(employee.toLowerCase()).startsWith(
        event.toLowerCase()));
  }
  ngOnInit() {
    this.rootComp.cssClass = 'KendoCustomFilter_list';
    this.getJobsData();
    this.getSearchTerms();
    this.currrentUserName = this.adalService.userInfo.profile.name;
    window.sessionStorage.setItem('currrentUserName', this.currrentUserName);
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
    // this.grid.data = filterBy(this.filterGridData, filter);
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

  public distinctPrimitive(fieldName: string): any {
    if (this.filter) {
      return distinct(filterBy(this.filterGridData, this.filter), fieldName).map(item => item[fieldName])
        .sort(this.compareFields());
    }
    return distinct(this.filterGridData, fieldName).map(item => item[fieldName]).sort(this.compareFields());
  }
  compareFields(): (a: any, b: any) => number {
    return (n1, n2) => {
      if (n1 > n2) {
        return 1;
      }
      if (n1 < n2) {
        return -1;
      }
      return 0;
    };
  }
}
