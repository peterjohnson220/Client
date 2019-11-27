import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {of} from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import {PermissionService} from 'libs/core/services';
import {JobDescriptionTemplateApiService} from 'libs/data/payfactors-api/jdm';
import {SimpleYesNoModalComponent} from 'libs/ui/common/simple-yes-no';

import { TemplateListPageComponent } from './template-list.page';
import * as fromTemplateListActions from '../../../actions/template-list.actions';
import * as fromTemplateActions from '../../../actions/template.actions';
import * as fromTemplateReducers from '../../../reducers';
import {RouteTrackingService} from '../../../../shared/services';
import {generateMockTemplateListItem, Template} from '../../../models';
import {CopyTemplateModalComponent} from '../../../components/modals/copy-template';
import {NewTemplateModalComponent} from '../../../components/modals/new-template';

describe('Job Description Management - Job Description - Template List Page', () => {
  let instance: TemplateListPageComponent;
  let fixture: ComponentFixture<TemplateListPageComponent>;
  let store: Store<fromTemplateReducers.State>;
  let router: Router;
  let route: ActivatedRouteStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      StoreModule.forRoot({
      ...fromRootState.reducers,
      jobdescriptionmanagement_templates: combineReducers(fromTemplateReducers.reducers),
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: (key) => '' } }
          }
        },
        {
          provide: RouteTrackingService,
          useValue: {
            previousRoute: ''
          }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn() }
        },
        {
          provide: FormGroup,
          useValue: { reset: jest.fn() }
        },
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), reset: jest.fn() }
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: jest.fn(() => true) }
        },
        {
          provide: JobDescriptionTemplateApiService,
          useValue: {exists: (name: string) => of(name === 'Test1')}
        }, FormBuilder
      ],
      declarations: [
        TemplateListPageComponent, CopyTemplateModalComponent, NewTemplateModalComponent,
        SimpleYesNoModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TemplateListPageComponent);
    instance = fixture.componentInstance;

    instance.copyTemplateModal = TestBed.createComponent(CopyTemplateModalComponent).componentInstance;
    instance.newTemplateModal = TestBed.createComponent(NewTemplateModalComponent).componentInstance;
    instance.deleteTemplateModal = TestBed.createComponent(SimpleYesNoModalComponent).componentInstance;

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('should show add template modal', () => {
    spyOn(instance.newTemplateModal, 'open');

    instance.showAddTemplateModal();
    expect(instance.newTemplateModal.open).toBeCalled();
  });

  it('should load copy modal with ID of template passed in', () => {
    spyOn(instance.copyTemplateModal, 'open');
    const mockTemplateListItem = generateMockTemplateListItem(123);

    instance.showCopyModal(mockTemplateListItem);
    expect(instance.copyTemplateModal.open).toBeCalledWith({templateId: mockTemplateListItem.TemplateId});
  });

  it('should load delete template modal with passed in template', () => {
    spyOn(instance.deleteTemplateModal, 'open');
    const mockTemplateListItem = generateMockTemplateListItem(456);

    instance.showDeleteModal(mockTemplateListItem);
    expect(instance.deleteTemplateModal.open).toBeCalledWith(mockTemplateListItem);
  });

  it('should load template list on initialization', () => {
    spyOn(store, 'dispatch');
    instance.ngOnInit();
    const expectedAction = new fromTemplateListActions.LoadTemplateList();
    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should save template on create template complete', () => {
    spyOn(store, 'dispatch');
    const temp = new Template();
    temp.TemplateName = 'Tester Template';
    instance.handleCreateTemplateComplete(temp.TemplateName);

    const expectedAction = new fromTemplateActions.SaveTemplate({template: temp});
    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });
});
