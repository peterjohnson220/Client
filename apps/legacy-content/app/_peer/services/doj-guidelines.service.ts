import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';
import { DataCutValidationInfo, ExchangeStatCompanyMakeup } from 'libs/models/peer';
import { arraysEqual, checkArraysOneOff } from 'libs/core/functions';

import * as fromUpsertPeerDataReducers from '../reducers';
import { GuidelineLimits } from '../models';

@Injectable()
export class DojGuidelinesService {
  // Private Properties
  private readonly guidelineLimits: GuidelineLimits = { MinCompanies: 5, DominatingPercentage: .25 };
  private previousSelections: number[] = [];
  private dataCutValid = true;

  dataCutValidationInfo: DataCutValidationInfo[];
  companies: ExchangeStatCompanyMakeup[];

  // Observables
  peerMapCompanies$: Observable<ExchangeStatCompanyMakeup[]>;
  dataCutValidationInfo$: Observable<DataCutValidationInfo[]>;

  // Subscriptions
  dataCutValidationSubscription: Subscription;
  peerMapCompaniesSubscription: Subscription;

  constructor(private store: Store<fromUpsertPeerDataReducers.State>, private mapStore: Store<fromPeerMapReducers.State>) {
    this.peerMapCompanies$ = this.mapStore.select(fromPeerMapReducers.getPeerMapCompaniesFromSummary);
    this.dataCutValidationInfo$ = this.store.select(fromUpsertPeerDataReducers.getDataCutValidationInfo);

    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pmc => this.companies = pmc);
    this.dataCutValidationSubscription = this.dataCutValidationInfo$.subscribe(dcvi => this.dataCutValidationInfo = dcvi);
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
    return this.hasCompaniesAndLimits &&
      !this.companies.some(c => c.Percentage > this.guidelineLimits.DominatingPercentage);
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
    return this.dataCutValid && this.hasMinimumCompanies && this.hasNoDominatingData;
  }

  validateDataCut(selections: any, shouldCheckSimilarity: boolean) {
    if (!shouldCheckSimilarity) {
      this.dataCutValid = true;
      return;
    }

    const validationInfo = this.dataCutValidationInfo;
    let validationPass = true;

    // If there are no company filters selected then we don't care and the validation passes.
    if (selections.CompanyIds) {
      const selectedCompanies: number[] = selections.CompanyIds;
      // If there are less than 5 company's selected or if the validationInfo array does not have any values the validation passes.
      if (selectedCompanies.length > 4 && validationInfo.length > 0) {
        // In an attempt to make this method faster, a previousSelections variable will be stored.
        // Current selections and previousSelections will be checked, if they are equal then we do not change the validation variable.
        if (!arraysEqual(selectedCompanies, this.previousSelections)) {
          this.previousSelections = selectedCompanies;
          // Check against each existing cut, if it fails we break out and set validation to false.
          for (const value of validationInfo) {
            if (checkArraysOneOff(selectedCompanies, value.CompanyIds)) {
              validationPass = false;
              break;
            }
          }
        } else {
          return;
        }
      }
    }

    this.dataCutValid = validationPass;
  }
}
