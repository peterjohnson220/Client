import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TileContainerComponent } from './tile-container.component';
import { TileService } from '../../../services';

describe('tile-container', () => {
  let fixture: ComponentFixture<TileContainerComponent>;
  let instance: TileContainerComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TileContainerComponent
      ],
      providers: [TileService],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TileContainerComponent);
    instance = fixture.componentInstance;
  });

  it('should show tiles when tile service is provided', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
