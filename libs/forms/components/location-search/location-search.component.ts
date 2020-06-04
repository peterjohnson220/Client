import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MapboxApiService } from '../../../data/mapbox-api/mapbox-api.service';
import { SuggestedLocation } from '../../../models/locations/suggested-location.model';
import * as fromRootState from '../../../state/state';
import * as fromRootReducer from '../../../state/state';
import { UserContext } from '../../../models/security';

@Component({
  selector: 'pf-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: [ './location-search.component.scss' ]
})
export class LocationSearchComponent implements OnInit, OnDestroy {

  showSuggestLocationContainer = false;
  suggestedLocations: SuggestedLocation[] = [];
  currentSelectedLocation: SuggestedLocation;
  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;

  @Input() parentForm = FormGroup;
  @Input() textMaxLength = 100;
  @Output() suggestedLocationChanged = new EventEmitter();
  private mbAccessToken: string;

  constructor(private locationApiService: MapboxApiService,
              private store: Store<fromRootState.State>) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit(): void {
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      this.mbAccessToken = uc.MapboxAccessToken;
    });
  }

  ngOnDestroy(): void {
    this.userContextSubscription.unsubscribe();
  }

  getSuggestedLocations(query) {
    if (query.length === 0) {
      this.showSuggestLocationContainer = false;
      this.suggestedLocations = [];
      this.suggestedLocationChanged.emit(null);
    } else {
      this.locationApiService.getLocationResults(query, this.mbAccessToken).subscribe((response) => {
        if (Object.keys(response).length > 0) {
          this.mapToSuggestedLocationModel(response);
        }
      });

      this.showSuggestLocationContainer = true;
    }
  }

  onSuggestedLocationChange(location) {
    const formattedLocationName = location.place_name;
    this.currentSelectedLocation = location;
    this.showSuggestLocationContainer = false;
    this.suggestedLocations = [];
    this.suggestedLocationChanged.emit(location);
  }

  onKeyDown(event) {
    if (this.suggestedLocations.length > 0 && this.showSuggestLocationContainer) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.suggestedLocationsSelectionMoveUp();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.suggestedLocationsSelectionMoveDown();
      }
    }
  }

  clickOutOfSuggestedLocations(event) {
    if (this.showSuggestLocationContainer) {
      this.suggestedLocations = [];
    }
  }

  suggestedLocationsSelectionMoveUp() {
    let focusedTagIndex = this.suggestedLocations.findIndex(x => x.IsSuggested === true);

    if (focusedTagIndex <= 0) {
      focusedTagIndex = this.suggestedLocations.length - 1;
    } else {
      focusedTagIndex -= 1;
    }

    this.suggestedLocations.forEach(element => {
      element.IsSuggested = false;
    });
    this.suggestedLocations[ focusedTagIndex ].IsSuggested = true;
  }

  suggestedLocationsSelectionMoveDown() {
    let focusedTagIndex = this.suggestedLocations.findIndex(x => x.IsSuggested === true);

    if (focusedTagIndex < 0 || focusedTagIndex >= this.suggestedLocations.length - 1) {
      focusedTagIndex = 0;
    } else {
      focusedTagIndex += 1;
    }

    this.suggestedLocations.forEach(element => {
      element.IsSuggested = false;
    });
    this.suggestedLocations[ focusedTagIndex ].IsSuggested = true;
  }

  private mapToSuggestedLocationModel(data: any) {
    this.suggestedLocations = [];

    data.features.forEach(location => {
      this.suggestedLocations.push({
        text: location.text,
        place_name: location.place_name,
        latitude: location.center[ 1 ],
        longitude: location.center[ 0 ],
        IsSuggested: false
      });
    });
  }
}
