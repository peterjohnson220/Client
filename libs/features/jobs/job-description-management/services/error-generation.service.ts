import { Injectable } from '@angular/core';

import { SaveError } from '../models/save-error.model';

@Injectable()
export class ErrorGenerationService {
  constructor() { }

  public buildErrorModel(error: any, item: string, goBackLink: string): SaveError {
    const newError = new SaveError();

    newError.GoBackLink = goBackLink;

    if (error.status === 409) { // conflict error
      newError.IsConflict = true;
      newError.ErrorMessage = `Uh oh! It appears that your ${item} has become out of sync. Please refresh the page to continue.`;
    } else if (error.status === 403) {
      newError.IsConflict = false;
      newError.ErrorMessage = `You do not have permission to perform this action for this ${item}. ` +
        `Please contact your services associate for assistance.`;
    } else { // other error
      newError.IsConflict = false;
      newError.ErrorMessage = `There was an error saving this ${item}. Please contact your services associate for assistance.`;
    }

    return newError;
  }
}
