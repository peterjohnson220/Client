import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { provideMockStore } from '@ngrx/store/testing';

import { RemoteDataSourceService } from 'libs/core/services';

import { MultiSelectComponent } from './multi-select.component';
import { PayfactorsApiService } from '../../../../data/payfactors-api/payfactors-api.service';
import { FileApiService } from '../../../../data/payfactors-api/file';
import { ConfigSetting, UserContext } from '../../../../models/security';

describe('UI/Common/Content - Multi Select', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let component: MultiSelectComponent;
  // this is just to provide the new root store requirement for the payfactorsAPI
  let userContext: UserContext;
  userContext = new class implements UserContext {
    AccessLevel: string;
    CompanyId: number;
    CompanyName: string;
    CompanySystemUserGroupsGroupName: string;
    CompanySystemUserGroupsId: number;
    ConfigSettings: ConfigSetting[];
    EmailAddress: string;
    EmployeeAcknowledgementInfo: any;
    FirstName: string;
    ImpersonatorId: number;
    IpAddress: string;
    IsPublic: boolean;
    LastName: string;
    Name: string;
    Permissions: string[];
    SessionId: string;
    SystemUserGroupsId: number;
    UserId: number;
    UserIdentifier: string;
    UserPicture: string;
    WorkflowStepInfo: any;
  };

  const initialState = { userContext: userContext };

  // Configure Testing Module for before each test
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [ NgbTooltipModule, ScrollingModule ],
      declarations: [ MultiSelectComponent ],
      providers: [FileApiService, HttpHandler, HttpClient, PayfactorsApiService, RemoteDataSourceService, provideMockStore({initialState}) ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
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
    component.options = [{ DisplayName: 'Zoos and Zookeeping', Value: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    expect(fixture).  toMatchSnapshot();
  });

  it('should emit when the select facade is clicked', () => {
    spyOn(component.selectFacadeClick, 'emit');

    component.isExpanded = true;
    component.isLoading = false;
    const selectFacade = fixture.debugElement.nativeElement.querySelector('.select-facade');
    selectFacade.click();

    fixture.detectChanges();

    expect(component.selectFacadeClick.emit).toHaveBeenCalled();
  });

  it('should emit when the clear selections button is clicked', () => {
    component.options = [{ DisplayName: 'Zoos and Zookeeping', Value: 'Zoos and Zookeeping', IsSelected: false }];
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
    component.options = [{ DisplayName: 'Zoos and Zookeeping', Value: 'Zoos and Zookeeping', IsSelected: false }];

    fixture.detectChanges();

    const option = component.options.find(f => f.DisplayName === 'Zoos and Zookeeping');
    option.IsSelected = true;
    component.emitChanges();

    expect(component.selectedOptionsChange.emit).toHaveBeenCalled();
  });
});
