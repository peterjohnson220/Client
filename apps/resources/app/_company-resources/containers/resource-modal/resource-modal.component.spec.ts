import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { generateMockKendoUpload } from 'libs/models';
import { ResourceModalComponent } from './resource-modal.component';

describe('ResourceModalComponent', () => {
  let fixture: ComponentFixture<ResourceModalComponent>;
  let component: ResourceModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      providers: [
        FormBuilder,
        NgbActiveModal
    ],
      declarations: [
        ResourceModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ResourceModalComponent]
      }
    });

    fixture = TestBed.createComponent(ResourceModalComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should not accept null or whitespace for a resource name', () => {
    component.ngOnInit();
    const folderName = new FormControl('Test');
    expect(component.validateName(folderName)).toBeNull();

    folderName.setValue(' ');
    const result = component.validateName(folderName);
    expect(result.isNullOrWhiteSpace).toBeTruthy();
  });

  it('should not allow file upload until virus scan completed', () => {
    jest.spyOn(component.store, 'dispatch');
    component.ngOnInit();

    const mockFile = generateMockKendoUpload();
    component.uploadedFiles.push(mockFile);
    component.resourceForm.controls['resourceName'].setValue('mockResourceName');
    component.onFormSubmit();

    expect(component.isFormSubmitted).toBeTruthy();
    expect(component.store.dispatch).not.toHaveBeenCalled();
  });
});
