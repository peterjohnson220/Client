import { Injectable } from '@angular/core';

@Injectable()
export class JobDescriptionVersionCompareService {
  constructor() {}

  wasAdded(statuses: string[]) {
    return statuses.some(s => s === 'New' || s === 'MovedFromOtherParent');
  }

  wasRemoved(statuses: string[]) {
    return statuses.some(s => s === 'Removed' || s === 'MovedToNewParent');
  }

  wasMoved(statuses: string[]) {
    return statuses.some(s => s === 'MovedWithinParent');
  }
}
