import { GenericKeyValue } from 'libs/models/common';

export interface MDScopeResponse {
  Locations: GenericKeyValue<string, string[]>[];
  Industries: string[];
  Sizes: GenericKeyValue<string, string[]>[];
}
