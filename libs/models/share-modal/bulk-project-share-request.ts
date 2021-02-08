export interface BaseShareModalPayload {
  UserIds: number[];
}

export interface BulkProjectShareRequest extends BaseShareModalPayload {
  ProjectIds: number[];
  Message: string;
}
