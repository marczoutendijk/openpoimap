	var jQ			= jQuery.noConflict();
	jQuery(document).ready(function(jQ){
	

	/* prepend menu icon */
	jQ('#nav-wrap').prepend('<div id="menu-icon"><i class="icon-reorder"></i></div>');
	
	/* toggle nav */
	jQ("#menu-icon").on("click", function(){
		jQ("#navcontainer2").slideToggle();
		jQ(this).toggleClass("active");
	});
	
	jQ("#sb-icon").on("click", function(){
		jQ("#sidebar2").slideToggle();
		jQ(this).toggleClass("active");		
	});

	});