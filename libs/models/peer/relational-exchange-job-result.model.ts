export interface RelationalExchangeJobResult {
  ExchangeJobId: number;
  ExchangeJobTitle: string;
  ExchangeJobTitleShort: string;
  ExchangeJobCode: string;
  ExchangeJobFamily: string;

  MDJobsBaseId?: number;
  MDJobCode: string;
  MDJobTitle: string;

  RelationalJobCode: string;
  RelationalJobCodeName: string;
  RelationalFamilyGroupCode: string;
  RelationalFamilyGroupName: string;
  RelationalCategory1Code: string;
  RelationalCategory1Name: string;
  RelationalCategory2Code: string;
  RelationalCategory2Name: string;
  RelationalCategoryGroupName: string;
  RelationalCategoryGroupDescription: string;
  RelationalTypeLevel: string;

  IsSelected: boolean;
}

export function getMockRelationalExchangeJobResult(): RelationalExchangeJobResult {
  return {
    ExchangeJobId: 1,
    ExchangeJobCode: 'MOCK_EXCHANGE_JOB_CODE',
    ExchangeJobTitle: 'MOCK_EXCHANGE_JOB_TITLE',
    ExchangeJobTitleShort: 'MOCK_EXCHANGE_JOB_TITLE_SHORT',
    ExchangeJobFamily: 'MOCK_EXCHANGE_JOB_FAMILY',
    IsSelected: false,
    MDJobsBaseId: null,
    MDJobCode: 'MOCK_MD_JOB_CODE',
    MDJobTitle: 'MOCK_MD_JOB_TITLE',
    RelationalJobCode: 'MOCK_RELATIONAL_JOB_CODE',
    RelationalJobCodeName: 'MOCK_RELATIONAL_JOB_CODE_NAME',
    RelationalFamilyGroupCode: 'MOCK_RELATIONAL_FAMILY_GROUP_CODE',
    RelationalFamilyGroupName: 'MOCK_RELATIONAL_FAMILY_GROUP_NAME',
    RelationalCategory1Code: 'MOCK_RELATIONAL_CATEGORY1_CODE',
    RelationalCategory1Name: 'MOCK_RELATIONAL_CATEGORY1_NAME',
    RelationalCategory2Code: 'MOCK_RELATIONAL_CATEGORY2_CODE',
    RelationalCategory2Name: 'MOCK_RELATIONAL_CATEGORY2_NAME',
    RelationalCategoryGroupName: 'MOCK_RELATIONAL_CATEGORY_GROUP_NAME',
    RelationalCategoryGroupDescription: 'MOCK_RELATIONAL_CATEGORY_GROUP_DESC',
    RelationalTypeLevel: 'MOCK_RELATIONAL_TYPE_LEVEL'
  };
}
