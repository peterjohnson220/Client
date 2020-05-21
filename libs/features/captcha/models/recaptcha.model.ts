// See https://developers.google.com/recaptcha/docs/display for grecaptcha options

interface RecaptchaRenderParameters {
  sitekey: string;
  theme?: 'light' | 'dark';
  type?: 'audio' | 'image';
  size?: 'compact' | 'normal';
  tabindex?: number;
  badge?: 'bottomright' | 'bottomleft' | 'inline';
  isolated?: boolean;
  callback?(response: string): void;
  'expired-callback'?(): void;
  'error-callback'?(): void;
}

export interface ReCaptcha {
  render(container: (string | HTMLElement), parameters?: RecaptchaRenderParameters): number;
  getResponse(opt_widget_id: number): string;
  reset(opt_widget_id: number): void;
}
