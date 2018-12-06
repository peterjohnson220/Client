import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';
import * as fromMarketingReducer from '../../../reducers';
import * as fromMarketingActions from '../../../actions/marketing-image.actions';

import * as fromLoginReducer from '../../../reducers';
import * as fromLoginActions from '../../../actions/login.actions';

import { environment } from 'environments/environment';

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
  imageLocation: string;
  redirectUrl: string;
  loginForm: FormGroup;
  loginLogo = 'assets/images/MarketingPlaceholder.PNG';
  login$: Observable<boolean>;
  loginError$: Observable<boolean>;
  loginSuccess$: Observable<boolean>;
  loginSubscription: Subscription;
  loginSuccessSubscription: Subscription;
  loginErrorSubscription: Subscription;
  nextPage: string;
  loggingIn = false;
  loginSuccess = false;
  loginError = false;
  allowSelfRegistration = environment.allowSelfRegistration;

  constructor(private fb: FormBuilder,
              public loginStore: Store<fromLoginReducer.State>,
              public store: Store<fromMarketingReducer.State>,
              private route: ActivatedRoute) {
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
      if (isError) {
        this.loginError = true;
      }
    });
    this.store.dispatch(new fromMarketingActions.GetMarketingImage());

    this.marketingImage$.subscribe(image => {
      if (image) {
        this.imageLocation = image.Location;
        this.redirectUrl = image.RedirectUrl;
      }
    });

    const queryParamMap = this.route.snapshot.queryParamMap;
    this.nextPage = queryParamMap.keys[ 0 ];

    this.loginSubscription = this.login$.subscribe(value => {
      this.loggingIn = value;
    });

    this.loginSuccessSubscription = this.loginSuccess$.subscribe(value => {
      this.loginSuccess = value;
      this.loginError = false;
    });
  }

  ngOnDestroy() {
    this.loginErrorSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    this.loginSuccessSubscription.unsubscribe();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.loginStore.dispatch(new fromLoginActions.Login(
        { Email: this.getValue('email'), Password: this.getValue('password'), NextPage: this.nextPage }));
    } else {
      this.loginError = true;
    }
  }

  getValue(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control.value.toString();
  }

  onSelfRegistrationClick() {
    this.loginStore.dispatch(new fromLoginActions.LoginOpenSelfRegistration());
  }
}
