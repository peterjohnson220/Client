import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromFeatureReducer from './_main/reducers';
import { FeatureTypes, Feature } from './_main/models';

@Component({
  selector: 'pf-app-wrapper',
  templateUrl: './app-wrapper.component.html'
})
export class AppWrapperComponent {
  features$: Observable<Feature[]>;
  displayRightSideBar: boolean;
  constructor(private featureStore: Store<fromFeatureReducer.State>) {
    this.features$ = this.featureStore.select(fromFeatureReducer.getFeatures);
    this.features$.subscribe(features => this.displayRightSideBar = AppWrapperComponent.shouldDisplayRightSideBar(features));
  }

  static shouldDisplayRightSideBar(feature): boolean {
    const requiredTilesTypesForSideBar = [
      FeatureTypes.Activity,
      FeatureTypes.Community,
      FeatureTypes.JobDescriptions
    ];
    return feature.filter(t => requiredTilesTypesForSideBar.indexOf(t.Type) !== -1).length ===
      requiredTilesTypesForSideBar.length;
  }
}
