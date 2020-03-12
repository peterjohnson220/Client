import { Styling } from '../../../apps/total-rewards/app/shared/models';

export function formatDefaultStyles(style: Styling): object {
  let fontString = '';
  if (style.Emphasis) {
    fontString = style.Emphasis;
  }
  if (style.FontSizeInPoints) {
    fontString += ' ' + style.FontSizeInPoints + 'pt ';
  }
  if (style.FontFamily) {
    fontString += style.FontFamily;
  }
  return {
    'font': fontString,
    'color': style.FontColor
  };
}
