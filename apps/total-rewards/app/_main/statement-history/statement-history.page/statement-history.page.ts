import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { select, Store } from '@ngrx/store';

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';
import { StatementHistoryListViewModel } from 'libs/features/total-rewards/total-rewards-statement/models/statement-history-list-view-model';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromPageReducer from '../reducers';
import * as fromPageActions from '../actions/statement-history.page.actions';

import { statementsGridFields } from '../models';

@Component({
  selector: 'pf-statement-history.page',
  templateUrl: './statement-history.page.html',
  styleUrls: ['./statement-history.page.scss']
})
export class StatementHistoryPageComponent implements OnInit, OnDestroy {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) public fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  routeParamSubscription = new Subscription();

  totalRewardsHistoryFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsHistory, value: false };
  selectedDropdown: NgbDropdown;
  gridFields = statementsGridFields;

  @ViewChild(TooltipDirective, { static: true })
  public tooltipDir: TooltipDirective;

  statement$: Observable<Statement>;
  statementLoadingError$: Observable<boolean>;
  statementHistoryLoading$: Observable<boolean>;
  statementHistoryLoadingError$: Observable<boolean>;
  statementHistoryGridData$: Observable<GridDataResult>;
  statementHistoryGridState$: Observable<State>;

  downloadingHistoricalPdf$: Observable<boolean>;
  pdfIdToExport$: Observable<string>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;
  unsubscribe$ = new Subject<void>();

  enableFileDownloadSecurityWarningSubscription: Subscription;

  enableFileDownloadSecurityWarning: boolean;

  constructor(
    private store: Store<fromPageReducer.State>,
    private route: ActivatedRoute, private router: Router,
    private featureFlagService: AbstractFeatureFlagService,
    private settingsService: SettingsService
  ) {
    this.featureFlagService.bindEnabled(this.totalRewardsHistoryFeatureFlag, this.unsubscribe$);
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit(): void {
    if (!this.totalRewardsHistoryFeatureFlag.value) {
      this.router.navigate(['not-found']);
      return;
    }

    this.statement$ = this.store.pipe(select(fromPageReducer.getStatement));
    this.statementLoadingError$ = this.store.pipe(select(fromPageReducer.getStatementLoadingError));

    this.routeParamSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(new fromPageActions.LoadStatement({ statementId: params['id'] }));
    });

    this.store.dispatch(new fromPageActions.LoadStatementHistory());

    this.statementHistoryLoading$ = this.store.pipe(select(fromPageReducer.getStatementHistoryLoading));
    this.statementHistoryLoadingError$ = this.store.pipe(select(fromPageReducer.getStatementHistoryLoadingError));
    this.statementHistoryGridState$ = this.store.pipe(select(fromPageReducer.getStatementHistoryGridState));
    this.statementHistoryGridData$ = this.store.pipe(select(fromPageReducer.getStatementHistoryGridData));

    this.downloadingHistoricalPdf$ = this.store.pipe(select(fromPageReducer.getDownloadingHistoricalPdf));
    this.pdfIdToExport$ = this.store.pipe(select(fromPageReducer.getPdfIdToExport));

    this.enableFileDownloadSecurityWarningSubscription = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      this.enableFileDownloadSecurityWarning = isEnabled;
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy() {
    this.routeParamSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSubscription.unsubscribe();
    this.unsubscribe$.next();
  }

  showGridTooltip(e: any): void {
    if ((e.target.offsetWidth < e.target.scrollWidth) && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromPageActions.UpdateGridState(state));
    this.store.dispatch(new fromPageActions.LoadStatementHistory());
  }

  handleSelectedRowAction(dropdown: NgbDropdown): void {
    this.selectedDropdown = dropdown;
  }

  onScroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  getDownloadTitle(statement: StatementHistoryListViewModel): string {
    return statement.HasAccess ? 'Download' : 'You don’t have access to all employees included in this statement';
  }

  onDownloadClick(statement: StatementHistoryListViewModel): void {
    if (!statement.HasAccess) { return; }

    this.store.dispatch( new fromPageActions.UpdatePdfIdToExport({ pdfId: statement.Id }) );
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.store.dispatch( new fromPageActions.DownloadHistoricalStatement() );
    }
  }

  handleSecurityWarningConfirmed(isConfirmed): void {
    if (isConfirmed) {
      this.store.dispatch( new fromPageActions.DownloadHistoricalStatement() );
    }
  }

  handleSecurityWarningCancelled(): void {
    this.store.dispatch( new fromPageActions.UpdatePdfIdToExport({ pdfId: null }) );
  }
}
