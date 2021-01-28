import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';
import * as fromMarketingActions from 'libs/features/infrastructure/marketing-settings/marketing-settings/actions/marketing-settings.actions';

import * as fromLoginReducer from '../../../reducers';
import * as fromLoginActions from '../../../actions/login.actions';

import { environment } from 'environments/environment';

declare var grecaptcha: any;
declare var initializeRecaptcha: any;

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
  loginSettings$: Observable<any>;
  passwordExpired$: Observable<boolean>;
  loginSubscription: Subscription;
  loginSuccessSubscription: Subscription;
  loginErrorSubscription: Subscription;
  nextPage: string;
  userVoiceNextPage: string;
  loggingIn = false;
  loginSuccess = false;
  loginError = false;
  allowSelfRegistration = environment.allowSelfRegistration;
  reCaptchaV3SiteKey: string;
  loginSettingsSuccess = false;

  constructor(private fb: FormBuilder,
              public loginStore: Store<fromLoginReducer.State>,
              public store: Store<fromLoginReducer.State>,
              private route: ActivatedRoute,
              private router: Router) {
    this.login$ = this.loginStore.select(fromLoginReducer.getLogin);
    this.loginError$ = this.loginStore.select(fromLoginReducer.getLoginError);
    this.passwordExpired$ = this.loginStore.select(fromLoginReducer.getPasswordExpired);
    this.loginSuccess$ = this.loginStore.select(fromLoginReducer.getLoginSuccess);
    this.marketingImage$ = this.store.select(fromLoginReducer.getMarketingImage);
    this.gettingMarketingImage$ = this.store.select(fromLoginReducer.getGettingMarketingImage);
    this.gettingMarketingImageError$ = this.store.select(fromLoginReducer.getGettingMarketingImageError);
    this.gettingMarketingImageSuccess$ = this.store.select(fromLoginReducer.getGettingMarketingImageSuccess);

    this.loginSettings$ = this.store.select(fromLoginReducer.getLoginSettings);
  }

  ngOnInit() {
    this.initForm();
    this.loginErrorSubscription = this.loginError$.subscribe(isError => {
      if (isError) {
        this.loginError = true;
      }
    });

    this.store.dispatch(new fromLoginActions.GetLoginSettings());
    this.store.dispatch(new fromMarketingActions.GetMarketingImage());

    this.marketingImage$.subscribe(image => {
      if (image) {
        this.imageLocation = image.Location;
        this.redirectUrl = image.RedirectUrl;
      }
    });

    this.loginSettings$.subscribe(settings => {
      if (settings) {
        this.reCaptchaV3SiteKey = settings.ReCaptchaV3SiteKey;

        if (typeof initializeRecaptcha !== 'undefined') {
          initializeRecaptcha(this.reCaptchaV3SiteKey);
        }

        this.loginSettingsSuccess = true;
      }
    });

    const queryParamMap = this.route.snapshot.queryParamMap;
    this.nextPage = queryParamMap.get('redirect');
    this.userVoiceNextPage = queryParamMap.get('uv_login');

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
    try {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.reCaptchaV3SiteKey, { action: 'login' }).then((token) => {
          this.login(token);
        }, executeErr => {
          console.error(`grecaptcha.execute error: ${executeErr}`);
          this.login();
        });
      });
    } catch (readyErr) {
      console.error(`grecaptcha.ready error: ${readyErr}`);
      this.login();
    }
  }

  login(captchaToken = '') {
    if (!this.loginForm.invalid) {
      this.loginStore.dispatch(new fromLoginActions.Login(
        {
          Email: this.getValue('email'),
          Password: this.getValue('password'),
          ClientCaptchaToken: captchaToken,
          ClientCaptchaSiteKey: this.reCaptchaV3SiteKey,
          NextPage: this.nextPage, UserVoiceNextPage: this.userVoiceNextPage
        }));
    } else {
      this.loginError = true;
    }
  }

  getValue(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control.value.toString();
  }
  navigateToRegistration() {
    if (environment.allowHubspotRegistration) {
      window.location.href = environment.hubspotRegistrationUrl;
    } else {
      this.router.navigateByUrl('/registration');
    }
  }
}
