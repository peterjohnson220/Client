import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { TooltipContainerComponent } from './tooltip-container.component';
import {
  MatchesDetailsTooltipData, generateMockSurveyJobResult, JobResult,
  JobDetailsToolTipData, generateMatchesDetailsTooltipData
} from '../../models';
import * as fromTooltipContainerActions from '../../actions/tooltip-container.actions';
import * as fromAddDataReducer from '../../reducers';

describe('TooltipContainerComponent', () => {
  let instance: TooltipContainerComponent;
  let fixture: ComponentFixture<TooltipContainerComponent>;
  let store: Store<fromAddDataReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [ TooltipContainerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(TooltipContainerComponent);
    instance = fixture.componentInstance;
  });

  it('should show job details tooltip when current tooltip index is not the same as the input index', () => {
    const openTooltipAction = new fromTooltipContainerActions.OpenJobDetailsTooltip();
    const jobResult: JobResult = generateMockSurveyJobResult();
    const data: JobDetailsToolTipData = {
      Job: jobResult,
      TargetX: 300,
      TargetY: 579
    };
    const inputTooltipIndex = 1;

    fixture.detectChanges();

    spyOn(store, 'dispatch');
    instance.handleJobTitleClick(data, inputTooltipIndex);

    expect(store.dispatch).toHaveBeenCalledWith(openTooltipAction);
    expect(instance.jobDetailsTooltipIndex).toEqual(inputTooltipIndex);
  });

  it('should not show tooltip when current tooltip index is the same as the input index', () => {
    const closeTooltipAction = new fromTooltipContainerActions.CloseJobDetailsTooltip();
    const jobResult: JobResult = generateMockSurveyJobResult();
    const data: JobDetailsToolTipData = {
      Job: jobResult,
      TargetX: 300,
      TargetY: 579
    };
    const inputTooltipIndex = 1;
    instance.jobDetailsTooltipData = data;
    instance.jobDetailsTooltipIndex = 1;

    spyOn(store, 'dispatch');
    instance.handleJobTitleClick(data, inputTooltipIndex);

    expect(store.dispatch).toHaveBeenCalledWith(closeTooltipAction);
    expect(instance.jobDetailsTooltipIndex).toEqual(-1);
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
