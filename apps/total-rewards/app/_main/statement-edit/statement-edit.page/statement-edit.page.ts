import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromTotalRewardsStatementEditReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions';
import * as models from '../../../shared/models';
import { FontSize, FontFamily } from '../../../shared/types';

@Component({
  selector: 'pf-statement-edit.page',
  templateUrl: './statement-edit.page.html',
  styleUrls: ['./statement-edit.page.scss']
})
export class StatementEditPageComponent implements OnDestroy, OnInit {
  pageTitle = 'Total Rewards Statements';
  statementNameMaxLength = 35;

  statement$: Observable<models.Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  statementSaving$: Observable<boolean>;
  statementSavingSuccess$: Observable<boolean>;
  statementSavingError$: Observable<boolean>;
  cloningFromTemplate$: Observable<boolean>;
  cloningFromTemplateError$: Observable<boolean>;
  mode$: Observable<models.StatementModeEnum>;

  isSettingsPanelOpen$: Observable<boolean>;
  settingsSaving$: Observable<boolean>;
  settingsSavingSuccess$: Observable<boolean>;
  settingsSavingError$: Observable<boolean>;

  urlParamSubscription = new Subscription();
  statementSubscription = new Subscription();
  modeSubscription = new Subscription();

  statement: models.Statement;
  statementId: string;
  templateId: string;
  employeeRewardsData: models.EmployeeRewardsData;
  mode: models.StatementModeEnum;
  modeEnum = models.StatementModeEnum;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromTotalRewardsStatementEditReducer.State>
  ) { }

  ngOnInit() {
    // STATEMENT
    this.statement$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatement));
    this.statementLoading$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementLoading));
    this.statementLoadingError$ =  this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementLoadingError));
    this.statementSaving$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSaving));
    this.statementSavingSuccess$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSavingSuccess));
    this.statementSavingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementSavingError));
    this.cloningFromTemplate$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectCloningFromTemplate));
    this.cloningFromTemplateError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectCloningFromTemplateError));
    this.mode$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementMode));

    // SETTINGS
    this.isSettingsPanelOpen$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsPanelOpen));
    this.settingsSaving$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaving));
    this.settingsSavingSuccess$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveSuccess));
    this.settingsSavingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveError));

    // SUBSCRIPTIONS
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
      if (this.mode === models.StatementModeEnum.Preview) {
        this.employeeRewardsData = models.generateMockEmployeeRewardsData();
      }
    });
  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
    this.statementSubscription.unsubscribe();
    this.modeSubscription.unsubscribe();
    this.store.dispatch(new fromEditStatementPageActions.ResetStatement());
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
  handleOnControlTitleChange(request: models.UpdateTitleRequest) {
   this.store.dispatch(new fromEditStatementPageActions.UpdateStatementControlTitle(request));
  }

  // CALCULATION //
  handleOnCalculationControlCompFieldTitleChange(request: models.UpdateFieldOverrideNameRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateCalculationControlFieldTitle(request));
  }

  handleOnCalculationControlSummaryTitleChange(request: models.UpdateTitleRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateCalculationControlSummaryTitle(request));
  }

  handleOnCalculationControlCompFieldRemoved(request: models.UpdateFieldVisibilityRequest) {
   this.store.dispatch(new fromEditStatementPageActions.RemoveCalculationControlCompensationField(request));
  }

  handleOnCalculationControlCompFieldAdded(request: models.UpdateFieldVisibilityRequest) {
    this.store.dispatch(new fromEditStatementPageActions.AddCalculationControlCompensationField(request));
  }

  // RICH TEXT
  handleOnRichTextControlContentChange(request: models.UpdateStringPropertyRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateRichTextControlContent(request));
  }

  toggleStatementEditMode() {
    if (this.mode === models.StatementModeEnum.Edit) {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(models.StatementModeEnum.Preview));
    } else {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(models.StatementModeEnum.Edit));
    }
  }

  // SETTINGS
  handleOpenSettingsClick() {
    this.store.dispatch(new fromEditStatementPageActions.OpenSettings());
  }

  handleCloseSettingsClick() {
    this.store.dispatch(new fromEditStatementPageActions.CloseSettings());
  }

  handleSettingsFontSizeChange(fontSize: FontSize) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsFontSize(fontSize));
  }

  handleSettingsFontFamilyChange(fontFamily: FontFamily) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsFontFamily(fontFamily));
  }

  handleSettingsChartColorChange(request: models.UpdateSettingsChartColorRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsChartColor(request));
  }

  handleResetSettings() {
    this.store.dispatch(new fromEditStatementPageActions.ResetSettings());
  }
}
