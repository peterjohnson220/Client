import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal.component';
import { CompanyResourceFolder } from '../../models';

describe('DeleteModalComponent', () => {
  let fixture: ComponentFixture<DeleteModalComponent>;
  let component: DeleteModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      providers: [
        NgbActiveModal
    ],
      declarations: [
        DeleteModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DeleteModalComponent]
      }
    });

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should detect resource type upon ngOnInit', () => {
    const resource: CompanyResourceFolder = {
      CompanyId: 1,
      CompanyResources: [],
      CompanyResourcesFoldersId: 1,
      CreateDate: new Date(),
      CreateUser: 1,
      FolderName: 'Test Folder'
    };

    component.resource = resource;
    component.ngOnInit();
    expect(component.isFolder).toBeTruthy();
  });
});
