import { ControlTypeAttribute } from './control-type-attribute.model';

export class ControlType {
  CompanyId: number;
  Type: string;
  Name: string;
  Color: string;
  EditorType: string;
  ReadOnly: boolean;
  Locked: boolean;
  Vertical: boolean;
  ControlVersion: number;
  IsLatest: boolean;
  Attributes: ControlTypeAttribute[];
}
