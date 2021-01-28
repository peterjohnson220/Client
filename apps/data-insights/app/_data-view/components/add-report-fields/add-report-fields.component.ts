import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

import orderBy from 'lodash/orderBy';
import { groupBy } from '@progress/kendo-data-query';
import { AutoCompleteComponent } from '@progress/kendo-angular-dropdowns';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { PfConstants } from 'libs/models/common';
import { Field, FieldListItem, FieldType } from 'libs/ui/formula-editor';

@Component({
  selector: 'pf-add-report-fields',
  templateUrl: './add-report-fields.component.html',
  styleUrls: ['./add-report-fields.component.scss']
})
export class AddReportFieldsComponent implements OnChanges, AfterViewInit, OnDestroy  {
  @ViewChild('reportFieldsList') reportFieldsList: AutoCompleteComponent;
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
            IsSelected: x.IsSelected,
            FieldListItemId: this.buildFieldListItemId(x)
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
          this.filteredFields = [];
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

  handleValueChanged(fieldListItemId: string) {
    const field = this.findFieldByFieldListItemId(fieldListItemId);
    if (field) {
      this.fieldAdded.emit(field);
    }
    this.reportFieldsList.reset();
  }

  itemDisabled(itemArgs: {dataItem: any, index: number}) {
    return itemArgs.dataItem.IsSelected;
  }

  private findFieldByFieldListItemId(fieldListItemId: string): Field {
    const itemIdParser = fieldListItemId.split('_');
    if (itemIdParser.length !== 2) {
      return null;
    }
    let field: Field = null;
    if (itemIdParser[0] === FieldType.DataElement) {
      field = this.fields.find(f => f.DataElementId === Number(itemIdParser[1]));
    } else if (itemIdParser[0] === FieldType.Formula) {
      field = this.fields.find(f => f.FormulaId === Number(itemIdParser[1]));
    }
    return field;
  }

  private buildFieldListItemId(field: Field): string {
    let fieldId = '';
    if (field.DataElementId) {
      fieldId = `${FieldType.DataElement}_${field.DataElementId.toString()}`;
    } else if (field.FormulaId) {
      fieldId = `${FieldType.Formula}_${field.FormulaId.toString()}`;
    }
    return fieldId;
  }
}
