//*****************************************************************
// OpenPoiMap Javascript library
//*****************************************************************

// Version 1.06

// This library contains 4 separate blocks of code that were previously (up to version 1.05) included as standalone js-files.
//<!-- (mz) Laatste versie: 27-04-15, 11:42 -->

//*****************************************************************
// FeaturePopup.js
//*****************************************************************


var _ZOOM_ = "&zoom=18"; // zoomwaarde voor de Editors

var CONNEX = "http://haltepagina.connexxion.nl/home/index?halte="; // Connexion link
var DELIJN = "https://www.delijn.be/nl/haltes/halte/"; // De Lijn in Vlaanderen
var MDB = "http://www.molendatabase.nl/nederland/molen.php?nummer="; // Molendatabase
var DHM = "http://www.molens.nl/site/dbase/molen.php?mid="; // De Hollandse Molen

// The Dutch Monument Register requires two links to get to the information you need.
// First you go this one, and once on that page you have to click again to get to the relevant page for that monument
var MONUREG = "http://monumentenregister.cultureelerfgoed.nl/php/main.php?cAction=search&sCompMonNr=";

// The links below are needed if you know both the OBJnr AND the MonNr.
// Often they are the same, but sometimes they are different

// var MON1 = "http://monumentenregister.cultureelerfgoed.nl/php/main.php?cAction=show&cOffset=0&cLimit=25&cOBJnr=";
// var MON2 = "&oOrder=ASC&cLast=1&oField=OBJ_RIJKSNUMMER&sCompMonNr=";
// var MON3 = "&sCompMonName=&sStatus=&sProvincie=&sGemeente=&sPlaats=&sStraat=&sHuisnummer=&sPostcode=&sFunctie=&sHoofdcategorie=&sSubcategorie=&sOmschrijving=&ID=0&oField=OBJ_RIJKSNUMMER";

var WIKI = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:'; // base url to key wiki

var buttonShow = false; // Keep the state of the hide/show button below the table

function showMoreLessButton(show) {
	if (show) {
		thelink = '<div id="morebutton" class="buttonclass"><button id="show_button" onclick="showLinks()">hide</button></div>';
	} else thelink = '<div id="morebutton" class="buttonclass"><button id="show_button" onclick="showLinks()">Views and Editors</button></div>';
	return thelink;
}

function popupLinks(lonlat, feature, show) {
	var buttonClass = (show ? 'popupLinksShow' : 'popupLinksHide');
	// Link naar OSM
	var thelink = "<div id=\"tlPop\" class=\"" + buttonClass + "\"><b>View area with:</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + _ZOOM_ + "\" target=\"_blank\"><img src='img/osm.gif'>&nbsp;OSM</a>&nbsp";
	// Link naar Google	  
	thelink = thelink + "<a href=\"https://maps.google.nl/maps?ll=" + lonlat.lat + "," + lonlat.lon + "&t=h&z=15\" target=\"_blank\"><img src='img/google.gif'>&nbsp;Google</a>&nbsp;";
	// Link naar Bing
	thelink = thelink + "<a href=\"http://www.bing.com/maps/?v=2&cp=" + lonlat.lat + "~" + lonlat.lon + "&lvl=15&dir=0&sty=h&form=LMLTCC\" target=\"_blank\"><img src='img/bing.gif'>&nbsp;Bing </a>";
	// Link naar MtM	  
	thelink = thelink + "<a href=\"http://mijndev.openstreetmap.nl/~allroads/mtm/?map=roads&zoom=" + map.getZoom() + "&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&layers=B000000FFFFFFFFFFFFTFF\" target=\"_blank\"><img src='img/osm.gif'>&nbsp;MtM</a>&nbsp;";
	// Link naar Mapillary	  
	thelink = thelink + "<a href=\"http://www.mapillary.com/map/im/bbox/" + (lonlat.lat - 0.005) + "/" + (lonlat.lat + 0.005) + "/" + (lonlat.lon - 0.005) + "/" + (lonlat.lon + 0.005) + "\" target=\"_blank\"><img src='img/mapillary.png'>&nbsp;Mapillary</a><p>";

	// Hoe wordt de te bewerken oppervlakte berekend voor JOSM?  
	// var area = 0.01 // oorspronkelijke waarde
	// mz: Gegevensset kleiner gemaakt voor josm
	// Toegevoegd type en ID zodat het juiste object direct wordt geselecteerd in JOSM

	var area = 0.002; // was 0.01
	var ctop = lonlat.lat + area;
	var cbottom = ctop - (2 * area);
	var cleft = lonlat.lon - area;
	var cright = cleft + (2 * area);
	var fid = feature.fid.split("."); // type en ID van object
	thelink = thelink + "<b>Edit area with:</b><br><a href=\"http://localhost:8111/load_and_zoom?top=" + ctop + "&bottom=" + cbottom + "&left=" + cleft + "&right=" + cright + "&select=" + fid[0] + fid[1] + "\" target=\"josm_frame\">JOSM</a>&nbsp;&diams;&nbsp;";
	thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=id&lat=" + lonlat.lat + "&lon=" + lonlat.lon + _ZOOM_ + "\" target=\"_blank\">ID editor</a>&nbsp;&diams;&nbsp;";
	thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&lat=" + lonlat.lat + "&lon=" + lonlat.lon + _ZOOM_ + "\" target=\"_blank\">Potlatch&nbsp;2</a>";
	thelink = thelink + "</div>"; // id = tlPop
	return thelink;
}

//Toggle to show or hide the lines with various viewers and editors
function showLinks() {
	var zichtbaar = document.getElementById('tlPop');
	if (zichtbaar.className == 'popupLinksShow') {
		zichtbaar.className = 'popupLinksHide';
		buttonShow = false; // keep state
		document.getElementById('show_button').innerHTML = 'Views and Editors';
	} else {
		zichtbaar.className = 'popupLinksShow';
		buttonShow = true; //keep state
		document.getElementById('show_button').innerHTML = 'Hide';
	}
}

// Turn keyvalue into link to relevant wiki article
function makeWikiLink(key) {
	return WIKI + key + '">' + key + '</a>';
}

/**
 * FeaturePopup
 * The FeaturePopup class creates the Popup window for the info about the selected OSM feature
 */
