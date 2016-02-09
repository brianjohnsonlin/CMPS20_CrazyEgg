/**
 * a HUD container and child items
 */
 
game.HUD = game.HUD || {};
 
  
game.HUD.Container = me.ObjectContainer.extend({
 
    init: function() {
        // call the constructor
        this.parent();
         
        // persistent across level change
        this.isPersistent = true;
         
        // non collidable
        this.collidable = false;
         
        // make sure our object is always draw first
        this.z = Infinity;
 
        // give a name
        this.name = "HUD";
         
        // add our child score object at the right-bottom position
        //this.addChild(new game.HUD.ChooseLevel(180, 150));
    }
});

game.HUD.TurnOnLight = me.ObjectContainer.extend({
 
    init: function() {
        // call the constructor
        this.parent();
         
        // persistent across level change
        this.isPersistent = true;
         
        // non collidable
        this.collidable = false;
         
        // make sure our object is always draw first
        this.z = Infinity;
 
        // give a name
        this.name = "HUD.TurnOnLight";
         
        // add our child score object at the right-bottom position
        //this.addChild(new game.HUD.Light(180, 500));
    }
});

game.HUD.Light = me.Renderable.extend( {    
     
    //constructor
    init: function(x, y) {
         
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10); 
         
        // create a font
        //this.font = new me.BitmapFont("32x32_font", 32);
        this.font = new me.Font("Verdana", 32, "white");
 
        // make sure we use screen coordinates
        this.floating = true;
    },

    //draw the score
    draw : function (context) {
        this.font.draw (context, "TURN ON THE LIGHT TO START", this.pos.x, this.pos.y);
    }
});

/* 
 * a basic HUD item to display score
 */
game.HUD.ChooseLevel = me.Renderable.extend( {    
     
    //constructor
    init: function(x, y) {
         
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10); 
         
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);         
 
        // make sure we use screen coordinates
        this.floating = true;
    },
     
    
    //update function
    update : function () {
 		
    },

    //draw the score
    draw : function (context) {
        this.font.draw (context, "CHOOSE LEVEL", this.pos.x, this.pos.y);
    }
});