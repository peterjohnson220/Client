import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { GuidelinesBadgeComponent } from './guidelines-badge.component';
import { DojGuidelinesService } from '../../services/doj-guidelines.service';
import { ActivatedRoute } from '@angular/router';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

class DojGuidelinesStub {
  passing = true;
  noDominatingData = true;

  get passesGuidelines(): boolean {
    return this.passing;
  }

  get hasNoDominatingData(): boolean {
    return this.noDominatingData;
  }
}

describe('Legacy Content - Peer - Guidelines Badge Component', () => {
  let fixture: ComponentFixture<GuidelinesBadgeComponent>;
  let instance: GuidelinesBadgeComponent;
  let guidelinesService: DojGuidelinesStub;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GuidelinesBadgeComponent
      ],
      providers: [
        { provide: DojGuidelinesService, useClass: DojGuidelinesStub}
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(GuidelinesBadgeComponent);
    instance = fixture.componentInstance;

    // TODO: Resolve type mismatch here and use .inject
    guidelinesService = TestBed.get(DojGuidelinesService);
    guidelinesService.passing = true;
  });

  it(`should NOT display failing label when passingGuidelines is true`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display failing label when passingGuidelines is false', () => {
    guidelinesService.passing = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display warning label when hasNoDominatingData is false and passingGuidelines is true', () => {
    guidelinesService.noDominatingData = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
