/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(1, 15);
        this.setMaxVelocity(10,15);
        
        // adjust the bounding box
    	//this.updateColRect(0, 32, -1, 0);
    	
    	//animation stuff
    	this.renderable.addAnimation("roll",[0,1,2,3,4,5,6,7],90);
    	this.renderable.addAnimation("speed",[0,1,2,3,4,5,6,7],45);
    	this.renderable.addAnimation("still",[0,1,2,3,4,5,6,7],9999999);
    	this.renderable.setCurrentAnimation("roll");
    	
    	//this.gravity = -0.1;
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        game.data.time = 0;
 
    },
    
    update: function() {
    	game.data.time++;
	 	this.gravity = 1;
    	this.vel.x += this.accel.x * me.timer.tick;
        if (me.input.isKeyPressed('stop')){
        	this.vel.x = 0;
       		if(!this.renderable.isCurrentAnimation("still")){
       			var currFrame = this.renderable.getCurrentAnimationFrame();
        		this.renderable.setCurrentAnimation("still");
        		this.renderable.setAnimationFrame(currFrame+1);
       		}
        }else if (me.input.isKeyPressed('speed')){
       		this.vel.x = 3;
       		if(!this.renderable.isCurrentAnimation("speed")){
       			var currFrame = this.renderable.getCurrentAnimationFrame();
        		this.renderable.setCurrentAnimation("speed");
        		this.renderable.setAnimationFrame(currFrame+1);
       		}
       	}else{
       		this.vel.x = 1;
       		if(!this.renderable.isCurrentAnimation("roll")){
       			var currFrame = this.renderable.getCurrentAnimationFrame();
       			this.renderable.setCurrentAnimation("roll");
       			this.renderable.setAnimationFrame(currFrame+1);
       		}
       	}
        
	 	// check for collision
	 	var res = me.game.collide(this);
	    if (res) {
	        if (res.obj.type == me.game.ENEMY_OBJECT) {
	            this.pos.set(32,16*32);
	            this.renderable.flicker(45);
	        }
	        if (res.obj.type == me.game.ACTION_OBJECT) {
	        	this.vel.x += res.obj.vel.x;
	        	this.vel.y = 0;
	        	this.gravity = 0;
	        }
	    }
	    
	    if (!this.inViewport){
	    	this.pos.set(32,16*32);
	        this.renderable.flicker(45);
	    }
	     
        // check & update player movement
        this.updateMovement();
        this.parent();
        return true;
    }
 
});


//an enemy Entity
game.FireEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        //settings.image = "wheelie_right";
        //settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        /*// make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;*/
 
        // walking & jumping speed
        //this.setVelocity(4, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
        
        this.gravity = 0;
        this.renderable.addAnimation("fire",[0]);
        this.renderable.addAnimation("off",[1]);
        this.renderable.setCurrentAnimation("fire");
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 /*
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.renderable.flicker(45);
        }*/
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
        if(game.data.time % 120==0){
        	if(this.renderable.isCurrentAnimation("fire")){
        		this.renderable.setCurrentAnimation("off");
        		this.type = null;
        	}
        	else{
        		this.renderable.setCurrentAnimation("fire");
        		this.type = me.game.ENEMY_OBJECT;
        	}
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        //if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        //}
        return false;
    }
});

game.IcicleEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        this.gravity = 0.5;
 
    },
    
    onCollision: function(res, obj) {},

    update: function() {
        if (!this.inViewport) return false;
         
        // check and update movement
        this.updateMovement();
        
        if(game.data.time % 120==0) this.gravity = 0.5;
        if(this.vel.y === 0 && this.pos.y >320){
        	this.pos.y = 0;
        	this.gravity = 0;
        }

         
        // update animation if necessary
        //if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        //}
        return false;
    }
});

game.ButtonEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        this.collidable = true;
        //this.type = me.game.ENEMY_OBJECT;
        //this.gravity = 0.5;
 
    },
    
    onCollision: function(res, obj) {},

    update: function() {
        if (!this.inViewport) return false;
        
        if(me.game.collide(this)) game.data.globalA = true;
        else game.data.globalA = false;
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});

game.PlatformEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;
        this.setVelocity(1, 6);
        this.collidable = true;
        this.type = me.game.ACTION_OBJECT;
        this.gravity = 0;
 
    },
    
    onCollision: function(res, obj) {},

    update: function() {
        if (!this.inViewport) return false;
        
        if (this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
        } else if (!this.walkLeft && this.pos.x >= this.endX) {
            this.walkLeft = true;
        }
        // make it walk
        this.flipX(this.walkLeft);
        this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
         
        // check and update movement
        this.updateMovement();
        
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});