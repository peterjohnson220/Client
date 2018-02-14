import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { switchMap, delay, tap, map } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';

import { FilterAggregateGroup, FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

@Component({
  selector: 'pf-peer-data-cut-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list;
  @Input() filter: FilterAggregateGroup;
  @Output() selectionChanged = new EventEmitter();
  disabled = false;
  source: FilterAggregateItem[];
  data: FilterAggregateItem[];
  selections: FilterAggregateItem[];

  constructor() { }

  get id(): string {
    return this.filter.MetaData.Id;
  }

  get label(): string {
    return this.filter.MetaData.Label;
  }

  get placeholder(): string {
    return this.filter.MetaData.Placeholder;
  }

  handleValueChangeEvent(e: any) {
    this.selectionChanged.emit({
      type: this.filter.MetaData.FilterProp,
      selections: this.selections.map(s => s.Item)
    });
  }

  ngOnInit(): void {
   this.source = this.filter.Aggregates;
   this.data = this.source.slice(0);
   if (this.filter.Aggregates && this.filter.Aggregates.length === 1) {
     this.selections = this.filter.Aggregates;
     this.disabled = true;
   }
  }

  ngAfterViewInit(): void {
    // [JP] - Because we can't display the kendo multi-select component in a jest snapshot, we can't test anything that
    // depends on it. This prevents an error when the kendo component is not provided in a unit test.
    if (!this.list.filterChange) {
      return;
    }

    const contains = value => s => s.Item.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.list.filterChange.asObservable().pipe(
      switchMap(value => from([this.source]).pipe(
        tap(() => this.list.loading = true),
        delay(200),
        map((data) => data.filter(contains(value)))
      ))
    ).subscribe(x => {
      this.data = x;
      this.list.loading = false;
    });
  }
}
