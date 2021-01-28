export class JobDescriptionViewConstants {
  public static DEFAULT_VIEW = 'Default';
  public static PUBLIC_VIEW = 'Public';

  public static SYSTEM_VIEWS: string[] = [JobDescriptionViewConstants.DEFAULT_VIEW, JobDescriptionViewConstants.PUBLIC_VIEW];

  public static PUBLIC_VIEW_OPTIONS =  [
    { display: 'Enabled', value: true},
    { display: 'Disabled', value: false}
  ];

  public static INVALID_CHARACTERS = 'Invalid characters: \\\' \\\" ; < >';
}
