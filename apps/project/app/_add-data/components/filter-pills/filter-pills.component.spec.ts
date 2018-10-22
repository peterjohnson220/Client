import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { generateMockPill, generateMockPillGroup } from '../../models';
import { FilterPillsComponent } from './filter-pills.component';

describe('Project - Add Data - Filter Pills', () => {
  let fixture: ComponentFixture<FilterPillsComponent>;
  let instance: FilterPillsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule
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
});
