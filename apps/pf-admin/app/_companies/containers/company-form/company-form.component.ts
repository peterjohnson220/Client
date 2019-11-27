import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SuccessEvent } from '@progress/kendo-angular-upload';

import { PfValidators } from 'libs/forms';
import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyClientTypesReponse } from 'libs/models/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { SystemUserGroupNames, SystemUserGroupIds, CompanyClientTypeConstants } from 'libs/constants';
import { CompanyFormData } from 'libs/models/company';

import * as fromPfAdminMainReducer from '../../reducers';
import * as fromCompanyPageActions from '../../actions/company-page.actions';
import { CompanyFormContext } from '../../models';
import { BrowserDetectionService } from 'libs/core/services';

@Component({
  selector: 'pf-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() companyFormData: CompanyFormData;
  @Input() companyFormContext: CompanyFormContext;
  @Input() saving: boolean;
  @Input() companyLogoImgPath: string;
  @Input() userContextSystemUserGroupId: number;

  companyForm: FormGroup;
  clientTypes: CompanyClientTypesReponse[];
  systemUserGroups: SystemUserGroupsResponse[];
  pfServicesReps: UserResponse[];
  pfJdmSrAssociates: UserResponse[];
  pfCustomerSuccessMgrs: UserResponse[];
  industries: CompanyIndustriesResponse[];
  uploadUrl: string;
  groupVal: string;
  uploadLogoErrorMessage: string;
  companyLogo: string;

  loadingTokenUrl$: Observable<boolean>;
  loadingTokenUrlError$: Observable<boolean>;
  tokenUrl$: Observable<string>;

  private peerOnlySystemUserGroupId: number;
  private smallBusinessSystemUserGroupId: number;
  private smallBusinessPaidSystemUserGroupId: number;
  public readonly HEALTHCARE = 'Health Care Equipment & Services';
  public readonly RETAILING = 'Retailing';

  constructor(
    private fb: FormBuilder,
    private store: Store<fromPfAdminMainReducer.State>,
    private browserDetectionService: BrowserDetectionService
  ) {
    this.loadingTokenUrl$ = this.store.select(fromPfAdminMainReducer.getLoadingPublicTokenUrl);
    this.loadingTokenUrlError$ = this.store.select(fromPfAdminMainReducer.getLoadingPublicTokenUrlError);
    this.tokenUrl$ = this.store.select(fromPfAdminMainReducer.getTokenUrl);
  }

  ngOnInit() {
    this.createForm();
    this.subscribeToChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.companyFormContext && !!changes.companyFormContext.currentValue) {
      this.clientTypes = this.companyFormContext.clientTypes;
      this.systemUserGroups = this.companyFormContext.systemUserGroups;
      this.pfServicesReps = this.companyFormContext.pfServicesReps;
      this.pfJdmSrAssociates = this.companyFormContext.pfJdmSrAssociates;
      this.pfCustomerSuccessMgrs = this.companyFormContext.pfCustomerSuccessMgrs;
      this.industries = this.companyFormContext.industries;
      this.peerOnlySystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.PeerOnly);
      this.smallBusinessSystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.SmallBusiness);
      this.smallBusinessPaidSystemUserGroupId = this.getSystemUserGroupId(SystemUserGroupNames.SmallBusinessPaid);
    }
    if (!!changes.companyFormData && !!changes.companyFormData.currentValue) {
      this.companyLogo = this.companyFormData.CompanyLogo;
      this.uploadUrl = `/odata/CloudFiles.UploadCompanyLogo?CompanyID=${this.companyFormData.CompanyId}`;
    }
    if (!!this.companyForm) {
      this.updateCompanyFormData();
    }
  }

  ngAfterViewInit() {
    this.updateCompanyFormData();
  }

  get submitDisabled(): boolean {
    return this.saving;
  }

  get isClientTypeSystemUserGroup(): boolean {
    const selectedSystemUserGroupsId = this.repositoryControl.value;
    return selectedSystemUserGroupsId === SystemUserGroupIds.PayfactorsServices ||
      selectedSystemUserGroupsId === this.peerOnlySystemUserGroupId ||
      selectedSystemUserGroupsId === this.smallBusinessSystemUserGroupId ||
      selectedSystemUserGroupsId === this.smallBusinessPaidSystemUserGroupId;
  }

  get isPayfactorsServicesRepositorySelected(): boolean {
    return this.repositoryControl.value === SystemUserGroupIds.PayfactorsServices;
  }

  get clientTypeControl() {
    return this.companyForm.get('clientType');
  }

  get repositoryControl() {
    return this.companyForm.get('repository');
  }

  get passwordLengthControl() {
    return this.companyForm.get('passwordLength');
  }

  get companyColorPickerControl() { return this.companyForm.get('companyColorPicker'); }
  get companyColorTextControl() { return this.companyForm.get('companyColorText'); }

  // convenience getter for easy access to form fields
  get f() { return this.companyForm.controls; }

  get checkBrowserIsIE() { return this.browserDetectionService.checkBrowserIsIE(); }

  createForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(255)]],
      companyNameShort: ['', Validators.maxLength(50)],
      status: [''],
      servicesRep: [null],
      jdmSrAssociate: [null],
      customerSuccessMgr: [null],
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
      companyColorPicker: ['#2F6C94'],
      companyColorText: ['#2F6C94', Validators.pattern('#[A-Za-z0-9]{6}')]
    });
  }

  subscribeToChanges() {
    this.companyForm.controls.repository.valueChanges.subscribe(val => this.setDynamicValidators(val === SystemUserGroupIds.PayfactorsServices));

    this.companyColorPickerControl.valueChanges.subscribe(value => {
      if (value && this.companyColorTextControl &&  this.companyColorTextControl.value !== value) {
        this.companyColorTextControl.setValue(value);
      }
    });
    this.companyColorTextControl.valueChanges.subscribe(value => {
      if (value
          && this.companyColorTextControl.valid
          && this.companyColorPickerControl
          && this.companyColorPickerControl.value !== value) {
        this.companyColorPickerControl.setValue(value);
      }
    });

  }

  setDynamicValidators(value: boolean) {
    const validators = value ? [Validators.required] : null;

    this.companyForm.controls.servicesRep.setValidators(validators);
    this.companyForm.controls.customerSuccessMgr.setValidators(validators);
    this.companyForm.controls.clientType.setValidators(validators);

    this.companyForm.controls.servicesRep.updateValueAndValidity();
    this.companyForm.controls.customerSuccessMgr.updateValueAndValidity();
    this.companyForm.controls.clientType.updateValueAndValidity();
  }

  isValid(): boolean {
    return this.companyForm.valid;
  }

  buildFormData(): CompanyFormData {
    const primarySupportUserId = this.companyForm.get('servicesRep').value;
    const jdmSrAssociatesUserId = this.companyForm.get('jdmSrAssociate').value;
    const customerSuccessMgrUserId = this.companyForm.get('customerSuccessMgr').value;
    const ftes = this.companyForm.get('ftes').value;
    const assets = this.companyForm.get('assets').value;
    const revenue = this.companyForm.get('revenue').value;
    return {
      CompanyId: this.companyFormData.CompanyId,
      CompanyName: this.companyForm.get('companyName').value,
      CompanyNameShort: this.companyForm.get('companyNameShort').value,
      Status: this.companyForm.get('status').value,
      PrimarySupportUserId: !!primarySupportUserId ? primarySupportUserId.toString() : null,
      JDMSeniorAssociateUserId: !!jdmSrAssociatesUserId ? jdmSrAssociatesUserId.toString() : null,
      SystemUserGroupsId: Number(this.repositoryControl.value),
      ClientType: this.clientTypeControl.value,
      Industry: this.companyForm.get('industry').value,
      FTEs: !!ftes ? ftes.toString() : null,
      Assets: !!assets ? assets.toString() : null,
      Revenue: !!revenue ? revenue.toString() : null,
      CompanyLogo: this.companyLogo,
      CustomerSuccessMgrUserId: !!customerSuccessMgrUserId ? customerSuccessMgrUserId.toString() : null,
      PasswordLengthRequirement: this.passwordLengthControl.value,
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
      CompanyColor: this.companyForm.get('companyColorText').value
    };
  }

  onClientTypeDropdownChange() {
    const currentSystemUserGroupId = this.repositoryControl.value;

    if (this.clientTypeControl.value === CompanyClientTypeConstants.PEER) {
      this.repositoryControl.setValue(this.peerOnlySystemUserGroupId);
      this.repositoryControl.disable();
      this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
      return;
    } else if (currentSystemUserGroupId === this.peerOnlySystemUserGroupId) {
      this.repositoryControl.setValue(SystemUserGroupIds.PayfactorsServices);
      this.repositoryControl.enable();
    }

    if (this.clientTypeControl.value === CompanyClientTypeConstants.PEER_AND_ANALYSIS) {
      this.store.dispatch(new fromCompanyPageActions.SelectPeerAndAnalysisClientType());
    } else if (this.repositoryControl.value === this.smallBusinessSystemUserGroupId) {
      this.store.dispatch(new fromCompanyPageActions.SelectSmallBusinessClientType());
    } else {
      this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());
    }
  }

  onRepositoryDropdownChange() {

    const systemUserGroupsIdValue = this.repositoryControl.value;

    if (systemUserGroupsIdValue === this.peerOnlySystemUserGroupId) {
      this.clientTypeControl.setValue(CompanyClientTypeConstants.PEER);
      this.repositoryControl.disable();

      this.store.dispatch(new fromCompanyPageActions.SelectPeerClientType());
      return;
    } else if (systemUserGroupsIdValue === this.smallBusinessPaidSystemUserGroupId) {
      this.clientTypeControl.setValue(CompanyClientTypeConstants.DATA_ONLY);
      return;
    } else if (systemUserGroupsIdValue === this.smallBusinessSystemUserGroupId) {
      this.clientTypeControl.setValue(CompanyClientTypeConstants.DATA_ONLY);

      this.store.dispatch(new fromCompanyPageActions.SelectSmallBusinessClientType());
      return;
    }

    this.store.dispatch(new fromCompanyPageActions.SelectNonPeerClientType());

    this.companyFormData.PrimarySupportUserId = null;
    this.companyFormData.JDMSeniorAssociateUserId = null;
    this.clientTypeControl.reset();
  }

  onIndustryDropdownChange() {
    const industryValue = this.companyForm.get('industry').value;
    this.setGroupFromIndustryValue(industryValue);
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

  private setGroupFromIndustryValue(industryValue: string) {
    // [GL] Existing industry values such as Retailing do not exist on new collection
    // Cannot read property Group of undefined will occur without the additional filter to find the industry value in the collection first
    if (industryValue && industryValue.length && this.industries.filter(i => i.Industry === industryValue).length) {
      this.groupVal = this.industries.find(i => i.Industry === industryValue).Group;
    } else {
      this.groupVal = '';
    }
    if (this.groupVal === this.RETAILING) {
      this.companyFormData.CustomFieldName = '# Stores';
    } else if (this.groupVal === this.HEALTHCARE) {
      this.companyFormData.CustomFieldName = '# Beds';
    } else {
      this.companyFormData.CustomFieldName = null;
      this.companyFormData.CustomFieldValue = null;
    }
  }

  private updateCompanyFormData(): void {
    this.companyForm.reset();
    this.setGroupFromIndustryValue(this.companyFormData.Industry);

    const PrimarySupportUserId = this.companyFormData.PrimarySupportUserId ? Number(this.companyFormData.PrimarySupportUserId) : null;
    const CustomerSuccessMgrUserId = this.companyFormData.CustomerSuccessMgrUserId ? Number(this.companyFormData.CustomerSuccessMgrUserId) : null;
    const CompanyColor =   this.companyFormData.CompanyColor ? this.companyFormData.CompanyColor : '#2F6C94';

    this.companyForm.get('companyName').setValue(this.companyFormData.CompanyName);
    this.companyForm.get('companyNameShort').setValue(this.companyFormData.CompanyNameShort);
    this.companyForm.get('status').setValue(this.companyFormData.Status);
    this.companyForm.get('servicesRep').setValue(PrimarySupportUserId);
    this.companyForm.get('jdmSrAssociate').setValue(Number(this.companyFormData.JDMSeniorAssociateUserId));
    this.companyForm.get('customerSuccessMgr').setValue(CustomerSuccessMgrUserId);
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
    this.companyForm.get('companyColorPicker').setValue(CompanyColor);
    this.companyForm.get('companyColorText').setValue(CompanyColor);

    this.disableRepository();
    this.companyForm.markAsTouched();
  }

  private getSystemUserGroupId(groupName: string): number {
    const systemUserGroup = this.systemUserGroups.find(sug => sug.GroupName.toLowerCase() === groupName.toLowerCase());
    return !!systemUserGroup ? systemUserGroup.SystemUserGroupsId : -1;
  }

  private disableRepository() {
    if (this.userContextSystemUserGroupId !== this.getSystemUserGroupId(SystemUserGroupNames.PayfactorsServices)) {
      this.repositoryControl.disable();
    } else {
      this.disableRepositoryForPeerClientType();
    }
  }

  private disableRepositoryForPeerClientType() {
    if (this.companyFormData.ClientType === CompanyClientTypeConstants.PEER) {
      this.repositoryControl.disable();
    } else {
      this.repositoryControl.enable();
    }
  }

}
