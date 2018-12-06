import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromSavedFiltersActions from '../../actions/saved-filters.actions';
import * as fromAddDataReducer from '../../reducers';
import { SavedFiltersComponent } from './saved-filters.component';
import {
  generateMockMultiSelectFilter,
  generateMockMultiSelectOption, generateMockRangeFilter,
  generateMockSavedFilter,
  MultiSelectFilter
} from '../../models';

describe('Project - Add Data - Saved Filters', () => {
  let fixture: ComponentFixture<SavedFiltersComponent>;
  let instance: SavedFiltersComponent;
  let store: Store<fromAddDataReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_shared: combineReducers(fromAddDataReducer.reducers),
        })
      ],
      declarations: [
        SavedFiltersComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(SavedFiltersComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch an OpenSaveFilterModal action if we can save filters, when handling a save click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSavedFiltersActions.OpenSaveFilterModal();
    instance.canSaveFilters = true;

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing if we can\'t save filters, when handling a save click', () => {
    spyOn(store, 'dispatch');
    instance.canSaveFilters = false;

    instance.handleSaveClicked();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch a MarkFilterToDelete action with the filter Id, when handling a delete button click', () => {
    spyOn(store, 'dispatch');
    const filterId = 'iamafilterid';
    const expectedAction = new fromSavedFiltersActions.MarkFilterToDelete({filterId});

    instance.handleDeleteBtnClicked(filterId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a UnmarkFilterToDelete action, when handling a cancel delete button click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSavedFiltersActions.UnmarkFilterToDelete();

    instance.handleCancelDeleteClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CloseSaveFilterModal action, when handling a dismiss of the save filter modal', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSavedFiltersActions.CloseSaveFilterModal();

    instance.handleSaveFilterModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should track saved filters by their Id', () => {
    const savedFilter = generateMockSavedFilter();

    expect(instance.trackByFilterId(0, savedFilter)).toBe(savedFilter.Id);
  });

  it('should dispatch a SaveFilter action with a saveFilterObj, when handling a save filter event', () => {
    spyOn(store, 'dispatch');
    const saveFilterObj = { Name: 'Mercer 2018 Surveys', SetAsPayMarketDefault: true };
    const expectedAction = new fromSavedFiltersActions.SaveFilter(saveFilterObj);

    instance.handleSaveFilter(saveFilterObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ToggleSavedFilterSelection action if its not to be deleted or edited, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const expectedAction = new fromSavedFiltersActions.ToggleSavedFilterSelection(savedFilter);
    instance.filterIdToDelete = '';
    savedFilter.Selected = false;

    instance.handleFilterClicked(savedFilter);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a DeleteSavedFilter action if its not to be deleted and not selected, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSavedFiltersActions.DeleteSavedFilter();

    instance.handleDeleteFilterConfirmClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should do nothing if the filter is to be deleted, when handling a filter clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const nonExpectedAction = new fromSavedFiltersActions.SelectSavedFilter(savedFilter);
    store.dispatch(new fromSavedFiltersActions.MarkFilterToDelete({filterId: savedFilter.Id }));
    savedFilter.Selected = false;

    instance.handleFilterClicked(savedFilter);

    expect(store.dispatch).not.toHaveBeenCalledWith(nonExpectedAction);
  });

  it(`should set the filteredSavedFilters to be the savedFilters containing the lowerCased searchSavedFiltersValue,
      when handling the search value changed`, () => {
    const expectedFilteredValue = {...generateMockSavedFilter(), Name: 'Saved Filter Three'};
    store.dispatch(new fromSavedFiltersActions.GetSavedFiltersSuccess([
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

  it('should return a preview string for range filters, when getting the filter preview', () => {
    const savedFilter = generateMockSavedFilter();
    savedFilter.Filters = [generateMockRangeFilter()];
    const expectedPreviewString = '45000.0 - 90000.0';

    expect(instance.getFilterPreview(savedFilter)).toBe(expectedPreviewString);
  });

  it('should dispatch EditSavedFilter action when Edit button clicked', () => {
    spyOn(store, 'dispatch');
    const savedFilter = generateMockSavedFilter();
    const editSavedFilterAction = new fromSavedFiltersActions.EditSavedFilter(savedFilter);

    instance.handleEditBtnClicked(savedFilter);

    expect(store.dispatch).toHaveBeenCalledWith(editSavedFilterAction);
  });

  it('should dispatch OpenSavedFiltersPopover action when popover is shown', () => {
    spyOn(store, 'dispatch');
    const openSavedFiltersPopoverAction = new fromSavedFiltersActions.OpenSavedFiltersPopover();

    instance.handlePopoverShown();

    expect(store.dispatch).toHaveBeenCalledWith(openSavedFiltersPopoverAction);
  });

});
