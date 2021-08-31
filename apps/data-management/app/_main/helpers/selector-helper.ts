import {ConnectionSummary, Provider} from '../models';
import isObject from 'lodash/isObject';

export class SelectorHelper {
  static getEntitySelectionPageRedirectionStatus(summary: ConnectionSummary, provider: Provider): boolean {
    return !isObject(provider) && isObject(summary) && !isObject(summary.provider);
  }
}
