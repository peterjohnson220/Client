import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import { RangeGroupType } from 'libs/constants/structures/range-group-type';
import { RateType } from 'libs/data/data-sets';
import { generateMockRoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { getMockDataViewFilter } from 'libs//models/payfactors-api/reports/request';

import * as fromMidpointActions from '../../actions/midpoint-edit.actions';
import { MidpointEditorComponent } from './midpoint-editor.component';

describe('Features - Structures - Midpoint Editor', () => {
  let instance: MidpointEditorComponent;
  let fixture: ComponentFixture<MidpointEditorComponent>;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MidpointEditorComponent ],
      providers: [
        provideMockStore({}),
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(true) }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(MidpointEditorComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should not be editable when the rangeGroupType is not Job', () => {
    instance.rangeGroupType = RangeGroupType.Grade;

    expect(instance.editable).toBe(false);
  });

  it('should not be editable when it is the current structure but we cant edit current structure ranges', () => {
    instance.rangeGroupType = RangeGroupType.Job;
    instance.currentStructure = true;
    instance.canEditCurrentStructureRanges = false;

    expect(instance.editable).toBe(false);
  });

  it('should be editable when it is not the current structure', () => {
    instance.rangeGroupType = RangeGroupType.Job;
    instance.currentStructure = false;

    expect(instance.editable).toBe(true);
  });

  it('should have a format of n0 when our rate is annual and we are not truncating the value', () => {
    instance.rate = RateType.Annual;
    instance.truncateAnnualValueDisplay = false;

    expect(instance.format).toBe('n0');
  });

  it('should have a format of n1 when our rate is annual and we are truncating the value', () => {
    instance.rate = RateType.Annual;
    instance.truncateAnnualValueDisplay = true;

    expect(instance.format).toBe('n1');
  });

  it('should have a format of n2 when our rate is hourly', () => {
    instance.rate = RateType.Hourly;

    expect(instance.format).toBe('n2');
  });

  it('should have 0 decimals when the rate is annual and we are focusing', () => {
    instance.rate = RateType.Annual;
    instance.focused = true;

    expect(instance.decimals).toBe(0);
  });

  it('should have 2 decimals when we are not focusing', () => {
    instance.rate = RateType.Annual;
    instance.focused = false;

    expect(instance.decimals).toBe(2);
  });

  it('should have 2 decimals when the rate is hourly', () => {
    instance.rate = RateType.Hourly;

    expect(instance.decimals).toBe(2);
  });

  it('should set that we are focused when handling the focus event', () => {
    instance.focused = false;

    instance.handleFocus();

    expect(instance.focused).toBe(true);
  });

  it('should set the value to the mid when focusing', () => {
    instance.value = 89.6;
    instance.mid = 89599;

    instance.handleFocus();

    expect(instance.value).toBe(89599);
  });

  it('should set that we are no longer focused when handling the blur event', () => {
    instance.focused = true;

    instance.handleBlur();

    expect(instance.focused).toBe(false);
  });

  it('should format and set the value when handling the blur event', () => {
    instance.value = 89599;
    instance.rate = RateType.Annual;
    instance.truncateAnnualValueDisplay = true;

    instance.handleBlur();

    expect(instance.value).toBe(89.599);
  });

  it('should set the value when handling a value changed event', () => {
    instance.handleValueChange({ target: { value: 97888 }}, 0);

    expect(instance.value).toBe(97888);
  });

  it('should dispatch an action to update the mid value when handling a value changed event', () => {
    spyOn(store, 'dispatch');
    buildDefaultInputs(instance);
    const expectedActionPayload = {
      pageViewId: instance.pageViewId,
      rangeGroupId: instance.rangeGroupId,
      rangeId: instance.rangeId,
      mid: 97888,
      rowIndex: instance.rowIndex,
      roundingSettings: instance.roundingSettings,
      refreshRowDataViewFilter: instance.refreshRowDataViewFilter,
      metaInfo: instance.updateMetaInfo,
      successCallBackFn: instance.updateSuccessCallbackFn
    };
    const expectedAction = new fromMidpointActions.UpdateMid(expectedActionPayload);

    instance.handleValueChange({ target: { value: 97888 }}, 0);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set and format the value anytime we receive a new mid', () => {
    instance.value = 64000;
    instance.ngOnChanges({
      mid: { previousValue: 64000, currentValue: 78999, firstChange: false, isFirstChange(): boolean { return false; }}
    });

    expect(instance.value).toBe(78999);
  });
});

function buildDefaultInputs(instance: MidpointEditorComponent): void {
  instance.pageViewId = '8881A5B6-2506-4755-B756-9D310EBFF8A1';
  instance.rangeGroupType = RangeGroupType.Job;
  instance.currentStructure = true;
  instance.roundingSettings = generateMockRoundingSettingsDataObj();
  instance.refreshRowDataViewFilter = getMockDataViewFilter();
  instance.textAlign = 'right';
  instance.updateSuccessCallbackFn = () => true;
  instance.updateMetaInfo = 'Hello World!';
  instance.readonlyValueTemplate = null;
  instance.truncateAnnualValueDisplay = true;

  instance.rangeGroupId = 123;
  instance.rangeId = 987;
  instance.rate = RateType.Annual;
  instance.mid = 55000;
  instance.dataRow = {};
  instance.rowIndex = 0;
}
