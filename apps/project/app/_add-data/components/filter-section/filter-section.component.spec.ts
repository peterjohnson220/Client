import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { FilterSectionComponent } from './filter-section.component';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-filter-section>
      <h1>Transclusion Works!</h1>
    </pf-filter-section>`
})
class TestHostComponent {}

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
  });

  it('should display the given title in the header', () => {
    instance.title = 'Job Description';

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

  it('should show a fa-angle-up icon in the header, when NOT collapsed', () => {
    instance.collapsed = false;

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
});
