import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';
import { generateMockListAreaColumn } from 'libs/models/common/list-area';

import * as fromJobDescriptionReducers from '../../../reducers';
import { ColumnSelectorPopoverComponent } from '../../index';
import { ListAreaColumnSearchPipe } from '../../../pipes';

describe('Job Description Management - Job Description - Column Selector Popover', () => {
  let instance: ColumnSelectorPopoverComponent;
  let fixture: ComponentFixture<ColumnSelectorPopoverComponent>;
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
        ColumnSelectorPopoverComponent, ListAreaColumnSearchPipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ColumnSelectorPopoverComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
  });

  it('should dispatch unSavedColumns and close the popover, when calling saveButtonClicked', () => {
    const mockedListAreaColumns = [generateMockListAreaColumn(1), generateMockListAreaColumn(2)];
    instance.listAreaColumns = cloneDeep(mockedListAreaColumns);
    instance.columnPopover = { close: jest.fn() };

    instance.saveButtonClicked();

    expect(instance.columnPopover.close).toHaveBeenCalled();
  });
});
