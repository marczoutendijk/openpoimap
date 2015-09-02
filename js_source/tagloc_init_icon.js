// Init for Taglocator 1.1
// Taglocator is de testversie voor OPM.
// <!-- (mz) Laatste versie: 02-09-15, 15:07 -->
// Trying another overpass server. (not working!)


// standaard positie/zoom		
var lat = 47.74;
var lon = 8.921;
var zoom = 5;
var searchBoxZoom = 14;

var userPois = [];				// This array contains the current user pois
var userChoices = [];			// This array contains all the user pois as they are kept in a cookie
var keuzeCount = 0;
var keus = 0;					// index in userChoices
var tempCount = 0;
var map;
var COOKIE_KEEP = 365;			// Number of days to keep the cookies
var QURL = "http://overpass-api.de/api/interpreter/"; //default
// After discussion with Roland Olbricht he send me 2 other possible overpass servers
// I can't get them to work though...
// var QURL = "http://dev.overpass-api.de/api_drolbr/"; //default

var QURL2 = "http://dev.overpass-api.de/api_drolbr/"; 
var QURL3 = "http://overpass.osm.rambler.ru/cgi/";
var featurePopup;

// Gebruikerswaarden per regel in array opslaan
// De waarden staan in lines als "tag1=value1 \n tag2=value2 \n .." enz.	
function parseUserValues(text) {
	var lines = text.split('\n');
	return lines;
}


var tabtype = {
	name: "amenity",
	clearall: function (){ // Deselecteer alle keuzevakjes
		for (i = map.layers.length - 1; i > 1; i--) { 
			if (map.layers[i].isBaseLayer === false) { // only to overlays
					map.layers[i].setVisibility(false);
			}
		}
	},
	selectall: function (){ // Selecteer alle keuzevakje
		for (i = map.layers.length - 1; i > 1; i--) { 
			if (map.layers[i].isBaseLayer === false) { // only to overlays
					map.layers[i].setVisibility(true);
			}
		}
	}
};

// zoek naar een eventuele map variabele in de GET van de permalink

var permalink_true = window.location.search;
//alert(permalink_true);
if (permalink_true.length > 0){
	q = permalink_true.split("&");
	q = q[0].split("=");
	if (q[1].length > 0){
		tabtype.name = q[1];
	}
}

