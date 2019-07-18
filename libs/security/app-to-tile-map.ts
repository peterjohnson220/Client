interface AppToTileMap {
  [appName: string]: { tileName: string };
}

export const AppToTileMapping: AppToTileMap = {
  'comphub': { tileName: 'Quick Price' },
  'data-insights': { tileName: 'Data Insights'}
};
