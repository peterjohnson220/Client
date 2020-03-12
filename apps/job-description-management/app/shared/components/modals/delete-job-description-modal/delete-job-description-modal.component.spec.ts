import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { StoreModule } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteJobDescriptionModalComponent } from '.';

describe('DeleteModalComponent', () => {
  let fixture: ComponentFixture<DeleteJobDescriptionModalComponent>;
  let component: DeleteJobDescriptionModalComponent;

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
        DeleteJobDescriptionModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DeleteJobDescriptionModalComponent]
      }
    });

    fixture = TestBed.createComponent(DeleteJobDescriptionModalComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
