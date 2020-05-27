import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import { LocationSearchComponent } from './location-search.component';
import { MapboxApiService } from '../../../data/mapbox-api/mapbox-api.service';
import * as fromRootState from '../../../state/state';

describe('LocationSearchComponent', () => {
  let fixture: ComponentFixture<LocationSearchComponent>;
  let instance: LocationSearchComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        LocationSearchComponent
      ],
      providers: [
        {
          provide: MapboxApiService
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(LocationSearchComponent);
    instance = fixture.componentInstance;
  });

  it('should call suggestedLocationsSelectionMoveUp when onKeyDown with ArrowUp key', () => {
    spyOn(instance, 'suggestedLocationsSelectionMoveUp');

    let placeholderFunction: any;

    placeholderFunction = function (): void {
    };

    const event = { preventDefault: placeholderFunction, key: 'ArrowUp' };
    instance.suggestedLocations = [ {
      text: 'test',
      place_name: 'Burlington',
      latitude: 71.1956,
      longitude: 42.5047,
      IsSuggested: true
    } ];

    instance.showSuggestLocationContainer = true;
    instance.onKeyDown(event);

    expect(instance.suggestedLocationsSelectionMoveUp).toHaveBeenCalled();
  });

  it('should call suggestedLocationsSelectionMoveDown when onKeyDown with ArrowDown key', () => {
    spyOn(instance, 'suggestedLocationsSelectionMoveDown');

    let placeholderFunction: any;

    placeholderFunction = function (): void {
    };

    const event = { preventDefault: placeholderFunction, key: 'ArrowDown' };
    instance.suggestedLocations = [ {
      text: 'test',
      place_name: 'Burlington',
      latitude: 71.1956,
      longitude: 42.5047,
      IsSuggested: true
    } ];

    instance.showSuggestLocationContainer = true;
    instance.onKeyDown(event);

    expect(instance.suggestedLocationsSelectionMoveDown).toHaveBeenCalled();
  });
});
