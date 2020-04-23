export interface LoadingProgressBarModel {
  interval: number;
  intervalValue: number;
  progressive: boolean;
  animated: boolean;
  title: string;
}
export function GetLoadingProgressDefaults(): LoadingProgressBarModel {
  return {
    interval: 5,
    intervalValue: 20,
    progressive: true,
    animated: false,
    title: 'Uploading...'
  };
}
