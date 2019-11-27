import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromViewEditActions from '../actions/view-edit.actions';
import { ViewEditPageComponent } from './view-edit.page';
import { generateMockControlViewToggleObj } from '../models';

describe('Job Description Management - Settings - View Edit Page', () => {
  let instance: ViewEditPageComponent;
  let fixture: ComponentFixture<ViewEditPageComponent>;
  let store: Store<any>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditPageComponent ],
      providers: [
        provideMockStore({}),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub()
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ViewEditPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('should navigate up a route relative to this route, when handling a cancel click', () => {
    spyOn(instance.router, 'navigate');

    instance.handleCancelClicked();

    expect(instance.router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });

  it('should dispatch an action to the store to save the template views, when handling a save click', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromViewEditActions.SaveTemplateViews();

    instance.handleSaveClicked();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to add the hidden element Id, when handling a hidden elementId added', () => {
    spyOn(instance.store, 'dispatch');
    const mockControlViewToggleObj = generateMockControlViewToggleObj();
    const expectedAction = new fromViewEditActions.AddHiddenElementId(mockControlViewToggleObj);

    instance.handleHiddenElementIdAdded(mockControlViewToggleObj);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to remove the hidden element Id, when handling a hidden elementId removed', () => {
    spyOn(instance.store, 'dispatch');
    const mockControlViewToggleObj = generateMockControlViewToggleObj();
    const expectedAction = new fromViewEditActions.RemoveHiddenElementId(mockControlViewToggleObj);

    instance.handleHiddenElementIdRemoved(mockControlViewToggleObj);

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to reset, upon destroy', () => {
    spyOn(instance.store, 'dispatch');
    const expectedAction = new fromViewEditActions.Reset();

    instance.ngOnDestroy();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
