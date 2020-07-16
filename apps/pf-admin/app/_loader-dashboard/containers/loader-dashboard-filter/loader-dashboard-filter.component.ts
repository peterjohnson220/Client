import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {Subject} from 'rxjs';
import {skip, takeUntil} from 'rxjs/operators';

import { isObject } from 'lodash';

import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';

import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import {GridSearchPayload} from '../../models';

@Component({
  selector: 'pf-loader-dashboard-filter',
  templateUrl: './loader-dashboard-filter.component.html',
  styleUrls: ['./loader-dashboard-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardFilterComponent implements OnInit, OnDestroy {
  static DEFAULT_START_DAYS = 14;
  private unsubscribe$ = new Subject<boolean>();
  private excludeTestCompanies = false;
  testCompaniesToggleText = 'Hide Test Companies';

  range = { start: this.getDefaultStartDate(), end: this.getDefaultEndDate() };

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>) { }

  ngOnInit() {
    this.store.select(fromCompanyReducer.getSelectedCompany).pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe(v => {
      this.updateSelectedCompany(isObject(v) ? v.CompanyId : null);
    });
    this.store.dispatch(new fromLoaderDashboardPageActions.Init(this.generateDefaultSearchPayload()));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - LoaderDashboardFilterComponent.DEFAULT_START_DAYS);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getDefaultEndDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  generateDefaultSearchPayload(): GridSearchPayload {
    return {
      StartDate: this.getDefaultStartDate().getTime(),
      EndDate: this.getDefaultEndDate().getTime(),
      ExcludeTestCompanies: false
    };
  }

  updateSelectedCompany(v?: number) {
    this.store.dispatch(new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: 'Company_ID',
      value: v
    }]));
  }

  toggleTestCompanies() {
    this.excludeTestCompanies = !this.excludeTestCompanies;
    this.testCompaniesToggleText = this.excludeTestCompanies ? 'Show Test Companies' : 'Hide Test Companies';
    this.store.dispatch(new fromLoaderDashboardPageActions.ToggleShowHideTestCompanies());
  }

  changeDate($event: Date, type: string) {
    if (type !== 'Start' && type !== 'End') {
      return;
    }
    this.store.dispatch(new fromLoaderDashboardPageActions.UpdateGridSearchPayload([{
      key: `${type}Date`,
      value: $event.getTime()
    }]));
  }

  refresh() {
    this.store.dispatch(new fromLoaderDashboardPageActions.UpdateGridSearchPayload([]));
  }
}

