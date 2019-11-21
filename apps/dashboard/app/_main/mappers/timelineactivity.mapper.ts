import { TimelineActivityDto, TimelineActivityResponse } from 'libs/models/dashboard';
import { Feature, FeatureTypes, TimelineActivity } from '../models';
import { environment } from 'environments/environment';

export class TimelineActivityMapper {
  public static get BASE_URL(): string { return  location.protocol + '//' + document.location.hostname; }
  public static get AVATAR_BASE_URL(): string { return environment.avatarSource; }
  public static get ACTIVITY_TYPE(): string { return 'ProjectActivity'; }
  public static get COMMUNITY_TYPE(): string { return 'Community'; }
  public static get NEW_COMMUNITY_TYPE(): string { return 'NewCommunity'; }
  public static get RESOURCES_TYPE(): string { return 'Resources'; }
  public static get JOB_DESCRIPTIONS_TYPE(): string { return 'JobDescriptions'; }

  static mapFromResponse(response: TimelineActivityResponse): TimelineActivity[] {
    return this.mapFromDto(response.ViewModels);
  }

  static mapFromDto(dtos: TimelineActivityDto[]): TimelineActivity[] {
    const timelineActivities = [];
    for (const dto of dtos) {
      timelineActivities.push({
        Id: dto.Id,
        Type: dto.Type,
        SubType: dto.SubType,
        PostedBy: dto.PostedBy.Name,
        PostedByInitials: this.generateInitials(dto.PostedBy.Name),
        PostedTime: dto.PostedTime,
        PostedUrl: this.generatePostedByUrl(dto),
        ElapsedTime: dto.ElapsedTime,
        Body: this.generateBody(dto),
        Subject: this.generateSubject(dto),
        AvatarUrl: this.generateAvatarUrl(dto.PostedBy.AvatarUrl, dto.PostedBy.PayfactorsEmployee),
        IsVisible: true
      });
    }

    return timelineActivities;
  }

  static mapFeaturesToTimelineActivityTypes(features: Feature[]): string[] {
    const timelineActivityTypesAsStrings = [];
    for (const feature of features) {
      const typeAsString = TimelineActivityMapper.mapFeatureToTimelineActivityType(feature);
      if (typeAsString !== null) {
        timelineActivityTypesAsStrings.push(typeAsString);
      }
    }
    return timelineActivityTypesAsStrings;
  }

  static mapFeatureToTimelineActivityType(feature: Feature): string {
    switch (feature.Type) {
      case FeatureTypes.Activity: {
        return TimelineActivityMapper.ACTIVITY_TYPE;
      }
      case FeatureTypes.Community: {
        return TimelineActivityMapper.COMMUNITY_TYPE;
      }
      case FeatureTypes.NewCommunity: {
        return TimelineActivityMapper.NEW_COMMUNITY_TYPE;
      }
      case FeatureTypes.Resources: {
        return TimelineActivityMapper.RESOURCES_TYPE;
      }
      case FeatureTypes.JobDescriptions: {
        return TimelineActivityMapper.JOB_DESCRIPTIONS_TYPE;
      }
      default: {
        return null;
      }
    }
  }

  static generateBody(dto: TimelineActivityDto): string {
    switch (dto.SubType) {
      case ('ReleaseNote'): {
        return '';
      }
      default: {
        return dto.Body;
      }
    }
  }

  static generateSubject(dto: TimelineActivityDto): string {
    switch (dto.Type) {
      case (this.ACTIVITY_TYPE): {
        return this.generateSubjectForActivity(dto);
      }
      case (this.COMMUNITY_TYPE): {
      return this.generateSubjectForCommunity(dto, this.COMMUNITY_TYPE);
    }
      case (this.NEW_COMMUNITY_TYPE): {
        return this.generateSubjectForCommunity(dto, this.NEW_COMMUNITY_TYPE);
      }
      case (this.JOB_DESCRIPTIONS_TYPE): {
        return this.generateSubjectForJobDescription(dto);
      }
      case (this.RESOURCES_TYPE): {
        return this.generateSubjectForResource(dto);
      }
    }
  }

