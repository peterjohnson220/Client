import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TileGridComponent } from './tile-grid.component';
import { TileService } from '../../services/index';

describe('tile-grid', () => {
  let fixture: ComponentFixture<TileGridComponent>;
  let instance: TileGridComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TileGridComponent
      ],
      providers: [TileService],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TileGridComponent);
    instance = fixture.componentInstance;
  });

  it('should show tiles when tile service is provided', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
