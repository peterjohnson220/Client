import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterArrayByName } from 'libs/core/pipes';

import { generateMockDataListItem } from '../../models';
import { DataListCardComponent } from './data-list-card.component';


describe('Pf-Admin - Utilities - Data List Card', () => {
  let instance: DataListCardComponent;
  let fixture: ComponentFixture<DataListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DataListCardComponent, FilterArrayByName ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataListCardComponent);
    instance = fixture.componentInstance;
  });

  it('Should emit that an item was clicked with the value, when handling a company click', () => {
    spyOn(instance.itemClicked, 'emit');
    const dataListItem = generateMockDataListItem();

    instance.handleCompanyClicked(dataListItem);

    expect(instance.itemClicked.emit).toHaveBeenCalledWith(dataListItem);
  });

  it('Should emit that the filter has changed with the value when handling the search term changing', () => {
    spyOn(instance.filterChanged, 'emit');
    const searchTerm = 'blah';

    instance.handleSearchTermChanged(searchTerm);

    expect(instance.filterChanged.emit).toHaveBeenCalledWith(searchTerm);
  });

  it('Should set the filter when handling the search term changing', () => {
    const searchTerm = 'blah';

    instance.handleSearchTermChanged(searchTerm);

    expect(instance.filter).toBe(searchTerm);
  });

  it('Should track items by the data list items Id', () => {
    const dataListItem = generateMockDataListItem();

    const tracking = instance.trackByFn(dataListItem, 1);

    expect(tracking).toBe(dataListItem.Id);
  });
});
