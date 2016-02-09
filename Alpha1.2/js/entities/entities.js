//Eggy ***************
game.PlayerEntity = me.ObjectEntity.extend({
	timer : 0,
	state : "normal",
	
	init: function(x, y, settings) {
		me.game.add((new pauseButton(0,0)),Infinity);
		settings.image = "eggy";
		settings.spritewidth = 32;
		settings.spriteheight = 32;
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
				if(this.timer > 6) this.alive = false; //takes 7 to fall 32px
				if(!this.falling) this.timer = 0;
			}
			
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
				if(res.obj.type!=null) if(res.obj.type.substring(0,4)=="area" ||
				   res.obj.type.substring(0,5)=="scene"){
					this.changeLevel(res.obj.type);
				}
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
			if(this.timer>99)
				this.changeLevel(me.levelDirector.getCurrentLevelId());
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
	},
	
	changeLevel : function(level){
		me.game.viewport.fadeIn("#FFFFFF", "250",
			function(){
				me.levelDirector.loadLevel(level);
				me.game.viewport.fadeOut("#FFFFFF", "250");
			}
		);
	}
	
	/*draw : function(context) {
		this.parent(context);
		this.testText = new me.Font("Verdana", 14, "white");
		this.testText.draw(context, "hello", this.pos.x, this.pos.y);
	}*/

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
  * 	sfx: sound that plays when it changes state
 * 		notClickable: has to click to change states
 * 		dependsOn: ID has to be true in order to change state. Will automatically
 *	 		go if notClickable is true.
 * 		switchID: changes this ID when it changes state.
 *		switchBefore: switch the switchID before or after the dur state?
 */
game.OneClickEntity = me.ObjectEntity.extend({
	befType: null,
	durType: null,
	aftType: null,
	befCol: [-1,-1,-1,-1],
	durCol: [-1,-1,-1,-1],
	aftCol: [-1,-1,-1,-1],
	sfx: null,
	switchID: null,
	switchBefore: true,
	notClickable: false,
	dependsOn: null,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		//collision data
		this.collidable = true;
		try{
			this.befCol = settings.befCol.split(",");
			for(var i=0;i<this.befCol.length;i++)
				this.befCol[i]=parseInt(this.befCol[i]);
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
		try{this.befType = settings.befType;}catch(e){}
		try{this.durType = settings.durType;}catch(e){}
		try{this.aftType = settings.aftType;}catch(e){}
		
		//sound data
		try{this.sfx = settings.sfx;}catch(e){}
		
		//switch data
		try{this.notClickable = settings.notClickable;}catch(e){}
		try{
			this.switchID = settings.switchID;
			game.data.globals[this.switchID] = false;
		}catch(e){}
		try{
			this.dependsOn = settings.dependsOn.toString().split(",");
			for(var i=0;i<this.dependsOn.length;i++)
				this.dependsOn[i]=parseInt(this.dependsOn[i]);
		}catch(e){}
		try{this.switchBefore = settings.switchBefore}catch(e){}
		
		//animation data
		try{
			var frames = settings.befFrames.split(",");
			this.makeAnimation("bef",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){this.makeAnimation("bef",0,0);}
		try{
			var frames = settings.durFrames.split(",");
			this.makeAnimation("dur",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){}
		try{
			var frames = settings.aftFrames.split(",");
			this.makeAnimation("aft",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){this.makeAnimation("aft",0,0);}
		
		this.changeState("bef",this.befType,this.befCol);
	},
	
	update: function() {
		if(!this.inViewport) return false;
		
		//should it change?
		var change = false;
		if(this.renderable.isCurrentAnimation("bef")){
			if(!this.notClickable){
				if(game.mouseIsOver(this) && me.input.isKeyPressed('click'))
					change = true;
			}else change = true;
		}
		if(this.dependsOn != null) for(var i=0;i<this.dependsOn.length;i++)
			if(!game.data.globals[this.dependsOn[i]]) change = false;
		
		//when changing
		if(change){
		   	try{me.audio.play(this.sfx);}catch(e){}
		   	if(this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = true;
			try{this.changeState("dur",this.durType,this.durCol);}
			catch(e){this.changeState("aft",this.aftType,this.aftCol);}
		   	if(!this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = true;
		}
		
		//when dur animation ends
		var lastFrame = this.renderable.current.frame.length-1;
		if(this.renderable.isCurrentAnimation("dur") &&
		   this.renderable.getCurrentAnimationFrame() == lastFrame)
			this.changeState("aft",this.aftType,this.aftCol);
		
		//update!
		this.parent();
		return true;
	},
	
	makeAnimation: function(name, firstFrame, lastFrame){
		var frames = [];
		if(firstFrame<=lastFrame)
			for(var i=firstFrame;i<=lastFrame;i++) frames.push(i);
		else for(var i=firstFrame;i>=lastFrame;i--) frames.push(i);
		this.renderable.addAnimation(name,frames);
	},
	
	changeState: function(animation, type, collision){
		this.renderable.setCurrentAnimation(animation);
		this.renderable.setAnimationFrame();
		this.type = type;
		this.updateColRect(collision[0],collision[1],
						   collision[2],collision[3]);
	}
});

/* MultiStateObject ***************
 * Description:
 * 		Like the OneClickEntity except it has two more possible states: a
 * 		blank state that only appears when another object acts and an
 * 		aftaft state that it goes into after a while in the aft state.
 * Entity Properties:
 * 		appearOn: global ID that makes it appear
 * 		switchToLast: amount of frames to switch to the aftaft state
 * 		aftdurFrames & aftaftFrames: frames for these states
 * 		aftdurType & aftaftType: types for these states
 * 		aftdurCol & aftaftCol: collision boxes for these states
 * 		aftdurSfx: sound played when changing into the last state
 */
game.MultiStateEntity = game.OneClickEntity.extend({
	appearOn: null,
	switchToLast: null,
	timer: 0,
	aftdurType: null,
	aftdurCol: [-1,-1,-1,-1],
	aftaftType: null,
	aftaftCol: [-1,-1,-1,-1],
	aftdurSfx: null,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		//switch data
		try{this.appearOn = settings.appearOn}catch(e){}
		try{this.switchToLast = settings.switchToLast}catch(e){}
		
		//collision data
		try{
			this.aftdurCol = settings.aftdurCol.split(",");
			for(var i=0;i<this.aftdurCol.length;i++)
				this.aftdurCol[i]=parseInt(this.aftdurCol[i]);
		}catch(e){}
		try{
			this.aftaftCol = settings.aftaftCol.split(",");
			for(var i=0;i<this.aftaftCol.length;i++)
				this.aftaftCol[i]=parseInt(this.aftaftCol[i]);
		}catch(e){}
		
		//sound data
		try{this.aftdurSfx = settings.aftdurSfx;}catch(e){}
		
		//type data
		try{this.aftdurType = settings.aftdurType}catch(e){}
		try{this.aftaftType = settings.aftaftType}catch(e){}
		
		//animation data
		try{
			var frames = settings.aftaftFrames.split(",");
			this.makeAnimation("aftdur",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){}
		try{
			var frames = settings.aftaftFrames.split(",");
			this.makeAnimation("aftaft",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){this.renderable.addAnimation("aftaft",[0]);}
		
		this.renderable.addAnimation("blank",[0]);
		this.changeState("blank",null,[-1,-1,-1,-1]);
	},
	
	update: function(){
		if(this.renderable.isCurrentAnimation("blank")){
			var changeToBef = false;
			if(this.appearOn == null) changeToBef = true;
			else if(game.data.globals[this.appearOn]) changeToBef = true;
			if(changeToBef) this.changeState("bef",this.befType,this.befCol);
		}
		if(this.switchToLast != null){
			if(this.renderable.isCurrentAnimation("aft")){
				this.timer++;
				if(this.timer >= this.switchToLast){
					try{me.audio.play(this.aftdurSfx);}catch(e){}
	/*->>*/	try{this.changeState("aftdur",this.aftdurType,this.aftdurCol);}
	/*->>*/	catch(e){this.changeState("aftaft",this.aftaftType,this.aftaftCol);}
				}
			}
			var lastFrame = this.renderable.current.frame.length-1;
			if(this.renderable.isCurrentAnimation("aftdur") &&
			   this.renderable.getCurrentAnimationFrame() == lastFrame)
				this.changeState("aftaft",this.aftaftType,this.aftaftCol);
		}
		this.parent();
		return true;
	}
});

/* OnOffEntity ***************
 * Description:
 * 		Can switch on and off. Used for both the switch and what it's
 * 		switching. In addition to the states in the OneClickEntity, it
 * 		also has a revdur state so it could revert back.
 * Entity Properties:
 * 		revdurFrames, revdurType, & revdurCol: revdur state stuff
 * 		revSfx: sound played when clicked to change back
 */
game.OnOffEntity = game.OneClickEntity.extend({
	revdurType: null,
	revdurCol: [-1,-1,-1,-1],
	revSfx: null,
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		//revdur state data
		try{this.revSfx = settings.revSfx;}catch(e){}
		try{this.revdurType = settings.revdurType;}catch(e){}
		try{
			this.revdurCol = settings.revdurCol.split(",");
			for(var i=0;i<this.revdurCol.length;i++)
				this.revdurCol[i]=parseInt(this.revdurCol[i]);
		}catch(e){}
		try{
			var frames = settings.revdurFrames.split(",");
			this.makeAnimation("revdur",parseInt(frames[0]),parseInt(frames[1]));
		}catch(e){}
	},
	
	update: function(){
		//should it change?
		var change = false;
		if(this.renderable.isCurrentAnimation("aft")){
			if(!this.notClickable){
				if(game.mouseIsOver(this) && me.input.isKeyPressed('click'))
					change = true;
			}else change = true;
		}
		if(this.dependsOn != null) for(var i=0;i<this.dependsOn.length;i++){
			if(game.data.globals[this.dependsOn[i]] == this.notClickable)
				change = false;
		}
		
		//when changing
		if(change){
		   	try{me.audio.play(this.revSfx);}catch(e){}
		   	if(this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = false;
			try{this.changeState("revdur",this.revdurType,this.revdurCol);}
			catch(e){this.changeState("bef",this.befType,this.befCol);}
		   	if(!this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = false;
		}
		
		//when dur animation ends
		var lastFrame = this.renderable.current.frame.length-1;
		if(this.renderable.isCurrentAnimation("revdur") &&
		   this.renderable.getCurrentAnimationFrame() == lastFrame)
			this.changeState("bef",this.befType,this.befCol);
		
		this.parent();
		return true;
	}
});