import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FilterActionsComponent } from './filter-actions.component';

describe('Project - Add Data - Filter Actions', () => {
  let fixture: ComponentFixture<FilterActionsComponent>;
  let instance: FilterActionsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterActionsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(FilterActionsComponent);
    instance = fixture.componentInstance;
  });

  it('should emit a reset event when handling Reset Clicked', () => {
    spyOn(instance.reset, 'emit');

    instance.handleResetClicked();

    expect(instance.reset.emit).toHaveBeenCalled();
  });

});
