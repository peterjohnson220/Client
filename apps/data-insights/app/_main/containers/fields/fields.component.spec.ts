import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromDataInsightsMainReducer from '../../reducers';
import * as fromFieldsActions from '../../actions/fields.actions';
import { FieldsComponent } from './fields.component';
import { generateMockField } from '../../models';

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
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SettingsService, useClass: SettingsService }
      ]
    });

    fixture = TestBed.createComponent(FieldsComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

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
    instance.handleFieldsReordered(fields);

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
    const dataElementId = 1;
    const displayName = 'Job Title';
    const expectedAction = new fromFieldsActions.UpdateDisplayName({ dataElementId, displayName });

    spyOn(store, 'dispatch');
    instance.handleDisplayNameUpdated(dataElementId, displayName);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
