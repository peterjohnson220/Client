import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';
import { DataViewFieldDataType, BasicDataViewField } from 'libs/models/payfactors-api';

import * as fromBasicGridActions from '../../actions/basic-data-grid.actions';
import * as fromBasicGridReducer from '../../reducers';
import { BasicGridSettings, getDefaultBasicGridSettings } from '../../models';

@Component({
  selector: 'pf-basic-data-grid',
  templateUrl: './basic-data-grid.component.html',
  styleUrls: ['./basic-data-grid.component.scss']
})
export class BasicDataGridComponent implements OnInit {
  @Input() gridId: string;
  @Input() dataAsync$: Observable<AsyncStateObj<any[]>>;
  @Input() fields$: Observable<BasicDataViewField[]>;
  @Input() loadingMoreData$: Observable<boolean>;
  @Input() settings: BasicGridSettings = getDefaultBasicGridSettings();
  @Output() scrollBottom: EventEmitter<any> = new EventEmitter();

  sortDescriptor$: Observable<SortDescriptor[]>;

  dataViewFieldDataType = DataViewFieldDataType;

  constructor(
    private store: Store<fromBasicGridReducer.State>
  ) {}

  ngOnInit(): void {
    if (this.gridId && this.settings.Sortable) {
      this.sortDescriptor$ = this.store.select(fromBasicGridReducer.getSortDescriptors, this.gridId);
    }
  }

  handleScrollBottom(): void {
    this.scrollBottom.emit();
  }

  trackByFn(index: any, field: BasicDataViewField) {
    return field.KendoGridField;
  }

  handleSortChange(sorts: SortDescriptor[]): void {
    if (!this.gridId) {
      return;
    }
    const updatedSort = sorts?.length && sorts[0].dir ? sorts[0] : null;
    this.store.dispatch(new fromBasicGridActions.UpdateSort(this.gridId, updatedSort));
  }

  hasFieldTemplate(fieldName: string): boolean {
    return this.settings && this.settings.FieldTemplates[fieldName];
  }
}
