import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { CompaniesListComponent } from './companies-list.component';
import { CompanySearchPipe } from '../../pipes';
import * as fromCompaniesReducer from '../../reducers';
import * as fromCompaniesGridActions from '../../actions/companies-grid.actions';
import { generateMockCompanyGridItems } from '../../models';
import { CompaniesListConstants } from '../../constants/companies-list-constants';

describe('Pf-Admin - Companies - Companies List Component', () => {
    let instance: CompaniesListComponent;
    let fixture: ComponentFixture<CompaniesListComponent>;
    let store: Store<fromCompaniesReducer.State>;
    let router: Router;

    const mockCompanyList = generateMockCompanyGridItems();
    const mockGridState = {skip: 15, take: 15};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    ...fromRootState.reducers,
                    pf_admin: combineReducers(fromCompaniesReducer.reducers),
                })
            ],
            declarations: [
                  CompaniesListComponent,
                  CompanySearchPipe
            ],
            providers: [
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() },
                }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        store = TestBed.inject(Store);
        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(CompaniesListComponent);
        instance = fixture.componentInstance;

        instance.companiesList = mockCompanyList;
        instance.state = mockGridState;
        instance.selectedRowRouterLink = CompaniesListConstants.COMPANIES_EDIT_ROUTER_LINK;
    });

    it('Should dispatch a GetGridSkipAmount Action when the grid page is changed', () => {
        spyOn(store, 'dispatch');
        const pageChangeEvent = {skip: 15, take: 15 };
        const expectedAction = new fromCompaniesGridActions.GetGridSkipAmount(pageChangeEvent.skip);

        instance.pageChange(pageChangeEvent);

        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('Should navigate to the company page when the row is clicked', () => {
        spyOn(router, 'navigate');

        instance.gridSelectionChange(
            {
                selectedRows: [
                    {
                        dataItem: {
                            CompanyId: 1
                        }
                    }
                ]
            }
        );

        expect(router.navigate).toHaveBeenCalledWith(['/companies/edit/', 1]);
    });
});
