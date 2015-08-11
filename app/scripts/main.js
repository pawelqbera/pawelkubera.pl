$(document).ready(function () {
	'use strict';
	var hash = null;
	var windowHeight = null;
	var translateY = 0;
	var pageWrapHeight = null;
	var sectionNavHeight = null;

	resetHash();
	updateHeights();
	drawHeaderCanvas();

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
	*  Handles keydown events that allow site's navigation: arrow up/down,
	*  page up/down, end and home
	*/	
	$(window).keydown(function(event) {	   	
	   	var arr = [40,34,32,9];
	   	if($.inArray(event.which, arr) !== -1) {
			event.preventDefault();
		   	if(translateY * -1 < (pageWrapHeight - windowHeight)){	    	 		
		    	translateY -= windowHeight;
		   		$('.current').next().addClass('current').prev().removeClass('current');
		   	}
	   	} else if (event.which === 38 || event.which === 33){
	    	event.preventDefault();		
	   		if (translateY < 0){
	   			translateY += windowHeight;
				$('.current').prev().addClass('current').next().removeClass('current');	   	
	   		}
	   	}
	   	hash = $('.current').attr("data-anchor");
		$(".page-wrap").css({transform: 'translateY(' + translateY + 'px)'});			
		history.pushState(null, null, '#' + hash);		
		return onHashChange();
	});

	/**
	*  Handles the mousewheel event and scroll up/down the sections
	*/
	$(window).on('mousewheel', function(event) {	
		clearTimeout($.data(this, 'scrollTimer'));	
		$.data(this, 'scrollTimer', setTimeout(function() {
	   		if(event.deltaY < 0 && translateY * -1 < (pageWrapHeight - windowHeight)){
	    		translateY -= windowHeight;
	   			$('.current').next().addClass('current').prev().removeClass('current');
	   		}else if (event.deltaY > 0 && translateY < 0){
	   			translateY += windowHeight;
				$('.current').prev().addClass('current').next().removeClass('current');
	   		}
	   		hash = $('.current').attr("data-anchor");
			$(".page-wrap").css({transform: 'translateY(' + translateY + 'px)'});			
			history.pushState(null, null, '#' + hash);		
			return onHashChange();
		}, 250));
	});

	$(window).on('hashchange', function(event) {
		if(window.location.hash !== "") {
			onHashChange();
		}
	});

	/**
	*  Handles the 
	*/
	$('.section-nav a').click(function(event){
		event.preventDefault();
		var target = $(this);		
		onNavAnchorClick(target);
	});

	/**
	*  Handles the 
	*/
	$('.nav a').click(function(event){
		event.preventDefault();
		var target = $(this);
		onNavAnchorClick(target);
	});


	function drawHeaderCanvas() {
	  var headerCanvas = document.getElementById('header-canvas');
	  if (headerCanvas.getContext) {
	    var ctx = headerCanvas.getContext('2d');
	    headerCanvas.height = windowHeight;
	   
	    var triangle = new Path2D();
	    triangle.moveTo(0, 300);
	    triangle.lineTo(240, 0);
	    triangle.lineTo(0, windowHeight);
	    
	    ctx.fillStyle = "#2475c0";
	    ctx.fill(triangle);
	  }
	}

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

	function onHashChange() {
		$('.nav a').parents('li').removeClass('active');
		$('.nav a[href="' + window.location.hash + '"]').parents('li').addClass('active');
		$('.section-nav a').children('span').removeClass('point-active');
		$('.section-nav a[href="' + window.location.hash + '"]').children('span').addClass('point-active');
	}

	function resetHash() {
		window.location.href = "#home";
		history.pushState(null, null, window.location.pathname);
	}

	function onNavAnchorClick(target) {
		var targetSectionAnchor = $(target).attr("href").replace('#','');
		var index = $('#' + targetSectionAnchor).index();
		translateY = index * windowHeight * -1;
		$(".page-wrap").css({transform: 'translateY(' + translateY + 'px)'});
		$('.current').removeClass('current');
		$('#' + targetSectionAnchor).addClass('current');
		history.pushState(null, null, '#' + targetSectionAnchor);
		return onHashChange();		
	}

});