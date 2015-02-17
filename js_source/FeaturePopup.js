var _ZOOM_ = "&zoom=18"; // zoomwaarde voor de Editors

var CONNEX = "http://haltepagina.connexxion.nl/home/index?halte=";			// Connexion link
var DELIJN = "https://www.delijn.be/nl/haltes/halte/";						// De Lijn in Vlaanderen

var buttonShow = false;			// Keep the state of the hide/show button below the table

function showMoreLessButton(show) {
	if (show) {
	thelink = '<div id="morebutton" class="buttonclass"><button id="show_button" onclick="showLinks()">hide</button></div>';	
	} else thelink = '<div id="morebutton" class="buttonclass"><button id="show_button" onclick="showLinks()">Views and Editors</button></div>';
	return thelink;
}

function popupLinks(lonlat,feature,show){
	//var buttonClass ='';
	var buttonClass = (show ? 'popupLinksShow' : 'popupLinksHide');
	//if (show) {buttonClass = 'popupLinksShow'} else {buttonClass = 'popupLinksHide'}
// Link naar OSM
	var thelink = "<div id=\"tlPop\" class=\"" + buttonClass + "\"><b>View area with:</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + _ZOOM_ +  "\" target=\"_blank\"><img src='img/osm.gif'>OSM</a>&nbsp;&diams;&nbsp;"
	//alert(thelink);
// Link naar Google	  
	thelink = thelink + "<a href=\"https://maps.google.nl/maps?ll=" + lonlat.lat + "," + lonlat.lon + "&t=h&z=15\" target=\"_blank\"><img src='img/google.gif'>Google</a>&nbsp;&diams;&nbsp;";
// Link naar Bing
	thelink = thelink + "<a href=\"http://www.bing.com/maps/?v=2&cp=" + lonlat.lat + "~" + lonlat.lon + "&lvl=15&dir=0&sty=h&form=LMLTCC\" target=\"_blank\"><img src='img/bing.gif'>Bing</a>&nbsp;&diams;&nbsp;";
// Link naar MtM	  
	thelink = thelink + "<a href=\"http://mijndev.openstreetmap.nl/~allroads/mtm/?map=roads&zoom=" + map.getZoom() + "&lat=" +  lonlat.lat + "&lon=" +  lonlat.lon + "&layers=B000000FFFFFFFFFFFFTFF\" target=\"_blank\"><img src='img/osm.gif'>MtM</a>&nbsp;&diams;&nbsp;";
// Link naar Mapillary	  
	thelink = thelink + "<a href=\"http://www.mapillary.com/map/im/bbox/"  + (lonlat.lat - 0.005) + "/" + (lonlat.lat + 0.005) + "/" + (lonlat.lon -0.005) +  "/" + (lonlat.lon + 0.005) + "\" target=\"_blank\"><img src='img/mapillary.png'>Mapillary</a><p>";	

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
			buttonShow = false;  // keep state
			document.getElementById('show_button').innerHTML = 'Views and Editors'; 
			}
			else {
					zichtbaar.className = 'popupLinksShow';
					buttonShow = true;  //keep state
					document.getElementById('show_button').innerHTML = 'Hide'; 		
			}		
	}
			
/**
 * FeaturePopup
 * The FeaturePopup class creates the Popup window for the info about the selected OSM feature
 */
