import { ElementRef } from '@angular/core';

export interface GridRowActionsConfig {
  Title: string;
  Width: number;
  ActionsTemplate?: ElementRef<any>;
  Position: PositionType;
  CustomClass: string[];
}

export enum PositionType {
  Left,
  Right
}

export function getDefaultGridRowActionsConfig(): GridRowActionsConfig {
  return {
    Title: 'Actions',
    Position: PositionType.Left,
    Width: 70,
    CustomClass: null
  };
}
