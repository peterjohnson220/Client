export interface Scope {
  Label: string;
  Group?: string;
  Value: string;
}

export enum ScopeLabel {
  Industry = 'Industry',
  Size = 'Size',
  Location = 'Location'
}
