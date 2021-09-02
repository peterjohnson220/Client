import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SurveyLoaderTabComponent } from '../index';

describe('SurveyLoaderTabComponent', () => {
  let instance: SurveyLoaderTabComponent;
  let fixture: ComponentFixture<SurveyLoaderTabComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [SurveyLoaderTabComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    fixture = TestBed.createComponent(SurveyLoaderTabComponent);
    instance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should emit value when value is changed', function () {
    jest.spyOn(instance.updateSurveySheetNameEvent, 'emit');
    const value = 'test';
    instance.onChange(value);
    expect(instance.updateSurveySheetNameEvent.emit).toHaveBeenCalledWith(value);
  });

  it('should emit value when dropdown is removed', function () {
    jest.spyOn(instance.removeAdditionalDropdownEvent, 'emit');
    instance.onClick();
    expect(instance.removeAdditionalDropdownEvent.emit).toBeCalled();
  });
});
