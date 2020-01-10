import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromFieldsActions from '../../actions/fields.actions';
import { Field, UserDataView } from '../../models';
import { FormulaFieldModalComponent } from '../../../_data-view/containers';
import { FormulaFieldModalObj } from '../../../_data-view/models';

@Component({
  selector: 'pf-data-view-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit, OnDestroy {
  @ViewChild(FormulaFieldModalComponent, { static: true }) public formulaFieldModal: FormulaFieldModalComponent;
  allFieldsAsync$: Observable<AsyncStateObj<Field[]>>;
  selectedFields$: Observable<Field[]>;
  unselectedFields$: Observable<Field[]>;
  formulaBuilderEnabled$: Observable<boolean>;
  dataView$: Observable<AsyncStateObj<UserDataView>>;
  formulaFieldSuggestions$: Observable<string[]>;

  dragulaSub: Subscription;
  selectedFieldsSub: Subscription;

  selectedFields: Field[];
  viewAllFields: boolean;
  formulaFieldModalObj: FormulaFieldModalObj;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private dragulaService: DragulaService,
    private settingService: SettingsService
  ) {
    this.allFieldsAsync$ = this.store.pipe(select(fromDataInsightsMainReducer.getReportFieldsAsync));
    this.selectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
    this.unselectedFields$ = this.store.pipe(select(fromDataInsightsMainReducer.getUnselectedFields));
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('fields-bag').subscribe(({ sourceModel }) => {
      this.handleFieldsReordered(sourceModel);
    }));
    this.viewAllFields = false;
    this.formulaBuilderEnabled$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DataInsightsFormulaBuilder
    );
    this.dataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataInsightsMainReducer.getFormulaFieldSuggestions));
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

  handleDisplayNameUpdated(field: Field, displayName: string): void {
    this.store.dispatch(new fromFieldsActions.UpdateDisplayName({ field, displayName }));
  }

  toggleViewAllFields() {
    this.viewAllFields = !this.viewAllFields;
  }

  handleCreateFormulaFieldClicked(): void {
    this.formulaFieldModalObj = {
      Title: 'Create Formula Field',
      FieldName: '',
      Formula: '',
      IsEditable: true
    };
    this.formulaFieldModal.open();
  }

}
