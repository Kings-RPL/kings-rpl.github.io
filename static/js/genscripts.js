var SkipToConfig = {
	'settings': {
		'skipTo': {
			landmarks: 'main, [role="main"], [role="search"], [role="navigation"], nav, aside, region, section, footer',
			headings: 'main h1, main h2, main h3, main h4, main h5',
			headingGroupLabel: 'Headings',
			displayOption: 'popup',
			colorTheme: 'illinois',
			customClass: 'uofi-skipto-plugin',



			//colorTheme: 'aria',
			fontFamily: 'inherit',
			fontSize: '1em',
			positionLeft: '45%',
			menuBackgroundColor: '#F4F4F4',
			menuitemFocusBackgroundColor: '#13294B',
			focusBorderColor: 'none',
			buttonTextColor: '#13294B',
			buttonBackgroundColor: '#F4F4F4',

		}
	}
};

var wsurl = "https://ws.engr.illinois.edu";
var bookslisturl = "";

if (location.hostname.indexOf(".dev.engr.illinois.edu") > 0) {
	wsurl = "https://ws.dev.engr.illinois.edu";
}


var motionQuery = matchMedia('(prefers-reduced-motion)');
var arrJarallaxObjects = [];



$(document).ready(function () {
	// establish path to books list web service for public sites vs portal sites
	//if ($("body").hasClass("is_portal") && !$("body").hasClass("app_sitemanager")) {
	if ($("body").hasClass("is_portal")) {
		bookslisturl = "https://" + location.hostname + "/mods/sitemanager/list.asp";
	}
	else {
		bookslisturl = "https://" + location.hostname + "/_sitemanager/list.asp";
	}

	// build path array
	var i;
	var strPath = $(location).attr("pathname");
	if (strPath.substr(-1) == "/") {
		strPath = strPath.substr(0, strPath.length - 1);
	}
	var arrPath = strPath.split("/");

	// get header height for offset when handling in page links
	var intHeaderHeight = parseInt($("header").outerHeight());
	var intHeaderHeight = 0;

	if (location.hash != "") {
		window.scrollBy(0, -intHeaderHeight);

		/* expandotile hash links, aria-controlled hash links */
		if (location.hash.indexOf("=") < 0) {
			var trigger = $(location.hash).closest("[aria-controls]");
			if (trigger.length > 0) {
				var target = $("#" + trigger.attr("aria-controls"));
				trigger.attr("aria-expanded", true);
				trigger.removeClass("collapse");
				target.addClass("active show");
			}
		}
	}

	// in page link scroll-to handler
	$("a[href^='#']:not(.noscroll)").click(function (e) {
		e.preventDefault();
		var hash = $(this).attr("href");
		if (hash != "#") {
			if ($(hash).length > 0) {
				if (!$(this).attr("data-toggle") && !$(this).attr("data-bs-toggle")) {
					$('html, body').animate({
						scrollTop: $(hash).offset().top - intHeaderHeight
					}, 2000);
				}
			}
		}
	});

	$("a[href^='" + strPath + "#']:not(.noscroll)").click(function (e) {
		e.preventDefault();
		var hash = $(this).attr("href").replace(strPath, "");
		if (hash != "#") {
			if ($(hash).length > 0) {
				if (!$(this).attr("data-toggle") && !$(this).attr("data-bs-toggle")) {
					$('html, body').animate({
						scrollTop: $(hash).offset().top - intHeaderHeight
					}, 1000);
				}
			}
		}
	});

	// remove unused header elements
	$("header .parent_name[data-value='']").remove();
	$("#header-search-container.disabled").remove();
	$("#mobile-search-form.disabled").remove();

	if ($("#mainnav").length > 0) {
		// add active class to current page in mega menu
		$("#mainnav a[href='" + strPath + "']").addClass("active");

		//determine active section for main nav based on path
		var strActiveSection = "";
		if (arrPath[1]) {
			strActiveSection = decodeURI(arrPath[1]);
		}

		//add active class to mainnav tabs based on root folder
		$("#mainnav li.nav-item > a[href='/" + strActiveSection + "']").addClass("active");

		// append feature links to mainnav hiding if above the 991px breakpoint
		$("#featurelinks > ul > li > a").each(function (i) {
			var lnk = $(this).clone();
			lnk.addClass("nav-link");
			lnk.appendTo("#mainnav > ul");
			lnk.wrap("<li class='nav-item d-lg-none'></li>");
		});







		//experiment for on hover menu activation
		$("#mainnav .dropdown-toggle").removeAttr("data-toggle");

		//activate dropdown menus on mouse hover
		$("#mainnav .nav-item").on("mouseenter", 
			function (e) {
				if (window.innerWidth >= 992) {
					$("#mainnav .show").removeClass("show");
					$("#mainnav [aria-expanded=true]").attr("aria-expanded", "false");
					$(this).addClass("show");
					$(this).find(".dropdown-menu").addClass("show");
					$(this).find(".dropdown-toggle").attr("aria-expanded", "true");
				}
			}).on("mouseleave", function (e) {
				if (window.innerWidth >= 992) {
					$(this).removeClass("show");
					$(this).find(".dropdown-menu").removeClass("show");
					$(this).find(".dropdown-toggle").attr("aria-expanded", "false");
				}
			}
		);

		$("#mainnav .nav-link").on("click", function (e) {
			if (window.innerWidth < 992) {
				if ($(this).hasClass("dropdown-toggle")) {
					e.preventDefault();

					if (!$(this).parent().hasClass("show")) {
						$(this).attr("aria-expanded", "true");
						var origPos = $(this).offset().top;
						var windowPos = $(document).scrollTop();
						$("#mainnav .show").removeClass("show");
						$(this).parent().addClass("show");
						$(this).parent().find(".dropdown-menu").addClass("show");
						var newPos = $(this).offset().top;
						if (windowPos > newPos) {
							var newWindowPos = newPos - origPos + windowPos;
							if (newWindowPos < 0) {
								newWindowPos = 0;
							}
							$(document).scrollTop(newWindowPos);
						}
					}
					else {
						$(this).attr("aria-expanded", "false");
						$(this).parent().removeClass("show");
						$(this).parent().find(".dropdown-menu").removeClass("show");
					}
				}
			}
		});

		$("#mainnav-toggler-container button").click(function (e) {
			if (window.innerWidth < 992) {
				$("#mainnav .show").removeClass("show");
			}
		});


		// show dropdown menu when mainnav nav-link gets focus; hide other dropdowns
		$("#mainnav .nav-link").focus(function (e) {
			if (window.innerWidth >= 992) {
				$("#mainnav [aria-expanded=true]").attr("aria-expanded", "false");
				$("#mainnav .show").removeClass("show");
				$(this).attr("aria-expanded", "true");
				$(this).parent().addClass("show");
				$(this).parent().find(".dropdown-menu").addClass("show");
			}
		});



		$("*").focus(function (e) {
			if ($(this).closest(".navbar").length == 0) {
				if (window.innerWidth >= 992) {
					$("#mainnav .show").removeClass("show");
				}
			}
		});

		// 13	enter
		// 9	tab
		// 39	right
		// 37	left
		// 38	up
		// 40	down
		// 27	esc

		// keydown actions for navbar items
		$("#mainnav .nav-link").keydown(
			function (e) {
				var IsShown = $(this).parent().hasClass("show");
				var HasDropdown = $(this).hasClass("dropdown-toggle");
				// enter key shows menu or goes to landing page if menu already shown
				if (e.which == 13 && HasDropdown) {
					if (!IsShown) {
						e.preventDefault();
						$(this).parent().addClass("show");
						$(this).parent().find(".dropdown-menu").addClass("show");
					}
				}
			}
		);

		// keydown actions for any link within main menu
		$("#mainnav a").keydown(
			function (e) {
				// escape
				if (e.which == 27) {
					$(this).closest(".nav-item").find(".nav-link").focus();
					$("#mainnav .show").removeClass("show");
					$("#mainnav [aria-expanded=true]").attr("aria-expanded", "false");
				}

				// right arrow
				else if (e.which == 39) {
					var $current = $(this).closest(".nav-item");
					if (window.innerWidth >= 992) {
						var $next = $current.next("li:not(.d-lg-none)");
					}
					else {
						var $next = $current.next("li");
					}
					if ($next.length == 0) {
						$next = $current.parent().find("li").first();
					}
					$next.find(".nav-link").focus();
				}

				// left arrow
				else if (e.which == 37) {
					var $current = $(this).closest(".nav-item");
					if (window.innerWidth >= 992) {
						var $prev = $current.prev("li:not(.d-lg-none)");
					}
					else {
						var $prev = $current.prev("li");
					}
					if ($prev.length == 0) {
						$prev = $current.parent().find("li.nav-item:not(.d-lg-none)").last();
					}
					$prev.find(".nav-link").focus();
				}

				// down arrow
				else if (e.which == 40) {
					e.preventDefault();
					$currentLink = $(this);
					var $currentItem = $currentLink.closest(".nav-item");
					var IsShown = $currentItem.hasClass("show");
					var $links = $currentItem.find(".dropdown-menu .menu a:visible")
					// if menu not shown, then show it and focus first link within
					if (!IsShown) {
						$currentItem.addClass("show");
						$currentItem.find(".dropdown-menu").addClass("show");
						$currentItem.find(".dropdown-toggle").attr("aria-expanded", "true");
						$links.first().focus();
					}

					// if menu already shown, then move to next link in menu
					else {
						var IsFound = false;
						$links.each(function (i) {
							$this = $(this);
							if ($this.is($currentLink)) {
								IsFound = true;
								if (($links.length - 1) >= (i + 1)) {
									$links[i + 1].focus();
								}
								else {
									$links[0].focus();
								}
							}
							if (!IsFound) {
								$links[0].focus();
							}
						});
					}
				}

				// up arrow
				else if (e.which == 38) {
					e.preventDefault();
					$currentLink = $(this);
					var $currentItem = $currentLink.closest(".nav-item");
					var $links = $currentItem.find(".dropdown-menu .menu a:visible")

					var IsFound = false;
					$links.each(function (i) {
						$this = $(this);
						if ($this.is($currentLink)) {
							IsFound = true;
							if (0 <= (i - 1)) {
								$links[i - 1].focus();
							}
							else {
								$links[$links.length - 1].focus();
							}
						}
						if (!IsFound) {
							$links[$links.length - 1].focus();
						}
					});
				}

				// tab
				else if (e.which == 9) {
				}

			}
		);



		// build sidebar nav

		var IsSite = $("body").hasClass("site");
		var SidebarStatus = $("body").attr("data-sidebar");
		var IsStoried = $("body").hasClass("storied");

		var SiteEnvironment = "";
		if ($("body").hasClass("prod")) {
			SiteEnvironment = "prod";
		}
		else if ($("body").hasClass("dev")) {
			SiteEnvironment = "dev";
		}


		// if we're on a site (and not editing in sitemanager) and if sidebar is enabled for our current environemnt, then proceed with building sidebar
		if (IsSite && (SidebarStatus == "prod" || SidebarStatus == "dev" && SiteEnvironment == "dev")) {
			var HasSidebar = ($("#mainnav-" + strActiveSection + " .menu h2").length > 0);
			var IsHome = $("body").hasClass("home");
			var NoSidebar = $("body").hasClass("nosidebar");

			if (HasSidebar && !IsHome && !NoSidebar && !IsStoried) {

				// get menu items for active section
				var secnavcontent = "<h2>" + $("#mainnav-" + strActiveSection + " .menu h2").html() + "</h2>";
				secnavcontent += "<ul class='" + strActiveSection + "'>";
				$("#mainnav-" + strActiveSection + " .menucol > ul").each(function(i) { 
					secnavcontent += $(this).html();
				});
				secnavcontent += "</ul>";

				var SidebarSkip = $("body").attr("data-sidebarskip");
				if (parseInt(SidebarSkip)) {
					SidebarSkip = parseInt(SidebarSkip);
				}
				else {
					SidebarSkip = 0;
				}

				var SidebarInclude = $("body").attr("data-sidebarinclude");
				if (parseInt(SidebarInclude)) {
					SidebarInclude = parseInt(SidebarInclude);
				}
				else if (SidebarInclude == "all") {
					SidebarInclude = 1000;
				}
				else {
					SidebarInclude = 1;
				}

				// look through sections, add wrapper, insert sidebar and mainbar containers, move content around
				var sidebarWrapperDone = false;
				var intSidebarSectionCount = 0;
				$("#content_inner > .tile-list > .tile").each(function (i) {
					var $thisSection = $(this);
					var isDark = $thisSection.hasClass("navy-box") || $thisSection.hasClass("charcoal-box");
					if (i >= SidebarSkip && intSidebarSectionCount < SidebarInclude) {
						// insert sidebar_wrapper
						if (!sidebarWrapperDone) {
							$thisSection.before("<div id='sidebar_wrapper'></div>");

							// add sidebar section to sidebar_wrapper container
							$("#sidebar_wrapper").append("<div id='sidebarnav'></div>");
							$("#sidebar_wrapper").append("<div id='mainbar'></div>");
							sidebarWrapperDone = true;
						}

						$thisSection.detach().appendTo("#mainbar");

						// played with forcibly removing non-white-box color styles but leaving in place for now
						if (intSidebarSectionCount == 0) {
							if ($thisSection.hasClass("w110")) {
								$thisSection.removeClass("charcoal-box navy-box royal-box orange-box platinum-box ghost-box");
								$thisSection.addClass("white-box");
								//$thisSection.removeClass("py-6 py-5 py-4 py3 py-2 py-1");
								//$thisSection.addClass("pt-4");
								$thisSection.children(".wrapper").removeClass("py-6 py-5 py-4 py3 py-2 py-1");
								$thisSection.children(".wrapper").addClass("pb-4");

							}
						}
						if ($thisSection.hasClass("w110")) {
							$thisSection.removeClass("w110").addClass("w100");
						}
						intSidebarSectionCount++;
					}
				});


				if ($("#sidebarnav").length > 0) {
					// insert sidebar content into sidebarnav container
					$("#sidebarnav").html("<nav aria-label='Secondary'><div id='sidebarnav_inner' class='collapse'>" + secnavcontent + "</div></nav>");

					// remove dropdown classes
					$("#sidebarnav li").removeClass("dropdown");

					// add collapse and id's for mobile rendering
//					$("#sidebarnav > nav > ul").addClass("collapse");
//					$("#sidebarnav > nav > ul").attr("id", "sidebarnav_inner");

					// add sidebar show toggle for mobile rendering
					$("#sidebarnav nav").prepend("<a id='sidebarnav_toggler' class='collapsed d-block d-lg-none' data-toggle='collapse' data-bs-toggle='collapse' href='#sidebarnav_inner' role='button' aria-expanded='false' aria-controls='sidebarnav_inner'>In This Section</a>");

					// hide subnav menus of non-active siblings
					$("#sidebarnav > nav > div > ul li").each(function (i) {
						var $thisli = $(this);
						if ($thisli.find("a.active").length == 0) {
							$thisli.find("ul").addClass("hidden");
						}
					});

					// if current page isn't on the menu, then activate sidebar tree to closest parent
					if ($("#sidebarnav a.active").length == 0) {
						var p = "";
						for (i = 1; i < arrPath.length; i++) {
							p += "/" + arrPath[i];
							$("#sidebarnav a[href='" + p + "']").parent().children("ul").removeClass("hidden");
						}
					}
				}
			}

			if (!HasSidebar && !$("body").hasClass("nosidebar")) {
				$("body").addClass("nosidebar");
			}
		}
	}
	else {
		$("body").addClass("nosidebar");
	}

	// now that we're done futzing with the dom, lets unhide the content
	$("#content").addClass("appear");


	if ($("#mainnav-simple-container").length > 0) {

		// add dropdown togglers to main nav items that have submenus
		$("#mainnav-simple > ul > li.dropdown > a").each(function (i) {
			$(this).after("<a href='#' class='dropdown-toggler'><span class='sr-only'>Show " + $(this).html() + " sub menu</span><i class='fas fa-chevron-circle-down'></i></a>");
		});

		// display dropdown toggler when 
		$("#mainnav-simple > ul > li > a").focus(function () {
			if (window.innerWidth > 991) {
				$("#mainnav-simple .show").removeClass("show");
				$(this).parent().children(".dropdown-toggler").addClass("show");
			}
		});

		$("#mainnav-simple > ul > li > a.dropdown-toggler").click(function (e) {
			e.preventDefault();
			$(this).parent().children("ul").toggleClass("show");
		});


		$("#mainnav-simple > ul > li.dropdown").mouseenter(function () {
			if (window.innerWidth > 991) {
				$("#mainnav-simple .show").removeClass("show");
				$(this).children("ul").addClass("show");
			}
		});

		$("#mainnav-simple > ul > li.dropdown").mouseleave(function () {
			if (window.innerWidth > 991) {
				$(this).children("ul").removeClass("show");
			}
		});

		$("#mainnav-simple").focusout(function () {
			setTimeout(function () { // needed because nothing has focus during 'focusout'
				if ($(':focus').closest('#mainnav-simple').length <= 0) {
					$("#mainnav-simple .show").removeClass("show");
				}
			}, 0);
		})



		// add right class to simple menu dropdowns if they are too close to right edge of window
		$("#mainnav-simple > ul > li").each(function (i) {
			if (window.innerWidth - $(this).position().left < 250) {
				$(this).addClass("right");
			}
		});



		//add active class to mainnav tabs based on root folder
		$("#mainnav-simple a[href='/" + arrPath[1] + "']").addClass("active");

		//build secnav menu
		var objThisPage;
		var strSecnavPath = strPath;
		do {
			objThisPage = $("#mainnav-simple a[href='" + strSecnavPath + "']");
			if (objThisPage.length == 0) {
				if (strSecnavPath.lastIndexOf("/") > 0) {
					strSecnavPath = strSecnavPath.substring(0, strSecnavPath.lastIndexOf("/"));
					objThisPage = $("#mainnav-simple a[href='" + strSecnavPath + "']");
				}
			}
		}
		while (objThisPage.length == 0 && strSecnavPath.lastIndexOf("/") > 0);

		var arrPath = strSecnavPath.split("/");
		if (arrPath.length > 1) {
			var objActiveSection;

			//if there's a child menu then get that for secnav
			if (objThisPage.parent().find("ul:not(.nopills)").length > 0) {
				objActiveSection = objThisPage.parent().find("ul").first();
			}
				// else select this page's siblings for secnav
			else {
				objActiveSection = objThisPage.closest("ul").first();
			}
		}
		else {
			var objActiveSection = $("#mainnav-simple a[href='" + strSecnavPath + "']").closest("ul").first();
		}


		if (arrPath.length > 0) {
			var parentLbl = objActiveSection.parent().find("a:first").html();
			var parentUrl = objActiveSection.parent().find("a:first").attr("href");

			// add secnav pills container
			$("#secnav").append("<div class='dropdown' id='secnav-inner'><button class='button dropdown-toggle px-4' type='button' id='secnavMenuButton' data-toggle='dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>In this section </button><div class='dropdown-menu dropdown-menu-right' aria-labelledby='secnavMenuButton'></div></div>");

			// add link to curent section landing page
			$("#secnav div.dropdown-menu").append("<a href='" + parentUrl + "' class='dropdown-item'>" + parentLbl + "</a>");

			// add in sibling pages within current section
			objActiveSection.children("li").each(function (e) {
				$(this).children("a").not(".dropdown-toggler").each(function (e2) {
					var lbl = $(this).html();
					var url = $(this).attr("href");
					$("#secnav div.dropdown-menu").append("<a href='" + url + "' class='dropdown-item'>" + lbl + "</a>");
				});
			});
		}

		//apply active class to current page in secnav menu
		$("#secnav a[href='" + strPath + "']").addClass("active");


		// mainnav toggle handler
		$("#mainnav-toggler").click(function (e) {
			var expanded = $(this).attr("aria-expanded", function (i, attr) { return attr == 'true' ? 'false' : 'true'; });
			$("body").toggleClass("navopen");
			$("#mainnav-simple").toggleClass("show");
		});



	}


	// fix footer phone number
	$("footer .il-footer-contact p[data-value][data-value!=''] > a[href^='tel:']").each(function (i) {
		var tel = $(this).attr("href");
		tel = tel.replace(/-/g, "");
		if (tel.indexOf("tel:+1") < 0) {
			tel = tel.replace("tel:+", "tel:+1");
		}
		$(this).attr("href", tel);
	});


	// insert estimated time to read
	if ($(".sm-est-read-time").length > 0) {
		if ($("#mainbar").length > 0) {
			$(".sm-est-read-time").append(parseInt($("#mainbar")[0].textContent.replace(/\s\s+/g, ' ').trim().split(' ').length / 200 + 1) + ' min read');
		}
		else {
			$(".sm-est-read-time").append(parseInt($("#content_inner")[0].textContent.replace(/\s\s+/g, ' ').trim().split(' ').length / 200 + 1) + ' min read');

		}

	
	}

	// Configuration For Slick Slider
	$('.sm-slick').on('init', function (event, slick, direction) {
		$(this).css("opacity", 1);
	});


	$(".sm-slick").each(function(){
		var $this = $(this);
		var slidesToShow = $this.attr("data-show") ? parseInt($this.attr("data-show")) : 1;
		var slidesToScroll = $this.attr("data-scroll") ? parseInt($this.attr("data-scroll")) : 1;
		var dots = $this.attr("data-dots") ? $this.attr("data-dots") === "true" : true;
		var arrows = $this.attr("data-arrows") ? $this.attr("data-arrows") === "true" : true;
		var infinite = $this.attr("data-infinite") ? $this.attr("data-infinite") === "true": true;
		var fade = $this.attr("data-fade") ? $this.attr("data-fade") === "true" : false; 
		var autoplay = $this.attr("data-autoplay") ? $this.attr("data-autoplay") === "true" : true;
		var autoplaySpeed = $this.attr("data-autoplay-speed") ? parseInt($this.attr("data-autoplay-speed")) : 8000;
		var height = $this.attr("data-height") ? $this.attr("data-height") : "";
		var regionLabel = $this.attr("data-label") ? $this.attr("data-label") : $this.closest(".tile").attr("id") + " carousel";
		var centerMode = $this.attr("data-centermode") ? $this.attr("data-centermode") === "true" : false;
		var variableWidth = $this.attr("data-variablewidth") ? $this.attr("data-variablewidth") === "true" : false;

//		if (height != "") {
//			$this.css("height", height);
//		}
		var breakpoints = {
			"xxl": 1400,
			"xl": 1200,
			"lg": 992,
			"md": 768,
			"sm": 576,
		};

		var responsive = [];
		for (var bp in breakpoints) {
			if ($this.attr("data-show-" + bp)) {
				var show = parseInt($this.attr("data-show-" + bp));
				var scroll = $this.attr("data-scroll-" + bp) ? parseInt($this.attr("data-scroll-" + bp)) : show;
				responsive.push(
					{
						breakpoint: breakpoints[bp],
						settings: {
							slidesToShow: show,
							slidesToScroll: scroll
						}
					}
				);
			}
		}


		$this.slick({
			mobileFirst: true,
			slidesToShow: slidesToShow,
			slidesToScroll:slidesToScroll,
			dots: dots,	
			arrows: arrows,
			infinite:infinite,
			fade:fade,
			autoplay: autoplay,
			autoplaySpeed: autoplaySpeed,
			responsive: responsive,
			centerMode: centerMode,
			variableWidth: variableWidth,
			regionLabel: regionLabel
		});

		if (height != "") {
			$this.find(".slick-list").css("height", height);
			//$this.css("height", height);
		}
	});




	// background image resizer
	$("section").each(function (i, e) {
		var bg = $(e).css("background-image");
		if (bg.indexOf("viewphoto.aspx") >= 0 && bg.indexOf("&s=0") >= 0) {
			//console.log("resizing section " + bg);
			var w = 0;
			var h = 0;
			w = e.offsetWidth;
			h = e.offsetHeight;
			if ($(e).hasClass("jarallax")) {
				h = h*2;
			}
			if (w == 0) {
				var pnav = $(e).closest("#mainnav");
				if (pnav.length > 0) {
					w = pnav.width();
					if ($(e).hasClass("w25")) {
						w = w * 0.25; // - 34.2;
					}
					else if ($(e).hasClass("w33")) {
						w = w * 0.33; // - 34.2;
					}
					else if ($(e).hasClass("w50")) {
						w = w * 0.5; // - 34.2;
					}
					else if ($(e).hasClass("w66")) {
						w = w * 0.66; // - 34.2;
					}
					else if ($(e).hasClass("w100")) {
						//w = w - 34.2;
					}
					w = parseInt(w);
				}
			}
			w = Math.min(1920, 100 * (parseInt((w) / 100) + 1));
			//console.log("w: " + w);
			bg = bg.replace("&s=0", "&s=" + w + "&h=" + h);
			$(e).css("background-image", bg);
		}
	});

	$("div").each(function (i, e) {
		var bg = $(e).css("background-image");
		if (bg.indexOf("viewphoto.aspx") >= 0 && bg.indexOf("&s=0") >= 0) {
			//console.log("resizing div " + bg);
			var w = 0;
			var h = 0;
			w = e.offsetWidth;
			h = e.offsetHeight;
			w = Math.min(1920, 100 * (parseInt((w) / 100) + 1));
			//console.log("w: " + w);
			bg = bg.replace("&s=0", "&s=" + w + "&h=" + h);
			$(e).css("background-image", bg);
		}
	});

	$("img").each(function (i, e) {
		var img = $(e).attr("src");
		if (img != undefined) {
			if (img.indexOf("viewphoto.aspx") >= 0 && img.indexOf("&s=0") >= 0) {
				var w = parseInt($(e).parent().width());
				if (w < 250) {
					w = 250;
				}
				w = Math.min(1920, 100 * (parseInt((w) / 100) + 1));
				//console.log("w: " + w);
				img = img.replace("&s=0", "&s=" + w);
				$(e).attr("src", img);
			}
		}
	});


	$("body.site [data-image-caption], body.site [data-image-credit]").each(function (i) {
		let imageUrl = "";
		let backgroundImage = $(this).css("background-image");
		if (backgroundImage.indexOf("url") != 0) {
			backgroundImage = window.getComputedStyle($(this)[0], ':before').getPropertyValue("background-image");
		}
		imageUrl = backgroundImage.replace("url(\"", "").replace("\")", "");

		if (imageUrl.indexOf("viewphoto.aspx?")) {
			let viewPhoto = imageUrl.split("?")[0];
			let img = decodeUrlEncodedString(imageUrl.split("?")[1]);
			let info = ""
			if ($(this).attr("data-image-caption")) {
				info += "<p>" + $(this).attr("data-image-caption") + "</p>";
			}
			if ($(this).attr("data-image-credit")) {
				info += "<p>Photo Credit: <em>" + $(this).attr("data-image-credit") + "</p>";
			}
			info = info.replaceAll('"', '&quot;');
			$(this).append('<div class="sm-photo-credit"><a href="' + viewPhoto + '?id=' + img["id"] + '&s=1920&h=1200" aria-label="View full size version of image" data-fancybox="page-gallery" class="white-text" data-caption="' + info + '"><i class="fa-solid fa-circle-info fa-lg" aria-hidden="true"></i></a></div>');
		}
	});


	$("body.site div[data-fancy-caption], body.site section[data-fancy-caption]").each(function (i) {
		let imageUrl = "";
		let backgroundImage = $(this).css("background-image");

		if ($(this).children(".sm-backdrop-blur").length == 0) {
			if (backgroundImage.indexOf("url") != 0) {
				backgroundImage = window.getComputedStyle($(this)[0], ':before').getPropertyValue("background-image");
			}
			if (backgroundImage.indexOf("url") != 0 && $(this).attr("data-jarallax-original-styles")) {
				backgroundImage = $(this).attr("data-jarallax-original-styles").replace("background-image: url(", "").replace(");", "");
			}
			imageUrl = backgroundImage.replace("url(\"", "").replace("\")", "");
			if (imageUrl.indexOf("viewphoto.aspx?") && $(this).closest("#content").length > 0) {
				let viewPhoto = imageUrl.split("?")[0];
				let img = decodeUrlEncodedString(imageUrl.split("?")[1]);
				let info = $(this).attr("data-fancy-caption").replaceAll('"', '&quot;');
				$(this).append('<div class="sm-photo-credit"><a href="' + viewPhoto + '?id=' + img["id"] + '&s=1920&h=1200" aria-label="View full size version of image" data-fancybox="page-gallery" class="white-text" data-caption="' + info + '"><i class="fa-solid fa-circle-info fa-lg" aria-hidden="true"></i></a></div>');
			}
		}
	});



	$("body.site img[data-fancy-caption]").each(function (i) {
		if (!$(this).parent().is("a") && !$(this).attr("usemap")) {
			let imageUrl = $(this).attr("src");
			if (imageUrl.indexOf("viewphoto.aspx?") && $(this).closest("#content").length > 0) {
				let viewPhoto = imageUrl.split("?")[0];
				let img = decodeUrlEncodedString(imageUrl.split("?")[1]);
				let info = $(this).attr("data-fancy-caption").replaceAll('"', '&quot;');
				$(this).wrap('<a href="' + viewPhoto + '?id=' + img["id"] + '&s=1920&h=1200" data-fancybox="page-gallery" data-caption="' + info + '" aria-label="View full size version of image"></a>');
			}

		}
	});


	$("ol.big-numbered-list").each(function (){
		var index = $(this).prop("start") - 1;
		$(this).css("counter-reset", "item " + index);
	});


	// item loader for book lists
	$("a.loader").click(function (e) {
		e.preventDefault();
		var theLink = $(this);
		var BookID = $(this).attr("data-bookid");
		var targetDivSelector = "#" + $(this).attr("data-target");
		var tileDivSelector = "section[data-tileid='" + $(this).attr("data-tileid") + "']";
		var intReturn = $(this).attr("data-return");
		var strSort = $(this).attr("data-sort");
		var strFilter = $(this).attr("data-filter-topics");
		var strFilterField = $(this).attr("data-filter-field");
		var strFilterValue = $(this).attr("data-filter-value");
		var strCount = $(this).attr("data-count");
		var hideEmpty = $(this).attr("data-hide-empty");
		var strSkip = $(this).attr("data-skip");
		var strLoader = $(this).attr("data-loader");
		var intSkip;
		if (strCount != undefined) {
			intSkip = $(strCount).length;
		}

		if (BookID != undefined) {
			var url = bookslisturl + "?id=" + BookID;
			if ($(targetDivSelector).length) {
				var TemplateID = $(this).attr("data-template");
				if (intSkip == undefined) {
					intSkip = $(targetDivSelector).children().length;
				}
				if (strSkip != undefined && !isNaN(parseInt(strSkip))) {
					intSkip = intSkip + parseInt(strSkip);
				}

				if (TemplateID != undefined) { url += "&template=" + TemplateID; }
				if (intReturn != undefined) { url += "&return=" + intReturn; }
				if (intSkip != undefined && !isNaN(intSkip)) { url += "&skip=" + intSkip; }
				if (strSort != undefined) { url += "&sort=" + strSort; }
				if (strFilter != undefined) { url += "&filter:topics=" + strFilter; }
				if (strFilterField != undefined && strFilterValue != undefined) { url += "&filter:" + strFilterField + "=" + strFilterValue; }

				$.post(url, function (data) {
					if (data.length) {
						$(targetDivSelector).append(data);

						if(hideEmpty == "true") {
							$(".hide-empty").each(function (e) {
								var elem = $(this).attr("data-value");
								if(elem != undefined && elem.length == 0) {
									$(this).addClass("hidden");
								}
							});
						}
					}
					else {
						theLink.remove();
					}
				});
			}
		}
		else if ($(tileDivSelector).length) {
			var TileID = $(this).attr("data-tileid");

			if (intSkip == undefined) {
				var intSkip = $(tileDivSelector).length;
			}
			if (strSkip != undefined && !isNaN(parseInt(strSkip))) {
				intSkip = intSkip + parseInt(strSkip);
			}
			var url = bookslisturl + "?tileid=" + TileID;
			if (intReturn != undefined) { url += "&return=" + intReturn; }
			if (intSkip != undefined && !isNaN(intSkip)) { url += "&skip=" + intSkip; }
			if (strSort != undefined) { url += "&sort=" + strSort; }
			if (strLoader != undefined) { url += "&loader=" + strLoader; }

			$.post(url, function (data) {
				if (data.length) {
					$(tileDivSelector).last().after(data);
				}
				else {
					theLink.remove();
				}
			});

		}

	});

	//Social Feed jQuery Plugin
	$.fn.smSocialFeed = function (options) {
		return this.each(function() {
			var settings = $.extend({
				siteID: $(this).attr("data-siteid"),
				intReturn: $(this).attr("data-return"),
				layout: $(this).attr("data-layout"),
				target: $(this),
				additionalClasses: $(this).attr("data-container-additional-classes"),
			}, options );

			if(settings.layout === undefined) {
				settings.dataSrc = "slider";
			}
			getItems(settings);
		});

		function getItems(options) {
			var urlParams = {};

			if(options.siteID != undefined) {
				var url = wsurl + "/socialfeeds/list.asp";
				urlParams.siteid = options.siteID;
			}

			if(url != undefined) {
				if (options.intReturn != undefined) { urlParams["return"] = options.intReturn; }

				$.get(url, urlParams, function (data) {
					if(data.error !== undefined) {
						console.log(data.error.message);
					}

					if (data.data !== undefined && data.data.length > 0) {
						let len = data.data.length;
						let i = 0; 
						let out = [];

						for(i; i<len; i++) {
							out.push('<div class="col-lg-3 col-sm-6 col-xs-12 p-0"><div class="item embed-responsive embed-responsive-1by1" style="background-image: url(\'' + data.data[i]["media_url"] + '\')"><a href="' + data.data[i]["permalink"] + '" target="_blank"><div class="overlay"><p class="title p-4 mb-0 fs125x">' + data.data[i]["caption"] + '</p></div></a></div></div>');
						}

						if(options.layout === "collage") {
							out.unshift('<div class="container-fluid"><div class="row">');
							out.push('</div></div>');
						}
						$(options.target).html(out.join(''));

						if(options.layout === "collage") {
							$(options.target).css("opacity", 1);
						} else {
							$(options.target).on('init', function (event, slick, direction) {
								$(this).css("opacity", 1);
							});

							$(options.target).slick({
								infinite: false,
								slidesToShow: 3,
								slidesToScroll: 3,
								dots: false,
								arrows: true,
								prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-left"></i></button>',
								nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-right"></i></button>',
								responsive: [
									{
										breakpoint: 900,
										settings: {
											slidesToShow: 2,
											slidesToScroll: 2
										}
									},
									{
										breakpoint: 600,
										settings: {
											slidesToShow: 1,
											slidesToScroll: 1
										}
									}
								]
							});
						}
					}
				});
			}
		}
	};
	$(".sm-social-feed").smSocialFeed();

	//Paginated List jQuery Plugin
	$.fn.smPaginatedList = function (options) {
		return this.each(function () {
			var $smPL = $(this);
			var settings = $.extend({
				bookID: $(this).attr("data-bookid"),
				templateID: $(this).attr("data-template"),
				intReturn: $(this).attr("data-return"),
				intSkip: $(this).attr("data-skip"),
				mindate: $(this).attr("data-mindate"),
				maxdate: $(this).attr("data-maxdate"),
				filter: $(this).attr("data-filter"),
				filterField: $(this).attr("data-filter-field"),
				filterValue: $(this).attr("data-filter-value"),
				strSearch: $(this).attr("data-search"),
				strSort: $(this).attr("data-sort"),
				strSpin: $(this).attr("data-spin"),
				filterLogic: $(this).attr("data-filter-logic"),
				strNoresults: $(this).attr("data-noresults"),
				stubs: $(this).attr("data-stubs"),
				target: $(this),
				reset: false,
				btnTrigger: $(this).attr("data-trigger"),
				additionalClasses: $(this).attr("data-container-additional-classes"),
				chart: $(this).attr("data-chart")
			}, options);

			settings.target.html("");



			if (settings.filter != undefined) {
				try {
					settings.filter = JSON.parse(settings.filter);
					for (let i in settings.filter) {
						if ($("#" + settings.filter[i]).length > 0) {
							$filter = $("#" + settings.filter[i]);

							if (i === "data-search") {
								// add clear control
								if (!$filter.parent().hasClass("has-feedback")) {
									$filter.wrap("<div class='has-feedback'></div>");
									$filter.after("<a class='form-control-clear fa-solid fa-x fa-xs text-decoration-none d-none'><span class='sr-only'>clear keyword search filter</span></a>");
								}
							}

							// set filter options if hash prefilter provided
							$.each(document.location.hash.substr(1).split("&"), function (c, q) {
								if (q !== undefined && q.length > 0) {
									let p = q.split('=');
									let filterField = p[0];
									let filterVal = decodeURI(p[1]);


									if (filterField == settings.filter[i] && $("#" + filterField).length == 1) {
										if ($("#" + filterField).is("select")) {
											$("#" + filterField + " option").filter(function () {
												return ($(this).text() == filterVal);
											}).prop('selected', true);

										}
										else if ($("#" + filterField).is("input")) {
											$("#" + filterField).val(filterVal);
											if ($("#" + filterField).parent().hasClass("has-feedback") && filterVal != "") {
												$("#" + filterField).parent().find(".form-control-clear").removeClass("d-none");
											}
										}
									}
								}
							});

							if (i === "data-search") {
								let elem = $filter.val();
								settings.strSearch = elem;
								delete settings.filter[i];
							}
							else if (i === "data-mindate") {
								if (settings.mindate == "") {
									let elem = $filter.val();
									settings.mindate = elem;
								}
								delete settings.filter[i];
							}
							else if (i === "data-maxdate") {
								if (settings.maxdate == "") {
									let elem = $filter.val();
									settings.maxdate = elem;
								}
								delete settings.filter[i];
							}
							else if (i === "data-sort") {
								let elem = JSON.parse($filter.val());
								settings.strSort = elem.sort;
								settings.strSpin = elem.spin;
								delete settings.filter[i];
							}
							else if (i === "data-people") {
								let elem = $filter.val();
								if (elem.indexOf(" ") > 0) {
									delete settings.filter["people"];
									settings.filter["other_people"] = elem; 
								}
								else {
									delete settings.filter["other_people"];
									settings.filter["people"] = elem; 
								}
								delete settings.filter["data-people"];
							}
							else if (i === "data-annual") {
								let elem = $filter.val();
								if (elem.length > 0){
									settings.mindate = '1/1/' + elem;
									settings.maxdate = '1/1/' + (parseInt(elem) + 1);
								}
								else {
									settings.mindate = settings.maxdate = undefined;
								}
								delete settings.filter[i];
							}
							else if (i === "data-monthful") {
								let elem = $filter.val();
								settings.mindate = elem;
								if (elem.length > 0){
									elem = elem.split("/");
									if(elem[0] < 12){
										elem[0] = parseInt(elem[0])+1;
									}
									else {
										elem[2] = parseInt(elem[2])+1;
										elem[0] = 1;
									}
									elem = elem.join("/");
								}
								settings.maxdate = elem;
								delete settings.filter[i];
							}
							else if (i === "data-bookid") {
								let elem = JSON.parse($filter.val());
								settings.bookID = elem.bookid;
								settings.templateID = elem.template;
								delete settings.filter[i];
							}
							else if ($filter.val().length > 0) {
								settings.filter[i] = $filter.val();
							}
							else {
								delete settings.filter[i];
							}



							$filter.change(function (e) {
								let filter = JSON.parse($smPL.attr("data-filter"));
								let hash = "";
								for (let i in filter) {
									if ($("select#" + filter[i]).length > 0) {
										let val = $("select#" + filter[i] + " option:selected").html();

										if (val.length > 0 && val != "All") {
											if (hash != "") {
												hash += "&";
											}
											hash += filter[i] + "=" + val;
										}
									}
									else if ($("#" + filter[i]).is("input")) {
										let val = $("#" + filter[i]).val();
										if (val.length > 0) {
											if (hash != "") {
												hash += "&";
											}
											hash += filter[i] + "=" + val;
										}

									}
								}
								document.location.hash = hash;

								if (i === "data-search") {
									let elem = $(this).val();
									settings.strSearch = elem;
									delete settings.filter[i];
								}
								else if (i === "data-mindate") {
									let elem = $(this).val();
									settings.mindate = elem;
									delete settings.filter[i];
								}
								else if (i === "data-maxdate") {
									let elem = $(this).val();
									settings.maxdate = elem;
									delete settings.filter[i];
								}
								else if (i === "data-sort") {
									let elem = JSON.parse($(this).val());
									settings.strSort = elem.sort;
									settings.strSpin = elem.spin;
									delete settings.filter[i];
								}
								else if (i === "data-people") {
									let elem = $(this).val();
									if (elem.indexOf(" ") > 0) {
										delete settings.filter["people"];
										settings.filter["other_people"] = elem; 
									}
									else {
										delete settings.filter["other_people"];
										settings.filter["people"] = elem; 
									}
									delete settings.filter["data-people"];
								}
								else if (i === "data-annual") {
									let elem = $filter.val();
									if (elem.length > 0){
										settings.mindate = '1/1/' + elem;
										settings.maxdate = '1/1/' + (parseInt(elem) + 1);
									}
									else {
										settings.mindate = settings.maxdate = undefined;
									}
									delete settings.filter[i];
								}
								else if (i === "data-monthful") {
									let elem = $filter.val();
									settings.mindate = elem;
									if (elem.length > 0){
										elem = elem.split("/");
										if (elem[0] < 12){
											elem[0] = parseInt(elem[0])+1;
										}
										else {
											elem[2] = parseInt(elem[2])+1;
											elem[0] = 1;
										}
										elem = elem.join("/");
									}
									settings.maxdate = elem;
									delete settings.filter[i];
								}
								else if (i === "data-bookid") {
									let elem = JSON.parse($(this).val());
									settings.bookID = elem.bookid;
									settings.templateID = elem.template;
									delete settings.filter[i];
								}
								else if ($(this).val().length > 0) {
									settings.filter[i] = $(this).val(); 
								}
								else {
									delete settings.filter[i];
								}

								if (i !== "data-search") {
									settings.reset = true;
									getItems(settings);
								}
							});

							$filter.on("keyup", function (e) {
								if (i === "data-search") {
									let elem = $(this).val();
									settings.strSearch = elem;

									if ($(this).parent().hasClass("has-feedback") && $(this).val() == "") {
										$(this).parent().find(".form-control-clear").addClass("d-none");
									}
									if ($(this).parent().hasClass("has-feedback") && $(this).val() != "") {
										$(this).parent().find(".form-control-clear").removeClass("d-none");
									}

									if (e.which == 13) {
										e.preventDefault();
										//console.log(settings.filter);
										delete settings.filter[i];
										settings.reset = true;
										getItems(settings);
									}
								}
							});

							if (i === "data-search") {
								if ($filter.parent().hasClass("has-feedback")) {
									let $clearbtn = $filter.parent().find(".form-control-clear");
									$clearbtn.click(function (e) {
										e.preventDefault();
										$(this).parent().find(".form-control").val("");
										$(this).addClass("d-none");
										settings.strSearch = "";
										delete settings.filter[i];
										settings.reset = true;
										getItems(settings);
									});
								}
							}
						}

						else if ($("input[name='" + settings.filter[i] + "']").length > 0) {
							$filter = $("input[name='" + settings.filter[i] + "']")
							if ($("input[name='" + settings.filter[i] + "']:checked").length > 0) {
								settings.filter[i] = [];
								$.each($("input[name='" + $filter.attr('name') + "']:checked"), function() {
									settings.filter[i].push($(this).val());
								});
							}

							$filter.change( function (e) {
								settings.filter[i] = [];
								$.each($("input[name='" + $(this).attr('name') + "']:checked"), function() {
									settings.filter[i].push($(this).val());
								});

								if (settings.filter[i].length == 0) {
									settings.filter[i] = $(this).attr('name');
								}

								settings.reset = true;
								getItems(settings);
							});
						}
					}
				}
				catch (error) {
					console.log(error);
				}
			}

			if (settings.btnTrigger != undefined) {
				$("#" + settings.btnTrigger).click(function (e) {
					e.preventDefault();
					settings.reset = true;
					getItems(settings);
				});
			}

			if($("#spinner-overlay").length == 0) {
				$(settings.target).parent().parent().append('<div id="spinner-overlay"><div class="w-100 d-flex justify-content-center align-items-center"><div class="spinner-border">&nbsp;</div></div></div>');
			}

			getItems(settings);
		});

		function getItems(options) {
			var urlParams = {};
			$("#spinner-overlay").css("display","flex");

			if(options.bookID != undefined) {
				var url = bookslisturl;
				urlParams.id = options.bookID;
			}

			if(url != undefined) {
				if (options.mindate != undefined) { urlParams["mindate"] = options.mindate; }
				if (options.maxdate != undefined) { urlParams["maxdate"] = options.maxdate; }
				if (options.templateID != undefined) { urlParams["template"] = options.templateID; }
				if (options.intReturn != undefined) { urlParams["return"] = options.intReturn; }
				if (options.intSkip != undefined) { urlParams["skip"] = options.intSkip; }
				if (options.strSearch != undefined) { urlParams["search"] = options.strSearch; }
				if (options.strSort != undefined) { urlParams["sort"] = options.strSort; }
				if (options.strSpin != undefined) { urlParams["spin"] = options.strSpin; }
				if (options.filterLogic != undefined) { urlParams["filterlogic"] = options.filterLogic; }
				if (options.stubs != undefined) { urlParams["stubs"] = options.stubs; }

				if (options.filter != undefined) { 
					for(let i in options.filter) {
						urlParams["filter:" + i] = options.filter[i]; 
					}
				}
				if (options.filterField != undefined && options.filterValue != undefined) { urlParams["filter:" + options.filterField] = options.filterValue; }
				urlParams["totalItems"] = 1;

				if(options.chart) {
					var chartUrlParams =JSON.parse(JSON.stringify(urlParams));
					if (options.intReturn != undefined) { delete chartUrlParams["totalItems"]; }
					chartUrlParams["template"] = 1495;
					delete chartUrlParams["return"];

					$('#chart-container').parent().append('<div id="chart-spinner-overlay"><div class="w-100 d-flex justify-content-center align-items-center"><div class="spinner-border">&nbsp;</div></div></div>');
					$("#chart-spinner-overlay").css("display","flex");
					$.get(url + '?' + $.param(chartUrlParams,true), function (data) {
						let publication = {};
						let people = {};
						let unit = {};

						let $data = $.parseHTML(data);
						$.each($data, function (){
							$(this).find('.publication').each(function (){
								let elem = $(this).text().trim();
								if(publication[elem] !== undefined && publication[elem].value !== undefined) {
									publication[elem].value += 1;
								} else {
									publication[elem] = {};
									publication[elem].name = $(this).text();
									publication[elem].value = 1;
									publication[elem].showLabel = 0;
								}
							});

							$(this).find('.people option').each(function (){
								let elem = $(this).val();
								if(people[elem] !== undefined && people[elem].value !== undefined) {
									people[elem].value += 1;
								} else {
									people[elem] = {};
									people[elem].name = $(this).text();
									people[elem].value = 1;
								}
							});

							$(this).find('.unit li').each(function (){
								let elem = $(this).text();
								if(unit[elem] !== undefined && unit[elem].value !== undefined) {
									unit[elem].value += 1;
								} else {
									unit[elem] = {};
									unit[elem].name = $(this).text();
									unit[elem].value = 1;
									unit[elem].showLabel = 0;
								}
							});
						});

						publication = Object.values(publication);
						publication = publication.sort((a, b) => b.value-a.value);

						people = Object.values(people);
						people = people.sort((a, b) => b.value-a.value);

						unit = Object.values(unit);
						unit = unit.sort((a, b) => b.value-a.value);

						let i;
						for(i=0; i<10; i++){
							if(!!publication[i]){
								publication[i].showLabel = 1;
							}
							if(!!people[i]){
								people[i].showLabel = 1;
							}
							if(!!unit[i]){
									unit[i].showLabel = 1;
							}
						}

						var chart = Highcharts.chart('chart-container', {
							chart: {
								type: 'packedbubble',
								height: '100%'
							},
							title: {
								text: 'Media Mentions'
							},
							tooltip: {
								useHTML: true,
								pointFormat: '<b>{point.name}:</b> {point.value}'
							},
							plotOptions: {
								packedbubble: {
									useSimulation: false,
									dataLabels: {
										enabled: true,
										format: '{point.name}',
										filter: {
											property: 'showLabel',
											operator: '==',
											value: 1
										},
										style: {
											color: 'black',
											textOutline: 'none',
											fontWeight: 'normal'
										}
									}
								}
							},
							series: [{
								name: 'Per Publication',
								data: publication,
								color: '#ff552e'
							},
							{
								name: 'Per Faculty/Person',
								data: people,
								color: '#009fd4'
							},
							{
								name: 'Per Department/Unit',
								data: unit,
								color: '#13294b'
							}]
						});
					}).always(function() {
						$("#chart-spinner-overlay").css("display","none");
					});

				}

				$.get(url + '?' + $.param(urlParams,true), function (data) {
					if(options.reset == false) {
						$(options.target).append('<div class="sm-paginated-list-items ' + (options.additionalClasses ? options.additionalClasses : "") + '">' + data + '</div>');
						$(options.target).append('<ul class="sm-paginated-list-pagination pagination justify-content-center table-responsive"></ul>');
						options.reset = true;
					} else {
						$(options.target).find('.sm-paginated-list-items').html(data);
						$(options.target).find('.sm-paginated-list-pagination').twbsPagination('destroy');
					}
					if (data.length) {
						var firstTime = true;

						if (typeof $(options.target).find('.sm-paginated-list-pagination').twbsPagination === "function") {
							$(options.target).find('.sm-paginated-list-pagination').twbsPagination({
								totalPages: Math.ceil($(options.target).find('.sm-paginated-list-items').find("[data-items]").first().attr("data-items") / urlParams["return"]),
								visiblePages: 7,
								onPageClick: function (event, page) {
									if (firstTime) {
										firstTime = false;
									} else {
										$("#spinner-overlay").css("display", "flex");
										urlParams.page = page;
										urlParams.totalItems = 0;

										$.get(url + '?' + $.param(urlParams, true), function (data) {
											if (data.length) {
												$(options.target).find('.sm-paginated-list-items').html(data);
											}
										}).always(function () {
											$('html, body').animate({
												scrollTop: $(options.target).parent().offset().top
											});
											$("#spinner-overlay").css("display", "none");
										});
									}
								}
							});
						}
						else {
							$("#spinner-overlay").css("display", "none");
						}
					}

					else {
						if (options.strNoresults) {
							options.target.find(".sm-paginated-list-items").html("<div class='col-12'><p>" + options.strNoresults + "</p></div>");
						}
						else {
							options.target.find(".sm-paginated-list-items").html("<div class='col-12'><p>No results found.</p></div>");
						}
					}

				}).always(function() {
					$("#spinner-overlay").css("display","none");
				});
			}
		}
	};
	$(".sm-paginated-list").smPaginatedList();

	//Publications jQuery Plugin
	$.fn.smPublications = function (options) {
		return this.each(function() {

			var settings = $.extend({
				loader: "#" + $(this).attr("data-trigger-load"),
				searcher: "#" + $(this).attr("data-trigger-search"),
				sorter: "#" + $(this).attr("data-trigger-sort"),
				facultyType: "#" + $(this).attr("data-trigger-faculty-type"),
				target: $(this),
				bookID: $(this).attr("data-bookid"),
				unitID: $(this).attr("data-unit"),
				catID: $(this).attr("data-cat"),
				netID: $(this).attr("data-netid"),
				group: $(this).attr("data-group"),
				exclude: $(this).attr("data-exclude"),
				templateID: $(this).attr("data-template"),
				intReturn: $(this).attr("data-return"),
	//			intSkip: $(this).attr("data-skip"),
				strSort: $(this).attr("data-sort"),
				strSearch: "",
				strFacultyType: $(this).attr("data-faculty-type"),
				append: true,
				htmlPreloaded: $(this).attr("data-preloaded")
			}, options );

			if($("#spinner-overlay").length == 0) {
				$(settings.target).parent().append('<div id="spinner-overlay"><div class="w-100 d-flex justify-content-center align-items-center"><div class="spinner-border">&nbsp;</div></div></div>');
			}

			if(settings.htmlPreloaded != undefined && settings.htmlPreloaded == "false") {
				publicationsGet(settings);
			}

			if(settings.loader != undefined) {
				$(settings.loader).click(function (e){
					e.preventDefault();
					settings.append = true;
					if(settings.strSearch.length > 0){
						$(settings.searcher + "-input").val(settings.strSearch);
					}
					publicationsGet(settings);
				});
			}

			if(settings.searcher != undefined) {
				$(settings.searcher + "-input").on("keypress", function (e) {
					if (e.which == 13) {
						e.preventDefault();
						settings.append = false;
						settings.strSearch = $(settings.searcher + "-input").val();
						publicationsGet(settings);
					}
				});
				$(settings.searcher + "-button").click(function (e){
					e.preventDefault();
					settings.append = false;
					settings.strSearch = $(settings.searcher + "-input").val();
					publicationsGet(settings);
				});
			}

			if(settings.sorter != undefined) {
				settings.strSort = $(settings.sorter).val();
				$(settings.sorter).change(function (e){
					settings.append = false;
					if(settings.strSearch.length > 0){
						$(settings.searcher + "-input").val(settings.strSearch);
					}
					settings.strSort = $(settings.sorter).val();
					publicationsGet(settings);
				});
			}

			if(settings.facultyType != undefined) {
				settings.strFacultyType = $(settings.facultyType).val();
				$(settings.facultyType).change(function (e){
					settings.append = false;
					if(settings.strSearch.length > 0){
						$(settings.searcher + "-input").val(settings.strSearch);
					}
					settings.strFacultyType = $(settings.facultyType).val();
					publicationsGet(settings);
				});
			}

		});

		function publicationsGet(options) {
			$("#spinner-overlay").css("display","flex");

			if(options.unitID != undefined && options.catID != undefined) {
				var url = wsurl + "/directory/publications.asp?unit=" + options.unitID;

				if (options.catID != undefined) { url += "&cat=" + options.catID; }
				if (options.netID != undefined) { url += "&netid=" + options.netID; }
				if (options.group != undefined) { url += "&group=" + options.group; }
				if (options.exclude != undefined) { url += "&exclude=" + options.exclude; }

			} else if(options.bookID != undefined) {
				var url = wsurl + "/books/publications.asp?id=" + options.bookID;
			}

			if(url != undefined && $(options.target) != undefined) {
				if(options.append == false) {
					$(options.target).empty();
				} 

				var numItems = $(options.target).children().length;
				options.intSkip = numItems;

				if (options.templateID != undefined) { url += "&template=" + options.templateID; }
				if (options.intReturn != undefined) { url += "&return=" + options.intReturn; }
				if (options.intSkip != undefined) { url += "&skip=" + options.intSkip; }
				if (options.strSort != undefined) { url += "&sort=" + options.strSort; }
				if (options.strFacultyType != undefined) { url += "&facultyType=" + options.strFacultyType; }
				if (options.strSearch != undefined) { url += "&search=" + options.strSearch; }

				$.get(url, function (data) {
					if (data.length) {
						let lastChild = $(options.target).children().last();

						$(options.target).append(data);
						let nextSibling = $(lastChild).next();

						if($(lastChild).children().first().text() == $(nextSibling).children().first().text() ) {
							$(nextSibling).children().first().addClass("hidden")
						}

						if(options.intReturn != undefined && ($(options.target).children().length - numItems) < options.intReturn) {
							$(options.loader).addClass("hidden");
						} else {
							$(options.loader).removeClass("hidden");
						}
					} else if (options.loader != undefined) {
						$(options.loader).addClass("hidden");
					}
				}).always(function() {
					$("#spinner-overlay").css("display","none");
				});
			}
		}

	};
	$(".sm-publications").smPublications();

	//Datatables Wrapper jQuery Plugin
	$.fn.smDatatable = function (options) {
		//console.log("sm-datatables int");
		return this.each(function() {
			var $elem = $(this);

			var settings = $.extend({
				ajax: $elem.attr("data-sm-ajax"),
				dataSrc: $elem.attr("data-sm-ajax-datasrc"),
				columns: $elem.attr("data-sm-columns"),
			}, options );

			if(settings.dataSrc === undefined) {
				settings.dataSrc = "data";
			}

			settings.columns = settings.columns.split(",");
			settings.columns = $.map(settings.columns, function (val, i) {
				return { "data": val };
			});

			var columnDefs = [
				{
					"type": "date",
					"targets": "sm-datatable-date"
				}
			];
			$(".sm-datatable-classname").each(function(){
				var classname = $(this).attr("data-sm-classname");
				var pos = $(this).index();

				columnDefs.push({
					"targets": pos,
					"className": classname
				})
			});
			$(".sm-datatable-fix-encode", $elem).each(function (){
				var pos = $(this).index();
				columnDefs.push({
					"targets": pos,
					"render": function ( data, type, row ) {
						return data.replace(/â€”/g, "–")
						.replace(/â€™/g, "’")
						.replace(/â€“/g, "—")
						.replace(/â€œ/g, "“")
						.replace(/â€˜/g, "‘");
					}
				});
			});
			$(".sm-datatable-link", $elem).each(function (){
				var link = $(this).attr("data-sm-link");
				var linkPrefix = $(this).attr("data-sm-link-prefix") == undefined ? '' : $(this).attr("data-sm-link-prefix");

				var uriEncoded = $(this).attr("data-sm-uriencoded") == undefined ? false : ($(this).attr("data-sm-uriencoded") == 'true' ? true : false) ;

				var pos = $(this).index();
				columnDefs.push({
					"targets": pos,
					"render": function ( data, type, row ) {
						return '<a href="' + linkPrefix + row[link] + '">' + (uriEncoded == true ? decodeURIComponent(data).replace(/\+/g, " ") : data) + '</a>';
					}
				});
			});
			$(".sm-datatable-concat", $elem).each(function (){
				var preCat = $(this).attr("data-sm-precat") == undefined ? '' : $(this).attr("data-sm-precat");
				var posCat = $(this).attr("data-sm-postcat") == undefined ? '' : $(this).attr("data-sm-postcat");

				var pos = $(this).index();
				columnDefs.push({
					"targets": pos,
					"render": function ( data, type, row ) {
						return preCat + data + posCat;
					}
				});
			});
			$(".sm-datatable-nested-array", $elem).each(function (){
				// filter[] = "key|value|numReturn"
				var filter = $(this).attr("data-sm-filter") == undefined ? 0 : $(this).attr("data-sm-filter").split("|");
				var pos = $(this).index();

				columnDefs.push({
					"targets": pos,
					"render": function ( data, type, row ) {
						let n = filter[2];
						let res = []
						for(let i in data){
							if(data[i][filter[0]] === filter[1]){
								if(filter[1] === "Image") {
									res.push('<img src="' + data[i]["src"] + '" alt="' + data[i]["title"] + '" />');
								} else {
									res.push('<a href="' + data[i]["src"] + '">' + data[i]["title"] + '</a>');
								}

								if(--n === 0){
									break;
								}
							}
						}
						return res;
					}
				});
			});

			$(".sm-datatable-order", $elem).each(function (){
				var order = $(this).attr("data-sm-order");
				var pos = $(this).index();
				columnDefs.push({
					"targets": pos,
					"render": function ( data, type, row ) {
						if (type === 'sort') {
							if(order === 'splitcomma') {
								var item;
								var items = data.split(",");
								var token = [];
								for(var i=0; i<items.length; i++) {
									item = items[i].split(" ");
									token.push(item[item.length - 1]);
								}

								return token.join();
							}
						}

						return data;
					}
				});
			});

			$elem.DataTable({
				"ajax": {
					url: settings.ajax,
					dataSrc: settings.dataSrc
				},
				"columns": settings.columns,
				"columnDefs": columnDefs,
				"pageLength": 10,
				"order": [],
				"deferRender": true
			});

		});
	};
	$(".sm-datatable").smDatatable();

	// year for virtual yearbook title
	$("#vy-years-filter").change(function (e) {
		$("#vy-year").text($("option:selected",this).text());
	});



	$("#news-search-hints a").click(function (e) {
		var q = $(this).html();
		$("#news-search").val(q);
		$("#news-search").trigger("keyup");
		$("#news-search-go").click();
		document.location.hash = "news-search=" + q;
	});

/*
	// not used.  commenting out.  --jjp 2024.02.01
	// new posts laoder for /about/news/in-the-news
	$("#load_more_in_the_news").click(function (e) {
		e.preventDefault();
		var ArticleCount = $(".in-the-media-list .article[data-type=article]").length;
		$.post("/handlers/ajax-load-more-in-the-news.asp?skip=" + ArticleCount, function (data) {
			$(".in-the-media-list .article[data-type=article]").last().after(data);
		});
	});
*/


	// new posts laoder for /about/news/multimedia-archive
	// only used on https://ihsi.dev.engr.illinois.edu/connect/news. we change that page and remove this block. --jjp 2024.02.01
	$("#load_more_multimedia").click(function (e) {
		e.preventDefault();
		var ArticleCount = $(".tile[data-type=article]").length;
		var search = $("#search_news").val();

		let filters = [];
		let bookids = [];
		let templateid = "";
		$(".multimedia.filter-list li.filter-list-on").each(function () {
			filters.push("filter:" + $(this).attr("data-filter-field") + "=" + $(this).attr("data-filter-value"));
			bookids.push($(this).attr("data-bookid"));
			templateid = $(this).attr("data-templateid");
		});

		if(bookids != undefined && templateid != undefined) {
			var url = bookslisturl + "?id=" + bookids.join(",") + "&template=" + templateid + "&return=6" + (filters.length > 0 ? "&" + filters.join("&") : "") + "&skip=" + ArticleCount + "&search=" + search;
		} else {
			var url = bookslisturl + "?id=299&template=233&return=6" + (filters.length > 0 ? "&" + filters.join("&") : "") + "&skip=" + ArticleCount + "&search=" + search;
		}

		$.post(url, function (data) {
			$(".tile[data-type=article]").last().after(data);
		});
	});

	// initial post load on multimedia search page 
	// only used on https://ihsi.dev.engr.illinois.edu/connect/news. we change that page and remove this block. --jjp 2024.02.01
	if ($(".multimedia.filter-list").length > 0) {
		//check if there's a querystring
		var queries = {};
		$.each(document.location.search.substr(1).split('&'), function (c, q) {
			if(q !== undefined && q.length>0) {
				var i = q.split('=');
				queries[i[0].toString()] = i[1].toString();
			}
		});
		if (queries.q !== undefined && queries.q.length > 0) {
			$("#search_news").val(queries.q);
		}

		var targetTile = $(".multimedia.filter-list").closest(".tile");
		LoadMultimedia(targetTile);
	}


	// form submitter for search field on /news
	// only used on https://ihsi.dev.engr.illinois.edu/connect/news. we change that page and remove this block. --jjp 2024.02.01
	if ($("#search_news_container").length > 0) {
		$("#search_news_container #multimedia-search-go").click(function (e) {
			e.preventDefault();
			var q = $("#search_news_container #search_news").val();
			if($("#search_news_container #search_news").attr("data-goto") != undefined){
				window.location = $("#search_news_container #search_news").attr("data-goto") + "?q=" + q;
			} else {
				window.location = window.location.href.split('?')[0] + "?q=" + q;
			}
		});


		$("#search_news_container #search_news").on("keypress", function (e) {
			if (e.which == 13) {
				var q = $("#search_news_container #search_news").val();
				if($("#search_news_container #search_news").attr("data-goto") != undefined){
					window.location = $("#search_news_container #search_news").attr("data-goto") + "?q=" + q;
				} else {
					window.location = window.location.href.split('?')[0] + "?q=" + q;
				}
			}
		});
	}

	// /about/news/multimedia-archive filter toggles
	// only used on https://ihsi.dev.engr.illinois.edu/connect/news. we change that page and remove this block. --jjp 2024.02.01
	$(".multimedia.filter-list a").click(function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		parent.toggleClass("filter-list-on");
		var parentTile = $(this).closest(".tile");
		LoadMultimedia(parentTile);
	});


/*
	// not used.  commenting out.  --jjp 2024.02.01
	$("#search_multimedia_inline_container #multimedia-search-go").click(function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		parent.toggleClass("filter-list-on");
		var parentTile = $(this).closest(".tile");
		LoadMultimedia(parentTile);
	});


	$("#search_multimedia_inline_container #search_news").on("keypress", function (e) {
		if (e.which == 13) {
			var parent = $(this).parent();
			parent.toggleClass("filter-list-on");
			var parentTile = $(this).closest(".tile");
			LoadMultimedia(parentTile);
		}
	});
*/

/*
	// not used.  commenting out.  --jjp 2024.02.01
	// new posts laoder for /giving/
	$("#load_more_giving_stories").click(function (e) {
		e.preventDefault();
		var ArticleCount = $(".tile[data-type=article]").length;
		var Keyword = $(this).attr("data-keyword");
		if (!Keyword) { Keyword = ""; }
		$.post("/handlers/ajax-load-more-giving-stories.asp?skip=" + ArticleCount + "&keyword=" + Keyword, function (data) {
			if (data.length > 2) {
				$(".tile[data-type=article]").last().after(data);
			}
			else {
				$("#load_more_giving_stories").remove();
			}
		});
	});

*/

	/* calendar */
	// not used.  commenting out.  --jjp 2024.02.01
	// LoadCalendarEvents($(".calendar-list"), false);

	CalendarLocationLinks();

/*
	// not used.  commenting out.  --jjp 2024.02.01
	// new posts laoder for /about/calendars
	$("#load_more_events").click(function (e) {
		e.preventDefault();
		LoadCalendarEvents($(".calendar-list"), true);
	});

	// not used.  commenting out.  --jjp 2024.02.01
	// /news/calendars filter toggles
	$(".calendar.filter-list a").click(function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		parent.toggleClass("filter-list-on");
		LoadCalendarEvents($(".calendar-list"), false);
	});

	// not used.  commenting out.  --jjp 2024.02.01
	$("#events-search-go").click(function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		LoadCalendarEvents($(".calendar-list"), false);
	});


	// not used.  commenting out.  --jjp 2024.02.01
	$("#search_events").on("keypress", function (e) {
		if (e.which == 13) {
			var parent = $(this).parent();
			LoadCalendarEvents($(".calendar-list"), false);
		}
	});

*/



	// calendar prev and next button activators
	$("a.calendar-button").click(function (e) {
		e.preventDefault();
		var target = $("#" + $(this).attr("data-target"));
		var mindate = new Date(target.attr("data-mindate"));
		var maxdate = new Date(target.attr("data-maxdate"));
		var term = target.attr("data-term");
		var year = target.attr("data-year");
		var calendarId = target.attr("data-calendarid");
		var template = target.attr("data-template");
		var diff = (maxdate.getTime() - mindate.getTime()) / (1000 * 3600 * 24);
		var direction = $(this).attr("data-direction");
		var sharedwith = target.attr("data-sharedwith");

		var source = target.attr("data-source");
		if (!source) {
			source = "list";
		}
		if (source != "list" && source != "ical") {
			source = "list";
		}
		var calurl = wsurl + "/calendar/" + source + ".asp"

		if (term != undefined && term != "") {
			if (direction == "prev") {
				term = PrevTerm(term);
			}
			else if (direction == "next") {
				term = NextTerm(term);
			}
			$.get(calurl, { id: calendarId, template: template, term: term, sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});

		}

		else if (year != undefined && year != "") {
			if (direction == "prev") {
				year = parseInt(year) - 1;
			}
			else if (direction == "next") {
				year = parseInt(year) + 1;
			}
			$.get(calurl, { id: calendarId, template: template, year: year, sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});
		}

		else {
			if (direction == "prev") {
				mindate = addDays(mindate, -diff);
				maxdate = addDays(maxdate, -diff);
			}
			else if (direction == "next") {
				mindate = addDays(mindate, diff);
				maxdate = addDays(maxdate, diff);
			}
			mindate = (mindate.getMonth() + 1) + '/' + mindate.getDate() + '/' + mindate.getFullYear();
			maxdate = (maxdate.getMonth() + 1) + '/' + maxdate.getDate() + '/' + maxdate.getFullYear();
			$.get(calurl, { id: calendarId, template: template, mindate: mindate, maxdate: maxdate, sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});
		}



	});


	$("a.calendar-scope-button").click(function (e) {
		e.preventDefault();
		var target = $("#" + $(this).attr("data-target"));
		var scope = $(this).attr("data-scope");
		var calendarId = target.attr("data-calendarid");
		var template = target.attr("data-template");
		var sharedwith = target.attr("data-sharedwith");

		var source = target.attr("data-source");
		if (!source) {
			source = "list";
		}
		if (source != "list" && source != "ical") {
			source = "list";
		}
		var calurl = wsurl + "/calendar/" + source + ".asp"

		if (scope == "week") {
			$.get(calurl, { id: calendarId, template: template, maxdate: '7', sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});
		}
		else if (scope == "month") {
			$.get(calurl, { id: calendarId, template: template, maxdate: '30', sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});
		}
		else if (scope == "term") {
			$.get(calurl, { id: calendarId, template: template, term: 'thisterm', sharedwith: sharedwith, 'return': '1000' }, function (data) {
				target.parent().html(data); 
				CalendarLocationLinks();
			});

		}

		$("a.calendar-scope-button").removeClass("active");
		$(this).addClass("active");

	});




	$("#calendar-search-go").click(function (e) {
		e.preventDefault();
		var parent = $(this).parent();
		SearchCalendar();
	});


	$("#calendar-search").on("keypress", function (e) {
		if (e.which == 13) {
			e.preventDefault();
			var parent = $(this).parent();
			SearchCalendar();
		}
	});




















	/* wrap tables in horizontal_scroll div */
	$("body.site #content table").each(function (i) {
		var parent = $(this).parent();
		var parentClass = parent.attr("class");
		var doMod = false;
		if (!parentClass) {
			doMod = true;
		}
		else {
			if (parentClass.toLowerCase().indexOf("table-responsive") < 0) {
				doMod = true;
			}
		}

		if (doMod) {
			$(this).wrap("<div class='table-responsive'></div>");
		}
	});


	/* isotope filters */



	if ($("#sorts").length > 0) {

		// init Isotope
		var $container = $('#sortable').isotope({
			itemSelector: '.person',
			layoutMode: "fitRows",
			getSortData: {
				name: '.name',
				title: '.title'
			}
		});

		// bind sort button click
		$('#sorts').on('click', '.dropdown-menu a', function (e) {
			if(!$(this).hasClass("gotourl")){
				e.preventDefault();
			} else {
				return;
			}

			// get requested filter value
			var filterValue = " " + $(this).attr('data-filter') + " ";

			// get parent dropdown menu
			var dropdownMenu = $(this).closest(".dropdown-menu");

			// get parent button
			var parentButton = $("#" + dropdownMenu.attr("aria-labelledby"));

			// update parent button label 
			if (!parentButton.attr("data-orig-label")) {
				parentButton.attr("data-orig-label", parentButton.html());
			}

			if (filterValue.trim() == "") {
				parentButton.html(parentButton.attr("data-orig-label"));
			}
			else {
				parentButton.html($(this).html());
			}

			//set active class
			dropdownMenu.find(".active").removeClass("active");
			$(this).addClass("active");

			var dicSelections = [];
			let hash = "";
			$("#sorts .dropdown-menu .active").each(function (i) {
				var key = $(this).closest(".dropdown-menu").attr("data-filter-on");
				if (!key) { key = "dept"; }

				if (key == "multiplevalues") {
					dicSelections[key] = $(this).data("filter");
				} else {
					dicSelections[key] = " " + $(this).attr("data-filter") + " ";
				}

				if ($(this).data("filter") != "") {
					if (hash != "") {
						hash += "&";
					}

					if (key == "multiplevalues") {
						hash += key + "=" + $(this).data("filter");
					} else {
						hash += key + "=" + $(this).attr("data-filter");
					}

				}

			});
			document.location.hash = hash;

			/* sortable descriptions */
			if($("#sortableDescription") != undefined) {
				$("#sortableDescription .item").addClass("hidden");
				$("#sortableDescription .item").each(function () {
					for (var key in dicSelections) {
						if (dicSelections[key].trim() != "") {
							var data = " " + $(this).attr("data-" + key) + " ";
							if (data.indexOf(dicSelections[key]) >= 0) {
								$(this).removeClass("hidden");
							}
						}
					}
				});
			}

			$container.isotope({
				filter: function () {
					var blnShowItem = true;

					var target = $("#sorts").attr("data-target");

					if (target && target != "") {
						var data = $(this).find(target).text().replaceAll("'", "").trim();
						var s = "";

						for (var key in dicSelections) {
							s += dicSelections[key].trim() + " ";
						}
						s = s.replaceAll("'", "").trim();

						if (s != "") {
							if (data.indexOf(s) < 0) {
								blnShowItem = false;
							}
						}
					}

					else {
						for (var key in dicSelections) {
							if (key =="multiplevalues" && Array.isArray(dicSelections[key])) {
								var data = " " + $(this).attr("data-" + key).replaceAll("'", "") + " ";
								var blnFlag = false;
								for (var elem in dicSelections[key]) {
									if (data.indexOf(" " + dicSelections[key][elem].replaceAll("'", "") + " ") >= 0) {
										blnFlag = true;
										break;
									}
								}
								blnShowItem = blnFlag;
							}
							else if (dicSelections[key].trim() != "") {
								let data = " " + $(this).attr("data-" + key).replaceAll("'", "") + " ";
								let val = dicSelections[key].trim().replaceAll("'", "");
								let arr = val.split("|");
								var blnFlag = false;
								for (let elem in arr) {

									if (data.indexOf(" " + arr[elem] + " ") >= 0) {
										blnFlag = true;
										break;
									}
								}
								blnShowItem = blnFlag
							}
						}
					}
					return (blnShowItem);
				}
			});
		});

		//$('#sorts .dropdown-menu a.active').trigger("click");
		$.each(document.location.search.substr(1).split('&'), function (c, q) {
			if(q !== undefined && q.length>0) {
				var i = q.split('=');
				if($('#sorts .dropdown-menu.filter-by-' + i[0].toString()).length){
					$('#sorts .dropdown-menu.filter-by-' + i[0].toString() + ' a[data-filter="' + i[1].toString() + '"]').addClass('active');
					$('#sorts .dropdown-menu.filter-by-' + i[0].toString() + ' a.active').trigger("click");
				}
			}
		});

		// process data-default settings
		if (document.location.hash == "") {
			$("body.site #sorts .dropdown-menu[data-default]").each(function (i) {
				var fltr = $(this).attr("data-default");
				$(this).find("a[data-filter='" + fltr + "']").addClass("active");
				$(this).find("a.active").trigger("click");
			});
		}

		// process hash filter preselects
		$.each(document.location.hash.substr(1).split("&"), function (c, q) {
			if (q !== undefined && q.length > 0) {
				let p = q.split('=');
				let filterField = ".dropdown-menu[data-filter-on='" + p[0] + "']";
				let filterVal = decodeURI(p[1]);
				if ($(filterField).length == 1) {
					$(filterField).find("a[data-filter='" + filterVal.replaceAll("'", "") + "']").addClass("active");
					$(filterField).find("a.active").trigger("click");
				}
			}
		});
	}


	/*****************************************/


	/* fade/slide-in animations */
	
	$(".animated").each(function () {
		var obj = $(this);
		obj.waypoint(function () {
			if (obj.hasClass("fcenter")) {
				obj.addClass('fadeIn');
			}
			else if (obj.hasClass("fright")) {
				obj.addClass('fadeInRight');
			}
			else if (obj.hasClass("fleft")) {
				obj.addClass('fadeInLeft');
			}
			else {
				obj.addClass('fadeInUp');
			}

		}, { offset: "95%" });
	});





	/**************************************/
	/* roundify */

	$("body.site .roundify").each(function (e) {
		var imagesrc = $(this).attr("src");
		var html = "<div class='round' style='background-image: url(" + imagesrc + ")'></div>";
		$(this).replaceWith(html);
	});


	/* fixes to blogtool content */
	$(".article span").attr("style", "");
	$(".news span").attr("style", "");


	// enable datadatables on appropriately classed tables.
	$('table.datatable').DataTable({
		"paging": false,
		"info": false
	});


	// giving form activator
	$(".make-a-gift-activator").click(function (e) {
		e.preventDefault();
		$.get("/handlers/modal-make-a-gift.asp", function (data) {
			modalControls(data);
			givingForm();
		});
	});


	// get in touch form activator
	$(".get-in-touch-activator").click(function (e) {
		e.preventDefault();
		$.get("/handlers/modal-get-in-touch.asp", function (data) {
			modalControls(data);
		});
	});


	/* thin horizontal scroll bar at top of window */
	$("body.scrollbar").append("<div id='scrollbar'></div>");



	/* fact-box links */
	$(".fact-boxes .item").each(function (e) {
		if ($(this).find("a").length > 0) {
			$(this).addClass("pointer");
		}
	});

	////////should replace this with stretched-link class
		var factboxAnchorClick = false;
	$(".fact-boxes .item a").click(function (e) {
		factboxAnchorClick = true;
	});

	$(".fact-boxes .item").click(function (e) {
		if (!factboxAnchorClick) {
			var anchor = $(this).find("a");
			var href = anchor.attr("href");
			if (href.indexOf("http") == 0) {
				window.open(href, "_blank");
			}
			else {
				window.location = href;
			}
		}
		factboxAnchorClick = false;
	});



	////////should replace this with stretched-link class
	/* news item links */
	var newsStoryAnchorClick = false;
	$(document).on("click", "body.site .card.news a, body.site .tile.news a", function (e) {
		newsStoryAnchorClick = true;
	});

	$(document).on("click", "body.site .card.news, body.site .tile.news", function (e) {
		if (!newsStoryAnchorClick) {
			let anchor = $(this).find(".lower a").first();
			if (anchor.length == 0) {
				anchor = $(this).find(".title a");
			}

			let href = anchor.attr("href");
			if (href) {
				if (href.indexOf("http") == 0 && href.indexOf("/" + window.location.hostname + "/") < 0) {
					window.open(href, "_blank");
				}
				else {
					window.location = href;
				}
			}
		}
		newsStoryAnchorClick = false;
	});



	/* circle progress bars */
	$(".progress-round").each(function () {
		var obj = $(this);
		obj.waypoint(function () {
			if (obj.attr("data-rendered") != "true") {
				obj.circleProgress({
					startAngle: -Math.PI / 2,
					emptyFill: "#ffffff",
					fill: { gradient: ['#cc0000', '#e84a27'], gradientAngle: 0 }
				})
				.on('circle-animation-progress', function (event, progress, stepValue) {
					$(this).find('.number').text(parseInt(100 * stepValue).toString() + "%");
				});
				obj.attr("data-rendered", "true");
			}
		}, { offset: "70%;" });

	});

	/* number counter animation */
	$('.counter').each(function() {
		var obj = $(this);
		var count = obj.attr('data-count');
		obj.text(0);
		obj.waypoint(function () {
			if (obj.attr("data-rendered") != "true") {
				$({Counter: 0}).animate({Counter: count}, {
				duration: 1000,
				easing: 'linear',
				step: function () {
					obj.text(Math.ceil(this.Counter).toLocaleString());
				},
				complete: function () {
					obj.text(this.Counter.toLocaleString());
				}
				});
				obj.attr("data-rendered", "true");
			}
		}, { offset: "85%;" });
	});


	// directory profile long list truncator
	if ($(".directory-profile").length > 0) {
		$(".directory-profile ul").each(function(uli) {
			thisul = $(this);
			if (thisul.find("li").length > 5) {
				thisul.find("li").each(function(lii) {
					if (lii >= 5) {
						$(this).addClass("d-none");
					}
				});
				thisul.after("<p class='text-center'><a href='#' class='profile_more_link button'>Click for more</a></p>");
			}
		});

		$(".directory-profile a.profile_more_link").click(function(e) {
			e.preventDefault();
			$(this).parent().prev().find("li").removeClass("d-none");
			$(this).parent().remove();
		});
	}

	// directory list icon fix
	$(".directory-list .contact .web").each(function(i) {
		var $a = $(this).find("ul a").first();
		if ($a.length > 0) {
			var url = $a.attr("href");
			var lbl = $a.html();
			var html = 	"<a href='" + url + "' title='Research group website'><span class='fa-stack fa-lg'><i class='fa fa-circle fa-stack-2x'></i><i class='fa fa-globe fa-stack-1x fa-inverse'></i></span></a>";
			$(this).html(html);
			$(this).removeClass("d-none");
		}
	});



	// generic form validator
	(function () {
		'use strict';
		window.addEventListener('load', function () {
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			var forms = document.getElementsByClassName('needs-validation');
			// Loop over them and prevent submission
			var validation = Array.prototype.filter.call(forms, function (form) {
				form.addEventListener('submit', function (event) {
					if (form.checkValidity() === false) {
						event.preventDefault();
						event.stopPropagation();
					}
					form.classList.add('was-validated');
				}, false);
			});
		}, false);
	})();

	/* add target=_blank to all links which start with http:// */
	$("body.site a[href^='http']:not([data-fancybox], [href*='/" + window.location.hostname + "'])").attr("target", "_blank");

	// update tabdropdown links on click event
	$(".tabdropdown a").on("click", function() {
		$(".tabdropdown a").removeClass("active");
		$(".tabdropdown a").attr("aria-selected", "false");
	});

	// insert aria-label based on title attribute for accessibility
	$('body.site a[title]:not([title=""])').each(function (){
		$(this).attr('aria-label', $(this).attr('title'));
	});

	$("body.site a").each(function () {
		let $a = $(this);
		let lbl = $a.attr("aria-label")
		if (!lbl) {
			$a.attr("aria-label", $a.text().replace('"', '\"'));
		}

		if ($a.attr("target")) {
			lbl = $a.attr("aria-label");
			$a.attr("aria-label", lbl + "; Link opens in new tab");
		}
	});

	/* bootstrap 5 migration */
	$("[data-toggle]:not([data-bs-toggle])").each(function (i) {
		$(this).attr("data-bs-toggle", $(this).attr("data-toggle"));
	});

	$("[data-target]:not([data-bs-target])").each(function (i) {
		$(this).attr("data-bs-target", $(this).attr("data-target"));
	});

	$("[data-parent]:not([data-bs-parent])").each(function (i) {
		$(this).attr("data-bs-parent", $(this).attr("data-parent"));
	});


	/* site search focus/blur handliers */
	$("#search-form input").focus(
		function (e) {
			$(this).parent().addClass("input-has-focus");
		}
	);

	$("#search-form input").blur(
		function (e) {
			$(this).parent().removeClass("input-has-focus");
		}
	);

	/* animate goto top action */
	$("#gototop").click(function (e) { $("html, body").animate({ scrollTop: "0" }); });

});




