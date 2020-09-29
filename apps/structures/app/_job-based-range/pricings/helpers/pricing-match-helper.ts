export class PricingMatchHelper {
  static splitPricingMatchSource(source: string): {vendor: string, title: string} {
    let vendor = '', title = '';
    if (source == null) {
      return {vendor, title};
    }

    const splitSource = source.split(' - ');
    vendor = splitSource[0];
    title = null;
    if (splitSource.length > 1) {
      title = splitSource.slice(1).join(' - ');
    }
    return {vendor, title};
  }
}
