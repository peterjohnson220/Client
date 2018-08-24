import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockExchangeStatCompanyMakeup } from 'libs/models/peer';

import { GuidelinesBadgeComponent } from './guidelines-badge.component';

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

    // instance.guidelineLimits = { MinCompanies: 5, DominatingPercentage: .25 };
  });

  it('should return false for hasMinimumCompanies when receiving less than the minCompanies', () => {
    // instance.companies = [generateMockExchangeStatCompanyMakeup()];

    // TODO: stub Guidelines service and use snapshots to test display things.
    expect(false).toBe(false);
  });

});
