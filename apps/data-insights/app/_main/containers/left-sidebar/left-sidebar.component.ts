import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { Field, Filter } from '../../models';
import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import * as fromConfigurationActions from '../../actions/configuration.actions';

@Component({
  selector: 'pf-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  isOpen = true;
  selectedTabIndex = 0;
  activeTab = 'Fields';

  selectedFields$: Observable<Field[]>;
  unselectedFields$: Observable<Field[]>;
  activeFilters$: Observable<Filter[]>;
  pendingFilters$: Observable<Filter[]>;

  dragulaSub: Subscription;
  selectedFieldsSub: Subscription;
  activeFiltersSub: Subscription;
  pendingFiltersSub: Subscription;

  selectedFields: Field[];
  activeFilters: Filter[];
  pendingFilters: Filter[];
  configureTabOptions: Array<string> = ['Fields', 'Filters'];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.unselectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getUnselectedFields));
    this.activeFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters));
    this.pendingFilters$ = this.store.pipe(select(fromDataInsightsMainReducer.getPendingFilters));
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('fields-bag').subscribe(({ sourceModel }) => {
      this.handleFieldsReordered(sourceModel);
    }));
  }

  ngOnInit(): void {
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => this.selectedFields = fields);
    this.activeFiltersSub = this.activeFilters$.subscribe(filters => this.activeFilters = filters);
    this.pendingFiltersSub = this.pendingFilters$.subscribe(filters => this.pendingFilters = filters);
  }

  ngOnDestroy(): void {
    this.selectedFieldsSub.unsubscribe();
    this.activeFiltersSub.unsubscribe();
    this.pendingFiltersSub.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleFieldRemoved(fieldToBeRemoved: Field) {
    const activeFiltersContainField = this.activeFilters.some(f => f.Field.DataElementId === fieldToBeRemoved.DataElementId);
    const pendingFiltersContainField = this.pendingFilters.some(f => f.Field.DataElementId === fieldToBeRemoved.DataElementId);
    if (activeFiltersContainField) {
      this.store.dispatch(new fromConfigurationActions.RemoveActiveFiltersByField(fieldToBeRemoved));
    }
    if (pendingFiltersContainField) {
      this.store.dispatch(new fromConfigurationActions.RemovePendingFiltersByField(fieldToBeRemoved));
    }
    this.store.dispatch(new fromDataViewActions.RemoveSelectedField(fieldToBeRemoved));
  }

  handleFieldsReordered(sourceModel: Field[]) {
    if (!sourceModel) {
      return;
    }
    this.store.dispatch(new fromDataViewActions.ReorderFields(sourceModel));
  }

  handleFieldAdded(fieldToAdd: Field) {
    this.store.dispatch(new fromDataViewActions.AddSelectedField(fieldToAdd));
  }

  handleSaveDisplayName(newDisplayName) {
    this.store.dispatch(new fromDataViewActions.UpdateDisplayName(newDisplayName));
}

  selectTab(index: number, configureTab: string) {
    this.activeTab = configureTab;
    this.selectedTabIndex = index;
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

}
