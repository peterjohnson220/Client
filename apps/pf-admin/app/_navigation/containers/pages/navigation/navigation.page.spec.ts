import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromNavigationActions from '../../../actions';
import * as fromNavigationReducer from '../../../reducers';
import { NavigationPageComponent } from './navigation.page';

describe('Pf-Admin - Navigation - Navigation Page', () => {
    let instance: NavigationPageComponent;
    let fixture: ComponentFixture<NavigationPageComponent>;
    let store: Store<fromNavigationReducer.State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                  ...fromRootState.reducers,
                  pf_admin: combineReducers(fromNavigationReducer.reducers),
                })
              ],
              declarations: [ NavigationPageComponent ],
              schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(NavigationPageComponent);
        instance = fixture.componentInstance;

        store = TestBed.inject(Store);
    });

    it('Should dispatch a LoadLinks Action when the page is loaded', () => {
        spyOn(store, 'dispatch');
        const expectedAction = new fromNavigationActions.LoadNavigationLinks();
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
