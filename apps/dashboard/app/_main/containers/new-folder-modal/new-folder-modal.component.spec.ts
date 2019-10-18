import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFolderModalComponent } from './new-folder-modal.component';
import { StoreModule, Store } from '@ngrx/store';
import * as fromRootState from 'libs/state/state';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';


describe('NewFolderModalComponent', () => {
  let fixture: ComponentFixture<NewFolderModalComponent>;
  let instance: NewFolderModalComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      providers: [
        FormBuilder,
      {
        provide: ActivatedRoute
      }
    ],
      declarations: [
        NewFolderModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(NewFolderModalComponent);
    instance = fixture.componentInstance;
  });

  it('should call createSubscriptions upon Init', () => {
    spyOn(instance, 'createSubscriptions');

    instance.ngOnInit();

    expect(instance.createSubscriptions).toHaveBeenCalled();
  });

});
