export class JobDescriptionViewConstants {
  public static DEFAULT_VIEW = 'Default';
  public static PUBLIC_VIEW = 'Public';
  public static DRAFT_AND_IN_REVIEW_VIEW = 'Draft & In Review';

  public static SYSTEM_VIEWS: string[] =
  [JobDescriptionViewConstants.DEFAULT_VIEW,
    JobDescriptionViewConstants.PUBLIC_VIEW,
    JobDescriptionViewConstants.DRAFT_AND_IN_REVIEW_VIEW];

  public static PUBLIC_VIEW_OPTIONS =  [
    { display: 'Enabled', value: true},
    { display: 'Disabled', value: false}
  ];

  public static INVALID_CHARACTERS = 'Invalid characters: \\\' \\\" ; < >';
}
