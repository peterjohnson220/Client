import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { FilterSectionComponent } from './filter-section.component';
import { generateMockMultiSelectFilter, generateMockTextFilter, TextFilter } from '../../models';

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

describe('Project - Add Data - Filter Section', () => {
  let fixture: ComponentFixture<FilterSectionComponent>;
  let instance: FilterSectionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSectionComponent, TestHostComponent ],
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

    instance.toggle();

    expect(instance.collapsed).toBe(true);
  });

  it('should set collapsed to false, when toggling', () => {
    instance.collapsed = true;

    instance.toggle();

    expect(instance.collapsed).toBe(false);
  });

  it('should stop propagation on the mouse event when handling the reset clicked', () => {
    const mockEvent = { stopPropagation: jest.fn()};
    instance.filter = generateMockTextFilter();
    spyOn(mockEvent, 'stopPropagation');

    instance.handleResetClicked(mockEvent, instance.filter.Id);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should emit a reset event with the filterId when handling the reset clicked', () => {
    const mockEvent = { stopPropagation: jest.fn()};
    instance.filter = generateMockTextFilter();
    spyOn(instance.reset, 'emit');

    instance.handleResetClicked(mockEvent, instance.filter.Id);

    expect(instance.reset.emit).toHaveBeenCalledWith(instance.filter.Id);
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
});
