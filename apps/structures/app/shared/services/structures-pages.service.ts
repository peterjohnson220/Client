import { Injectable, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';

import { GradeBasedPageViewIds, JobBasedPageViewIds } from 'libs/models/structures';

import * as fromSharedStructuresReducer from '../reducers';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class StructuresPagesService implements OnDestroy {
  metadataSubscription: Subscription;
  modelPageViewId: BehaviorSubject<string> = new BehaviorSubject<string>(JobBasedPageViewIds.ModelMinMidMax);
  modelSummaryViewId: BehaviorSubject<string> = new BehaviorSubject<string>(GradeBasedPageViewIds.ModelSummaryMinMidMax);

  constructor(public store: Store<fromSharedStructuresReducer.State>) {
    this.metadataSubscription = this.store.pipe(select(fromSharedStructuresReducer.getMetadata))
      .subscribe(md => {
        if (md) {
          this.modelPageViewId.next(PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId));
          this.modelSummaryViewId.next(PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(md.RangeDistributionTypeId));
        }
      });
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }
}
