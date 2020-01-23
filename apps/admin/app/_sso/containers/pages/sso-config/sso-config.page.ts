import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators } from '@angular/forms';

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromSsoConfigActions from '../../../actions/sso-config.actions';
import * as fromSsoConfigReducers from '../../../reducers';


@Component({
  selector: 'pf-site-admin-sso-config-page',
  templateUrl: './sso-config.page.html',
  styleUrls: ['./sso-config.page.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class SsoConfigPageComponent implements OnInit, OnDestroy {

  ssoForm;
  createSuccess: boolean;
  ssoURL: string;
  errorMessage: boolean;

  public createSsoConnectionSuccess: Observable<boolean>;
  public createSsoConnectionError: Observable<boolean>;

  private createSsoConnectionSuccessSubscription: Subscription;
  private createSsoConnectionErrorSubscription: Subscription;

  constructor(
    private store: Store<fromSsoConfigReducers.State>,
    private formBuilder: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal
    ) {

    this.ssoForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      entityId: ['', [Validators.required]],
      ssoEndpoint: ['', [Validators.required]],
      logOutUrl: '',
      signingCertificate: ['', [Validators.required]]
    });

    config.backdrop = 'static';
    config.keyboard = false;

    this.createSsoConnectionSuccess = this.store.select(fromSsoConfigReducers.getSsoConfiguringSuccess);
    this.createSsoConnectionError = this.store.select(fromSsoConfigReducers.getSsoConfiguringError);
  }

  ngOnInit() {
    this.errorMessage = false;
    this.createSuccess = false;

    this.createSsoConnectionSuccessSubscription = this.createSsoConnectionSuccess.subscribe( success => {
      if (success) {
        this.createSuccess = true;
        this.errorMessage = false;
        this.ssoForm.reset();
      }
    });

    this.createSsoConnectionErrorSubscription = this.createSsoConnectionError.subscribe( error => {
      if (error) {
        this.errorMessage = true;
        this.createSuccess = false;
      }
    });
  }

  ngOnDestroy() {
    this.createSsoConnectionSuccessSubscription.unsubscribe();
    this.createSsoConnectionErrorSubscription.unsubscribe();
  }

  onSubmit(ssoData) {
    const customerConnection = {
      Email: ssoData.email,
      CompanyId: ssoData.companyId,
      EntityId: ssoData.entityId,
      SsoEndPoint: ssoData.ssoEndpoint,
      SigningCertificate: ssoData.signingCertificate,
      LogOutUrl: ssoData.logOutUrl
    };

    if (this.ssoForm.valid) {
      this.createSsoUrl(customerConnection.Email);
      this.store.dispatch(new fromSsoConfigActions.SsoConfigure(customerConnection));
    }
  }

  open(ssoUrlModal) {
    this.modalService.open(ssoUrlModal);
    this.ssoForm.reset();
  }

  createSsoUrl(email) {
    const idpId = email.split('@')[1];
    this.ssoURL = `https://sso.connect.pingidentity.com/sso/sp/initsso?saasid=de9a2337-a436-47cd-aa59-0916962ed7f6&idpid=${idpId}`;
  }
}
