export interface GridConfig {
  PersistColumnWidth: boolean;
  EnableInfiniteScroll?: boolean;
  ScrollToTop?: boolean;
  SelectAllPanelItemName?: string;
  CaptureGridScroll?: boolean;
  IsExpandedRowGrid?: boolean;
  SplitViewColumnsWidth?: number;
}

export class GridConfigHelper {
  static getSplitViewColumnsWidth(gridContainerWidth: number, actionsColumnWidth: number, enableSelection: boolean): number {
    const scrollbarWidth = 17;
    const checkboxColWidth = enableSelection ? 35 : 0;
    return gridContainerWidth - (scrollbarWidth + checkboxColWidth + actionsColumnWidth);
  }
}
