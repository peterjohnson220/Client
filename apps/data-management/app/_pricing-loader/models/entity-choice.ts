
export interface EntityChoice {
  isChecked: boolean;
  DisplayText: string;
  ToolTip: string;
  FileBeginsWith: string;
  File: File;
  isSelectedTab: boolean;
  columnNames: string[];
  dbName?: string;
  isLoadingFinish: boolean;
}

export function getEntityChoicesForPricingLoader(): EntityChoice[] {
  return [
    {
      isChecked: false,
      DisplayText: 'Pricings',
      ToolTip: '',
      FileBeginsWith: 'pricings',
      File: null,
      isSelectedTab: false,
      columnNames: null,
      isLoadingFinish: true,
    },
    {
      isChecked: false,
      DisplayText: 'Pricing Notes',
      ToolTip: '',
      FileBeginsWith: 'pricingnotes',
      File: null,
      isSelectedTab: false,
      columnNames: null,
      isLoadingFinish: true,
    }
  ];
}

export function getMockEntityChoiceList(): EntityChoice[] {
  const mock = getEntityChoicesForPricingLoader();
  mock[0].isChecked = true;
  mock[4].isChecked = true;
  return mock;
}
