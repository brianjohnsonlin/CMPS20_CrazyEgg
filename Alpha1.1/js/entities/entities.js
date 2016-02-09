game.PlayerEntity = me.ObjectEntity.extend({
	timer : 0,
	state : "normal",
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.setVelocity(1, 15);
		this.setMaxVelocity(10,15);
		this.updateColRect(4,24,4,28);
		this.type = "eggy";
		
		//animations
		this.renderable.addAnimation("roll",[0,1,2,3,4,5,4,3,2,1],50);
		this.renderable.addAnimation("break",[8,9,10,11,12,13,14,15]);
		this.renderable.addAnimation("broken",[7,15]);
		this.renderable.addAnimation("ropedown",[16,17,18,19,20],200);
		this.renderable.setCurrentAnimation("roll");
		
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		game.data.time = 0;
	},

	update: function() {
		if(this.state == "normal"){
			this.gravity = 1;
	    	if(this.walkLeft) this.vel.x = -1;
			else this.vel.x = 1;
		
			if(this.alive){
				if(this.falling) this.timer++;
				if(this.timer > 6) this.alive = false; //takes 7 to fall just 32pix
				if(!this.falling) this.timer = 0;
			}
		
			//if(this.alive){
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
						this.vel.y = 1.4;
						this.gravity = 0;
						this.falling = false;
					}
					if (res.obj.type == "flip"){
						this.flipX();
						this.walkLeft = !this.walkLeft;
						this.pos.x += (this.walkLeft) ? -2 : 2;
					}
					if (res.obj.type == "ropedown" && this.falling){
						this.state = "ropedown";
						this.flipX(false);
						this.walkLeft = false;
					}
					if(res.obj.type == "cushion"){
						this.alive = true;
						this.gravity = 0;
						this.vel.y = 0;
						this.flipX();
						this.walkLeft = true;
						timer = 0;
						this.falling = false;
					}
				//}
			}
		}
		
		if(this.state == "ropedown"){
			this.gravity = 0;
			this.vel.x = 0;
			this.vel.y = 1;
			if(!this.renderable.isCurrentAnimation("ropedown"))
				this.renderable.setCurrentAnimation("ropedown");
			this.falling = false;
		}
		
		// if dead
		if(!this.alive && !this.falling){
			this.vel.x = 0;
			this.timer++;
			if(this.renderable.isCurrentAnimation("roll")){
				this.renderable.setCurrentAnimation("break");
				me.audio.play("squelch");
			}
			if(this.renderable.getCurrentAnimationFrame()==7)
				this.renderable.setCurrentAnimation("broken");
			if(this.timer>99)me.game.viewport.fadeIn("#FFFFFF", "250",
				function(){
					/*me.levelDirector.loadLevel(
						me.levelDirector.getCurrentLevelId()
					);*/
					me.state.change(me.state.PLAY)
					//me.game.viewport.fadeOut("#FFFFFF", "250");
				});
		}
		
		// check & update player movement
		//if(!this.alive && !this.falling) this.vel.y = 0;
		this.updateMovement();
		this.parent();
		if(this.vel.x === 0 && this.state == "normal") this.alive = false;
		if(this.vel.y === 0 && this.state == "ropedown"){
			this.state = "normal";
			this.renderable.setCurrentAnimation("roll");
		}
		return true;
	}
	
	/*draw : function(context) {
		this.parent(context);
		this.testText = new me.Font("Verdana", 14, "white");
		this.testText.draw(context, "hello", this.pos.x, this.pos.y);
	}*/

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

