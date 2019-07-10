import { Pipe, PipeTransform } from '@angular/core';

import { ValidationResultItem } from 'libs/models/common';

@Pipe({name: 'validationErrors', pure: true})
export class JobDescriptionLoaderValidationErrorsPipe implements PipeTransform {
  transform(validationResults: ValidationResultItem[]) {

    if (validationResults == null) {
      return null;
    }

    return validationResults.filter(validationResult => validationResult.Type.toLowerCase().indexOf('error') > -1);
  }
}

