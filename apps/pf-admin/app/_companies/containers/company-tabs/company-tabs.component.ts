import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from 'environments/environment';

import { UserContext } from 'libs/models/security';
import { CompanyTilesResponse, CompanyDataSetsReponse, ListCompositeFields } from 'libs/models/payfactors-api';
import { CompanySetting, CompanySettingsEnum } from 'libs/models/company';
import { CompanyClientTypeConstants, SystemUserGroupNames, TileNames } from 'libs/constants';

import * as fromPfAdminMainReducer from '../../reducers';
import * as fromCompanyPageActions from '../../actions/company-page.actions';
import { SecondarySurveyFieldsModalComponent } from '../../components';
import { CustomCompanySettings, CompanyTabsContext } from '../../models';
import * as fromRootState from 'libs/state/state';


@Component({
  selector: 'pf-company-tabs',
  templateUrl: './company-tabs.component.html',
  styleUrls: [ './company-tabs.component.scss' ]
})
export class CompanyTabsComponent implements OnInit, OnDestroy {
  @Input() customCompanySettings: CustomCompanySettings;
  @Input() companyId: number;
  @Input() clientType: string;
  @Input() groupName: string;

  @ViewChild(SecondarySurveyFieldsModalComponent, { static: true })
  secondarySurveyFieldsModalComponent: SecondarySurveyFieldsModalComponent;

  userContext$: Observable<UserContext>;
  loadingCompanyTiles$: Observable<boolean>;
  loadingCompanyTilesSuccess$: Observable<boolean>;
  loadingCompanyTilesError$: Observable<boolean>;
  companyTiles$: Observable<CompanyTilesResponse[]>;
  tileNames = TileNames;

  loadingCompanySettings$: Observable<boolean>;
  loadingCompanySettingsSuccess$: Observable<boolean>;
  loadingCompanySettingsError$: Observable<boolean>;
  companySettings$: Observable<CompanySetting[]>;

  loadingCompanyDataSets$: Observable<boolean>;
  loadingCompanyDataSetsError$: Observable<boolean>;
  companyDataSets$: Observable<CompanyDataSetsReponse[]>;

  compositeFields$: Observable<ListCompositeFields[]>;
  companyDataSetsEnabled$: Observable<boolean>;

  companyTabsContextSubscription: Subscription;

  jobPricingLimitInfoSubscription: Subscription;
  jobPricingLimitInfo$: Observable<any>;
  userContextSubscription: Subscription;

  enableJobPricingLimiterSubscription: Subscription;
  enableJobPricingLimiter$: Observable<boolean>;
  enableJobPricingLimiter: boolean;

  jobPricingLimitUsed = 0;
  showJobPricingLimitError = false;
  env = environment;
  isPayfactorsServices: boolean;

