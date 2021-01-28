import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { WindowRef } from 'libs/core/services';

import * as fromReportViewActions from '../../actions/report-view.actions';
import * as fromReportsReducer from '../../reducers';
import { ReportViewTypes, StandardReportFilter, StandardReportSheetName, StandardReportTitle } from '../../models';


@Component({
  selector: 'pf-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromReportsReducer.State>,
    private location: Location,
    public winRef: WindowRef
  ) {
    this.workbookViewUrl$ = this.store.pipe(select(fromReportsReducer.getWorkbookViewUrl));
  }

  get shouldFitToContainer(): boolean {
    return !!this.fitToContainerId?.length;
  }
  // Observables
  workbookViewUrl$:  Observable<AsyncStateObj<string>>;

  // Subscriptions
  viewUrlSub: Subscription;

  @Input() reportTitle: string;
  @Input() workbookId: string;
  @Input() viewName: string;
  @Input() workbookName: string;
  @Input() viewType: ReportViewTypes;
  @Input() showTabs = true;
  @Input() tabSwitchUpdatesRoute = true;
  @Input() fitToContainerId: string;

  viz: any;
  vizLoading: boolean;
  currentHistoryState: any;
  standardReportFilter: StandardReportFilter;
  standardReportFilterApplied: boolean;

  private static getReportViewContentUrl(url: string): string {
    const urlSplits = url.split('?');
    return urlSplits[0];
  }

  private static getStandardReportFilter(url: string): StandardReportFilter {
    const urlSplits = url.split('?');
    if (urlSplits.length !== 2) {
      return null;
    }
    const filterSplits = urlSplits[1].split('=');
    if (filterSplits.length !== 2) {
      return null;
    }
    return {
      FieldName: decodeURI(filterSplits[0]),
      FilterValue: filterSplits[1]
    };
  }

  ngOnInit(): void {
    this.loadWorkbookViewUrl();

    this.viewUrlSub = this.workbookViewUrl$.subscribe(url => {
      this.initViz(url.obj);
    });
  }

  ngOnDestroy(): void {
    this.viewUrlSub.unsubscribe();
  }

  initViz(url: string) {
    if (!url) {
      return;
    }
    this.standardReportFilter = ReportViewComponent.getStandardReportFilter(url);
    const contentUrl = ReportViewComponent.getReportViewContentUrl(url);
    this.vizLoading = true;
    this.currentHistoryState = history.state;
    const containerDiv = document.getElementById('vizContainer');
    const that = this;

    const options: any = {
      hideTabs: !this.showTabs,
      toolbarPosition: 'top',
      onFirstInteractive: function () {
        that.vizLoading = false;
        /* IE11 bug: the browser history state not matched with current state
           when workbook is loaded */
        if (history.state !== that.currentHistoryState) {
          history.replaceState(that.currentHistoryState, null);
        }
        that.applyDefaultStandardReportFilter();
      }
    };

    if (this.shouldFitToContainer) {
      const modalSize = document.getElementById(this.fitToContainerId);
      options.height = `${modalSize.offsetHeight}px`;
      options.width = `${modalSize.offsetWidth}px`;
    }

    if (this.viz) {
      this.viz.dispose();
    }
    const tableau = this.winRef.nativeWindow.tableau || {};
    this.viz = new tableau.Viz(containerDiv, contentUrl, options);
    this.viz.addEventListener('tabSwitch', function () {
      that.updateRoute();
      that.applyDefaultStandardReportFilter();
    });
  }

  loadWorkbookViewUrl(): void {
    const routedViewType: ReportViewTypes = this.viewType;
    switch (routedViewType) {
      case ReportViewTypes.PeerStandardWorkbook: {
        this.store.dispatch(new fromReportViewActions.GetPeerStandardReportViewUrl({workbookId: this.workbookId}));
        break;
      }
      case ReportViewTypes.StandardWorkbook:
        this.store.dispatch(new fromReportViewActions.GetStandardReportViewUrl({ workbookId: this.workbookId }));
        break;
      case ReportViewTypes.StandardWorkbookSheet:
        this.store.dispatch(new fromReportViewActions.GetStandardReportSheetViewUrl({
          viewName: this.viewName,
          workbookName: this.workbookName
        }));
        break;
      case ReportViewTypes.CompanyWorkbookSheet:
        this.store.dispatch(new fromReportViewActions.GetCompanyReportSheetViewUrl({
          viewName: this.viewName,
          workbookName: this.workbookName
        }));
        break;
      case ReportViewTypes.CompanyWorkbook:
        this.store.dispatch(new fromReportViewActions.GetCompanyReportViewUrl({ workbookId: this.workbookId }));
        break;
      default:
        this.store.dispatch(new fromReportViewActions.GetViewUrlError());
        break;
    }
  }

  private updateRoute() {
    if (!this.tabSwitchUpdatesRoute) {
      return;
    }

    const viewUrl = this.getViewUrl();
    const baseUrl = this.getReportBaseUrl();
    this.location.go(baseUrl + viewUrl, 'title=' + this.reportTitle + '&showTabs=' + this.showTabs);
  }

  private getReportBaseUrl(): string {
    const routedViewType: ReportViewTypes = this.viewType;
    switch (routedViewType) {
      case ReportViewTypes.StandardWorkbook:
      case ReportViewTypes.PeerStandardWorkbook:
      case ReportViewTypes.StandardWorkbookSheet:
        return '/standard-reports/';
      case ReportViewTypes.CompanyWorkbookSheet:
      case ReportViewTypes.CompanyWorkbook:
        return '/company-reports/';
      default:
        return null;
    }
  }

  private getViewUrl(): string {
    try {
      const url = this.viz.getWorkbook().getActiveSheet().getUrl();
      return url.substring(url.indexOf('/views/') + 7);
    } catch (e) {
      return null;
    }
  }

  private applyDefaultStandardReportFilter(): void {
    if (!this.standardReportFilter) {
      return;
    }
    switch (this.reportTitle) {
      case StandardReportTitle.SalaryStructures:
        this.applyFilterBySheetName(StandardReportSheetName.SalaryStructures);
        break;
      case StandardReportTitle.PublishedCompositesWithEmployees:
        this.applyFilterBySheetName(StandardReportSheetName.EmployeesAndMarketData);
        break;
      default:
        break;
    }
  }

  private applyFilterBySheetName(sheetNameToFilter: string): void {
    if (!this.standardReportFilterApplied) {
      try {
        const tableau = this.winRef.nativeWindow.tableau || {};
        const sheet = this.viz.getWorkbook().getActiveSheet();
        const sheetName = sheet.getName().trim();
        if (sheetName === sheetNameToFilter) {
          const worksheet = sheet.getWorksheets()[0];
          worksheet.applyFilterAsync(this.standardReportFilter.FieldName, this.standardReportFilter.FilterValue, tableau.FilterUpdateType.REPLACE);
          this.standardReportFilterApplied = true;
        }
      } catch (e) {
        return;
      }
    }
  }
}
