import { KendoUpload } from 'libs/models';

export interface CompanyResourceUploadState {
  Resources: KendoUpload[];
  IsModalOpen: boolean;
  FolderName?: string;
}

export function generateMockCompanyResourceUploadModalState(): CompanyResourceUploadState {
  return {
    Resources: [],
    IsModalOpen: true
  };
}

