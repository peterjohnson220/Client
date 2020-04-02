import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit, OnDestroy} from '@angular/core';

import {BaseFilterCellComponent, FilterService} from '@progress/kendo-angular-grid';
import {CompositeFilterDescriptor} from '@progress/kendo-data-query';

import {TicketFieldType} from '../../../constants/tickets-constants';
import {PickerHelper} from '../../../helpers';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'pf-ticket-list-filter',
  templateUrl: './ticket-list-filter.component.html',
  styleUrls: ['./ticket-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListFilterComponent  extends BaseFilterCellComponent implements OnInit {

  @Input() public filter: CompositeFilterDescriptor;
  @Input() public data: any[];
  @Input() public textField: string;
  @Input() public valueField: string;
  @Input() public filterField: TicketFieldType;
  @Input() public defaultValue: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  public ticketFieldType = TicketFieldType;
  public pickerHelper = new PickerHelper();
  defaultInterval: any;
  private maxTries = 3;
  private tries: number;

  constructor(filterService: FilterService, private ref: ChangeDetectorRef, private route: ActivatedRoute) {
    super(filterService);
  }

   ngOnInit() {
     const queryParam = this.route.snapshot.queryParamMap;
     if (queryParam.keys.length > 0 && this.filterField === this.ticketFieldType.COMPANYIDNAME) {
       this.tries = 0;
       this.defaultInterval = setInterval(() => {
        this.defaultValue = queryParam.get('company_name');
        this.ref.markForCheck();
        if (++this.tries === this.maxTries) {
          clearInterval(this.defaultInterval);
        }
       }, 500);
     }
   }

  public userTicketType(type: TicketFieldType): boolean {
    return this.filterField === type;
  }

  public onChange(value: any): void {
    this.modifyFilter(value);
    this.valueChange.emit(this.filter);
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
}
