
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import { generateMockSidebarLink, generateMockUserContext } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';

import { LeftSidebarComponent } from './left-sidebar.component';
import * as fromRootState from '../../../../state/state';
import * as fromLayoutReducer from '../../reducers';
import * as fromLeftSidebarActions from '../../actions/left-sidebar.actions';
import { TruncateAfterPipe } from '../../../../core/pipes';

describe('Left Sidebar', () => {
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let instance: LeftSidebarComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({
        ...fromRootState.reducers,
        layoutWrapper: combineReducers(fromLayoutReducer.reducers),
      }),
    ],
    declarations: [
      LeftSidebarComponent,
      TruncateAfterPipe
    ],
    // Shallow Testing
    schemas: [ NO_ERRORS_SCHEMA ],
    providers: [SettingsService],
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(LeftSidebarComponent);
    instance = fixture.componentInstance;
    instance.userContext$ = of(generateMockUserContext());
  });

  it('should dispatch a GetLeftSidebarNavigationLinks action upon Init', () => {
    const action = new fromLeftSidebarActions.GetLeftSidebarNavigationLinks();

    instance.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a GetLeftSidebarNavigationLinks action upon reload', () => {
    const action = new fromLeftSidebarActions.GetLeftSidebarNavigationLinks();

    instance.handleSidebarNavigationLinksReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('it should contain url from sidebar link ', () => {
    const sideBarLink = generateMockSidebarLink();
    const result = instance.getSidebarHref(sideBarLink);
    expect(result).toContain(sideBarLink.Url);
  });

  it('should show ul of sidebar closed', () => {
    instance.leftSidebarToggle = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show ul of sidebar open', () => {
    instance.leftSidebarToggle = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
