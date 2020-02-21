import { BaseControl } from './base-control';
import { Layout } from './layout';

export interface Column {
  Layout: Layout;
  Controls: BaseControl[];
}