/* event handlers */


// isattop class handling on initial page load. remove isattop class if page loaded at scrollTop >= 150 position
if ($(window).scrollTop() >= 150) {
	$("body").removeClass("isattop");
}

// add or remove isattop class on scroll
$(window).scroll(function () {
	if ($(window).scrollTop() > 150) {
		$("body").removeClass("isattop");
	}
	else {
		$("body").addClass("isattop");
	}

	/* progress bar */
	var scrollBarWidth = $(window).scrollTop() / ($("body").height() - $(window).height()) * 100;
	$("body.scrollbar #scrollbar").css("width", scrollBarWidth + '%');



	/* goto top button */
	if ($(window).scrollTop() > 500) {
		$("#gototop").removeClass("hidden");
	}

	if ($(window).scrollTop() < 500) {
		$("#gototop").addClass("hidden");
	}
});





/* news center functions */

// only used on https://ihsi.dev.engr.illinois.edu/connect/news. we change that page and remove this block. --jjp 2024.02.01
function LoadMultimedia(pTile) {
	$(".tile[data-type=article]").remove();

	var search = $("#search_news").val();
/*
	var blogids = "";
	$(".multimedia.filter-list li.filter-list-on").each(function () {
		if (blogids != "") { blogids += ","; }
		blogids += $(this).attr("data-blogid");
	});
	var url = "/handlers/ajax-load-more-news.asp?blogids=" + blogids + "&search=" + search;
*/
	let filters = [];
	let bookids = [];
	let templateid = "";
	$(".multimedia.filter-list li.filter-list-on").each(function () {
		filters.push("filter:" + $(this).attr("data-filter-field") + "=" + $(this).attr("data-filter-value"));
		bookids.push($(this).attr("data-bookid"));
		templateid = $(this).attr("data-templateid");
	});

	if(bookids != undefined && templateid != undefined) {
		var url = bookslisturl + "?id=" + bookids.join(",") + "&template=" + templateid + "&return=6" + (filters.length > 0 ? "&" + filters.join("&") : "") + "&search=" + search;
	} else {
		var url = bookslisturl + "?id=299&template=233&return=6" + (filters.length > 0 ? "&" + filters.join("&") : "") + "&search=" + search;
	}


	if(bookids.length > 0) {
		$.post(url, function (data) {
			pTile.after(data);
		});
	}
}


