import {
    LoadingLoaderSettings, LoadingLoaderSettingsError, LoadingLoaderSettingsSuccess, SavingLoaderSettings, SavingLoaderSettingsError,
    SavingLoaderSettingsSuccess
} from 'libs/features/org-data-loader/state/actions/loader-settings.actions';

import { OrgDataFilenamePatternSetFactory } from '../helpers/org-data-filename-pattern-set-factory';
import { LoaderSetting } from '../models';
import { initialState, reducer } from './org-data-filename-patterns.reducer';

jest.mock('../helpers/org-data-filename-pattern-set-factory');

describe('org-data-filename-patterns-reducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state given LoadingLoaderSettings action', () => {
    const action = new LoadingLoaderSettings(5);
    const actualState = reducer(undefined, action);
    expect(actualState).toBe(initialState);
  });

  it('should return initial state given LoadingLoaderSettingsError action', () => {
    const action = new LoadingLoaderSettingsError();
    const actualState = reducer(undefined, action);
    expect(actualState).toBe(initialState);
  });

  it('should return initial state given SavingLoaderSettings action', () => {
    const action = new SavingLoaderSettings('hi');
    const actualState = reducer(undefined, action);
    expect(actualState).toBe(initialState);
  });

  it('should return initial state given SavingLoaderSettingsError action', () => {
    const action = new SavingLoaderSettingsError();
    const actualState = reducer(undefined, action);
    expect(actualState).toBe(initialState);
  });

  it('should return initial state given SavingLoaderSettingsSuccess action', () => {
    const action = new SavingLoaderSettingsSuccess();
    const actualState = reducer(undefined, action);
    expect(actualState).toBe(initialState);
  });

  describe('Given LoadingLoaderSettingsSuccess action', () => {
    it('should return current state given null settings', () => {
      const action = new LoadingLoaderSettingsSuccess(null);
      const actualState = reducer(undefined, action);
      expect(actualState).toBe(initialState);
    });

    it('should call create on the factory', () => {
      const payload: Array<LoaderSetting> = [{
        LoaderSettingsId: 1,
        KeyName: 'Have',
        KeyValue: 'Fun'
      }];
      const action = new LoadingLoaderSettingsSuccess(payload);

      const actualState = reducer(undefined, action);

      expect(OrgDataFilenamePatternSetFactory.prototype.create).toBeCalled();
      expect(actualState).toEqual(initialState);
    });
  });
});
