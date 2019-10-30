export interface CompanyResources {
    Folders: CompanyResourceFolder[];
    OrphanedCompanyResources: OrphanedCompanyResource[];
}

export interface CompanyResourceFolder {
    CompanyId: number;
    CompanyResources: CompanyResource[];
    CompanyResourcesFoldersId: number;
    CreateDate: Date;
    CreateUser: number;
    FolderName: string;
}

export interface CompanyResource {
    CompanyId: number;
    CompanyResourceId: number;
    CompanyResourcesFoldersId: number;
    CreateDate: Date;
    CreateUser: number;
    FileDisplayName: string;
    FileName: string;
    LinkUrl: string;
    ResourceTitle: string;
    ResourceType: string;
}

export interface OrphanedCompanyResource {
    CompanyId: number;
    CompanyResourceId: number;
    CompanyResourcesFoldersId: number;
    CreateDate: Date;
    CreateUser: number;
    FileDisplayName: string;
    FileName: string;
    LinkUrl: string;
    ResourceTitle: string;
    ResourceType: string;
}
