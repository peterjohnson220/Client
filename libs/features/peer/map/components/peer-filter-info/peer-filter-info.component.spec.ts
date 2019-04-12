import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { PeerFilterInfoComponent } from './peer-filter-info.component';

describe('Feature - Peer - Pay Market Filter Info Component', () => {
  let fixture: ComponentFixture<PeerFilterInfoComponent>;
  let instance: PeerFilterInfoComponent;

  // Configure Testing Module before each test
  beforeEach(() => {
    TestBed.configureTestingModule( {
      declarations: [
        PeerFilterInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PeerFilterInfoComponent);
    instance = fixture.componentInstance;
  });

  it('should provide correct values to the pf-peer-filter-info component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it( 'should emit a resetAllFiltersClicked event when handling ResetFiltersLinkClicked', () => {
    spyOn(instance.resetAllFiltersClicked, 'emit');

    instance.handleResetFiltersLinkClicked();

    expect(instance.resetAllFiltersClicked.emit).toHaveBeenCalled();
  });
});
