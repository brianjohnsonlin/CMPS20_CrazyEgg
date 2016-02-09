//Eggy ***************
game.PlayerEntity = me.ObjectEntity.extend({
	timer : 0,
	state : "normal",
	
	init: function(x, y, settings) {
		me.game.add((new pauseButton(0,0)),Infinity);
		game.data.globals = [];
		settings.image = "eggy";
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		this.parent(x, y, settings);
		this.setVelocity(1, 15);
		this.setMaxVelocity(10,15);
		this.updateColRect(4,24,4,28);
		this.type = "eggy";
		this.maxVel.y = 50;
		
		//animations
		this.renderable.addAnimation("roll",[0,1,2,3,4,5,4,3,2,1],50);
		this.renderable.addAnimation("break",[8,9,10,11,12,13,14,15]);
		this.renderable.addAnimation("broken",[7,15]);
		this.renderable.addAnimation("slide",[24,25,26,27,28,29,30]);
		this.renderable.addAnimation("stop",[2]);
		this.renderable.addAnimation("ropedown",[16,17,18,19,20],200);
		this.renderable.setCurrentAnimation("roll");
		
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},

	update: function() {
		if(this.state == "trampoline"){
			this.alive = true;
			var res = me.game.collide(this);
			if (res){
				if(res.obj.type == "shelfdown" && this.falling){
					this.alive = true;
					this.state = "normal";
					this.vel.x = 1;
					this.timer = 0;
				}
				if(res.obj.type == "trampoline") this.alive = false;
			}
		}
		
		if(this.state == "swim"){
			this.gravity = 1;
			this.vel.x = ((this.walkLeft) ? -1 : 1)*1.01;
			this.falling = false;
			this.alive = true;
			this.timer++;
			var res = me.game.collide(this);
			if(res) if(res.obj.type == "pool") this.gravity = -1;
			//if(this.vel.y>0) this.vel.y-=0.9;
			if(Math.abs(this.vel.y)>0.1) this.timer = 0;
			if(this.timer > 30){
				this.state = "normal";
				this.timer = 0;
			}
		}
		
		if(this.state == "normal"){
			this.gravity = 1;
	    	if(this.walkLeft) this.vel.x = -1;
			else this.vel.x = 1;
		
			if(this.alive){
				if(this.falling) this.timer++;
				if(this.timer > 6)this.alive = false; //takes 7 to fall 32px
				if(!this.falling) this.timer = 0;
			}
			
			var res = me.game.collide(this);
			if (res) {
				if (res.obj.type == "danger")
					if(this.alive)this.alive = false;
				if (res.obj.type == "flip"){
					this.flipX();
					this.walkLeft = !this.walkLeft;
					this.pos.x += (this.walkLeft) ? -2 : 2;
				}
				if (res.obj.type == "platform"){
					this.vel.y = 0;
					this.gravity = 0;
					this.falling = false;
				}
				if(res.obj.type == "cushion"){
					this.alive = true;
					this.gravity = 0;
					this.vel.y = 0;
					timer = 0;
					this.falling = false;
				}
				if(res.obj.type == "cushionFlipLeft"){
					this.alive = true;
					this.gravity = 0;
					this.vel.y = 0;
					timer = 0;
					this.falling = false;
					this.flipX(true);
					this.walkLeft = true;
				}
				if (res.obj.type == "rampdown" && this.alive){
					this.vel.y = 1.4;
					this.gravity = 0;
					this.falling = false;
				}
				if (res.obj.type == "shelfdown" && this.alive){
					this.vel.y = 0.65;
					this.gravity = 0;
					this.falling = false;
				}
				if (res.obj.type == "ropedown" && this.falling && this.alive){
					this.state = "ropedown";
					this.flipX(false);
					this.walkLeft = false;
				}
				if(res.obj.type == "books" && this.alive){
					this.vel.y = 0.175;
					this.gravity = 0;
					this.falling = false;
				}
				if(res.obj.type == "ciderslide")this.state = "slide";
				if(res.obj.type == "stop") this.state = "stop";
				if(res.obj.type == "trampoline"){
					this.vel.y = -29;
					this.state = "trampoline";
					me.audio.play("boing");
				}
				if(res.obj.type == "pool"){
					me.audio.play("watersplash");
					this.state = "swim";
					this.vel.y = 5;
					this.timer;
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
		
		if(this.state == "stop"){
			this.vel.x = 0;
			this.alive = true;
			var res = me.game.collide(this);
			if(!this.renderable.isCurrentAnimation("stop"))
				this.renderable.setCurrentAnimation("stop");
			if (res) if(res.obj.type != "stop"){
				this.alive = true;
				this.state = "normal";
				this.vel.x = 1;
				this.renderable.setCurrentAnimation("roll");
			}
		}
		
		if(this.state == "slide"){
			this.vel.y = 1;
			this.vel.x = 2;
			this.gravity = 0;
			this.falling = false;
			this.alive = true;
			var res = me.game.collide(this);
			if(!this.renderable.isCurrentAnimation("slide"))
				this.renderable.setCurrentAnimation("slide");
			if (res) if(res.obj.type != "ciderslide"){
				this.alive = true;
				this.state = "normal";
				this.vel.x = 1;
				this.renderable.setCurrentAnimation("roll");
				this.timer = 0;
			}
			if(!res){
				this.alive = true;
				this.state = "normal";
				this.vel.x = 1;
				this.renderable.setCurrentAnimation("roll");
				this.timer = 0;
			}
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
		this.updateMovement();
		this.parent();
		if(this.vel.x === 0 && this.state == "normal")
			this.alive = false;
		if(this.vel.y === 0 && this.state == "ropedown"){
			this.state = "normal";
			this.renderable.setCurrentAnimation("roll");
		}
		return true;
	},
	
	changeLevel : function(level){
		me.game.viewport.fadeIn("#FFFFFF", "250",
			function(){
				if(me.levelDirector.getCurrentLevelId() != level){
					me.audio.stopTrack(me.levelDirector.getCurrentLevelId());
					me.audio.playTrack(level);
				}
				me.levelDirector.loadLevel(level);
				me.game.viewport.fadeOut("#FFFFFF", "250");
			}
		);
	}

});

/* Entity ***************
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
	dependsOn: [],
	change: false,
	
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
		this.change = false;
		if(this.renderable.isCurrentAnimation("bef")){
			if(!this.notClickable){
				if(game.mouseIsOver(this) && me.input.isKeyPressed('click'))
					this.change = true;
			}else this.change = true;
			for(var i=0;i<this.dependsOn.length;i++)
				if(!game.data.globals[this.dependsOn[i]]) this.change = false; //<<<
		}
		//console.log(this.change);
		
		//when changing
		if(this.change){
		   	try{me.audio.play(this.sfx);}catch(e){}
		   	if(this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = true;
			try{this.changeState("dur",this.durType,this.durCol);}
			catch(e){
				this.changeState("aft",this.aftType,this.aftCol);
			   	if(!this.switchBefore) if(this.switchID != null)
			   		game.data.globals[this.switchID] = true;
			}
		}
		
		//when dur animation ends
		var lastFrame = this.renderable.current.frame.length-1;
		if(this.renderable.isCurrentAnimation("dur") &&
		   this.renderable.getCurrentAnimationFrame() == lastFrame){
			this.changeState("aft",this.aftType,this.aftCol);
		   	if(!this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = true;
		}
		
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
 * 		aftSfx: sound played when changing into the last state
 * 		[Properties from OneClickEntity]
 */
game.MultiStateEntity = game.OneClickEntity.extend({
	appearOn: null,
	switchToLast: null,
	timer: 0,
	aftdurType: null,
	aftdurCol: [-1,-1,-1,-1],
	aftaftType: null,
	aftaftCol: [-1,-1,-1,-1],
	aftSfx: null,
	
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
		try{this.aftSfx = settings.aftSfx;}catch(e){}
		
		//type data
		try{this.aftdurType = settings.aftdurType}catch(e){}
		try{this.aftaftType = settings.aftaftType}catch(e){}
		
		//animation data
		try{
			var frames = settings.aftdurFrames.split(",");
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
					try{me.audio.play(this.aftSfx);}catch(e){}
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
 * 		[Properties from OneClickEntity]
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
		this.parent();
		
		//should it change?
		if(this.renderable.isCurrentAnimation("aft") && !this.change){
			if(!this.notClickable){
				if(game.mouseIsOver(this) && me.input.isKeyPressed('click')){
					this.change = true;
				}
			}else this.change = true;
			for(var i=0;i<this.dependsOn.length;i++){
				if(!this.notClickable && !game.data.globals[this.dependsOn[i]])
					this.change = false;
				else if(this.notClickable){
					if(!game.data.globals[this.dependsOn[i]]){this.change = true; break;}//<<<
					else this.change = false;
				}
			}
		}else if(this.change) this.change = false;
		//console.log(this.change);
		
		//when changing
		if(this.change){
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
		   this.renderable.getCurrentAnimationFrame() == lastFrame){
			this.changeState("bef",this.befType,this.befCol);
		   	if(!this.switchBefore) if(this.switchID != null)
		   		game.data.globals[this.switchID] = false;
		}
		
		return true;
	}
});

/* PipeEntity ***************
 * Description:
 * 		Pipes for the pipes puzzle.
 * Entity Properties:
 * 		pipePos: Initial position for the pipes (1-3, top to bottom).
 * 		dependsOn: which button globals change the position of the pipe
 * 		switchID: ID to change when it's in in the middle.
 */
game.PipeEntity = me.ObjectEntity.extend({
	pipePos: 0,
	switchID: null,
	dependsOn: [],
	startY: null,
	
	init: function(x,y,settings){
		settings.image = "pipe";
		settings.type = "pipe";
		this.parent(x, y, settings);
		try{this.pipePos = settings.pipePos;}catch(e){}
		try{this.switchID = settings.switchID;}catch(e){}
		try{
			this.dependsOn = settings.dependsOn.toString().split(",");
			for(var i=0;i<this.dependsOn.length;i++)
				this.dependsOn[i]=parseInt(this.dependsOn[i]);
		}catch(e){}
		this.startY = this.pos.y;
	},
	
	update: function(){
		var pos = 0;
		for(var i = 0; i<this.dependsOn.length; i++)
			pos+=game.data.buttonGlobals[this.dependsOn[i]];
		pos+=this.pipePos; pos %= 4;
		this.pos.y = this.startY + pos*64;
		if(pos == 3) this.pos.y = this.startY + 1*64;
		
		if((pos == 1 || pos == 3) && this.switchID != null)
			game.data.globals[this.switchID] = true;
		else game.data.globals[this.switchID] = false;
		
		this.parent();
		return true;
	}
	
});

/* ButtonEntity ***************
 * Description:
 * 		Button for changing pipes
 * Entity Properties:
 * 		switchID: which button global to change
 * 		deactivateID: which global var will make it unclickable
 */
game.ButtonEntity = me.ObjectEntity.extend({
	switchID: null,
	deactivateID: null,
	
	init: function(x,y,settings){
		settings.image = "button1";
		settings.spritewidth = 32;
		this.parent(x,y,settings);
		try{
			this.switchID = settings.switchID;
			game.data.buttonGlobals[this.switchID]=0;
		}catch(e){}
		try{this.deactivateID = settings.deactivateID;}catch(e){}
	},
	
	update: function(){
		if(this.deactivateID != null) if(!game.data.globals[this.deactivateID])
		  if(game.mouseIsOver(this) && me.input.isKeyPressed('click')){
			if(this.switchID != null)game.data.buttonGlobals[this.switchID]++;
			me.audio.play("click");
			me.audio.play("clunk");
		  }
		this.parent();
		return true;
	}
});


game.SpongeEntity = me.ObjectEntity.extend({
	//count the clicks
	counter : 1,
	//time the clicks before it shrinks the sponge
	timer : 0,
	
	finalSize: false,
	
	spongeFallCushion: false,
	
	init: function(x,y,settings){
		this.parent(x,y,settings);
		this.renderable.addAnimation("size1", [1]);
		this.renderable.addAnimation("size2", [2]);
		this.renderable.setCurrentAnimation("size1");
		this.gravity = 0;
		this.updateColRect(35, 95, 0, 40);
	},
	
	update: function(){
		this.timer += 1;
		if(this.finalSize === false){
			if(game.mouseIsOver(this) && me.input.isKeyPressed('click')){
				this.counter++;
				if(this.counter >= 4){
					this.renderable.setCurrentAnimation("size2");
					this.timer = 0;
					this.gravity = 1;
					this.finalSize = true;
					this.spongeFallCushion = true;
					this.updateColRect(35, 95, -10, 30);
				}
			}
			if(this.timer > 30){
				this.renderable.setCurrentAnimation("size1");
				this.timer = 0;
				this.counter = 1;
			}
		}
		if(this.spongeFallCushion === true){
			if(this.vel.y === 0){
				this.type = "cushion";
			}
		}
		this.updateMovement();
		this.parent();
		return true;
	}
});

game.sinkhole = me.ObjectEntity.extend({
	init: function(x,y,settings)
	{
		this.parent(x,y,settings);
	}
});