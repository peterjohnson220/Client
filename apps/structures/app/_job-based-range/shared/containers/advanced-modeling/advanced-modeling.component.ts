import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromJobBasedRangeReducer from '../../reducers';
import { RangeGroupMetadata } from '../../models';
import { Pages } from '../../constants/pages';
import { AdvancedModelingHelper } from '../../helpers/advanced-modeling.helper';

@Component({
  selector: 'pf-advanced-modeling',
  templateUrl: './advanced-modeling.component.html',
  styleUrls: ['./advanced-modeling.component.scss']
})
export class AdvancedModelingComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;
  @Input() advancedSettingForm: FormGroup;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  metadata: RangeGroupMetadata;

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
  }

  getMissingMarketDataTypeValue(value: string): number {
    return AdvancedModelingHelper.setMissingMarketDataTypeValue(value);
  }

  // Lifecycle
  ngOnInit(): void {
    this.metadataSub = this.metaData$.subscribe(md => { this.metadata = md; });
  }

  ngOnDestroy(): void {
    this.metadataSub.unsubscribe();
  }
}
