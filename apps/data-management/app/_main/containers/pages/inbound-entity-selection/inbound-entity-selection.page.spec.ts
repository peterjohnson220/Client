import {NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';

import {
  generateMockEntityTypeModel,
  generateMockExistingConnectionSummary, generateMockNewConnectionSummary,
  generateMockProvider, getEntityChoicesForOrgLoader
} from '../../../models';

import * as fromProviderListActions from '../../../actions/provider-list.actions';
import * as fromEntitySelectionActions from '../../../actions/entity-selection.actions';
import * as fromHrisConnectionReducers from '../../../reducers/hris-connection.reducer';
import * as fromEntitySelectionReducers from '../../../reducers/entity-selection.reducer';
import * as fromTransferDataPageReducers from '../../../reducers/transfer-data-page.reducer';
import * as fromProviderListReducers from '../../../reducers/provider-list.reducer';
import { InboundEntitySelectionPageComponent } from './inbound-entity-selection.page';

describe('InboundEntitySelectionPageComponent', () => {
  let component: InboundEntitySelectionPageComponent;
  let fixture: ComponentFixture<InboundEntitySelectionPageComponent>;
  let store: MockStore<any>;
  let router: Router;
  const initialState = {
    data_management: {
      entitySelection: fromEntitySelectionReducers.initialState,
      transferDataPage: fromTransferDataPageReducers.initialState,
      hrisConnection: fromHrisConnectionReducers.initialState,
      providerList: fromProviderListReducers.initialState
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [ InboundEntitySelectionPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(InboundEntitySelectionPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

  it('should dispatch an init event when page is initialized', () => {
      // arrange
      spyOn(store, 'dispatch');
      const expectedAction = new fromEntitySelectionActions.Init();

      // act
      component.ngOnInit();
      fixture.detectChanges();

      // assert
      expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
    });

  it('should set edit mode and set selected provider on an existing connection summary', () => {
      // arrange
      spyOn(store, 'dispatch');
      const summary = generateMockExistingConnectionSummary();
      const expectedAction = new fromProviderListActions.SetSelectedProvider(summary.provider);

      // act
      component.ngOnInit();
      component.connectionSummary$ = of(summary);
      fixture.detectChanges();

      // assert
      expect(component.editMode).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

  it('should not set edit mode and should not set selected provider on a new connection summary', () => {
      // arrange
      spyOn(store, 'dispatch');
      const summary = generateMockNewConnectionSummary();
      const expectedAction = new fromProviderListActions.SetSelectedProvider(summary.provider);

      // act
      component.ngOnInit();
      component.connectionSummary$ = of(summary);
      fixture.detectChanges();

      // assert
      expect(component.editMode).toBe(false);
      expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
    });

  it('should redirect to the landing page if redirect condition is detected', () => {
      // arrange
      spyOn(router, 'navigate');
      const redirect = of(true);
      // act
      component.ngOnInit();
      component.shouldRedirect$ = redirect;
      fixture.detectChanges();
      // assert
      expect(router.navigate).toBeCalledWith(['/']);
    });

    it('should dispatch an action to load entity selections on provider change', () => {
      // arrange
      spyOn(store, 'dispatch');
      const p = generateMockProvider();
      const provider = of(p);
      const expectedAction = new fromEntitySelectionActions.LoadEntitySelection(p);

      // act
      component.ngOnInit();
      component.selectedProvider$ = provider;
      fixture.detectChanges();

      // assert
      expect(store.dispatch).toBeCalledWith(expectedAction);
   });

  it('should check selected entities when navigating to page in new workflow state', () => {
      // arrange
      spyOn(store, 'dispatch');
      const selectedEntities = [generateMockEntityTypeModel()];
      const providerSupportedEntities = getEntityChoicesForOrgLoader();

      // act
      component.ngOnInit();
      component.pageSelections$ = of({selections: selectedEntities, providerSupportedEntities: providerSupportedEntities});
      fixture.detectChanges();

      // assert
      expect(component.providerSupportedEntities.filter(p => p.isChecked).length).toEqual(1);
    });
});
