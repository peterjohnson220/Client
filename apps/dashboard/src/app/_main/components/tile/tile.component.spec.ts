import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { TileComponent } from './tile.component';
import { generateMockTile } from '../../models';

describe('Tile', () => {
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
    instance.tile = generateMockTile();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
