/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		globals : [],
		buttonGlobals : [],
		buttonLink: null,
		pause : false,
		back : false,
		backDestroy: false,
		restart : false,
		main : false,
		gamePaused : false,
		titleSwitch : false,
		reclickLevel: false,
		menuClickLevel1: false,
		menuClickLevel2: false,
		menuClickLevel3: false,
		menuClickLevel4: false,
	},
	
	// Run on page load.
	"onload" : function () {
		//me.sys.fps = 30;
		me.sys.interpolation = true;
		//me.sys.pauseOnBlur = false;
		me.sys.preRender = true;
		// Initialize the video.
		if (!me.video.init("screen", 1280, 640, true, "auto")) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}
		// Initialize the audio.
		me.audio.init("mp3,ogg");
		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);
		// Load the resources.
		me.loader.preload(game.resources);
		// Initialize melonJS and display a loading screen.
		me.state.set(me.state.LOADING, new game.myLoadingScreen);
		me.state.change(me.state.LOADING);
	},

	// Run on game resources loaded.
	"loaded" : function () {
		// set the "Play/Ingame" Screen Object
	   	me.state.set(me.state.MENU, new game.TitleScreen());
	   	me.state.set(me.state.PLAY, new game.PlayScreen());
	     
	   	// add our object entities in the entity pool
		me.entityPool.add("Eggy", game.PlayerEntity);
		me.entityPool.add("OneClickEntity", game.OneClickEntity);
		me.entityPool.add("MultiStateEntity", game.MultiStateEntity);
		me.entityPool.add("OnOffEntity", game.OnOffEntity);
		me.entityPool.add("ManyClickEntity", game.ManyClickEntity);
		me.entityPool.add("RevertEntity", game.RevertEntity);
		me.entityPool.add("ButtonEntity", game.ButtonEntity);
		me.entityPool.add("PipeEntity", game.PipeEntity);
		me.entityPool.add("SpongeEntity", game.SpongeEntity);
		me.entityPool.add("RatEntity", game.RatEntity);
		
		
	   	// enable the keyboard
	   	me.input.bindKey(me.input.KEY.SPACE, "click", true);
	   	me.input.bindTouch(me.input.KEY.SPACE);
	   	me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);

		// Start the game.
		me.state.change(me.state.MENU);
	},

	mouseIsOver : function (obj) {
		if(me.input.mouse.pos.x >= obj.collisionBox.left &&
		   me.input.mouse.pos.x <= obj.collisionBox.right &&
		   me.input.mouse.pos.y >= obj.collisionBox.top &&
		   me.input.mouse.pos.y <= obj.collisionBox.bottom) return true;
		return false;
	},
	 
	myLoadingScreen: me.ScreenObject.extend({
	    /*---
	    
	        constructor
	        
	        ---*/
	    init: function () {
	        this.parent(true);
	
	        // flag to know if we need to refresh the display
	        this.invalidate = false;
	
	        // handle for the susbcribe function
	        this.handle = null;
	
	    },
	
	    // call when the loader is resetted
	    onResetEvent: function () {
	        // melonJS logo
	        this.logo1 = new me.Font('impact', 32, 'white', 'middle');
	        this.logo1.textBaseline = "alphabetic";
	
	        // setup a callback
	        this.handle = me.event.subscribe(me.event.LOADER_PROGRESS, this.onProgressUpdate.bind(this));
	
	        // load progress in percent
	        this.loadPercent = 0;
	    },
	
	    // destroy object at end of loading
	    onDestroyEvent: function () {
	        // "nullify" all fonts
	        this.logo1 = null;
	        // cancel the callback
	        if (this.handle) {
	            me.event.unsubscribe(this.handle);
	            this.handle = null;
	        }
	    },
	
	    // make sure the screen is refreshed every frame 
	    onProgressUpdate: function (progress) {
	        this.loadPercent = progress;
	        this.invalidate = true;
	    },
	
	    // make sure the screen is refreshed every frame 
	    update: function () {
	        if (this.invalidate === true) {
	            // clear the flag
	            this.invalidate = false;
	            // and return true
	            return true;
	        }
	        // else return false
	        return false;
	    },
	
	    /*---
	    
	        draw function
	      ---*/
	
	    draw: function (context) {
			// text
			var text = "loading...";
			
	        // measure the logo size
	        var logo1_width = this.logo1.measureText(context, text).width;
	        var xpos = (me.video.getWidth() - logo1_width)/2;
	        var ypos = me.video.getHeight() / 2;
	
	        // clear surface
	        me.video.clearSurface(context, "black");
	
	        // draw the melonJS logo
	        this.logo1.draw(context, text, xpos, ypos);
	        xpos += logo1_width;
	
	        ypos += this.logo1.measureText(context, text).height / 2;
	
	        // display a progressive loading bar
	        var progress = Math.floor(this.loadPercent * 300);
	
	        // draw the progress bar
	        context.strokeStyle = "silver";
	        context.strokeRect((me.video.getWidth()/2) - 150, ypos, 300, 6);
	        context.fillStyle = "#89b002";
	        context.fillRect((me.video.getWidth() / 2) - 148, ypos + 2, progress - 4, 2);
	    }
	
	})
};