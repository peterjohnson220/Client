import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { GuidelinesBadgeComponent } from './guidelines-badge.component';
import {DojGuidelinesService} from '../../services/doj-guidelines.service';


class DojGuidelinesStub {
  passing = true;

  get passesGuidelines(): boolean {
    return this.passing;
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

    guidelinesService = TestBed.get(DojGuidelinesService);
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

});
