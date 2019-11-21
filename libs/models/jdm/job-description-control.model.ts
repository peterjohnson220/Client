export interface JobDescriptionControl extends JobDescriptionControlId {
  Label: string;
  Type: string;
  EditorType: string;
  ControlVersion: number;
  Data: any[];
  AdditionalProperties?: any;
  Statuses: string[];
}

export interface JobDescriptionControlId {
  Id: number;
  SectionId: number;
}
