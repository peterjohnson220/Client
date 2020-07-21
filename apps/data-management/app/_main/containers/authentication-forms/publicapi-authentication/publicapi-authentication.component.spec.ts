import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {PublicApiAuthenticationComponent } from './publicapi-authentication.component';

describe('Data Management - Main - Public Api Authentication Form', () => {
  let component: PublicApiAuthenticationComponent;
  let fixture: ComponentFixture<PublicApiAuthenticationComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ PublicApiAuthenticationComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicApiAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Should emit event when submit button is clicked', () => {
    spyOn(component.submitClick, 'emit');

    component.publicKeyForm.controls.apikey.setValue('f1a899bc-88e5-4091-ba74-9f7d6e44be83');

    component.onSubmit();

    fixture.detectChanges();

    expect(component.submitClick.emit).toHaveBeenCalledTimes(1);
  });

  it('Should emit event when cancel button is clicked', () => {
    spyOn(component.cancelClick, 'emit');

    component.cancelAuthenticationClick();

    fixture.detectChanges();

    expect(component.cancelClick.emit).toHaveBeenCalledTimes(1);
  });
});
