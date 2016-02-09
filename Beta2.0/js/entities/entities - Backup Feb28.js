game.PlayerEntity = me.ObjectEntity.extend({
	timer : 0,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.setVelocity(1, 15);
		this.setMaxVelocity(10,15);
		this.type = "eggy";
		
		//animations
		this.renderable.addAnimation("roll",[0,1,2,3,4,5,4,3,2,1],50);
		this.renderable.addAnimation("break",[8,9,10,11,12,13,14,15],100);
		this.renderable.addAnimation("broken",[7,15],100);
		this.renderable.setCurrentAnimation("roll");
		
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		game.data.time = 0;
	},

	update: function() {
		game.data.time++;
		this.gravity = 1;
		//this.vel.x += this.accel.x * me.timer.tick;
    	if(this.walkLeft) this.vel.x = -1;
		else this.vel.x = 1;
		if(this.alive){
			if(this.falling) this.timer++;
			if(this.timer > 6) this.alive = false; //takes 7 to fall just 32pix
			if(!this.falling) this.timer = 0;
		}
		
		// if dead
		if(!this.alive && !this.falling){
			this.vel.x = 0;
			this.timer++;
			if(this.renderable.isCurrentAnimation("roll"))
				this.renderable.setCurrentAnimation("break");
			if(this.renderable.getCurrentAnimationFrame()==7)
				this.renderable.setCurrentAnimation("broken");
			if(this.timer>99)me.game.viewport.fadeIn("#FFFFFF", "250",
				function(){
					me.levelDirector.loadLevel(
						me.levelDirector.getCurrentLevelId()
					);
					me.game.viewport.fadeOut("#FFFFFF", "250");
				});
		}
		// check for collision
		if(this.alive){
			var res = me.game.collide(this);
			if (res) {
				if (res.obj.type == "danger")
					if(this.alive)this.alive = false;
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
		}
		
		// check & update player movement
		if(!this.alive && !this.falling) this.vel.y = 0;
		this.updateMovement();
		this.parent();
		if(this.vel.x === 0) this.alive = false;
		return true;
	}
	
	/*draw : function(context) {
		this.parent(context);
		this.testText = new me.Font("Verdana", 14, "white");
		this.testText.draw(context, "hello", this.pos.x, this.pos.y);
	}*/

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
		this.globalVar = settings.globalVar;
	},
	
	update: function() {
		if(!this.inViewport) return false;
		if(game.data.globals[this.globalVar]!=null){
			if(game.data.globals[this.globalVar]){
				this.renderable.setCurrentAnimation("on");
				this.type = me.game.ENEMY_OBJECT;
			}else{
				this.renderable.setCurrentAnimation("off");
				this.type = null;
			}
		}
		if(this.renderable.isCurrentAnimation("on")){
			this.parent();
			return true;
		}else return false;
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
		this.globalVar = settings.globalVar;
		game.data.globals[this.globalVar] = true;
	},
	
	update: function() {
		if(!this.inViewport) return false;
		
		if(game.mouseIsOver(this) && me.input.isKeyPressed('click')){
			if(this.renderable.isCurrentAnimation("on")){
				this.renderable.setCurrentAnimation("off");
				game.data.globals[this.globalVar] = false;
			}else{
				this.renderable.setCurrentAnimation("on");
				game.data.globals[this.globalVar] = true;
			}
			this.parent();
			return true;
		}
		return false;
	}
});

game.CartonEntity = me.LevelEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.updateColRect(-1,-1,32,96);
		this.renderable.addAnimation("closed",[0],Number.MAX_VALUE);
		this.renderable.addAnimation("opening",[1,2,3,0],100);
		this.renderable.setCurrentAnimation("closed");
	},
	
	onCollision: function(res, obj){
		if(!this.renderable.isCurrentAnimation("opening"))
			this.renderable.setCurrentAnimation("opening");
		this.parent(res,obj);
	}
});

game.DarknessEntity = me.ObjectEntity.extend({
	globalVar : null,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.collidable = false;
		this.gravity = 0;
		this.globalVar = settings.globalVar;
		this.renderable.addAnimation("on",[0]);
		this.renderable.addAnimation("off",[1]);
		this.renderable.setCurrentAnimation("on");
	},
	
	update: function() {
		if(!this.inViewport) return false;
		if(game.data.globals[this.globalVar]!=null){
			if(game.data.globals[this.globalVar])
				this.renderable.setCurrentAnimation("on");
			else this.renderable.setCurrentAnimation("off");
		}
		if(this.renderable.isCurrentAnimation("on")){
			this.parent();
			return true;
		}else return false;
	}
});

