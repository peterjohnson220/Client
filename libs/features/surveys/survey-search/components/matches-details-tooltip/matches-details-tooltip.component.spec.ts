import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MatchesDetailsTooltipComponent } from './matches-details-tooltip.component';

describe('Project - Survey Search - Matches Details Tooltip', () => {
  let instance: MatchesDetailsTooltipComponent;
  let fixture: ComponentFixture<MatchesDetailsTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesDetailsTooltipComponent ]
    });

    fixture = TestBed.createComponent(MatchesDetailsTooltipComponent);
    instance = fixture.componentInstance;
  });

  it('should reposition tooltip element when tooltip height is overlapped the window height', () => {
    const windowHeight = 678;
    const tooltipHeight = 242;
    const toolTipDebugElement: DebugElement  = fixture.debugElement.query(By.css('.tooltip-container'));
    const tooltipElement: HTMLElement = toolTipDebugElement.nativeElement;
    const updatedTopPx = 347;
    instance.tooltipTopPx = 579;
    instance.matchesDetails = [];
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
    instance.tooltipTopPx = 49;
    const updatedTopPx = 49;
    instance.matchesDetails = [];
    instance.updateTooltipElementTopPx(windowHeight, tooltipHeight);

    fixture.detectChanges();

    expect(instance.tooltipTopPx).toEqual(updatedTopPx);
    expect(tooltipElement.style.top).toEqual(`${instance.tooltipTopPx}px`);
  });
});
