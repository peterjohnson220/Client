import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { Field } from '../../models';
import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';

@Component({
  selector: 'pf-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  isOpen = true;

  selectedFields$: Observable<Field[]>;
  unselectedFields$: Observable<Field[]>;

  dragulaSub: Subscription;
  selectedFieldsSub: Subscription;

  selectedFields: Field[];

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
  }

  ngOnInit(): void {
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => this.selectedFields = fields);
  }

  ngOnDestroy(): void {
    this.selectedFieldsSub.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleFieldRemoved(fieldToBeRemoved: Field) {
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

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

}
