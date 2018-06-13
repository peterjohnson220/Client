import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ManageExchangeSectionHeaderComponent } from './manage-exchange-section-header.component';

describe('Manage Exchange Section Header', () => {
  let fixture: ComponentFixture<ManageExchangeSectionHeaderComponent>;
  let instance: ManageExchangeSectionHeaderComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule( {
      declarations: [
        ManageExchangeSectionHeaderComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ManageExchangeSectionHeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should provide correct values to the pf-manage-exchange-section-header', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
