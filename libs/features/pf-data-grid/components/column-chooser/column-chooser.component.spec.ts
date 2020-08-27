import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';
import { generateMockViewField } from 'libs/models/payfactors-api/index';
import { FilterArrayByName } from 'libs/core/pipes';

import { ColumnChooserComponent } from './column-chooser.component';
import { ColumnChooserType } from '../../models';

describe('Common UI - PF Grid - Column Chooser Popover', () => {
  let instance: ColumnChooserComponent;
  let fixture: ComponentFixture<ColumnChooserComponent>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [
        ColumnChooserComponent, FilterArrayByName
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ColumnChooserComponent);
    instance = fixture.componentInstance;

    modal = TestBed.inject(NgbModal);
  });

  it('should emit array of PfGridColumns and close the popover, when calling saveButtonClicked', () => {
    spyOn(instance.saveColumns, 'emit');
    spyOn(instance.p, 'close');
    instance.columnChooserType = ColumnChooserType.Column;

    const mockedListAreaColumns = [generateMockViewField(1), generateMockViewField(2)];

    instance.listAreaColumns = cloneDeep(mockedListAreaColumns);
    instance.p = { close: jest.fn() };

    instance.saveButtonClicked();

    expect(instance.saveColumns.emit).toHaveBeenLastCalledWith(mockedListAreaColumns);
    expect(instance.p.close).toHaveBeenCalled();
  });
});
