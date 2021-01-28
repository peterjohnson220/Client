import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { DataViewAccessLevel, Field, UserDataView, Suggestion } from 'libs/ui/formula-editor';
import * as fromFormulaFieldActions from 'libs/ui/formula-editor/actions/formula-field.actions';
import { FormulaFieldModalObj } from 'libs/models/formula-editor';

import * as fromDataViewMainReducer from '../../reducers';
import { FormulaFieldModalComponent } from '../formula-field-modal';
import { DeleteUserFormulaModalComponent } from '../../components/delete-user-formula-modal';

@Component({
  selector: 'pf-data-view-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.scss']
})
export class FormulasComponent implements OnInit, OnDestroy {
  @ViewChild(FormulaFieldModalComponent, { static: true }) public formulaFieldModal: FormulaFieldModalComponent;
  @ViewChild(DeleteUserFormulaModalComponent, { static: true }) public deleteFormulaFieldModal: DeleteUserFormulaModalComponent;
  dataView$: Observable<AsyncStateObj<UserDataView>>;
  formulaFieldSuggestions$: Observable<Suggestion[]>;
  userFormula$: Observable<Field[]>;
  formulaViewCount$: Observable<AsyncStateObj<number>>;

  userFormulaSub: Subscription;
  dataViewSub: Subscription;

  userFormulas: Field[];
  formulaFieldModalObj: FormulaFieldModalObj;
  dataViewAccessLevel: DataViewAccessLevel;
  formulaToDelete: Field;

  constructor(
    private store: Store<fromDataViewMainReducer.State>
  ) {
    this.userFormula$ = this.store.pipe(select(fromDataViewMainReducer.getUserFormulas));
    this.dataView$ = this.store.pipe(select(fromDataViewMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaFieldSuggestions));
    this.formulaViewCount$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaViewCount));
  }

  ngOnInit() {
    this.userFormulaSub = this.userFormula$.subscribe(fields => {
      if (!!fields && fields.length !== 0) {
        this.userFormulas = fields;
      }
    });
    this.dataViewSub = this.dataView$.subscribe(result => {
      if (!!result.obj) {
        this.dataViewAccessLevel = result.obj.AccessLevel;
      }
    });
  }

  ngOnDestroy() {
    this.userFormulaSub.unsubscribe();
    this.dataViewSub.unsubscribe();
  }

  trackByFn(index: any, userFormula: Field): number {
    return userFormula.DataElementId;
  }

  handleCreateFormulaFieldClicked(): void {
    this.formulaFieldModalObj = {
      Title: 'Create Formula Field',
      FieldName: '',
      Formula: '',
      IsEditable: true,
      DuplicateAllowed: false,
      IsPublic: false,
      AccessLevel: DataViewAccessLevel.Owner
    };
    this.formulaFieldModal.open();
  }

  handleEditFormulaClicked(field: Field): void {
    this.formulaFieldModalObj = {
      Title: field.IsEditable ? 'Edit Formula Field' : 'View Formula Field',
      FieldName: field.FormulaName,
      Formula: field.Formula,
      IsEditable: field.IsEditable,
      FormulaId: field.FormulaId,
      DuplicateAllowed: this.dataViewAccessLevel !== DataViewAccessLevel.ReadOnly,
      DataType: field.DataType,
      IsPublic: field.IsPublic,
      AccessLevel: field.AccessLevel
    };
    this.formulaFieldModal.open();
  }

  handleDeleteFormulaClicked(field: Field): void {
    this.formulaToDelete = field;
    this.store.dispatch(new fromFormulaFieldActions.GetFormulaFieldViewCount(field.FormulaId));
    this.deleteFormulaFieldModal.open();
  }

  handleDeleteConfirmClicked(field: Field): void {
    this.store.dispatch(new fromFormulaFieldActions.DeleteFormulaField(field));
  }

}
