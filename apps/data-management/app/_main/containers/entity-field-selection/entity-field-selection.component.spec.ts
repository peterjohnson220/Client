import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';

import {Store} from '@ngrx/store';
import {provideMockStore} from '@ngrx/store/testing';

import {OrgDataEntityType} from 'libs/constants/hris-api';

import {generateMockPayfactorsEntityFields } from '../../models';
import * as fromFieldMappingReducer from '../../reducers';

import { EntityFieldSelectionComponent } from './entity-field-selection.component';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFieldMappingReducers from '../../reducers/field-mapping.reducer';
import * as fromTransferScheduleReducers from '../../reducers/transfer-schedule.reducer';

describe('EntityFieldSelectionComponent', () => {
  let instance: EntityFieldSelectionComponent;
  let fixture: ComponentFixture<EntityFieldSelectionComponent>;
  let store: Store<fromFieldMappingReducer.State>;

  const initialState = { data_management: {
      transferSchedule: fromTransferScheduleReducers.initialState,
      fieldMappingPage: fromFieldMappingReducers.initialState
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [ EntityFieldSelectionComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(EntityFieldSelectionComponent);
    instance = fixture.componentInstance;

    instance.entityType = OrgDataEntityType.Employees;
    instance.payfactorsFields = generateMockPayfactorsEntityFields(OrgDataEntityType.Employees);

    fixture.detectChanges();
  }));

  it('should filter payfactors list when searching', () => {

    instance.handleSearchTermChanged('name', 'payfactors');

    expect(instance.filteredPayfactorsFields.length).toBeGreaterThan(0);
  });

  it('should dispatch an action when removing an association from a payfactors entity', () => {
    instance.payfactorsFields[0].IsRequired = false;
    const entityToRemove = instance.payfactorsFields[0];
    const expectedAction = new fromFieldMappingActions.RemoveAssociatedEntity({entity: entityToRemove, entityType: 'Employees', payfactorsEntityIndex: 0});

    spyOn(store, 'dispatch');

    instance.removeAssociatedItem(0, entityToRemove);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action when adding an association to a payfactors entity', () => {
    const entityToAdd = instance.payfactorsFields[0];
    const expectedAction = new fromFieldMappingActions.AddAssociatedEntity({entity: entityToAdd, entityType: 'Employees', payfactorsEntityId: 0});

    spyOn(store, 'dispatch');

    instance.addAssociatedItem(0, entityToAdd);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
