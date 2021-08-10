export class MapHelper {
  static getMapUrl(mbAccessToken: string, filterContext) {
    const style = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/';
    const htmlEncodedHashTag = '%23';
    const geoJson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: this.calculatePolygonCoordinates(filterContext)
      },
      properties: {
        stroke: htmlEncodedHashTag + '3f8845',
        fill: htmlEncodedHashTag + '3f8845',
        'fill-opacity': 0.1
      }
    };
    return style + 'geojson(' + JSON.stringify(geoJson) + ')/auto/600x600?access_token=' + mbAccessToken;
  }

  static calculatePolygonCoordinates(filterContext) {
    // Default to the largest coordinates the map can expand to.
    let polygonCoordinates = [[[-180, 90], [-180, -90], [180, -90], [180, 90], [-180, 90]]];
    if (!!filterContext && !!filterContext.FilterContext
      && !!filterContext.FilterContext.TopLeft && !!filterContext.FilterContext.BottomRight) {
      const topLeft = filterContext.FilterContext.TopLeft;
      const bottomRight = filterContext.FilterContext.BottomRight;

      polygonCoordinates = [[[topLeft.Lon, topLeft.Lat],
        [topLeft.Lon, bottomRight.Lat],
        [bottomRight.Lon, bottomRight.Lat],
        [bottomRight.Lon, topLeft.Lat],
        [topLeft.Lon, topLeft.Lat]]];
    }

    return polygonCoordinates;
  }
}
