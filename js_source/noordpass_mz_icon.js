//====================================
// Versie met featurePopup van Gertjan
// <!-- (mz) Laatste versie: 06-03-15, 10:44 -->


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
			case "Copyshop" : return "mapicons/letter_c.png";
			case "Cosmetics" : return "mapicons/perfumery.png";
			case "Dairy" : return "mapicons/milk_and_cookies.png";
			case "Defibrillator - AED" : return "mapicons/aed-2.png";
			case "Deli" : return "mapicons/patisserie.png";
			case "Department store" : return "mapicons/departmentstore.png";
			case "Drinking water" : return "mapicons/drinkingwater.png";
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
			case "Monument/memorial" : return "mapicons/monument.png";
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
			case "Surfing" : return "mapicons/surfing.png";
			case "Gymnastics" : return "mapicons/indoor-arena.png";
			case "Horse racing" : return "mapicons/horseriding.png";
			case "City" : return "mapicons/letter_city.png";
			case "Town" : return "mapicons/letter_town.png";
			case "Village" : return "mapicons/letter_village.png";
			case "Hamlet" : return "mapicons/letter_hamlet.png";
			case "Test" : return "mapicons/letter_t.png";	// voor testdoeleinden		
			default :  return "img/marker-gold.png";
		} //end switch 
	} else {
			// gebruikers tags
			// Gebruik een icon met een oplopende nummering
			return "mapicons/number_" + num + ".png";
		}
};

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
		graphicWidth: 24,
		graphicHeight: 30,
		graphicYOffset: -30, // places the point of the marker on the node.
		graphicZIndex: ICON_Z_INDEX,
 		strokeWidth: 1	// for the drawing of the contour	
		});

	// checkboxName is de naam zoal hij in de layerlist staat, na het selectievakje, inclusief de afbeelding!
	// Het is een combinatie van icon en naam	
	var checkBoxName = "<img style=\"vertical-align: middle; width=\"22\" height=\"26\"; src=\"" + icon2use(name,uDef,num) + "\">" + "&nbsp" + name;; 
	
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
	};
		
function getPos(){
	if (navigator.geolocation) {
		var my_geo_options = {enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(showPosition,noPos,my_geo_options);
		};
	};
		
function noPos(ercode) {
	alert("Unable to get location");
	};

