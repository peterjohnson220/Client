import { Injectable, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as Sentry from '@sentry/browser';

import * as fromRootState from '../../state/state';
import { UserContext } from '../../models/security';
import { environment } from '../../../environments/environment';

Sentry.init({
  dsn: 'https://91bfb4ae4e6a459ea2bffa1f07738f09@o50409.ingest.sentry.io/5236451',
  environment: environment.name
});

@Injectable()
export class SentryService implements OnDestroy {
  userContext: UserContext;
  userContextSubscription: Subscription;

  constructor( private store: Store<fromRootState.State> ) {
    this.userContextSubscription = this.store.select(fromRootState.getUserContext).subscribe(uc => {
      this.userContext = uc;
    });
  }

  handleError(error) {
    if (this.userContext) {
      Sentry.configureScope((scope) => {
        scope.setUser({'email': this.userContext.EmailAddress, 'id': this.userContext.UserId.toString()});
      });
    }

    Sentry.captureException(error.originalError || error);
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
