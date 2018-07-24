import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { JobDetailsTooltipComponent } from './job-details-tooltip.component';
import { generateMockPayfactorsJobResult, generateMockSurveyJobResult } from '../../models';
import { DebugElement } from '@angular/core';

describe('JobDetailsTooltipComponent', () => {
  let instance: JobDetailsTooltipComponent;
  let fixture: ComponentFixture<JobDetailsTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailsTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobDetailsTooltipComponent);
    instance = fixture.componentInstance;
  });

  it('should display FLSA, Job Category and Scope when current job is Payfactors', () => {
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
    const updatedTopPx = 347;
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

});
