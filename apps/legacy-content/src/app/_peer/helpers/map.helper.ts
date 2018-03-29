export class MapHelper {

  static buildMapFilter(currentState, mapProps) {

    const swappedBounds = this.swapBounds(mapProps.bounds);

    return {
      ...currentState.mapFilter,
      TopLeft: swappedBounds.TopLeft,
      BottomRight: swappedBounds.BottomRight,
      ClusterPrecision: this.getClusterPrecision(mapProps.zoom)
    };
  }

  private static swapBounds(bounds: any): any {
    const ne = bounds._ne;
    const sw = bounds._sw;
    const swappedBounds = {
      TopLeft: {
        Lat: this.enforceBoundsLimit(ne.lat),
        Lon: this.enforceBoundsLimit(sw.lng)
      },
      BottomRight: {
        Lat: this.enforceBoundsLimit(sw.lat),
        Lon: this.enforceBoundsLimit(ne.lng)
      }
    };
    return swappedBounds;
  }

  private static enforceBoundsLimit(coordinate: number) {
    return coordinate > 180 ? 180 : coordinate < -180 ? -180 : coordinate;
  }

  private static getClusterPrecision(zoomLevel: number) {
    const zoomToGeoHashPrecision = {
      0: 0,
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 3,
      6: 4,
      7: 4,
      8: 5,
      9: 5,
      10: 5,
      11: 6,
      12: 6,
      13: 6,
      14: 7,
      15: 7,
      16: 7,
      17: 7,
      18: 7,
      19: 7,
      20: 7,
      21: 7
    };

    return zoomToGeoHashPrecision[Math.round(zoomLevel)];
  }
}
