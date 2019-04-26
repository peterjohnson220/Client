interface AppToTileMap {
  [appName: string]: { tileName: string };
}

export const AppToTileMapping: AppToTileMap = {
  'comphub': { tileName: 'Quick Price' },
  'dataviews': { tileName: 'Data Views' }
};
