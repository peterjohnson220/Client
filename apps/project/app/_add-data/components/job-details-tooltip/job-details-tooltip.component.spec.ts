import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { JobDetailsTooltipComponent } from './job-details-tooltip.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { generateMockPayfactorsJobResult, generateMockSurveyJobResult } from '../../models';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';

describe('JobDetailsTooltipComponent', () => {
  let instance: JobDetailsTooltipComponent;
  let fixture: ComponentFixture<JobDetailsTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[ NgbTooltipModule.forRoot() ],
      declarations: [ JobDetailsTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailsTooltipComponent);
    instance = fixture.componentInstance;
  });

  it('should display FLSA, Job Category, Scope and EEO when current job is Payfactors', () => {
    instance.job = generateMockPayfactorsJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display Survey Name when current job is not Payfactors and Survey Name is not empty', () => {
    instance.job = generateMockSurveyJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should reposition tooltip element when tooltip height is overlapped the window height', () => {
    const windowHeight = 678;
    const tooltipHeight = 242;
    const toolTipDebugElement: DebugElement  = fixture.debugElement.query(By.css('.tooltip-container'));
    const tooltipElement: HTMLElement = toolTipDebugElement.nativeElement;
    const updatedTopPx = 357;
    instance.tooltipTopPx = 579;
    instance.job = generateMockPayfactorsJobResult();
    instance.updateTooltipElementTopPx(windowHeight, tooltipHeight);

    fixture.detectChanges();

    expect(instance.tooltipTopPx).toEqual(updatedTopPx);
    expect(tooltipElement.style.top).toEqual(`${instance.tooltipTopPx}px`);
  });

  it('should not reposition tooltip element when tooltip height is not overlapped the window height', () => {
    const windowHeight = 678;
    const tooltipHeight = 148;
    const toolTipDebugElement: DebugElement  = fixture.debugElement.query(By.css('.tooltip-container'));
    const tooltipElement: HTMLElement = toolTipDebugElement.nativeElement;
    const updatedTopPx = 49;
    instance.tooltipTopPx = 49;
    instance.job = generateMockSurveyJobResult();
    instance.updateTooltipElementTopPx(windowHeight, tooltipHeight);

    fixture.detectChanges();

    expect(instance.tooltipTopPx).toEqual(updatedTopPx);
    expect(tooltipElement.style.top).toEqual(`${instance.tooltipTopPx}px`);
  });

  it('should reset job description scroll bar to top position', () => {
    const jobDescriptionElement: DebugElement = fixture.debugElement.query(By.css('.job-description'));
    instance.job = generateMockPayfactorsJobResult();

    instance.updateJobDescriptionScrollTop();
    fixture.detectChanges();

    expect(jobDescriptionElement.nativeElement.scrollTop).toEqual(0);
  });

  it('should reposition tooltip element when tooltip width is overlapped the container width', () => {
    const containerWidth = 749;
    const tooltipWidth = 398;
    const toolTipDebugElement: DebugElement  = fixture.debugElement.query(By.css('.tooltip-container'));
    const tooltipElement: HTMLElement = toolTipDebugElement.nativeElement;
    const updatedLeftPx = 331;
    instance.tooltipLeftPx = 384;
    instance.job = generateMockSurveyJobResult();

    instance.updateTooltipElementLeftPx(containerWidth, tooltipWidth);
    fixture.detectChanges();

    expect(instance.tooltipLeftPx).toEqual(updatedLeftPx);
    expect(tooltipElement.style.left).toEqual(`${instance.tooltipLeftPx}px`);
  });

  it('should not change tooltip element left position when tooltip width fits in the container width', () => {
    const containerWidth = 749;
    const tooltipWidth = 398;
    const toolTipDebugElement: DebugElement  = fixture.debugElement.query(By.css('.tooltip-container'));
    const tooltipElement: HTMLElement = toolTipDebugElement.nativeElement;
    const updatedLeftPx = 200;
    instance.tooltipLeftPx = 200;
    instance.job = generateMockSurveyJobResult();

    instance.updateTooltipElementLeftPx(containerWidth, tooltipWidth);
    fixture.detectChanges();

    expect(instance.tooltipLeftPx).toEqual(updatedLeftPx);
    expect(tooltipElement.style.left).toEqual(`${instance.tooltipLeftPx}px`);
  });

});
