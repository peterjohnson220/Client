import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrsEffectiveDateControlComponent } from './trs-effective-date-control.component';

describe('EffectiveDateComponent', () => {
  let component: TrsEffectiveDateControlComponent;
  let fixture: ComponentFixture<TrsEffectiveDateControlComponent>;

  beforeEach(async(() => {
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
