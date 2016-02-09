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
     	me.game.add((new playButton(200,50)), 10);
     	me.game.add((new levelButton(200,150)), 10);
     	me.game.add((new instructionButton(200,250)), 10);
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
      settings.spritewidth = 160;
      settings.spriteheight = 64;
      // parent constructor
      this.parent(x, y, settings);
   },
   
   onClick: function(event)
   {
   		if(this.clickOnceFlag === false)
   		{
   			me.game.add((new chooseLevelBG(550,65)), 10);
   			me.game.add((new chooseLevel1(750,200)), 11);
   			me.game.add((new chooseLevel2(750,280)), 11);
   			me.game.add((new chooseLevel3(750,360)), 11);
   			me.game.add((new chooseLevel4(750,440)), 11);
   			this.clickOnceFlag = true;
   			game.data.reclickLevel = false;
   		}
   		else if(this.clickOnceFlag === true)
   		{
   			me.game.add((new chooseLevelBG(550,65)), 10);
   			me.game.add((new chooseLevel1(790,200)), 11);
   			me.game.add((new chooseLevel2(790,280)), 11);
   			me.game.add((new chooseLevel3(790,360)), 11);
   			me.game.add((new chooseLevel4(790,440)), 11);
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
      settings.spriteheight = 150;
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
      settings.spritewidth = 160;
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

var playButton = me.GUI_Object.extend(
{
	everywhereClick : false,
	init:function(x, y)
   {
      settings = {}
      settings.image = "playButton";
      settings.spritewidth = 160;
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
   		me.state.change(me.state.PLAY);
   		game.data.titleSwitch = true;	
   		game.data.reclickLevel = true;
   		game.data.menuClickLevel2 = false;
   		game.data.menuClickLevel3 = false;
   		game.data.menuClickLevel4 = false;
   		game.data.menuClickLevel1 = false;
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
   		game.data.menuClickLevel2 = false;
   		game.data.menuClickLevel3 = false;
   		game.data.menuClickLevel4 = false;
   		game.data.menuClickLevel1 = true;
   },
   
   update: function()
   {
   		if(game.data.reclickLevel === true)
   		{
   			me.game.world.removeChild(this);
   		}
   }
});

var chooseLevel2 = me.GUI_Object.extend(
{
	init:function(x, y)
   {
      settings = {}
      settings.image = "chooseLevel2";
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
   		game.data.menuClickLevel1 = false;
   		game.data.menuClickLevel3 = false;
   		game.data.menuClickLevel4 = false;
   		game.data.menuClickLevel2 = true;
   },
   
   update: function()
   {
   		if(game.data.reclickLevel === true)
   		{
   			me.game.world.removeChild(this);
   		}
   }
});

var chooseLevel3 = me.GUI_Object.extend(
{
	init:function(x, y)
   {
      settings = {}
      settings.image = "chooseLevel3";
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
   		game.data.menuClickLevel1 = false;
   		game.data.menuClickLevel2 = false;
   		game.data.menuClickLevel4 = false;
   		game.data.menuClickLevel3 = true;   		
   },
   
   update: function()
   {
   		if(game.data.reclickLevel === true)
   		{
   			me.game.world.removeChild(this);
   		}
   }
});

var chooseLevel4 = me.GUI_Object.extend(
{
	init:function(x, y)
   {
      settings = {}
      settings.image = "chooseLevel4";
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
   		game.data.menuClickLevel1 = false;
   		game.data.menuClickLevel2 = false;
   		game.data.menuClickLevel3 = false;
   		game.data.menuClickLevel4 = true;     		
   },
   
   update: function()
   {
   		if(game.data.reclickLevel === true)
   		{
   			me.game.world.removeChild(this);
   		}
   }
});