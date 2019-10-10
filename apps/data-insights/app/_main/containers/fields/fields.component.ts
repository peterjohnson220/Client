import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromFieldsActions from '../../actions/fields.actions';
import { Field } from '../../models';

@Component({
  selector: 'pf-data-view-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit, OnDestroy {
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

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  handleFieldAdded(fieldToAdd: Field): void {
    this.store.dispatch(new fromFieldsActions.AddSelectedField(fieldToAdd));
  }

  handleFieldRemoved(fieldToBeRemoved: Field): void {
    this.store.dispatch(new fromFieldsActions.RemoveSelectedField(fieldToBeRemoved));
  }

  handleFieldsReordered(sourceModel: Field[]): void {
    if (!sourceModel) {
      return;
    }
    this.store.dispatch(new fromFieldsActions.ReorderFields(sourceModel));
  }

  handleDisplayNameUpdated(dataElementId: number, displayName: string): void {
    this.store.dispatch(new fromFieldsActions.UpdateDisplayName({ dataElementId, displayName }));
  }
}
