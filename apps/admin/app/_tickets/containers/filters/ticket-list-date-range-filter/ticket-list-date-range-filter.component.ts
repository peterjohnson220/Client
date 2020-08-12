import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { NgModel } from '@angular/forms';

import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import { TicketFieldType } from '../../../constants/tickets-constants';


@Component({
  selector: 'pf-ticket-list-date-range-filter',
  templateUrl: './ticket-list-date-range-filter.component.html',
  styleUrls: ['./ticket-list-date-range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListDateRangeFilterComponent extends BaseFilterCellComponent implements OnInit {

  private innerValue: {start: '', end: ''};
  private maxRange = new Date();
  private previousValue: any;

  @ViewChild('dateRangeBtn') public dateRangeBtn: ElementRef;
  @ViewChild('dateRangePopup', { read: ElementRef }) public dateRangePopup: ElementRef;
  @ViewChild('fromDate') public fromDateInput: NgModel;
  @ViewChild('toDate') public toDateInput: NgModel;

  @Input() public filter: CompositeFilterDescriptor;
  @Input() public filterField: TicketFieldType;
  @Input() public defaultValue: any = {start: '', end: ''};
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  public show = false;


  constructor(filterService: FilterService) {
    super(filterService);
  }

  ngOnInit() {
    this.innerValue = cloneDeep(this.defaultValue);
  }

  public modifyFilter(value: any) {
    this.applyFilter(value === null ?
      this.removeFilter(this.filterField) :
      this.updateFilter({
        field: this.filterField,
        operator: 'eq',
        value: value
      })
    );
  }

  showDateRangePopup(show?: boolean) {
    if (!this.show) {
      this.previousValue = cloneDeep(this.innerValue);
    }

    this.show = show !== undefined ? show : !this.show;
  }

  clearValue() {
    if (this.innerValue.start !== '' && this.innerValue.end !== '') {
      this.innerValue = {start: '', end: ''};
      this.modifyFilter(null);
      this.valueChange.emit(this.filter);
    }

    this.innerValue = {start: '', end: ''};
    this.showDateRangePopup(false);
  }

  updateDateRange() {
    if (!this.fromDateInput.errors && !this.toDateInput.errors) {
      if (!isEqual(this.innerValue, this.previousValue)) {
        if (this.innerValue.start !== '' && this.innerValue.end !== '') {
          this.modifyFilter(this.innerValue);
          this.valueChange.emit(this.filter);
        }
      }
    }

    this.showDateRangePopup(false);
  }

  filterApplied(): boolean {
    if (this.innerValue.start && this.innerValue.end) {
      if (this.innerValue.start !== '' && this.innerValue.end !== '') {
        return true;
      }
    }

    return false;
  }
}
