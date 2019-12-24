import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromTotalRewardsReducer from '../../reducers';
import { CreateNewStatementModalComponent } from './create-new-statement-modal.component';

describe('NewStatementModalComponent', () => {
  let component: CreateNewStatementModalComponent;
  let fixture: ComponentFixture<CreateNewStatementModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          totalRewards: combineReducers(fromTotalRewardsReducer.reducers)
        }),
        ReactiveFormsModule],
      declarations: [ CreateNewStatementModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewStatementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
