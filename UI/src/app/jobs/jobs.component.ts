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
import { DateAgoPipe } from '../shared/pipes/date-ago.pipe';

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
  previousQuery: any;
  currrentUserName;
  searchQuery = new FormControl();
  currrentUserName: any;
  postedByIconArray: any[] = [];

  constructor(private adalService: AdalService,
    public dialog: MatDialog,
    private dateAgoPipe: DateAgoPipe,
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
    if (context.dataItem.jobStatus === '1' && context.dataItem.appliedBy !== null && context.dataItem.appliedBy !== '') {
      return {
        notrelaventClass: false,
        submittedClass: true
      };
    }
  }

  reviewFilterGridData(data: JobDetailsModel[]) {
    this.filterGridData = data;
    this.filterGridData.map((_x, i) => {
      this.filterGridData[i].postedOn = this.dateAgoPipe.transform(this.filterGridData[i].rowInsertDate);
      this.filterGridData[i].companyName = this.filterGridData[i].companyName !== 'NA' ? this.filterGridData[i].companyName : '';
      this.filterGridData[i].postedByIcon = this.postedByIconArray
        .filter(x => x.key.toLowerCase().indexOf(this.filterGridData[i].postedBy.toLowerCase()) >= 0)[0].value;

      this.filterGridData[i].appliedBy = this.filterGridData[i].appliedBy !== null
        ? (this.filterGridData[i].appliedBy + ', Test User') : '';
    });
  }

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
      panelClass: 'RolePopUp_Custom',
      width: '35%',
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
    window.sessionStorage.setItem('currrentUserName', this.currrentUserName);
    this.postedByIconArray.push({ key: 'net2source', value: 'net2source.jpg' });
    this.postedByIconArray.push({ key: 'Collabera', value: 'collabera.png' });
    this.postedByIconArray.push({ key: 'randstadusa', value: 'randstadusa.jpg' });
    this.postedByIconArray.push({ key: 'careerbuilder', value: 'careerbuilder.png' });
    this.postedByIconArray.push({ key: 'addisongroup', value: 'addisongroup.png' });
    this.postedByIconArray.push({ key: 'nttdata', value: 'nttdata.jfif' });
    this.postedByIconArray.push({ key: 'dice', value: 'dice.png' });
    this.postedByIconArray.push({ key: 'indeed', value: 'indeed.ico' });
    this.postedByIconArray.push({ key: 'Monster', value: 'monsterindia.png' });
    this.postedByIconArray.push({ key: 'kforce', value: 'kforce.png' });
    this.postedByIconArray.push({ key: 'TekSystems', value: 'tecksystems.ico' });
    this.postedByIconArray.push({ key: 'ziprecruiter', value: 'ziprecruiter.png' });
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
      if (fieldName === 'appliedBy') {
        const resArr: any[] = [];
        const result = distinct(filterBy(this.filterGridData, this.filter), fieldName).map(item => item[fieldName]);
        result.forEach(_obj => {
          _obj.split(',').forEach(_e => {
            resArr.push(_e);
          });
        });
        return resArr.sort(this.compareFields());
      } else {
        return distinct(filterBy(this.filterGridData, this.filter), fieldName).map(item => item[fieldName])
          .sort(this.compareFields());
      }
    }
    if (fieldName === 'appliedBy') {
      const resArr: any[] = [];
      const result = distinct(this.filterGridData, fieldName).map(item => item[fieldName]);
      result.forEach(_obj => {
        _obj.split(',').forEach(_e => {
          resArr.push(_e);
        });
      });
      return resArr.sort(this.compareFields());
    } else {
      return distinct(this.filterGridData, fieldName).map(item => item[fieldName]).sort(this.compareFields());
    }
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
