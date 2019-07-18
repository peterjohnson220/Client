import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { WindowRef } from 'libs/core/services';

import * as fromReportsViewActions from '../../../actions/reports-view-page.actions';
import * as fromDataInsightsMainReducer from '../../../reducers';
import { ReportViewTypes } from '../../../models';

@Component({
  selector: 'pf-report-view-page',
  templateUrl: './report-view.page.html',
  styleUrls: ['./report-view.page.scss']
})
export class ReportViewPageComponent implements OnInit, OnDestroy {
  // Observables
  workbookViewUrl$:  Observable<AsyncStateObj<string>>;

  // Subscriptions
  viewUrlSub: Subscription;

  reportTitle: string;
  showTabs: boolean;
  viz: any;
  vizLoading: boolean;
  currentHistoryState: any;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private location: Location,
    private route: ActivatedRoute,
    public winRef: WindowRef
  ) {
    this.reportTitle = this.route.snapshot.queryParamMap.get('title');
    this.showTabs = this.route.snapshot.queryParamMap.get('showTabs') === 'true';
    this.workbookViewUrl$ = this.store.pipe(select(fromDataInsightsMainReducer.getWorkbookViewUrl));
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
    this.vizLoading = true;
    this.currentHistoryState = history.state;
    const containerDiv = document.getElementById('vizContainer');
    const that = this;
    const options = {
      hideTabs: !this.showTabs,
      onFirstInteractive: function () {
        that.vizLoading = false;
        /* IE11 bug: the browser history state not matched with current state
           when workbook is loaded */
        if (history.state !== that.currentHistoryState) {
          history.replaceState(that.currentHistoryState, null);
        }
      }
    };
    if (this.viz) {
      this.viz.dispose();
    }
    const tableau = this.winRef.nativeWindow.tableau || {};
    this.viz = new tableau.Viz(containerDiv, url, options);
    this.viz.addEventListener('tabSwitch', function () {
      that.updateRoute();
    });
  }

  loadWorkbookViewUrl(): void {
    const routedViewType: ReportViewTypes = this.route.snapshot.data.viewType;
    switch (routedViewType) {
      case ReportViewTypes.StandardWorkbook:
        this.store.dispatch(new fromReportsViewActions.GetStandardReportViewUrl({ workbookId: this.route.snapshot.params.workbookId }));
        break;
      case ReportViewTypes.StandardWorkbookSheet:
        this.store.dispatch(new fromReportsViewActions.GetStandardReportSheetViewUrl({
          viewName: this.route.snapshot.params.viewName,
          workbookName: this.route.snapshot.params.workbookName
        }));
        break;
      case ReportViewTypes.CompanyWorkbookSheet:
        this.store.dispatch(new fromReportsViewActions.GetCompanyReportSheetViewUrl({
          viewName: this.route.snapshot.params.viewName,
          workbookName: this.route.snapshot.params.workbookName
        }));
        break;
      case ReportViewTypes.CompanyWorkbook:
        this.store.dispatch(new fromReportsViewActions.GetCompanyReportViewUrl({ workbookId: this.route.snapshot.params.workbookId }));
        break;
      default:
        this.store.dispatch(new fromReportsViewActions.GetViewUrlError());
        break;
    }
  }

  private updateRoute() {
    const viewUrl = this.getViewUrl();
    const baseUrl = this.getReportBaseUrl();
    this.location.go(baseUrl + viewUrl, 'title=' + this.reportTitle + '&showTabs=' + this.showTabs);
  }

  private getReportBaseUrl(): string {
    const routedViewType: ReportViewTypes = this.route.snapshot.data.viewType;
    switch (routedViewType) {
      case ReportViewTypes.StandardWorkbook:
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
      const viewUrl = url.substring(url.indexOf('/views/') + 7);
      return viewUrl;
    } catch (e) {
      return null;
    }
  }
}
