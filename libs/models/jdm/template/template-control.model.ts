export interface TemplateControl {
    Id: number;
    SectionId: number;
    Label: string;
    Type: string;
    EditorType: string;
    ControlVersion: number;
    Data: any[];
    AdditionalProperties?: object;
}
