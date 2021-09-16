import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { JobSummaryPrintData } from 'libs/models/comphub';

import * as fromJobSummaryPrintActions from '../actions/job-summary-print.actions';

export interface State {
  jobSummaryPrintDataAsyncObj: AsyncStateObj<JobSummaryPrintData>;
}

const initialState: State = {
  jobSummaryPrintDataAsyncObj: generateDefaultAsyncStateObj<JobSummaryPrintData>(null)
};

export function reducer(state = initialState, action: fromJobSummaryPrintActions.Actions): State {
  switch (action.type) {
    case fromJobSummaryPrintActions.GET_JOB_SUMMARY_PRINT_DATA:
      return AsyncStateObjHelper.loading(state, 'jobSummaryPrintDataAsyncObj');
    case fromJobSummaryPrintActions.GET_JOB_SUMMARY_PRINT_DATA_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'jobSummaryPrintDataAsyncObj', action.payload);
    case fromJobSummaryPrintActions.GET_JOB_SUMMARY_PRINT_DATA_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'jobSummaryPrintDataAsyncObj');
    default: {
      return state;
    }
  }
}

export const getJobSummaryPrintDataAsyncObj = (state: State) => state.jobSummaryPrintDataAsyncObj;
