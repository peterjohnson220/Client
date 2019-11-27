import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { NewFolderModalComponent } from './new-folder-modal.component';
import { StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('NewFolderModalComponent', () => {
  let fixture: ComponentFixture<NewFolderModalComponent>;
  let component: NewFolderModalComponent;

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
        NewFolderModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NewFolderModalComponent]
      }
    });

    fixture = TestBed.createComponent(NewFolderModalComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should not accept null or whitespace for folder name', () => {
    component.ngOnInit();
    const folderName = new FormControl('Test');
    expect(component.validateFolderName(folderName)).toBeNull();

    folderName.setValue(' ');
    const result = component.validateFolderName(folderName);
    expect(result.isNullOrWhiteSpace).toBeTruthy();
  });
});
