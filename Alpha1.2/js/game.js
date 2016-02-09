/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		globals : [],
		pause : false,
		back : false,
		backDestroy: false,
		restart : false,
		main : false,
		gamePaused : false,
		titleSwitch : false,
		reclickLevel: false,
	},
	
	// Run on page load.
	"onload" : function () {
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
		
		me.entityPool.add("ChooseLevel", game.ChooseLevel);
		me.entityPool.add("PauseEntity", game.PauseEntity);
		me.entityPool.add("PauseButton", game.PauseButton);
		me.entityPool.add("Restart", game.Restart);
		me.entityPool.add("BackButton", game.BackButton);
		me.entityPool.add("fallingObject", game.fallingObject);
		me.entityPool.add("vanish", game.vanish);
		
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
	}
};