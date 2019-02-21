import {DateFormatItem} from '../models';

export const ORG_DATA_UPLOAD_URL = '/odata/LoaderFieldMappings.UploadAndGetColumnNames';
export const ORG_DATA_REMOVE_URL = '/odata/LoaderFieldMappings.RemoveDataFile';
export const ORG_DATA_CLIENTFIELDS_INDEX_RESET = -1;
export const ORG_DATA_PF_PAYMARKET_FIELDS = [
  'PayMarket',
  'Country_Code',
  'Currency_Code',
  'Linked_PayMarket',
  'Linked_AdjPct'
];

export const ORG_DATA_PF_JOB_FIELDS = [
  'Job_Code',
  'Job_Title',
  'Job_Level',
  'Job_Family',
  'FLSA_Status',
  'Job_Description'
];

export const ORG_DATA_PF_STRUCTURE_FIELDS = [
  'Structure_Code',
  'Structure_Name',
  'Grade_Code',
  'PayMarket',
  'Currency',
  'Rate',
  'Min',
  'Mid',
  'Max'
];

export const ORG_DATA_PF_STRUCTURE_MAPPING_FIELDS = [
  'Job_Code',
  'Structure_Code',
  'Grade_Code',
  'PayMarket'
];

export const ORG_DATA_PF_EMPLOYEE_FIELDS = [
  'Employee_ID',
  'Job_Code',
  'First_Name',
  'Middle_Name',
  'Last_Name',
  'Gender',
  'PayMarket',
  'Manager_Employee_ID',
  'FLSA_Status',
  'DOB',
  'City',
  'State',
  'Zip',
  'Country',
  'Facility',
  'Department',
  'Location',
  'DOH',
  'Employee_Status',
  'Base',
  'Rate',
  'Bonus',
  'BonusPct',
  'Bonus_Target',
  'BonusTargetPct',
  'STI',
  'TCC',
  'TargetTCC',
  'LTI',
  'TargetLTIP',
  'TDC',
  'TargetTDC',
  'Allow',
  'Fixed',
  'TGP',
  'Remun',
  'Currency_Code',
  'Email_Address',
  'FTE',
  'PerformanceRating_PF',
  'DataEffectiveDate_PF',
  'Ethnicity_PF',
  'DateOfEntry_PF',
  'STIElig',
  'LTIElig'
];

export const DATE_FORMATS: DateFormatItem[] = [
  {text: 'MM/dd/yyyy (ex: 06/29/2015)', value: 'MM/dd/yyyy'},
  {text: 'M/d/yyyy (ex: 6/29/2015)', value: 'M/d/yyyy'},
  {text: 'MM/dd/yy (ex: 06/29/15)', value: 'MM/dd/yy'},
  {text: 'M/d/yy (ex: 6/29/15)', value: 'M/d/yy'},
  {text: 'dd/MM/yyyy (ex: 29/06/2015)', value: 'dd/MM/yyyy'},
  {text: 'd/M/yyyy (ex: 29/6/2015)', value: 'd/M/yyyy'},
  {text: 'dd/MM/yy (ex: 29/06/15)', value: 'dd/MM/yy'},
  {text: 'd/M/yy (ex: 29/6/15)', value: 'd/M/yy'},
  {text: 'MM-dd-yyyy (ex: 06-29-2015)', value: 'MM-dd-yyyy'},
  {text: 'M-d-yyyy (ex: 6-29-2015)', value: 'M-d-yyyy'},
  {text: 'MM-dd-yy (ex: 06-29-15)', value: 'MM-dd-yy'},
  {text: 'M-d-yy (ex: 6-29-15)', value: 'M-d-yy'},
  {text: 'dd-MM-yyyy (ex: 29-06-2015)', value: 'dd-MM-yyyy'},
  {text: 'd-M-yyyy (ex: 29-6-2015)', value: 'd-M-yyyy'},
  {text: 'dd-MM-yy (ex: 29-06-15)', value: 'dd-MM-yy'},
  {text: 'd-M-yy (ex: 29-6-15)', value: 'd-M-yy'},
  {text: 'dd-MMM-yyyy (ex: 29-Jun-2015)', value: 'dd-MMM-yyyy'},
  {text: 'yyyy/MM/dd (ex: 2015/06/29)', value: 'yyyy/MM/dd'},
  {text: 'yyyy/dd/MM (ex: 2015/29/06)', value: 'yyyy/dd/MM'},
  {text: 'yy/MM/dd (ex: 15/06/29)', value: 'yy/MM/dd'},
  {text: 'yy/dd/MM (ex: 15/29/06)', value: 'yy/dd/MM'},
  {text: 'yyyy/M/d (ex: 2015/6/29)', value: 'yyyy/M/d'},
  {text: 'yyyy/d/M (ex: 2015/29/6)', value: 'yyyy/d/M'},
  {text: 'yy/M/d (ex: 15/6/29)', value: 'yy/M/d'},
  {text: 'yy/d/M (ex: 15/29/6)', value: 'yy/d/M'},
  {text: 'yyyy-MM-dd (ex: 2015-06-29)', value: 'yyyy-MM-dd'},
  {text: 'yyyy-dd-MM (ex: 2015-29-06)', value: 'yyyy-dd-MM'},
  {text: 'yy-MM-dd (ex: 15-06-29)', value: 'yy-MM-dd'},
  {text: 'yy-dd-MM (ex: 15-29-06)', value: 'yy-dd-MM'},
  {text: 'yyyy-M-d (ex: 2015-6-29)', value: 'yyyy-M-d'},
  {text: 'yyyy-d-M (ex: 2015-29-6)', value: 'yyyy-d-M'},
  {text: 'yy-M-d (ex: 15-6-29)', value: 'yy-M-d'},
  {text: 'yy-d-M (ex: 15-29-6)', value: 'yy-d-M'},
  {text: 'dd MMM yyyy (ex: 29 Jun 2015)', value: 'dd MMM yyyy'},
  {text: 'dd MMMM yyyy (ex: 29 June 2015)', value: 'dd MMM yyyy'},
];

export const DELIMITER_LOADER_SETTING_KEY_NAME = 'Delimiter';
export const DATEFORMAT_LOADER_SETTING_KEY_NAME = 'DateFormat';
