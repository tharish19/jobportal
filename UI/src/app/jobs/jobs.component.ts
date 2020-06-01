import { AfterViewChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  DataStateChangeEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowClassArgs,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, distinct, filterBy, process, State } from '@progress/kendo-data-query';

import { AppComponent } from '../app.component';
import { JobSelectionComponent } from '../dialogs/job-selection/job-selection.component';
import { JobDetailsModel } from '../Interfaces/jobs';
import { JobStatus } from '../Interfaces/JobStatus';
import { JobsService } from '../services/jobs.service';
import { DateAgoPipe } from '../shared/pipes/date-ago.pipe';
import { AdalService } from '../shared/services/adal.service';

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
  currrentUserName: string;
  searchQuery: any;
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
      this.filterGridData[i].appliedBy = (this.filterGridData[i].appliedBy !== '' && this.filterGridData[i].appliedBy !== null)
        ? this.filterGridData[i].appliedBy : '-NA-';
      this.filterGridData[i].postedByIcon = (this.postedByIconArray
        .filter(x => x.key.toLowerCase().indexOf(this.filterGridData[i].postedBy.toLowerCase()) >= 0).length > 0)
        ? this.postedByIconArray.filter(x => x.key.toLowerCase().indexOf(this.filterGridData[i].postedBy.toLowerCase()) >= 0)[0].value
        : null;
    });
  }

  getJobsData() {
    this.jobsService.GetJobDetails(this.adalService.userInfo.profile.name).subscribe(response => {
      if (response.userJobSearchString) {
        this.searchQuery = (response.userJobSearchString.split(','));
      }
      this.getSearchTerms(response.jobSearchStrings.map(o => o.jobRole));
      this.reviewFilterGridData(response.jobDetails);
    });
  }
  showPopup(dataItem) {
    const statusDetails = new JobStatus();
    const dialogRef = this.dialog.open(JobSelectionComponent, {
      panelClass: 'RolePopUp_Custom',
      width: '35%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe(() => {
      statusDetails.jobStatus = dialogRef.componentInstance.selectedValue;
      statusDetails.jobID = dataItem.jobID;
      statusDetails.appliedBy = this.currrentUserName;
      statusDetails.AppliedOn = new Date();
      this.jobsService.SubmitFeedBack(statusDetails).subscribe(res => {
        if (res) {
          dataItem.jobStatus = statusDetails.jobStatus.toString();
          if (dataItem.appliedBy === '-NA-') {
            dataItem.appliedBy = '';
          }
          dataItem.appliedBy = (dataItem.appliedBy && !dataItem.appliedBy.includes(this.currrentUserName)) ? dataItem.appliedBy + ', ' +
            this.currrentUserName : (dataItem.appliedBy && dataItem.appliedBy.includes(this.currrentUserName)) ?
              dataItem.appliedBy : this.currrentUserName;
        }
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
  selectAll(selectedJob) {
    if (selectedJob === 'All' && this.searchQuery.includes('All')) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        this.searchQuery.push(element);
      });
    } else if (selectedJob === 'All' && this.searchQuery.length === this.filteredSearchTerms.length - 1) {
      this.searchQuery = [];
    } else if (!this.searchQuery.includes('All') && this.searchQuery.length === this.filteredSearchTerms.length - 1) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        this.searchQuery.push(element);
      });
    } else if (this.searchQuery.includes('All') && this.searchQuery.length === this.filteredSearchTerms.length - 1) {
      this.searchQuery = [];
      this.filteredSearchTerms.forEach(element => {
        if (element !== 'All' && element !== selectedJob) {
          this.searchQuery.push(element);
        }
      });
    } else if (!this.searchQuery.includes('All') && this.filteredSearchTerms.length !== this.searchTerms.length) {
      if (this.searchQuery.includes(selectedJob)) {
        this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== 'All');
        this.searchQuery.push(selectedJob);
        if (this.searchQuery.length === this.filteredSearchTerms.length - 1 && !this.searchQuery.includes('All')) {
          this.searchQuery.push('All');
        }
      } else if (!this.searchQuery.includes(selectedJob)) {
        this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== selectedJob
          && staffNumber !== 'All');
      }
    }
    this.previousQuery = this.searchQuery;
  }
  getSearchTerms(response: any) {
    this.filteredSearchTerms = [];
    this.filteredSearchTerms.push('All');
    response.forEach(el => {
      this.filteredSearchTerms.push(el);
    });
    this.searchTerms = this.filteredSearchTerms;
  }
  onSearch() {
    const query = this.searchQuery.filter(x => x !== 'All').join();
    this.jobsService.GetJobSearchResults(query, this.currrentUserName).subscribe(res => {
      this.reviewFilterGridData(res);
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
    this.currrentUserName = this.adalService.userInfo.profile.name;
    window.sessionStorage.setItem('currrentUserName', this.currrentUserName);
    this.postedByIconArray.push({ key: 'addison group', value: 'addisongroup.png' });
    this.postedByIconArray.push({ key: 'career builder', value: 'careerbuilder.png' });
    this.postedByIconArray.push({ key: 'Collabera', value: 'collabera.png' });
    this.postedByIconArray.push({ key: 'dice', value: 'dice.png' });
    this.postedByIconArray.push({ key: 'indeed', value: 'indeed.ico' });
    this.postedByIconArray.push({ key: 'kforce', value: 'kforce.png' });
    this.postedByIconArray.push({ key: 'Monster', value: 'monsterindia.png' });
    this.postedByIconArray.push({ key: 'net2source', value: 'net2source.jpg' });
    this.postedByIconArray.push({ key: 'ntt data', value: 'nttdata.jfif' });
    this.postedByIconArray.push({ key: 'randstad', value: 'randstadusa.jpg' });
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
          if (_obj && _obj.indexOf(',') >= 0) {
            _obj.split(',').forEach(_e => {
              resArr.push(_e);
            });
          } else {
            resArr.push(_obj);
          }
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
        if (_obj && _obj.indexOf(',') >= 0) {
          _obj.split(',').forEach(_e => {
            resArr.push(_e);
          });
        } else {
          resArr.push(_obj);
        }
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
