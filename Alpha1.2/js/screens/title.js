game.TitleScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// play the audio track
    	//me.audio.playTrack("DST-InertExponent");
		
		// load a level
        me.levelDirector.loadLevel("main_menu");
        this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		me.audio.playTrack("melody");
     	me.game.add((new levelButton(130,150)), 10);
     	me.game.add((new instructionButton(195,250)), 10);
     	game.data.titleSwitch = false;
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

var levelButton = me.GUI_Object.extend(
{
	clickOnceFlag: false,
	init:function(x, y)
   {
      settings = {}
      settings.image = "levelButton";
      settings.spritewidth = 288;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   onClick: function(event)
   {
   		if(this.clickOnceFlag === false)
   		{
   			me.game.add((new chooseLevelBG(550,65)), 10);
   			me.game.add((new chooseLevel1(750,120)), 11);
   			this.clickOnceFlag = true;
   			game.data.reclickLevel = false;
   		}
   		else if(this.clickOnceFlag === true)
   		{
   			me.game.add((new chooseLevelBG(550,65)), 10);
   			me.game.add((new chooseLevel1(750,120)), 11);
   			game.data.reclickLevel = true;
   			this.clickOnceFlag = false;
   		}
   },
   
   update: function()
   {
	   	if(game.data.titleSwitch === true)
	   	{
	   		me.game.world.removeChild(this);
	   	}
   }
});

var clickEverywhere = me.GUI_Object.extend(
{	
	init:function(x, y)
   {
      settings = {}
      settings.image = "clickEverywhere";
      settings.spritewidth = 400;
      settings.spriteheight = 130;
      // parent constructor
      this.parent(x, y, settings);
   },
});

var instructionButton = me.GUI_Object.extend(
{
	everywhereClick : false,
	init:function(x, y)
   {
      settings = {}
      settings.image = "instructionButton";
      settings.spritewidth = 288;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   update: function()
   {
	   	if(game.data.titleSwitch === true)
	   	{
	   		me.game.world.removeChild(this);
	   	}
   },
   
   onClick: function()
   {
   		me.audio.play("clickeverywhere");
   		me.game.add((new clickEverywhere(10,420)), 11);
   }
});

var chooseLevelBG = me.GUI_Object.extend(
{
	init:function(x, y)
   {
      settings = {}
      settings.image = "chooseLevelBG";
      settings.spritewidth = 608;
      settings.spriteheight = 500;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   update: function()
   {
	   	if(game.data.reclickLevel === true || game.data.titleSwitch === true)
	   	{
	   		me.game.world.removeChild(this);
	   	}
   }
});

var chooseLevel1 = me.GUI_Object.extend(
{
	init:function(x, y)
   {
      settings = {}
      settings.image = "chooseLevel1";
      settings.spritewidth = 192;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   onClick: function(event)
   {
   		me.state.change(me.state.PLAY);
   		game.data.titleSwitch = true;	
   		game.data.reclickLevel = true;
   },
   
   update: function()
   {
   		if(game.data.reclickLevel === true)
   		{
   			me.game.world.removeChild(this);
   		}
   }
});
