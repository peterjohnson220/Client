import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
});
