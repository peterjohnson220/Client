import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../../reducers';
import { BulkExportPopoverComponent } from '../../index';
import { generateMockControlLabel } from 'libs/features/jobs/job-description-management/models/control-label.model';

describe('Job Description Management - Job Description - Bulk Export Popover', () => {
  let instance: BulkExportPopoverComponent;
  let fixture: ComponentFixture<BulkExportPopoverComponent>;
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
        BulkExportPopoverComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(BulkExportPopoverComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
  });

  it('should call exportLogic and then close the popover, when calling export', () => {
    spyOn(instance, 'exportLogic').and.callFake(jest.fn());
    spyOn(instance.p, 'close');

    instance.p = { close: jest.fn() };

    instance.export();

    expect(instance.exportLogic).toHaveBeenCalled();
    expect(instance.p.close).toHaveBeenCalled();
  });

  it('should add label to control labels array, when calling toggleControlLabel with checked label', () => {
    const mockedControlLabel = generateMockControlLabel();
    const mockedEvent = { target: { checked: true, dataset: { controlLabel: JSON.stringify(mockedControlLabel) } } };

    instance.toggleControlLabel(mockedEvent);

    expect(instance.selectedControlLabels.length).toEqual(1);
    expect(instance.selectedControlLabels[0]).toEqual(mockedControlLabel);
    expect(instance.selectedControlLabelsAsString).toEqual(JSON.stringify([mockedControlLabel]));
  });

  it('should remove label from control labels array, when calling toggleControlLabel with unchecked label', () => {
    const mockedControlLabel1 = generateMockControlLabel(1);
    const mockedControlLabel2 = generateMockControlLabel(2);
    const mockedEvent = { target: { checked: false, dataset: { controlLabel: JSON.stringify(mockedControlLabel1) } } };

    instance.selectedControlLabels = [mockedControlLabel1, mockedControlLabel2];

    instance.toggleControlLabel(mockedEvent);

    expect(instance.selectedControlLabels.length).toEqual(1);
    expect(instance.selectedControlLabels[0]).toEqual(mockedControlLabel2);
    expect(instance.selectedControlLabelsAsString).toEqual(JSON.stringify([mockedControlLabel2]));
  });

  it('should initialize component variables, when calling handlePopoverShown', () => {
    const mockedGridState = { skip: 0, take: 20 };

    instance.gridState = cloneDeep(mockedGridState);

    instance.handlePopoverShown();

    expect(instance.selectedControlLabels).toEqual([]);
    expect(instance.gridStateAsString).toEqual(JSON.stringify(mockedGridState));
    expect(instance.viewSelected).toEqual(false);
    expect(instance.viewNameString).toEqual('');
  });

  it('should set and select view, when calling handleViewChanged with non-default view', () => {
    spyOn(instance.viewSelectionChanged, 'emit');

    const mockedView = 'Non-Default';

    instance.handleViewChanged(mockedView);

    expect(instance.viewSelected).toEqual(true);
    expect(instance.viewNameString).toEqual(mockedView);
    expect(instance.viewSelectionChanged.emit).toHaveBeenLastCalledWith(mockedView);
  });

  it('should reset view variables, when calling handleViewChanged with default view', () => {
    spyOn(instance.viewSelectionChanged, 'emit');

    const mockedView = 'Default';

    instance.handleViewChanged(mockedView);

    expect(instance.selectedControlLabels).toEqual([]);
    expect(instance.viewSelected).toEqual(false);
    expect(instance.viewNameString).toEqual('');
    expect(instance.viewSelectionChanged.emit).toHaveBeenLastCalledWith('');
  });
});
