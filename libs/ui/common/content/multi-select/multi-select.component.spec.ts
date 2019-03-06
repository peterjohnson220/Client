import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { of } from 'rxjs';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { MultiSelectComponent } from './multi-select.component';

describe('UI/Common/Content - Multi Select', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let component: MultiSelectComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgbTooltipModule ],
      declarations: [ MultiSelectComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide checkbox panel when not expanded', () => {
    component.isExpanded$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the checkbox panel when expanded', () => {
    component.isExpanded$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the loading indicator when not loading', () => {
    component.isExpanded$ = of(true);
    component.isLoading$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the loading indicator when loading', () => {
    component.isExpanded$ = of(true);
    component.isLoading$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the correct primary label text', () => {
    component.labelText = 'job family';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render its options when expanded', () => {
    component.isExpanded$ = of(true);
    component.isLoading$ = of(false);
    component.options = [{ DisplayName: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the select facade is clicked', () => {
    spyOn(component.selectFacadeClick, 'emit');

    component.isExpanded$ = of(true);
    component.isLoading$ = of(false);
    const selectFacade = fixture.debugElement.nativeElement.querySelector('a');
    selectFacade.click();

    fixture.detectChanges();

    expect(component.selectFacadeClick.emit).toHaveBeenCalled();
  });

  it('should emit when the clear selections button is clicked', () => {
    spyOn(component.clearSelectionsClick, 'emit');

    component.isExpanded$ = of(true);
    component.isLoading$ = of(false);

    fixture.detectChanges();

    const clearSelections = fixture.debugElement.nativeElement.querySelector('button.clear-selections');
    clearSelections.click();

    expect(component.clearSelectionsClick.emit).toHaveBeenCalled();
  });

  it('should emit with the right object when a checkbox is clicked', () => {
    spyOn(component.checkboxClick, 'emit');
    component.isExpanded$ = of(true);
    component.isLoading$ = of(false);
    component.options = [{ DisplayName: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    const checkbox = fixture.debugElement.nativeElement.querySelector('input[type=checkbox]');
    checkbox.click();

    expect(component.checkboxClick.emit).toHaveBeenCalledWith({ DisplayName: 'Zoos and Zookeeping', IsSelected: true });
  });
});
