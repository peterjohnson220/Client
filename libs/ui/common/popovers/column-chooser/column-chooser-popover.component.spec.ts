import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromRootState from 'libs/state/state';
import { generateMockPfGridColumn } from 'libs/models/common/pf-grid';

import { ColumnChooserPopoverComponent } from './column-chooser-popover.component';

describe('Common UI - PF Grid - Column Chooser Popover', () => {
  let instance: ColumnChooserPopoverComponent;
  let fixture: ComponentFixture<ColumnChooserPopoverComponent>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule.forRoot(),
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        ColumnChooserPopoverComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ColumnChooserPopoverComponent);
    instance = fixture.componentInstance;

    modal = TestBed.get(NgbModal);
  });

  it('should emit array of PfGridColumns and close the popover, when calling saveButtonClicked', () => {
    spyOn(instance.saveColumns, 'emit');
    spyOn(instance.p, 'close');

    const mockedListAreaColumns = [generateMockPfGridColumn(1), generateMockPfGridColumn(2)];

    instance.ListAreaColumns = cloneDeep(mockedListAreaColumns);
    instance.p = { close: jest.fn() };

    instance.saveButtonClicked();

    expect(instance.saveColumns.emit).toHaveBeenLastCalledWith(mockedListAreaColumns);
    expect(instance.p.close).toHaveBeenCalled();
  });
});
