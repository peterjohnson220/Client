import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { RangeGroupMetadata, RoundingPoint, RoundingType, RoundingSettingsDataObj} from '../../models';
import { Pages } from '../../constants/pages';
import { StructuresRoundingPoints, StructuresRoundingTypes } from '../../../data';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';


@Component({
  selector: 'pf-range-rounding',
  templateUrl: './range-rounding.component.html',
  styleUrls: ['./range-rounding.component.scss']
})
export class RangeRoundingComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;

  roundingSettings: RoundingSettingsDataObj;
  metadata: RangeGroupMetadata;
  staticRoundingPoints: RoundingPoint[];
  staticRoundingTypes: RoundingType[];
  toNearest: string;
  defaultSet: boolean;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRoundingSettings));
    this.staticRoundingPoints = StructuresRoundingPoints;
    this.staticRoundingTypes = StructuresRoundingTypes;
    this.toNearest = 'to nearest';
  }

  handleTypeChange(setting: string, type: RoundingTypes) {
    this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRoundingType({RoundingSetting: setting, RoundingType: type}));
  }

  handlePointChange(setting: string, point: number) {
    this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRoundingPoint({RoundingSetting: setting, RoundingPoint: point}));
  }

  // Lifecycle
  ngOnInit(): void {
    this.defaultSet = false;
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(
      md => {
        this.metadata = md;
        this.setDefaults();
      }
    );
    this.roundingSettingsSub = this.roundingSettings$.subscribe(
      rs => {
        this.roundingSettings = rs;
        this.setDefaults();
      }
    );
  }

  private setDefaults() {
    // wait for both to be present, and only set this once per visit to this page
    if (this.metadata && this.roundingSettings && !this.defaultSet) {
      // 0 is the default for Annual
      let defaultPoint = 0;

      if (this.metadata.Rate && this.metadata.Rate.toLowerCase() === 'hourly') {
        defaultPoint = 2;
      }

      this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRoundingPoint({RoundingSetting: 'min', RoundingPoint: defaultPoint}));
      this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRoundingPoint({RoundingSetting: 'mid', RoundingPoint: defaultPoint}));
      this.store.dispatch(new fromSharedJobBasedRangeActions.UpdateRoundingPoint({RoundingSetting: 'max', RoundingPoint: defaultPoint}));

      this.defaultSet = true;
    }
  }

  private unsubscribe() {
    this.metadataSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
  }

}
