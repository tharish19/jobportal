import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent implements AfterViewInit {
  @Input() public isPrimitive: boolean;
  @Input() public currentFilter: CompositeFilterDescriptor;
  @Input() public data;
  @Input() public showTextFilter;
  @Input() public textField;
  @Input() public valueField;
  @Input() public filterService: FilterService;
  @Input() public field: string;
  @Output() public valueChange = new EventEmitter<number[]>();
  @Output() public textValueChange = new EventEmitter<number[]>();

  public currentData: any;
  public showFilter = false;
  public currentText: any;
  private value: any[] = [];

  public ngAfterViewInit() {
    this.currentData = this.data;
    this.value = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
    // this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
  }

  public isItemSelected(item) {
    return this.value.some(x => x === this.valueAccessor(item));
  }

  public onSelectionChange(item, li) {
    if (this.value.some(x => x === item)) {
      this.value = this.value.filter(x => x !== item);
    } else {
      this.value.push(item);
    }

    let _operator = 'eq';
    if (this.field === 'appliedBy') {
      _operator = 'contains';
    }

    this.filterService.filter({
      filters: this.value.map(value => ({
        field: this.field,
        operator: _operator,
        value
      })),
      logic: 'or'
    });
    this.onFocus(li);
  }

  public onInput(e: any) {
    this.currentData = distinct([
      ...this.currentData.filter(dataItem => this.value.some(val => val === this.valueAccessor(dataItem))),
      ...filterBy(this.data, {
        operator: 'contains',
        field: this.textField,
        value: e.target.value
      })],
      this.textField
    );
  }

  public onFocus(li: any): void {
    const ul = li.parentNode;
    const below = ul.scrollTop + ul.offsetHeight < li.offsetTop + li.offsetHeight;
    const above = li.offsetTop < ul.scrollTop;

    // Scroll to focused checkbox
    if (below || above) {
      ul.scrollTop = li.offsetTop;
    }
  }

  public onFilterInput() {
    this.textValueChange.emit(this.currentText);
  }

  textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
  valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];
}