function CalendarLocationLinks() {
	// replace locations containing urls with join online button
	$("p.location[data-link]").each(function (i) {
		if ($(this).attr("data-link").length > 0) {
			var link = $(this).attr("data-link");
			var title = $(this).attr("data-title");
			var html = $(this).html();
			html = html.replace(link, "");
			html = "<a href='" + $(this).attr("data-link") + "' class='button' title=\"Join " + title + " Online\">Join Online</a><br />" + html;
			$(this).html(html);
		}
	});

}

// not used.  commenting out.  --jjp 2024.02.01
/*
function LoadCalendarEvents(pTile, bAppend) {
	console.log("LoadCalendarEvents");
	console.log(pTile);
	var ArticleCount = pTile.find(".col").length;
	var search = $("#search_events").val();
	if (!search) { search = ""; }
	var calids = "";

	$(".calendar.filter-list li.filter-list-on").each(function () {
		if (calids != "") { calids += ","; }
		calids += $(this).attr("data-calid");
	});
	if (!bAppend) {
		ArticleCount = 0;
	}
	if (!$("body").hasClass("app_sitemanager")) {
		if (calids != "") {
			var url = "/handlers/ajax-load-more-events.asp?calid=" + calids + "&skip=" + ArticleCount + "&search=" + search;
			//console.log(url);
			$.post(url, function (data) {
				if (data.length < 10) {
					data = "<p>Currently, there are no planned upcoming alumni events. Please visit our full <a href='/news/calendars'>Calendar</a> for more events!</p>";
				}
				else {
					$data = $(data);
					$data.find("h3").remove();
					if (bAppend) {
						pTile.find(".row").first().append($data.find(".col"));
					}
					else {
						pTile.html($data);
					}
				}

				// replace locations containing urls with join online button
				CalendarLocationLinks();
			});
		}
	}
}
*/


