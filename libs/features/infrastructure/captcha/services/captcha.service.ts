import { Injectable, NgZone } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ReCaptcha } from '../models/recaptcha.model';
import * as fromCaptchaReducer from '../reducers';
import * as fromCaptchaActions from '../actions/captcha.actions';

declare var grecaptcha: ReCaptcha;

declare global {
  interface Window {
    recaptchaLoaded: () => void;
  }
}

function loadScript(onLoaded: () => void) {
  window.recaptchaLoaded = () => {
    onLoaded();
  };

  const script = document.createElement('script');
  script.innerHTML = '';
  script.type = 'text/javascript';
  script.src = 'https://www.recaptcha.net/recaptcha/api.js?render=explicit&onload=recaptchaLoaded';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

@Injectable()
export class CaptchaService {
  public isLoaded$: Observable<boolean>;

  private grecaptcha: ReCaptcha;
  private siteKey: string;

  constructor(private store: Store<fromCaptchaReducer.State>, private zone: NgZone) {
    const isLoaded$ = this.store.pipe(select(fromCaptchaReducer.getIsLoaded));
    const siteKeyAsyncObj$ = this.store.pipe(select(fromCaptchaReducer.getSiteKeyAsyncObj));
    this.isLoaded$ = combineLatest(isLoaded$, siteKeyAsyncObj$).pipe(
      map(([isLoaded, siteKeyAsyncObj]) => {
        return isLoaded && !!siteKeyAsyncObj.obj;
      })
    );

    siteKeyAsyncObj$.subscribe(siteKeyAsyncObj => {
      this.siteKey = siteKeyAsyncObj.obj;
    });

    this.init();
  }

  public render(container: HTMLElement, tokenCallback: (response: string) => void, expiredCallback: () => void): number {
    const parameters = {
      sitekey: this.siteKey,
      callback: (response: string) => { this.zone.run(() => tokenCallback(response)); },
      'expired-callback': () => { this.zone.run(() => expiredCallback()); }
    };
    return this.grecaptcha.render(container, parameters);
  }

  public reset(captchaId: number) {
    this.zone.runOutsideAngular(() => {
      this.grecaptcha.reset(captchaId);
    });
  }

  private init() {
    if (!this.siteKey) {
      this.store.dispatch(new fromCaptchaActions.GetSiteKey());
    }

    if ('grecaptcha' in window) {
      this.grecaptcha = grecaptcha;
    } else {
      loadScript(this.onLoadComplete);
    }
  }

  private onLoadComplete = () => {
    this.grecaptcha = grecaptcha;
    this.store.dispatch(new fromCaptchaActions.Loaded());
  }
}
