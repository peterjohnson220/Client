import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CompanyFormData } from 'libs/models/company';
import { UserContext } from 'libs/models/security';
import * as fromRootReducer from 'libs/state/state';

import * as fromPfAdminMainReducer from '../../../reducers';
import * as fromCompanyPageActions from '../../../actions/company-page.actions';
import { CompanyPageHelper } from '../../../helpers';
import { CustomCompanySettings } from '../../../models';

@Component({
  selector: 'pf-admin-company-page',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss']
})
export class CompanyPageComponent implements OnInit, OnDestroy {
  companyId: -1;
  companyFormData: CompanyFormData;
  customCompanySettings: CustomCompanySettings;
  jdmEnabled: boolean;
  isEditMode: boolean;

  savingCompany$: Observable<boolean>;
  savingCompanyError$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  userContextSubscription: Subscription;

  userContext: UserContext;
  companyLogoImgPath: string;

  constructor(
    private store: Store<fromPfAdminMainReducer.State>
  ) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.savingCompany$ = this.store.select(fromPfAdminMainReducer.getSavingCompany);
    this.savingCompanyError$ = this.store.select(fromPfAdminMainReducer.getSavingCompanyError);
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(uc => this.initPageData(uc));
    this.companyId = -1;
    this.jdmEnabled = false;
    this.isEditMode = false;

    this.store.dispatch(new fromCompanyPageActions.GetCompanyTiles(this.companyId));
    this.store.dispatch(new fromCompanyPageActions.GetDefaultSettings());
    this.store.dispatch(new fromCompanyPageActions.GetCompanyDataSets(this.companyId));
    this.store.dispatch(new fromCompanyPageActions.GetCompositeFields());
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }

  initPageData(userContext: UserContext) {
    if (!userContext) {
      return;
    }
    this.userContext = userContext;
    this.companyFormData = CompanyPageHelper.buildAddNewCompanyFormData(this.userContext.SystemUserGroupsId);
    this.companyLogoImgPath = this.userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/';
    this.customCompanySettings = CompanyPageHelper.buildDefaultCustomCompanySettings();
  }

  handleSaveClicked(companyFormData: CompanyFormData, customSettings: CustomCompanySettings) {
    companyFormData = Object.assign({},
      companyFormData,
      { EnablePricingReview: customSettings.EnablePricingReview },
      { ParticipateInPeerDataExchange: customSettings.ParticipateInPeerDataExchange },
      { EnableLibraryForRoutedJobDescriptions: customSettings.EnableLibraryForRoutedJobDescriptions },
      { EnableEmployeeAcknowledgement: customSettings.EnableEmployeeAcknowledgement },
      { EnableWorkflowEmployeeResults: customSettings.EnableWorkflowEmployeeResults },
      { RestrictWorkflowToCompanyEmployeesOnly: customSettings.RestrictWorkflowToCompanyEmployeesOnly },
      { HideSecondarySurveyDataFields: customSettings.HideSecondarySurveyDataFields },
      { EnableIntervalAgingFactor: customSettings.EnableIntervalAgingFactor },
      { EnableLiveChat: customSettings.EnableLiveChat });
    this.store.dispatch(new fromCompanyPageActions.SaveCompany(companyFormData));
  }
}
