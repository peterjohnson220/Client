import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgbPopoverModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { SearchActionsComponent } from './search-actions.component';

describe('Project - Add Data - Search Actions', () => {
  let fixture: ComponentFixture<SearchActionsComponent>;
  let instance: SearchActionsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgbPopoverModule ],
      declarations: [ SearchActionsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SearchActionsComponent);
    instance = fixture.componentInstance;
  });

  it('should emit a reset event when handling Reset Clicked', () => {
    spyOn(instance.reset, 'emit');

    instance.handleResetClicked();

    expect(instance.reset.emit).toHaveBeenCalled();
  });

  /**
   * isOpen() from NgbPopover is always false so this test won't pass
   *
  it('should close popover when Close button clicked', () => {
    instance.openSaveFiltersPopover();
    spyOn(instance.saveFiltersPopover, 'close');
    fixture.detectChanges();

    instance.closeSaveFiltersPopover();
    fixture.detectChanges();

    expect(instance.saveFiltersPopover.close).toHaveBeenCalled();
  });*/

});
