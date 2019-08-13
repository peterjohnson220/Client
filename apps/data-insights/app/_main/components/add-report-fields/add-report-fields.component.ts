import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

import { orderBy } from 'lodash';

import { groupBy } from '@progress/kendo-data-query';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { PfConstants } from 'libs/models/common';

import { Field, FieldListItem } from '../../models';

@Component({
  selector: 'pf-add-report-fields',
  templateUrl: './add-report-fields.component.html',
  styleUrls: ['./add-report-fields.component.scss']
})
export class AddReportFieldsComponent implements OnChanges, AfterViewInit, OnDestroy  {
  @ViewChild('reportFieldsList', { static: false }) reportFieldsList: AutoCompleteComponent;
  @Input() fields: Field[];
  @Output() fieldAdded: EventEmitter<Field> = new EventEmitter();

  fieldListItems: FieldListItem[];

  filterChangeSubscription: Subscription;

  filteredFields: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fields) {
      if (this.fields && this.fields.length) {
        this.fieldListItems = this.fields.map(x => {
          return {
            Entity: x.Entity,
            DisplayName: x.DisplayName,
            DataElementId: x.DataElementId.toString()
          };
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.filterChangeSubscription = this.reportFieldsList.filterChange.asObservable().pipe(
      tap((searchTerm) => {
        if (!searchTerm || searchTerm.length <= 2) {
          this.reportFieldsList.toggle(false);
        } else {
          this.reportFieldsList.loading = true;
        }
      }),
      debounceTime(PfConstants.DEBOUNCE_DELAY),
      distinctUntilChanged())
      .subscribe(searchTerm => {
        if (searchTerm && searchTerm.length > 2) {
          const filteredOptions = this.fieldListItems
            .filter(f => f.DisplayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
          const matchingFields = orderBy(filteredOptions, ['Entity', 'length', (f: Field) => f.DisplayName.toLowerCase()]);
          this.filteredFields = groupBy(matchingFields, [{field: 'Entity'}]);
        }
        this.reportFieldsList.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.filterChangeSubscription.unsubscribe();
  }

  handleValueChanged(dataElementId: string) {
    const field = this.fields.find(f => f.DataElementId === Number(dataElementId));
    if (field) {
      this.fieldAdded.emit(field);
    }
    this.reportFieldsList.reset();
  }
}