  static generateSubjectForActivity(dto: TimelineActivityDto): string {
    const projectUrl = dto.Links[0].Url;
    const fullProjectUrl = this.BASE_URL + projectUrl;
    let projectName = dto.Links[0].DisplayName;
    if (projectName === null || projectName === '') {
      projectName = 'a Project';
    }
    const projectHtmlLink = this.generateHtmlLink(fullProjectUrl, projectName, 'Link to a project.');
    return 'Shared ' + projectHtmlLink + ' with you.';
  }

  static generateSubjectForCommunity(dto: TimelineActivityDto, typeName: string): string {
    const communityUrl = dto.Links.filter( x => x.Type === typeName)[0].Url;
    const communityFullUrl =  this.BASE_URL + communityUrl;
    const communityHtmlLink = this.generateHtmlLink(communityFullUrl, 'Community', 'Link to community');

    let subject = '';

    switch (dto.SubType) {
      case ('Post'):
        const communityPostUrl = dto.Links.filter(x => x.Type === 'CommunityPost')[0].Url;
        const communityPostFullUrl = this.BASE_URL + communityPostUrl;
        const postHtmlLink = this.generateHtmlLink(communityPostFullUrl, 'Posted', 'Link to community post');
        subject = postHtmlLink + ' to the ' + communityHtmlLink;
        if (dto.Internal) {
          subject = postHtmlLink + ' to the ' + dto.CompanyName + ' ' + communityHtmlLink;
        }
        break;

      case ('Reply'):
        const replyUserProfileUrl = dto.Links.filter(x => x.Type === 'CommunityPostProfile')[0].Url;
        const replyUserName = dto.Links.filter(x => x.Type === 'CommunityPostProfile')[0].DisplayName;
        const replyUserProfileHtmlLink = this.generateHtmlLink(replyUserProfileUrl, replyUserName, 'Link to replier profile');
        const replyPostHtmlLink = this.generateHtmlLink(replyUserProfileUrl, 'post', 'Link to community post');
        subject = 'Replied to ' + replyUserProfileHtmlLink + '\'s ' + replyPostHtmlLink + ' in the ' + communityHtmlLink ;
        break;

      case ('Job') :
        const jobTitle = dto.Links.filter(x => x.Type === 'Job')[0].DisplayName;
        const jobUrl = dto.Links.filter(x => x.Type === 'Job')[0].Url;
        const jobPostHtmlLink =  this.generateHtmlLink(jobUrl, jobTitle, 'Link To Job Posting');
        const jobBoardUrl = dto.Links.filter(x => x.Type === 'JobBoard')[0].Url;
        const jobBoardHtmlLink =  this.generateHtmlLink(jobBoardUrl, 'job board', 'Link To Job Board');
        subject = 'Posted a job to the ' +  jobBoardHtmlLink + ' for ' + jobPostHtmlLink;
        break;

      default:
        break;
    }

    return subject;
  }

  static generateSubjectForJobDescription(dto: TimelineActivityDto): string {
    const jdUrl = dto.Links[0].Url;
    const fullJdUrl = this.BASE_URL + jdUrl;
    const jdName = dto.Links[0].DisplayName;
    const jdHtmlLink = this.generateHtmlLink(fullJdUrl, jdName, 'Link to a job description.');
    return 'Sent the job description for ' + jdHtmlLink + ' to you for review.';
  }

