import { Injectable, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Subscription, from, Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';

import * as fromECommerceReducer from '../reducers';
import * as fromECommerceActions from '../actions/ecommerce.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class ECommerceService implements OnDestroy {
  public isInitialized$: Observable<boolean>;

  private isInitializedSubject: Subject<boolean>;
  private stripe: Stripe;
  private stripeInitSub: Subscription;

  constructor(private store: Store<fromECommerceReducer.State>) {
    store.dispatch(new fromECommerceActions.GetSettings());
    this.isInitializedSubject = new BehaviorSubject(false);
    this.isInitialized$ = this.isInitializedSubject.asObservable();
    this.initStripe();
  }

  redirectToCheckout(checkoutSessionId: string): Observable<string> {
    return from(this.stripe.redirectToCheckout({
      sessionId: checkoutSessionId
    })).pipe(
      map(({error}) => error.message)
    );
  }

  ngOnDestroy(): void {
    this.stripeInitSub.unsubscribe();
  }

  private initStripe() {
    const settingsAsyncObject$ = this.store.pipe(select(fromECommerceReducer.getSettingsAsyncObj));
    this.stripeInitSub = settingsAsyncObject$.subscribe(settingsAsyncObj => {
      if (!!settingsAsyncObj.obj && !this.stripe) {
        loadStripe(settingsAsyncObj.obj.StripeKey).then(stripe => {
          this.stripe = stripe;
          this.isInitializedSubject.next(true);
        });
      }
    });
  }
}
