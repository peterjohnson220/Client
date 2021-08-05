import { GenericKeyValue } from 'libs/models';

export interface DetailKeysModel {
  detailKey1: string;
  detailKey2: string;
}

export function getDetailKeysByLoadType(): GenericKeyValue<string, DetailKeysModel>[] {
  return [
    {
      Key: 'Surveys',
      Value: {
        detailKey1: 'Survey Code',
        detailKey2: 'Survey Id'
      }
    }
  ];
}