window.onload = function () {

	var ls = new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')});
	plink = new OpenLayers.Control.Permalink({base: '?map=' + tabtype.name});
	map = new OpenLayers.Map ('map', {
		controls:[
			ls,
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			plink,
			new OpenLayers.Control.Attribution()
		],
		maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
		maxResolution: 156543.0399,
		numZoomLevels: 19,
		units: 'm',
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		theme: null, // zie stylesheets
		eventListeners: {
			featureclick: function(e) {
				featurePopup.click(e);
			}
// 			featureover: function(e) {
// 				setStatusText("BOE");
// 			},
// 			featureout: function(e) {
// 			},
		}
	} );
	ls.maximizeControl(); 
		
// De Zoekbox
	
	map.addControl (new OpenLayers.Control.SearchBox({			
		autoClose: false,						
		defaultLimit: 50,						
		minDistance: 50,						
		resultMinZoom: searchBoxZoom			   // Hiermee stel je in op welk niveau moet worden ingezoomd nadat de zoekterm is gevonden			
	}));	

// Add the scaleline in the leftbottom

	map.addControl (new OpenLayers.Control.ScaleLine ({
	}));
	
// Inzoomen door een vierkant te tekenen met shift toets ingedrukt.
	
	map.addControl(new OpenLayers.Control({
		handler: null,
		destroy:function(){
			if(this.handler) this.handler.destroy();
			this.handler=null;
			OpenLayers.Control.prototype.destroy.apply(this,arguments);
		},

		draw: function () {
			this.handler = new OpenLayers.Handler.Box(this, {
				'done': this.done
			}, {
				keyMask: OpenLayers.Handler.MOD_CTRL
			});
			this.handler.activate();
		},
		done: function (bounds) {
			if (!isNaN(bounds.left)) {
				lB = this.map.getLonLatFromPixel(
					new OpenLayers.Pixel(bounds.left, bounds.bottom));
				lB.transform(map.getProjectionObject(), map.displayProjection);

				rT = this.map.getLonLatFromPixel(
					new OpenLayers.Pixel(bounds.right, bounds.top));
				rT.transform(map.getProjectionObject(), map.displayProjection);

				bounds = new OpenLayers.Bounds (
					lB.lon.toFixed(5),
					lB.lat.toFixed(5),
					rT.lon.toFixed(5),
					rT.lat.toFixed(5));

				result = OpenLayers.String.format(
					'(${left},${bottom},${right},${top})',
					bounds);

				url = OpenLayers.String.format(
	'http://www.openstreetmap.org/?minlon=${left}&minlat=${bottom}&maxlon=${right}&maxlat=${top}',
					bounds);
					location.href=url;
			}
		}
	}));								

// =========================  De Gebruikerskeuzen * USER pois ================================
// De gebruikerskeuzen worden opgeslagen in een lokale array: userChoices.
// Iedere keer als de gebruiker een nieuwe set opgeeft en deze middels de "save" knop bewaart,
// wordt deze keuze toegevoegd aan deze array.
// De array userChoices bevat dus ALLE door de gebruiker aangemaakte en bewaarde sets.
// De array userPois bevat alleen maar de HUIDIGE keuze. 
// Iedere keer als een gebruiker een set opslaat, wordt die set ook als cookiefile bewaard voor later gebruik.
// Bij het starten van het programma wordt gekeken of die cookiefile bestaat en weer teruggelezen in de array userChoices.
// De cookiefile wordt 365 dagen bewaard.
//================================================================================

userChoices = checkCookie();				// Hebben we eerder een userkeuze opgeslagen?
if (userChoices.length > 0 ){
	keuzeCount = userChoices.length;
	tempCount = keuzeCount;
}

// Lees de waarden die door de gebruiker zijn opgegeven	en activeer deze lagen	
document.getElementById('show_button').onclick = function () {
	userPois = parseUserValues (document.getElementById('tagselector_input').value);
	if (userPois.length > 0) {		// eigen keuze van gebuiker?		
		switchtab("userpoilayer",tabtype.name);
	}
};

//invoerveld wissen
document.getElementById('clear_button').onclick = function () {
	document.getElementById('tagselector_input').value = "";
};

// Gebruikers keuzen opslaan		
document.getElementById('save_button').onclick = function () {
	userPois = parseUserValues (document.getElementById('tagselector_input').value);
	if (userPois.length > 0) {		
		userChoices.push(userPois);									// sla op voor hergebruik als cookie
		keuzeCount++;												// Aantal user sets
		tempCount++;												// hulpteller voor deze lus
		cookieName = cookieDefName + String(keuzeCount);			// de naam voor deze cookie is userpois1, userpois2 ..
		setCookie(cookieName,userPois,COOKIE_KEEP);					// sla deze keuze op
	}
};

// Gebruikerskeuzen teruglezen		
document.getElementById('load_button').onclick = function () {
	if (tempCount > 0) {
		keus = --tempCount;				// index is 1 lager dan aantal keuzen
		document.getElementById('tagselector_input').value = userChoices[keus].toString().replace(/,/g, '\n');
	} else { 
		document.getElementById('tagselector_input').value = "End of choices\n"+"Click load to start again";
		tempCount = keuzeCount;			// reset de lusteller weer naar de startwaarde (de laatst ingevoerde gebuikerskeus).
	} // Begin weer opnieuw met het doorlopen van de keuzen
};

// ==== de baselayers ==
//Mapquest
	var mapquest = new OpenLayers.Layer.OSM(
		"MapQuest",
		"http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
		{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a> Contributors<br>Cartography © MapQuest<br>Overlay data licensed under ODbL'}
	); 
//Mapnik
	layerMapnik = new OpenLayers.Layer.OSM.Mapnik(
		"Mapnik",
		{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a> Contributors<br>Cartography licensed as CC-BY-SA<br>Overlay data licensed under ODbL '}
	);
// HikeBike
	var hikebike = new OpenLayers.Layer.XYZ(
		'HikeBike',
		['http://a.tiles.wmflabs.org/hikebike/${z}/${x}/${y}.png', 
		'http://b.tiles.wmflabs.org/hikebike/${z}/${x}/${y}.png', 
		'http://c.tiles.wmflabs.org/hikebike/${z}/${x}/${y}.png'],
		{description: 'Colin Marquardt Hike & Bike Map',permaId: 'Kh',sphericalMercator: true}
	);	
	
	map.addLayers([mapquest,hikebike,layerMapnik]);

	// === layers, zoom and position
	var lonLat = new OpenLayers.LonLat(
			lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
			new OpenLayers.Projection("EPSG:900913")
		);
		
	layerdef(tabtype.name);		// defined in opm.js
	
		
	document.getElementById(tabtype.name).className = "choice";
	if(!map.getCenter()) {
		map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), zoom);
	}  

// mz: Dit is de code die zorgt voor het popupscherm als je ergens op de kaart klikt.
// Dit is met de nieuwe code van Gertjan Idema
	featurePopup = new FeaturePopup(QURL,map);

	
}; //end of window.onload  