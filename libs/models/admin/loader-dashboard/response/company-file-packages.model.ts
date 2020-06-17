import {CompanyFilePackagesDetail} from './company-file-packages-detail.model';

export interface CompanyFilePackagesResponse {
  CompanyFilePackage_ID: number;
  Company_ID: number;
  Company_Name: string;
  LastModifiedDate: Date;
  CreateDate: Date;
  LoaderConfigurationGroup_ID: number;
  LoadType: string;
  ValidationOnly: boolean;
  files: CompanyFilePackagesDetail[];
}
