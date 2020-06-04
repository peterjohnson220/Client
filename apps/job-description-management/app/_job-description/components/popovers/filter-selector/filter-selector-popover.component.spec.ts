import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromRootState from 'libs/state/state';
import { generateMockCompositeFilter, generateMockJdmListFilter } from 'libs/models/user-profile';
import { generateMockListAreaColumns } from 'libs/models/common/list-area';

import * as fromJobDescriptionReducers from '../../../reducers';
import { FilterSelectorPopoverComponent } from '../../index';
import { ListAreaService } from '../../../../shared/services/list-area.service';
import { UserFilterSearchPipe } from '../../../pipes';

describe('Job Description Management - Job Description - Filter Selector Popover', () => {
  let instance: FilterSelectorPopoverComponent;
  let fixture: ComponentFixture<FilterSelectorPopoverComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [
        FilterSelectorPopoverComponent, UserFilterSearchPipe
      ],
      providers: [
        {
          provide: ListAreaService,
          useValue: new ListAreaService()
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterSelectorPopoverComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

  it('should return an empty string, when calling displayFilterDescription and no columns exist in listAreaColumns/customListAreaColumns',
    () => {
      instance.listAreaColumns = [];
      instance.customListAreaColumns = [];

      const mockedCompositeFilter = generateMockCompositeFilter();
      const result = instance.displayFilterDescription(mockedCompositeFilter);

      expect(result).toEqual('');
  });

  it('should return a filter description, when calling displayFilterDescription and columns exist in listAreaColumns/customListAreaColumns',
    () => {
    instance.listAreaColumns = generateMockListAreaColumns(2, 1);
    instance.customListAreaColumns = generateMockListAreaColumns(2, 3);

    const mockedCompositeFilter = generateMockCompositeFilter('Test Column Database Name');
    const result = instance.displayFilterDescription(mockedCompositeFilter);

    expect(result).toEqual('Test Column Display Name 1  Test Value 1 • Test Column Display Name 2  Test Value 2');
  });

  it('should do nothing, when calling selectFilter and attemptedDelete or deleting are true', () => {
    if (!instance.p) {
      return;
    }

    spyOn(instance.onFilterSelected, 'emit');
    spyOn(instance.p, 'close');

    instance.p = {close: jest.fn()};
    instance.attemptedDelete = true;
    instance.deleting = true;

    const mockedSelectedFilter = generateMockJdmListFilter();

    instance.selectFilter(mockedSelectedFilter);

    expect(instance.onFilterSelected.emit).toHaveBeenCalledTimes(0);
    expect(instance.p.close).toHaveBeenCalledTimes(0);
  });

  it('should emit selected filter data and close popover, when calling selectFilter and attemptedDelete and deleting are false', () => {
    if (!instance.p) {
      return;
    }

    spyOn(instance.onFilterSelected, 'emit');
    spyOn(instance.p, 'close');

    instance.p = { close: jest.fn() };
    instance.attemptedDelete = false;
    instance.deleting = false;

    const mockedSelectedFilter = generateMockJdmListFilter();

    instance.selectFilter(cloneDeep(mockedSelectedFilter));

    expect(instance.onFilterSelected.emit).toHaveBeenLastCalledWith(mockedSelectedFilter);
    expect(instance.p.close).toHaveBeenCalled();
  });

  it('should set preliminary values for filter deletion, when calling deleteFilter', () => {
    const mockedId = '1';

    instance.deleteFilter(mockedId);

    expect(instance.idDeleting).toEqual('1');
    expect(instance.attemptedDelete).toEqual(true);
  });

  it('should set attemptedDelete to false and then do nothing, when calling confirmDelete and idDeleting is null', () => {
    spyOn(instance.onDeleteConfirmed, 'emit');

    instance.attemptedDelete = true;
    instance.idDeleting = null;

    instance.confirmDelete();

    expect(instance.attemptedDelete).toEqual(false);
    expect(instance.onDeleteConfirmed.emit).toHaveBeenCalledTimes(0);
  });

  it('should set attemptedDelete to false and then emit the id to delete, when calling confirmDelete and idDeleting is not null', () => {
    spyOn(instance.onDeleteConfirmed, 'emit');

    instance.attemptedDelete = true;
    instance.idDeleting = '1';

    instance.confirmDelete();

    expect(instance.attemptedDelete).toEqual(false);
    expect(instance.onDeleteConfirmed.emit).toHaveBeenLastCalledWith('1');
    expect(instance.idDeleting).toEqual(null);
  });

  it('should reset attemptedDelete & idDeleting, when calling cancelDelete', () => {
    instance.cancelDelete();

    expect(instance.attemptedDelete).toEqual(false);
    expect(instance.idDeleting).toEqual(null);
  });
});
