export interface UserManagementDto {
    UserId: number;
    CompanyId: number;
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    Password: string;
    Title: string;
    Active?: boolean;
    PhoneNumber: string;
    LastLogin?: Date;
    SsoId: string;
    SendWelcomeEmail: boolean;
    RoleId: number;
    UserSubsidiaryIds: string[];
}

export function generateMockUserManagementDto(): UserManagementDto {
    return {
        UserId: 1,
        CompanyId: 13,
        FirstName: 'MockFirstName',
        LastName: 'MockLastName',
        EmailAddress: 'mock@email.com',
        Password: 'Password1#',
        Title: 'MockTitle',
        Active: true,
        PhoneNumber: '1-800-54-GIANT',
        LastLogin: new Date(2019, 4, 25),
        SsoId: 'MockSso',
        SendWelcomeEmail: false,
        RoleId: 1,
        UserSubsidiaryIds: ['1', '2', '3']
    };
}
