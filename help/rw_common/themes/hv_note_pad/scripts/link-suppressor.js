// Link Suppressor script by Will Woodgate - visit http://www.willwoodgate.com/ for more information
var jQ			= jQuery.noConflict();
jQ(document).ready(function(){
	jQ("#navcontainer li:has(ul),#navcontainer2 li:has(ul)").hover(function() {
		jQ(this).children("a").addClass("nolink").click(function(e) {
			e.preventDefault();
		});
	});
});