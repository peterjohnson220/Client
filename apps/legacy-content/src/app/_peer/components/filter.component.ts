import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterAggregateGroup, FilterAggregateItem } from '../reducers/peer-filters.reducer';

@Component({
  selector: 'pf-peer-data-cut-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filter: FilterAggregateGroup;
  @Output() selectionChanged = new EventEmitter();

  disabled = false;
  source: FilterAggregateItem[];
  data: FilterAggregateItem[];
  selections: FilterAggregateItem[];

  constructor() { }

  handleFilterChangeEvent(e: any) {
    console.log('handleFilterChangeEvent! - ', e);
    console.log('handleFilterChangeEvent! - Selections: ', this.selections);
  }

  handleValueChangeEvent(e: any) {
    console.log('handleValueChangeEvent! - ', e);
    console.log('handleValueChangeEvent! - Selections: ', this.selections);
    this.selectionChanged.emit({
      type: this.filter.Type,
      selections: this.selections.map((sel: any) => sel.Item)
    });
  }

  ngOnInit(): void {
   console.log(this.filter.Aggregates);
   this.source = this.filter.Aggregates;
   this.data = this.source.slice(0);
   if (this.filter.Aggregates && this.filter.Aggregates.length === 1) {
     this.selections = this.filter.Aggregates;
     this.disabled = true;
   }
  }
}
