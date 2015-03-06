//////////////////////////////////////////////////////////
// OpenPoiMap aka Taglocator v1.0 - Marc Zoutendijk
/////////////////////////////////////////////////////////
// <!-- (mz) Laatste versie: 06-03-15, 10:45 -->



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
	{url: "?data=(node[tourism=theme_park](bbox);way[tourism=theme_park](bbox);rel[tourism=picnic_site](bbox));(._;>;);out center;", naam: "Theme park", zichtbaar: false},
	{url: "?data=(node[tourism=viewpoint](bbox);way[tourism=viewpoint](bbox);rel[tourism=viewpoint](bbox));(._;>;);out center;", naam: "Viewpoint", zichtbaar: false},
	{url: "?data=(node[man_made=windmill](bbox);way[man_made=windmill](bbox);rel[man_made=windmill](bbox));(._;>;);out center;", naam: "Windmill", zichtbaar: false},
	{url: "?data=(node[man_made=watermill](bbox);way[man_made=watermill](bbox);rel[man_made=watermill](bbox));(._;>;);out center;", naam: "Watermill", zichtbaar: false},
	{url: "?data=(node[tourism=zoo](bbox);way[tourism=zoo](bbox);rel[tourism=zoo](bbox));(._;>;);out center;", naam: "ZOO", zichtbaar: false}
];

var hotelsdef = [
// Places to stay	
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
	{url: "?data=(node[shop=deli](bbox);way[shop=deli](bbox));(._;>;);out center;", naam: "Deli", zichtbaar: false},
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
	{url: "?data=(node[shop=copyshop](bbox);way[shop=copyshop](bbox);rel[shop=copyshop](bbox));(._;>;);out center;", naam: "Copyshop", zichtbaar: false},
	{url: "?data=(node[amenity=kindergarten](bbox);way[amenity=kindergarten](bbox);rel[amenity=kindergarten](bbox));(._;>;);out center;", naam: "Kindergarten", zichtbaar: false},
	{url: "?data=(node[amenity=marketplace](bbox);way[amenity=marketplace](bbox);rel[amenity=marketplace](bbox));(._;>;);out center;", naam: "Marketplace", zichtbaar: false},
	{url: "?data=(node[office](bbox);way[office](bbox);rel[office](bbox));(._;>;);out center;", naam: "Office", zichtbaar: false},	
	{url: "?data=(node[amenity=recycling](bbox);way[amenity=recycling](bbox);rel[amenity=recycling](bbox));(._;>;);out center;", naam: "Recycling", zichtbaar: false},	
	{url: "?data=(node[shop=travel_agency](bbox);way[shop=travel_agency](bbox);rel[shop=travel_agency](bbox));(._;>;);out center;", naam: "Travel agency<hr>", zichtbaar: false},
	{url: "?data=(node[emergency=defibrillator](bbox);way[emergency=defibrillator](bbox);rel[emergency=defibrillator](bbox));(._;>;);out center;", naam: "Defibrillator - AED", zichtbaar: false},
	{url: "?data=(node[emergency=fire_extinguisher](bbox);node[emergency=fire_hose](bbox));(._;>;);out center;", naam: "Fire hose/extinguisher<hr>", zichtbaar: false},
// Do not include a relation for the fixme, as it produces a lot of extraneous data	
	{url: "?data=(node[fixme](bbox);way[fixme](bbox);node[FIXME](bbox);way[FIXME](bbox));(._;>;);out center;", naam: "fixme", zichtbaar: false},
	{url: "?data=(node[image](bbox);way[image](bbox));(._;>;);out center;", naam: "Image", zichtbaar: false},
	{url: "?data=(node['surveillance:type'='camera'](bbox));(._;>;);out center;", naam: "Public camera<hr>", zichtbaar: false},
	{url: "?data=(node[place=city](bbox));(._;>;);out center;", naam: "City", zichtbaar: false},
	{url: "?data=(node[place=town](bbox));(._;>;);out center;", naam: "Town", zichtbaar: false},
	{url: "?data=(node[place=village](bbox));(._;>;);out center;", naam: "Village", zichtbaar: false},
	{url: "?data=(node[place=hamlet](bbox));(._;>;);out center;", naam: "Hamlet", zichtbaar: false}
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
//========================================


function UserTagObj (url,naam) {
	this.url = url;
	this.naam = naam;
	this.zichtbaar = true;
};

function makeUserLayer (userTags) {						// userTags bevat de "key=value" paren
		uLayer = [];
		for (i=0; i < userTags.length; i++) {			// lus over alle paren
			var keyValues = userTags[i];				// Voor hergebruik later in de functie
			if (keyValues == '') continue;				// skip empty line
			var name = '';
			if (userTags[i].indexOf("{") == 0) {		// Is er een plaats gegeven? Dwz een woord tussen "{}"
				k = userTags[i].indexOf("}")
				var name = userTags[i].substring(1,k);	// welke plaats om te zoeken
				keyValues = userTags[i].substring(k+1); // verwijder de "{name}" string
			}
			labels = keyValues.split("=");				// labels bevat de "key", "value" paren, gescheiden door een ","
			label = labels[labels.length-1];			// label is de "key"
			if ((label == "yes") || (label == "no")) {	// nuttig om bij situaties als "tourism=yes/no" of "amenity=yes/no" te kunnen zien waar het om gaat!
				label = userTags[i];					// Terugzetten naar oospronkelijke ingave.
			}
			if (name) {
				url = "?data=area[name~'"  +  name + "']->.a;(way(area.a)[" + keyValues +  "];node(area.a)[" + keyValues + "];rel(area.a)[" + keyValues + "]);(._;>;);out center;";
				naam = label + ' [' + name + ']';
				} else {
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
	


// In de code voor de cookies de escape vervangen door encodeURIComponent() en decodeURIComponent()

// Cookiestuf van Sander
// Deze 2 functies gebruik ik niet		
// function saveUserPois (userChoice) {
// 	//layerdef('userpoilayer');
// 	setCookie(cookieDefName, encodeURIComponent(userChoice.join(',')), 30); // bewaar de gebruikerskeuze 30 dagen
// }
// 
// function getUserPois (poinames) {
// 	return decodeURIComponent(getCookie(poinames)).replace(/,/g, '\n');
// }

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
	cookieName = cookieDefName + String(i);		// userpois1, userpois2, ....
    _item_ = getCookie(cookieName);				// Is deze cookie aanwezig?
    while (_item_!="") {						// Ja
        lines.push(_item_);						// Toevoegen aan array
        i++;									// Volgende?
  		cookieName = cookieDefName + String(i);
     	_item_ = getCookie(cookieName);
    }
    return lines;								// Teruggeven
}

