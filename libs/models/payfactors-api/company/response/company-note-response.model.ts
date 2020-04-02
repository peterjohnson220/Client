export interface CompanyNote {
    Id: number;
    Note: string;
    CreateDate?: Date;
    CreateUser?: number;
    FirstName: string;
    LastName: string;
    UserPiture?: string;
    CompanyId: number;
}

export function getDefaultCompanyNote(): CompanyNote {
    return {
        Id: 0,
        Note: '',
        CreateDate: new Date(Date.now()),
        CreateUser: -1,
        FirstName: '',
        LastName: '',
        UserPiture: '',
        CompanyId: 1
    };
}
