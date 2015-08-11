$(document).ready(function () {
	'use strict';
	
	var windowHeight = null;
	var translateY = 0;
	var pageWrapHeight = null;
	var sectionNavHeight = null;

	updateHeights();

	/**
	*  Update heights variables on orientation change on mobile devices 
	*/
	$(window).on('orientationchange', function() {
		updateHeights();
	}, false);

	/**
	*  Update heights variables on browser's window size change
	*/
	$(window).on('resize', function() {
		updateHeights();
	}, false);	

	/**
	*  Sets active link in Bootstrap menu on hash change
	*/
	$(window).on('hashchange', function(e) {
		$('.nav a').parents('li').removeClass('active');
		$('.nav a[href="' + this.location.hash + '"]').parents('li').addClass('active');
		$('.section-nav a').children('span').removeClass('point-active');
		$('.section-nav a[href="' + this.location.hash + '"]').children('span').addClass('point-active');		
	});

	/**
	*  Handles the mousewheel event and scroll up/down the sections
	*/
	$(document).mousewheel(function(event) { 
		var hash = null;

   		if(event.deltaY < 0 && translateY * -1 < (pageWrapHeight - windowHeight)){
		    translateY -= windowHeight;		
			$('.current').next().addClass('current').prev().removeClass('current');
   			hash = $('.current').attr("id");
   			//window.location.hash = hash;		
   		}else if (event.deltaY > 0 && translateY < 0){
   			translateY += windowHeight;
			$('.current').prev().addClass('current').next().removeClass('current');
   			hash = $('.current').attr("id");
   			window.location.hash = hash;   			
   		}
   		$(".page-wrap").css({transform: 'translateY(' + translateY + 'px)'});
	});	

	/**
	*  Sets a browser's window height value for each section
	*/	
	function setWindowHeight() {
		$("section").each(function(){
			var $this = $(this);
			$this.height(windowHeight);
		});
	}

	function setSectionNavMargin() {
		sectionNavHeight = $('.section-nav').height();
		$('.section-nav').css({"margin-top": "( -" + sectionNavHeight + " / 2)"});
	}

	/**
	*  Assigns actual height values to variables
	*/	
	function updateHeights() {
		windowHeight = $(window).height();
		setWindowHeight();
		pageWrapHeight = $(".page-wrap").height();
		setSectionNavMargin();	
	}

});