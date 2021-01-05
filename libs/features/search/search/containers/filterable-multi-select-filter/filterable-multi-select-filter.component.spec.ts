import { ComponentFixture, TestBed } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {generateMockFilterableMultiSelectFilter} from 'libs/features/search/search/models';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

import {MultiSelectFilterComponent} from '../multi-select-filter';

describe('Search Feature - Filterable Multi Select Filter', () => {
  let instance: MultiSelectFilterComponent;
  let fixture: ComponentFixture<MultiSelectFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectFilterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromSearchReducer.reducers
        })
      ]
    });

    fixture = TestBed.createComponent(MultiSelectFilterComponent);
    instance = fixture.componentInstance;
  });

  it('should emit an object with a filterId and an option when handling an option selected', () => {
    const mockMultiSelectFilter = generateMockFilterableMultiSelectFilter();
    const filterIdAndOption = { filterId: '23094', option: mockMultiSelectFilter.Options[0]};
    spyOn(instance.optionSelected, 'emit');

    instance.filter = mockMultiSelectFilter;
    instance.handleOptionSelected(filterIdAndOption.filterId, mockMultiSelectFilter.Options[0]);

    expect(instance.optionSelected.emit).toHaveBeenCalledWith(filterIdAndOption);
  });
});
