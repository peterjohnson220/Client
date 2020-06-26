export class PricingMatchHelper {
  static splitPricingMatchSource(source: string): {vendor: string, title: string} {
    const splitSource = source.split(' - ');
    const vendor = splitSource[0];
    let title = null;
    if (splitSource.length > 1) {
      title = splitSource.slice(1).join(' - ');
    }
    return {vendor, title};
  }
}
