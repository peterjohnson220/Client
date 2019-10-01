import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbDropdown, NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import {of} from 'rxjs';

import * as fromRootState from 'libs/state/state';
import {JobDescriptionTemplateApiService} from 'libs/data/payfactors-api/jdm';

import * as fromTemplateReducers from '../../../reducers';
import {NewTemplateModalComponent} from './new-template-modal.component';

import {
  ReactiveFormsModule,
  FormBuilder, FormsModule
} from '@angular/forms';

describe('Job Description Management - Templates - Template List - New Template Modal', () => {
  let instance = NewTemplateModalComponent;
  let fixture: ComponentFixture<NewTemplateModalComponent>;
  let store: Store<fromTemplateReducers.State>;
  let modal: NgbModal;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule.forRoot(),
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptionmanagement_templates: combineReducers(
            fromTemplateReducers.reducers
          ),
          FormsModule,
          ReactiveFormsModule
        })
      ],
      declarations: [
        NewTemplateModalComponent, NgbDropdown
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), close: jest.fn()}
        },
        {
          provide: JobDescriptionTemplateApiService,
          useValue: {exists: (name: string) => of(name === 'Test1')}
        }, FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(NewTemplateModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

  it('should not emit createTemplateComplete if template name exists', () => {
    fixture.detectChanges();
    instance.templateNameForm.controls.templateName.setValue('Test1');
    instance.templateName = 'Test1';
    instance.submit();
    expect(instance.templateName).toEqual('Test1');
    expect(instance.invalidTemplateName).toBeTruthy();
  });

  it('should emit createTemplateComplete if template name valid', () => {
    spyOn(instance.createTemplateComplete, 'emit');
    fixture.detectChanges();
    instance.templateNameForm.controls.templateName.setValue('Test2');
    instance.templateName = 'Test2';
    instance.submit();
    expect(instance.createTemplateComplete.emit).toHaveBeenCalled();
    expect(instance.invalidTemplateName).toBeFalsy();
  });

  it('templateNameForm validator should be used on template name', () => {
    fixture.detectChanges();
    // Length < 1
    instance.templateNameForm.controls.templateName.setValue('');
    expect(instance.templateNameForm.controls.templateName.valid).toBeFalsy();
    // Length > 50
    instance.templateNameForm.controls.templateName.setValue(
      '1234567890123456789012345678901234567890123456789012345');
    expect(instance.templateNameForm.controls.templateName.valid).toBeFalsy();
    // Template meets validator specifications
    instance.templateNameForm.controls.templateName.setValue('12345');
    expect(instance.templateNameForm.controls.templateName.valid).toBeTruthy();
  });

  it('should exit invalidTemplateName if template name changes', () => {
    fixture.detectChanges();
    instance.templateNameForm.controls.templateName.setValue('Test1');
    instance.templateName = 'Test1';
    instance.submit();
    expect(instance.templateName).toEqual('Test1');
    expect(instance.invalidTemplateName).toBeTruthy();
    instance.handleValueChanged('Test2');
    expect(instance.invalidTemplateName).toBeFalsy();
  });
});
