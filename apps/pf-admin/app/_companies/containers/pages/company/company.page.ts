import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CompanyFormData, CompanyDto } from 'libs/models/company';
import { UserContext } from 'libs/models/security';
import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyClientTypesReponse } from 'libs/models/payfactors-api/company';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import * as fromRootReducer from 'libs/state/state';

import * as fromPfAdminMainReducer from '../../../reducers';
import * as fromCompanyPageActions from '../../../actions/company-page.actions';
import { CompanyPageHelper } from '../../../helpers';
import { CustomCompanySettings } from '../../../models';
import { CompanyFormContext } from '../../../models/company-form-context';
import { CompanyFormComponent } from '../../company-form';
import { CompanyTagsModalComponent } from '../../../components';

@Component({
  selector: 'pf-admin-company-page',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyPageComponent implements OnInit, OnDestroy {
  @ViewChild('companyPageForm', { static: false })
  companyForm: CompanyFormComponent;
  @ViewChild(CompanyTagsModalComponent, { static: true })
  companyTagsModalComponent: CompanyTagsModalComponent;
  companyId: -1;
  companyFormData: CompanyFormData;
  customCompanySettings: CustomCompanySettings;
  jdmEnabled: boolean;
  isEditMode: boolean;
  companyLogoImgPath: string;
  companyFormContext: CompanyFormContext;
  isCompanyFormContextLoaded: boolean;

  savingCompany$: Observable<boolean>;
  savingCompanyError$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  company$: Observable<CompanyDto>;
  systemUserGroups$: Observable<SystemUserGroupsResponse[]>;
  pfServicesReps$: Observable<UserResponse[]>;
  pfJdmSrAssociates$: Observable<UserResponse[]>;
  pfCustomerSuccessMgrs$: Observable<UserResponse[]>;
  industries$: Observable<CompanyIndustriesResponse[]>;
  clientTypes$: Observable<CompanyClientTypesReponse[]>;

  userContextSubscription: Subscription;
  companySubscription: Subscription;
  companyFormContextSubscription: Subscription;

  constructor(
    private store: Store<fromPfAdminMainReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.savingCompany$ = this.store.select(fromPfAdminMainReducer.getSavingCompany);
    this.savingCompanyError$ = this.store.select(fromPfAdminMainReducer.getSavingCompanyError);
    this.company$ = this.store.select(fromPfAdminMainReducer.getCompany);
    this.systemUserGroups$ = this.store.select(fromPfAdminMainReducer.getSystemUserGroups);
    this.pfServicesReps$ = this.store.select(fromPfAdminMainReducer.getPfServicesReps);
    this.pfJdmSrAssociates$ = this.store.select(fromPfAdminMainReducer.getPfJdmSrAssociates);
    this.pfCustomerSuccessMgrs$ = this.store.select(fromPfAdminMainReducer.getPfCustomerSuccessManagers);
    this.industries$ = this.store.select(fromPfAdminMainReducer.getCompanyIndustries);
    this.clientTypes$ = this.store.select(fromPfAdminMainReducer.getCompanyClientTypes);
  }

  ngOnInit() {
    this.companyId = this.route.snapshot.params.companyId || -1;
    this.jdmEnabled = false;
    this.isEditMode = (this.companyId !== -1);
    this.userContextSubscription = this.userContext$.subscribe(uc => this.initAddCompanyPageData(uc));
    this.companySubscription = this.company$.subscribe(c => this.initEditCompanyPageData(c));
    this.companyFormContextSubscription = combineLatest(
      this.clientTypes$,
      this.systemUserGroups$,
      this.pfServicesReps$,
      this.pfJdmSrAssociates$,
      this.pfCustomerSuccessMgrs$,
      this.industries$
    ).pipe(
      map(([clientTypes, systemUserGroups, pfServicesReps, pfJdmSrAssociates, pfCustomerSuccessMgrs, industries]) => {
        return {
          clientTypes,
          systemUserGroups,
          pfServicesReps,
          pfJdmSrAssociates,
          pfCustomerSuccessMgrs,
          industries
        };
      })
    ).subscribe((c) => {
      this.companyFormContext = c;
      this.isCompanyFormContextLoaded = true;
    });

    if (this.isEditMode) {
      this.store.dispatch(new fromCompanyPageActions.GetCompany({ companyId: this.companyId }));
      this.store.dispatch(new fromCompanyPageActions.GetCompanySettings({ companyId: this.companyId }));
    } else {
      this.store.dispatch(new fromCompanyPageActions.GetDefaultSettings());
    }
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
    this.companySubscription.unsubscribe();
    this.companyFormContextSubscription.unsubscribe();
  }

  get submitDisabled(): boolean {
    return !!this.companyForm && this.companyForm.submitDisabled;
  }

  initAddCompanyPageData(userContext: UserContext) {
    if (!userContext) {
      return;
    }
    this.companyLogoImgPath = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/';
    if (!this.isEditMode) {
      this.companyFormData = CompanyPageHelper.buildAddNewCompanyFormData(userContext.SystemUserGroupsId);
      this.customCompanySettings = CompanyPageHelper.buildDefaultCustomCompanySettings();
      this.store.dispatch(new fromCompanyPageActions.LoadFormData({ companyId: this.companyId }));
    }
  }

  initEditCompanyPageData(companyDto: CompanyDto) {
    if (!companyDto || !this.isEditMode) {
      return;
    }
    this.companyFormData = CompanyPageHelper.buildEditCompanyFormData(companyDto);
    this.customCompanySettings = CompanyPageHelper.buildCustomCompanySettings(companyDto);
    this.store.dispatch(new fromCompanyPageActions.LoadFormData({ companyId: this.companyId }));
  }

  handleSaveClicked(customSettings: CustomCompanySettings) {
    // TODO: Communication between the form and the pages should be done with events.
    // The page should not have a direct reference to the form components
    this.companyForm.companyForm.markAllAsTouched();
    if (!this.companyForm.companyForm.valid) {
      return;
    }

    let companyFormData = this.companyForm.buildFormData();
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
    if (!this.isEditMode) {
      this.store.dispatch(new fromCompanyPageActions.CreateCompany(companyFormData));
    } else {
      this.store.dispatch(new fromCompanyPageActions.SaveCompany(companyFormData));
    }
  }

  handleCompanyTagsClicked() {
    event.preventDefault();
    event.stopPropagation();
    this.companyTagsModalComponent.open();
  }

  handleCancelClicked() {
    this.router.navigate(['/companies']);
    this.store.dispatch(new fromCompanyPageActions.Reset());
  }
}