FeaturePopup = OpenLayers.Class({
	genericUrl: null,
	map: null,

	// Constructor
	initialize: function(url, map) {
		this.genericUrl = url;
		this.map = map;
	},

	// Click event
	click: function(event) {
		var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
		var xy = event.feature.geometry.getBounds().getCenterLonLat(); // Google maps coordinaten (EPSG:900913)
		var popup = new OpenLayers.Popup("location_info", xy, null, "", true);
		lonlat = lonlat.clone().transform(this.map.projection, this.map.displayProjection); // WGS84 coordinaten (EPSG:4326)
		popup.setBackgroundColor("white"); // achtergrondkleur van het popup venster
		popup.opacity = 1;
		popup.setBorder("1px solid green");
		popup.closeOnMove = false;
		popup.autoSize = true;
		popup.maxSize = new OpenLayers.Size(450, 500);
		popup.panMapIfOutOfView = true;
		popup.contentHTML = this.processFeature(event.feature) + showMoreLessButton(buttonShow) + popupLinks(lonlat, event.feature, buttonShow);
		this.map.addPopup(popup, true);
	},

	/*
	 * Create the div element for a single feature
	 * fid[0] = type (node, way, rel)
	 * fid[1] = ID
	 */
	processFeature: function(feature) {
		var fid = feature.fid.split(".");
		return this.processElement(fid[0], fid[1], feature.attributes);
	},

	/*
	 * Create the div element for a single feature
	 * Change by mz: operator, description and note (if available) included in header
	 * Fixme is on first line in table
	 * css used for styling of table
	 * All items with a main keyvalue (Amenity, Tourism etc ) are shown in the toprows of the table
	 */
	processElement: function(type, id, tags) {
		var html = ''; // The html code for popup is split into 4 sections.
		var htmlTableStart = ''; // This contains the definition of the table, including style
		var htmlTableHead = ''; // This is the part that follows after the table definition. It contains all the main key values
		var htmlTableFoot = ''; // The concluding lines of the table
		var wikiKeyPage = ''; // the wikipage that deals with this key value
		var name = tags.name;
		var name_EN = tags["name:en"]; // Especially with foreign alphabets, the English name is helpfull
		var operator = tags.operator;
		var note = tags.note;
		var description = tags.description;
		var fixme = tags.fixme;
		var FIXME = tags.FIXME;
		if (name && name_EN) { // Is er een name _EN_ een name:en key aanwezig? Indien ja dan name:en toevoegen aan name.
			name += '<br/>' + name_EN;
		}
		if (name && operator) {
			html += '<h4>' + name + '<br/>operator: ' + operator + '</h4>';
		} else {
			if (operator) { // operator - indien aanwezig - toevoegen aan name
				html += '<h4>operator: ' + operator + '</h4>';
			} else {
				if (name) { // geen operator
					html += '<h4>' + name + '</h4>';
				}
			}
		}
		if (description) { // add description to info before the table
			html += '<h5>' + 'Description: ' + description + '</h5>';
		}
		if (note) { // add note to info before the table 
			html += '<h5>' + 'Note: ' + note + '</h5>';
		}
		var address = this.processAddress(tags);
		if (address) html += address;
		// process the rest of the tags
		var self = this;
		htmlTableStart = '<table class="popupCode">'; // start table
		// De fixme key komt in verschillende varianten voor, ik reken op 'fixme' en 'FIXME'
		if (fixme) {
			htmlTableHead += '<tr class="popupRowFixme"><td class="popupKeyFixme">' + 'fixme' + '</td><td class="popupValue">' + fixme + '</td></tr>';
		}
		if (FIXME) {
			htmlTableHead += '<tr class="popupRowFixme"><td class="popupKeyFixme">' + 'FIXME' + '</td><td class="popupValue">' + FIXME + '</td></tr>';
		}
		// loop through remaining tags
		$.each(tags, function(key, val) {
			// Check to see if we have a main key
			wikiKeyPage = '';
			tdKeyClass = '';
			tdValClass = '';
			// This switch selects the right wikipage for the relevant key and turns in into a link	
			switch (key) {
				case "amenity":
					wikiKeyPage = WIKI + 'amenity">' + key + '</a>';
					break;
				case "tourism":
					wikiKeyPage = WIKI + 'tourism">' + key + '</a>';
					break;
				case "sport":
					wikiKeyPage = WIKI + 'sport">' + key + '</a>';
					break;
				case "shop":
					wikiKeyPage = WIKI + 'shop">' + key + '</a>';
					break;
				case "man_made":
					wikiKeyPage = WIKI + 'man_made">' + key + '</a>';
					break;
				case "historic":
					wikiKeyPage = WIKI + 'historic">' + key + '</a>';
					break;
				case "natural":
					wikiKeyPage = WIKI + 'natural">' + key + '</a>';
					break;
				case "landuse":
					wikiKeyPage = WIKI + 'landuse">' + key + '</a>';
					break;
				case "leisure":
					wikiKeyPage = WIKI + 'leisure">' + key + '</a>';
					break;
				case "heritage":
					wikiKeyPage = WIKI + 'heritage">' + key + '</a>';
					break;
				case "office":
					wikiKeyPage = WIKI + 'office">' + key + '</a>';
					break;
				case "emergency":
					wikiKeyPage = WIKI + 'emergency">' + key + '</a>';
					break;
				case "craft":
					wikiKeyPage = WIKI + 'craft">' + key + '</a>';
			}
			// If we have a wikipage, show it. Otherwise just return the key value
			// The class for the key and valuefield is currently the same 
			keyVal = (wikiKeyPage ? wikiKeyPage : key);
			tdKeyClass = (wikiKeyPage ? '<td class="popupMainKey">' : '<td class="popupKey">');
			tdValClass = (wikiKeyPage ? '<td class="popupUserValue">' : '<td class="popupValue">');
			// process the other values
			var tagHtml = self.processTag(key, val, address);
			if (tagHtml) {
				if (wikiKeyPage) {
					htmlTableHead += '<tr class="popupRow">' + tdKeyClass + keyVal + '</td>' + tdValClass + tagHtml + '</td></tr>';
				} else {
					html += '<tr class="popupRow">' + tdKeyClass + makeWikiLink(keyVal) + '</td>' + tdValClass + tagHtml + '</td></tr>';
				}
			}
		});
		// process the open streetmap ID link and put in last line of table
		var htmlOSM = '<a target = "_blank" href="http://www.openstreetmap.org/browse/' + type + "/" + id + '">' + type + " " + id + "</a>";
		htmlTableFoot += '<tr class="popupRowOSM"><td class="popupKey">' + 'OSM&nbsp;info' + '</td><td class="popupValue">' + htmlOSM + '</td></tr>';
		htmlTableFoot += '</table>';
		return htmlTableStart + htmlTableHead + html + htmlTableFoot;
	},

	/*
	 * Create the html for a single tag
	 * Added "image" & link
	 */

	processTag: function(key, value, address) {
		var k = key.split(":");
		var lang = '';
		var molen = '';
		switch (k[0]) {
			case "website":
			case "twitter":
			case "facebook":
			case "email":
			case "url":
			case "image":
				return this.processContactTag(k[0], value);
			case "contact":
				if (k.length > 1) {
					return this.processContactTag(k[1], value);
				}
				return key;
			case "wikipedia":
				if (k.length == 2) {
					lang = k[1] + ".";
				} else {
					lang = "";
				}
				var s = value.split(':'); //Subject
				if (s.length == 2) {
					lang = s[0] + ".";
					subject = s[1];
				} else {
					subject = value;
				}
				var href = "http://" + lang + "wikipedia.org/wiki/" + subject;
				return this.makeLink(href, value, true);
			case "architect":
				return this.processMultiValue(value);
			case "addr":
				return (address ? null : value);
			case "cxx": // Connexxion bus?
				if (k[1] === 'code') {
					return this.makeLink(CONNEX + value, 'bus info: ' + value, true);
				}
			case "construction":
				if (k[1] == 'website') {
					return this.makeLink(value, value, true);
				}
				// Process all ref keys
			case "ref": // k[1] = the xxx part of the ref:xxx key
				return this.processRef(k[1], value);
			case "heritage": // heritage website?
				if (k[1] == "website") {
					return this.makeLink(value, value, true);
				} else return value;
				// process the colours for the building and the roof.
				// use a rectangle of 6 spaces long after the colour code.
				// Note spelling: "colour" is preferred over "color". See wiki.
			case "building":
				if (k[1] == "colour") {
					return value + '&nbsp;&nbsp;<span style="background-color:' + value + '">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>';
				} else return value;
			case "roof":
				if (k[1] == "colour") {
					return value + '&nbsp;&nbsp;<span style="background-color:' + value + '">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>';
				} else return value;
				// check the special keys that refer to the Dutch windmill database
			case "dhm_id":
				molen = DHM + value;
				return this.makeLink(molen, value, true);
			case "mdb_id":
				molen = MDB + value;
				return this.makeLink(molen, value, true);
			//case "schalansky_ref" :
				// Do not process the next keys as they are allready shown in the header
			case "name":
			case "operator":
			case "note":
			case "description":
			case "fixme":
			case "FIXME":
				return null;
			default:
				return value;
		}
	},

	// Deal with the xxx part of the ref:xxx key
	// Sometimes value contains multiple values for busstops. Use only the first k[0]
	processRef: function(key, value) {
		k = value.split(/[;,]/);
		switch (key) {
			// rce is the code used by the Dutch Monument Register
			case 'rce':
				return this.makeLink(MONUREG + value, 'Monument register: ' + value, true);
				//return this.makeLink(MON1 + value + MON2 + value + MON3, 'Monument register: ' + value, true);
				// The Flemish Public Transport Operator
			case 'De_Lijn':
				return this.makeLink(DELIJN + k[0], 'bus info: ' + k[0], true);
			default:
				return value;
		}
	},

	/*
	 * If value consists of more than one item - separated by characters given in the split set -
	 * turn into html string with as many lines as items. Separation by </br>
	 * For an example see the Eiffeltower!
	 */
	processMultiValue: function(value) {
		var k = value.split(/[;,]/);
		html = k[0];
		if (k.length > 1) {
			for (i = 1; i < k.length; i++) {
				html += '</br>';
				html += k[i];
			}
		}
		return html;
	},

	processContactTag: function(key, value) {
		switch (key) {
			case "website":
			case "url":
				return this.makeLink(value, value, true);
			case "image":
				return this.makeImageLink(value, value, true);
			case "twitter":
				return this.makeLink("https://twitter.com/" + value, value, true);
			case "facebook":
				if (value.indexOf("http") == 0 || value.indexOf("www") == 0 || value.indexOf("facebook") == 0) {
					return this.makeLink(value, value, true);
				}
				return this.makeLink("https://www.facebook.com/" + value, value, true);
			case "email":
				return this.makeLink("mailto:" + value, value, true);
			default:
				return value;
		}
	},

	/*
	 * Create the html for a link
	 */
	makeLink: function(href, text, newPage) {
		var html = "<a ";
		if (newPage) html += 'target="_blank" ';
		if (href.indexOf(":") == -1) {
			return html + 'href="http://' + href + '">' + text + '</a>';
		}
		return html + 'href="' + href + '">' + text + '</a>';
	},

	// Create a thumbnail of the image that links to the original image
	// This thumbnail is created in a rather stupid way: just force the image (however large) into 60 pix height!
	// Still looking for a function that gets this done faster
	// This function also adds a warning in case the license of the image is unkown.
	makeImageLink: function(href, text, newPage) {
		var html = "<a ";
		if (newPage) html += 'target="_blank" ';
		// eerst testen op wel werkende thumbnail links

		if (href.indexOf("upload.wiki") > 0) { // Image file reference is to a upload wiki file. This seems to deliver a correct thumbnail
			return html + 'href="' + href + '">' + '<img src="' + href + '" height="60"/></a>';
		}
		if (href.indexOf("http://wiki.openstreetmap") == 0) { // Image file reference is to regular osm-wiki file. Thumbnail seems to work...
			return html + 'href="' + href + '">' + '<img src="' + href + '" height="60"/></a>';
		}
		if (href.indexOf("File:") == 0) { // Image file reference is to a wikimedia file - no thumbnail yet!
			var imageLink = 'https://commons.wikimedia.org/wiki/' + href;
			return html + 'href="' + imageLink + '">' + imageLink + '</a>';
		}
		// Dan de links die niet goed tot een thumbnail zijn te herleiden	   
		if (href.indexOf("wikimedia") > 0) { // Image file reference is to a wikimedia file - no thumbnail yet! 
			return html + 'href="' + href + '">' + href + '</a>';
		}
		// Geef een melding over mogelijk ontbrekende license
		if (href.indexOf("flickr") > 0) { // Image file reference is to a flickr image. No thumbnail possible?
			return html + 'href="' + href + '">' + href + '</a><br><div class="unknownLicense">Unknown license!</div>';
		}
		if (href.indexOf("wikipedia") > 0) { // Image file reference is to a flickr image. No thumbnail possible?
			return html + 'href="' + href + '">' + href + '</a>';
		}
		return html + 'href="' + href + '">' + '<img src="' + text + '" height="60"/></a><br><div class="unknownLicense">Unknown license!</div>';
	},


	processAddress: function(tags) {
		var street = tags["addr:street"];
		var number = tags["addr:housenumber"];
		if (!(number)) number = '';
		if (!(street)) return null;
		//if (!(street && number)) return null;
		var postcode = tags["addr:postcode"];
		var city = tags["addr:city"];
		var html = street + " " + number + "<br />\n";
		if (postcode) html += postcode;
		if (postcode && city) html += "  ";
		if (city) html += city;
		if (postcode || city) html += "<br />\n";
		return html;
	},

	CLASS_NAME: "FeaturePopup"
});


//*****************************************************************
//    OpenLayers/Format/OSMExtended_v20150101.js
//*****************************************************************

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
/*
 * Extended with an option to show the center of an area as a node by Gertjan Idema
 */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/LineString.js
 * @requires OpenLayers/Geometry/Polygon.js
 * @requires OpenLayers/Projection.js
 */

