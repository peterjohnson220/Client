import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { AdvancedSettings, RangeGroupMetadata } from '../../models';
import { Pages } from '../../constants/pages';

@Component({
  selector: 'pf-advanced-modeling',
  templateUrl: './advanced-modeling.component.html',
  styleUrls: ['./advanced-modeling.component.scss']
})
export class AdvancedModelingComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  advancedSettings$: Observable<AdvancedSettings>;
  advancedSettingsSub: Subscription;
  advancedSettings: AdvancedSettings;

  metadata: RangeGroupMetadata;

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.advancedSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getAdvancedSettings));
  }

  // Lifecycle
  ngOnInit(): void {
    this.subscribe();
  }

  ngOnDestroy(): void {
    /*this.store.dispatch(new fromSharedJobBasedRangeActions.ResetRoundingSetting());*/
    this.unsubscribe();
  }

  onPreventMidsBelowCurrentChanged(value: boolean) {
    const advancedSettings = cloneDeep(this.advancedSettings);
    advancedSettings.PreventMidsBelowCurrent = value;
    this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateAdvancedSettings({ advancedSettings: advancedSettings }));
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(
      md => {
        this.metadata = md;
      }
    );

    this.advancedSettingsSub = this.advancedSettings$.subscribe(
      as => {
        this.advancedSettings = as;
      }
    );

  }


  private unsubscribe() {
    this.metadataSub.unsubscribe();
    this.advancedSettingsSub.unsubscribe();
  }

}
