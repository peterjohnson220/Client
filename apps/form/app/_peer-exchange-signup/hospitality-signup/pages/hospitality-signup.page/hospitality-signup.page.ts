import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { PfValidators } from 'libs/forms/validators';
import { FormSubmissionResponse } from 'libs/models/payfactors-api/form';
import { CompanyBaseInformation } from 'libs/models/company';
import { AsyncStateObj } from 'libs/models/state';
import { CaptchaService } from 'libs/features/captcha/services';

import { ExchangeSignupLookupKey } from '../../../data';
import * as fromSharedReducer from '../../../../shared/reducers';
import * as fromSharedActions from '../../../../shared/actions/shared.actions';
import * as fromPeerExchangeSignupActions from '../../../../shared/actions/peer-exchange-signup.actions';

@Component({
  selector: 'pf-hospitality-signup-page',
  templateUrl: './hospitality-signup.page.html',
  styleUrls: ['./hospitality-signup.page.scss']
})
export class HospitalitySignupPageComponent implements OnInit, OnDestroy {
  @ViewChild('signupFormDir', { static: true }) signupFormDir: NgForm;
  payfactorsLogo = './assets/payfactors-transparent.png';
  backgroundImage = './assets/duotone-background.jpg';
  formLoading: boolean;

  submittingFormAsyncObj$: Observable<AsyncStateObj<FormSubmissionResponse>>;
  exchangeSignupCompaniesAsyncObj$: Observable<AsyncStateObj<CompanyBaseInformation[]>>;

  signupForm: FormGroup;
  formUpdateSubscription: Subscription;
  formLoadingSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private store: Store<fromSharedReducer.State>, private captchaService: CaptchaService, private zone: NgZone) {
    this.submittingFormAsyncObj$ = this.store.pipe(
      select(fromSharedReducer.getSubmittingFormAsyncObj)
    );
    this.exchangeSignupCompaniesAsyncObj$ = this.store.pipe(
      select(fromSharedReducer.getExchangeSignupCompaniesAsyncObj)
    );
  }

  ngOnInit(): void {
    this.formLoading = true;
    this.initForm();
    this.formUpdateSubscription = this.signupForm.valueChanges.subscribe(() => {
      const formValue = this.signupForm.value;
      formValue.CompanyId = parseInt(formValue.CompanyId, 10);
      this.store.dispatch(new fromSharedActions.FormUpdate({ rootFormModelValue: formValue }));
    });
    this.formLoadingSubscription = combineLatest(this.exchangeSignupCompaniesAsyncObj$, this.captchaService.isLoaded$).pipe(
      map(([companiesAsyncObj, captchaInitialized]) => {
        return companiesAsyncObj.loading || !captchaInitialized;
      })
    ).subscribe(value => {
      this.zone.run(() => {
        this.formLoading = value;
      });
    });
    this.store.dispatch(new fromPeerExchangeSignupActions.GetExchangeSignupCompanies({ exchangeName: ExchangeSignupLookupKey.Hospitality }));
  }

  ngOnDestroy(): void {
    this.formUpdateSubscription.unsubscribe();
    this.formLoadingSubscription.unsubscribe();
  }

  submitForm(): void {
    if (this.signupForm.valid) {
      this.store.dispatch(new fromSharedActions.SubmitForm());
    }
  }

  showControlValidation(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control.invalid && (this.signupFormDir.submitted || control.touched && control.dirty);
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      FirstName: ['', PfValidators.required],
      LastName: ['', PfValidators.required],
      Email: ['', PfValidators.required],
      JobTitle: [''],
      SubsidiaryName: ['', PfValidators.required],
      BillingAddress: ['', PfValidators.required],
      CompanyId: ['', PfValidators.required],
      PropertyType: ['', PfValidators.required],
      AccessCode: ['', PfValidators.required],
      PaymentOption: ['', PfValidators.required],
      Captcha: ['', PfValidators.required]
    });
  }
}