FeaturePopup = OpenLayers.Class({
  genericUrl : null,
  map : null,
  
  // Constructor
  initialize : function(url, map) {
    this.genericUrl = url;
    this.map = map;
  },
   
  // Click event
  click : function(event) {
    var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
	var xy = event.feature.geometry.getBounds().getCenterLonLat(); // Google maps coordinaten (EPSG:900913)
    var popup =  new OpenLayers.Popup("location_info", xy, null, "", true ); 
    var lonlat = lonlat.clone().transform(this.map.projection, this.map.displayProjection); // WGS84 coordinaten (EPSG:4326)
    popup.setBackgroundColor("white"); // achtergrondkleur van het popup venster
    popup.opacity = 1;
    popup.setBorder("1px solid green");
   	popup.closeOnMove = false;
    popup.autoSize = true;
  	popup.maxSize =  new OpenLayers.Size(450, 500);
    popup.panMapIfOutOfView = true;
   	popup.contentHTML = this.processFeature(event.feature) + showMoreLessButton(buttonShow) + popupLinks(lonlat,event.feature,buttonShow);
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
  processElement : function(type, id, tags) {
   	var html = '';					// The html code for popup is split into 4 sections.
	var htmlTableStart = '';		// This contains the definition of the table, including style
   	var htmlTableHead = '';			// This is the part that follows after the table definition. It contains all the main key values
  	var htmlTableFoot = '';			// The concluding lines of the table
   	var wikiKeyPage = '';			// the wikipage that deals with this key value
   	var name = tags.name;
   	var name_EN = tags["name:en"];
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
    } else { if (operator) { // operator - indien aanwezig - toevoegen aan name
       				html += '<h4>operator: ' + operator + '</h4>';
   				} else { if (name) { // geen operator
       						html += '<h4>' + name + '</h4>';
   							}
   						}
   			}
   	if (description) {  // add description to info before the table
   		html += '<h5>' + 'Description: ' + description + '</h5>';
   	}			
  	if (note) {   // add note to info before the table 
   		html += '<h5>' + 'Note: ' + note + '</h5>';
   	}			
    var address = this.processAddress(tags);
    if (address) html += address;
    // process the rest of the tags
    var self = this;
    htmlTableStart = '<table class="popupCode">';   // start table
    // De fixme key komt in verschillende varianten voor, ik reken op 'fixme' en 'FIXME'
    if (fixme) {
    htmlTableHead += '<tr class="popupRowFixme"><td class="popupKeyFixme">' + 'fixme' + '</td><td class="popupValue">' + fixme + '</td></tr>';
	}
    if (FIXME) {
    htmlTableHead += '<tr class="popupRowFixme"><td class="popupKeyFixme">' + 'FIXME' + '</td><td class="popupValue">' + FIXME + '</td></tr>';
	}
	// loop through remaing tags
    $.each( tags, function(key, val) {
    // Check to see if we have a main key
      wikiKeyPage = '';
      tdKeyClass = '';
      tdValClass = '';
      // This switch selects the right wikipage for the relevant key and turns in into a link	
      switch (key) {
      	case "amenity" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:amenity">' + key + '</a>';
      	break;
      	case "tourism" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:tourism">' + key + '</a>';
      	break;
      	case "sport" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:sport">' + key + '</a>';
      	break;
      	case "shop" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:shop">' + key + '</a>';
      	break;
      	case "man_made" : wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:man_made">' + key + '</a>';
      	break;
      	case "historic" : wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:historic">' + key + '</a>';
		break;
      	case "natural" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:natural">' + key + '</a>';
      	break;
      	case "landuse" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:landuse">' + key + '</a>';
		break;
      	case "leisure" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:leisure">' + key + '</a>';
		break;
      	case "heritage" : wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:heritage">' + key + '</a>';
		break;
      	case "office" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:office">' + key + '</a>';
		break;
      	case "emergency": wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:emergency">' + key + '</a>';
		break;
      	case "craft" 	: wikiKeyPage = '<a target = "_blank" href="http://wiki.openstreetmap.org/wiki/Key:craft">' + key + '</a>';
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
        	html += '<tr class="popupRow">' + tdKeyClass + keyVal + '</td>' + tdValClass + tagHtml + '</td></tr>';
        }
      }
    });
    // process the open streetmap link and put in last line of table
    var htmlOSM = '<a target = "_blank" href="http://www.openstreetmap.org/browse/' + type + "/" + id + '">' + type + " " + id + "</a>";
   	htmlTableFoot += '<tr class="popupRowOSM"><td class="popupKey">' + 'more info' + '</td><td class="popupValue">' + htmlOSM + '</td></tr>';
   	htmlTableFoot += '</table>';
    return htmlTableStart + htmlTableHead + html + htmlTableFoot;
  },

  /*
   * Create the html for a single tag
   * Added "image" & link
   */
   
  processTag : function(key, value, address) {
    var k = key.split(":");
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
        var lang = k[1] + ".";
      }
      else {
        lang = "";
      }
      var s = value.split(':'); //Subject
      if (s.length == 2) {
        lang = s[0] + ".";
        subject = s[1];
      }
      else {
        subject = value;
      }
      var href = "http://" + lang + "wikipedia.org/wiki/" + subject;
      return this.makeLink(href, value, true);
    case "architect":
    	return this.processMultiValue(value);  
    case "addr":
      	return (address ? null : value);
    case "cxx": 		// Connexxion bus?
    	return this.processBusstop(CONNEX,k[1],value);
    case "ref": 		// De_Lijn bus?
    	return this.processBusstop(DELIJN,k[1],value);
    case "heritage" : 	// heritage website?
    	if (k[1] == "website") {
    	return this.makeLink(value,value,true);
    	} else return value;
    // process the colours for the building and the roof.
    // use a rectangle of 6 spaces long after the colour code.
    // Note spelling: "colour" is preferred over "color". See wiki.
    case "building" :
    	if (k[1] == "colour") {
    	return value +  '&nbsp;&nbsp;<span style="background-color:' + value + '">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>';
    	}
    case "roof" :
    	if (k[1] == "colour") {
    	return value + '&nbsp;&nbsp;<span style="background-color:' + value + '">' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '</span>';
    	}   	
    case "name":
    case "operator":
    case "note":
    case "description":
    case "fixme":
    case "FIXME":
      // Ignore the name/operator/note/description/fixme tag because we show it in the header
      return null;
    default:
      return value;
    }
  },
  
  // Can we get  more detailed information about the busstop?
  // Connexxion (NL) and De_Lijn (BE) are supported in this version
  
  processBusstop : function (busOp,key,value) {
	  if (key == 'code' || key == 'De_Lijn') {
	  	k = value.split(/[;,]/);
	  	html = this.makeLink(busOp + k[0], 'bus info: ' + k[0], true); 
		for (i=1; i < k.length; i++) {
			html += '</br>' +  this.makeLink(busOp + k[i], 'bus info: ' + k[i], true);
		}	  	
		 return html;
	}
	return value; 
  },
  
  /*
  * If value consists of more than one item - separated by characters given in the split set -
  * turn into html string with as many lines as items. Separation by </br>
  */
  processMultiValue : function(value) {
	var k = value.split(/[;,]/);
	html = k[0];
	if (k.length > 1) {
		for (i=1; i < k.length; i++) {
			html += '</br>';
			html += k[i];
		}
	}
	return html;
  },
  
  processContactTag : function(key, value) {
    switch (key) {
    case "website":
    case "url":
      return this.makeLink(value, value, true);
    case "image":
    	return this.makeImageLink(value,value,true);
    case "twitter":
      return this.makeLink("https://twitter.com/" + value, value, true);
    case "facebook":
      if (value.startsWith("http") || value.startsWith("www") || value.startsWith("facebook")) {
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
  makeLink : function(href, text, newPage) {
    var html = "<a ";
    if (newPage) html += 'target="_blank" ';
    if (href.indexOf(":") == -1) {
      return html + 'href="http://' + href + '">' + text + '</a>';
    }
    return html + 'href="' + href + '">' + text + '</a>';
  }, 
 
 // Create a thumbnail of the image that links to the original image
 // This 
   makeImageLink : function(href, text, newPage) {
    var html = "<a ";
    if (newPage) html += 'target="_blank" ';
 // eerst testen op wel werkende thumbnail links   	
    if (href.indexOf("upload.wiki") > 0) { // Image file reference is to a upload wiki file. This seems to deliver a correct thumbnail
   		return html +  'href="' + href + '">' + '<img src="' + href + '" height="60"/></a>'; 
    	}
      if (href.indexOf("http://wiki.openstreetmap") == 0) { // Image file reference is to regular osm-wiki file. Thumbnail seems to work...
   		return html +  'href="' + href + '">' + '<img src="' + href + '" height="60"/></a>'; 
    	}
    if (href.indexOf("File:") == 0) { // Image file reference is to a wikimedia file - no thumbnail yet!
    	var imageLink = 'https://commons.wikimedia.org/wiki/' + href;
    	return html +  'href="' + imageLink + '">' + imageLink + '</a>';
    	}	
// Dan de links die niet goed tot een thumbnail zijn te herleiden    	   
	if (href.indexOf("wikimedia") > 0) { // Image file reference is to a wikimedia file - no thumbnail yet! 
		return html +  'href="' + href + '">' + href + '</a>';
		}
// Geef een melding over mogelijk ontbrekende license
	if (href.indexOf("flickr") > 0) { // Image file reference is to a flickr image. No thumbnail possible?
		return html +  'href="' + href + '">' + href + '</a><br><div class="unknownLicense">Unknown license!</div>';
		}
	if (href.indexOf("wikipedia") > 0) { // Image file reference is to a flickr image. No thumbnail possible?
		return html +  'href="' + href + '">' + href + '</a>';
		}
    return html + 'href="' + href + '">' + '<img src="' + text + '" height="60"/></a><br><div class="unknownLicense">Unknown license!</div>';
  }, 
 
  processAddress : function(tags) {
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
     
  CLASS_NAME : "FeaturePopup"
});

