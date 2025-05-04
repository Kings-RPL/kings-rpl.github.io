( function( $ ){
    //mean menu overrides
      $(".main-navigation").meanmenu({ "meanScreenWidth": 700, "meanMenuContainer": "#mean-container", "meanMenuOpen": "Menu" });
      

       // since our menu is right-aligned, if we hover over an li element and it has a 
       // sub-menu and if that sub-menu would extend past the right-hand edge of the 
       // screen, then we want to add a CSS class which will keep the sub-menu on screen.
       
       var selector = ".main-navigation .menu > li";
       $(selector).on("mouseenter mouseleave", function(event) {
              /*! from: http://stackoverflow.com/a/11525189 */
              
              if (!$(this).hasClass("edge") && $('ul', this).length) {
                     var elm = $('ul:first', this);
                     var off = elm.offset();
                     var l = off.left;
                     var w = elm.width();
                     var docH = $("body").height();
                     var docW = $("body").width();
              
                     var isEntirelyVisible = (l + w <= docW);
              
                     if (!isEntirelyVisible) {
                           $(this).addClass('edge');
                     } else {
                           $(this).removeClass('edge');
                     }
              }             
       });
       
       // if the screen is resized, then we need to reset any elements that we altered above.
       // this is because the new width of the screen might allow a sub-menu to remain on-
       // screen without our modifications.  we use a very basic debouncing container here to
       // avoid executing this code continuously as the screen is resized.
       
       var resizeTimer = false;
       $(window).on("resize", function(event) {
              if(resizeTimer) clearTimeout(resizeTimer);
              resizeTimer = setTimeout(function() {
                     $(selector).removeClass("edge");  
              }, 250);
       });


})(jQuery);