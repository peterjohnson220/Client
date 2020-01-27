import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockMultiSelectFilter, generateMockMultiSelectOption,
  MultiSelectFilter } from 'libs/features/search/models';

import * as fromSaveFilterModalActions from '../../actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from '../../actions/user-filter-popover.actions';
import * as fromUserFilterActions from '../../actions/user-filter.actions';
import * as fromUserFilterReducer from '../../reducers';
import { UserFilterPopoverComponent } from './user-filter-popover.component';
import { UserFilterPopoverConfig, generateMockSavedFilter } from '../../models';

describe('User Filter Feature - Saved Filters Popover', () => {
  let fixture: ComponentFixture<UserFilterPopoverComponent>;
  let instance: UserFilterPopoverComponent;
  let store: Store<fromUserFilterReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_userfilter: combineReducers(fromUserFilterReducer.reducers),
        })
      ],
      declarations: [
        UserFilterPopoverComponent
      ],
      providers: [
        {provide: UserFilterPopoverConfig, useValue: {}}
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(UserFilterPopoverComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch an CreateSavedFilter action if we can save filters, when handling a save click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSaveFilterModalActions.CreateSavedFilter();
    instance.hasFiltersToSave = true;
    instance.hasSelectedSavedFilter = false;

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing if we can\'t save filters, when handling a save click', () => {
    spyOn(store, 'dispatch');
    instance.hasFiltersToSave = true;
    instance.hasSelectedSavedFilter = true;

    instance.handleSaveClicked();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should set filterIdToDelete when handling a delete button click', () => {
    const filterId = 'iamafilterid';

    instance.handleDeleteBtnClicked(filterId);

    expect(instance.filterIdToDelete).toEqual(filterId);
  });

  it('should unset filterIdToDelete when handling a cancel delete button click', () => {
    instance.filterIdToDelete = 'iamafilterid';

    instance.handleCancelDeleteClicked();

    expect(instance.filterIdToDelete.length).toEqual(0);
  });

  it('should dispatch a CloseSaveFilterModal action, when handling a dismiss of the save filter modal', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSaveFilterModalActions.CloseSaveModal();

    instance.handleSaveFilterModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should track saved filters by their Id', () => {
    const savedFilter = generateMockSavedFilter();

    expect(instance.trackByFilterId(0, savedFilter)).toBe(savedFilter.Id);
  });

  it('should dispatch a SaveView action with a saveFilterObj, when handling a save filter event', () => {
    spyOn(store, 'dispatch');
    const saveFilterObj = {
      Name: 'Mercer 2018 Surveys',
      SetAsDefault: true,
      SearchFiltersToSave: [generateMockMultiSelectFilter()]
    };
    const expectedAction = new fromSaveFilterModalActions.Save(saveFilterObj);

    instance.handleSaveFilter(saveFilterObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleSavedFilterSelection action if its not to be deleted or edited, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const expectedAction = new fromUserFilterPopoverActions.ToggleSavedFilterSelection(savedFilter);
    instance.filterIdToDelete = '';
    savedFilter.Selected = false;

    instance.handleFilterClicked(savedFilter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a DeleteSavedFilter action if its not to be deleted and not selected, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    instance.filterIdToDelete = 'iamfilterid';
    const payload = { savedFilterId: instance.filterIdToDelete };
    const expectedAction = new fromUserFilterActions.Delete(payload);

    instance.handleDeleteFilterConfirmClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing if the filter is to be deleted, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const nonExpectedAction = new fromUserFilterPopoverActions.Select(savedFilter);
    instance.filterIdToDelete = savedFilter.Id;
    savedFilter.Selected = false;

    instance.handleFilterClicked(savedFilter);

    expect(store.dispatch).not.toHaveBeenCalledWith(nonExpectedAction);
  });

  it(`should set the filteredSavedFilters to be the savedFilters containing the lowerCased searchSavedFiltersValue,
      when handling the search value changed`, () => {
    const expectedFilteredValue = {...generateMockSavedFilter(), Name: 'Saved Filter Three'};
    store.dispatch(new fromUserFilterActions.GetSuccess([
      {...generateMockSavedFilter(), Name: 'Saved Filter One'},
      {...generateMockSavedFilter(), Name: 'Saved Filter Two'},
      expectedFilteredValue
    ]));

    instance.handleSearchValueChanged('filter three');

    expect(instance.filteredSavedFilters).toEqual([expectedFilteredValue]);
  });

  it('should return a preview string with comma separated multi selection option names, when getting the filter preview', () => {
    const savedFilter = generateMockSavedFilter();
    const savedFilterMultiSelect = <MultiSelectFilter>savedFilter.Filters[0];
    savedFilterMultiSelect.Options = [
      {...generateMockMultiSelectOption(), Name: 'Option 1'},
      {...generateMockMultiSelectOption(), Name: 'Option 2'},
      {...generateMockMultiSelectOption(), Name: 'Option 3'},
    ];
    const expectedPreviewString = 'Option 1, Option 2, Option 3';

    expect(instance.getFilterPreview(savedFilter)).toBe(expectedPreviewString);
  });

  it('should dispatch EditSavedFilter action when Edit button clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const editSavedFilterAction = new fromUserFilterPopoverActions.Edit(savedFilter);

    instance.handleEditBtnClicked(savedFilter);

    expect(store.dispatch).toHaveBeenCalledWith(editSavedFilterAction);
  });

  it('should dispatch OpenSavedFiltersPopover action when popover is shown', () => {
    spyOn(store, 'dispatch');
    const openSavedFiltersPopoverAction = new fromUserFilterPopoverActions.OpenPopover();

    instance.handlePopoverShown();

    expect(store.dispatch).toHaveBeenCalledWith(openSavedFiltersPopoverAction);
  });

  it('should know when we have a selected saved filter', () => {
    instance.hasSelectedSavedFilter = false;

    store.dispatch(new fromUserFilterActions.GetSuccess([generateMockSavedFilter()]));

    expect(instance.hasSelectedSavedFilter).toBe(true);
  });

});
