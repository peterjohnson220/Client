import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { PayMarketFilterInfoComponent } from './pay-market-filter-info.component';

describe('Feature - Peer - Pay Market Filter Info Component', () => {
  let fixture: ComponentFixture<PayMarketFilterInfoComponent>;
  let instance: PayMarketFilterInfoComponent;

  // Configure Testing Module before each test
  beforeEach(() => {
    TestBed.configureTestingModule( {
      declarations: [
        PayMarketFilterInfoComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PayMarketFilterInfoComponent);
    instance = fixture.componentInstance;
  });

  it('should provide correct values to the pf-pay-market-filter-info component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it( 'should emit a resetAllFiltersClicked event when handling ResetFiltersLinkClicked', () => {
    spyOn(instance.resetAllFiltersClicked, 'emit');

    instance.handleResetFiltersLinkClicked();

    expect(instance.resetAllFiltersClicked.emit).toHaveBeenCalled();
  });
});
