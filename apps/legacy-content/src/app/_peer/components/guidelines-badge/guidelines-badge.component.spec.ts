import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import spyOn = jest.spyOn;

import { GuidelinesBadgeComponent } from './guidelines-badge.component';
import { generateMockExchangeStatCompanyMakeup } from '../../../../../../../libs/models/peer';
import { By } from '@angular/platform-browser';

describe('Legacy Content - Peer - Guidelines Badge Component', () => {
  let fixture: ComponentFixture<GuidelinesBadgeComponent>;
  let instance: GuidelinesBadgeComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GuidelinesBadgeComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(GuidelinesBadgeComponent);
    instance = fixture.componentInstance;
  });

  it('should return false for hasMinimumCompanies when receiving less than the minCompanies', () => {
    instance.companies = [generateMockExchangeStatCompanyMakeup()];

    expect(instance.hasMinimumCompanies).toBe(false);
  });

  it('should return true for hasMinimumCompanies when receiving >= to the minCompanies', () => {
    instance.companies = Array(5).fill(generateMockExchangeStatCompanyMakeup());

    expect(instance.hasMinimumCompanies).toBe(true);
  });

  it('should return false for hasNoDominatingData when there is no companies >= dominatingPercentage', () => {
    instance.companies = [{...generateMockExchangeStatCompanyMakeup(), Percentage: 1}];

    expect(instance.hasNoDominatingData).toBe(false);
  });

  it('should return true for hasNoDominatingData when there is companies < dominatingPercentage', () => {
    instance.companies = [generateMockExchangeStatCompanyMakeup()];

    expect(instance.hasNoDominatingData).toBe(true);
  });

  it('should return company and formatted percentages for dominatingCompanies when there is companies >= dominatingPercentage', () => {
    const companyNameAndPercentage = {
      Company: 'MockCompany',
      Percentage: 55
    };

    instance.companies = [
      generateMockExchangeStatCompanyMakeup(),
      { ...generateMockExchangeStatCompanyMakeup(), Percentage: .55 }
    ];

    expect(instance.dominatingCompanies).toEqual([companyNameAndPercentage]);
  });
});
