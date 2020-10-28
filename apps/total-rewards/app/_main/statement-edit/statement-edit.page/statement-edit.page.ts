import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { GenericNameValue } from 'libs/models/common';
import * as models from 'libs/features/total-rewards/total-rewards-statement/models';
import { FontSize, FontFamily } from 'libs/features/total-rewards/total-rewards-statement/types';

import * as fromTotalRewardsStatementEditReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions';
import { CompensationField } from 'libs/features/total-rewards/total-rewards-statement/models';

@Component({
  selector: 'pf-statement-edit.page',
  templateUrl: './statement-edit.page.html',
  styleUrls: ['./statement-edit.page.scss']
})
export class StatementEditPageComponent implements OnDestroy, OnInit {
  statementNameMaxLength = 35;

  statement$: Observable<models.Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  statementSaving$: Observable<boolean>;
  statementSavingSuccess$: Observable<boolean>;
  statementSavingError$: Observable<boolean>;
  mode$: Observable<models.StatementModeEnum>;
  assignedEmployeesAsync$: Observable<AsyncStateObj<GenericNameValue<number>[]>>;
  employeeRewardsDataAsync$: Observable<AsyncStateObj<EmployeeRewardsData>>;
  companyUdfAsync$: Observable<AsyncStateObj<CompensationField[]>>;

  isSettingsPanelOpen$: Observable<boolean>;
  settingsSaving$: Observable<boolean>;
  settingsSavingSuccess$: Observable<boolean>;
  settingsSavingError$: Observable<boolean>;

  urlParamSubscription = new Subscription();
  statementSubscription = new Subscription();
  modeSubscription = new Subscription();

  statement: models.Statement;
  statementId: string;
  employeeRewardsData: EmployeeRewardsData;
  mode: models.StatementModeEnum;
  modeEnum = models.StatementModeEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    this.mode$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectStatementMode));
    this.companyUdfAsync$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getCompanyUdf));

    // SETTINGS
    this.isSettingsPanelOpen$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsPanelOpen));
    this.settingsSaving$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaving));
    this.settingsSavingSuccess$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveSuccess));
    this.settingsSavingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveError));

    // PREVIEW
    this.assignedEmployeesAsync$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectAssignedEmployees));
    this.employeeRewardsDataAsync$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getEmployeeData));

    // SUBSCRIPTIONS
    this.urlParamSubscription = this.route.params.subscribe(params => {
      this.statementId = params['id'];
      this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
      this.store.dispatch(new fromEditStatementPageActions.GetCompanyUDF());
    });
    this.statementSubscription = this.statement$.subscribe(s => {
      if (s) {
        this.statement = cloneDeep(s);
      }
    });

    this.modeSubscription = this.mode$.subscribe(e => {
      this.mode = e;
      if (this.mode === models.StatementModeEnum.Preview) {
        this.store.dispatch(new fromEditStatementPageActions.ResetEmployeeRewardsData());
        this.store.dispatch(new fromEditStatementPageActions.SearchAssignedEmployees({ statementId: this.statementId, searchTerm: ''}));
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
    this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
  }

  toggleStatementEditMode() {
    if (this.mode === models.StatementModeEnum.Edit) {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(models.StatementModeEnum.Preview));
    } else {
      this.store.dispatch(new fromEditStatementPageActions.ToggleStatementEditMode(models.StatementModeEnum.Edit));
    }
  }

  // FOOTER METHODS
  handleAssignEmployeesClick() {
    this.router.navigate(['statement/edit/' + this.statementId + '/assignments']).then();
  }

  handleBackToStatementsClick() {
    this.router.navigate(['']);
  }

  handleCreateStatementClick() {
    this.router.navigate(['']).then();
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

  // CHART
  handleOnChartControlToggleSettingsPanelClick() {
    this.store.dispatch(new fromEditStatementPageActions.ToggleSettingsPanel());
  }

  // SETTINGS
  handleToggleSettingsPanelClick() {
    this.store.dispatch(new fromEditStatementPageActions.ToggleSettingsPanel());
  }

  handleCloseSettingsClick() {
    this.store.dispatch(new fromEditStatementPageActions.CloseSettingsPanel());
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

  // IMAGE CONTROL
  handleSaveImage(saveImageRequest) {
    this.store.dispatch(new fromEditStatementPageActions.SaveImageControlImage(saveImageRequest));
  }

  handleRemoveImage(deleteImageRequest) {
    this.store.dispatch(new fromEditStatementPageActions.RemoveImageControlImage(deleteImageRequest));
  }

  // EFFECTIVE DATE
  handleEffectiveDateChange(date: Date) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateEffectiveDate({ effectiveDate: date }));
  }

  // PREVIEW
  handleAssignedEmployeesFilterChange(value: string): void {
    this.store.dispatch(new fromEditStatementPageActions.SearchAssignedEmployees({ statementId: this.statementId, searchTerm: value }));
  }

  handleAssignedEmployeesValueChange(employeeId: number): void {
    if (!employeeId) {
      this.store.dispatch(new fromEditStatementPageActions.ResetEmployeeRewardsData());
      return;
    }
    this.store.dispatch(new fromEditStatementPageActions.GetEmployeeRewardsData({ companyEmployeeId: employeeId }));
  }
}
