import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { Filter, generateMockMultiSelectFilter, generateMockMultiSelectOption, generateMockPill, generateMockPillGroup,
        generateMockRangeFilter, PillGroup } from '../../models';
import { FilterPillsComponent } from './filter-pills.component';

describe('Search Feature - Filter Pills', () => {
  let fixture: ComponentFixture<FilterPillsComponent>;
  let instance: FilterPillsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        PerfectScrollbarModule
      ],
      declarations: [ FilterPillsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterPillsComponent);
    instance = fixture.componentInstance;
  });

  it('should emit a clearPill event when handling a pill clicked', () => {
    spyOn(instance.clearPill, 'emit');

    instance.handlePillClicked(generateMockPill());

    expect(instance.clearPill.emit).toHaveBeenCalled();
  });

  it('should emit a clearPillGroup event when handling clear all clicked', () => {
    spyOn(instance.clearPillGroup, 'emit');

    instance.handleClearAllClicked(generateMockPillGroup());

    expect(instance.clearPillGroup.emit).toHaveBeenCalled();
  });

  it('should track pill groups by their name', () => {
    const pillGroup = generateMockPillGroup();

    expect(instance.pillGroupTrackByFn(0, pillGroup)).toBe(pillGroup.GroupName);
  });

  it('should build a multi select pill group when receiving new filters', () => {
    const multiSelectFilter = generateMockMultiSelectFilter();
    const filters = [multiSelectFilter];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    const expectedPillGroup: PillGroup = {
      FilterId: multiSelectFilter.Id,
      GroupName: multiSelectFilter.DisplayName,
      Locked: multiSelectFilter.Locked,
      PreviewString: 'Option 1',
      Pills: [{
        FilterId: multiSelectFilter.Id,
        ValueName: multiSelectFilter.Options[0].Name,
        Value: multiSelectFilter.Options[0].Value
      }]
    };

    instance.filters = filters;

    instance.ngOnChanges(changesObj);

    expect(instance.pillGroups).toEqual([expectedPillGroup]);
  });

  it('should build a range filter pill group when receiving new filters', () => {
    const rangeFilter = generateMockRangeFilter();
    const filters = [rangeFilter];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };

    const expectValueDisplay =
      `${rangeFilter.SelectedMinValue.toFixed(rangeFilter.Precision)} - ${rangeFilter.SelectedMaxValue.toFixed(rangeFilter.Precision)}`;
    const expectedPillGroup: PillGroup = {
      FilterId: rangeFilter.Id,
      GroupName: rangeFilter.DisplayName,
      Locked: rangeFilter.Locked,
      PreviewString: expectValueDisplay,
      Pills: [{
        FilterId: rangeFilter.Id,
        ValueName: expectValueDisplay,
        Value: null
      }]
    };

    instance.filters = filters;

    instance.ngOnChanges(changesObj);

    expect(instance.pillGroups).toEqual([expectedPillGroup]);
  });

  it('should apply a locked class to the pill, the pill icon, and show a locked icon (fa-lock), when its locked', () => {
    const filters = [<Filter>{...generateMockMultiSelectFilter(), Locked: true}];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    instance.filters = filters;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not add a locked class to the pill or icon, and show a (fa-angle-down) icon, when its not locked', () => {
    const filters = [<Filter>{...generateMockMultiSelectFilter(), Locked: false}];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    instance.filters = filters;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a comma separated list of multi select option values for the pill value', () => {
    const multiSelectFilter = generateMockMultiSelectFilter();
    multiSelectFilter.Options.push({...generateMockMultiSelectOption(), Name: 'Option 2'});
    const filters = [multiSelectFilter];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    instance.filters = filters;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a comma separated list of multi select option values with an ellipsis, when it exceeds the preview length', () => {
    const multiSelectFilter = generateMockMultiSelectFilter();
    multiSelectFilter.Options.push({...generateMockMultiSelectOption(), Name: 'Very long multi select option value'});
    const filters = [multiSelectFilter];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    instance.filters = filters;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show range filters selected min and max as the pill value (min - max)', () => {
    const rangeFilter = generateMockRangeFilter();
    const filters = [rangeFilter];
    const changesObj: SimpleChanges = {
      filters: new SimpleChange(null, filters, true)
    };
    instance.filters = filters;

    instance.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
