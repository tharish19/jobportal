import { Component, ViewEncapsulation, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, process, State } from '@progress/kendo-data-query';
import { AppComponent } from '../app.component';
import { JobsService } from '../services/jobs.service';
import { JobDetailsModel } from '../Interfaces/jobs';
import { FormControl } from '@angular/forms';
declare var $: any;
@Component({
  templateUrl: 'jobs.component.html',
  encapsulation: ViewEncapsulation.None

})
export class JobsComponent implements OnInit, AfterViewChecked {
  @ViewChild(GridComponent, { static: false }) grid: GridComponent;

  applyDynamicClass = false;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 20;
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

  constructor(
    private rootComp: AppComponent,
    private jobsService: JobsService
  ) { }
  getJobsData() {
    this.jobsService.GetJobDetails().subscribe(response => {
      this.filterGridData = response;

    }, (err) => {
      console.log(err);
    });
  }
  getSearchTerms() {
    this.jobsService.GetJobSearchTerms().subscribe(res => {
      this.searchTerms = res;
      console.log(res);
    });
  }

  ngOnInit() {
    this.rootComp.cssClass = 'KendoCustomFilter_list';
    this.getJobsData();
    this.getSearchTerms();
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
    if (this.grid !== undefined && this.grid !== null) {
      const _refParentHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-content').offsetHeight;
      const _refChildHeight = this.grid.wrapper.nativeElement.querySelector('.k-grid-table-wrap').offsetHeight;
      if (_refParentHeight < _refChildHeight) {
        this.applyDynamicClass = true;
      }
    }
  }
}
