import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromRootState from 'libs/state/state';
import { generateMockListAreaColumn } from 'libs/models/common/list-area';

import * as fromJobDescriptionReducers from '../reducers';
import { ColumnSelectorPopoverComponent } from '../components';
import { ListAreaColumnSearchPipe } from '../pipes';

describe('Job Description Management - Job Description - Column Selector Popover', () => {
  let instance: ColumnSelectorPopoverComponent;
  let fixture: ComponentFixture<ColumnSelectorPopoverComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule.forRoot(),
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [
        ColumnSelectorPopoverComponent, ListAreaColumnSearchPipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ColumnSelectorPopoverComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

  it('should emit checked column data, when calling columnChecked', () => {
    spyOn(instance.columnModified, 'emit');

    const mockedListAreaColumn = generateMockListAreaColumn();
    const mockedChecked = false;

    instance.columnChecked(mockedListAreaColumn, mockedChecked);

    const expectedEmitData = { listAreaColumn: mockedListAreaColumn, checked: mockedChecked };

    expect(instance.columnModified.emit).toHaveBeenLastCalledWith(expectedEmitData);
  });

  it('should emit array of List Area Columns and close the popover, when calling saveButtonClicked', () => {
    spyOn(instance.saveColumns, 'emit');
    spyOn(instance.p, 'close');

    const mockedListAreaColumns = [generateMockListAreaColumn(1), generateMockListAreaColumn(2)];

    instance.ListAreaColumns = cloneDeep(mockedListAreaColumns);
    instance.p = { close: jest.fn() };

    instance.saveButtonClicked();

    expect(instance.saveColumns.emit).toHaveBeenLastCalledWith(mockedListAreaColumns);
    expect(instance.p.close).toHaveBeenCalled();
  });
});
