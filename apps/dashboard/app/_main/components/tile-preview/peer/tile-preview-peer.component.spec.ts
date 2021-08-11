import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { HumanizeNumberPipe } from 'libs/core/pipes';
import * as fromRootState from 'libs/state/state';
import { TileTypes } from 'libs/models/dashboard';

import { TilePreviewPeerComponent } from './tile-preview-peer.component';
import { generateMockChartTile, generateTilePreviewPeerFromTile } from '../../../models';
import * as fromTileGridReducer from '../../../reducers';

describe('Tile Preview Peer', () => {
  let fixture: ComponentFixture<TilePreviewPeerComponent>;
  let instance: TilePreviewPeerComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          tileGrid: combineReducers(fromTileGridReducer.reducers)
        }),
        NgbCarouselModule
      ],
      declarations: [
        TilePreviewPeerComponent, HumanizeNumberPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TilePreviewPeerComponent);
    instance = fixture.componentInstance;
  });

  it('should show component', () => {
    const tile = {
      ...generateMockChartTile(),
      Type: TileTypes.Peer,
      TilePreviewData: []
    };
    instance.model = generateTilePreviewPeerFromTile(tile);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
