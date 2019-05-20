import { NO_ERRORS_SCHEMA } from '@angular/core';
import {TestBed, ComponentFixture, async} from '@angular/core/testing';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { MultiSelectComponent } from './multi-select.component';
import {RemoteDataSourceService} from 'libs/core/services';
import {PayfactorsApiService} from '../../../../data/payfactors-api/payfactors-api.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {FileApiService} from '../../../../data/payfactors-api/file';

describe('UI/Common/Content - Multi Select', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let component: MultiSelectComponent;

  // Configure Testing Module for before each test
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgbTooltipModule ],
      declarations: [ MultiSelectComponent ],
      providers: [FileApiService, HttpHandler, HttpClient, PayfactorsApiService, RemoteDataSourceService ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    component.selectedOptionNames = ['zoos'];
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide checkbox panel when not expanded', () => {
    component.isExpanded = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the checkbox panel when expanded', () => {
    component.isExpanded = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the loading indicator when not loading', () => {
    component.isExpanded = true;
    component.isLoading = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the loading indicator when loading', () => {
    component.isExpanded = true;
    component.isLoading = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the correct primary label text', () => {
    component.labelText = 'job family';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render its options when expanded', () => {
    component.isExpanded = true;
    component.isLoading = false;
    component.options = [{ DisplayName: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the select facade is clicked', () => {
    spyOn(component.selectFacadeClick, 'emit');

    component.isExpanded = true;
    component.isLoading = false;
    const selectFacade = fixture.debugElement.nativeElement.querySelector('a');
    selectFacade.click();

    fixture.detectChanges();

    expect(component.selectFacadeClick.emit).toHaveBeenCalled();
  });

  it('should emit when the clear selections button is clicked', () => {
    component.options = [{ DisplayName: 'Zoos and Zookeeping', IsSelected: false }];
    spyOn(component.clearSelectionsClick, 'emit');
    component.isExpanded = true;
    component.isLoading = false;

    fixture.detectChanges();
    component.clearSelections();
    expect(component.clearSelectionsClick.emit).toHaveBeenCalled();
  });

  it('should emit with the right object when a checkbox form value is changed', () => {
    spyOn(component.selectedOptionsChange, 'emit');
    component.isExpanded = true;
    component.isLoading = false;
    component.options = [{ DisplayName: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    const option = component.options.find(f => f.DisplayName === 'Zoos and Zookeeping');
    option.IsSelected = true;
    component.emitChanges();

    expect(component.selectedOptionsChange.emit).toHaveBeenCalled();
  });
});
