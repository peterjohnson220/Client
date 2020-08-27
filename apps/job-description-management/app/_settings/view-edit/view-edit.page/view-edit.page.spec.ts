import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromViewEditActions from '../actions/view-edit.actions';
import { ViewEditPageComponent } from './view-edit.page';
import { generateMockElementViewToggleObj } from '../models';

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

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should navigate up a route relative to this route, when handling a cancel click', () => {
    spyOn(router, 'navigate');

    instance.handleCancelClicked();

    expect(router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: route });
  });

  it('should dispatch an action to the store to save the template views, when handling a save click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromViewEditActions.SaveTemplateViews();

    instance.handleSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to add the hidden element Id, when handling a hidden elementId added', () => {
    spyOn(store, 'dispatch');
    const mockElementViewToggleObj = generateMockElementViewToggleObj();
    const expectedAction = new fromViewEditActions.AddHiddenElementId(mockElementViewToggleObj);

    instance.handleHiddenElementIdAdded(mockElementViewToggleObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to remove the hidden element Id, when handling a hidden elementId removed', () => {
    spyOn(store, 'dispatch');
    const mockElementViewToggleObj = generateMockElementViewToggleObj();
    const expectedAction = new fromViewEditActions.RemoveHiddenElementId(mockElementViewToggleObj);

    instance.handleHiddenElementIdRemoved(mockElementViewToggleObj);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to reset, upon destroy', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromViewEditActions.Reset();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
