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
import { ApiService } from '../services/api.service';
import { DateAgoPipe } from '../shared/pipes/date-ago.pipe';
import { AdalService } from '../shared/services/adal.service';
import { DialogService } from '../services/dailog.service';

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
  consultantsList: any[] = [];
  previousQuery: any;
  currrentMemberId: string;
  userFullName: string;
  searchQuery: any;
  postedByIconArray: any[] = [];
  leaderBoardDetails: any;
  weeklyLeaderBoard: any[] = [];
  dailyLeaderBoard: any[] = [];
  daySubmissions = 0;
  weekSubmissions = 0;
  dailyRank = 0;
  weeklyRank = 0;
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

  constructor(private adalService: AdalService,
    public dialog: MatDialog,
    private dateAgoPipe: DateAgoPipe,
    private rootComp: AppComponent,
    private dialogService: DialogService,
    private apiService: ApiService) { }

  rowCallback(context: RowClassArgs) {
    const user = window.sessionStorage.getItem('currrentMemberId');
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
    if (this.filterGridData && this.filterGridData.length > 0) {
      this.filterGridData.map((_x, i) => {
        this.filterGridData[i].postedOn = this.dateAgoPipe.transform(this.filterGridData[i].rowInsertDate);
        this.filterGridData[i].companyName = this.filterGridData[i].companyName !== 'NA' ? this.filterGridData[i].companyName : '';
        this.filterGridData[i].postedByIcon = (this.postedByIconArray
          .filter(x => x.key.toLowerCase().indexOf(this.filterGridData[i].postedBy.toLowerCase()) >= 0).length > 0)
          ? this.postedByIconArray.filter(x => x.key.toLowerCase().indexOf(this.filterGridData[i].postedBy.toLowerCase()) >= 0)[0].value
          : null;
        if (this.filterGridData[i].appliedBy !== '' && this.filterGridData[i].appliedBy !== null) {
          if (this.filterGridData[i].appliedBy.split(',').length > 1) {
            let val = '';
            this.filterGridData[i].appliedBy.split(',').forEach((obj) => {
              val = val + ', ' + ((this.membersList.filter(x => x.mail === obj).length > 0)
                ? this.membersList.filter(x => x.mail === obj)[0].displayName
                : obj);
            });
            this.filterGridData[i].appliedBy = val.replace(/^, (.+)/ig, '$1');
          } else {
            this.filterGridData[i].appliedBy = (this.membersList.filter(x => x.mail === this.filterGridData[i].appliedBy).length > 0)
              ? this.membersList.filter(x => x.mail === this.filterGridData[i].appliedBy)[0].displayName
              : this.filterGridData[i].appliedBy;
          }
        } else {
          this.filterGridData[i].appliedBy = '-NA-';
        }
      });
    } else {
      this.dialogService.openAlertDialog('No records available.', 'warning');
    }
  }

  getJobsData() {
    this.apiService.GetAllConsultantsAndJobsForMember().subscribe(response => {
      if (response) {
        if (response.consultantsData && response.consultantsData.length > 0) {
          this.addConsultants(response.consultantsData);
        }
        this.reviewFilterGridData(response.jobsData);
      }
    });
  }

  addConsultants(consultantsData: any) {
    this.consultantsList = [];
    this.consultantsList.push({ consultantId: 0, consultantName: 'All' });
    consultantsData.forEach(ele => {
      this.consultantsList.push(ele);
    });
    this.searchTerms = this.consultantsList;
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
      statusDetails.appliedBy = this.currrentMemberId;
      statusDetails.AppliedOn = new Date();
      this.apiService.SubmitFeedBack(statusDetails).subscribe(res => {
        if (res) {
          if (statusDetails.jobStatus.toString() === '1') {
            this.getLeaderBoard();
          }
          dataItem.jobStatus = statusDetails.jobStatus.toString();
          if (dataItem.appliedBy === '-NA-') {
            dataItem.appliedBy = '';
          }
          dataItem.appliedBy = (dataItem.appliedBy && !dataItem.appliedBy.includes(this.userFullName)) ? dataItem.appliedBy + ', ' +
            this.userFullName : (dataItem.appliedBy && dataItem.appliedBy.includes(this.userFullName)) ?
              dataItem.appliedBy : this.userFullName;
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

  selectAll(selectedConsultantId) {
    if (selectedConsultantId === 0 && this.searchQuery.includes(0)) {
      this.searchQuery = [];
      this.consultantsList.forEach(element => {
        this.searchQuery.push(element.consultantId);
      });
    } else if (selectedConsultantId === 0 && this.searchQuery.length === this.consultantsList.length - 1) {
      this.searchQuery = [];
    } else if (!this.searchQuery.includes(0) && this.searchQuery.length === this.consultantsList.length - 1) {
      this.searchQuery = [];
      this.consultantsList.forEach(element => {
        this.searchQuery.push(element.consultantId);
      });
    } else if (this.searchQuery.includes(0) && this.searchQuery.length === this.consultantsList.length - 1) {
      this.searchQuery = [];
      this.consultantsList.forEach(element => {
        if (element.consultantId !== 0 && element.consultantId !== selectedConsultantId) {
          this.searchQuery.push(element.consultantId);
        }
      });
    } else if (!this.searchQuery.includes(0) && this.consultantsList.length !== this.searchTerms.length) {
      if (this.searchQuery.includes(selectedConsultantId)) {
        this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== 0);
        this.searchQuery.push(selectedConsultantId);
        if (this.searchQuery.length === this.consultantsList.length - 1 && !this.searchQuery.includes(0)) {
          this.searchQuery.push(0);
        }
      } else if (!this.searchQuery.includes(selectedConsultantId)) {
        this.searchQuery = this.previousQuery.filter(staffNumber => staffNumber !== selectedConsultantId
          && staffNumber !== 0);
      }
    }
    this.previousQuery = this.searchQuery;
  }

  onSearch() {
    const query = this.searchQuery.filter(x => x !== 0).join();
    this.apiService.GetSelectedConsultantJobsForMember(query).subscribe(res => {
      this.reviewFilterGridData(res);
    });
  }

  onInputChange(event: string = '') {
    this.consultantsList = this.searchTerms.filter(
      employee => String(employee.consultantName.toLowerCase()).startsWith(
        event.toLowerCase()));
  }

  getLeaderBoard() {
    this.apiService.getLeaderBoard().subscribe(res => {
      this.leaderBoardDetails = res;
      if (res.dayDetails.find(x => x.name === this.currrentMemberId)) {
        this.daySubmissions = res.dayDetails.find(x => x.name === this.currrentMemberId).submissions;
        this.dailyRank = res.dayDetails.find(x => x.name === this.currrentMemberId).rank;
      }
      if (res.weekDetails.find(x => x.name === this.currrentMemberId)) {
        this.weekSubmissions = res.weekDetails.find(x => x.name === this.currrentMemberId).submissions;
        this.weeklyRank = res.weekDetails.find(x => x.name === this.currrentMemberId).rank;
      }
      this.leaderBoardDetails.dayDetails.map((_x, i) => {
        this.leaderBoardDetails.dayDetails[i].name
          = (this.membersList.filter(x => x.mail === this.leaderBoardDetails.dayDetails[i].name).length > 0)
            ? this.membersList.filter(x => x.mail === this.leaderBoardDetails.dayDetails[i].name)[0].displayName
            : this.leaderBoardDetails.dayDetails[i].name;
      });
      this.leaderBoardDetails.weekDetails.map((_x, i) => {
        this.leaderBoardDetails.weekDetails[i].name
          = (this.membersList.filter(x => x.mail === this.leaderBoardDetails.weekDetails[i].name).length > 0)
            ? this.membersList.filter(x => x.mail === this.leaderBoardDetails.weekDetails[i].name)[0].displayName
            : this.leaderBoardDetails.weekDetails[i].name;
      });
    });
  }

  ngOnInit() {
    this.rootComp.cssClass = 'KendoCustomFilter_list';
    this.getJobsData();
    this.getLeaderBoard();
    this.currrentMemberId = this.adalService.userInfo.userName;
    window.sessionStorage.setItem('currrentMemberId', this.currrentMemberId);
    this.userFullName = this.membersList.filter(x => x.mail === this.currrentMemberId)[0].displayName;
    this.postedByIconArray.push({ key: 'addison group', value: 'addisongroup.png' });
    this.postedByIconArray.push({ key: 'apex', value: 'apexsystems.ico' });
    this.postedByIconArray.push({ key: 'career builder', value: 'careerbuilder.png' });
    this.postedByIconArray.push({ key: 'collabera', value: 'collabera.png' });
    this.postedByIconArray.push({ key: 'dice', value: 'dice.png' });
    this.postedByIconArray.push({ key: 'experis data', value: 'experis.ico' });
    this.postedByIconArray.push({ key: 'indeed', value: 'indeed.ico' });
    this.postedByIconArray.push({ key: 'kforce', value: 'kforce.png' });
    this.postedByIconArray.push({ key: 'monster', value: 'monsterindia.png' });
    this.postedByIconArray.push({ key: 'net2source', value: 'net2source.jpg' });
    this.postedByIconArray.push({ key: 'ntt data', value: 'nttdata.jfif' });
    this.postedByIconArray.push({ key: 'randstad', value: 'randstadusa.jpg' });
    this.postedByIconArray.push({ key: 'teksystems', value: 'tecksystems.ico' });
    this.postedByIconArray.push({ key: 'ziprecruiter', value: 'ziprecruiter.png' });
    $(document).ready(() => {
      $('.dropdown-submenu a.test').on('click', function(e) {
        $(this).next('.dropdown-menu').toggle();
        e.stopPropagation();
        e.preventDefault();
      });
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

  public distinctPrimitive(fieldName: string): any {
    if (this.filter) {
      if (fieldName === 'appliedBy') {
        const resArr: any[] = [];
        const result = distinct(filterBy(this.filterGridData, this.filter), fieldName).map(item => item[fieldName]);
        result.forEach(_obj => {
          if (_obj && _obj.indexOf(',') >= 0) {
            _obj.split(',').forEach(_e => {
              if (resArr.filter(x => x === _e.trim()).length <= 0) {
                resArr.push(_e.trim());
              }
            });
          } else {
            if (resArr.filter(x => x === _obj.trim()).length <= 0) {
              resArr.push(_obj.trim());
            }
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
            if (resArr.filter(x => x === _e.trim()).length <= 0) {
              resArr.push(_e.trim());
            }
          });
        } else {
          if (resArr.filter(x => x === _obj.trim()).length <= 0) {
            resArr.push(_obj.trim());
          }
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