/* oneClickEntity ***************
 * Description:
 * 		Stuff that you click on and something happens to it.
 *		Can't be reversed. (breaking platforms, spilled milk)
 * 		Cannot change state when Eggy is touching it.
 * Entity Properties (* means they are required):
 * 		befType* & aftType: Before and after clicking types repectively.
 * 		befCol & aftCol: Before and after clicking colision boxes repectively.
 * 			Follows (x,w,y,h) collision box parameters.
 * 		befFrames*, durFrames, & aftFrames: Beginning, during, and ending
 * 			framesets of respective animations according to spritesheet. Follows
 * 			format (firstFrame,lastFrame). Putting the last frame first will
 * 			reverse the animation.
 * 		switchID: ID of globalVar assigned. 0 for true, 1 for false, and 2 and
 * 			so on for custom. Default is self-click.
 * 		reversable: True if it can be turned on and off. Default is true.
 * 		revert: time (in frames) it takes to revert back to original state.
 * 			Not set means never reverts.
 * 		sfx: sound that plays when it changes state
 */
game.GameEntity = me.ObjectEntity.extend({
	aftType: null,
	aftCol: null,
	switchID: null,
	reversable: null,
	revert: null,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		//collision data
		this.collidable = true;
		try{
			var col = settings.befCol.split(",");
			this.updateColRect(parseInt(col[0]),parseInt(col[1]),
							   parseInt(col[2]),parseInt(col[3]));
		}catch(e){}
		try{
			this.aftCol = settings.aftCol.split(",");
			for(var i=0;i<this.aftCol.length;i++)
				this.aftCol[i]=parseInt(this.aftCol[i]);
		}catch(e){}
		
		//type data
		this.type = settings.befType;
		try{this.aftType = settings.aftType;}catch(e){}
		
		//other data
		try{this.switchID = settings.switchID;}catch(e){}
		try{this.reversable = settings.reversable;
		}catch(e){this.reversable = true;}
		try{this.revert = settings.revert}catch(e){}
		
		//animation data
		var frames = settings.befFrames.split(",");
		this.makeAnimation("bef",parseInt(frames[0]),parseInt(frames[1]));
		frames = settings.durFrames.split(",");
		this.makeAnimation("dur",parseInt(frames[0]),parseInt(frames[1]));
		this.makeAnimation("durB",parseInt(frames[1]),parseInt(frames[0]));
		frames = settings.aftFrames.split(",");
		this.makeAnimation("aft",parseInt(frames[0]),parseInt(frames[1]));
		
		//setup
		this.renderable.setCurrentAnimation("bef");
		/*if(game.data.globals[this.switchID])
			this.renderable.setCurrentAnimation("bef");
		if(game.data.globals[this.switchID])
			this.renderable.setCurrentAnimation("aft");*/
	},
	
	update: function() {
		if(!this.inViewport) return false;
		
		if(game.mouseIsOver(this) && me.input.isKeyPressed('click') &&
		   this.renderable.isCurrentAnimation("bef")){
			this.renderable.setCurrentAnimation("dur");
			this.type = null;
		}
		
		var lastFrame = this.renderable.current.frame.length-1;
		if(this.renderable.isCurrentAnimation("dur") &&
		   this.renderable.getCurrentAnimationFrame() == lastFrame){
			this.renderable.setCurrentAnimation("aft");
			this.type = this.aftType;
			this.updateColRect(this.aftCol[0],this.aftCol[1],
							   this.aftCol[2],this.aftCol[3]);
		}
		
		if(this.renderable.isCurrentAnimation("dur")){
			this.parent();
			return true;
		}
		return false;
	},
	
	makeAnimation: function(name, firstFrame, lastFrame){
		var frames = [];
		if(firstFrame<=lastFrame)
			for(var i=firstFrame;i<=lastFrame;i++) frames.push(i);
		else for(var i=lastFrame;i>=firstFrame;i--) frames.push(i);
		this.renderable.addAnimation(name,frames);
	}
})
