//------------------------------------------------------------------------------
//	$Id: searchbox.js,v 1.29 2015/02/14 17:21:41 wolf Exp $
//------------------------------------------------------------------------------
//	Erklaerung:	http://www.netzwolf.info/kartografie/openlayers/search.htm
//------------------------------------------------------------------------------
//	Fragen, Wuensche, Bedenken, Anregungen?
//	<openlayers(%40)netzwolf.info>
//------------------------------------------------------------------------------

// mz: This version adapted for a Dutch nominatim
// mz: Version also functions correct on mobile apps

OpenLayers.Control.SearchBox=OpenLayers.Class(OpenLayers.Control, {

	//----------------------------------------------------------------------
	//	config
	//----------------------------------------------------------------------

	resultMinZoom: 16,

	lang: 'nl',

	textLabel: 'Search for:',
	textNoHits: 'Not found.',

	textKeepOpen: 'leave open',

	resources: null,
	resource: {

		textLabel: 'Search with Nominatim:',

		url: 'http://nominatim.openstreetmap.org/search?' +
			'format=json&json_callback={callback}&limit={limit}&addressdetails=0&q={query}',

		formatResultEntry: function(data, div) {

			div.setAttribute('title', data.display_name +
				' [' + data['class'] + ', ' + data.type + ']');
			div.appendChild (document.createTextNode (
			data.display_name.split(', ').slice(0,2).join(', ') +
				' [' + this.translate(data['class'], data.type) + ']'));
		}
	},

	defaultLimit: 20,
	minDistance: 0,
	autoClose: true,
	expandUp: false,

	//----------------------------------------------------------------------
	//	vars
	//----------------------------------------------------------------------

	resourceIndex: -1,

	keepOpen: false,
	labelDiv: null,
	switcher: null,
	labelDiv: null,
	form: null,
	input: null,
	resultDiv: null,

	touchedWithoutMove: null,

	//----------------------------------------------------------------------
	//	init
	//----------------------------------------------------------------------

	allowSelection: true,

	//----------------------------------------------------------------------
	//	destroy
	//----------------------------------------------------------------------

	destroy:function() {

		if (this.div) { stopObservingElement(this.div); }

		this.form  = null;
		this.input = null;
		this.labelDiv = null;
		this.switcher = null;
		this.labelSpan = null;
		this.labelSpan2 = null;
		this.resultDiv = null;

		OpenLayers.Control.prototype.destroy.apply(this,arguments);
	},

	//----------------------------------------------------------------------
	//	create html and make control visible
	//----------------------------------------------------------------------

	draw:function(px) {

		OpenLayers.Control.prototype.draw.apply(this,arguments);

		var control = this; // closure

		this.labelDiv=document.createElement ('div');
		this.labelDiv.className='label';

		if (this.resources && this.resources.length>=2) {

			this.labelDiv.onclick = function(evt) {

				control.setResource(evt.ctrlKey);
			};
			this.labelDiv.className='label clickable';
			this.labelDiv.style.cursor = 'pointer';
		}

		this.input= document.createElement ('input');
		this.input.setAttribute('type', 'text');
		this.input.setAttribute('name', 'q');
		this.input.control=this;

		this.form=document.createElement ('form');
		this.form.style.display='inline';
		this.form.appendChild(this.input);
		this.form.control=this;
		this.form.onsubmit=this.formOnSubmit;

		this.resultDiv=document.createElement ('div');
		this.resultDiv.ontouchstart=this.stopEvent;

		if (this.expandUp) {

			this.div.appendChild(this.resultDiv);
			this.div.appendChild(this.labelDiv);
			this.div.appendChild(this.form);
		} else {
			this.div.appendChild(this.labelDiv);
			this.div.appendChild(this.form);
			this.div.appendChild(this.resultDiv);
		}

		this.setResource(null);

		OpenLayers.Event.observe(this.input, 'click',
			function(evt){
				OpenLayers.Event.stop(evt, true);
				control.cancelSearch();
			}
		);
		OpenLayers.Event.observe(this.div, 'touchstart',
			function(evt){
				OpenLayers.Event.stop(evt, true);
				control.cancelSearch();
			}
		);
		OpenLayers.Event.observe(this.div, 'dblclick',
			function(evt){OpenLayers.Event.stop(evt, true);}
		);
		OpenLayers.Event.observe(this.div, 'mousedown',
			function(evt){OpenLayers.Event.stop(evt, true);}
		);

		return this.div;
	},

	//----------------------------------------------------------------------
	//	select data source
	//----------------------------------------------------------------------

	setResource: function(down) {

		this.cancelSearch();

		//--------------------------------------------------------------
		//	set search resource
		//--------------------------------------------------------------

		if (this.resources) {

			if (down) {

				this.resourceIndex = (this.resourceIndex + this.resources.length - 1)
					% this.resources.length;
			} else {
				this.resourceIndex = (this.resourceIndex + 1) % this.resources.length;
			}

			this.resource = this.resources[this.resourceIndex];
		}

		//--------------------------------------------------------------
		//	set label
		//--------------------------------------------------------------

		var labelText = this.resource.textLabel || this.textLabel;

		while (this.labelDiv.firstChild) this.labelDiv.removeChild(this.labelDiv.firstChild);
		this.labelDiv.appendChild(document.createTextNode(labelText));

		this.input.focus();
	},

	//----------------------------------------------------------------------
	//	event handling
	//----------------------------------------------------------------------

	formOnSubmit: function() {

		this.control.startSearch(this.elements.q.value);
		return false;
	},

	//----------------------------------------------------------------------
	//	search
	//----------------------------------------------------------------------

	currentRequest: null,

	startSearch: function (q) {

		this.cancelSearch();

		q = OpenLayers.String.trim(q);
		if (q==='') { return false; }

		//------------------------------------------------------------
		//	lon+lat
		//------------------------------------------------------------

		var lonLat = this.map.getCenter();

		var lon = '';
		var lat = '';

		if (lonLat) {
			lonLat.transform(this.map.getProjectionObject(),this.map.displayProjection);
			lon = lonLat.lon.toFixed(5);
			lat = lonLat.lat.toFixed(5);
		}

		//------------------------------------------------------------
		//	url
		//------------------------------------------------------------

		var url = this.resource.url.
			replace(/{query}/, encodeURIComponent(q)).
			replace(/{lon}/, lon).
			replace(/{lat}/, lat).
			replace(/{limit}/,
				encodeURIComponent(this.resource.limit || this.defaultLimit));

		this.resultDiv.className='busy';

		this.jsonpRequest (
			url,
			this,
			this.success,
			this.failure,
			{timeout: 5000});

		return false;
	},

	cancelSearch: function () {

		if (this.currentRequest) { this.currentRequest.cancel(); }
		this.currentRequest = null;
		this.removeResult();
	},

	//----------------------------------------------------------------------
	//	format and display search results
	//----------------------------------------------------------------------

	success: function (result) {

		this.currentRequest = null;
		this.removeResult();
		this.resultDiv.className='success';
		this.formatResult(result);
	},

	failure: function (message) {

		this.currentRequest = null;
		this.removeResult();
		this.resultDiv.className='failure';

		this.resultDiv.appendChild (document.createTextNode (message));
	},

	//----------------------------------------------------------------------
	//	format result
	//----------------------------------------------------------------------

	formatResult: function(result) {

		var control = this; // closure

		this.resultDiv.style.visibility = 'hidden';

		var availableHeight = this.expandUp ?
			this.resultDiv.parentElement.offsetTop + this.resultDiv.offsetHeight :
			this.map.div.offsetHeight - this.resultDiv.parentElement.offsetTop - this.resultDiv.offsetTop;

		var maxHeight = availableHeight - this.minDistance;

		if (!this.autoClose && result.length>=2) {

			var div   = document.createElement('div');
			var label = document.createElement('label');
			var input = document.createElement('input');

			input.type='checkbox';
			input.onchange=function() { control.onKeepOpenChange(input.checked); };

			label.style.display = 'block';
			label.appendChild(input);
			label.appendChild(document.createTextNode(this.textKeepOpen));

			div.className='keepopen';
			div.appendChild(label);

			this.resultDiv.appendChild(div);
		}

		for (var i in result) {

			var element = document.createElement ('div');
			this.resource.formatResultEntry.apply(this, [data=result[i], element]);

			element.onclick=this.onResultEntryClick;
			element.ontouchstart=function(evt){control.touchedWithoutMove = true;}
			element.ontouchmove=function(evt){control.touchedWithoutMove = false;}
			element.ontouchend=function(evt){if(control.touchedWithoutMove) this.onResultEntryClick();};

			element.className='entry';
			element.control=this;
			element.data=data;

			this.resultDiv.appendChild(element);
		}

		if (!result.length) {

			this.resultDiv.className='success empty';
			this.resultDiv.appendChild (document.createTextNode (this.textNoHits));
		}

		if (this.resultDiv.offsetHeight >= maxHeight) {

			this.resultDiv.style.height = maxHeight + 'px';
			this.resultDiv.style.overflowY = 'scroll';
		}

		this.resultDiv.style.visibility = 'visible';
	},

	formatNominatimResultEntry: function(data, div) {

		div.setAttribute('title', data.display_name + ' [' + data['class'] + ', ' + data.type + ']');
		div.appendChild (document.createTextNode (
			data.display_name.split(', ').slice(0,2).join(', ') +
				' [' + this.translate(data['class'], data.type) + ']'));
	},

	//----------------------------------------------------------------------
	//	nominatim translation
	//----------------------------------------------------------------------

	translate: function (clasz, type) {

		var dict = OpenLayers.NominatimTranslation && OpenLayers.NominatimTranslation[this.lang];

		var trans = dict && dict[clasz+'.'+type];
		if (trans) { return trans; }

		return clasz+'='+type;
	},

	//----------------------------------------------------------------------
	//	click on search result moves map
	//----------------------------------------------------------------------

	stopEvent: function(evt) {

		OpenLayers.Event.stop(evt, true);
	},

	onKeepOpenChange: function(keepOpen) {

		this.keepOpen = keepOpen;
		if (keepOpen) return;
		this.removeResult();
		this.input.focus();
	},

	onResultEntryClick: function(evt) {

		if (evt) OpenLayers.Event.stop(evt);

		var control = this.control;

		if (!control.keepOpen) control.removeResult();

		var lonlat = new OpenLayers.LonLat(this.data.lon,this.data.lat).
			transform(new OpenLayers.Projection("EPSG:4326"), control.map.getProjectionObject());

		if (control.map.getZoom()<control.resultMinZoom) {
			control.map.moveTo (lonlat, control.resultMinZoom);
		} else {
			control.map.panTo (lonlat);
		}
	},

	//----------------------------------------------------------------------
	//	dom
	//----------------------------------------------------------------------

	removeResult: function() {

		this.keepOpen = false;

		while (this.resultDiv.firstChild) {
			this.resultDiv.removeChild(this.resultDiv.firstChild);
		}
		this.resultDiv.className='';
		this.resultDiv.style.height = '';
		this.resultDiv.style.overflowY = 'visible';
	},

	//----------------------------------------------------------------------
	//	JSONP
	//----------------------------------------------------------------------

	jsonpRequest: function (url, scope, success, failure, options) {

		//--------------------------------------------------------------
		//	sanity
		//--------------------------------------------------------------

		options=options||{};

		//--------------------------------------------------------------
		//	unique request id
		//--------------------------------------------------------------

		var id = 'jsonp' + new Date().getTime();

		//--------------------------------------------------------------
		//	add unique name of jsonp callback function to query
		//--------------------------------------------------------------

		url = url.replace(/{callback}/, 'window.' + id + '.callback');

		//--------------------------------------------------------------
		//	create script element
		//--------------------------------------------------------------

		var scriptElement = document.createElement('script');
		scriptElement.setAttribute('type', 'text/javascript');
		scriptElement.setAttribute('src', url);

		//--------------------------------------------------------------
		//	create request object
		//--------------------------------------------------------------

		var request = {
			id: id,
			scope: scope,
			success: success,
			failure: failure,

			callback: function (data) {
				this.cancel();
				this.success.apply(this.scope, [data]);
			},

			timeout: function () {
				this.cancel();
				this.failure.apply(this.scope, ['timeout']);
			},

			cancel: function() {
				window.clearTimeout(this.timer);
				if(this.scriptElement.parentElement) {
					this.scriptElement.parentElement.removeChild(this.scriptElement);
				}
				delete window[this.id];
			},

			scriptElement: scriptElement
		};

		//--------------------------------------------------------------
		//	install timeout (var request used in closure)
		//--------------------------------------------------------------

		request.timer = window.setTimeout (function(){request.timeout();},
			options.timeout || 5000);

		//--------------------------------------------------------------
		//	store request object
		//--------------------------------------------------------------

		window[id] = request;

		//--------------------------------------------------------------
		//	install script element (starts execution)
		//--------------------------------------------------------------

		document.getElementsByTagName('head')[0].appendChild(scriptElement);

		return request;
	},

	//----------------------------------------------------------------------
	//	yeah!
	//----------------------------------------------------------------------

	CLASS_NAME:'OpenLayers.Control.SearchBox'
});

//--------------------------------------------------------------------------------
//	$Id: searchbox.js,v 1.29 2015/02/14 17:21:41 wolf Exp $
//--------------------------------------------------------------------------------
