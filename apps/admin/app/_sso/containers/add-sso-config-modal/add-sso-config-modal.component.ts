import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { CompanySelectorItem } from 'libs/features/company/models';
import * as fromSsoConfigReducers from '../../reducers';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import * as fromSsoConfigActions from '../../actions/sso-config.actions';
import { CustomerConnection } from 'libs/models/sso';
import { SsoUrl } from 'libs/constants';


@Component({
  selector: 'pf-add-sso-config-modal',
  templateUrl: './add-sso-config-modal.component.html',
  styleUrls: ['./add-sso-config-modal.component.scss'],

})

export class AddSsoConfigModalComponent implements OnInit, OnDestroy {
  @ViewChild('addSsoConfigModal', {static: true}) addSsoConfigModal: any;

  ssoForm;
  createSuccess: boolean;
  errorMessage: boolean;
  file: any;
  xmlData: string;
  companySelected: CompanySelectorItem;
  customerConnection: CustomerConnection;

  public createSsoConnectionSuccess: Observable<boolean>;
  public createSsoConnectionError: Observable<boolean>;
  public selectedCompany$: Observable<CompanySelectorItem>;
  public creatingSso$: Observable<boolean>;
  public addSsoConfigModalOpen$: Observable<boolean>;

  private createSsoConnectionSuccessSubscription: Subscription;
  private createSsoConnectionErrorSubscription: Subscription;
  private getCompanySelectedSubscription: Subscription;

  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    private companyStore: Store<fromCompanyReducer.State>,
    private formBuilder: FormBuilder,

  ) {

    this.ssoForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      file: [null, Validators.required],
      logOutUrl: '',
    });

    this.creatingSso$ = this.store.pipe(select(fromSsoConfigReducers.getSsoConfiguring));
    this.addSsoConfigModalOpen$ = this.store.pipe(select(fromSsoConfigReducers.getAddSsoConfigModalOpen));
    this.createSsoConnectionSuccess = this.store.select(fromSsoConfigReducers.getSsoConfiguringSuccess);
    this.createSsoConnectionError = this.store.select(fromSsoConfigReducers.getSsoConfiguringError);
    this.selectedCompany$ = this.companyStore.select(fromCompanyReducer.getSelectedCompany);

  }

  ngOnInit(): void {
    this.errorMessage = false;
    this.createSuccess = false;

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
    this.customerConnection = {
      Email: ssoData.email,
      CompanyId: this.companySelected.CompanyId,
      FileData: this.xmlData,
      LogOutUrl: ssoData.logOutUrl
    };

    this.store.dispatch(new fromSsoConfigActions.SsoConfigure(this.customerConnection));

  }

  ngOnDestroy(): void {
    this.createSsoConnectionSuccessSubscription.unsubscribe();
    this.createSsoConnectionErrorSubscription.unsubscribe();
    this.getCompanySelectedSubscription.unsubscribe();
  }

  handleModalDismissed() {
    if (this.customerConnection) {
      this.displaySsoInGrid(this.customerConnection);
    }
    this.store.dispatch(new fromSsoConfigActions.CloseAddSsoConfigModal());
  }

  displaySsoInGrid(customerConnection) {
    const connectionForGrid = {
      EmailDomain: customerConnection.Email.split('@')[1],
      CompanyId: this.companySelected.CompanyId,
      CompanyName: this.companySelected.CompanyName,
      IdpId: customerConnection.Email.split('@')[1],
      SsoLogOutUrl: (customerConnection.LogOutUrl === '' || customerConnection.LogOutUrl == null )
        ? SsoUrl.SSO_DEFAULT_LOGOUT_URL : customerConnection.LogOutUrl
    };
    this.store.dispatch(new fromSsoConfigActions.DisplayNewSso(connectionForGrid));
  }

  fileChange(e) {
    this.file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload =  (e) => {
      this.xmlData = fileReader.result.toString();
    };
    fileReader.readAsText(this.file);
  }
}
