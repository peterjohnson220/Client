import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { WindowRef } from 'libs/core/services';

import * as fromReportsViewActions from '../../../actions/reports-view-page.actions';
import * as fromDataInsightsMainReducer from '../../../reducers';

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

  workbookId: string;
  workbookTitle: string;
  showTabs: boolean;
  viz: any;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private route: ActivatedRoute,
    public winRef: WindowRef
  ) {
    this.workbookId = this.route.snapshot.params.workbookId;
    this.workbookTitle = this.route.snapshot.queryParamMap.get('title');
    this.showTabs = this.route.snapshot.queryParamMap.get('showTabs') === 'true';
    this.workbookViewUrl$ = this.store.pipe(select(fromDataInsightsMainReducer.getWorkbookViewUrl));
  }

  ngOnInit(): void {
    this.store.dispatch(new fromReportsViewActions.GetStandardReportViewUrl(this.workbookId));

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
    const containerDiv = document.getElementById('vizContainer');
    const options = {
      hideTabs: !this.showTabs
    };
    if (this.viz) {
      this.viz.dispose();
    }
    const tableau = this.winRef.nativeWindow.tableau || {};
    this.viz = new tableau.Viz(containerDiv, url, options);
  }
}
