import { Injectable, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';

import { JobBasedPageViewIds } from 'libs/models/structures';

import * as fromJobBasedRangeReducer from '../reducers';
import * as fromSharedJobBasedRangeReducer from '../reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';

@Injectable()
export class StructuresPagesService implements OnDestroy {
  metadataSubscription: Subscription;
  modelPageViewId: BehaviorSubject<string> = new BehaviorSubject<string>(JobBasedPageViewIds.ModelMinMidMax);

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metadataSubscription = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata))
      .subscribe(md => {
        if (md) {
          this.modelPageViewId.next(PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId));
        }
      });
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }
}
