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
