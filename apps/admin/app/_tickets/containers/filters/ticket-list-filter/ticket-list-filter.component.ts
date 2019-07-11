import {ChangeDetectionStrategy, Component, EventEmitter, Input,  Output } from '@angular/core';

import {BaseFilterCellComponent, FilterService} from '@progress/kendo-angular-grid';
import {CompositeFilterDescriptor} from '@progress/kendo-data-query';

@Component({
  selector: 'pf-ticket-list-filter',
  templateUrl: './ticket-list-filter.component.html',
  styleUrls: ['./ticket-list-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketListFilterComponent extends BaseFilterCellComponent {
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public data: any[];
  @Input() public textField: string;
  @Input() public valueField: string;
  @Input() public filterField: string;
  @Input() public defaultValue: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  selectedValue: any;

  constructor(filterService: FilterService) {
    super(filterService);
  }

  public onChange(value: any): void {
    this.modifyFilter(value);
    this.valueChange.emit();
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
