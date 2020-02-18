export enum JobRangeModelingResponse {
  Success = 'Success',
  CompanyStructureRangeGroupError = 'An error has occurred while saving this model'
}

export class JobBasedRangeStructuresConstants {
  static readonly STRUCTURE_FAVORITE_STOCK_THUMBNAIL = '/client/structures/assets/images/sampleStructureThumbnail.png';
}

export class JobRangeModelingConstants {
  static readonly MODEL_NAME_UPDATE_ERROR_TIMEOUT = 1500;
  static readonly NOT_FOUND_INDEX = -1;
  static readonly JOB_RANGE_MODELING_LINK = '/job-range-modeling';
}
