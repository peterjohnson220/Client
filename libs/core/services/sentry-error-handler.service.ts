import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { SentryService } from './sentry.service';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error) {
    const sentryService = this.injector.get(SentryService);

    sentryService.handleError(error);

    return new ErrorHandler().handleError(error);
  }
}


