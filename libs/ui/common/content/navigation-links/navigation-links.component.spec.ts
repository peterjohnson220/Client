import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { NavigationLinksComponent } from './navigation-links.component';
import * as fromNavigationReducer from '../../reducers';

import { generateNavigationLinkGroupLinks } from '../../models';

describe('Pf-Admin - Navigation - Navigation Links', () => {
    let instance: NavigationLinksComponent;
    let fixture: ComponentFixture<NavigationLinksComponent>;
    let store: Store<fromNavigationReducer.State>;

    const mockNavigationGroupLinks = generateNavigationLinkGroupLinks();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                  ...fromRootState.reducers,
                  pf_admin: combineReducers(fromNavigationReducer.reducers),
                })
              ],
              declarations: [ NavigationLinksComponent ],
              schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(NavigationLinksComponent);
        instance = fixture.componentInstance;

        store = TestBed.get(Store);
    });

    it('Should display navigation group items', () => {
        instance.navigationGroupLinks = mockNavigationGroupLinks;

        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });
});