/**  
 * Class: OpenLayers.Format.OSM
 * OSM parser. Create a new instance with the 
 *     <OpenLayers.Format.OSM> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.OSMExtended = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * APIProperty: checkTags
     * {Boolean} Should tags be checked to determine whether something
     * should be treated as a seperate node. Will slow down parsing.
     * Default is false.
     */
    checkTags: false,

    /**
     * Property: interestingTagsExclude
     * {Array} List of tags to exclude from 'interesting' checks on nodes.
     * Must be set when creating the format. Will only be used if checkTags
     * is set.
     */
    interestingTagsExclude: null, 
    
    /**
     * APIProperty: areaTags
     * {Array} List of tags indicating that something is an area.  
     * Must be set when creating the format. Will only be used if 
     * checkTags is true.
     */
    areaTags: null, 
    
    /**
     * Extra Property: areasAsNode
     * If set to true, an area feature will be converted to a node
     * at the center of the area and with the same tags. 
     */
    areasAsNode: null,
    /**
     * Constructor: OpenLayers.Format.OSM
     * Create a new parser for OSM.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        var layer_defaults = {
          'interestingTagsExclude': ['source', 'source_ref', 
              'source:ref', 'history', 'attribution', 'created_by'],
          'areaTags': ['area', 'building', 'leisure', 'tourism', 'ruins',
              'historic', 'landuse', 'military', 'natural', 'sport'] 
        };
          
        layer_defaults = OpenLayers.Util.extend(layer_defaults, options);
        
        var interesting = {};
        for (var i = 0; i < layer_defaults.interestingTagsExclude.length; i++) {
            interesting[layer_defaults.interestingTagsExclude[i]] = true;
        }
        layer_defaults.interestingTagsExclude = interesting;
        
        var area = {};
        for (var i = 0; i < layer_defaults.areaTags.length; i++) {
            area[layer_defaults.areaTags[i]] = true;
        }
        layer_defaults.areaTags = area;

        // OSM coordinates are always in longlat WGS84
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");
        areasAsNode = (options.areasAsNode === true);
        
        OpenLayers.Format.XML.prototype.initialize.apply(this, [layer_defaults]);
    },
    
    /**
     * APIMethod: read
     * Return a list of features from a OSM doc
     
     * Parameters:
     * doc - {Element} 
     *
     * Returns:
     * Array({<OpenLayers.Feature.Vector>})
     */
    read: function(doc) {
        if (typeof doc == "string") { 
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }

        var nodes = this.getNodes(doc);
        var ways = this.getWays(doc);
        var centerNodes = this.getCenterNodes(doc);
        
        // Geoms will contain at least ways.length entries.
        var feat_list = new Array(ways.length);
        
        for (var i = 0; i < ways.length; i++) {
            // We know the minimal of this one ahead of time. (Could be -1
            // due to areas/polygons)
            var point_list = new Array(ways[i].nodes.length);
            
            var poly = this.isWayArea(ways[i]) ? 1 : 0; 
            for (var j = 0; j < ways[i].nodes.length; j++) {
                var node = nodes[ways[i].nodes[j]];
               
                var point = new OpenLayers.Geometry.Point(node.lon, node.lat);
             
                // Since OSM is topological, we stash the node ID internally. 
                point.osm_id = parseInt(ways[i].nodes[j]);
                point_list[j] = point;
             
                // We don't display nodes if they're used inside other 
                // elements.
                node.used = true; 
            }
            var geometry = null;
            if (poly) { 
                geometry = new OpenLayers.Geometry.Polygon(
                    new OpenLayers.Geometry.LinearRing(point_list));
            } else {    
                geometry = new OpenLayers.Geometry.LineString(point_list);
            }
            if (this.internalProjection && this.externalProjection) {
                geometry.transform(this.externalProjection, 
                    this.internalProjection);
            }        
            var feat = new OpenLayers.Feature.Vector(geometry,
                ways[i].tags);
            feat.osm_id = parseInt(ways[i].id);
            feat.fid = "way." + feat.osm_id;
            feat_list[i] = feat;
        } 
          
        // Add the center nodes if any.
        for (var i = 0; i < centerNodes.length; i++) {
            var node = centerNodes[i];
            var feat = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(node['lon'], node['lat']),
                node.tags);
            if (this.internalProjection && this.externalProjection) {
                feat.geometry.transform(this.externalProjection, 
                    this.internalProjection);
            }
            feat.osm_id = parseInt(node.id);
            feat.fid = node.type + "." + feat.osm_id + ".center";
            feat_list.push(feat);
        }
        
        // Add the nodes
        for (var node_id in nodes) {
          var node = nodes[node_id];
          if (!node.used || this.checkTags) {
              var tags = null;
              
              if (this.checkTags) {
                  var result = this.getTags(node.node, true);
                  if (node.used && !result[1]) {
                      continue;
                  }
                  tags = result[0];
              } else { 
                  tags = this.getTags(node.node);
              }    
              
              var feat = new OpenLayers.Feature.Vector(
                  new OpenLayers.Geometry.Point(node['lon'], node['lat']),
                  tags);
              if (this.internalProjection && this.externalProjection) {
                  feat.geometry.transform(this.externalProjection, 
                      this.internalProjection);
              }        
              feat.osm_id = parseInt(node_id); 
              feat.fid = "node." + feat.osm_id;
              feat_list.push(feat);
          }   
          // Memory cleanup
          node.node = null;
      }        
      return feat_list;
    },

    /**
     * Method: getNodes
     * Return the node items from a doc.  
     *
     * Parameters:
     * doc - {DOMElement} node to parse tags from
     */
    getNodes: function(doc) {
        var node_list = doc.getElementsByTagName("node");
        var nodes = {};
        for (var i = 0; i < node_list.length; i++) {
            var node = node_list[i];
            var id = node.getAttribute("id");
            nodes[id] = {
                'lat': node.getAttribute("lat"),
                'lon': node.getAttribute("lon"),
                'node': node
            };
        }
        return nodes;
    },

    /**
     * Method: getWays
     * Return the way items from a doc.  
     *
     * Parameters:
     * doc - {DOMElement} node to parse tags from
     */
    getWays: function(doc) {
        var way_list = doc.getElementsByTagName("way");
        var return_ways = [];
        for (var i = 0; i < way_list.length; i++) {
            var way = way_list[i];
            var way_object = {
              id: way.getAttribute("id")
            };
            
            way_object.tags = this.getTags(way);
            
            var node_list = way.getElementsByTagName("nd");
            
            way_object.nodes = new Array(node_list.length);
            
            for (var j = 0; j < node_list.length; j++) {
                way_object.nodes[j] = node_list[j].getAttribute("ref");
            }  
            return_ways.push(way_object);
        }
        return return_ways; 
        
    },  
    
    /**
     * Method: getCenterNodes
     * Return nodes for ways and relations that have a center element
     *   the center element is added by Overpass with the 'out center' option 
     * Return the relation items from a doc only if the relation has a center specified
     * Parameters:
     * doc - {DOMElement} node to parse tags from
     */
    getCenterNodes: function(doc) {
        var centerNodes = [];
        var wayUsed = {};
        var rel_list = doc.getElementsByTagName("relation");
        for (var i = 0; i < rel_list.length; i++) {
            var rel = rel_list[i];
            var centerTags = rel.getElementsByTagName("center");
            if (centerTags.length == 1) {
                var centerNode = {
                    id: rel.getAttribute("id"),
                    tags: this.getTags(rel),
                    type: "relation",
                    lat: centerTags[0].getAttribute("lat"),
                    lon: centerTags[0].getAttribute("lon")
                };
                centerNodes.push(centerNode);
                var memberList = rel.getElementsByTagName("member");
                for (var j = 0; j < memberList.length; j++) {
                    var wayId = memberList[j].getAttribute("ref");
                    wayUsed[wayId] = true;
                }
                
            }
        }
        var way_list = doc.getElementsByTagName("way");
        for (var i = 0; i < way_list.length; i++) {
            var way = way_list[i];
            var centerTags = way.getElementsByTagName("center");
            var wayId = way.getAttribute("id");
            if (centerTags.length == 1 && !wayUsed[wayId]) {
                var centerNode = {
                    id: way.getAttribute("id"),
                    tags: this.getTags(way),
                    type: "way",
                    lat: centerTags[0].getAttribute("lat"),
                    lon: centerTags[0].getAttribute("lon")
                };
                centerNodes.push(centerNode);
            }
        }
        return centerNodes; 
        
    },  
    
    /**
     * Method: getTags
     * Return the tags list attached to a specific DOM element.
     *
     * Parameters:
     * dom_node - {DOMElement} node to parse tags from
     * interesting_tags - {Boolean} whether the return from this function should
     *    return a boolean indicating that it has 'interesting tags' -- 
     *    tags like attribution and source are ignored. (To change the list
     *    of tags, see interestingTagsExclude)
     * 
     * Returns:
     * tags - {Object} hash of tags
     * interesting - {Boolean} if interesting_tags is passed, returns
     *     whether there are any interesting tags on this element.
     */
    getTags: function(dom_node, interesting_tags) {
        var tag_list = dom_node.getElementsByTagName("tag");
        var tags = {};
        var interesting = false;
        for (var j = 0; j < tag_list.length; j++) {
            var key = tag_list[j].getAttribute("k");
            tags[key] = tag_list[j].getAttribute("v");
            if (interesting_tags) {
                if (!this.interestingTagsExclude[key]) {
                    interesting = true;
                }
            }    
        }  
        return interesting_tags ? [tags, interesting] : tags;     
    },


    /** 
     * Method: isWayArea
     * Given a way object from getWays, check whether the tags and geometry
     * indicate something is an area.
     *
     * Returns:
     * {Boolean}
     */
    isWayArea: function(way) { 
        var poly_shaped = false;
        var poly_tags = false;
        
        if (way.nodes[0] == way.nodes[way.nodes.length - 1]) {
            poly_shaped = true;
        }
        if (this.checkTags) {
            for(var key in way.tags) {
                if (this.areaTags[key]) {
                    poly_tags = true;
                    break;
                }
            }
        }    
        return poly_shaped && (this.checkTags ? poly_tags : true);            
    }, 

    /**
     * APIMethod: write 
     * Takes a list of features, returns a serialized OSM format file for use
     * in tools like JOSM.
     *
     * Parameters:
     * features - {Array(<OpenLayers.Feature.Vector>)}
     */
    write: function(features) { 
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        
        this.osm_id = 1;
        this.created_nodes = {};
        var root_node = this.createElementNS(null, "osm");
        root_node.setAttribute("version", "0.5");
        root_node.setAttribute("generator", "OpenLayers "+ OpenLayers.VERSION_NUMBER);

        // Loop backwards, because the deserializer puts nodes last, and 
        // we want them first if possible
        for(var i = features.length - 1; i >= 0; i--) {
            var nodes = this.createFeatureNodes(features[i]);
            for (var j = 0; j < nodes.length; j++) {
                root_node.appendChild(nodes[j]);
            }    
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [root_node]);
    },

    /**
     * Method: createFeatureNodes
     * Takes a feature, returns a list of nodes from size 0->n.
     * Will include all pieces of the serialization that are required which
     * have not already been created. Calls out to createXML based on geometry
     * type.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     */
    createFeatureNodes: function(feature) {
        var nodes = [];
        var className = feature.geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        type = type.toLowerCase();
        var builder = this.createXML[type];
        if (builder) {
            nodes = builder.apply(this, [feature]);
        }
        return nodes;
    },
    
    /**
     * Method: createXML
     * Takes a feature, returns a list of nodes from size 0->n.
     * Will include all pieces of the serialization that are required which
     * have not already been created.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     */
    createXML: {
        'point': function(point) {
            var id = null;
            var geometry = point.geometry ? point.geometry : point;
            
            if (this.internalProjection && this.externalProjection) {
                geometry = geometry.clone();
                geometry.transform(this.internalProjection, 
                                   this.externalProjection);
            }                       
            
            var already_exists = false; // We don't return anything if the node
                                        // has already been created
            if (point.osm_id) {
                id = point.osm_id;
                if (this.created_nodes[id]) {
                    already_exists = true;
                }    
            } else {
               id = -this.osm_id;
               this.osm_id++; 
            }
            var node;
            if (already_exists) {
                node = this.created_nodes[id];
            } else {    
                node = this.createElementNS(null, "node");
            }
            this.created_nodes[id] = node;
            node.setAttribute("id", id);
            node.setAttribute("lon", geometry.x); 
            node.setAttribute("lat", geometry.y);
            if (point.attributes) {
                this.serializeTags(point, node);
            }
            this.setState(point, node);
            return already_exists ? [] : [node];
        }, 
        linestring: function(feature) {
            var id;
            var nodes = [];
            var geometry = feature.geometry;
            if (feature.osm_id) {
                id = feature.osm_id;
            } else {
                id = -this.osm_id;
                this.osm_id++; 
            }
            var way = this.createElementNS(null, "way");
            way.setAttribute("id", id);
            for (var i = 0; i < geometry.components.length; i++) {
                var node = this.createXML['point'].apply(this, [geometry.components[i]]);
                if (node.length) {
                    node = node[0];
                    var node_ref = node.getAttribute("id");
                    nodes.push(node);
                } else {
                    node_ref = geometry.components[i].osm_id;
                    node = this.created_nodes[node_ref];
                }
                this.setState(feature, node);
                var nd_dom = this.createElementNS(null, "nd");
                nd_dom.setAttribute("ref", node_ref);
                way.appendChild(nd_dom);
            }
            this.serializeTags(feature, way);
            nodes.push(way);
            
            return nodes;
        },
        polygon: function(feature) {
            var attrs = OpenLayers.Util.extend({'area':'yes'}, feature.attributes);
            var feat = new OpenLayers.Feature.Vector(feature.geometry.components[0], attrs); 
            feat.osm_id = feature.osm_id;
            return this.createXML['linestring'].apply(this, [feat]);
        }
    },

    /**
     * Method: serializeTags
     * Given a feature, serialize the attributes onto the given node.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     * node - {DOMNode}
     */
    serializeTags: function(feature, node) {
        for (var key in feature.attributes) {
            var tag = this.createElementNS(null, "tag");
            tag.setAttribute("k", key);
            tag.setAttribute("v", feature.attributes[key]);
            node.appendChild(tag);
        }
    },

    /**
     * Method: setState 
     * OpenStreetMap has a convention that 'state' is stored for modification or deletion.
     * This allows the file to be uploaded via JOSM or the bulk uploader tool.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     * node - {DOMNode}
     */
    setState: function(feature, node) {
        if (feature.state) {
            var state = null;
            switch(feature.state) {
                case OpenLayers.State.UPDATE:
                    state = "modify";
                case OpenLayers.State.DELETE:
                    state = "delete";
            }
            if (state) {
                node.setAttribute("action", state);
            }
        }    
    },

    CLASS_NAME: "OpenLayers.Format.OSM" 
});     


