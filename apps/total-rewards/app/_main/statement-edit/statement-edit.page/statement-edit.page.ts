import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromTotalRewardsStatementEditReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions/statement-edit.page.actions';
import {
  EmployeeRewardsData, generateMockEmployeeRewardsData,
  Statement,
  StatementModeEnum,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  UpdateStringPropertyRequest,
  UpdateTitleRequest
} from '../../../shared/models';

@Component({
  selector: 'pf-statement-edit.page',
  templateUrl: './statement-edit.page.html',
  styleUrls: ['./statement-edit.page.scss']
})
export class StatementEditPageComponent implements OnDestroy, OnInit {
  pageTitle = 'Total Rewards Statements';
  statementNameMaxLength = 100;
  statement$: Observable<Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  statementSaving$: Observable<boolean>;
  statementSavingSuccess$: Observable<boolean>;
  statementSavingError$: Observable<boolean>;
  cloningFromTemplate$: Observable<boolean>;
  cloningFromTemplateError$: Observable<boolean>;
  mode$: Observable<StatementModeEnum>;

  urlParamSubscription: Subscription;
  statementSubscription: Subscription;
  modeSubscription: Subscription;

  statement: Statement;
  statementId: string;
  templateId: string;
  employeeRewardsData: EmployeeRewardsData;
  mode: StatementModeEnum;
  modeEnum = StatementModeEnum;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromTotalRewardsStatementEditReducer.State>
  ) { }

  ngOnInit() {
    this.statement$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementState));
    this.statementLoading$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementLoading));
    this.statementLoadingError$ =  this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementLoadingError));
    this.statementSaving$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSaving));
    this.statementSavingSuccess$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSavingSuccess));
    this.statementSavingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSavingError));
    this.cloningFromTemplate$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectCloningFromTemplate));
    this.cloningFromTemplateError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectCloningFromTemplateError));
    this.mode$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementMode));
    this.urlParamSubscription = this.route.params.subscribe(params => {
      if (params['id']) {
        this.statementId = params['id'];
        this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
      } else if (params['templateId']) {
        this.templateId = params['templateId'];
        this.store.dispatch(new fromEditStatementPageActions.CloneStatementFromTemplate(this.templateId));
      }
    });
    this.statementSubscription = this.statement$.subscribe(s => {
      if (s) {
        this.statement = cloneDeep(s);
      }
    });

    this.modeSubscription = this.mode$.subscribe(e => {
      this.mode = e;
      if (this.mode === StatementModeEnum.Preview) {
        this.employeeRewardsData = generateMockEmployeeRewardsData();
      }
    });
  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
    this.statementSubscription.unsubscribe();
    this.modeSubscription.unsubscribe();
  }

  getStatementName(): string {
    let statementName = '';
    if (this.statement) {
      statementName = this.statement.StatementName;
    }
    return statementName;
  }

  onStatementNameValueChange(value: string): void {
    this.store.dispatch(new fromEditStatementPageActions.UpdateStatementName(value));
  }

  handleStatementReload() {
    if (this.statementId) {
      this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
    } else if (this.templateId) {
      this.store.dispatch(new fromEditStatementPageActions.CloneStatementFromTemplate(this.templateId));
    }
  }

  // CONTROL METHODS //
  // COMMON //
  handleOnControlTitleChange(request: UpdateTitleRequest) {
   this.store.dispatch(new fromEditStatementPageActions.UpdateStatementControlTitle(request));
  }

  // CALCULATION //
  handleOnCalculationControlCompFieldTitleChange(request: UpdateFieldOverrideNameRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateCalculationControlFieldTitle(request));
  }

  handleOnCalculationControlSummaryTitleChange(request: UpdateTitleRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateCalculationControlSummaryTitle(request));
  }

  handleOnCalculationControlCompFieldRemoved(request: UpdateFieldVisibilityRequest) {
   this.store.dispatch(new fromEditStatementPageActions.RemoveCalculationControlCompensationField(request));
  }

  handleOnCalculationControlCompFieldAdded(request: UpdateFieldVisibilityRequest) {
    this.store.dispatch(new fromEditStatementPageActions.AddCalculationControlCompensationField(request));
  }

  // RICH TEXT
  handleOnRichTextControlContentChange(request: UpdateStringPropertyRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateRichTextControlContent(request));
  }

  toggleStatementEditMode() {
    if (this.mode === StatementModeEnum.Edit) {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(StatementModeEnum.Preview));
    } else {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(StatementModeEnum.Edit));
    }
  }
}
