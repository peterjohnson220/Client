import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataViewMainReducer from '../../reducers';
import { FormulaFieldModalObj, Suggestion, DataViewAccessLevel, Field, UserDataView } from '../../models';
import { FormulaFieldModalComponent } from '../formula-field-modal';
import { DeleteUserFormulaModalComponent } from '../../components/delete-user-formula-modal';
import * as fromFormulaFieldActions from '../../actions/formula-field.actions';

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
  userForumla$: Observable<Field[]>;
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
    this.userForumla$ = this.store.pipe(select(fromDataViewMainReducer.getUserFormulas));
    this.dataView$ = this.store.pipe(select(fromDataViewMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaFieldSuggestions));
    this.formulaViewCount$ = this.store.pipe(select(fromDataViewMainReducer.getFormulaViewCount));
  }

  ngOnInit() {
      this.userFormulaSub = this.userForumla$.subscribe( field => {
        if (field.length !== 0) {
          this.userFormulas = field;
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
      IsPublic: false
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
      IsPublic: field.IsPublic
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
