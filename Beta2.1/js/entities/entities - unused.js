//Unused entities

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
		me.input.registerPointerEvent('mousedown', this,
									  this.onMouseDown.bind(this));
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
		me.input.registerPointerEvent('mousedown', this,
									  this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		if(this.noMoreClick==false){
			me.audio.play("click");
			me.game.remove(this);
			this.noMoreClick=true;
		}
	},
});

/* PipeEntity ***************
 * Description:
 * 		Pipes for the pipes puzzle.
 * Entity Properties:
 * 		pipePos: Initial position for the pipes (1-3, top to bottom).
 * 		buttonLink: which button codes change the position of the pipe
 * 		switchID: ID to change when it's in pos 2 (middle).
 */
game.PipeEntity = me.ObjectEntity.extend({
	pipeFlip: 1,
	switchID: null,
	buttonLink: [],
	//if false, pipe was at 3 and - to 2, else pipe was at 1 and + to 2
	pipeReverse: false,
	
	init: function(x,y,settings){
		settings.image = "pipe";
		this.parent(x, y, settings);
		this.renderable.addAnimation("row1", [0]);
		this.renderable.addAnimation("row2", [1]);
		this.renderable.addAnimation("row3", [2]);
		try{this.pipeFlip = settings.pipePos}catch(e){}
		try{this.switchID = settings.switchID}catch(e){}
		try{
			this.buttonLink = settings.buttonLink.toString().split(",");
			for(var i=0;i<this.buttonLink.length;i++)
				this.buttonLink[i]=parseInt(this.buttonLink[i]);
		}catch(e){}
		this.renderable.setCurrentAnimation("row"+this.pipeFlip);
	},
	
	update:function(){
		for(var i = 0; i<this.buttonLink.length; i++){
			if(game.data.buttonLink === "button"+this.buttonLink[i]){
				if(this.pipeFlip === 3){
					this.renderable.setCurrentAnimation("row"+(this.pipeFlip-1));
					this.pipeFlip--;
					this.pipeReverse = false;
				}
				else if(this.pipeFlip === 1){
					this.renderable.setCurrentAnimation("row"+(this.pipeFlip+1));
					this.pipeFlip++;
					this.pipeReverse = true;
				}
				else if(this.pipeReverse === false){
					this.renderable.setCurrentAnimation("row"+(this.pipeFlip-1));
					this.pipeFlip--;
				}
				else{
					this.renderable.setCurrentAnimation("row"+(this.pipeFlip+1));
					this.pipeFlip++;
				}
				//game.data.buttonLink = null;
			}
		}
		//game.data.buttonLink = null;
		
		if(this.renderable.isCurrentAnimation("row2"))
			if(this.switchID!=null) game.data.globals[this.switchID] = true;
		else if(this.switchID!=null) game.data.globals[this.switchID] = false;
		
		this.parent();
		return true;
	}
	
});

/* ButtonEntity ***************
 * Description:
 * 		Button for changing pipes
 * Entity Properties:
 * 		type: which button link to change
 */
game.ButtonEntity = me.ObjectEntity.extend({
	init: function(x,y,settings){
		settings.image = "button1";
		settings.spritewidth = 32;
		this.parent(x,y,settings);
		//me.input.registerPointerEvent('mousedown',this,this.onMouseDown.bind(this));
	},
	
	//onMouseDown: function(){},
	
	update: function(){
		if(game.mouseIsOver(this) && me.input.isKeyPressed('click'))
			game.data.buttonLink = this.type;
		this.parent();
		return true;
	}
});

game.ResetEntity = me.ObjectEntity.extend({
	init: function(x,y,settings){
		settings.image = "blank";
		this.parent(x,y,settings);
	},
	
	update: function(){
		game.data.buttonLink = null;
		this.parent();
		return true;
	}
});
