import * as cloneDeep from 'lodash.clonedeep';

import * as fromBulkExportPopoverActions from '../actions/bulk-export-popover.actions';
import { ControlLabel } from '../../shared/models/control-label.model';
import { JobDescriptionBulkExportPayload } from '../models/job-description-bulk-export-payload.model';

export interface State {
  controlLabels: ControlLabel[];
  loadingControlLabels: boolean;
  loadingControlLabelsError: boolean;
  loadingViewNames: boolean;
  loadingViewNamesError: boolean;
  noPublishedJobDescriptions: boolean;
  openingBulkExportPopover: boolean;
  openingBulkExportPopoverError: boolean;
  viewNames: string[];
  bulkExporting: boolean;
  bulkExportPayload: JobDescriptionBulkExportPayload;
  bulkExportError: string;
}

export const initialState: State = {
  controlLabels: null,
  loadingControlLabels: false,
  loadingControlLabelsError: false,
  loadingViewNames: false,
  loadingViewNamesError: false,
  noPublishedJobDescriptions: false,
  openingBulkExportPopover: false,
  openingBulkExportPopoverError: false,
  viewNames: [],
  bulkExporting: false,
  bulkExportPayload: null,
  bulkExportError: ''
};

export function reducer(state = initialState, action: fromBulkExportPopoverActions.Actions): State {
  switch (action.type) {
    case fromBulkExportPopoverActions.LOAD_CONTROL_LABELS:
      return {
        ...state,
        loadingControlLabels: true,
        noPublishedJobDescriptions: false
      };
    case fromBulkExportPopoverActions.LOAD_CONTROL_LABELS_ERROR:
      return {
        ...state,
        loadingControlLabels: false,
        loadingControlLabelsError: true
      };
    case fromBulkExportPopoverActions.LOAD_CONTROL_LABELS_SUCCESS:
      return {
        ...state,
        loadingControlLabels: false,
        controlLabels: cloneDeep(action.payload)
      };
    case fromBulkExportPopoverActions.LOAD_VIEW_NAMES:
      return {
        ...state,
        loadingViewNames: true
      };
    case fromBulkExportPopoverActions.LOAD_VIEW_NAMES_ERROR:
      return {
        ...state,
        loadingViewNames: false,
        loadingViewNamesError: true
      };
    case fromBulkExportPopoverActions.LOAD_VIEW_NAMES_SUCCESS:
      return {
        ...state,
        loadingViewNames: false,
        viewNames: cloneDeep(action.payload)
      };
    case fromBulkExportPopoverActions.NO_PUBLISHED_JOB_DESCRIPTIONS:
      return {
        ...state,
        loadingControlLabels: false,
        noPublishedJobDescriptions: true
      };
    case fromBulkExportPopoverActions.OPEN_BULK_EXPORT_POPOVER:
      return {
        ...state,
        openingBulkExportPopover: true
      };
    case fromBulkExportPopoverActions.OPEN_BULK_EXPORT_POPOVER_ERROR:
      return {
        ...state,
        openingBulkExportPopover: false,
        openingBulkExportPopoverError: true
      };
    case fromBulkExportPopoverActions.BULK_EXPORT:
      return {
        ...state,
        bulkExporting: true,
        bulkExportPayload: action.payload,
        bulkExportError: ''
      };
    case fromBulkExportPopoverActions.BULK_EXPORT_ERROR:
      return {
        ...state,
        bulkExporting: false,
        bulkExportPayload: null,
        bulkExportError: action.error.error.Message
      };
    case fromBulkExportPopoverActions.BULK_EXPORT_SUCCESS:
      return {
        ...state,
        bulkExporting: false,
        bulkExportPayload: null,
        bulkExportError: ''
      };
    default:
      return state;
  }
}

export const getControlLabelsLoading = (state: State) => state.loadingControlLabels;
export const getControlLabelsLoadingError = (state: State) => state.loadingControlLabelsError;
export const getControlLabels = (state: State) => state.controlLabels;
export const getViewNamesLoading = (state: State) => state.loadingViewNames;
export const getViewNamesLoadingError = (state: State) => state.loadingViewNamesError;
export const getViewNames = (state: State) => state.viewNames;
export const getNoPublishedJobDescriptions = (state: State) => state.noPublishedJobDescriptions;
export const getBulkExportError = (state: State) => state.bulkExportError;
