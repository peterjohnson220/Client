import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import spyOn = jest.spyOn;

import { ExcludeIndirectMatchesFilterComponent } from './exclude-indirect-matches-filter.component';

describe('Features - Peer - Exclude Indirect Matches Filter', () => {
  let fixture: ComponentFixture<ExcludeIndirectMatchesFilterComponent>;
  let instance: ExcludeIndirectMatchesFilterComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Even though we are doing shallow testing a weird error will occur with the kendo switch because one of
        // its inputs is prefixed with 'on'. Need to import the module to get the template to parse. [BC]
        SwitchModule
      ],
      declarations: [
        ExcludeIndirectMatchesFilterComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ExcludeIndirectMatchesFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should display appropriate label', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should emit a filterToggled event when handling the switch toggle', () => {
    spyOn(instance.filterToggled, 'emit');

    instance.handleSwitchToggled();

    expect(instance.filterToggled.emit).toHaveBeenCalled();
  });
});
