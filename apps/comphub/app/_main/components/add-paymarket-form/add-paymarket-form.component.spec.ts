import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownListModule, AutoCompleteModule } from '@progress/kendo-angular-dropdowns';

import { AddPayMarketFormComponent } from './add-paymarket-form.component';
import { AddPayMarketFormData, generateMockMarketDataScope } from '../../models';

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

  it('should emit saveClick event when handling submit clicked', () => {
    spyOn(instance.saveClick, 'emit');
    instance.marketDataScope = generateMockMarketDataScope();

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

    instance.handleSaveClicked();

    expect(instance.saveClick.emit).toHaveBeenCalledWith(expectedData);
  });

  it('should emit skipClick event when handling skip clicked', () => {
    spyOn(instance.skipClick, 'emit');

    instance.handleSkipClicked();

    expect(instance.skipClick.emit).toHaveBeenCalled();
  });

  it('should return up to 5 locations when handling location filter', () => {
    instance.marketDataScope = generateMockMarketDataScope();

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

  it('should emit dismissInfoBannerClick event when handling dismiss info banner', () => {
    spyOn(instance.dismissInfoBannerClick, 'emit');

    instance.handleDismissInfoBanner();

    expect(instance.dismissInfoBannerClick.emit).toHaveBeenCalled();
  });

  it('should emit cancelClick event when cancel button clicked', () => {
    spyOn(instance.cancelClick, 'emit');

    instance.handleCancelClicked();

    expect(instance.cancelClick.emit).toHaveBeenCalled();
  });

  it('should use All for location when submitting invalid location', () => {
    spyOn(instance.saveClick, 'emit');
    instance.marketDataScope = generateMockMarketDataScope();

    instance.addPayMarketForm.patchValue({
      name: 'Pay Market Name',
      location: 'The moon',
      industry: { Name: 'Software', Value: 'Software' },
      size: { Name: '100 - 500', Value: '100 - 500' },
      country: instance.defaultCountry,
      currency: instance.defaultCurrency
    });

    const expectedData: AddPayMarketFormData = {
      Name: 'Pay Market Name',
      Location: 'All',
      Industry: 'Software',
      Size: '100 - 500',
      Country: 'USA',
      Currency: 'USD'
    };

    instance.handleSaveClicked();

    expect(instance.saveClick.emit).toHaveBeenCalledWith(expectedData);
  });

  it('should use default values for Industry and Size when none is selected', () => {
    spyOn(instance.saveClick, 'emit');
    instance.marketDataScope = generateMockMarketDataScope();

    instance.addPayMarketForm.patchValue({
      name: 'Pay Market Name',
      location: 'The moon',
      industry: {},
      size: {},
      country: instance.defaultCountry,
      currency: instance.defaultCurrency
    });

    const expectedData: AddPayMarketFormData = {
      Name: 'Pay Market Name',
      Location: 'All',
      Industry: 'All',
      Size: 'All',
      Country: 'USA',
      Currency: 'USD'
    };

    instance.handleSaveClicked();

    expect(instance.saveClick.emit).toHaveBeenCalledWith(expectedData);
  });
});
