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

  filters$: Observable<Filter[]>;
  selectedFields$: Observable<Field[]>;
  unselectedFields$: Observable<Field[]>;

  dragulaSub: Subscription;
  selectedFieldsSub: Subscription;
  filtersSub: Subscription;

  selectedFields: Field[];
  filters: Filter[];
  configureTabOptions: Array<string> = ['Fields', 'Filters'];

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.unselectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getUnselectedFields));
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('fields-bag').subscribe(({ sourceModel }) => {
      this.handleFieldsReordered(sourceModel);
    }));
    this.filters$ = this.store.pipe(select(fromDataInsightsMainReducer.getFilters));
  }

  ngOnInit(): void {
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => this.selectedFields = fields);
    this.filtersSub = this.filters$.subscribe(filters => this.filters = filters);
  }

  ngOnDestroy(): void {
    this.selectedFieldsSub.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleFieldRemoved(fieldToBeRemoved: Field) {
    const hasFiltersToBeRemoved: boolean = this.filters.some(f => f.Field.DataElementId === fieldToBeRemoved.DataElementId);
    if (hasFiltersToBeRemoved) {
      this.store.dispatch(new fromConfigurationActions.RemoveFilter(fieldToBeRemoved));
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
