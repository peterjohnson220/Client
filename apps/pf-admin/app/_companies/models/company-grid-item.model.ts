export class CompanyGridItem {
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

export function generateMockCompanyGridItem(): CompanyGridItem {
    return {
        CompanyId: 1,
        CompanyName: 'MockCompanyName1',
        ClientType: 'MockClientType1',
        GroupName: 'MockGroupName1',
        GroupDisplayName: 'MockGroupDisplayName1',
        Status: 'MockStatus1',
        ServicesRep: 'MockServiceRep1',
        CustomerSuccessMgr: 'MockCustomerSuccessMgr1',
        TicketCount: 0,
        NotesCount: 0,
        UserCount: 0,
    };
}

export function generateMockCompanyGridItems(): CompanyGridItem[] {
    return [
        {
            CompanyId: 1,
            CompanyName: 'MockCompanyName1',
            ClientType: 'MockClientType1',
            GroupName: 'MockGroupName1',
            GroupDisplayName: 'MockGroupDisplayName1',
            Status: 'MockStatus1',
            ServicesRep: 'MockServiceRep1',
            CustomerSuccessMgr: 'MockCustomerSuccessMgr1',
            TicketCount: 0,
            NotesCount: 0,
            UserCount: 0,
        },
        {
            CompanyId: 2,
            CompanyName: 'MockCompanyName2',
            ClientType: 'MockClientType2',
            GroupName: 'MockGroupName2',
            GroupDisplayName: 'MockGroupDisplayName2',
            Status: 'MockStatus2',
            ServicesRep: 'MockServiceRep2',
            CustomerSuccessMgr: 'MockCustomerSuccessMgr2',
            TicketCount: 0,
            NotesCount: 0,
            UserCount: 0,
        },
        {
            CompanyId: 3,
            CompanyName: 'MockCompanyName3',
            ClientType: 'MockClientType3',
            GroupName: 'MockGroupName3',
            GroupDisplayName: 'MockGroupDisplayName3',
            Status: 'MockStatus3',
            ServicesRep: 'MockServiceRep3',
            CustomerSuccessMgr: 'MockCustomerSuccessMgr3',
            TicketCount: 0,
            NotesCount: 0,
            UserCount: 0,
        },
        {
            CompanyId: 4,
            CompanyName: 'MockCompanyName4',
            ClientType: 'MockClientType4',
            GroupName: 'MockGroupName4',
            GroupDisplayName: 'MockGroupDisplayName4',
            Status: 'MockStatus4',
            ServicesRep: 'MockServiceRep4',
            CustomerSuccessMgr: 'MockCustomerSuccessMgr4',
            TicketCount: 0,
            NotesCount: 0,
            UserCount: 0,
        },
        {
            CompanyId: 5,
            CompanyName: 'MockCompanyName5',
            ClientType: 'MockClientType5',
            GroupName: 'MockGroupName5',
            GroupDisplayName: 'MockGroupDisplayName5',
            Status: 'MockStatus5',
            ServicesRep: 'MockServiceRep5',
            CustomerSuccessMgr: 'MockCustomerSuccessMgr5',
            TicketCount: 0,
            NotesCount: 0,
            UserCount: 0,
        },
    ];
}