function removeFund(x) {
	x.remove();

	total = 0.0;
	$("#cart .item input[name^='GIFT_AMOUNT']").each(function () {
		total += parseFloat($(this).val());
	});
	$("#total_donation").val(total);

	if (total <= 0.0) {
		$("#btn_submit").prop("disabled", true);
	}

	if ($("#cart .item[data-other='true']").length == 0) {
		$("#other_fund").prop("disabled", false);
		$("#other_fund_amount").prop("disabled", false);
		$("#add_other_fund").prop("disabled", false);
		$("#other_fund_alert").addClass("d-none");
	}
}



function modalControls(data) {
	$("body main").append("<div id='modal-overlay'><a href='#' id='modal-close' title='Close'><i class='fal fa-times'></i></a>");
	$("body main").append("<div id='modal-content'></div>");
	$("#modal-content").html(data)


	$("#modal-overlay, #modal-close").click(function (e) {
		$("#modal-content").remove();
		$("#modal-overlay").remove();
	});

}

function givingForm() {


	$("#modal-overlay, #modal-close").click(function (e) {
		$("#modal-content").remove();
		$("#modal-overlay").remove();
	});


	var fundI = 0;
	var total = 0.0;

	$("#options input[name=amount]").blur(function (e) {
		if (isNaN($(this).val())) {
			$(this).val("");
		}
		else {
			var val = parseFloat($(this).val());
			val = val.toFixed(2);
			$(this).val(val);
		}
	});

	$("#options input[type=button]").click(function (e) {
		fundI++;
		var template = $("#cart_item_template").html();
		var row = $(this).closest(".form-row");
		var amount = row.find("input[name=amount]").val();
		var fund = row.find("select[name=fund]").val();
		var name = row.find("select[name=fund] option:selected").text();
		var other = false;

		if (name == "") {
			name = row.find("input[name=fund]").val();
			fund = name;
			if (fund != "") { other = true; }
		}


		if (fund == "") {
			alert("You must select a fund.")
		}
		else if (isNaN(parseFloat(amount))) {
			alert("You must specify a valid dollar amount. Do not include the dollar sign.");
		}
		else if (parseFloat(amount) <= 0.0) {
			alert("You must enter a positive dollar amount.");
		} 
		else if (parseFloat(amount) < 5.0) {
			alert("You must enter at least $5 dollars. Do not include the dollar sign.");
		}
		else if (name == "") {
			alert("You must describe where you want your donation directed.");
		}
		else {
			if (other) {
				$("#other_fund").prop("disabled", true);
				$("#other_fund_amount").prop("disabled", true);
				$("#add_other_fund").prop("disabled", true);
				$("#other_fund_alert").removeClass("d-none");
			}

			template = template.split("[index]").join(fundI);
			template = template.split("[fund]").join(fund);
			template = template.split("[amount]").join(amount);
			template = template.split("[name]").join(name);
			template = template.split("[other]").join(other);
			$("#cart .item:first").before(template);

			row.find("input[type=text]").val("");
			row.find("select option:eq(0)").prop("selected", true);

			total = 0.0;
			$("#cart .item input[name^='GIFT_AMOUNT']").each(function () {
				total += parseFloat($(this).val());
			});
			$("#total_donation").val(total);

			if (total > 0.0) {
				$("#btn_submit").prop("disabled", false);
			}
		}

	});



}










