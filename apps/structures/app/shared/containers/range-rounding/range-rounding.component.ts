import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RoundingSettingsDataObj, RangeGroupMetadata } from 'libs/models/structures';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromSharedStructuresActions from '../../actions/shared.actions';
import { RoundingPoint, RoundingType } from '../../models';
import { StructuresRoundingPoints, StructuresRoundingTypes } from '../../data';

@Component({
  selector: 'pf-range-rounding',
  templateUrl: './range-rounding.component.html',
  styleUrls: ['./range-rounding.component.scss']
})
export class RangeRoundingComponent implements OnInit, OnDestroy {
  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;

  roundingSettings: RoundingSettingsDataObj;
  metadata: RangeGroupMetadata;
  staticRoundingPoints: RoundingPoint[];
  staticRoundingTypes: RoundingType[];
  toNearest: string;
  defaultSet: boolean;

  constructor(
    public store: Store<any>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.staticRoundingPoints = StructuresRoundingPoints;
    this.staticRoundingTypes = StructuresRoundingTypes;
    this.toNearest = 'to nearest';
  }

  handleTypeChange(setting: string, type: RoundingTypes) {
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingType({RoundingSetting: setting, RoundingType: type}));
  }

  handlePointChange(setting: string, point: number) {
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoint({RoundingSetting: setting, RoundingPoint: point}));
  }

  // Lifecycle
  ngOnInit(): void {
    this.defaultSet = false;
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromSharedStructuresActions.ResetRoundingSetting());
    this.unsubscribe();
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(
      md => {
        if (md) {
          this.metadata = md;
          this.roundingSettings = this.metadata?.RangeAdvancedSetting.Rounding;
          this.setDefaults();
        }
      }
    );
  }

  setDefaults() {
    // wait for both to be present, and only set this once per visit to this page
    if (this.metadata && this.roundingSettings && !this.defaultSet) {
      // 0 is the default for Annual
      let defaultPoint = 0;

      if (this.metadata.Rate && this.metadata.Rate.toLowerCase() === 'hourly') {
        defaultPoint = 2;
      }

      this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoint({RoundingSetting: 'min', RoundingPoint: defaultPoint}));
      this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoint({RoundingSetting: 'mid', RoundingPoint: defaultPoint}));
      this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoint({RoundingSetting: 'max', RoundingPoint: defaultPoint}));

      this.defaultSet = true;
    }
  }

  private unsubscribe() {
    this.metadataSub.unsubscribe();
  }

}
