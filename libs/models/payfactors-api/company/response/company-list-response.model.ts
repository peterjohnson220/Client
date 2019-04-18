export interface CompanyListResponseModel {
    CompanyId: number;
    CompanyName: string;
    ClientType: string;
    GroupName: string;
    GroupDisplayName: string;
    Status: string;
    ServicesRep: string;
    CustomerSuccessMgr: string;
    TicketCount: number;
    NotesCount: number;
    UserCount: number;
}

export function generateMockCompanyListResponseModel(): CompanyListResponseModel {
    return {
        CompanyId: 1,
        CompanyName: 'MockCompanyName',
        ClientType: 'MockClientType',
        GroupName: 'MockGroupName',
        GroupDisplayName: 'MockGroupDisplayName',
        Status: 'MockStatus',
        ServicesRep: 'MockServiceRep',
        CustomerSuccessMgr: 'MockCustomerSuccessMgr',
        TicketCount: 0,
        NotesCount: 0,
        UserCount: 0,
    };
}
