import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ViewField } from 'libs/models/payfactors-api';
import { Permissions } from 'libs/constants';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobsPageActions from '../actions';
import * as fromJobsPageReducer from '../reducers';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  permissions = Permissions;
  pageViewId = '705B7FE1-42AB-4B57-A414-764E52981160';
  selectedKeys: number[];
  selectedKeysSubscription: Subscription;
  company$: Observable<string>;
  addingToProject$: Observable<boolean>;
  @ViewChild('jobStatusColumn', { static: false }) jobStatusColumn: ElementRef;
  colTemplates = {};
  globalFilterSubscription: Subscription;
  titleCodeSearchField: ViewField;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Job_Title'
  }];

  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.company$ = this.store.select(fromJobsPageReducer.getCompany);
    this.addingToProject$ = this.store.select(fromJobsPageReducer.getToProjectButtonState);
    this.selectedKeysSubscription = this.store.select(fromPfGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedKeys =  sk;
    });
    this.globalFilterSubscription = this.store.select(fromPfGridReducer.getGlobalFilters, this.pageViewId).subscribe(gf => {
      if (gf) {
        this.titleCodeSearchField = gf.find(f => f.SourceName === 'JobTitleCode');
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromJobsPageActions.LoadCompany());
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'JobStatus': this.jobStatusColumn
    };
  }

  addJobsToProject() {
    return this.store.dispatch(new fromJobsPageActions.AddJobsToProject(this.selectedKeys));
  }

  getPageTitle(companyName: string) {
    return companyName ? `${companyName} Jobs` : '';
  }

  ngOnDestroy() {
    this.selectedKeysSubscription.unsubscribe();
    this.globalFilterSubscription.unsubscribe();
  }

  handleTitleCodeSearch(value: string) {
    this.closeSplitView();
    if (value.length) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, this.buildTitleCodeFilter(value)));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, this.buildTitleCodeFilter('')));
    }
  }

  closeSplitView() {
    this.store.dispatch(new fromPfGridActions.UpdateSelectedRowId(this.pageViewId, null, null));
  }

  buildTitleCodeFilter(value: string): ViewField {
    return {
      ...this.titleCodeSearchField,
      FilterOperator: 'contains',
      FilterValue: value
    };
  }
}