//*****************************************************************
// noordpass_mz_icon.js
//*****************************************************************

var zoomlevel = 14;	 // Starting level for collecting data on the map
var popUpZoom = 14;  // dit is het minimale zoomniveau voor het popupvenster, waarbij het begint te werken.
var ICON_Z_INDEX = 11;

function setStatusText(text) {
	var html_node = document.getElementById("statusline");
	if (html_node != null) {
		html_node.innerHTML = text;
		if (text != "") {
			html_node.style.visibility = "visible";
		}
		else {
			html_node.style.visibility = "hidden";
		}
	}
}
var zoom_valid = true;
var load_counter = 0;

function make_features_added_closure() {
return function (evt) {
	setStatusText("");
	if (zoom_valid) {
		--load_counter;
		if (load_counter <= 0)setStatusText("");
	}
};
}
//zoomlevel
ZoomLimitedBBOXStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, 
{
	zoom_data_limit : zoomlevel,  
	initialize : function (zoom_data_limit) 
	{
		this.zoom_data_limit = zoom_data_limit;
		//alert(zoom_data_limit);
	}, 
	update : function (options) 
	{
		var mapBounds = this.getMapBounds();
		if (this.layer && this.layer.map && this.layer.map.getZoom() < this.zoom_data_limit) {
			if (this.layer.visibility == true) {
				setStatusText(" Please zoom in to view data! ");
				zoom_valid = false;
				this.bounds = null;
			}
		}
		else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
			if (this.layer.visibility == true) {
				++load_counter;
				setStatusText("<img src='img/zuurstok.gif'>");
				zoom_valid = true;
				this.calculateBounds(mapBounds);
				this.resolution = this.layer.map.getResolution();
				this.triggerRead(options);
			}
		}
	}, 
	CLASS_NAME : "ZoomLimitedBBOXStrategy"
}
);

// For some icons on the map a different geometry is needed. Especially for triangular traffic signs
// The next two functions deal with this - although only for one condition: "Construction"
// 
function graphW (name) {
	return (name == "Construction" ) ? 23 : 24;
}

function graphH (name) {
	return (name == "Construction" ) ? 20 : 30;
}

// Deze functie selecteert het juiste icoontje bij een bepaalde tag
// name = naam zoals gedefinieerd in de layerdef_array
// uDef = Geeft aan of de userpois worden gebruikt
// num = het nummer dat wordt gebruikt voor de afbeelding. Alleen als uDef = true.

function icon2use (name,uDef,num) {
	if  (uDef == false)  { // geen gebruikers tags
		switch (name) {
			case "Alcohol" : return "mapicons/liquor.png";
			case "Alpine hut" : return "mapicons/alpine_hut.png";
			case "Apartment" : return "mapicons/apartment-3.png";
			case "Arts centre" : return "mapicons/letter_a.png";
			case "Artwork" : return "mapicons/artwork.png";
			case "Attraction" : return "mapicons/number_1.png";
			case "ATM" : return "mapicons/atm-2.png";	
			case "Bakery" : return "mapicons/bread.png";
			case "Bar" : return "mapicons/bar.png";
			case "BBQ" : return "mapicons/letter_b.png";
			case "Beauty" : return "mapicons/beautysalon.png";
			case "Bench" : return "mapicons/letter_b.png";
			case "Biergarten" : return "mapicons/number_1.png";
			case "Beverages" : return "mapicons/bar_coktail.png";
			case "Bicycle" : return "mapicons/bicycle_shop.png";
			case "Bicycle parking" : return "mapicons/parking_bicycle-2.png";
			case "Bicycle rental" : return "mapicons/cycling.png";
			case "Books/Stationary" : return "mapicons/library.png";
			case "Busstop" : return "mapicons/busstop.png";
			case "Butcher" : return "mapicons/butcher-2.png";
			case "Cafe" : return "mapicons/cafetaria.png";
			case "Camp site" : return "mapicons/camping-2.png";
			case "Car" : return "mapicons/car.png";
			case "Chalet" : return "mapicons/letter_c.png";
			case "Cheese" : return "mapicons/cheese.png";
			case "Chemist" : return "mapicons/drugstore.png";
			case "Chocolate/Confectionery" : return "mapicons/candy.png";
			case "Cinema" : return "mapicons/cinema.png";			
			case "Clothes" : return "mapicons/clothers_female.png";
			case "Coffee" : return "mapicons/coffee.png";
			case "Construction" : return "mapicons/highwayconstruction.png";
			case "Copyshop" : return "mapicons/letter_c.png";
			case "Cosmetics" : return "mapicons/perfumery.png";
			case "Dairy" : return "mapicons/milk_and_cookies.png";
			case "Defibrillator - AED" : return "mapicons/aed-2.png";
			case "Deli" : return "mapicons/patisserie.png";
			case "Department store" : return "mapicons/departmentstore.png";
			case "Drinking water" : return "mapicons/drinkingwater.png";
			case "E-bike charging" : return "mapicons/e-bike-charging.png";
			case "Fast food" : return "mapicons/fastfood.png";
			case "Food court" : return "mapicons/letter_f.png";
			case "fixme" : return "mapicons/letter_x.png";
			case "Fire hose/extinguisher<hr>" : return "mapicons/fireexstinguisher.png";
			case "Fuel" : return "mapicons/fillingstation.png";
			case "Gallery" : return "mapicons/artgallery.png";
			case "General" : return "mapicons/letter_g.png";
			case "Gift" : return "mapicons/gifts.png";
			case "Grocery" : return "mapicons/grocery.png";
			case "Guest house" : return "mapicons/bed_breakfast.png";
			case "Hairdresser" : return "mapicons/barber.png";
			case "Heritage" : return "mapicons/letter_h.png";			
 			case "Hostel" : return "mapicons/hostel_0star.png";
 			case "Hotel" : return "mapicons/hotel_0star.png";
			case "Ice cream" : return "mapicons/icecream.png";
			case "Image" : return "mapicons/image.png";
			case "Information" : return "mapicons/information.png";
			case "Jewelry" : return "mapicons/jewelry.png";
			case "Kindergarten" : return "mapicons/daycare.png";			
			case "Leather" : return "mapicons/bags.png";
			case "Library" : return "mapicons/library.png";
			case "Marketplace" : return "mapicons/letter_m.png";
			case "Memorial" : return "mapicons/memorial.png";
			case "Monument/memorial" : return "mapicons/memorial.png";
 			case "Monumental Tree" : return "mapicons/bigtree.png";
			case "Motel" : return "mapicons/motel-2.png";
			case "Museum" : return "mapicons/museum_art.png";
			case "Musical instrument" : return "mapicons/music_rock.png";
			case "Office" : return "mapicons/office-building.png";		
			case "Optician" : return "mapicons/glasses.png";		
			case "Organic" : return "mapicons/restaurant_vegetarian.png";
			case "Parking" : return "mapicons/parkinggarage.png";
			case "Pharmacy" : return "mapicons/medicine.png";			
			case "Photo" : return "mapicons/photo.png";
			case "Picnic" : return "mapicons/picnic-2.png";
			case "Place of worship" : return "mapicons/church-2.png";
			case "Police" : return "mapicons/police.png";
			case "Post box" : return "mapicons/letter_p.png";
			case "Post office" : return "mapicons/postal.png";
			case "Pub" : return "mapicons/pub.png";
			case "Public camera<hr>" : return "mapicons/video.png";			
			case "Recycling" : return "mapicons/letter_r.png";
			case "Restaurant" : return "mapicons/restaurant.png";
			case "School/college" : return "mapicons/school.png";
			case "Seafood" : return "mapicons/restaurant_fish.png";
			case "Shoes" : return "mapicons/highhills.png";
			case "Shopping centre" : return "mapicons/mall.png";
			case "Soccer" : return "mapicons/soccer.png";
			case "Statue" : return "mapicons/statue-2.png";
			case "Supermarket" : return "mapicons/supermarket.png";
			case "Taxi" : return "mapicons/taxi.png";
			case "Theatre" : return "mapicons/theater.png";
			case "Theme park" : return "mapicons/letter_t.png";
			case "Toilets" : return "mapicons/toilets.png";
			case "Toys" : return "mapicons/toys.png";
			case "Travel agency<hr>" : return "mapicons/travel_agency.png";
			case "University" : return "mapicons/university.png";			
			case "Viewpoint" : return "mapicons/sight-2.png";
			case "Watermill" : return "mapicons/watermill-2.png";
			case "Windmill" : return "mapicons/windmill-2.png";
			case "Wine" : return "mapicons/winebar.png";			
			case "ZOO" : return "mapicons/zoo.png";
// sport			
			case "American football" : return "mapicons/usfootball.png";
			case "Golf" : return "mapicons/golfing.png";
			case "Tennis" : return "mapicons/tennis.png";
			case "Volleyball" : return "mapicons/volleyball.png";
			case "Baseball" : return "mapicons/baseball.png";
			case "Basketball" : return "mapicons/basketball.png";
			case "Ice hockey" : return "mapicons/icehockey.png";
			case "Hockey" : return "mapicons/hockey.png";
			case "Cycling" : return "mapicons/cycling.png";
			case "Swimming" : return "mapicons/swimming.png";
			case "Sports centre" : return "mapicons/indoor-arena.png";
			case "Surfing" : return "mapicons/surfing.png";
			case "Gymnastics" : return "mapicons/gymnastics.png";
			case "Horse racing" : return "mapicons/horseriding.png";
			case "City" : return "mapicons/letter_city.png";
			case "Town" : return "mapicons/letter_town.png";
			case "Village" : return "mapicons/letter_village.png";
			case "Hamlet" : return "mapicons/letter_hamlet.png";
			case "fietspad" : return "mapicons/letter_f.png";
			
//			case "Test" : return "mapicons/number_1.png";	// voor testdoeleinden		
//			case "Test2" : return "mapicons/number_2.png";	// voor testdoeleinden		
		} //end switch 
	} else {
			// gebruikers tags
			// Gebruik een icon met een oplopende nummering
			return "mapicons/number_" + num + ".png";
		}
}


