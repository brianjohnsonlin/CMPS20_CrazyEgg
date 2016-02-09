game.PlayScreen = me.ScreenObject.extend({
	init: function(x,y,settings) {
		this.parent(x,y,settings);
	},
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// play the audio track
		
		// load a level depending on which level is clicked
		if(game.data.menuClickLevel1){
        	me.levelDirector.loadLevel("scene1");
        	me.audio.playTrack("area01");
        }
        else if(game.data.menuClickLevel2){
        	me.levelDirector.loadLevel("scene2");
        	me.audio.playTrack("area02");
        }
        else if(game.data.menuClickLevel3){
        	me.levelDirector.loadLevel("scene3");
        	me.audio.playTrack("area03");
        }
        else if(game.data.menuClickLevel4){
        	me.levelDirector.loadLevel("scene4");
        	me.audio.playTrack("area04");
        }else{
        	me.levelDirector.loadLevel("scene1");
        	me.audio.playTrack("area01");
        }
         
        // reset the score
        game.data.time = 0;
        
        //render hitbox
        me.debug.renderHitBox = true;

		// add our HUD to the game world
		this.HUD = new game.HUD.TurnOnLight();
		me.game.world.addChild(this.HUD);
		// add the object at pos (10,10), z index 4
		
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
		
		// stop the current audio track
    	me.audio.stopTrack();
	}
});

// create a basic GUI Object for pauseButton
var pauseButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "pauseButton";
      settings.spritewidth = 64;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
	
   // output something in the console
   // when the object is clicked
   onClick:function(event)
   {
   		if(game.data.gamePaused === false){
		   	me.game.add((new pauseImage(370,64)),10);
		   	me.game.add((new restartButton(550,214)),Infinity);
		   	me.game.add((new backButton(550,414)),Infinity);
		   	me.game.add((new menuButton(550,314)),Infinity);
		   	me.state.pause();
			game.data.gamePaused = true;
			game.data.back = false;
			
		    var resume_loop = setInterval(function check_resume() {
		        if (game.data.back === true) {
		            clearInterval(resume_loop);
		            me.state.resume();
		            game.data.pause = false;
		            game.data.back = false;
		            game.data.gamePaused = false;
		        }else me.state.pause();
		        if (game.data.restart === true){
		        	clearInterval(resume_loop);
		        	me.state.resume();
		        	me.game.viewport.fadeIn("#FFFFFF", "250",
						function(){
							me.levelDirector.loadLevel(me.levelDirector.getCurrentLevelId());
							me.game.viewport.fadeOut("#FFFFFF", "250");
						}
					);
		        	game.data.pause = false;
		        	game.data.restart = false;
		        	game.data.gamePaused = false;
		        }
		        if (game.data.menu === true) {
		        	clearInterval(resume_loop);
		        	me.state.resume();
		        	me.state.change(me.state.MENU);
		        	game.data.pause = false;
		        	game.data.menu = false;
		        	game.data.gamePaused = false;
		        	
		        }
		    }, 0);
		}
	   // don't propagate the event
	   return false;
   }
});

var pauseImage = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "pause_menu";
      settings.spritewidth = 512;
      settings.spriteheight = 512;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   update: function()
   {
   		if(game.data.backDestroy == true  && me.state.isRunning() === true)
   		{
   			me.game.world.removeChild(this);
   		}	
   }
   
});

var restartButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "restartButton";
      settings.spritewidth = 160;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   update: function()
   {
   		if(game.data.backDestroy == true && me.state.isRunning() === true)
   		{
   			me.game.world.removeChild(this);
   		}	
   },
      
   onClick: function(event)
   {
   		game.data.restart = true;
   }
});

var backButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "backButton";
      settings.spritewidth = 160;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   onClick: function(event)
   {
   		game.data.back = true;	
   		game.data.backDestroy = true;
   		me.game.world.removeChild(this);
   },
   
   update: function()
   {
   		if(game.data.backDestroy == true && me.state.isRunning() === true)
   		{
   			me.game.world.removeChild(this);
   		}	
   }
});

var menuButton = me.GUI_Object.extend(
{	
   init:function(x, y)
   {
      settings = {}
      settings.image = "menuButton";
      settings.spritewidth = 160;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   onClick: function(event)
   {
   		game.data.menu = true;	
   },
   
   update: function()
   {
   		if(game.data.backDestroy === true && me.state.isRunning() === true)
   		{
   			me.game.world.removeChild(this);
   		}	
   }
});