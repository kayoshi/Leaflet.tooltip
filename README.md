#Leaflet.tooltip
================

HTML tooltip, supporting a range of configuration options.

##Usage

Tooltips are configured with a reference to a Leaflet map and a  `target` which may be an HTML element or a marker instance.

````javascript
var marker = L.marker(new L.LatLng(-36.852668, 174.762675)).addTo(map);

var tooltip = L.tooltip({
    target: marker,
	map: map,
    html: "I'm a tooltip!"
});
````

###Options

| Option | Type | Default | Description
| --- | --- | --- | ---
| map | [L.Map](http://leafletjs.com/reference.html#map-class) | `undefined` | The map instance the tooltip is to be shown on (required).
| target | HTMLElement/[L.Marker](http://leafletjs.com/reference.html#marker) | `undefined` | The element or marker to bind the tooltip to.
| html | String | `undefined` | The tooltip content. May also be set using the `L.Tooltip.setHtml()` method.
| width | mixed | `'auto'` | The width of the tooltip. If unspecified the width will be determined by the tooltip content.
| minWidth | mixed | `'auto'` | The minimum width of the tooltip specifed as a number or a valid CSS width value.
| maxWidth | mixed | `'auto'` | The minimum width of the tooltip specifed as a number or a valid CSS width value.
| padding | mixed | `'2px 4px'` | The padding between the tooltip container edge and its content. Specified as a number or a valid CSS padding value.
| showDelay | Number | `500` | Delay in milliseconds before the tooltip displays after the mouse enters the target element. Set to 0 for the tooltip to show immediately.
| hideDelay | Number | `500` | Delay in milliseconds after the mouse exits the target element but before the tooltip actually hides. Set to 0 for the tooltip to hide immediately.
| mouseOffset | [L.Point](http://leafletjs.com/reference.html#point) | `L.point(0, 24)` | An XY offset from the mouse position where the tooltip should be shown.
| fadeAnimation | Bool | `true` | If `true` the tooltip will be faded in when shown or hidden.
| trackMouse | Bool | `false` | If `true` the tooltip will follow the mouse as it moves over the target element.

###Methods

````javascript
setTarget(HTMLElement/L.Marker)
````
Binds the tooltip to the specified element or marker.

````javascript
setHtml(HTMLElement/String)
````
Sets the HTML content for the tooltip.

````javascript
setPosition(L.Point)
````
Updates the tooltip position.

````javascript
show(L.Point, HTMLElement/String)
````
Shows the tooltip at the specified point with the content provided.

````javascript
hide()
````
Hides the tooltip.

````javascript
remove()
````
Destroys the tooltip and unbinds any event listeners registered.

##License
This software is released under the [MIT licence](http://www.opensource.org/licenses/mit-license.php). Icons used in the example are from [http://glyphicons.com](http://glyphicons.com).
