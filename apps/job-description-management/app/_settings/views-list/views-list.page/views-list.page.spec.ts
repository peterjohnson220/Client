import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { FilterArrayByName } from 'libs/core/pipes';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { SimpleYesNoModalComponent } from 'libs/ui/common/simple-yes-no';

import { JobDescriptionViewConstants } from '../../../shared/constants';
import * as fromViewListActions from '../actions/views-list.actions';
import * as fromViewEditActions from '../../view-edit/actions/view-edit.actions';
import { ViewsListPageComponent } from './views-list.page';

describe('Job Description Management - Settings - Views List Page', () => {
  let instance: ViewsListPageComponent;
  let fixture: ComponentFixture<ViewsListPageComponent>;
  let store: Store<any>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsListPageComponent, FilterArrayByName , SimpleYesNoModalComponent],
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

    fixture = TestBed.createComponent(ViewsListPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should dispatch an action to the store to load the views upon init', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromViewListActions.LoadJobDescriptionViews();

    // Init
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should track the views by their name', () => {
    expect(instance.viewsTrackByFn(0, 'MyView')).toBe('MyView');
  });

  it('should return true when the view is a "System View"', () => {
    expect(instance.isSystemView(JobDescriptionViewConstants.SYSTEM_VIEWS[0])).toBe(true);
  });

  it('should set the views filter when handling the search value changing', () => {
    instance.handleSearchValueChanged('New Value');

    expect(instance.viewsFilter).toBe('New Value');
  });

  it('should dispatch an action to the store to delete the view with the name, when handling a delete confirmation', () => {
    spyOn(store, 'dispatch');
    const deletedViewName = 'View To Be Deleted';
    const expectedAction = new fromViewListActions.DeleteView({ viewName: deletedViewName });

    instance.handleViewDeleteConfirmed(deletedViewName);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to the store to edit the view with the name, when handling a view clicked', () => {
    spyOn(store, 'dispatch');
    const viewToEdit = 'View To Be Edited';
    const expectedAction = new fromViewEditActions.EditView({ viewName: viewToEdit });

    instance.handleViewClicked(viewToEdit);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should tell the router to navigate to the edit page relative to this route, when handling a view clicked', () => {
    spyOn(router, 'navigate');

    instance.handleViewClicked('View To Be Edited');

    expect(router.navigate).toHaveBeenCalledWith(['edit'], { relativeTo: route });
  });

  it('should stop propagation on the mouse event, when handling a delete view click', () => {
    const mouseEvent = new MouseEvent('click');
    spyOn(mouseEvent, 'stopPropagation');

    instance.handleDeleteViewClicked('Default', mouseEvent);

    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should set the body text for the confirmation modal options, when handling a delete view click', () => {
    const mouseEvent = new MouseEvent('click');
    const viewToDelete = 'View To Be Delete';
    const expectedBodyMessage = `You are about to delete the <strong>${viewToDelete}</strong> view. This cannot be undone. Would you like to continue?`;
    spyOn(instance.deleteViewConfirmationModal, 'open');

    instance.handleDeleteViewClicked(viewToDelete, mouseEvent);

    expect(instance.deleteViewModalOptions.Body).toBe(expectedBodyMessage);
  });

  it('should open the delete confirmation modal with the view name as context, when handling a delete view click', () => {
    const mouseEvent = new MouseEvent('click');
    const viewToDelete = 'View To Be Deleted';
    spyOn(instance.deleteViewConfirmationModal, 'open');

    instance.handleDeleteViewClicked(viewToDelete, mouseEvent);

    expect(instance.deleteViewConfirmationModal.open).toHaveBeenCalledWith(viewToDelete);
  });
});
