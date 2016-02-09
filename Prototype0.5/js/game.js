/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		time : 0,
		globals : [true, false],
		clicks : 0
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
	   	
	   	// set the "Play/Ingame" Screen Object
	   	me.state.set(me.state.PLAY, new game.PlayScreen());
	     
	   	// add our object entities in the entity pool
		me.entityPool.add("mainPlayer", game.PlayerEntity);
		me.entityPool.add("DangerEntity", game.DangerEntity);
		me.entityPool.add("SwitchEntity", game.SwitchEntity);
		me.entityPool.add("FlipEntity", game.FlipEntity);
		me.entityPool.add("CartonEntity", game.CartonEntity);
		me.entityPool.add("BreakingPlatformEntity", game.BreakingPlatformEntity);
		
	   	// enable the keyboard
	   	me.input.bindKey(me.input.KEY.SPACE, "click", true);
	   	me.input.bindTouch(me.input.KEY.SPACE);
	   	me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
	   	//me.input.bindKey(me.input.KEY.A, "speed");

		// Start the game.
		me.state.change(me.state.PLAY);
	},

	mouseIsOver : function (objectA) {
		if(me.input.mouse.pos.x >= objectA.pos.x &&
		   me.input.mouse.pos.x <= objectA.pos.x + objectA.width &&
		   me.input.mouse.pos.y >= objectA.pos.y &&
		   me.input.mouse.pos.y <= objectA.pos.y + objectA.height) return true;
		return false;
	}
};