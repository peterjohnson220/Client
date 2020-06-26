interface AppToTileMap {
  [appName: string]: { tileName: string };
}

export const AppToTileMapping: AppToTileMap = {
  'comphub': { tileName: 'Quick Price' },
  'data-insights': { tileName: 'Data Insights'},
  'job-description-management': { tileName: 'Job Descriptions'},
  'employees': { tileName: 'Employees'},
  'service': { tileName: 'Service' },
  'paymarkets': { tileName: 'Pay Markets'}
};
