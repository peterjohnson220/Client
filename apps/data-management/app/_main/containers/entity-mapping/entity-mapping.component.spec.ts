import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import { DragulaModule } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { OrgDataEntityType } from 'libs/constants';
import { generateMockConverterSettings } from 'libs/models';

import * as fromFieldMappingReducer from '../../reducers';
import * as fromFieldMappingActions from '../../actions/field-mapping.actions';
import * as fromFConverterSettingsActions from '../../actions/converter-settings.actions';
import { generateMockProviderEntityFields, generateMockPayfactorsEntityFields } from '../../models';

import { EntityMappingComponent } from './entity-mapping.component';


describe('Data Management - Main - Entity Mapping Component', () => {
  let instance: EntityMappingComponent;
  let fixture: ComponentFixture<EntityMappingComponent>;
  let store: Store<fromFieldMappingReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          fieldMappingPage: combineReducers(fromFieldMappingReducer.reducers),
        }),
        DragulaModule.forRoot()
      ],
      declarations: [
        EntityMappingComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(EntityMappingComponent);
    instance = fixture.componentInstance;

    instance.entityType = OrgDataEntityType.Employees;
    instance.providerFields = generateMockProviderEntityFields(OrgDataEntityType.Employees);
    instance.payfactorsFields = generateMockPayfactorsEntityFields(OrgDataEntityType.Employees);
    instance.provider = '';

    fixture.detectChanges();
  });

  it('should filter provider list when searching and not payfactors list', () => {

    instance.handleSearchTermChanged('name', 'provider');

    expect(instance.filteredProviderFields.length).toBeGreaterThan(0);
    expect(instance.filteredPayfactorsFields.length).toEqual(0);
  });

  it('should filter payfactors list when searching and not providers list', () => {

    instance.handleSearchTermChanged('name', 'payfactors');

    expect(instance.filteredPayfactorsFields.length).toBeGreaterThan(0);
    expect(instance.filteredProviderFields.length).toEqual(0);
  });

  it('should dispatch an action when removing an association from a payfactors entity', () => {
    const entityToRemove = instance.providerFields[0];
    const expectedAction = new fromFieldMappingActions.RemoveAssociatedEntity({entity: entityToRemove, entityType: 'Employees', payfactorsEntityIndex: 0});

    spyOn(store, 'dispatch');

    instance.removeAssociatedItem(0, entityToRemove);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action when adding an association to a payfactors entity', () => {
    const entityToAdd = instance.providerFields[0];
    const expectedAction = new fromFieldMappingActions.AddAssociatedEntity({entity: entityToAdd, entityType: 'Employees', payfactorsEntityId: 0});

    spyOn(store, 'dispatch');

    instance.addAssociatedItem(0, entityToAdd);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action when dateformat dropdown changes', () => {
    const mockConverterSetting = generateMockConverterSettings();
    const expectedAction = new fromFConverterSettingsActions.AddConverterSetting({converterSetting: mockConverterSetting});

    spyOn(store, 'dispatch');

    instance.onDateFormatSelected('yyyy-MM-ddzzz');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);

  });
});
