import { JobDescription } from '../jdm/job-description.model';
import { CompanyStructureInfo } from '../structures';

export class JobInfoResponse {
  JobInfo: CompanyJob;
  JobSummaryObj: JobDescriptionSummary;
  StructureInfo: CompanyStructureInfo[];
}

export interface CompanyJob {
  CompanyJobId: number;
  CompanyId?: number;
  JobTitle: string;
  JobLevel: string;
  JobFamily: string;
  JobCode: string;
  JobDescription: string;
  FLSAStatus: string;
  JobStatus?: boolean;
  CompanyJobDescriptionTemplateId: number;
  TemplateName: string;
  CompanyJobsAttachments: CompanyJobAttachment[];
  PublicView?: any;
  CreateDate?: Date;
  CreateUser?: number;
  EditDate?: Date;
  EditUser?: number;
  UdfChar1: string;
  UdfChar2: string;
  UdfChar3: string;
  UdfChar4: string;
  UdfChar5: string;
  UdfChar6: string;
  UdfChar7: string;
  UdfChar8: string;
  UdfChar9: string;
  UdfChar10: string;
  UdfChar11: string;
  UdfChar12: string;
  UdfChar13: string;
  UdfChar14: string;
  UdfChar15: string;
  UdfChar16: string;
  UdfChar17: string;
  UdfChar18: string;
  UdfChar19: string;
  UdfChar20: string;
  UdfChar21: string;
  UdfChar22: string;
  UdfChar23: string;
  UdfChar24: string;
  UdfChar25: string;
  UdfChar26: string;
  UdfChar27: string;
  UdfChar28: string;
  UdfChar29: string;
  UdfChar30: string;
  UdfChar31: string;
  UdfChar32: string;
  UdfChar33: string;
  UdfChar34: string;
  UdfChar35: string;
  UdfChar36: string;
  UdfChar37: string;
  UdfChar38: string;
  UdfChar39: string;
  UdfChar40: string;
  UdfChar41: string;
  UdfChar42: string;
  UdfChar43: string;
  UdfChar44: string;
  UdfChar45: string;
  UdfChar46: string;
  UdfChar47: string;
  UdfChar48: string;
  UdfChar49: string;
  UdfChar50: string;
}

export interface JobDescriptionSummary {
  JobDescriptionId: number;
  JobSummary: string;
  JobDescriptionManagementEnabled: boolean;
  CompanyJobCode: string;
  CompanyJobId: number;
  HasMultipleVersions?: boolean;
  JobDescription?: JobDescription;
}

export interface CompanyJobAttachment {
  CompanyJobAttachments_ID: number;
  CompanyJobID: number;
  CompanyID: string;
  Filename: string;
  CreateDateExt: Date;
  CreateUser: number;
  DisplayName: string;
}

export function generateMockCompanyJob(): CompanyJob {
  return {
    CompanyJobId: 1,
    CompanyId: 1,
    JobTitle: 'MockCompanyJobTitle',
    JobLevel: 'MockJobLevel',
    JobFamily: 'MockJobFamily',
    JobCode: 'MockCompanyJobCode',
    JobDescription: 'MockJobDescription',
    FLSAStatus: 'MockFSLAStatus',
    JobStatus: true,
    CompanyJobDescriptionTemplateId: 1,
    TemplateName: 'MockTemplateName',
    CompanyJobsAttachments: [],
    PublicView: true,
    CreateDate: null,
    CreateUser: null,
    EditDate: null,
    EditUser: null,
    UdfChar1: 'MockUdf_1',
    UdfChar2: 'MockUdf_2',
    UdfChar3: 'MockUdf_3',
    UdfChar4: 'MockUdf_4',
    UdfChar5: 'MockUdf_5',
    UdfChar6: 'MockUdf_6',
    UdfChar7: 'MockUdf_7',
    UdfChar8: 'MockUdf_8',
    UdfChar9: 'MockUdf_9',
    UdfChar10: 'MockUdf_10',
    UdfChar11: 'MockUdf_11',
    UdfChar12: 'MockUdf_12',
    UdfChar13: 'MockUdf_13',
    UdfChar14: 'MockUdf_14',
    UdfChar15: 'MockUdf_15',
    UdfChar16: 'MockUdf_16',
    UdfChar17: 'MockUdf_17',
    UdfChar18: 'MockUdf_18',
    UdfChar19: 'MockUdf_19',
    UdfChar20: 'MockUdf_20',
    UdfChar21: 'MockUdf_21',
    UdfChar22: 'MockUdf_22',
    UdfChar23: 'MockUdf_23',
    UdfChar24: 'MockUdf_24',
    UdfChar25: 'MockUdf_25',
    UdfChar26: 'MockUdf_26',
    UdfChar27: 'MockUdf_27',
    UdfChar28: 'MockUdf_28',
    UdfChar29: 'MockUdf_29',
    UdfChar30: 'MockUdf_30',
    UdfChar31: 'MockUdf_31',
    UdfChar32: 'MockUdf_32',
    UdfChar33: 'MockUdf_33',
    UdfChar34: 'MockUdf_34',
    UdfChar35: 'MockUdf_35',
    UdfChar36: 'MockUdf_36',
    UdfChar37: 'MockUdf_37',
    UdfChar38: 'MockUdf_38',
    UdfChar39: 'MockUdf_39',
    UdfChar40: 'MockUdf_40',
    UdfChar41: 'MockUdf_41',
    UdfChar42: 'MockUdf_42',
    UdfChar43: 'MockUdf_43',
    UdfChar44: 'MockUdf_44',
    UdfChar45: 'MockUdf_45',
    UdfChar46: 'MockUdf_46',
    UdfChar47: 'MockUdf_47',
    UdfChar48: 'MockUdf_48',
    UdfChar49: 'MockUdf_49',
    UdfChar50: 'MockUdf_50',
  };
}
