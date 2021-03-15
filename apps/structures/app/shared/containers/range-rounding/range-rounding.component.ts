import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RoundingSettingsDataObj, RangeGroupMetadata, generateMockRoundingSettingsDataObj } from 'libs/models/structures';

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
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;

  roundingSettings: RoundingSettingsDataObj;
  metadata: RangeGroupMetadata;
  staticRoundingPoints: RoundingPoint[];
  staticRoundingTypes: RoundingType[];
  toNearest: string;
  defaultSet: boolean;
  roundingSettingsForm: FormGroup;

  constructor(
    public store: Store<any>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));
    this.staticRoundingPoints = StructuresRoundingPoints;
    this.staticRoundingTypes = StructuresRoundingTypes;
    this.toNearest = 'to nearest';
  }

  buildForm() {
    this.roundingSettingsForm = new FormGroup({
      'min': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.min.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.min.RoundingPoint),
      }),
      'mid': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.mid.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.mid.RoundingPoint),
      }),
      'max': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.max.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.max.RoundingPoint),
      }),
      'firstTertile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.firstTertile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.firstTertile.RoundingPoint),
      }),
      'secondTertile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.secondTertile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.secondTertile.RoundingPoint),
      }),
      'firstQuartile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.firstQuartile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.firstQuartile.RoundingPoint),
      }),
      'secondQuartile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.secondQuartile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.secondQuartile.RoundingPoint),
      }),
      'firstQuintile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.firstQuintile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.firstQuintile.RoundingPoint),
      }),
      'secondQuintile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.secondQuintile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.secondQuintile.RoundingPoint),
      }),
      'thirdQuintile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.thirdQuintile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.thirdQuintile.RoundingPoint),
      }),
      'fourthQuintile': new FormGroup({
        'RoundingType': new FormControl(this.roundingSettings?.fourthQuintile.RoundingType),
        'RoundingPoint': new FormControl(this.roundingSettings?.fourthQuintile.RoundingPoint),
      })
    });
  }

  // Lifecycle
  ngOnInit(): void {
    this.defaultSet = false;
    const defaultRoundingSettings = generateMockRoundingSettingsDataObj();
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingSettings(defaultRoundingSettings));
    this.subscribe();
    this.buildForm();
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
          this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingSettings(this.metadata?.RangeAdvancedSetting?.Rounding));
        }
      }
    );
    this.roundingSettingsSub = this.roundingSettings$.subscribe(settings => {
      if (settings) {
        this.roundingSettings = settings;
        this.buildForm();
      } else {
        this.roundingSettings = generateMockRoundingSettingsDataObj();
      }
    });
  }

  private unsubscribe() {
    this.metadataSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
  }

}
