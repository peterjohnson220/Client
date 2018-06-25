import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';
import * as fromMarketingReducer from '../../../reducers';
import * as fromMarketingActions from '../../../actions/marketing-image.actions';

import * as fromLoginReducer from '../../../reducers';
import * as fromLoginActions from '../../../actions/login.actions';

@Component({
  selector: 'pf-login-page',
  templateUrl: './login.page.html',
  styleUrls: [ './login.page.scss' ]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  marketingImage$: Observable<MarketingImageDto>;
  gettingMarketingImage$: Observable<boolean>;
  gettingMarketingImageError$: Observable<boolean>;
  gettingMarketingImageSuccess$: Observable<boolean>;
  imageLocation: string; // 'assets/images/MarketingPlaceholder.PNG';
  redirectUrl: string;
  loginForm: FormGroup;
  loginLogo = 'assets/images/MarketingPlaceholder.PNG';
  submitted = false;
  login$: Observable<boolean>;
  loginError$: Observable<boolean>;
  loginSuccess$: Observable<boolean>;
  loginErrorSubscription: Subscription;

  constructor(private fb: FormBuilder,
              public loginStore: Store<fromLoginReducer.State>,
              public store: Store<fromMarketingReducer.State>) {
    this.login$ = this.loginStore.select(fromLoginReducer.getLogin);
    this.loginError$ = this.loginStore.select(fromLoginReducer.getLoginError);
    this.loginSuccess$ = this.loginStore.select(fromLoginReducer.getLoginSuccess);
    this.marketingImage$ = this.store.select(fromMarketingReducer.getMarketingImage);
    this.gettingMarketingImage$ = this.store.select(fromMarketingReducer.getGettingMarketingImage);
    this.gettingMarketingImageError$ = this.store.select(fromMarketingReducer.getGettingMarketingImageError);
    this.gettingMarketingImageSuccess$ = this.store.select(fromMarketingReducer.getGettingMarketingImageSuccess);
  }
  ngOnInit() {
    this.initForm();
    this.loginErrorSubscription = this.loginError$.subscribe(isError => {
      this.submitted = false;
    });
    this.store.dispatch(new fromMarketingActions.GetMarketingImage());

    this.marketingImage$.subscribe(image => {
      if (image) {
        this.imageLocation = image.Location;
        this.redirectUrl = image.RedirectUrl;
      }
    });
  }
  ngOnDestroy() {
    this.loginErrorSubscription.unsubscribe();
  }
  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }
  onSubmit() {
    if (!this.loginForm.invalid) {
      this.submitted = true;
      this.loginStore.dispatch(new fromLoginActions.Login(
        { email: this.getValue('email'), password: this.getValue('password')}));
    }
  }
  getValue(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control.value.toString();
  }
}

