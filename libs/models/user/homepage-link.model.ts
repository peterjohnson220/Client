export class HomePageLink {
  Url: string;
  SystemUserGroupName: string;
  LogoImgSrc: string;
}

export function generateMocKHomePageLink(): HomePageLink {
  return {
    Url: 'url',
    SystemUserGroupName: '1',
    LogoImgSrc:  'Img Src'
  };
}