function SearchCalendar() {
	var q = $("#calendar-search").val();
	var start = $("#calendar-search-start").val();
	var end = $("#calendar-search-end").val();

	var target = $("#" + $("#calendar-search").attr("data-target"));
	var mindate = new Date(target.attr("data-mindate"));
	var maxdate = new Date(target.attr("data-maxdate"));

	if (start == "") {
		start = (mindate.getMonth() + 1 ) + '/' + mindate.getDate() + '/' + mindate.getFullYear();
	}
	if (end == "") {
		end = (maxdate.getMonth() + 1) + '/' + maxdate.getDate() + '/' + maxdate.getFullYear();
	}

	var calendarId = target.attr("data-calendarid");
	var template = target.attr("data-template");

	var source = target.attr("data-source");
	if (!source) {
		source = "list";
	}
	if (source != "list" && source != "ical") {
		source = "list";
	}
	var calurl = wsurl + "/calendar/" + source + ".asp"


	$.get(calurl, { id: calendarId, template: template, mindate: start, maxdate: end, search: q, 'return': '1000' }, function (data) {
		target.parent().html(data); 
		CalendarLocationLinks();
	});


}

function PrevTerm(t, s) {
	if (t.length == 6 && Number.isInteger(parseInt(t))) {
		y = t.substring(1, 5)
		m = t.substring(5, 6)
	}
	else {
		d = new Date();
		y = d.getFullYear();
		m = d.getMonth();
	}
	if (m < 5) {
		return "1" + (parseInt(y) - 1) + "8"
	}
	else if (m < 8) {
		return "1" + y + "1"

	}
	else {
		return "1" + y + "5"
	}
}



