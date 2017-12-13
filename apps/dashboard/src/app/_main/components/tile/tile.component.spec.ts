import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TileComponent } from './tile.component';
import { Tile } from '../../models/tile.model';

describe('tile', () => {
  let fixture: ComponentFixture<TileComponent>;
  let instance: TileComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TileComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TileComponent);
    instance = fixture.componentInstance;
  });

  it('should show tile name and tile data', () => {

    const tile: Tile = {
      Id: 1,
      Name: 'test tile',
      Url: 'test tile url',
      Position: 0,
      Size: 2,
      CssClass: 'test cssClass',
      BgColor: 'test bgColor',
      TileData: ['test tile data']
    };

    instance.tile = tile;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
