import { Injectable, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';
import { DataCutValidationInfo, ExchangeStatCompanyMakeup } from 'libs/models/peer';
import { arraysEqual, checkArraysOneOff } from 'libs/core/functions';

import * as fromUpsertPeerDataReducers from '../reducers';
import * as fromDataCutValidationActions from '../actions/data-cut-validation.actions';
import { GuidelineLimits } from '../models';

@Injectable()
export class DojGuidelinesService implements OnDestroy {
  // Private Properties
  private readonly guidelineLimits: GuidelineLimits = { MinCompanies: 5, DominatingPercentage: .25, DominatingPercentageHard: .5 };
  private previousMapCompanies: number[] = [];
  private dataCutValid = true;
  private initialMapMoveComplete = false;

  // Public Properties
  public companyValidationPass = true;

  dataCutValidationInfo: DataCutValidationInfo[];
  companies: ExchangeStatCompanyMakeup[];

  // Observables
  peerMapCompanies$: Observable<ExchangeStatCompanyMakeup[]>;
  dataCutValidationInfo$: Observable<DataCutValidationInfo[]>;
  areEmployeesValid$: Observable<boolean>;
  initialMapMoveComplete$: Observable<boolean>;

  // Subscriptions
  employeeValidSubscription: Subscription;
  dataCutValidationSubscription: Subscription;
  peerMapCompaniesSubscription: Subscription;
  initialMapMoveCompleteSubscription: Subscription;

  constructor(private store: Store<fromUpsertPeerDataReducers.State>,
    private mapStore: Store<fromPeerMapReducers.State>) {
    this.peerMapCompanies$ = this.mapStore.pipe(select(fromPeerMapReducers.getPeerMapCompaniesFromSummary));
    this.dataCutValidationInfo$ = this.store.pipe(select(fromUpsertPeerDataReducers.getDataCutValidationInfo));
    this.areEmployeesValid$ = this.store.pipe(select(fromUpsertPeerDataReducers.getEmployeeCheckPassed));
    this.initialMapMoveComplete$ = this.mapStore.pipe(select(fromPeerMapReducers.getPeerMapInitialMapMoveComplete));

    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pmc => this.companies = pmc);
    this.dataCutValidationSubscription = this.dataCutValidationInfo$.subscribe(dcvi => this.dataCutValidationInfo = dcvi);
    this.employeeValidSubscription = this.areEmployeesValid$.subscribe(validEmployees => {
      this.dataCutValid = this.companyValidationPass && validEmployees;
    }
    );
    this.initialMapMoveCompleteSubscription = this.initialMapMoveComplete$.subscribe(mm => {
      this.initialMapMoveComplete = mm;
    });
  }

  get validDataCut(): boolean {
    return this.dataCutValid;
  }

  get numberOfCompanies(): number {
    return !!this.companies ? this.companies.length : 0;
  }

  get hasMinimumCompanies(): boolean {
    return this.hasCompaniesAndLimits &&
      this.companies.length >= this.guidelineLimits.MinCompanies;
  }

  get hasNoDominatingData(): boolean {
    return this.hasNoHardDominatingData &&
      !this.companies.some(c => c.Percentage > this.guidelineLimits.DominatingPercentage);
  }

  get hasNoHardDominatingData(): boolean {
    return this.hasCompaniesAndLimits &&
      !this.companies.some(c => c.Percentage >= this.guidelineLimits.DominatingPercentageHard);
  }

  get dominatingCompanies(): any[] {
    return this.hasCompaniesAndLimits &&
      this.companies.filter(c => c.Percentage > this.guidelineLimits.DominatingPercentage).map(c => {
        return {
          Company: c.Company,
          Percentage: +(c.Percentage * 100).toFixed(2)
        };
      }
      );
  }

  get hasCompaniesAndLimits(): boolean {
    return this.companies && !!this.guidelineLimits;
  }

  get passesGuidelines(): boolean {
    return this.dataCutValid && this.hasMinimumCompanies && this.hasNoHardDominatingData;
  }

  ngOnDestroy() {
    this.initialMapMoveCompleteSubscription.unsubscribe();
    this.peerMapCompaniesSubscription.unsubscribe();
  }

  validateDataCut(mapCompanies: any, companyJobId: number, userSessionId: number) {
    if (!this.initialMapMoveComplete) { return; }
    const validationInfo = this.dataCutValidationInfo;
    // reset
    this.store.dispatch(new fromDataCutValidationActions.ValidateDataCutEmployeesSuccess(true));
    this.companyValidationPass = true;
    this.dataCutValid = true;

    const currentMapCompanies: number[] = mapCompanies.map(item => item.CompanyId);
    if (validationInfo.length > 0) {
      // In an attempt to make this method faster, a previousSelections variable will be stored.
      // Current selections and previousSelections will be checked, if they are equal then we do not change the validation variable.
      if (!arraysEqual(currentMapCompanies, this.previousMapCompanies)) {
        this.previousMapCompanies = currentMapCompanies;
        // Check against each existing cut, if it fails we break out and set validation to false.
        for (const value of validationInfo) {
          if (checkArraysOneOff(currentMapCompanies, value.CompanyIds)) {
            this.companyValidationPass = false;
            break;
          }
        }
      }
    }

    // we've passed on company now lets check the employees
    if (this.companyValidationPass) {
      this.store.dispatch(new fromDataCutValidationActions.ValidateDataCutEmployees(
        companyJobId, userSessionId));
    }
  }
}