game.fallingObject = me.ObjectEntity.extend({
	fallclick: false,
	noMoreWoosh: false,
	//newpos: 0,
	count: 0,
	init: function(x, y, settings){
		//this.newpos=y
		this.parent(x, y, settings);
		this.gravity=0;
		this.collidable = true;
		me.input.registerPointerEvent('mousedown', this, this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		this.fallclick = true;
		if(this.noMoreWoosh==false){
		me.audio.play("woosh");
		this.noMoreWoosh = true;
		}
		
	},
	update: function(){
		
		this.updateMovement();
		if(this.fallclick==true){
			this.gravity=1;	
			this.count++;		
		}
		if(this.count>=10&&this.vel.y==0){
		//	this.pos.y=this.newpos;
			this.fallclick=false;
			this.gravity=0;
			this.count=0;
			me.game.remove(this);
		}

		this.parent();
	}
});
game.vanish = me.ObjectEntity.extend({
	noMoreClick: false,
	init: function(x, y, settings){
		//this.newpos=y
				this.parent(x, y, settings);
		this.renderable.addAnimation("spin",[0,1,2,3,4,5,6,7],100);
		this.renderable.setCurrentAnimation("spin");

		me.input.registerPointerEvent('mousedown', this, this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		if(this.noMoreClick==false){
		me.audio.play("click");
		me.game.remove(this);
		this.noMoreClick=true;
		}
	},
});

/* OneClickEntity ***************
 * Description:
 * 		Stuff that you click on and something happens to it.
 *		Can't be reversed. (breaking platforms, spilled milk)
 * Entity Properties (* means they are required):
 * 		befType, durType, & aftType: Before, during, and after types repectively.
 * 		befCol, durCol, & aftCol: Before, during, and after clicking colision
 * 			boxes repectively. Follows (x,w,y,h) collision box parameters.
 * 		befFrames*, durFrames, & aftFrames*: Beginning, during, and ending
 * 			framesets of respective animations according to spritesheet. Follows
 * 			format (firstFrame,lastFrame). Putting the last frame first will
 * 			reverse the animation.
 * 		sfx: sound that plays when it changes state
 */
game.OneClickEntity = me.ObjectEntity.extend({
	aftType: null,
	durType: null,
	durCol: [-1,-1,-1,-1],
	aftCol: [-1,-1,-1,-1],
	sfx: null,
	switchID: null,
	notClickable: false,
	
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
			this.durCol = settings.durCol.split(",");
			for(var i=0;i<this.durCol.length;i++)
				this.durCol[i]=parseInt(this.durCol[i]);
		}catch(e){}
		try{
			this.aftCol = settings.aftCol.split(",");
			for(var i=0;i<this.aftCol.length;i++)
				this.aftCol[i]=parseInt(this.aftCol[i]);
		}catch(e){}
		
		//type data
		try{this.type = settings.befType;}catch(e){this.type = null;}
		try{this.durType = settings.durType;}catch(e){}
		try{this.aftType = settings.aftType;}catch(e){}
		
		//sound data
		try{this.sfx = settings.sfx;}catch(e){}
		
		//switchID data
		try{this.notClickable = settings.notClickable;}catch(e){}
		try{
			this.switchID = settings.switchID;
			if(!this.notClickable) game.data.globals[this.switchID] = false;
		}catch(e){}
		
		//animation data
		try{
			var frames = settings.befFrames.split(",");
			this.makeAnimation("bef",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){this.makeAnimation("bef",0,0);}
		try{
			frames = settings.durFrames.split(",");
			this.makeAnimation("dur",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){}
		try{
			var frames = settings.aftFrames.split(",");
			this.makeAnimation("aft",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){this.makeAnimation("aft",0,0);}
		this.renderable.setCurrentAnimation("bef");
	},
	
	update: function() {
		if(!this.inViewport) return false;
		
		//when clicked
		var change = false;
		if(this.renderable.isCurrentAnimation("bef")){
			if(!this.notClickable){
				if(game.mouseIsOver(this) && me.input.isKeyPressed('click'))
					change = true;
			}else{
				if(game.data.globals[this.switchID]) change = true;
			}
		}
		if(change){
		   	try{me.audio.play(this.sfx);}catch(e){}
		   	if(!this.notClickable) game.data.globals[this.switchID] = true;
			try{
				this.renderable.setCurrentAnimation("dur");
				this.updateColRect(this.durCol[0],this.durCol[1],
								   this.durCol[2],this.durCol[3]);
				this.type = this.durType;
			}catch(e){
				this.renderable.setCurrentAnimation("aft");
				this.updateColRect(this.aftCol[0],this.aftCol[1],
								   this.aftCol[2],this.aftCol[3]);
				this.type = this.aftType;
			}
		}
		
		//when dur animation ends
		var lastFrame = this.renderable.current.frame.length-1;
		if(this.renderable.isCurrentAnimation("dur") &&
		   this.renderable.getCurrentAnimationFrame() == lastFrame){
			this.renderable.setCurrentAnimation("aft");
			this.type = this.aftType;
			this.updateColRect(this.aftCol[0],this.aftCol[1],
							   this.aftCol[2],this.aftCol[3]);
		}
		
		//if(this.renderable.isCurrentAnimation("dur")){
			this.parent();
			return true;
		//}
		//return false;
	},
	
	makeAnimation: function(name, firstFrame, lastFrame){
		var frames = [];
		if(firstFrame<=lastFrame)
			for(var i=firstFrame;i<=lastFrame;i++) frames.push(i);
		else for(var i=lastFrame;i>=firstFrame;i--) frames.push(i);
		this.renderable.addAnimation(name,frames);
	}
})
