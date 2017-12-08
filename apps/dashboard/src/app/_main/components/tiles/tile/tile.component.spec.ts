import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TileComponent } from './tile.component';
import { Tile } from '../../../models/tile.model';

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

  it('should show correct tile values', () => {

    const tile: Tile = {
      id: 1,
      name: 'test tile',
      url: 'test tile url',
      position: 0,
      size: 2,
      cssClass: 'test cssClass',
      bgColor: 'test bgColor'
    };

    instance.tile = tile;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
