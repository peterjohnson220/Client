import {CredentialsPackage} from 'libs/models/hris-api/connection/request';

export interface WorkdayRestCredentialsPackage extends CredentialsPackage {
  UserName: string;
  Password: string;
  employeeReportUrl: string;
  jobReportUrl: string;
  paymarketReportUrl: string;
  structureReportUrl: string;
  structureMappingReportUrl: string;
}