// Adjust the formatting of the icons and text in the layerlist
function getCheckboxName (name,uDef,num) {
	return (name == "Construction") ? "<img style=\"vertical-align: middle; width=\"18\" height=\"21\"; src=\"" + icon2use(name,uDef,num) + "\">" + "&nbsp" + name : "<img style=\"vertical-align: middle; width=\"22\" height=\"26\"; src=\"" + icon2use(name,uDef,num) + "\">" + "&nbsp" + name;
}


// make_array_layer works with the layerdefinitions in layerdef_array_mz.js

function make_array_layer(data_array,uDef,vulKleur) {
	var largeLayerArray = [];							// voor het bewaren van de resultaten van make_large_layer
	for (i = 0; i < data_array.length; i++) {
		//Overpass-serveradres toevoegen. Dit lukte niet door de variable QURL in de layerdef te zetten! ??
		data_array[i].url = QURL + data_array[i].url; 
		largeLayerArray[i] = make_large_layer(vulKleur,uDef,i+1,data_array[i].url, data_array[i].naam, zoomlevel, data_array[i].zichtbaar);        
	} //end for i=0
	return largeLayerArray;
}

// ------------------------- originele layer -----------------------------------------------------------------------
// make_large_layer is called by make_array_layer.

function make_large_layer(vulKleur,uDef, num, data_url, name, zoom, visible) {	
				
	var	styleMap = new OpenLayers.StyleMap({
		externalGraphic: icon2use(name,uDef,num),
		graphicOpacity: 1,
		fillColor: vulKleur,
		fillOpacity: 0.1,
		graphicWidth: graphW(name),
		graphicHeight: graphH(name),
		graphicYOffset: -graphH(name), // places the point of the marker on the node.
		graphicZIndex: ICON_Z_INDEX,
 		strokeWidth: 1	// for the drawing of the contour	
		});

	// checkboxName is de naam zoal hij in de layerlist staat, na het selectievakje, inclusief de afbeelding!
	// Het is een combinatie van icon en naam	
	
	var checkBoxName = getCheckboxName(name,uDef,num); 
	
	var layer =  new OpenLayers.Layer.Vector(
		checkBoxName, 
		{
			strategies : [new ZoomLimitedBBOXStrategy(zoomlevel)], 
			protocol :  new OpenLayers.Protocol.HTTP( {
				url : data_url, 
				format :  new OpenLayers.Format.OSMExtended( {
					checkTags : true,
					interestingTagsExclude : ["entrance","3dr:direction","level"],
					areaTags : ["building","area", "leisure", "sport", "barrier"]				
				})
			}), 
			styleMap : styleMap, 
			visibility : visible, 
			projection :  new OpenLayers.Projection("EPSG:4326")
		} 
		);
	layer.events.register("loadend", layer, make_features_added_closure());
	return layer;
}

	
// ----------------------------- switchtab code-- 
function switchtab(newtab, activetab) { // was switchlayers(newlayer,active)

	// this destroys all layers that are not baselayers 
	// and construct a list of visable layers in the current view

	//var currentChoice = getSelectedOverlaysURL();
	tabtype[activetab] = "";
	
	for (i = map.layers.length - 1; i > 1; i--) { // store visibility and than destroy layer
	 	//selectControl.deactivate();
		if (map.layers[i].isBaseLayer == false) {
			if (map.layers[i].visibility == true){
				tabtype[activetab] = "1" + tabtype[activetab];  // tabtype[activetab] > "00101100001" where last character is last layer
			}
			else{
				tabtype[activetab] = "0" + tabtype[activetab];
			}
			map.layers[i].destroy();
		}
	}

	//set the new layer, retrieve mapvis if it exists and apply

	layerdef(newtab);

	if (tabtype[newtab] !== undefined){
		offset = map.layers.length - tabtype[newtab].length;
		for (i = offset ;  i < map.layers.length; i++) {
			if ( tabtype[newtab].charAt(i-offset) == "1"){
				map.layers[i].setVisibility(true);
			}
			else{
				map.layers[i].setVisibility(false);
			}
		}
	}

	// update layout and global vars and permalink
	document.getElementById(activetab).className = "dorment";
	document.getElementById(newtab).className = "choice";
	
	tabtype.name =  newtab;
	plink.base = "?" + "map=" +  newtab;
	plink.updateLink();
	// done!
}

// update zoomindicatie
function showZoom(zoom) {
	document.getElementById("zoom").innerHTML = map.Getzoom();
}

function showPosition(position){
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), popUpZoom);
	}
		
