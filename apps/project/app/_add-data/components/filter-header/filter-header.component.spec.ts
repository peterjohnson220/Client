import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FilterHeaderComponent } from './filter-header.component';
import { NgbPopoverModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

describe('Project - Add Data - Filter Header', () => {
  let fixture: ComponentFixture<FilterHeaderComponent>;
  let instance: FilterHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterHeaderComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ NgbPopoverModule.forRoot() ]
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

  it('should open popover when save filters clicked', () => {
    const popover: NgbPopover = fixture.debugElement.query(By.directive(NgbPopover)).references.popover;
    const saveFilters = fixture.debugElement.query(By.css('.save-filters')).nativeElement;
    spyOn(popover, 'open');

    saveFilters.click();
    fixture.detectChanges();

    expect(popover.open).toHaveBeenCalled();
  });

  it('should emit save filters when Save button clicked', () => {
    const popover: NgbPopover = fixture.debugElement.query(By.directive(NgbPopover)).references.popover;
    spyOn(instance.saveFilters, 'emit');
    instance.isForAllPayMarkets = true;

    instance.handleSaveFilters(popover);
    fixture.detectChanges();

    expect(instance.saveFilters.emit).toBeCalledWith(instance.isForAllPayMarkets);
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
