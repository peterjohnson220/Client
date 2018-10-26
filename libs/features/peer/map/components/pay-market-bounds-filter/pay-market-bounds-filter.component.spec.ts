import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import spyOn = jest.spyOn;

import { generateMockPayMarket } from 'libs/models';

import { PayMarketBoundsFilterComponent } from './pay-market-bounds-filter.component';

describe('Features - Peer - Pay Market Bounds Filter', () => {
  let fixture: ComponentFixture<PayMarketBoundsFilterComponent>;
  let instance: PayMarketBoundsFilterComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Even though we are doing shallow testing a weird error will occur with the kendo switch because one of
        // its inputs is prefixed with 'on'. Need to import the module to get the template to parse. [BC]
        SwitchModule
      ],
      declarations: [
        PayMarketBoundsFilterComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PayMarketBoundsFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should build a paymarket bounds filter label with \'Metro\' appended when the GeoLabel is \'Metro\'', () => {
    const filterLabel = instance.buildLabel(generateMockPayMarket());
    expect(filterLabel.split(' ').slice(-2)[0]).toBe('Metro');
  });

  it('should build a paymarket bounds filter label with \'USA\' appended when the Country Code is \'USA\'', () => {
    const filterLabel = instance.buildLabel(generateMockPayMarket());
    expect(filterLabel.split(' ').slice(-1)[0]).toBe('USA');
  });

  it('should emit a limitToPayMarketToggled event when handling the switch toggle', () => {
    spyOn(instance.limitToPayMarketToggled, 'emit');

    instance.handleSwitchToggled();

    expect(instance.limitToPayMarketToggled.emit).toHaveBeenCalled();
  });
});