function getPos(){
	if (navigator.geolocation) {
		var my_geo_options = {enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(showPosition,noPos,my_geo_options);
		}
	}
		
function noPos(ercode) {
	alert("Unable to get location");
	}



//*****************************************************************
// layerdef_array_mz_icon.js
//*****************************************************************


//=====================================================================
// This block contains the layerdefinitions
//=====================================================================

var amenitydef = [
	{url: "?data=(node[amenity=atm](bbox);way[amenity=atm](bbox);node[amenity=bank][atm][atm!=no](bbox);way[amenity=bank][atm][atm!=no](bbox);rel[amenity=bank][atm][atm!=no](bbox));(._;>;);out center;", naam: "ATM", zichtbaar: false},
	{url: "?data=(node[amenity=bench](bbox);node(w););out center;", naam: "Bench", zichtbaar: false},
	{url: "?data=(node[amenity=bicycle_parking](bbox);way[amenity=bicycle_parking](bbox);rel[amenity=bicycle_parking](bbox));(._;>;);out center;", naam: "Bicycle parking", zichtbaar: false},
	{url: "?data=(node[amenity=bicycle_rental](bbox);way[amenity=bicycle_rental](bbox);rel[amenity=bicycle_rental](bbox));(._;>;);out center;", naam: "Bicycle rental", zichtbaar: false},
	{url: "?data=(node[amenity=cinema](bbox);way[amenity=cinema](bbox);rel[amenity=cinema](bbox));(._;>;);out center;", naam: "Cinema", zichtbaar: false},
	{url: "?data=(node[amenity=fuel](bbox);way[amenity=fuel](bbox);rel[amenity=fuel](bbox));(._;>;);out center;", naam: "Fuel", zichtbaar: false},
	{url: "?data=(node[amenity=library](bbox);way[amenity=library](bbox);rel[amenity=library](bbox));(._;>;);out center;", naam: "Library", zichtbaar: false},
	{url: "?data=(node[amenity=parking](bbox);way[amenity=parking](bbox);rel[amenity=parking](bbox));(._;>;);out center;", naam: "Parking", zichtbaar: false},
	{url: "?data=(node[amenity=pharmacy](bbox);way[amenity=pharmacy](bbox);rel[amenity=pharmacy](bbox));(._;>;);out center;", naam: "Pharmacy", zichtbaar: false},
	{url: "?data=(node[amenity=place_of_worship](bbox);way[amenity=place_of_worship](bbox);rel[amenity=place_of_worship](bbox));(._;>;);out center;", naam: "Place of worship", zichtbaar: false},
	{url: "?data=(node[amenity=police](bbox);way[amenity=police](bbox);rel[amenity=police](bbox));(._;>;);out center;", naam: "Police", zichtbaar: false},
	{url: "?data=(node[amenity=post_box](bbox);node(w););out center;", naam: "Post box", zichtbaar: false},
	{url: "?data=(node[amenity=post_office](bbox);way[amenity=post_office](bbox);rel[amenity=post_office](bbox));(._;>;);out center;", naam: "Post office", zichtbaar: false},
	{url: "?data=(node[amenity=school](bbox);way[amenity=school](bbox);rel[amenity=school](bbox);node[amenity=college](bbox);way[amenity=college](bbox);rel[amenity=college](bbox));(._;>;);out center;", naam: "School/college", zichtbaar: false},
	{url: "?data=(node[amenity=taxi](bbox);way[amenity=taxi](bbox);rel[amenity=taxi](bbox));(._;>;);out center;", naam: "Taxi", zichtbaar: false},
	{url: "?data=(node[amenity=theatre](bbox);way[amenity=theatre](bbox);rel[amenity=theatre](bbox));(._;>;);out center;", naam: "Theatre", zichtbaar: false},
	{url: "?data=(node[amenity=toilets](bbox);way[amenity=toilets](bbox);rel[amenity=toilets](bbox));(._;>;);out center;", naam: "Toilets", zichtbaar: false},
	{url: "?data=(node[amenity=university](bbox);way[amenity=university](bbox);rel[amenity=university](bbox));(._;>;);out center;", naam: "University", zichtbaar: false}
];
// Code voor de diverse religies - nog niet in gebruik
// 	{url: "?data=(node[amenity=place_of_worship][religion=christian](bbox);way[amenity=place_of_worship][religion=christian](bbox));(._;>;);out center;", naam: "Church (Christian)", zichtbaar: false},
// 	{url: "?data=(node[amenity=place_of_worship][religion=muslim](bbox);way[amenity=place_of_worship][religion=muslim](bbox));(._;>;);out center;", naam: "Mosque", zichtbaar: false},
// 	{url: "?data=(node[amenity=place_of_worship][religion=buddhist](bbox);way[amenity=place_of_worship][religion=buddhist](bbox));(._;>;);out center;", naam: "Temple (Buddhist)", zichtbaar: false},
// 	{url: "?data=(node[amenity=place_of_worship][religion=jewish](bbox);way[amenity=place_of_worship][religion=jewish](bbox));(._;>;);out center;", naam: "Synagogue", zichtbaar: false},
// 	{url: "?data=(node[amenity=place_of_worship][religion=hindu](bbox);way[amenity=place_of_worship][religion=hindu](bbox));(._;>;);out center;", naam: "Temple (Hindu)", zichtbaar: false},

var tourismdef = [
// places to see
	{url: "?data=(node[amenity=arts_centre](bbox);way[amenity=arts_centre](bbox);rel[amenity=arts_centre](bbox));(._;>;);out center;", naam: "Arts centre", zichtbaar: false},
	{url: "?data=(node[tourism=artwork](bbox);way[tourism=artwork](bbox);rel[tourism=artwork](bbox));(._;>;);out center;", naam: "Artwork", zichtbaar: false},
	{url: "?data=(node[tourism=attraction](bbox);way[tourism=attraction](bbox);rel[tourism=attraction](bbox));(._;>;);out center;", naam: "Attraction", zichtbaar: false},
	{url: "?data=(node[tourism=gallery](bbox);way[tourism=gallery](bbox);rel[tourism=gallery](bbox));(._;>;);out center;", naam: "Gallery", zichtbaar: false},
	{url: "?data=(node[heritage](bbox);way[heritage](bbox);rel[heritage](bbox));(._;>;);out center;", naam: "Heritage", zichtbaar: false},
	{url: "?data=(node[tourism=information](bbox);way[tourism=information](bbox));(._;>;);out center;", naam: "Information", zichtbaar: false},
	{url: "?data=(node[historic=monument](bbox);way[historic=monument](bbox);rel[historic=monument](bbox);node[historic=memorial](bbox);way[historic=memorial](bbox);rel[historic=memorial](bbox));(._;>;);out center;", naam: "Monument/memorial", zichtbaar: false},
	{url: "?data=(node[natural=tree][historic=monument](bbox);node[natural=tree][monument=yes](bbox));(._;>;);out center;", naam: "Monumental Tree", zichtbaar: false},
	{url: "?data=(node[tourism=museum](bbox);way[tourism=museum](bbox);rel[tourism=museum](bbox));(._;>;);out center;", naam: "Museum", zichtbaar: false},
	{url: "?data=(node[tourism=picnic_site](bbox);way[tourism=picnic_site](bbox);rel[tourism=picnic_site](bbox));(._;>;);out center;", naam: "Picnic", zichtbaar: false},
	{url: "?data=(node[historic=statue](bbox);way[historic=statue](bbox));(._;>;);out center;", naam: "Statue", zichtbaar: false},
	{url: "?data=(node[tourism=theme_park](bbox);way[tourism=theme_park](bbox);rel[tourism=picnic_site](bbox));(._;>;);out center;", naam: "Theme park", zichtbaar: false},
	{url: "?data=(node[tourism=viewpoint](bbox);way[tourism=viewpoint](bbox);rel[tourism=viewpoint](bbox));(._;>;);out center;", naam: "Viewpoint", zichtbaar: false},
	{url: "?data=(node[man_made=windmill](bbox);way[man_made=windmill](bbox);rel[man_made=windmill](bbox));(._;>;);out center;", naam: "Windmill", zichtbaar: false},
	{url: "?data=(node[man_made=watermill](bbox);way[man_made=watermill](bbox);rel[man_made=watermill](bbox));(._;>;);out center;", naam: "Watermill", zichtbaar: false},
	{url: "?data=(node[tourism=zoo](bbox);way[tourism=zoo](bbox);rel[tourism=zoo](bbox));(._;>;);out center;", naam: "ZOO", zichtbaar: false}
];

var hotelsdef = [
// Places to stay	
	{url: "?data=(node[tourism=alpine_hut](bbox);way[tourism=alpine_hut](bbox);rel[tourism=alpine_hut](bbox));(._;>;);out center;", naam: "Alpine hut", zichtbaar: false},
	{url: "?data=(node[tourism=apartment](bbox);way[tourism=apartment](bbox);rel[tourism=apartment](bbox));(._;>;);out center;", naam: "Apartment", zichtbaar: false},
	{url: "?data=(node[tourism=camp_site][backcountry!=yes](bbox);way[tourism=camp_site][backcountry!=yes](bbox);rel[tourism=camp_site][backcountry!=yes](bbox));(._;>;);out center;", naam: "Camp site", zichtbaar: false},
	{url: "?data=(node[tourism=chalet](bbox);way[tourism=chalet](bbox);rel[tourism=chalet](bbox));(._;>;);out center;", naam: "Chalet", zichtbaar: false},			
	{url: "?data=(node[tourism=guest_house](bbox);way[tourism=guest_house](bbox);rel[tourism=guest_house](bbox));(._;>;);out center;", naam: "Guest house", zichtbaar: false},
	{url: "?data=(node[tourism=hostel](bbox);way[tourism=hostel](bbox);rel[tourism=hostel](bbox));(._;>;);out center;", naam: "Hostel", zichtbaar: false},
	{url: "?data=(node[tourism=hotel](bbox);way[tourism=hotel](bbox);rel[tourism=hotel](bbox));(._;>;);out center;", naam: "Hotel", zichtbaar: false},
	{url: "?data=(node[tourism=motel](bbox);way[tourism=motel](bbox);rel[tourism=motel](bbox));(._;>;);out center;", naam: "Motel", zichtbaar: false}				
];

var sportdef = [
	{url: "?data=(way[sport=american_football](bbox);way[sport=american_football](bbox));(._;>;);out center;", naam: "American football", zichtbaar: false},
	{url: "?data=(way[sport=baseball](bbox);node[sport=baseball](bbox));(._;>;);out center;", naam: "Baseball", zichtbaar: false},
	{url: "?data=(way[sport=basketball](bbox);node[sport=basketball](bbox));(._;>;);out center;", naam: "Basketball", zichtbaar: false},
	{url: "?data=(way[sport=cycling](bbox);node[sport=cycling](bbox);rel[sport=cycling](bbox));(._;>;);out center;", naam: "Cycling", zichtbaar: false},
	{url: "?data=(way[sport=gymnastics](bbox);node[sport=gymnastics](bbox);rel[sport=gymnastics](bbox));(._;>;);out center;", naam: "Gymnastics", zichtbaar: false},
	{url: "?data=(way[leisure=golf_course](bbox);way[sport=golf](bbox);node[leisure=golf_course](bbox);node[sport=golf](bbox);rel[leisure=golf_course](bbox);rel[sport=golf](bbox));(._;>;);out center;", naam: "Golf", zichtbaar: false},		
	{url: "?data=(way[sport=hockey](bbox);node[sport=hockey](bbox);rel[sport=hockey](bbox);way[sport=field_hockey](bbox);node[sport=field_hockey](bbox);rel[sport=field_hockey](bbox));(._;>;);out center;", naam: "Hockey", zichtbaar: false},
	{url: "?data=(way[sport=horse_racing](bbox);(way[sport=equestrian](bbox);node[sport=horse_racing](bbox);(node[sport=equestrian](bbox));(._;>;);out center;", naam: "Horse racing", zichtbaar: false},
	{url: "?data=(way[sport=ice_hockey](bbox);node[sport=ice_hockey](bbox);rel[sport=ice_hockey](bbox);way[leisure=ice_rink](bbox));(node[leisure=ice_rink](bbox));(._;>;);out center;", naam: "Ice hockey", zichtbaar: false},
	{url: "?data=(way[sport=soccer](bbox);node[sport=soccer](bbox);rel[sport=soccer](bbox));(._;>;);out center;", naam: "Soccer", zichtbaar: false},
	{url: "?data=(way[leisure=sports_centre](bbox);node[leisure=sports_centre](bbox);rel[leisure=sports_centre](bbox));(._;>;);out center;", naam: "Sports centre", zichtbaar: false},		
	{url: "?data=(way[sport=surfing](bbox);node[sport=surfing](bbox);rel[sport=surfing](bbox));(._;>;);out center;", naam: "Surfing", zichtbaar: false},
	{url: "?data=(way[sport=swimming](bbox);node[sport=swimming](bbox);rel[sport=swimming](bbox));(._;>;);out center;", naam: "Swimming", zichtbaar: false},
	{url: "?data=(way[sport=tennis](bbox);node[sport=tennis](bbox));(._;>;);out center;", naam: "Tennis", zichtbaar: false},
	{url: "?data=(way[sport=volleybal](bbox);node[sport=volleybal](bbox));(._;>;);out center;", naam: "Volleyball", zichtbaar: false}
];
var shopdef = [
//Various shops (excluding food)			
	{url: "?data=(node[shop=beauty](bbox);way[shop=beauty](bbox);rel[shop=beauty](bbox));(._;>;);out center;", naam: "Beauty", zichtbaar: false},
	{url: "?data=(node[shop=bicycle](bbox);way[shop=bicycle](bbox);rel[shop=bicycle](bbox));(._;>;);out center;", naam: "Bicycle", zichtbaar: false},
	{url: "?data=(node[shop=books](bbox);way[shop=books](bbox);rel[shop=books](bbox);way[shop=stationery](bbox);node[shop=stationery](bbox);rel[shop=stationery](bbox));(._;>;);out center;", naam: "Books/Stationary", zichtbaar: false},
	{url: "?data=(node[shop=car](bbox);way[shop=car](bbox);rel[shop=car](bbox));(._;>;);out center;", naam: "Car", zichtbaar: false},
	{url: "?data=(node[shop=chemist](bbox);way[shop=chemist](bbox);rel[shop=chemist](bbox));(._;>;);out center;", naam: "Chemist", zichtbaar: false},
	{url: "?data=(node[shop=clothes](bbox);way[shop=clothes](bbox);rel[shop=clothes](bbox));(._;>;);out center;", naam: "Clothes", zichtbaar: false},
	{url: "?data=(node[shop=copyshop](bbox);way[shop=copyshop](bbox);rel[shop=copyshop](bbox));(._;>;);out center;", naam: "Copyshop", zichtbaar: false},
	{url: "?data=(node[shop=cosmetics](bbox);way[shop=cosmetics](bbox);rel[shop=cosmetics](bbox));(._;>;);out center;", naam: "Cosmetics", zichtbaar: false},
	{url: "?data=(node[shop=department_store](bbox);way[shop=department_store](bbox));(._;>;);out center;", naam: "Department store", zichtbaar: false},
	{url: "?data=(node[shop=general](bbox);way[shop=general](bbox));(._;>;);out center;", naam: "General", zichtbaar: false},
	{url: "?data=(node[shop=gift](bbox);way[shop=gift](bbox);rel[shop=gift](bbox));(._;>;);out center;", naam: "Gift", zichtbaar: false},
	{url: "?data=(node[shop=hairdresser](bbox);way[shop=hairdresser](bbox);rel[shop=hairdresser](bbox));(._;>;);out center;", naam: "Hairdresser", zichtbaar: false},		
	{url: "?data=(node[shop=jewelry](bbox);way[shop=jewelry](bbox);rel[shop=jewelry](bbox));(._;>;);out center;", naam: "Jewelry", zichtbaar: false},
	{url: "?data=(node[shop=leather](bbox);way[shop=leather](bbox);rel[shop=leather](bbox));(._;>;);out center;", naam: "Leather", zichtbaar: false},
	{url: "?data=(node[shop=musical_instrument](bbox);way[shop=musical_instrument](bbox);rel[shop=musical_instrument](bbox));(._;>;);out center;", naam: "Musical instrument",lijn: 2.7, zichtbaar: false},		
	{url: "?data=(node[shop=optician](bbox);way[shop=optician](bbox);rel[shop=optician](bbox));(._;>;);out center;", naam: "Optician", zichtbaar: false},
	{url: "?data=(node[shop=photo](bbox);way[shop=photo](bbox);rel[shop=photo](bbox));(._;>;);out center;", naam: "Photo", zichtbaar: false},
	{url: "?data=(node[shop=shoes](bbox);way[shop=shoes](bbox));(._;>;);out center;", naam: "Shoes", zichtbaar: false},
	{url: "?data=(node[shop=mall](bbox);way[shop=mall](bbox);rel[shop=mall](bbox));(._;>;);out center;", naam: "Shopping centre", zichtbaar: false},
	{url: "?data=(node[shop=toys](bbox);way[shop=toys](bbox);rel[shop=toys](bbox));(._;>;);out center;", naam: "Toys", zichtbaar: false}
];
var fooddef = [
// food shops		
	{url: "?data=(node[shop=alcohol](bbox);way[shop=alcohol](bbox);rel[shop=alcohol](bbox));(._;>;);out center;", naam: "Alcohol", zichtbaar: false},
	{url: "?data=(node[shop=bakery](bbox);way[shop=bakery](bbox));(._;>;);out center;", naam: "Bakery", zichtbaar: false},
	{url: "?data=(node[shop=beverages](bbox);way[shop=beverages](bbox);rel[shop=beverages](bbox));(._;>;);out center;", naam: "Beverages", zichtbaar: false},
	{url: "?data=(node[shop=butcher](bbox);way[shop=butcher](bbox);rel[shop=butcher](bbox));(._;>;);out center;", naam: "Butcher", zichtbaar: false},
	{url: "?data=(node[shop=cheese](bbox);way[shop=cheese](bbox);rel[shop=cheese](bbox));(._;>;);out center;", naam: "Cheese", zichtbaar: false},
	{url: "?data=(node[shop=chocolate](bbox);way[shop=chocolate](bbox);rel[shop=chocolate](bbox);node[shop=confectionery](bbox);way[shop=confectionery](bbox);rel[shop=confectionery](bbox));(._;>;);out center;", naam: "Chocolate/Confectionery", zichtbaar: false},
	{url: "?data=(node[shop=coffee](bbox);way[shop=coffee](bbox);rel[shop=coffee](bbox));(._;>;);out center;", naam: "Coffee", zichtbaar: false},
	{url: "?data=(node[shop=dairy](bbox);way[shop=dairy](bbox));(._;>;);out center;", naam: "Dairy", zichtbaar: false},
	{url: "?data=(node[shop=deli](bbox);way[shop=deli](bbox);node[shop=delicatessen](bbox);way[shop=delicatessen](bbox));(._;>;);out center;", naam: "Deli", zichtbaar: false},
	{url: "?data=(node[amenity=drinking_water](bbox);way[amenity=drinking_water](bbox);rel[amenity=drinking_water](bbox));(._;>;);out center;", naam: "Drinking water", zichtbaar: false},
	{url: "?data=(node[shop=grocery](bbox);way[shop=grocery](bbox));(._;>;);out center;", naam: "Grocery", zichtbaar: false},
	{url: "?data=(node[shop=organic](bbox);way[shop=organic](bbox);rel[shop=organic](bbox));(._;>;);out center;", naam: "Organic", zichtbaar: false},
	{url: "?data=(node[shop=seafood](bbox);way[shop=seafood](bbox);rel[shop=seafood](bbox));(._;>;);out center;", naam: "Seafood", zichtbaar: false},
	{url: "?data=(node[shop=supermarket](bbox);way[shop=supermarket](bbox));(._;>;);out center;", naam: "Supermarket", zichtbaar: false},
	{url: "?data=(node[shop=wine](bbox);way[shop=wine](bbox);rel[shop=wine](bbox));(._;>;);out center;", naam: "Wine", zichtbaar: false}
];

var restaurantsdef = [
// places to eat
	{url: "?data=(node[amenity=bar](bbox);way[amenity=bar](bbox);rel[amenity=bar](bbox));(._;>;);out center;", naam: "Bar", zichtbaar: false},
	{url: "?data=(node[amenity=bbq](bbox);way[amenity=bbq](bbox));(._;>;);out center;", naam: "BBQ", zichtbaar: false},
	{url: "?data=(node[amenity=biergarten](bbox);way[amenity=biergarten](bbox));(._;>;);out center;", naam: "Biergarten", zichtbaar: false},
	{url: "?data=(node[amenity=cafe](bbox);way[amenity=cafe](bbox);rel[amenity=cafe](bbox));(._;>;);out center;", naam: "Cafe", zichtbaar: false},
	{url: "?data=(node[amenity=fast_food](bbox);way[amenity=fast_food](bbox);rel[amenity=fast_food](bbox));(._;>;);out center;", naam: "Fast food", zichtbaar: false},
	{url: "?data=(node[amenity=food_court](bbox);way[amenity=food_court](bbox));(._;>;);out center;", naam: "Food court", zichtbaar: false},
	{url: "?data=(node[amenity=ice_cream](bbox);way[amenity=ice_cream](bbox);rel[amenity=ice_cream](bbox);node[cuisine=ice_cream](bbox);way[cuisine=ice_cream](bbox);rel[cuisine=ice_cream](bbox));(._;>;);out center;", naam: "Ice cream", zichtbaar: false},
	{url: "?data=(node[amenity=pub](bbox);way[amenity=pub](bbox);rel[amenity=pub](bbox));(._;>;);out center;", naam: "Pub", zichtbaar: false},
	{url: "?data=(node[amenity=restaurant](bbox);way[amenity=restaurant](bbox);rel[amenity=restaurant](bbox));(._;>;);out center;", naam: "Restaurant", zichtbaar: false}
];

var variousdef = [
	{url: "?data=(node[highway=bus_stop](bbox));(._;>;);out center;", naam: "Busstop", zichtbaar: false},
	{url: "?data=(node[amenity=charging_station][bicycle=yes](bbox));(._;>;);out center;", naam: "E-bike charging", zichtbaar: false},
	{url: "?data=(node[amenity=kindergarten](bbox);way[amenity=kindergarten](bbox);rel[amenity=kindergarten](bbox));(._;>;);out center;", naam: "Kindergarten", zichtbaar: false},
	{url: "?data=(node[amenity=marketplace](bbox);way[amenity=marketplace](bbox);rel[amenity=marketplace](bbox));(._;>;);out center;", naam: "Marketplace", zichtbaar: false},
	{url: "?data=(node[office](bbox);way[office](bbox);rel[office](bbox));(._;>;);out center;", naam: "Office", zichtbaar: false},	
	{url: "?data=(node[amenity=recycling](bbox);way[amenity=recycling](bbox);rel[amenity=recycling](bbox));(._;>;);out center;", naam: "Recycling", zichtbaar: false},	
	{url: "?data=(node[shop=travel_agency](bbox);way[shop=travel_agency](bbox);rel[shop=travel_agency](bbox));(._;>;);out center;", naam: "Travel agency<hr>", zichtbaar: false},
	{url: "?data=(node[emergency=defibrillator](bbox);way[emergency=defibrillator](bbox);rel[emergency=defibrillator](bbox));(._;>;);out center;", naam: "Defibrillator - AED", zichtbaar: false},
	{url: "?data=(node[emergency=fire_extinguisher](bbox);node[emergency=fire_hose](bbox));(._;>;);out center;", naam: "Fire hose/extinguisher<hr>", zichtbaar: false},
// Do not include a relation for the fixme, as it produces a lot of extraneous data	
	{url: "?data=(node[fixme](bbox);way[fixme](bbox);node[FIXME](bbox);way[FIXME](bbox));(._;>;);out center;", naam: "fixme", zichtbaar: false},
	{url: "?data=(node[highway=construction](bbox);way[highway=construction](bbox));(._;>;);out center;", naam: "Construction", zichtbaar: false},
	{url: "?data=(node[image](bbox);way[image](bbox));(._;>;);out center;", naam: "Image", zichtbaar: false},
	{url: "?data=(node['surveillance:type'='camera'](bbox));(._;>;);out center;", naam: "Public camera<hr>", zichtbaar: false},
	{url: "?data=(node[place=city](bbox));(._;>;);out center;", naam: "City", zichtbaar: false},
	{url: "?data=(node[place=town](bbox));(._;>;);out center;", naam: "Town", zichtbaar: false},
	{url: "?data=(node[place=village](bbox));(._;>;);out center;", naam: "Village", zichtbaar: false},
	{url: "?data=(node[place=hamlet](bbox));(._;>;);out center;", naam: "Hamlet", zichtbaar: false},
	{url: "?data=(way(bbox)[name~'^[Ff]ietspad'];)->.fietspaden;(way(foreach.fietspaden)[highway=cycleway][name][name~'^[Ff]ietspad$']);(._;>;);out center;", naam:"fietspad", zichtbaar: false}
//	{url: "?data=(way[name~'^Fietspad|^fietspad|^pad$|^Pad$|cycleway|^path$|^Path$'](bbox);node(w);way[highway=cycleway][name!~'.'](bbox);node(w););out center;", naam:"fietspad", zichtbaar: false}
];

var cookieDefName = "taglocpois";				// de naam die voor de cookiefile wordt gebruikt om de user pois in op te slaan.
//=====================================================================
// Einde Datablok
//=====================================================================

// Omdat de door de gebruiker opgegeven variabelen in een dynamische array moeten komen te staan, worden die hieronder aangemaakt
// Sla alle door de gebruiker ingevoerde tag:value paren op in een array in het juiste formaat om er een query van te maken
// Die array wordt weer gebruikt als invoer voor addLayers

//=====================================
// Valid input for the userpois:
//====================================
// craft=brewery
// highway=bus_stop
// landuse=grass
// And any other key/value pair
// 
// to find all shops:
// shop
// 
// to find all shops without phone:
// shop][phone!~"."
// 
// Also yes/no as value:
// tourism=yes
// 
// Find any e-mail address:
// "contact:email"
//
// Anything IN name:
// {name}amenity=school
//
// Something near to something else
// key1=val(radius)key2=val
//========================================


function UserTagObj (url,naam) {
	this.url = url;
	this.naam = naam;
	this.zichtbaar = true;
}

function makeUserLayer (userTags) {							// userTags bevat de "key=value" paren
		uLayer = [];
		for (i=0; i < userTags.length; i++) {				// lus over alle paren
			var keyValues = userTags[i];					// Voor hergebruik later in de functie
			if (keyValues == '') continue;					// skip empty line
			var mode = '';
			if (userTags[i].indexOf("{") == 0) { mode = "searchIn"; }
				else if (userTags[i].indexOf("(") > 0)  { mode = "searchAround"; }
					else { mode = "normal"; }
			switch (mode) {

//userstring: {Placetosearch}key=value			
				case "searchIn" :
					k = userTags[i].indexOf("}");
					var name = userTags[i].substring(1,k);			// welke plaats om te zoeken
					keyValues = userTags[i].substring(k+1); 		// verwijder de "{name}" string
					labels = keyValues.split("=");					// labels bevat de "key", "value" paren, gescheiden door een ","
					label = labels[labels.length-1];				// label is de "key" - index is zero based
					if ((label == "yes") || (label == "no")) {		// nuttig om bij situaties als "tourism=yes/no" of "amenity=yes/no" te kunnen zien waar het om gaat!
						label = userTags[i];						// Terugzetten naar oospronkelijke ingave.
					}
					url = "?data=area[name~'"  +  name + "']->.a;(way(area.a)[" + keyValues +  "];node(area.a)[" + keyValues + "];rel(area.a)[" + keyValues + "]);(._;>;);out center;";
					naam = label + ' [' + name + ']';				
				break;
				
//userstring: key=value(radius)key2=value2
// In order to search something within a given distance from something else.
// First search for key=value and store result in .poi then search around that point for key2=val2 and store result in .result
// Finally - to show both both key and key2 search again around result to show key.
// See discussion on: http://forum.openstreetmap.org/viewtopic.php?id=28807&p=13				
				case "searchAround" :	
					var around = '';
					var aroundPosBegin = userTags[i].indexOf("(");						// Is er een aroundwaarde gegeven?
					var aroundPosEnd = userTags[i].indexOf(")");
					around = userTags[i].substring(aroundPosBegin+1,aroundPosEnd);		// around heeft nu de waarde die de gebruiker heeft opgegeven
					keyValues = userTags[i].substring(0,aroundPosBegin);				// Het eerste deel voor de query
					var aroundKeyValues = userTags[i].substring(aroundPosEnd+1);		// De key-value pairs voor de query in het around-deel
					var aroundLabels = aroundKeyValues.split("=");
					labels = keyValues.split("=");										// labels bevat de "key=value" paren, gescheiden door een ","
					label = labels[labels.length-1];									// label bevat nu de "key" - index is zero based
					if ((label == "yes") || (label == "no")) {							// nuttig om bij situaties als "tourism=yes/no" of "amenity=yes/no" te kunnen zien waar het om gaat!
						label = keyValues;												// Terugzetten naar oospronkelijke ingave.
					}
					if (around.indexOf("-") == 0) {
						around = around.substring(1);
						aroundKeyValuesNeg = aroundKeyValues.replace("~","!~");
						//alert(aroundKeyValuesNeg);
						url = "?data=(node(bbox)[" + keyValues + "];way(bbox)[" + keyValues + "];)->.allnodes;((way(bbox)[" + aroundKeyValues + "];)->.poi;(node(around.poi:" + around + ")[" + keyValues + "]->.result;way(around.poi:" + around +")[" + keyValues + "]->.result;way(around.result:" + around + ")[" + aroundKeyValues + "];);)->.nearnodes;((.allnodes; - .nearnodes;);way(bbox)[" + keyValues + "][" + aroundKeyValuesNeg + "];);(._;>;)->.notnear;.notnear out center;";
						naam = label + " NOT near: " + aroundLabels[aroundLabels.length-1];
					} else {
						url = "?data=(node(bbox)[" + keyValues + "];)->.poi;(node(around.poi:" + around + ")[" + aroundKeyValues + "]->.result;node(around.result:" + around + ")[" + keyValues + "];);out center;";
						naam = label + " near: " + aroundLabels[aroundLabels.length-1];
					}
				break;
				
				
				
// all other userstrings
				case "normal" :
					labels = keyValues.split("=");						// labels bevat de "key", "value" paren, gescheiden door een ","
					label = labels[labels.length-1];					// label is de "key" - index is zero based
					if ((label == "yes") || (label == "no")) {			// nuttig om bij situaties als "tourism=yes/no" of "amenity=yes/no" te kunnen zien waar het om gaat!
						label = userTags[i];							// Terugzetten naar oospronkelijke ingave.
					}
					url = "?data=(node[" + keyValues + "](bbox);way[" + keyValues + "](bbox);rel[" + keyValues +  "](bbox));(._;>;);out center;";
					naam = label;
			}
			var uTag = new UserTagObj(url,naam);
			uLayer[i] = uTag;
		}
		return uLayer;
	}

function layerdef(type){
// De make_array_layer functie wordt in noordpass_mz.js gedefinieerd.
// De dash parameter wordt hieronder niet gebruikt, maar kan als 3e parameter worden doorgegeven
// Als de gebuiker zijn eigen tags heeft opgegeven, dan is dat zichtbaar in userDef
// De kleur die als laatste parameter wordt meegegeven, is de kleur die wordt gebruikt om contouren van het gebied te markeren

	var userPoisDef;
	switch (type) {
		case "amenity":
				userPoisDef = false;
				map.addLayers(make_array_layer(amenitydef,userPoisDef,"yellow"));
				break;
		case "tourism":
				userPoisDef = false;
				map.addLayers(make_array_layer(tourismdef,userPoisDef,"white"));
				break;
		case "sport":
				userPoisDef = false;
				map.addLayers(make_array_layer(sportdef,userPoisDef,"green"));
				break;
		case "shop":
				userPoisDef = false;
				map.addLayers(make_array_layer(shopdef,userPoisDef,"white"));
				break;
		case "food":
				userPoisDef = false;
				map.addLayers(make_array_layer(fooddef,userPoisDef,"white"));
				break;
		case "hotels":
				userPoisDef = false;
				map.addLayers(make_array_layer(hotelsdef,userPoisDef,"white"));
				break;
		case "various":
				userPoisDef = false;
				map.addLayers(make_array_layer(variousdef,userPoisDef,"white"));
				break;
		case "restaurants":
				userPoisDef = false;
				map.addLayers(make_array_layer(restaurantsdef,userPoisDef,"white"));
				break;
		case "userpoilayer":
				userPoisDef = true;
				userdef = makeUserLayer (userPois);
				map.addLayers(make_array_layer(userdef,userPoisDef,"red"));
				break;
	}
} //end function layerdef
	
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

// This function originally had "item" as variable, but in IE this is a functionname and cannot be used.
// changed it to "_item_"
// Thanks to Sander H for this info.
function checkCookie() {
	var i = 1;									// om de index achter de cookienaam te genereren
	lines = [];									// tijdelijk opslag
	cookieName = cookieDefName + String(i);		// "userpois1", "userpois2", ....
    _item_ = getCookie(cookieName);				// Is deze cookie aanwezig?
    while (_item_!="") {						// Ja
        lines.push(_item_);						// Toevoegen aan array
        i++;									// Volgende?
  		cookieName = cookieDefName + String(i);
     	_item_ = getCookie(cookieName);
    }
    return lines;								// Teruggeven
}


