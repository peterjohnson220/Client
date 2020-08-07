import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { CustomerConnection, SelectedCustomerConnection } from 'libs/models/sso';
import { CompanySelectorItem } from 'libs/features/company/company-selector/models';
import * as fromCompanyReducer from 'libs/features/company/company-selector/reducers';
import { PfValidators } from 'libs/forms/validators';


import * as fromSsoConfigReducers from '../../reducers';
import * as fromSsoConfigActions from '../../actions/sso-config.actions';


@Component({
  selector: 'pf-sso-config-modal',
  templateUrl: './sso-config-modal.component.html',
  styleUrls: ['./sso-config-modal.component.scss'],

})

export class SsoConfigModalComponent implements OnInit, OnDestroy {
  @Input() modalType: string;

  addSsoForm;
  editSsoForm;
  createSuccess: boolean;
  errorMessage: boolean;
  metadataFile: any;
  certificateFile: any;
  xmlMetadata: string;
  xmlCertificate: string;
  companySelected: CompanySelectorItem;
  customerConnection: CustomerConnection;
  customerConnectionData: SelectedCustomerConnection;
  updatedConfiguration: SelectedCustomerConnection;

  public createSsoConnectionSuccess: Observable<boolean>;
  public createSsoConnectionError: Observable<boolean>;
  public selectedCompany$: Observable<CompanySelectorItem>;
  public creatingSso$: Observable<boolean>;
  public ssoConfigModalOpen$: Observable<boolean>;
  public selectedCustomerConnection$: Observable<SelectedCustomerConnection>;

  private createSsoConnectionSuccessSubscription: Subscription;
  private createSsoConnectionErrorSubscription: Subscription;
  private getCompanySelectedSubscription: Subscription;
  public selectedCustomerConnectionSubscription: Subscription;

  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    private companyStore: Store<fromCompanyReducer.State>,
    private formBuilder: FormBuilder,

  ) {

    this.addSsoForm = this.formBuilder.group({
        email: ['', PfValidators.required],
        file: [null, PfValidators.required],
        logOutUrl: ['']
    });

    this.editSsoForm = this.formBuilder.group({
        CompanyName: [''],
        IdpId: [''],
        EmailDomain: ['', PfValidators.required],
        MetadataFile: [null],
        SsoLogOutUrl: [''],
        Certificate: [null]
    });

    this.creatingSso$ = this.store.pipe(select(fromSsoConfigReducers.getSsoConfiguring));
    this.ssoConfigModalOpen$ = this.store.pipe(select(fromSsoConfigReducers.getSsoConfigModalOpen));
    this.createSsoConnectionSuccess = this.store.select(fromSsoConfigReducers.getSsoConfiguringSuccess);
    this.createSsoConnectionError = this.store.select(fromSsoConfigReducers.getSsoConfiguringError);
    this.selectedCompany$ = this.companyStore.select(fromCompanyReducer.getSelectedCompany);
    this.selectedCustomerConnection$ = this.store.select(fromSsoConfigReducers.getSelectedCustomerConnection);
  }

  ngOnInit(): void {
    this.errorMessage = false;
    this.createSuccess = false;

    this.selectedCustomerConnectionSubscription = this.selectedCustomerConnection$.subscribe(connectionData => {
      if (connectionData !== null) {
        this.customerConnectionData = connectionData;
        this.editSsoForm.patchValue(this.customerConnectionData);
      }
    });

    this.getCompanySelectedSubscription = this.selectedCompany$.subscribe(company => {
        this.companySelected = company;
      }
    );

    this.createSsoConnectionSuccessSubscription = this.createSsoConnectionSuccess.subscribe( success => {
      if (success) {
        this.createSuccess = true;
        this.errorMessage = false;
      }
    });

    this.createSsoConnectionErrorSubscription = this.createSsoConnectionError.subscribe( error => {
      if (error) {
        this.errorMessage = true;
        this.createSuccess = false;
      }
    });
  }

  onSubmit(ssoData) {
    if (this.modalType === 'Add') {
      this.customerConnection = {
        Email: ssoData.email,
        CompanyId: this.companySelected.CompanyId,
        FileData: this.xmlMetadata,
        LogOutUrl: ssoData.logOutUrl
      };
      this.store.dispatch(new fromSsoConfigActions.SsoConfigure(this.customerConnection));

    } else if (this.modalType === 'Edit') {
      this.updatedConfiguration = {
        CompanyName: ssoData.CompanyName,
        CompanyId: this.customerConnectionData.CompanyId,
        IdpId: ssoData.IdpId,
        EmailDomain: ssoData.EmailDomain,
        MetadataFile: this.xmlMetadata == null ? '' : this.xmlMetadata,
        SsoLogOutUrl: ssoData.SsoLogOutUrl,
        Certificate: this.xmlCertificate == null ? '' : this.xmlCertificate
      };
      this.store.dispatch(new fromSsoConfigActions.UpdatingSsoConfiguration(this.updatedConfiguration));
    }

  }

  ngOnDestroy(): void {
    this.createSsoConnectionSuccessSubscription.unsubscribe();
    this.createSsoConnectionErrorSubscription.unsubscribe();
    this.getCompanySelectedSubscription.unsubscribe();
  }

  handleModalDismissed() {
    if (this.customerConnection || this.updatedConfiguration) {
      this.displaySsoInGrid();
    }
    this.store.dispatch(new fromSsoConfigActions.CloseSsoConfigModal());
  }

  displaySsoInGrid() {
    this.store.dispatch(new fromSsoConfigActions.GetSsoConfiguration());
  }

  metadataFileChange(e) {
    this.metadataFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload =  (e) => {
      this.xmlMetadata = fileReader.result.toString();
    };
    fileReader.readAsText(this.metadataFile);
  }

  certificateFileChange(e) {
    this.certificateFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload =  (e) => {
      this.xmlCertificate = fileReader.result.toString();
    };
    fileReader.readAsText(this.certificateFile);
  }
}
