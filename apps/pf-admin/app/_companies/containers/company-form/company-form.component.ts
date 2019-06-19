import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SuccessEvent } from '@progress/kendo-angular-upload';

import { PfValidators } from 'libs/forms';
import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyClientTypesReponse } from 'libs/models/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { SystemUserGroupNames, SystemUserGroupIds, CompanyClientTypeConstants } from 'libs/constants';
import { CompanyFormData } from 'libs/models/company';

import * as fromPfAdminMainReducer from '../../reducers';
import * as fromCompanyPageActions from '../../actions/company-page.actions';

@Component({
  selector: 'pf-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  @Input() companyFormData: CompanyFormData;
  @Input() jdmEnabled: boolean;
  @Input() saving: boolean;
  @Input() companyLogoImgPath: string;

  companyForm: FormGroup;
  isEditMode: boolean;
  systemUserGroups: SystemUserGroupsResponse[];
  pfServicesReps: UserResponse[];
  pfCustomerSuccessMgrs: UserResponse[];
  industries: CompanyIndustriesResponse[];
  clientTypes: CompanyClientTypesReponse[];
  orgDataAutoloaderApiKeyGenerating: boolean;
  orgDataAutoloaderApiKey: string;

  systemUserGroups$: Observable<SystemUserGroupsResponse[]>;
  pfServicesReps$: Observable<UserResponse[]>;
  pfCustomerSuccessMgrs$: Observable<UserResponse[]>;
  industries$: Observable<CompanyIndustriesResponse[]>;
  clientTypes$: Observable<CompanyClientTypesReponse[]>;
  loadingTokenUrl$: Observable<boolean>;
  loadingTokenUrlError$: Observable<boolean>;
  tokenUrl$: Observable<string>;

  systemUserGroupsSubscription: Subscription;
  pfServicesRepsSubscription: Subscription;
  pfCustomerSuccessMgrsSubscription: Subscription;
  industriesSubscription: Subscription;
  clientTypesSubscription: Subscription;

  private peerOnlySystemUserGroupId: number;
  private smallBusinessSystemUserGroupId: number;
  private smallBusinessPaidSystemUserGroupId: number;
  public readonly HEALTHCARE = 'Health Care Equipment & Services';
  public readonly RETAILING = 'Retailing';
  uploadUrl: string;
  groupVal: string;
  uploadLogoErrorMessage: string;
  companyLogo: string;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromPfAdminMainReducer.State>
  ) {
    this.systemUserGroups$ = this.store.select(fromPfAdminMainReducer.getSystemUserGroups);
    this.pfServicesReps$ = this.store.select(fromPfAdminMainReducer.getPfServicesReps);
    this.pfCustomerSuccessMgrs$ = this.store.select(fromPfAdminMainReducer.getPfCustomerSuccessManagers);
    this.industries$ = this.store.select(fromPfAdminMainReducer.getCompanyIndustries);
    this.clientTypes$ = this.store.select(fromPfAdminMainReducer.getCompanyClientTypes);
    this.loadingTokenUrl$ = this.store.select(fromPfAdminMainReducer.getLoadingPublicTokenUrl);
    this.loadingTokenUrlError$ = this.store.select(fromPfAdminMainReducer.getLoadingPublicTokenUrlError);
    this.tokenUrl$ = this.store.select(fromPfAdminMainReducer.getTokenUrl);
  }

  ngOnInit() {
    this.uploadUrl = `/odata/CloudFiles.UploadCompanyLogo?CompanyID=${this.companyFormData.CompanyId}`;
    this.createForm();
    this.systemUserGroupsSubscription = this.systemUserGroups$.subscribe(results => {
      if (!!results && !!results.length) {
        this.systemUserGroups = results;
        this.peerOnlySystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.PeerOnly);
        this.smallBusinessSystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.SmallBusiness);
        this.smallBusinessPaidSystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.SmallBusinessPaid);
        this.changeRepositoryDropdown();
      }
    });
    this.pfServicesRepsSubscription = this.pfServicesReps$.subscribe(results => this.pfServicesReps = results);
    this.pfCustomerSuccessMgrsSubscription = this.pfCustomerSuccessMgrs$.subscribe(results => this.pfCustomerSuccessMgrs = results);
    this.industriesSubscription = this.industries$.subscribe(results => this.industries = results);
    this.clientTypesSubscription = this.clientTypes$.subscribe(results => this.clientTypes = results);

    this.store.dispatch(new fromCompanyPageActions.GetSystemUserGroups());
    this.store.dispatch(new fromCompanyPageActions.GetPfServicesReps());
    this.store.dispatch(new fromCompanyPageActions.GetPfCustomerSuccessManagers());
    this.store.dispatch(new fromCompanyPageActions.GetCompanyIndustries());
    this.store.dispatch(new fromCompanyPageActions.GetCompanyClientTypes());

    this.updateCompanyFormData();
  }

  ngOnDestroy() {
    this.systemUserGroupsSubscription.unsubscribe();
    this.pfServicesRepsSubscription.unsubscribe();
    this.pfCustomerSuccessMgrsSubscription.unsubscribe();
    this.industriesSubscription.unsubscribe();
    this.clientTypesSubscription.unsubscribe();
  }

  createForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(255)]],
      companyNameShort: ['', Validators.maxLength(50)],
      status: [''],
      servicesRep: [0],
      customerSuccessMgr: [0],
      clientType: [''],
      ftes: [0, PfValidators.isNotNumeric],
      assets: [0, PfValidators.isNotNumeric],
      revenue: [0, PfValidators.isNotNumeric],
      industry: [''],
      repository: [''],
      customFieldValue: ['', Validators.maxLength(50)],
      enablePricingReview: [false],
      passwordLength: [0, [Validators.required, Validators.pattern('[0-9]*'), Validators.min(8), Validators.max(20)]],
      ParticipateInPeerDataExchange: [true],
      orgDataAutoloaderApiKey: ['']
    },
    {
      validator: (fg: FormGroup) => {
        if (fg.controls['repository'].value === SystemUserGroupIds.PayfactorsServices && (!fg.controls['servicesRep'].value ||
          !fg.controls['customerSuccessMgr'].value || !fg.controls['clientType'].value)) {
          return { invalid: true };
        }
      }
    });
  }

  buildFormData(): CompanyFormData {
    const primarySupportUserId = this.companyForm.get('servicesRep').value;
    const customerSuccessMgrUserId = this.companyForm.get('customerSuccessMgr').value;
    const ftes = this.companyForm.get('ftes').value;
    const assets = this.companyForm.get('assets').value;
    const revenue = this.companyForm.get('revenue').value;
    return {
      CompanyId: -1,
      CompanyName: this.companyForm.get('companyName').value,
      CompanyNameShort: this.companyForm.get('companyNameShort').value,
      Status: this.companyForm.get('status').value,
      PrimarySupportUserId: !!primarySupportUserId ? primarySupportUserId.toString() : null,
      SystemUserGroupsId: Number(this.companyForm.get('repository').value),
      ClientType: this.companyForm.get('clientType').value,
      Industry: this.companyForm.get('industry').value,
      FTEs: !!ftes ? ftes.toString() : null,
      Assets: !!assets ? assets.toString() : null,
      Revenue: !!revenue ? revenue.toString() : null,
      CompanyLogo: this.companyLogo,
      CustomerSuccessMgrUserId: !!customerSuccessMgrUserId ? customerSuccessMgrUserId.toString() : null,
      PasswordLengthRequirement: this.companyForm.get('passwordLength').value,
      CustomFieldName: this.companyFormData.CustomFieldName,
      CustomFieldValue: this.companyForm.get('customFieldValue').value,
      GroupName: null,
      EnablePricingReview: false,
      ParticipateInPeerDataExchange: true,
      EnableLibraryForRoutedJobDescriptions: true,
      EnableEmployeeAcknowledgement: false,
      EnableWorkflowEmployeeResults: false,
      RestrictWorkflowToCompanyEmployeesOnly: false,
      HideSecondarySurveyDataFields: true,
      EnableLiveChat: false,
      EnableIntervalAgingFactor: false,
      OrgDataAutoloaderApiKey: null
    };
  }

  get submitDisabled(): boolean {
    if (!this.companyForm) {
      return this.saving;
    }

    return this.saving || !this.companyForm.valid || !(this.companyForm.dirty || this.companyForm.touched);
  }

  get isClientTypeSystemUserGroup(): boolean {
    const selectedSystemUserGroupsId = this.companyForm.get('repository').value;
    return selectedSystemUserGroupsId === SystemUserGroupIds.PayfactorsServices ||
    selectedSystemUserGroupsId === this.peerOnlySystemUserGroupId ||
    selectedSystemUserGroupsId === this.smallBusinessSystemUserGroupId ||
    selectedSystemUserGroupsId === this.smallBusinessPaidSystemUserGroupId;
  }

  get isPayfactorsServicesRepositorySelected(): boolean {
    return this.companyForm.get('repository').value === SystemUserGroupIds.PayfactorsServices;
  }

  changeRepositoryDropdown() {
    const repositoryControl = this.companyForm.get('repository');
    const systemUserGroupsIdValue = repositoryControl.value;
    const clientTypeControl = this.companyForm.get('clientType');
    if (systemUserGroupsIdValue === this.peerOnlySystemUserGroupId) {
      clientTypeControl.setValue(CompanyClientTypeConstants.PEER);
      repositoryControl.disable();

      this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
      return;
    } else if ( systemUserGroupsIdValue === this.smallBusinessSystemUserGroupId ||
      systemUserGroupsIdValue === this.smallBusinessPaidSystemUserGroupId) {
        clientTypeControl.setValue(CompanyClientTypeConstants.DATA_ONLY);
        return;
    }

    this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());

    this.companyFormData.PrimarySupportUserId = null;
    clientTypeControl.reset();
  }

  onClientTypeChange() {
    const clientType = this.companyForm.get('clientType').value;
    const repositoryControl = this.companyForm.get('repository');
    const currentSystemUserGroupId = repositoryControl.value;

    if (clientType === CompanyClientTypeConstants.PEER) {
      repositoryControl.setValue(this.peerOnlySystemUserGroupId);
      repositoryControl.disable();
      this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
      return;
    } else if (currentSystemUserGroupId === this.peerOnlySystemUserGroupId) {
      repositoryControl.setValue(SystemUserGroupIds.PayfactorsServices);
      repositoryControl.enable();
    }

    if (clientType === CompanyClientTypeConstants.PEER_AND_ANALYSIS) {
      this.store.dispatch(new fromCompanyPageActions.SelectPeerAndAnalysisClientType());
    } else {
      this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());
    }
  }

  changeIndustryDropdown() {
    const industryValue = this.companyForm.get('industry').value;
    this.setGroupFromIndustryValue(industryValue);

    if (this.groupVal === this.RETAILING) {
      this.companyFormData.CustomFieldName = '# Stores';
    } else if (this.groupVal === this.HEALTHCARE) {
      this.companyFormData.CustomFieldName = '# Beds';
    } else {
      this.companyFormData.CustomFieldName = null;
      this.companyFormData.CustomFieldValue = null;
    }
  }

  successEventHandler(e: SuccessEvent) {
    const fileName = e.response.body.value;
    this.companyLogo = fileName;
  }

  errorEventHandler(e: ErrorEvent) {
    this.uploadLogoErrorMessage = e.message;
  }

  removeLogo() {
    this.companyLogo = '';
  }

  generateApiKey() {
    // TODO: Edit Company
  }

  private setGroupFromIndustryValue(industryValue: string) {
    // [GL] Existing industry values such as Retailing do not exist on new collection
    // Cannot read property Group of undefined will occur without the additional filter to find the industry value in the collection first
    if (industryValue && industryValue.length && this.industries.filter(i => i.Industry === industryValue).length) {
      this.groupVal = this.industries.find(i => i.Industry === industryValue).Group;
    } else {
      this.groupVal = '';
    }
}

  private updateCompanyFormData(): void {
    this.companyForm.get('companyName').setValue(this.companyFormData.CompanyName);
    this.companyForm.get('companyNameShort').setValue(this.companyFormData.CompanyNameShort);
    this.companyForm.get('status').setValue(this.companyFormData.Status);
    this.companyForm.get('servicesRep').setValue(this.companyFormData.PrimarySupportUserId);
    this.companyForm.get('customerSuccessMgr').setValue(this.companyFormData.CustomerSuccessMgrUserId);
    this.companyForm.get('clientType').setValue(this.companyFormData.ClientType);
    this.companyForm.get('ftes').setValue(this.companyFormData.FTEs);
    this.companyForm.get('assets').setValue(this.companyFormData.Assets);
    this.companyForm.get('revenue').setValue(this.companyFormData.Revenue);
    this.companyForm.get('industry').setValue(this.companyFormData.Industry);
    this.companyForm.get('repository').setValue(this.companyFormData.SystemUserGroupsId);
    this.companyForm.get('customFieldValue').setValue(this.companyFormData.CustomFieldValue);
    this.companyForm.get('enablePricingReview').setValue(this.companyFormData.EnablePricingReview);
    this.companyForm.get('passwordLength').setValue(this.companyFormData.PasswordLengthRequirement);
    this.companyForm.get('ParticipateInPeerDataExchange').setValue(this.companyFormData.ParticipateInPeerDataExchange);
    this.companyForm.get('orgDataAutoloaderApiKey').setValue(this.companyFormData.OrgDataAutoloaderApiKey);
  }

  private getSystemUserGroupId(groupName: string): number {
    const systemUserGroup = this.systemUserGroups.find(sug => sug.GroupName === groupName);
    return !!systemUserGroup ? systemUserGroup.SystemUserGroupsId : -1;
  }
}
