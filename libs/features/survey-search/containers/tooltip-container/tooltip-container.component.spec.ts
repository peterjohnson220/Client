import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { TooltipContainerComponent } from './tooltip-container.component';
import { MatchesDetailsTooltipData, generateMatchesDetailsTooltipData } from '../../models';
import * as fromTooltipContainerActions from '../../actions/tooltip-container.actions';
import * as fromSharedSearchReducer from '../../reducers';

describe('TooltipContainerComponent', () => {
  let instance: TooltipContainerComponent;
  let fixture: ComponentFixture<TooltipContainerComponent>;
  let store: Store<fromSharedSearchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_surveySearch: combineReducers(fromSharedSearchReducer.reducers)
        })
      ],
      declarations: [ TooltipContainerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(TooltipContainerComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });


  it('should send get matches details request when matches hovered', () => {
    const data: MatchesDetailsTooltipData = generateMatchesDetailsTooltipData();
    const getMatchesDetailsAction = new fromTooltipContainerActions.GetMatchesDetails(data.Request);

    spyOn(store, 'dispatch');
    instance.handleMatchesMouseEnter(data);

    expect(store.dispatch).toHaveBeenCalledWith(getMatchesDetailsAction);
  });

  it('should dispatch close matches tooltip action on mouse leave matches field', () => {
    const closeMatchesTooltipAction = new fromTooltipContainerActions.CloseMatchesDetailsTooltip();

    spyOn(store, 'dispatch');
    instance.handleMatchesMouseLeave();

    expect(store.dispatch).toHaveBeenCalledWith(closeMatchesTooltipAction);
  });

  it('should dispatch open matches details tooltip action when matches details loaded', () => {
    const matchesDetails: string[] = ['Administrative Assistant (25) - *Denver'];
    const openMatchesDetailsTooltipAction = new fromTooltipContainerActions.OpenMatchesDetailsTooltip();
    instance.matchesDetailsTooltipData = generateMatchesDetailsTooltipData();

    spyOn(store, 'dispatch');
    instance.openMatchesDetailsTooltip(matchesDetails);

    expect(store.dispatch).toHaveBeenCalledWith(openMatchesDetailsTooltipAction);
  });
});
