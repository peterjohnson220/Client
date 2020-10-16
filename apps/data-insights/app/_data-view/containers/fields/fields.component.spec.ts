import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { generateMockField } from 'libs/features/formula-editor';
import * as fromFieldsActions from 'libs/features/formula-editor/actions/fields.actions';

import * as fromDataInsightsMainReducer from '../../reducers';
import { FieldsComponent } from './fields.component';

describe('Data Insights - Fields Comopnent', () => {
  let instance: FieldsComponent;
  let fixture: ComponentFixture<FieldsComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers)
        }),
        DragulaModule.forRoot()
      ],
      declarations: [ FieldsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FieldsComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  it('should dispatch a removeSelectedField action when handling field removal', () => {
    const field = generateMockField();
    const expectedAction = new fromFieldsActions.RemoveSelectedField(field);

    spyOn(store, 'dispatch');
    instance.handleFieldRemoved(field);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ReorderFields action when handling fields reordering', () => {
    const fields = [ generateMockField() ];
    const expectedAction = new fromFieldsActions.ReorderFields(fields);

    spyOn(store, 'dispatch');
    instance.handleFieldsReordered(fields, 1);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch AddSelectedField with correct field when handling field added', () => {
    const field = generateMockField();
    const expectedAction = new fromFieldsActions.AddSelectedField(field);

    spyOn(store, 'dispatch');
    instance.handleFieldAdded(field);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch UpdateDisplayName with correct data when handling display name updated', () => {
    const field = generateMockField();
    const displayName = 'Job Title Update';
    const expectedAction = new fromFieldsActions.UpdateDisplayName({ field, displayName });

    spyOn(store, 'dispatch');
    instance.handleDisplayNameUpdated(field, displayName);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
