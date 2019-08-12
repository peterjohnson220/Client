import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { Field } from '../../models';
import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';

@Component({
  selector: 'pf-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent {
  isOpen = true;

  selectedFields$: Observable<Field[]>;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleFieldRemoved(fieldToBeRemoved: Field) {
    this.store.dispatch(new fromDataViewActions.RemoveSelectedField(fieldToBeRemoved));
  }

  handleFieldsReordered(fields: Field[]) {
    this.store.dispatch(new fromDataViewActions.ReorderFields(fields));
  }

}
