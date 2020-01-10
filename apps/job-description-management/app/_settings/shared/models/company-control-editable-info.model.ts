export interface CompanyControlEditableInfo {
    IsEditable: boolean;
    ErrorMessage: string;
    AffectedJobs: number;
    AffectedTemplateNames: string[];
}

export function generateDefaultCompanyControlEditableInfo(): CompanyControlEditableInfo {
    return {
        IsEditable: true,
        ErrorMessage: '',
        AffectedJobs: 0,
        AffectedTemplateNames: null
    };
}
