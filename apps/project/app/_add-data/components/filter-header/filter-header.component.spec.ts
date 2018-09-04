import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FilterHeaderComponent } from './filter-header.component';

describe('Project - Add Data - Filter Header', () => {
  let fixture: ComponentFixture<FilterHeaderComponent>;
  let instance: FilterHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterHeaderComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterHeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should emit a resetAll event when handling Reset All Clicked', () => {
    spyOn(instance.resetAll, 'emit');

    instance.handleResetAllClicked();

    expect(instance.resetAll.emit).toHaveBeenCalled();
  });

  it('should show a Reset All link when this not a "singled" filter', () => {
    instance.singled = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a formatted number of results', () => {
    instance.numberOfResults = 3500;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
