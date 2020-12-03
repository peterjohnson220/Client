import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsSurveySearchReducers from 'libs/features/survey-search/reducers';
import { DataCutValidationInfo, ExchangeStatCompanyMakeup, TEMP_PEER_DATA_CUT_PREFIX } from 'libs/models/peer';
import { UpsertPeerDataCutEntityConfigurationModel } from 'libs/features/upsert-peer-data-cut/models';
import { arraysEqual, checkArraysOneOff } from 'libs/core/functions';
import { WeightType } from 'libs/data/data-sets';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';

import * as fromUpsertPeerDataReducers from '../reducers';
import * as fromDataCutValidationActions from '../../actions/data-cut-validation.actions';
import { GuidelineLimits } from '../../models';

@Injectable()
export class DojGuidelinesService implements OnDestroy {
  // Private Properties
  private readonly guidelineLimits: GuidelineLimits = { MinCompanies: 5, DominatingPercentage: .25, DominatingPercentageHard: .5 };
  private previousMapCompanies: number[] = [];
  private guid: string;

  // Public Properties
  public companyValidationPass = true;
  public employeeValidationPass = true;

  isOrgWeighted = false;
  dataCutValidationInfo: DataCutValidationInfo[];
  companies: ExchangeStatCompanyMakeup[];
  tempExchangeJobDataCutFilterContextDictionary: {[key: string]: BaseExchangeDataSearchRequest};

  // Observables
  peerMapCompanies$: Observable<ExchangeStatCompanyMakeup[]>;
  dataCutValidationInfo$: Observable<DataCutValidationInfo[]>;
  areEmployeesValid$: Observable<boolean>;
  weightingType$: Observable<string>;
  tempExchangeJobDataCutFilterContextDictionary$: Observable<{[key: string]: BaseExchangeDataSearchRequest}>;

  // Subscriptions
  employeeValidSubscription: Subscription;
  dataCutValidationSubscription: Subscription;
  peerMapCompaniesSubscription: Subscription;
  weightingTypeSubscription: Subscription;
  tempExchangeJobDataCutFilterContextDictionarySubscription: Subscription;

