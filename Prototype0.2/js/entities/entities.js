game.PlayerEntity = me.ObjectEntity.extend({
	fallingTime : 0,
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(1, 15);
        this.setMaxVelocity(10,15);
        this.type = "player";
    	//this.updateColRect(0, 32, -1, 0);
    	//animation stuff
    	//this.renderable.addAnimation("walking",[],30);
    	//this.renderable.addAnimation("breaking",[],30);
    	//this.renderable.addAnimation("broken",[],30);
    	
    	// temp animations
		this.renderable.addAnimation("roll",[0,1,2,3,4,5,6,7],90);
		//this.renderable.addAnimation("dead",[4],90);
		//this.renderable.addAnimation("speed",[0,1,2,3,4,5,6,7],45);
		//this.renderable.addAnimation("still",[0,1,2,3,4,5,6,7],Number.MAX_VALUE);
		this.renderable.setCurrentAnimation("roll");
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        game.data.time = 0;
 
    },
    
    update: function() {
    	game.data.time++;
	 	this.gravity = 1;
    	//this.vel.x += this.accel.x * me.timer.tick;
    	if(this.walkLeft) this.vel.x = -1;
    	else this.vel.x = 1;
    	if(this.falling) fallingTime++;
    	else fallingTime = 0;
    	
    	if(fallingTime > 9)this.alive = false;
    	if(!this.alive && !this.falling){
    		this.pos.set(32,160);
            this.renderable.flicker(45);
            if(this.walkLeft)this.flipX();
            this.walkLeft = false;
            this.alive = true;
    	}
        
	 	// check for collision
	 	var res = me.game.collide(this);
	    if (res) {
	        if (res.obj.type == me.game.ENEMY_OBJECT) {
	            this.pos.set(32,160);
	            this.renderable.flicker(45);
	            if(this.walkLeft)this.flipX();
	            this.walkLeft = false;
	        }
	        if (res.obj.type == "platform"){
	        	this.vel.y = 0;
	        	this.gravity = 0;
	        	this.falling = false;
	        }
	        if (res.obj.type == "rampdown"){
	        	this.vel.y = 1;
	        	this.gravity = 0;
	        	this.falling = false;
	        }
	        if (res.obj.type == "flip"){
	        	this.flipX();
	        	this.walkLeft = !this.walkLeft;
	        	this.pos.x += (this.walkLeft) ? -2 : 2;
	        }
	    }
	    
        // check & update player movement
        this.updateMovement();
        this.parent();
        return true;
    }
 
});

game.DangerEntity = me.ObjectEntity.extend({
	globalVar : null,
	
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        this.gravity = 0;
        this.renderable.addAnimation("on",[0]);
        this.renderable.addAnimation("off",[1]);
        this.renderable.setCurrentAnimation("on");
        this.globalVar = settings.type;
    },
    
    update: function() {
        if (!this.inViewport) return false;
        if(game.data.globals[this.globalVar]!=null){
	    	if(game.data.globals[this.globalVar]){
	    		this.renderable.setCurrentAnimation("on");
	    		this.type = me.game.ENEMY_OBJECT;
	    	}
	    	else{
	    		this.renderable.setCurrentAnimation("off");
	    		this.type = null;
	    	}
        }
        if(this.renderable.isCurrentAnimation("on")){
	        this.parent();
	        return true;
	    } else return false;
    }
});

game.SwitchEntity = me.ObjectEntity.extend({
	globalVar : null,
	
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.collidable = false;
        this.renderable.addAnimation("on",[0]);
        this.renderable.addAnimation("off",[1]);
        this.renderable.setCurrentAnimation("on");
        this.gravity = 0;
        this.type = 0;
        this.globalVar = settings.type;
        game.data.globals[this.globalVar] = true;
    },

    update: function() {
        if (!this.inViewport) return false;
        
        if(game.mouseIsOver(this) && me.input.isKeyPressed('click')){
			if(this.renderable.isCurrentAnimation("on")){
				this.renderable.setCurrentAnimation("off");
				game.data.globals[this.globalVar] = false;
			}
			else{
				this.renderable.setCurrentAnimation("on");
				game.data.globals[this.globalVar] = true;
			}
			this.parent();
			return true;
		}
		
        return false;
    }
});

game.FlipEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        this.collidable = true;
        this.width = settings.spritewidth;
        this.type = "flip";
    },

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

game.BreakingPlatformEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        this.pos.x = x + settings.width - settings.spritewidth;
        this.collidable = true;
        this.type = "platform";
        this.gravity = 0;
 		this.renderable.addAnimation("fixed",[0],Number.MAX_VALUE);
 		this.renderable.addAnimation("breaking",[0,1,2,3],120);
 		this.renderable.addAnimation("broken",[3],Number.MAX_VALUE);
 		this.renderable.setCurrentAnimation("fixed");
    },
    
    onCollision: function(res, obj) {},

    update: function() {
        if (!this.inViewport) return false;
        
        if(this.renderable.isCurrentAnimation("breaking") && this.renderable.getCurrentAnimationFrame() == 3){
        	this.renderable.setCurrentAnimation("broken");
        	this.type = "rampdown";
        }
        
        var playerCollide = false;
        if(me.game.collide(this) != null) if(me.game.collide(this).obj.type == "player") playerCollide = true;
        
		if(game.mouseIsOver(this) && me.input.isKeyPressed('click') && !playerCollide && this.renderable.isCurrentAnimation("fixed")){
			this.renderable.setCurrentAnimation("breaking");
			this.type = null;
		}
        
        if(this.renderable.isCurrentAnimation("breaking")){
	        this.parent();
	        return true;
        }
        return false;
    }
});