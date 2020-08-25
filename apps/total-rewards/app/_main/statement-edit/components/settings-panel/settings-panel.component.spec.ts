import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPanelComponent } from './settings-panel.component';

describe('SettingsPanelComponent', () => {
  let component: SettingsPanelComponent;
  let fixture: ComponentFixture<SettingsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPanelComponent],
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
});
