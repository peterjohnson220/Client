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
    this.features$.subscribe(features =>
      this.displayRightSideBar = AppWrapperComponent.ShouldDisplayRightSideBar(features)
    );
  }

  static ShouldDisplayRightSideBar(features): boolean {
    const featuresInRightSideBar = [
      FeatureTypes.Activity,
      FeatureTypes.Community,
      FeatureTypes.JobDescriptions
    ];
    const minimumFeaturesThreshold = 1;
    return this.MinimumNumberOfFeaturesMet(features, featuresInRightSideBar, minimumFeaturesThreshold);
  }

  static MinimumNumberOfFeaturesMet(allFeatures, requiredFeatures, minThreshold): boolean {
    return allFeatures.filter(feature => requiredFeatures.indexOf(feature.type) !== -1).length >= minThreshold;
  }
}
