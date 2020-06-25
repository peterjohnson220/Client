import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import spyOn = jest.spyOn;

import { TilePreviewChartWithListComponent } from './tile-preview-chart-with-list.component';
import * as fromRootState from 'libs/state/state';
import * as fromTileGridReducer from '../../../reducers';
import { generateMockListTile, generateTilePreviewChartWithListFromTile } from '../../../models';


describe('Tile Preview Chart With List', () => {
  let fixture: ComponentFixture<TilePreviewChartWithListComponent>;
  let instance: TilePreviewChartWithListComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tileGrid: combineReducers(fromTileGridReducer.reducers)
        })
      ],
      declarations: [
        TilePreviewChartWithListComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TilePreviewChartWithListComponent);
    instance = fixture.componentInstance;
  });

  it('should show component', () => {
    const tile = generateMockListTile(true);
    instance.model = generateTilePreviewChartWithListFromTile(tile);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
