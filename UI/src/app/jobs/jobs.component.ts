import { AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, process, State } from '@progress/kendo-data-query';

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
  searchQuery: any;
  previousQuery: any;
  currrentUserName;

  constructor(private adalService: AdalService,
              public dialog: MatDialog,
              private rootComp: AppComponent,
              private jobsService: JobsService) { }

  getJobsData() {
    this.jobsService.GetJobDetails(this.adalService.userInfo.profile.name).subscribe(response => {
      this.filterGridData = response.jobDetails;
      this.searchQuery = (response.userJobSearchString.split(','));
    }, (err) => {
      // console.log(err);
    });
  }
  showPopup(dataItem) {
    const statusDetails = new JobStatus();
    const dialogRef = this.dialog.open(JobSelectionComponent, {
      panelClass: 'RolePopUp_Custom'
    });
    dialogRef.afterClosed().subscribe(_result => {
      statusDetails.jobStatus = dialogRef.componentInstance.selectedValue;
      statusDetails.jobID = dataItem.jobID;
      statusDetails.appliedBy = this.currrentUserName;
      statusDetails.AppliedOn = new Date();
      this.jobsService.SubmitFeedBack(statusDetails).subscribe(res => {
        alert('sucess');
        dataItem.appliedBy = dataItem.appliedBy ? dataItem.appliedBy + ', ' +
        +this.currrentUserName : this.currrentUserName   ;
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
  selectAll(selectedStaffNumber) {
    if (selectedStaffNumber === 'All' && this.searchQuery.includes('All')) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        this.searchQuery.push(element);
      });
    } else if (
      selectedStaffNumber === 'All' &&
      this.searchQuery.length ===
      this.filteredSearchTerms.length - 1
    ) {
      this.searchQuery = [];
    } else if (
      !this.searchQuery.includes('All') &&
      this.searchQuery.length ===
      this.filteredSearchTerms.length - 1
    ) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        this.searchQuery.push(element);
      });
    } else if (
      this.searchQuery.includes('All') &&
      this.searchQuery.length ===
      this.filteredSearchTerms.length - 1
    ) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        if (element !== 'All' && element !== selectedStaffNumber) {
          this.searchQuery.push(element);
        }
      });
    }
    // else if (
    //   !this.searchQuery.includes('All') &&
    //   this.filteredStaffNumberList.length !==
    //   this.filteredSearchTerms.length
    // ) {
    //   if (this.searchQuery.includes(selectedStaffNumber)) {
    //     this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== 'All');
    //     this.searchQuery.push(selectedStaffNumber);
    //     if (this.searchQuery.length === this.filteredSearchTerms.length - 1 && !this.searchQuery.includes('All')) {
    //       this.searchQuery.push('All');
    //     }
    //   } else if (!this.searchQuery.includes(selectedStaffNumber)) {
    //     this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== selectedStaffNumber
    //       && staffNumber !== 'All');
    //   }
    // }
    // this.previousQuery = this.searchQuery;
  }

getSearchTerms() {
    this.jobsService.GetJobSearchTerms().subscribe(res => {
      // this.filteredSearchTerms();
      this.filteredSearchTerms.push('All');
      this.searchTerms = res;
      res.forEach(el => {
        this.filteredSearchTerms.push(el);
      });
      // console.log(res);
    });
  }
onSearch() {
  const query = this.searchQuery.filter(x => x !== 'All').join();
  this.jobsService.GetJobSearchResults(query, this.currrentUserName).subscribe(res => {
      this.filterGridData = res;
    })  ;
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
    this.grid.data = filterBy(this.filterGridData, filter);
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
