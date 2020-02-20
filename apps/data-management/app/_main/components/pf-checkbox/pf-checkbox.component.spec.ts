import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfCheckboxComponent } from './pf-checkbox.component';

describe('PfCheckboxComponent', () => {
  let component: PfCheckboxComponent;
  let fixture: ComponentFixture<PfCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PfCheckboxComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(PfCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component.valueChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on change', () => {
    component.isChecked = false;
    component.valueChanged();
    fixture.detectChanges();
    expect(component.valueChange.emit).toHaveBeenCalledWith(true);
  });

  it('should not emit on disabled checkbox', () => {
    component.isChecked = true;
    component.isDisabled = true;
    component.valueChanged();
    fixture.detectChanges();
    expect(component.valueChange.emit).toHaveBeenCalledTimes(0);
  });

});
