import { KendoUpload } from 'libs/models';

export interface CompanyResourceUploadState {
  Resources: KendoUpload[];
  IsModalOpen: boolean;
}

export function generateMockCompanyResourceUploadModalState(): CompanyResourceUploadState {
  return {
    Resources: [],
    IsModalOpen: true
  };
}

