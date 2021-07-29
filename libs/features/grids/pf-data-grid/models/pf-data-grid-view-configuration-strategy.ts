import { ViewConfigurationStrategyType } from '../enums';

export interface ViewConfigurationStrategy {
  Type: ViewConfigurationStrategyType;
  ViewName: string;
  ReferenceId?: number;
}
