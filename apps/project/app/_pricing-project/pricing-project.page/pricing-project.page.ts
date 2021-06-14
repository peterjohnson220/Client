import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {SortDescriptor} from '@progress/kendo-data-query';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common/file-download-security-warning';
import * as fromCompanySettingsReducer from 'libs/state/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { DataGridState } from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';
import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import {PageViewIds} from '../../shared/constants';
import * as fromPricingProjectReducer from '../reducers';

@Component({
  selector: 'pf-pricing-project',
  templateUrl: './pricing-project.page.html',
  styleUrls: ['./pricing-project.page.scss']
})
export class PricingProjectPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('jobTitle') jobTitle: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @ViewChild('compColumn', { static: false }) compColumn: ElementRef;
  @ViewChild('percentageColumn', { static: false }) percentageColumn: ElementRef;
  @ViewChild('companyColumn', { static: false }) companyColumn: ElementRef;
  selectedProjectJobIds: number[] = [];
  selectedProjectJobsSubscription: Subscription;
  viewingJobSummary: boolean;
  project$: Observable<any>;
  projectId: number;
  pageViewId = PageViewIds.ProjectJobs;
  filter = [];
  colTemplates = {};
  gridConfig: GridConfig;
  actionBarConfig: ActionBarConfig;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Job_Title'
  }, {
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Paymarket'
  }];

  companySettingsSubscription: Subscription;

  exportModalIsOpen = false;
  displaySecurityWarning = false;

  projectJobGrid$: Observable<DataGridState>;
  userContext$: Observable<UserContext>;

  groupedColumnHeaderTemplates = {};

  companyFieldGroups = [
    'Company Allow',
    'Company Base',
    'Company Bonus',
    'Company Bonus Pct',
    'Company Bonus Target',
    'Company Bonus Target Pct',
    'Company Fixed',
    'Company LTIP',
    'Company Remun',
    'Company Target LTIP',
    'Company Target TDC',
    'Company TCC',
    'Company TCC Target',
    'Company TDC',
    'Company TGP',
  ];

  constructor(private route: ActivatedRoute,
              private store: Store<fromPricingProjectReducer.State>) {
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true
    };

    this.projectJobGrid$ = this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.ProjectJobs));
  }

  ngOnInit(): void {
    this.initRouterParams();
    this.project$ = this.store.select(fromPricingProjectReducer.getPricingProject);
    this.filter = [{
      SourceName: 'UserSession_ID',
      Operator: '=',
      Values: [this.projectId]
    }];

    this.companySettingsSubscription = this.store.select(fromCompanySettingsReducer.getCompanySettings).subscribe(cs => {
      if (cs !== null && cs !== undefined) {
        this.displaySecurityWarning = cs.find(x => x.Key === 'FileDownloadSecurityWarning').Value === 'true';
      }
    });

    this.userContext$ = this.store.select(fromRootState.getUserContext);

    this.selectedProjectJobsSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId).subscribe(data => {
      if (data) {
        this.selectedProjectJobIds = data;
      }
    });
  }

  ngOnDestroy() {
    this.companySettingsSubscription.unsubscribe();
    this.selectedProjectJobsSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitle },
      'comp': { Template: this.compColumn },
      'percentage': { Template: this.percentageColumn }
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };

    this.companyFieldGroups.forEach(group => {
      this.groupedColumnHeaderTemplates[group] = { Template: this.companyColumn };
    });
  }

  openExportModal(buttonElement): void {
    buttonElement.blur();

    if (this.displaySecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportModalIsOpen = true;
    }
  }

  closeExportModal(): void {
    this.exportModalIsOpen = false;
  }

  private initRouterParams(): void {
    this.projectId = this.route.snapshot.params.projectId;
  }

  jobSummaryClickHandler(): void {
    this.viewingJobSummary = !this.viewingJobSummary;
  }
}
