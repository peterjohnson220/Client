export interface SurveyNote {
    Id: number;
    Note: string;
    CreateDate?: Date;
    CreateUser?: number;
    FirstName: string;
    LastName: string;
    UserPicture?: string;
    SurveyId: number;
}

export function getDefaultSurveyNote(): SurveyNote {
    return {
        Id: 0,
        Note: '',
        CreateDate: new Date(Date.now()),
        CreateUser: -1,
        FirstName: '',
        LastName: '',
        UserPicture: '',
        SurveyId: 1
    };
}
