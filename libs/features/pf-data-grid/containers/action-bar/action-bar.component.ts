import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { ViewField, SimpleDataView } from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';


@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges {

  @Input() showColumnChooser = true;
  @Input() showFilterChooser = true;
  @Input() allowExport = true;
  @Input() pageViewId: string;
  @Input() globalFilterAlignment: string;
  @Input() globalActionsTemplate: TemplateRef<any>;
  @Output() onFilterSidebarToggle = new EventEmitter();

  dataFields$: Observable<ViewField[]>;
  savedViews$: Observable<SimpleDataView[]>;
  selectedRowId$: Observable<number>;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.savedViews$ = this.store.select(fromReducer.getSavedViews, changes['pageViewId'].currentValue);
      this.selectedRowId$ = this.store.select(fromReducer.getSelectedRowId, this.pageViewId);
    }
  }

  updateFields(updatedFields: ViewField[]) {
    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }

  toggleFilterPanel() {
    this.onFilterSidebarToggle.emit();
  }

  savedViewClicked(view: SimpleDataView) {
    this.store.dispatch(new fromActions.LoadViewConfig(this.pageViewId, view.Name));
  }
}
