import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockUserContext } from 'libs/models/security';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromCompHubPageActions from '../../../../_shared/actions/comphub-page.actions';
import { JobsCardWrapperComponent } from './jobs-card-wrapper.component';

describe('Comphub - Main - Jobs Card Wrapper Component', () => {
  let instance: JobsCardWrapperComponent;
  let fixture: ComponentFixture<JobsCardWrapperComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
        }),
        DropDownsModule,
      ],
      declarations: [ JobsCardWrapperComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobsCardWrapperComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);

    instance.userContext$ = of(generateMockUserContext());
    fixture.detectChanges();
  });

  it('should dispatch acction to open pricing history modal', () => {
    jest.spyOn(store, 'dispatch');
    const expectedAction = new  fromCompHubPageActions.SetQuickPriceHistoryModalOpen(true);

    instance.openQuickPriceHistoryModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
