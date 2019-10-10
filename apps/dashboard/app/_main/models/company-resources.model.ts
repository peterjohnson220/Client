export interface CompanyResources {
    Folders: Folder[];
    OrphanedCompanyResources: OrphanedCompanyResource[];
}

export interface Folder {
    CompanyResourcesFoldersId: number;
    CompanyId: number;
    FolderName: string;
    CreateDate: Date;
    CreateUser: number;
    CompanyResources: CompanyResource[];
}

export interface CompanyResource {
    CompanyResourceId: number;
    CompanyId: number;
    ResourceType: string;
    ResourceTitle: string;
    LinkUrl: string;
    FileName: string;
    FileDisplayName: string;
    CreateDate: Date;
    CreateUser: number;
    CompanyResourcesFoldersId: number;
}

export interface OrphanedCompanyResource {
    CompanyResourceId: number;
    CompanyId: number;
    ResourceType: string;
    ResourceTitle: string;
    LinkUrl: string;
    FileName: string;
    FileDisplayName: string;
    CreateDate: Date;
    CreateUser: number;
    CompanyResourcesFoldersId: number;
}
