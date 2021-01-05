import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActionsSubject, combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import * as fromRootState from 'libs/state/state';

import { NotesManagerComponent } from './notes-manager.component';
import { ApiServiceType } from '../constants/api-service-type-constants';

describe('NotesManagerComponent', () => {
  let component: NotesManagerComponent;
  let fixture: ComponentFixture<NotesManagerComponent>;
  let store: Store<fromReducer.State>;
  let actionSubject: ActionsSubject;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_notes_manager: combineReducers(fromReducer.reducers),
        })
      ],
      providers: [
      ],
      declarations: [
        NotesManagerComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    actionSubject = TestBed.inject(ActionsSubject);

    spyOn(store, 'dispatch'); // place a spy on the dispatch method

    // get instance from TestFixture
    fixture = TestBed.createComponent(NotesManagerComponent);
    component = fixture.componentInstance;

  });

  it('Should dispatch GetNotes when a configuration changes and that config has EntityId', () => {
    const expectedAction = new fromActions.GetNotes(999);

    component.ngOnChanges({
      entityId: {
        previousValue: null,
        currentValue: 999,
        firstChange: null,
        isFirstChange(): boolean { return true; }
      }
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch LoadApiService when a configuration changes and that config has an ApiServiceIndicator', () => {
    const expectedAction = new fromActions.LoadApiService(ApiServiceType.CompanyJobs);

    component.ngOnChanges({
      apiServiceIndicator: {
        previousValue: null,
        currentValue: ApiServiceType.CompanyJobs,
        firstChange: null,
        isFirstChange(): boolean { return true; }
      }
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
