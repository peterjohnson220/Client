import { Component, OnInit, OnDestroy } from '@angular/core';
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { AsyncStateObj } from 'libs/models/state';
import { Field, UserDataView, Suggestion } from 'libs/features/formula-editor';
import * as fromFieldsActions from 'libs/features/formula-editor/actions/fields.actions';

import * as fromDataInsightsMainReducer from '../../reducers';

@Component({
  selector: 'pf-data-view-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit, OnDestroy {
  allFieldsAsync$: Observable<AsyncStateObj<Field[]>>;
  selectedFields$: Observable<Field[]>;
  unselectedFields$: Observable<Field[]>;
  dataView$: Observable<AsyncStateObj<UserDataView>>;
  formulaFieldSuggestions$: Observable<Suggestion[]>;

  dragulaSub: Subscription;
  selectedFieldsSub: Subscription;

  selectedFields: Field[];
  viewAllFields: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService
  ) {
    this.allFieldsAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getReportFieldsAsync));
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.unselectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getUnselectedFields));
    this.initDragulaSub();
    this.viewAllFields = false;
    this.dataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataInsightsMainReducer.getFormulaFieldSuggestions));
  }

  ngOnInit(): void {
    this.selectedFieldsSub = this.selectedFields$.subscribe(fields => this.selectedFields = cloneDeep(fields));
  }

  ngOnDestroy(): void {
    this.selectedFieldsSub.unsubscribe();
    this.destroyDragula();
  }

  handleFieldAdded(fieldToAdd: Field): void {
    this.store.dispatch(new fromFieldsActions.AddSelectedField(fieldToAdd));
  }

  handleFieldRemoved(fieldToBeRemoved: Field): void {
    this.store.dispatch(new fromFieldsActions.RemoveSelectedField(fieldToBeRemoved));
  }

  handlefieldIsActive(data: {field: Field, multipleSelection: boolean}) {
    const activeFields = this.selectedFields.filter(f => f.IsActive);
    if (!!activeFields) {
      activeFields.forEach(f => {
        if (f.KendoGridField !== data.field.KendoGridField && (data.multipleSelection === false || data.multipleSelection === undefined)) {
          f.IsActive = false;
        }
      });
    }
  }

  handleFieldsReordered(sourceModel: Field[], targetIndex: number): void {
    if (!sourceModel) {
      return;
    }
    const active = orderBy(sourceModel.filter(field => field.IsActive), 'Order');
    const notActive = sourceModel.filter(field => !field.IsActive);
    active.forEach(field => {
      notActive.splice(targetIndex, 0, field);
      targetIndex++;
    });
    this.store.dispatch(new fromFieldsActions.ReorderFields(notActive));
  }

  handleDisplayNameUpdated(field: Field, displayName: string): void {
    this.store.dispatch(new fromFieldsActions.UpdateDisplayName({ field, displayName }));
  }

  toggleViewAllFields() {
    this.viewAllFields = !this.viewAllFields;
  }

  get activeFields() {
    return this.selectedFields.filter(f => f.IsActive).length;
  }

  private initDragulaSub(): void {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('fields-bag').subscribe(({ sourceModel, targetIndex }) => {
      this.handleFieldsReordered(sourceModel, targetIndex);
    }));
    this.dragulaService.createGroup('fields-bag', {
      moves: function (el, container, handle) {
        return handle.classList.contains('field-container');
      }
    });
  }

  private destroyDragula() {
    this.dragulaSub.unsubscribe();
    this.dragulaService.destroy('fields-bag');
  }

}
