import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';

import * as fromJobBasedRangeReducer from '../reducers';
import * as fromSharedJobBasedRangeReducer from '../reducers';
import { PageViewIds } from '../constants/page-view-ids';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class StructuresPagesService implements OnDestroy {
  metadataSubscription: Subscription;
  modelPageViewId: BehaviorSubject<string> = new BehaviorSubject<string>(PageViewIds.ModelMinMidMax);

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metadataSubscription = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata))
      .subscribe(md => {
        if (md) {
          this.modelPageViewId.next(PagesHelper.getModelPageViewIdByRangeDistributionType(md.RangeDistributionTypeId));
        }
      });
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }
}
