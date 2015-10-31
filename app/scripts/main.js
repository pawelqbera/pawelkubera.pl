;(function($) {
	'use strict';

	var $document = $(document);
	
	var APP = function(){
		this.$window = $(window);
		this.$body = $(document.body);
		this.$section = this.$body.find('section');
		this.$pageWrap = this.$body.find('.page-wrap');
		this.$sectionNav = this.$body.find('.section-nav');
		this.$anchor = this.$body.find('.anchor');
		this.$sectionNavAnchor = this.$body.find('.section-nav a');
		this.$navAnchor = this.$body.find('.nav a');
		this.$menuBurger = this.$body.find('.menu-burger');
		this.$headerNav = this.$body.find('header nav');

		this.defaultHash = '#home';
		this.translateY = 0;
	};

	APP.prototype = {

		start: function() {			
			this.updateHeights();
			this.setHash();
			this.bindEvents();
		},

		bindEvents: function() {
			var self = this;
			
			/**
			*  Update heights variables on orientation change on mobile devices 
			*/
			this.$window.on('orientationchange', function() {
				self.updateHeights();
			}, false);

			/**
			*  Update heights variables on browser's window size change
			*/
			this.$window.on('resize', function() {
				self.updateHeights();
			}, false);

			/**
			*  Handles keydown events that allow site's navigation: arrow up/down,
			*  page up/down, end and home
			*/
			this.$window.keydown(function(event) {
				var upKeys = [40,34,32,9],
					downKeys = [38,33],
					homeEndKeys = [36,35],
					$current = $('.current');
				
				if($.inArray(event.which, upKeys.concat(downKeys, homeEndKeys)) !== -1) {
					event.preventDefault();
					self.headerNavMobileHide();
				} else {
					return true;
				}

				if($.inArray(event.which, upKeys) !== -1 && self.translateY * -1 < self.pageWrapHeight - self.windowHeight) {
					self.changeHash($current.next());
				} else if ($.inArray(event.which, downKeys) !== -1 && self.translateY < 0) {
					self.changeHash($current.prev());
				} else if (event.which === homeEndKeys[0]) {
					self.changeHash(self.$section.first());
				} else if (event.which === homeEndKeys[1]) {
					self.changeHash(self.$section.last());
				}
			});

			/**
			*  Handles mousewheel events that allow site's navigation
			*/
			this.$window.on('mousewheel', function(event) {
				var $current = $('.current');
				if(event.deltaY < 0 && self.translateY * -1 < self.pageWrapHeight - self.windowHeight) {
					self.changeHash($current.next());
					self.headerNavMobileHide();
				} else if (event.deltaY > 0 && self.translateY < 0){
					self.changeHash($current.prev());
					self.headerNavMobileHide();
				}
			});

			/**
			*  Prevents wheel button click default action in Chrome
			*/
			this.$window.on('click', function(event) { 
				if( event.which == 2 ) {
					event.preventDefault();
				}
			});			

			/**
			*  Handles every single anchor click event
			*  of all navs
			*/
			this.$anchor.on('click', function(event) {
				event.preventDefault();
				self.changeHash(this);
				self.headerNavMobileHide();
			});

			/** 
			*  Adding popstate event listener to handle browser back button
			*/  
			this.$window.on("popstate", function(event) {
				self.onHashChange();
			});

			/**
			*  Prevents wheel button click default action in Chrome
			*/
			this.$menuBurger.on('click', function(event) { 
				event.preventDefault();
				//Jeżeli menu burger jest w mobile to rób toggle menu
				if ($('body').width() < 768) {
					if ( self.$headerNav.hasClass("isDown") ) {
						self.$headerNav.animate({
							width: "100%",
							opacity: "1",
						}, 200).show();                            
					} else {
						self.$headerNav.animate({
							width:"0",
							opacity: "0"
						}, 200);
					}
					self.$headerNav.toggleClass("isDown");
					return false;
				} else {
					self.changeHash(this);					
				}
			});
		},

		/**
		*  Hide main header navigation
		*/
		headerNavMobileHide: function() {
			if ($('body').width() >= 768) {
				return false;
			} else {
				this.$headerNav.animate({
							width:"0",
							opacity: "0"
						}, 200)
				.toggleClass("isDown");
			}
		},

		/**
		*  Sets correct location href on document ready
		*  and eliminate incorrect requests
		*/
		setHash: function() {
			var hash = window.location.hash,
				pagesObj = this.$navAnchor.map(function() {
  					return $(this).attr("href");
				}).get();
			// Reset window position at start
			window.scrollTo(0,0);
			// Set the default hash in case the requested one doesn't
			// exist
			if (hash === pagesObj[0] || pagesObj.indexOf(hash) === -1) {
				window.location.hash = this.defaultHash;
			} else if (pagesObj.indexOf(hash) > -1) {
				this.onHashChange();
			}
		},

		/**
		*  Assigns actual height values to variables
		*/	
		updateHeights: function() {	
			this.setWindowHeight();
			this.setSectionNavMargin();
		},

		/**
		*  Sets a browser's window height value for each section
		*/	
		setWindowHeight: function() {
			var self = this;			
			this.windowHeight = this.$window.height();
			this.$section.each(function(){				
				var target = $(this);
				target.height(self.windowHeight);
			});
			this.pageWrapHeight = this.$pageWrap.height();
			return this.pageWrapHeight;
		},

		/**
		*  Sets a proper CSS margin-top value of our menu on scrollwheel 
		*/
		setSectionNavMargin: function() {
			this.sectionNavHeight = this.$sectionNav.height();
			this.$sectionNav.css({'margin-top': '( -' + this.sectionNavHeight + ' / 2)'});
		},

		/**
		*  Handles hash changing on user interface events
		*/
		changeHash: function(target) {
			this.target = target.href || '#' + target.attr('data-anchor');		
			var hash = this.target.substring(this.target.indexOf('#'));
			this.addHistory(hash);
			this.onHashChange();
		},

		/**
		*  Invokes functions that handle the visual aspect of 
		*  the hashchange event
		*/
		onHashChange: function() {
			var hash = window.location.hash || this.defaultHash;
			$('.current').removeClass('current');
			$(hash).addClass('current');
			this.setActiveNavAnchors(hash);	
			this.animateToCurrentSection(hash);
		},

		/**
		*  Handles the correct class toggling of all navigation 
		*  anchors and buttons whenever the hashchange event occurs
		*/
		setActiveNavAnchors: function(hash) {
			this.$navAnchor.parents('li').removeClass('active');
			$('.nav a[href="' + hash + '"]').parents('li').addClass('active');
			this.$sectionNavAnchor.children('span').removeClass('point-active');
			$('.section-nav a[href="' + hash + '"]').children('span').addClass('point-active');
			this.$body.removeClass().addClass((hash).replace('#',''));			
		},

		/**
		*  Displays the requested page content whenever
		*  the hashchange event occurs
		*/
		animateToCurrentSection: function(hash) {
			var self = this;
			this.hash = hash;
			this.index = $(this.hash).index();
			this.translateY = this.index * this.windowHeight * -1;			
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {		
				self.$pageWrap.css({transform: 'translateY(' + self.translateY + 'px)'});		
			}, 250));
		},

		/**
		*  Handles the browser history by adding correct entries
		*  whenever the hashchange event occurs
		*/
		addHistory: function(url) {			
			// Add History Entry using pushState
			history.pushState(null, null, url);
		}
	};

	/**
	*  Instantiate new APP and kick off the application
	*/
	$document.ready(function() {
		var app = new APP();
		app.start();
	});	

})(jQuery);