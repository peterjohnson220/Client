export interface JobDescriptionControlId {
  Id: number;
  SectionId: number;
}

export interface JobDescriptionControl extends JobDescriptionControlId {
  Label: string;
  Type: string;
  EditorType: string;
  ControlVersion: number;
  Data: any[];
  AdditionalProperties?: any;
  Statuses: string[];
}
