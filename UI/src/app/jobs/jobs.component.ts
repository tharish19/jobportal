import { Component, ViewEncapsulation, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, filterBy, process, State } from '@progress/kendo-data-query';
import { AppComponent } from '../app.component';
import { JobsService } from '../services/jobs.service';
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
  filterGridData;
  //  = [
  //   { sNo: 1, name: 'aaaa', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 2, name: 'bbb', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 3, name: 'cccc', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 4, name: 'dddd', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 5, name: 'eeee', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 6, name: 'ffff', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 7, name: 'gggg', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 8, name: 'hhhh', city: 'Hyderabad', skill: 'Angular' },
  //   { sNo: 9, name: 'iiii', city: 'Hyderabad', skill: 'Angular' },
  // ];


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

  ngOnInit() {
    this.rootComp.cssClass = 'KendoCustomFilter_list';
    this.getJobsData();
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