  constructor(private store: Store<fromPfAdminMainReducer.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.loadingCompanyTiles$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTiles);
    this.loadingCompanyTilesSuccess$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTilesSuccess);
    this.loadingCompanyTilesError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyTilesError);
    this.companyTiles$ = this.store.select(fromPfAdminMainReducer.getCompanyTiles);

    this.loadingCompanySettings$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettings);
    this.loadingCompanySettingsSuccess$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettingsSuccess);
    this.loadingCompanySettingsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanySettingsError);
    this.companySettings$ = this.store.select(fromPfAdminMainReducer.getCompanySettings);

    this.loadingCompanyDataSets$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSets);
    this.loadingCompanyDataSetsError$ = this.store.select(fromPfAdminMainReducer.getLoadingCompanyDataSetsError);
    this.companyDataSets$ = this.store.select(fromPfAdminMainReducer.getCompanyDataSets);

    this.compositeFields$ = this.store.select(fromPfAdminMainReducer.getCompositeFields);
    this.companyDataSetsEnabled$ = this.store.select(fromPfAdminMainReducer.getCompanyDataSetsEnabled);
    this.jobPricingLimitInfo$ = this.store.select(fromPfAdminMainReducer.getJobPricingLimitInfo);
    this.enableJobPricingLimiter$ = this.store.select(fromPfAdminMainReducer.getEnableJobPricingLimiter);
  }

  isUserAdmin(): boolean {
    let isSystemAdmin: boolean;

    this.store.select(fromRootState.getIsAdmin).pipe(
      take(1)
    ).subscribe(r => isSystemAdmin = r);

    return isSystemAdmin;
  }

  marketingTileFilter(companyTiles): any[] {
    return companyTiles.filter(companyTile => companyTile.IsMarketingTile === true);
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      if (uc) {
        const payfactorsServicesGroupName: string = SystemUserGroupNames.PayfactorsServices;
        this.isPayfactorsServices = (uc.CompanySystemUserGroupsGroupName.toLowerCase() === payfactorsServicesGroupName.toLowerCase());
      }
    });

    this.companyTabsContextSubscription = combineLatest(
      this.loadingCompanySettingsSuccess$,
      this.loadingCompanyTilesSuccess$
    ).pipe(
      map(([ companyTilesLoaded, companySettingsLoaded ]) => {
        return {
          companyTilesLoaded,
          companySettingsLoaded
        };
      })
    ).subscribe(c => this.handleCompanyTabsContextLoaded(c));

    this.jobPricingLimitInfoSubscription = this.jobPricingLimitInfo$.subscribe(value => {
        if (value) {
          this.jobPricingLimitUsed = value.Used;
        }
      }
    );

    this.enableJobPricingLimiterSubscription = this.enableJobPricingLimiter$.subscribe(response => {
        this.enableJobPricingLimiter = response;
    });
  }

  ngOnDestroy() {
    this.companyTabsContextSubscription.unsubscribe();
    this.jobPricingLimitInfoSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

  handleSurveyFieldsClicked() {
    event.preventDefault();
    event.stopPropagation();
    this.secondarySurveyFieldsModalComponent.open();
  }

  toggleCompanyTile(companyTile: CompanyTilesResponse) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanyTile(companyTile));
  }

  toggleMarketingTile(companyTile: CompanyTilesResponse) {
     this.store.dispatch(new fromCompanyPageActions.ToggleCompanyMarketingTile(companyTile));
  }

  toggleCompanyDataSet(companyDataSet: CompanyDataSetsReponse) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanyDataSet(companyDataSet));
  }

  toggleCompanySetting(companySetting: CompanySetting) {
    this.store.dispatch(new fromCompanyPageActions.ToggleCompanySetting(companySetting));
  }

  changeCompanySetting(companySettingKey: string, changedValue) {
    this.store.dispatch(new fromCompanyPageActions.ChangeCompanySettingValue({ companySettingKey, changedValue }));
  }

  checkMaxProjectJobCount(event, settingKey) {
    const maxProjectValueNum = Number(event.currentTarget.value);
    const jobPricingLimitUsedNum = Number(this.jobPricingLimitUsed);

    if (isNaN(maxProjectValueNum) || maxProjectValueNum < jobPricingLimitUsedNum) {
      this.showJobPricingLimitError = true;
      return;
    }

    this.showJobPricingLimitError = false;
    this.changeCompanySetting(settingKey, maxProjectValueNum.toString());
  }

  isConfigurableSetting(setting: CompanySetting): boolean {
    return (setting.DataType !== 'int') && (setting.Visible) && (setting.Key !== CompanySettingsEnum.MaxProjectJobCount);
  }

  displayJobPricingLimiter(setting: CompanySetting): boolean {
    const value: boolean = setting.Key === CompanySettingsEnum.MaxProjectJobCount && this.enableJobPricingLimiter;
    return value;
  }

  private handleCompanyTabsContextLoaded(companyTabsContext: CompanyTabsContext) {
    if (!!companyTabsContext && companyTabsContext.companySettingsLoaded && companyTabsContext.companyTilesLoaded) {
      const isEditMode = this.companyId !== -1;
      if (isEditMode) {
        this.store.dispatch(new fromCompanyPageActions.CheckJDMEnabled({ companyId: this.companyId }));
        this.store.dispatch(new fromCompanyPageActions.GetJobPricingLimitInfo({ companyId: this.companyId }));
        if (this.clientType === CompanyClientTypeConstants.PEER_AND_ANALYSIS || this.clientType === CompanyClientTypeConstants.PEER) {
          this.store.dispatch(new fromCompanyPageActions.DisablePeerAndAnalysisTiles());
        }
      } else {
        this.handleTabsDisplayByGroupAndClientType();
      }
    }
  }

  private handleTabsDisplayByGroupAndClientType() {
      switch (this.clientType) {
        case CompanyClientTypeConstants.PEER:
          this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
          return;
        case CompanyClientTypeConstants.PEER_AND_ANALYSIS:
          this.store.dispatch(new fromCompanyPageActions.SelectPeerAndAnalysisClientType());
          return;
        default:
          this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());
          return;
      }
    }
}
