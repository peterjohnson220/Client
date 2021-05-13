import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { throttleTime, filter, map, tap } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { GenericNameValue } from 'libs/models/common';
import * as models from 'libs/features/total-rewards/total-rewards-statement/models';
import { FontFamily, FontSize } from 'libs/features/total-rewards/total-rewards-statement/types';
import { TotalRewardsStatementService } from 'libs/features/total-rewards/total-rewards-statement/services/total-rewards-statement.service';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { AppNotification } from 'libs/features/infrastructure/app-notifications';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';

import * as fromTotalRewardsStatementEditReducer from '../reducers';
import * as fromEditStatementPageActions from '../actions';

@Component({
  selector: 'pf-statement-edit.page',
  templateUrl: './statement-edit.page.html',
  styleUrls: ['./statement-edit.page.scss']
})
export class StatementEditPageComponent implements OnDestroy, OnInit {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) public fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  statementNameMaxLength = 45;
  statement$: Observable<models.Statement>;
  statementLoading$: Observable<boolean>;
  statementLoadingError$: Observable<boolean>;
  statementSaving$: Observable<boolean>;
  statementSavingSuccess$: Observable<boolean>;
  statementSavingError$: Observable<boolean>;
  mode$: Observable<models.StatementModeEnum>;
  assignedEmployeesAsync$: Observable<AsyncStateObj<GenericNameValue<number>[]>>;
  employeeRewardsDataAsync$: Observable<AsyncStateObj<EmployeeRewardsData>>;
  companyUdfAsync$: Observable<AsyncStateObj<models.CompensationField[]>>;
  visibleFieldsCount$: Observable<number>;
  activeRichTextEditorId$: Observable<string>;
  isPageScrolling$: Observable<boolean>;

  isSettingsPanelOpen$: Observable<boolean>;
  settingsSaving$: Observable<boolean>;
  settingsSavingSuccess$: Observable<boolean>;
  settingsSavingError$: Observable<boolean>;

  enableFileDownloadSecurityWarning$: Observable<boolean>;

  getNotification$: Observable<AppNotification<any>[]>;
  generateStatementPreviewEventId$: Observable<AsyncStateObj<string>>;
  statementPreviewGenerating$: Observable<boolean>;
  statementPreviewGeneratingError$: Observable<boolean>;

  allSubscriptions = new Subscription();

  statement: models.Statement;
  statementId: string;
  employeeRewardsData: EmployeeRewardsData;
  mode: models.StatementModeEnum;
  modeEnum = models.StatementModeEnum;
  toolbarWhitelist = [
    'ql-editor',
    'ql-toolbar',
    'ql-formats',
    'ql-size',
    'ql-bold',
    'ql-list',
    'ql-italic',
    'ql-picker-label',
    'ql-underline',
    'ql-picker-item'
  ];
  lastClickEventElement: HTMLElement;

  mainScrollableNode: HTMLElement;
  scrollTimer: any;
  scrollSubject = new Subject();
  allowClosingSettingsByClickingElsewhere = false;
  isSettingsPanelOpen = false;
  enableFileDownloadSecurityWarning: boolean;
  generateStatementPreviewEventId = null;

  scrollEventHandler = () => { this.scrollSubject.next(); };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromTotalRewardsStatementEditReducer.State>,
    private settingsService: SettingsService,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

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
    this.visibleFieldsCount$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getVisibleFieldsCount));
    this.activeRichTextEditorId$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getActiveRichTextEditorId));

    // SETTINGS
    this.isSettingsPanelOpen$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsPanelOpen));
    this.settingsSaving$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaving));
    this.settingsSavingSuccess$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveSuccess));
    this.settingsSavingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectIsSettingsSaveError));

    // PREVIEW
    this.assignedEmployeesAsync$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.selectAssignedEmployees));
    this.employeeRewardsDataAsync$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getEmployeeData));

    // SCROLL
    this.isPageScrolling$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getIsPageScrolling));

    // NOTIFICATIONS
    this.getNotification$ = this.appNotificationStore.pipe(select(fromAppNotificationsMainReducer.getNotifications));

    // GENERATE STATEMENT PREVIEW
    this.generateStatementPreviewEventId$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getGenerateStatementPreviewEventAsync));
    this.statementPreviewGenerating$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.getStatementPreviewGenerating));
    this.statementPreviewGeneratingError$ = this.store.pipe(select(fromTotalRewardsStatementEditReducer.statementPreviewGeneratingError));

    // SUBSCRIPTIONS
    this.allSubscriptions.add(this.route.params.subscribe(params => {
      this.statementId = params['id'];
      this.store.dispatch(new fromEditStatementPageActions.LoadStatement(this.statementId));
    }));

    this.allSubscriptions.add(this.statement$.subscribe(s => {
      if (s) {
        this.statement = cloneDeep(s);
      }
    }));

    this.allSubscriptions.add(this.mode$.subscribe(e => {
      this.mode = e;
      if (this.mode === models.StatementModeEnum.Preview) {
        this.store.dispatch(new fromEditStatementPageActions.ResetEmployeeRewardsData());
        this.store.dispatch(new fromEditStatementPageActions.SearchAssignedEmployees({ statementId: this.statementId, searchTerm: ''}));
      }
    }));

    this.allSubscriptions.add(this.isSettingsPanelOpen$.subscribe(isOpen => {
      this.isSettingsPanelOpen = isOpen;
      if (!isOpen) { return; }
      this.allowClosingSettingsByClickingElsewhere = false;
    }));

    this.allSubscriptions.add(this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      this.enableFileDownloadSecurityWarning = isEnabled;
    }));

    this.allSubscriptions.add(this.generateStatementPreviewEventId$.subscribe(eventId => {
      if (eventId?.obj !== this.generateStatementPreviewEventId) {
        this.generateStatementPreviewEventId = eventId.obj;
      }
    }));

    this.allSubscriptions.add(this.getNotification$.subscribe(notifications => {
      notifications.forEach(notification => {
        if (notification.Level === 'Success' && notification.NotificationId === this.generateStatementPreviewEventId) {
          this.store.dispatch(new fromEditStatementPageActions.GenerateStatementPreviewComplete());
        }
      });
    }));

    const isPreparingSettingsSave$ = this.store.pipe(
      select(fromTotalRewardsStatementEditReducer.getIsPreparingSettingsSave),
      filter(isPreparing => isPreparing),
      map(() => this.calculateRepeatableHeaderHeightInPixels()),
      map((headerHeight: number) => this.store.dispatch(new fromEditStatementPageActions.CalculateRepeatableHeaderContentHeightInPixels({ headerHeight })))
    );
    this.allSubscriptions.add(isPreparingSettingsSave$.subscribe());

    // MISC
    setTimeout(() => {
      this.mainScrollableNode = document.querySelector('.page-content');
      this.mainScrollableNode?.addEventListener('scroll', this.scrollEventHandler, true);
      this.allSubscriptions.add(this.scrollSubject.pipe(throttleTime(100)).subscribe(() => { this.handlePageScroll(); }));
    }, 0);
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
    this.mainScrollableNode?.removeEventListener('scroll', this.scrollEventHandler, true);
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
      this.store.dispatch(new fromEditStatementPageActions.UpdateActiveRichTextEditorId(null));
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

  handleOnCalculationControlCompFieldReordered(request: models.ReorderCalcControlFieldsRequest) {
    this.store.dispatch(new fromEditStatementPageActions.ReorderCalculationControlCompensationField(request));
  }

  // RICH TEXT
  handleOnRichTextControlContentChange(request: models.UpdateStringPropertyRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateRichTextControlContent(request));
  }

  handleOnRichTextControlUdfsInContentChange(request: models.UpdateUdfsInRteContentRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateRichTextControlUdfsInContent(request));
  }

  handleRTEFocusChange(event) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateActiveRichTextEditorId(event));
  }

  getRichTextIds() {
    const ids = [];
    const funcToCallWithControl = (control: models.BaseControl): void => {
      if (control.ControlType === models.TotalRewardsControlEnum.RichTextEditor) { ids.push(control.Id); }
    };
    TotalRewardsStatementService.applyFuncToEachControl(this.statement, funcToCallWithControl);
    return ids;
  }

  // CHART
  handleOnChartControlToggleSettingsPanelClick() {
    this.store.dispatch(new fromEditStatementPageActions.OpenSettingsPanel());
  }

  // SETTINGS
  handleToggleSettingsPanelClick() {
    this.store.dispatch(new fromEditStatementPageActions.OpenSettingsPanel());
  }

  handleCloseSettingsClick() {
    this.store.dispatch(new fromEditStatementPageActions.CloseSettingsPanel());
  }

  handleSettingsPanelClickElsewhere() {
    if (!this.isSettingsPanelOpen) { return; }

    // Cannot simply close: we would end up closing as soon it opened, since the click to open is outside the panel
    // But instead we can indicate closing is allowed the next time the user clicks outside
    if (!this.allowClosingSettingsByClickingElsewhere) {
      this.allowClosingSettingsByClickingElsewhere = true;
      return;
    }

    this.allowClosingSettingsByClickingElsewhere = false;
    this.handleCloseSettingsClick();
  }

  handleSettingsFontSizeChange(fontSize: FontSize) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsFontSize(fontSize));
  }

  handleSettingsFontFamilyChange(fontFamily: FontFamily) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsFontFamily(fontFamily));
  }

  handleSettingsColorChange(request: models.UpdateSettingsColorRequest) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateSettingsColor(request));
  }

  handleDisplaySettingChange(displaySettingKey: models.StatementDisplaySettingsEnum) {
    this.store.dispatch(new fromEditStatementPageActions.ToggleDisplaySetting({ displaySettingKey }));
    if (displaySettingKey === models.StatementDisplaySettingsEnum.ShowInformationEffectiveDate) {
      this.store.dispatch(new fromEditStatementPageActions.UpdateEffectiveDate({ effectiveDate: new Date() }));
    }
  }

  handleAdditionalPageSettingsChange(additionalPageSettings: models.StatementAdditionalPageSettings) {
    this.store.dispatch(new fromEditStatementPageActions.UpdateAdditionalPageSettings({ additionalPageSettings: additionalPageSettings }));
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

  handleSelectImage() {
    this.store.dispatch(new fromEditStatementPageActions.SelectImageControlImage());
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
    this.store.dispatch(new fromEditStatementPageActions.GetEmployeeRewardsData({ companyEmployeeId: employeeId, statementId: this.statementId }));
  }

  // GENERATE STATEMENT
  handleGenerateStatementClicked(): void {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.store.dispatch(new fromEditStatementPageActions.GenerateStatementPreview());
    }
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (!isConfirmed) { return; }

    this.store.dispatch(new fromEditStatementPageActions.GenerateStatementPreview());
  }

  handlePageScroll() {
    // user has scrolled, so cancel a potential delayed call to set isScrolling back to false, then set current (true) and future (false) actions
    clearTimeout(this.scrollTimer);
    this.store.dispatch(new fromEditStatementPageActions.PageScroll({ isScrolling: true }));
    this.scrollTimer = setTimeout(() => this.store.dispatch(new fromEditStatementPageActions.PageScroll({ isScrolling: false })), 1000);
  }

  calculateRepeatableHeaderHeightInPixels() {
    // get the first page classed as main, then all section elements classed as repeatable-header-content within
    const headerSections = document.querySelector('.statement .trs-page.main').querySelectorAll('section.repeatable-header-content');
    let totalContentHeightInPixels = 0;
    for (let i = 0; i < headerSections.length; i ++) {
      totalContentHeightInPixels += (headerSections[i] as any).offsetHeight;
    }
    return totalContentHeightInPixels;
  }

  // SCROLL/MOUSE
  @HostListener('document:mousedown', ['$event'])
  public onMouseDownEvent(event: MouseEvent) {
    // Get the F outta here if in print mode
    if (this.mode !== models.StatementModeEnum.Edit) { return; }

    const targetElement = event.target as HTMLElement;

    // bail out if we can't tell where the click originates from
    if (!targetElement) { return; }

    // bail out if the clicked dom node is classed whitelisted
    if (this.toolbarWhitelist && this.toolbarWhitelist.some(w => targetElement?.classList.toString().indexOf(w) >= 0)) {
      return;
    }

    this.lastClickEventElement = targetElement;
  }

  @HostListener('document:mouseup', ['$event'])
  public onMouseUpEvent(event: MouseEvent) {
    // Get the F outta here if in print mode
    if (this.mode !== models.StatementModeEnum.Edit) { return; }

    const targetElement = event.target as HTMLElement;

    if (this.toolbarWhitelist && this.toolbarWhitelist.some(w => targetElement?.classList.toString().indexOf(w) >= 0)) {
      return;
    }

    if (targetElement !== this.lastClickEventElement) {
      return;
    }

    this.lastClickEventElement = null;
    this.store.dispatch(new fromEditStatementPageActions.UpdateActiveRichTextEditorId(null));
  }
}
