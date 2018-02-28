import { TimelineActivityDto } from '../../../../../../libs/models/dashboard';
import { Feature, FeatureTypes, TimelineActivity } from '../models';
import { TimelineActivityResponse } from '../../../../../../libs/models/dashboard/timeline-activity-response.model';

export class TimelineActivityMapper {
  public static get BASE_URL(): string { return  location.protocol + '//' + document.location.hostname; }
  public static get AVATAR_BASE_URL(): string { return 'http://1888c0618f50dfcd4eb2-8e3d7b28275f3f67348d5a5232162cf7.r39.cf5.rackcdn.com/avatars/'; }
  public static get ACTIVITY_TYPE(): string { return 'ProjectActivity'; }
  public static get COMMUNITY_TYPE(): string { return 'Community'; }
  public static get RESOURCES_TYPE(): string { return 'Resources'; }
  public static get JOB_DESCRIPTIONS_TYPE(): string { return 'JobDescriptions'; }

  static mapFromResponse(response: TimelineActivityResponse): TimelineActivity[] {
    return this.mapFromDto(response.ViewModels);
  }

  static mapFromDto(dtos: TimelineActivityDto[]): TimelineActivity[] {
    const timelineActivities = [];
    let i = 1;

    for (const dto of dtos) {
      timelineActivities.push({
        Id: dto.Type + String(i++),
        Type: dto.Type,
        SubType: dto.SubType,
        PostedBy: dto.PostedBy.Name,
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
        return this.generateSubjectForCommunity(dto);
      }
      case (this.RESOURCES_TYPE): {
        return this.generateSubjectForResource(dto);
      }
      default: {
        console.log(dto);
        return 'DEFAULT';
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

  static generateSubjectForCommunity(dto: TimelineActivityDto): string {
    const communityUrl = dto.Links.filter( x => x.Type === 'Community')[0].Url;
    const communityFullUrl =  this.BASE_URL + communityUrl;
    const communityHtmlLink = this.generateHtmlLink(communityFullUrl, 'Community', 'Link to community');
    const communityPostUrl = dto.Links.filter(x => x.Type === 'CommunityPost')[0].Url;
    const communityPostFullUrl = this.BASE_URL + communityPostUrl;
    let subject = '';

    switch (dto.SubType) {
      case ('Post'):
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
        const replyPostHtmlLink = this.generateHtmlLink(communityPostFullUrl, 'post', 'Link to community post');
        subject = 'Replied to ' + replyUserProfileHtmlLink + '\'s ' + replyPostHtmlLink + ' in the ' + communityHtmlLink ;
        break;

      default:
        break;
    }

    return subject;
  }

  static generateSubjectForResource(dto: TimelineActivityDto): string {
    const resourcesFeatureUrl = this.BASE_URL + '/marketdata/resources.asp';
    const fetchResourceBaseUrl = this.BASE_URL +  '/marketdata/getcontent.asp?f=';
    const resourceUrl = dto.Links[0].Url;
    const fetchResourceUrl = fetchResourceBaseUrl + resourceUrl;
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

  static generateHtmlLink(url: string, label: string, title?: string): string {
    return '<a href=\"' + url + '\" title=\"' + title + '\">' + label + '</a>';
  }

  static generatePostedByUrl(dto: TimelineActivityDto): string {
    switch (dto.Type) {
      case (this.COMMUNITY_TYPE): {
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
        postedByProfileUrl = dto.Links.filter(x => x.Type === 'CommunityPostProfile')[0].Url;
        break;

      case ('Reply'):
        postedByProfileUrl = dto.Links.filter(x => x.Type === 'CommunityReplyProfile')[0].Url;
        break;
    }
    return baseUrl + postedByProfileUrl;
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
}