  static generateSubjectForResource(dto: TimelineActivityDto): string {
    const resourcesFeatureUrl = this.BASE_URL + '/client/resources';
    const fetchResourceBaseUrl = this.BASE_URL +  '/marketdata/getcontent.asp?f=';
    const fetchCompanyResourceBaseUrl = this.BASE_URL +  '/odata/CloudFiles.DownloadCompanyResource?FileName=';
    const resourceUrl = dto.Links[0].Url;
    const linkType = dto.Links[0].Type;
    let fetchResourceUrl = fetchResourceBaseUrl + resourceUrl;
    let subject = '';
    let htmlLink = '';
    let linkText = '';
    let linkTitle = '';

    switch (dto.SubType) {
      case ('ReleaseNote'):
        linkText = 'Release Notes';
        linkTitle = 'Link to release notes';
        htmlLink = this.generateHtmlLink(fetchResourceUrl, linkText, linkTitle);
        subject = 'Added new ' + htmlLink + '.';
        break;

      case ('Video'):
        linkText = 'video';
        linkTitle = 'Link to resources';
        htmlLink = this.generateHtmlLink(resourcesFeatureUrl, linkText, linkTitle);
        subject = 'Added a new ' + htmlLink + '.';
        break;

      case ('CompanyResource'):
        let openInNewWindow = false;
        if (linkType === 'Document') {
          fetchResourceUrl = fetchCompanyResourceBaseUrl + resourceUrl;
        } else {
          openInNewWindow = true;
          fetchResourceUrl = resourceUrl;
        }
        linkText = 'internal resource';
        linkTitle = 'Link to an internal company resources';
        htmlLink = this.generateHtmlLink(fetchResourceUrl, linkText, linkTitle, openInNewWindow);
        subject = 'Added a new ' + htmlLink + '.';
        break;

      default:
        linkText = 'resource';
        if (dto.Internal) {
          linkText = 'internal resource';
          linkTitle = 'Link to an ' + linkText;
        } else {
          linkText = 'resource';
          linkTitle = 'Link to a ' + linkText;
        }
        htmlLink = this.generateHtmlLink(fetchResourceUrl, linkText, linkTitle);
        subject = 'Add a new ' + htmlLink + '.';
        break;
    }
    return subject;
  }

  static generateHtmlLink(url: string, label: string, title: string, isNewWindow?: boolean): string {
    if (isNewWindow) {
      return '<a href=\"' + url + '\" title=\"' + title + '\" target="_blank">' + label + '</a>';
    }
    return '<a href=\"' + url + '\" title=\"' + title + '\">' + label + '</a>';
  }

  static generatePostedByUrl(dto: TimelineActivityDto): string {
    switch (dto.Type) {
      case (this.COMMUNITY_TYPE): {
        return this.generatePostedByUrlForCommunity(dto);
      }
      case (this.NEW_COMMUNITY_TYPE): {
        return this.generatePostedByUrlForCommunity(dto);
      }
      default: {
        return '#';
      }
    }
  }

  static generatePostedByUrlForCommunity(dto: TimelineActivityDto): string {
    const baseUrl = location.protocol + '//' + document.location.hostname;
    let postedByProfileUrl = '';
    switch (dto.SubType) {
      case ('Post'):
        postedByProfileUrl = baseUrl + dto.Links.filter(x => x.Type === 'CommunityPostProfile')[0].Url;
        break;

      case ('Reply'):
        postedByProfileUrl = baseUrl + dto.Links.filter(x => x.Type === 'CommunityReplyProfile')[0].Url;
        break;

      case ('Job'):
        postedByProfileUrl = dto.Links.filter(x => x.Type === 'JobPostProfile')[0].Url;
        break;
    }
    return  postedByProfileUrl;
  }

  static generateAvatarUrl(url: string, isPayfactorsEmployee: boolean) {
    if ((url == null || url === '') && !isPayfactorsEmployee) {
      return null;
    }
    if ((url == null || url === '' || url === 'default_user.png') && isPayfactorsEmployee) {
      return 'favicon.ico';
    }
    return this.AVATAR_BASE_URL + url;
  }

  static generateInitials(name: string): string {
    if (name == null || name === undefined) {
      return null;
    }

    const splitString = name.split(' ');
    const firstInitial = splitString[0].charAt(0);
    let lastInitial = '';

    if (splitString.length > 1) {
      lastInitial = splitString[splitString.length - 1].charAt(0);
    }
    return firstInitial + lastInitial;
  }
}