  constructor(
    private store: Store<fromUpsertPeerDataReducers.State>,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    private route: ActivatedRoute
  ) {
    this.peerMapCompanies$ = this.exchangeExplorerStore.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapCompaniesFromSummary));
    this.dataCutValidationInfo$ = this.store.pipe(select(fromUpsertPeerDataReducers.getDataCutValidationInfo));
    this.areEmployeesValid$ = this.store.pipe(select(fromUpsertPeerDataReducers.getEmployeeCheckPassed));
    this.weightingType$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getWeightingType));
    this.tempExchangeJobDataCutFilterContextDictionary$ = this.store.select(fromLibsSurveySearchReducers.getTempExchangeJobDataCutFilterContextDictionary);


    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pmc => this.companies = pmc);
    this.dataCutValidationSubscription = this.dataCutValidationInfo$.subscribe(dcvi => this.dataCutValidationInfo = dcvi);
    this.employeeValidSubscription = this.areEmployeesValid$.subscribe(validEmployees => {
      this.employeeValidationPass = validEmployees;
    }
    );
    this.weightingTypeSubscription = this.weightingType$.subscribe(wt => {
      this.isOrgWeighted = wt === WeightType.Org;
    });
    this.tempExchangeJobDataCutFilterContextDictionarySubscription = this.tempExchangeJobDataCutFilterContextDictionary$.subscribe(dict => {
      this.tempExchangeJobDataCutFilterContextDictionary = dict;
    });
  }

  get validDataCut(): boolean {
    return this.employeeValidationPass && this.companyValidationPass;
  }

  get numberOfCompanies(): number {
    return !!this.companies ? this.companies.length : 0;
  }

  get hasMinimumCompanies(): boolean {
    return this.hasCompaniesAndLimits &&
      this.companies.length >= this.guidelineLimits.MinCompanies;
  }

  get hasNoDominatingData(): boolean {
    if (this.isOrgWeighted) {
      return true;
    }

    return this.hasNoHardDominatingData &&
      !this.companies.some(c => c.Percentage > this.guidelineLimits.DominatingPercentage);
  }

  get hasNoHardDominatingData(): boolean {
    if (this.isOrgWeighted) {
      return true;
    }

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
    return this.validDataCut && this.hasMinimumCompanies && this.hasNoHardDominatingData;
  }

  ngOnDestroy() {
    this.peerMapCompaniesSubscription.unsubscribe();
    this.dataCutValidationSubscription.unsubscribe();
    this.employeeValidSubscription.unsubscribe();
    this.weightingTypeSubscription.unsubscribe();
    this.tempExchangeJobDataCutFilterContextDictionarySubscription.unsubscribe();
  }

  clearMapCompanies() {
    this.previousMapCompanies = [];
  }

  validateCompanySimilarity(mapCompanies: any, cutGuid: string = null) {
    if (!this.hasMinimumCompanies || !this.hasNoHardDominatingData) { return; }

    const validationInfo = this.dataCutValidationInfo;
    this.guid = cutGuid || this.route.snapshot.queryParamMap.get('dataCutGuid');
    const currentMapCompanies: number[] = mapCompanies.map(item => item.CompanyId);
    if (validationInfo.length > 0) {

      // In an attempt to make this method faster, a previousSelections variable will be stored.
      // Current selections and previousSelections will be checked, if they are equal then we do not change the validation variable.
      if (!arraysEqual(currentMapCompanies, this.previousMapCompanies)) {
        this.previousMapCompanies = currentMapCompanies;
        // Check against each existing cut, if it fails we break out and set validation to false.
        let validationPass = true;

        // if we have a guid, there is only one, and the guids are the same we are editing so
        // we don't need to perform validation
        if (this.guid && validationInfo.length === 1 && validationInfo[0].DataCutGuid === this.guid) {
          return;
        }

        for (const value of validationInfo) {
          // if the the guid is the same then we are editing a cut
          // so we shouldn't check against ourselves
          if (this.guid && this.guid === value.DataCutGuid) { continue; }
          if (checkArraysOneOff(currentMapCompanies, value.CompanyIds)) {
            validationPass = false;
            break;
          }
        }
        this.companyValidationPass = validationPass;
      }
    }
  }

  validateTempDataCut(mapCompanies: any) {
    this.validateCompanySimilarity(mapCompanies);

    if (this.companyValidationPass) {
      const tempExchangeJobDataCutFilterContexts: BaseExchangeDataSearchRequest[] = [];
      const existingDataCutGuids: string [] = [];
      this.dataCutValidationInfo.forEach(dcv => {
        if (!dcv.DataCutGuid) {
          return;
        }

        if (dcv.DataCutGuid.startsWith(TEMP_PEER_DATA_CUT_PREFIX)) {
          const tempDataCutGuid = dcv.DataCutGuid.replace(TEMP_PEER_DATA_CUT_PREFIX, '');
          tempExchangeJobDataCutFilterContexts.push(this.tempExchangeJobDataCutFilterContextDictionary[tempDataCutGuid]);
        } else {
          existingDataCutGuids.push(dcv.DataCutGuid);
        }
      });

      this.store.dispatch(new fromDataCutValidationActions.ValidateDataCutEmployees({existingDataCutGuids, tempExchangeJobDataCutFilterContexts}));
    }
  }

  validateDataCut(mapCompanies: any, companyJobId: number, entityConfiguration: UpsertPeerDataCutEntityConfigurationModel, cutGuid: string = null) {
    this.validateCompanySimilarity(mapCompanies, cutGuid);

    // we've passed on company now lets check the employees
    if (this.companyValidationPass && entityConfiguration) {
      const action = new fromDataCutValidationActions.ValidateDataCutEmployees({companyJobId, entityConfiguration, dataCutGuid: this.guid});
      this.store.dispatch(action);
    }
  }
}