function NextTerm(t) {
	if (t.length == 6 && Number.isInteger(parseInt(t))) {
		y = t.substring(1, 5)
		m = t.substring(5, 6)
	}
	else {
		d = new Date();
		y = d.getFullYear();
		m = d.getMonth();
	}

	if (m < 5) {
		return "1" + y + "5";
	}
	else if (m < 8) {
		return "1" + y + "8";
	}
	else {
		return "1" + (parseInt(y) + 1) + "1";
	}
}


function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}



function reducedMotionCheck() {
	if (motionQuery.matches) {
		for (i = 0; i < arrJarallaxObjects.length; i++) {
			arrJarallaxObjects[i].pause();
			$(".jarallax .jarallax-video-pause").removeClass('fa-pause');
			$(".jarallax .jarallax-video-pause").addClass('fa-play');
		}

	}
	else {
		for (i = 0; i < arrJarallaxObjects.length; i++) {
			arrJarallaxObjects[i].play();
			$(".jarallax .jarallax-video-pause").removeClass('fa-play');
			$(".jarallax .jarallax-video-pause").addClass('fa-pause');
		}
	}
}

function getYoutubeId(url) {
	if (url.length > 0) {
		let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
		return regex.exec(url)[3];
	}
	else {
		return "";
	}
}



