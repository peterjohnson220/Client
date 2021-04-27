import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SettingsPanelComponent } from './settings-panel.component';

import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { BrowserDetectionService } from 'libs/core';

describe('SettingsPanelComponent', () => {
  let component: SettingsPanelComponent;
  let fixture: ComponentFixture<SettingsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPanelComponent],
      providers: [BrowserDetectionService, {
        provide: AbstractFeatureFlagService,
        useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
      }],
      imports: [NgbNavModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not class the container as `expanded` when in a closed state', () => {
    // arrange
    component.isOpen$ = of(false);

    // act
    fixture.detectChanges();

    // assert
    const container = fixture.debugElement.nativeElement.querySelector('aside.settings-panel');
    expect(container.classList.contains('expanded')).toBeFalsy();
  });

  it('should class the container as `expanded` when in an open state', () => {
    // arrange
    component.isOpen$ = of(true);

    // act
    fixture.detectChanges();

    // assert
    const container = fixture.debugElement.nativeElement.querySelector('aside.settings-panel');
    expect(container.classList.contains('expanded')).toBeTruthy();
  });

  it('should emit when the close button is clicked', () => {
    // arrange
    spyOn(component.close, 'emit');
    component.isOpen$ = of(true);

    // act
    fixture.detectChanges();
    const close = fixture.debugElement.nativeElement.querySelector('a.close');
    close.click();

    // assert
    expect(component.close.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit when the reset button is clicked', () => {
    // arrange
    spyOn(component.resetSettings, 'emit');
    component.isOpen$ = of(true);

    // act
    fixture.detectChanges();
    const resetSettings = fixture.debugElement.nativeElement.querySelector('a.reset-settings');
    resetSettings.click();

    // assert
    expect(component.resetSettings.emit).toHaveBeenCalledTimes(1);
  });

  it('should show the Font Family menu when enabled', () => {
    // arrange
    component.isOpen$ = of(true);
    component.showFontFamilyMenu = true;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent.indexOf('Font Family')).toBeGreaterThan(-1);
  });

  it('should hide the Font Family menu when disabled', () => {
    // arrange
    component.isOpen$ = of(true);
    component.showFontFamilyMenu = false;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent.indexOf('Font Family')).toBe(-1);
  });

  it.each([[true, 'additionalPageHeading', true], [false, 'additionalPageBody', false]])
  ('feature flag enabled (%s) causes Additional Page section "%s" to display (%s)', (featureEnabled: boolean, featureId: string, expected: boolean) => {
    // arrange
    component.isOpen$ = of(true);
    component.focusedTab = 'Content';

    // act
    component.totalRewardsAdditionalPageFeatureFlag = { key: FeatureFlags.TotalRewardsAdditionalPage, value: featureEnabled };
    fixture.detectChanges();

    // assert
    const found = fixture.debugElement.nativeElement.querySelector('#' + featureId) !== null;
    expect(found).toBe(expected);
  });
});
