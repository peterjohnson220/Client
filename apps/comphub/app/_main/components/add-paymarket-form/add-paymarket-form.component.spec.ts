import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownListModule, AutoCompleteModule } from '@progress/kendo-angular-dropdowns';

import { AddPayMarketFormComponent } from './add-paymarket-form.component';
import { AddPayMarketFormData } from '../../models';

describe('Comphub - Main - Add Pay Market Form Component', () => {
  let instance: AddPayMarketFormComponent;
  let fixture: ComponentFixture<AddPayMarketFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayMarketFormComponent ],
      imports: [ FormsModule, ReactiveFormsModule, DropDownListModule, AutoCompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AddPayMarketFormComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit saveClick event when handling form submit', () => {
    spyOn(instance.saveClick, 'emit');

    instance.addPayMarketForm.patchValue({
      name: 'Pay Market Name',
      location: 'Boston, MA',
      industry: { Name: 'Software', Value: 'Software' },
      size: { Name: '100 - 500', Value: '100 - 500' },
      country: instance.defaultCountry,
      currency: instance.defaultCurrency
    });

    const expectedData: AddPayMarketFormData = {
      Name: 'Pay Market Name',
      Location: 'Boston, MA',
      Industry: 'Software',
      Size: '100 - 500',
      Country: 'USA',
      Currency: 'USD'
    };

    instance.submit();

    expect(instance.saveClick.emit).toHaveBeenCalledWith(expectedData);
  });

  it('should emit skipClick event when handling form dismiss', () => {
    spyOn(instance.skipClick, 'emit');

    instance.dismiss();

    expect(instance.skipClick.emit).toHaveBeenCalled();
  });

  it('should return up to 5 locations when handling location filter', () => {
    instance.marketDataScope = {
      Locations: [
        { Name: 'Aaronsburg, PA', Value: 'Aaronsburg, PA' },
        { Name: 'Abbeville, GA', Value: 'Abbeville, GA' },
        { Name: 'Boston, MA', Value: 'Boston, MA' },
        { Name: 'Burlington, MA', Value: 'Burlington, MA' },
        { Name: 'Bedford, MA', Value: 'Bedford, MA' },
        { Name: 'Groton, MA', Value: 'Groton, MA' },
        { Name: 'Acton, MA', Value: 'Acton, MA' },
        { Name: 'Littleton, MA', Value: 'Littleton, MA' },
        { Name: 'New York, NY', Value: 'New York, NY'}
      ],
      Sizes: [],
      Industries: []
    };

    const expectedResults = [
      { Name: 'Boston, MA', Value: 'Boston, MA' },
      { Name: 'Burlington, MA', Value: 'Burlington, MA' },
      { Name: 'Bedford, MA', Value: 'Bedford, MA' },
      { Name: 'Groton, MA', Value: 'Groton, MA' },
      { Name: 'Acton, MA', Value: 'Acton, MA' }
    ];

    instance.handleLocationFilter('MA');

    expect(instance.locations).toEqual(expectedResults);
  });

  it('should return results containing search term when handling industry filter', () => {
    instance.industries = [
      { Name: 'Aerospace & Defense', Value: 'Aerospace & Defense' },
      { Name: 'Capital Markets', Value: 'Capital Markets' },
      { Name: 'Commercial Banks', Value: 'Commercial Banks' },
      { Name: 'Commercial Services & Supplies', Value: 'Commercial Services & Supplies' },
      { Name: 'Credit Unions', Value: 'Credit Unions' },
      { Name: 'Internet Software & Services', Value: 'Internet Software & Services'}
    ];
    const expectedResults = [
      { Name: 'Commercial Services & Supplies', Value: 'Commercial Services & Supplies' },
      { Name: 'Internet Software & Services', Value: 'Internet Software & Services'}
    ];

    instance.handleIndustryFilter('Service');

    expect(instance.scopeIndustryData).toEqual(expectedResults);
  });
});
