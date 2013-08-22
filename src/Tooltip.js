L.Tooltip = L.Class.extend({
	
	options: {
		width: 'auto',
		minWidth: 'auto',
		maxWidth: 'auto',
		padding: '2px 4px',
		showDelay: 500,
		hideDelay: 500,
		mouseOffset: L.point(0, 24),
		fadeAnimation: true,
		trackMouse: false		
	},

	initialize: function (options) {
		L.setOptions(this, options);

		this._createTip();
	},

	_createTip: function () {
		this._map = this.options.map;

		if (!this._map) {
			throw new Error('No map configured for tooltip');
		}

		var cls = 'leaflet-tooltip' + (this.options.fadeAnimation ? ' leaflet-tooltip-fade' : '');

		this._container = L.DomUtil.create('div', cls);
		this._container.style.position = 'absolute';
		this._container.style.width = !isNaN(this.options.width) ? this.options.width + 'px' : this.options.width;
		this._container.style.minWidth = !isNaN(this.options.minWidth) ? this.options.minWidth + 'px' : this.options.minWidth;
		this._container.style.maxWidth = !isNaN(this.options.maxWidth) ? this.options.maxWidth + 'px' : this.options.maxWidth;
		this._container.style.padding = !isNaN(this.options.padding) ? this.options.padding + 'px' : this.options.padding;
		
		L.DomUtil.setOpacity(this._container, 0);

		if (this.options.html) {
			this.setHtml(this.options.html);
		}

		this._map._tooltipContainer.appendChild(this._container);

		if (this.options.target) {
			this.setTarget(this.options.target);
		}
	},

	setTarget: function (target) {
		if (target._icon) {
			target = target._icon;
		}

		if (target === this._target) {
			return;
		}

		if (this._target) {
			this._unbindTarget(this._target);
		}

		this._bindTarget(target);

		this._target = target;
	},

	_bindTarget: function (target) {
		L.DomEvent
			.on(target, 'mouseover', this._onTargetMouseover, this)
		    .on(target, 'mouseout', this._onTargetMouseout, this)
		
		if (this.options.trackMouse) {
			L.DomEvent.on(target, 'mousemove', this._onTargetMousemove, this);
		}
	},

	_unbindTarget: function (target) {
		L.DomEvent
			.off(target, 'mouseover', this._onTargetMouseover, this)
		    .off(target, 'mouseout', this._onTargetMouseout, this)
		
		if (this.options.trackMouse) {
			L.DomEvent.off(target, 'mousemove', this._onTargetMousemove, this);
		}		
	},

	setHtml: function (html) {
		if (typeof html === 'string') {
			this._container.innerHTML = html;	
		} else {
			while (this._container.hasChildNodes()) {
				this._container.removeChild(this._container.firstChild);
			}
			this._container.appendChild(this._content);			
		}
		
		this._sizeChanged = true;
	},

	setPosition: function (point) {
		var mapSize = this._map.getSize(),
		    container = this._container,
		    containerSize = this._getElementSize(this._container);

		point = point.add(this.options.mouseOffset);
		
		if (point.x + containerSize.x > mapSize.x) {
			container.style.left = 'auto';
			container.style.right = (mapSize.x - point.x) + 'px';
		} else {
			container.style.left = point.x + 'px';
			container.style.right = 'auto';
		}
		
		if (point.y + containerSize.y > mapSize.y) {
			container.style.top = 'auto';
			container.style.bottom = (mapSize.y - point.y) + 'px';
		} else {
			container.style.top = point.y + 'px';
			container.style.bottom = 'auto';
		}
	},

	remove: function () {
		this._container.parentNode.removeChild(this._container);
		delete this._container;

		if (this._target) {
			this._unbindTarget(this._target);
		}
	},

	show: function (point, html) {
		if (html) {
			this.setHtml(html);
		}

		this.setPosition(point);

		if (this.options.showDelay) {
			setTimeout(L.Util.bind(this._show, this), this.options.showDelay);
		} else {
			this._show();
		}
	},

	_show: function () {
		L.DomUtil.setOpacity(this._container, 1);
		this._showing = true;			
	},

	hide: function () {
		if (this._showing) {
			if (this.options.hideDelay) {
				setTimeout(L.Util.bind(this._hide, this), this.options.hideDelay);
			} else {
				this._hide();
			}
		}
	},

	_hide: function () {		
		L.DomUtil.setOpacity(this._container, 0);
		this.showing = false;
	},

	_getElementSize: function (el) {		
		var size = this._size;

		if (!size || this._sizeChanged) {
			size = {};

			el.style.left = '-999999px';
			el.style.right = 'auto';
			
			size.x = el.offsetWidth;
			size.y = el.offsetHeight;
			
			el.style.left = 'auto';
			
			this._sizeChanged = false;
		}

		return size;
	},

	_onTargetMouseover: function (e) {
		var point = this._map.mouseEventToContainerPoint(e);

		this.show(point);
	},

	_onTargetMousemove: function (e) {	
		var point = this._map.mouseEventToContainerPoint(e);
		
		this.setPosition(point);
	},

	_onTargetMouseout: function (e) {
		this.hide();
	}
});

L.Map.addInitHook(function () {
	this._tooltipContainer = L.DomUtil.create('div', 'leaflet-tooltip-container', this._container);
});

L.tooltip = function (options) {
	return new L.Tooltip(options);
};

(function () {
	var originalOnAdd = L.Marker.prototype.onAdd,
	    originalOnRemove = L.Marker.prototype.onRemove,
	    originalSetIcon = L.Marker.prototype.setIcon;

	L.Marker.include({

		getTooltip: function () {
			return this._tooltip;
		},
		
		onAdd: function (map) {
			originalOnAdd.call(this, map);

			if (this.options.tooltip) {
				this._tooltip = L.tooltip(L.extend(this.options.tooltip, {target: this, map: map}));
			}
		},

		setIcon: function (icon) {			
			originalSetIcon.call(this, icon);
			
			if (this._tooltip) {
				this._tooltip.setTarget(this._icon);
			}
		}
	});	
})();
