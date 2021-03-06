import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrsEffectiveDateControlComponent } from './trs-effective-date-control.component';

describe('EffectiveDateComponent', () => {
  let component: TrsEffectiveDateControlComponent;
  let fixture: ComponentFixture<TrsEffectiveDateControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrsEffectiveDateControlComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrsEffectiveDateControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an `empty-date` class when no effective date is present', () => {
    // arrange
    component.controlData = {} as any;
    component.effectiveDate = null;
    component.showInformationEffectiveDate = true;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.field-wrapper.empty-date')).toBeTruthy();
  });

  it('should not show an `empty-date` class when an effective date is present', () => {
    // arrange
    component.controlData = {} as any;
    component.effectiveDate = new Date('5/21/2020');

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.field-wrapper.empty-date')).toBeFalsy();
  });

  it('should show a `invisible` class when showInformationEffectiveDate is false', () => {
    // arrange
    component.controlData = {} as any;
    component.effectiveDate = null;
    component.showInformationEffectiveDate = false;

    // act
    fixture.detectChanges();

    // assert
    expect(fixture.debugElement.nativeElement.querySelector('.invisible')).toBeTruthy();
  });
});
