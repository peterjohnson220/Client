import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsPanelComponent } from './settings-panel.component';

import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';
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
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not class the container as `expanded` when in a closed state', () => {
    // arrange
    component.isOpen = false;

    // act
    fixture.detectChanges();

    // assert
    const container = fixture.debugElement.nativeElement.querySelector('aside.settings-panel');
    expect(container.classList.contains('expanded')).toBeFalsy();
  });

  it('should class the container as `expanded` when in an open state', () => {
    // arrange
    component.isOpen = true;

    // act
    fixture.detectChanges();

    // assert
    const container = fixture.debugElement.nativeElement.querySelector('aside.settings-panel');
    expect(container.classList.contains('expanded')).toBeTruthy();
  });

  it('should emit when the close button is clicked', () => {
    // arrange
    spyOn(component.close, 'emit');
    component.isOpen = true;

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
    component.isOpen = true;

    // act
    fixture.detectChanges();
    const resetSettings = fixture.debugElement.nativeElement.querySelector('a.reset-settings');
    resetSettings.click();

    // assert
    expect(component.resetSettings.emit).toHaveBeenCalledTimes(1);
  });

  it('should show the Font Family menu when enabled', () => {
    // arrange
    component.isOpen = true;
    component.showFontFamilyMenu = true;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent.indexOf('Font Family')).toBeGreaterThan(-1);
  });

  it('should hide the Font Family menu when disabled', () => {
    // arrange
    component.isOpen = true;
    component.showFontFamilyMenu = false;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.textContent.indexOf('Font Family')).toBe(-1);
  });
});