//[data-sm-jarallax-video]
$(".jarallax").each(function (i) {
	var $j = $(this);
	var vsrc = $j.attr("data-sm-jarallax-video");
	var speed = $j.attr("data-speed");
	if (speed == "" || !speed) {
		speed = 0.5;
	}
	if (vsrc) {
		var videoId = getYoutubeId(vsrc);
		if ($j.css("background-image").length <= 4 && videoId.length >= 8) {
			$j.css("background-image", "url('https://img.youtube.com/vi/" + videoId & "/maxresdefault.jpg')");
		}
	}

	$j.jarallax({
		videoPlayOnlyVisible: false,
		videoLazyLoading: false,
		videoLoop: true,
		videoVolume: 0,
		videoSrc: vsrc,
		speed: speed,
		onCoverImage: function () {
			if (motionQuery.matches) {
				setTimeout(function () { reducedMotionCheck(); }, 300);
			}
		},
		onInit: function () {
			var self = this;
			var video = self.video;
			arrJarallaxObjects.push(video);

			if (video) {
				var $muteBtn = $('<button type="button" class="jarallax-video-pause fa-solid fa-pause" aria-hidden="true" tabindex="-1"><span class="sr-only">Play/Pause</span></button>');
				video.on('ready', function () {
					$(self.$item).append($muteBtn);
				});

//				video.on('started', function () {
//					setTimeout(function () { $muteBtn.attr("aria-hidden", "false"); }, 170);
//				});


				$muteBtn.on('click', function () {
					if ($(this).hasClass("fa-pause")) {
						video.pause();
						$muteBtn.removeClass('fa-pause');
						$muteBtn.addClass('fa-play');
					} else {
						video.play();
						$muteBtn.removeClass('fa-play');
						$muteBtn.addClass('fa-pause');
					}
//					setTimeout(function () { $muteBtn.attr("aria-hidden", "false"); }, 170);
				});
			}
		},
	});
});


motionQuery.addListener(reducedMotionCheck);




function decodeUrlEncodedString(urlEncodedString) {
	if (urlEncodedString) {
		// Split the string into key-value pairs.
		const pairs = urlEncodedString.split('&');

		// Create a new JavaScript object.
		const object = {};

		// Loop over the pairs and add each key-value pair to the object.
		for (const pair of pairs) {
			let [key, value] = pair.split('=');
			value = value.replace("%", "0");
			object[key] = decodeURIComponent(value);
		}
		// Return the object.
		return object;
	}
	else {
		return [];
	}
}
