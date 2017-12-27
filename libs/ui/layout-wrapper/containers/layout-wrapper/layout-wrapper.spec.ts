import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { LayoutWrapperComponent } from './layout-wrapper';
import * as fromRootState from '../../../../state/state';
import * as fromLayoutReducer from '../../reducers';
import * as fromHeaderActions from '../../actions/header.actions';

// Host Component for testing transclusion
@Component({
  template: `
    <pf-layout-wrapper>
      <ng-container mainContent>I am the main content</ng-container>
      <ng-container rightSidebarContent>I am the right sidebar content</ng-container>
    </pf-layout-wrapper>\`
  `
})
class TestHostComponent {
}

describe('Layout Wrapper', () => {
  let fixture: ComponentFixture<LayoutWrapperComponent>;
  let instance: LayoutWrapperComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          layoutWrapper: combineReducers(fromLayoutReducer.reducers),
        }),
      ],
      declarations: [
        LayoutWrapperComponent, TestHostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(LayoutWrapperComponent);
    instance = fixture.componentInstance;
  });

  it('should transclude', () => {
    const hostComponent = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();

    expect(hostComponent).toMatchSnapshot();
  });

  it('should dispatch a GetHeaderDropdownNavigationLinks action upon Init', () => {
    const action = new fromHeaderActions.GetHeaderDropdownNavigationLinks();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
