import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';

import { FilterSectionComponent } from './filter-section.component';
import { generateMockMultiSelectFilter, generateMockMultiSelectOption, generateMockTextFilter, MultiSelectFilter,
  TextFilter } from '../../models';


// Host Component for testing transclusion
@Component({
  template: `
    <pf-filter-section [filter]="filter">
      <h1>Transclusion Works!</h1>
    </pf-filter-section>`
})
class TestHostComponent {
  filter = generateMockTextFilter();
}

describe('Search Feature - Filter Section', () => {
  let fixture: ComponentFixture<FilterSectionComponent>;
  let instance: FilterSectionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSectionComponent, TestHostComponent ],
      providers: [
        {
          provide: SettingsService,
          useValue: { selectUiPersistenceSettingFromDictionary: of }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterSectionComponent);
    instance = fixture.componentInstance;

    instance.filter = generateMockTextFilter();
  });

  it('should display the given title in the header', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display the transcluded content', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);

    hostComponent.detectChanges();

    expect(hostComponent).toMatchSnapshot();
  });

  it('should show a fa-angle-down icon in the header, when collapsed', () => {
    instance.collapsed = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set collapsed to true, when toggling', () => {
    instance.collapsed = false;

    instance.toggle(false);

    expect(instance.collapsed).toBe(true);
  });

  it('should set collapsed to false, when toggling', () => {
    instance.collapsed = true;

    instance.toggle(false);

    expect(instance.collapsed).toBe(false);
  });

  it('should stop propagation on the mouse event when handling the clear clicked', () => {
    const mockEvent = { stopPropagation: jest.fn()};
    instance.filter = generateMockTextFilter();
    spyOn(mockEvent, 'stopPropagation');

    instance.handleClearClicked(mockEvent, instance.filter.Id);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should emit a clear event with the filterId when handling the clear clicked', () => {
    const mockEvent = { stopPropagation: jest.fn()};
    instance.filter = generateMockTextFilter();
    spyOn(instance.clear, 'emit');

    instance.handleClearClicked(mockEvent, instance.filter.Id);

    expect(instance.clear.emit).toHaveBeenCalledWith(instance.filter.Id);
  });

  it('should emit a show more event with the filter when handling the show more clicked', () => {
    instance.filter = generateMockMultiSelectFilter();
    instance.singled = false;
    instance.maxOptions = 1;

    spyOn(instance.showMore, 'emit');

    instance.handleShowMoreClicked(instance.filter);

    expect(instance.showMore.emit).toHaveBeenCalledWith(instance.filter);
  });

  it('should emit a search event with the filter when handling the search clicked', () => {
    const mockEvent = { stopPropagation: jest.fn()};
    instance.filter = generateMockMultiSelectFilter();
    spyOn(instance.search, 'emit');

    instance.handleSearchClicked(mockEvent, instance.filter);

    expect(instance.search.emit).toHaveBeenCalledWith(instance.filter);
  });

  it('the selection count should give the # of selections when the filter is a MultiSelect', () => {
    instance.filter = generateMockMultiSelectFilter();

    expect(instance.selectionCount).toBe(1);
  });

  it('the selection count should be 0 when the filter is NOT a MultiSelect', () => {
    instance.filter = generateMockTextFilter();

    expect(instance.selectionCount).toBe(0);
  });

  it('the filter section has text when it is a text filter and a non empty value', () => {
    instance.filter = generateMockTextFilter();

    expect(instance.hasText).toBe(true);
  });

  it('the filter section does not have text when it is NOT a text filter', () => {
    instance.filter = generateMockMultiSelectFilter();

    expect(instance.hasText).toBe(false);
  });

  it('the filter section does not have text when it has an empty value', () => {
    instance.filter = <TextFilter>{...generateMockTextFilter(), Value: ''};

    expect(instance.hasText).toBe(false);
  });

  it(`should show a search icon and show more link, when the filter is a multi select,
      not singled, and the number of options is >= the max`, () => {
    instance.filter = <MultiSelectFilter>{...generateMockMultiSelectFilter(), Options: Array(5).fill(generateMockMultiSelectOption()) };
    instance.singled = false;
    instance.maxOptions = 5;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
