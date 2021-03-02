import { LoaderType } from 'libs/features/loaders/org-data-loader/constants';

export interface EntityChoiceForRedropModel {
  File: File;
  DisplayText: string;
  FileBeginsWith: string;
  templateReferenceConstants: LoaderType.Redrop;
  columnNames: string[];
  isLoadingFinish: boolean;
}

export function getEntityChoiceForRedrop(): EntityChoiceForRedropModel {
  return {
    File: null,
    DisplayText: 'Archive Re-Drop',
    FileBeginsWith: 'exportedsourcerecords',
    templateReferenceConstants: LoaderType.Redrop,
    columnNames: null,
    isLoadingFinish: true
  };
}
