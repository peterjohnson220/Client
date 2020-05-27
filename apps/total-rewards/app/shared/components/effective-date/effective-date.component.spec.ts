import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectiveDateComponent } from './effective-date.component';
import { StatementModeEnum } from '../../models';

describe('EffectiveDateComponent', () => {
  let component: EffectiveDateComponent;
  let fixture: ComponentFixture<EffectiveDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EffectiveDateComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectiveDateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an `edit-mode` class when mode is edit', () => {
    // arrange
    component.mode = StatementModeEnum.Edit;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.edit-mode')).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.preview-mode')).toBeFalsy();
  });

  it('should show a `preview-mode` class when mode is preview', () => {
    // arrange
    component.mode = StatementModeEnum.Preview;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.preview-mode')).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.edit-mode')).toBeFalsy();
  });

  it('should show an `empty-date` class when no effective date is present', () => {
    // arrange
    component.effectiveDate = null;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.field-wrapper.empty-date')).toBeTruthy();
  });

  it('should not show an `empty-date` class when an effective date is present', () => {
    // arrange
    component.effectiveDate = new Date('5/21/2020');

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.field-wrapper.empty-date')).toBeFalsy();
  });
});
