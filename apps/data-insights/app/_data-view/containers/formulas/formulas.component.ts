import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsMainReducer from '../../../_main/reducers/index';
import { FormulaFieldModalObj, Suggestion } from '../../models';
import { DataViewAccessLevel, Field, UserDataView } from '../../../_main/models';
import { FormulaFieldModalComponent } from '../formula-field-modal';


@Component({
  selector: 'pf-data-view-formulas',
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.scss']
})
export class FormulasComponent implements OnInit, OnDestroy {
  @ViewChild(FormulaFieldModalComponent, { static: true }) public formulaFieldModal: FormulaFieldModalComponent;
  dataView$: Observable<AsyncStateObj<UserDataView>>;
  formulaFieldSuggestions$: Observable<Suggestion[]>;
  userForumla$: Observable<Field[]>;

  userFormulaSub: Subscription;
  dataViewSub: Subscription;

  userFormulas: Field[];
  formulaFieldModalObj: FormulaFieldModalObj;
  dataViewAccessLevel: DataViewAccessLevel;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
    this.userForumla$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserFormulas));
    this.dataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.formulaFieldSuggestions$ = this.store.pipe(select(fromDataInsightsMainReducer.getFormulaFieldSuggestions));
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
      DuplicateAllowed: false
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
      DuplicateAllowed: this.dataViewAccessLevel !== DataViewAccessLevel.ReadOnly
    };
    this.formulaFieldModal.open();
  }

}
