import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromCompaniesActions from '../../../actions/companies.actions';
import * as fromCompaniesReducer from '../../../reducers';
import { CompaniesListPageComponent } from './companies-list.page';

describe('Pf-Admin - Companies - Companies List Page', () => {
    let instance: CompaniesListPageComponent;
    let fixture: ComponentFixture<CompaniesListPageComponent>;
    let store: Store<fromCompaniesReducer.State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                  ...fromRootState.reducers,
                  pf_admin: combineReducers(fromCompaniesReducer.reducers),
                })
              ],
              declarations: [ CompaniesListPageComponent ],
              schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(CompaniesListPageComponent);
        instance = fixture.componentInstance;

        store = TestBed.inject(Store);
    });

    it('Should dispatch a LoadCompanies Action when the page is loaded', () => {
        spyOn(store, 'dispatch');
        const expectedAction = new fromCompaniesActions.LoadCompanies();
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('Should dispatch an UpdatedSearchTerm action when updateSearchTerm method is called', () => {
        spyOn(store, 'dispatch');
        const searchTerm = 'TestSearchTerm';
        const expectedAction = new fromCompaniesActions.UpdateSearchTerm(searchTerm);

        instance.updateSearchTerm(searchTerm);

        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
});
