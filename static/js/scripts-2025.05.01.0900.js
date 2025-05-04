

$(document).ready(function () {

	// clean up tab activators for empty calendar tab panels
	if ($("#tile1504").length > 0) {
		$("#tile1504 .nav-link").each(function (i) {
			if ($("#" + $(this).attr("aria-controls") + " .item").length == 0) {
				$(this).addClass("d-none");
			}
		});
	}


	// replace "website" link label with icon on course listing
	$("td.website a").each(function () {
		if ($(this).html() == "Website") {
			$(this).html("<i class='fa fa-external-link-alt'></i>");
		}
	});



});
