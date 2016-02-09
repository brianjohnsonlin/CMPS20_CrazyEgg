game.PauseButton = me.ObjectEntity.extend({
	init: function(x, y, settings){
		this.parent(x, y, settings);
		me.input.registerPointerEvent('mousedown', this, this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		if(game.data.pause === false){
			game.data.pause = true;
		}
		
	}
	
});

game.BackButton = me.ObjectEntity.extend({
	init: function(x, y, settings){
		this.parent(x, y, settings);
		me.input.registerPointerEvent('mousedown', this, this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		if(game.data.pause === true){
			game.data.back = true;
		}
	}
	
});

game.Restart = me.ObjectEntity.extend({
	init: function(x, y, settings){
		this.parent(x, y, settings);
		me.input.registerPointerEvent('mousedown', this, this.onMouseDown.bind(this));
	},
	
	onMouseDown : function() {
		if(game.data.pause === true){
			game.data.restart = true;
		}
	}
});

game.PauseEntity = me.ObjectEntity.extend({
	init: function(x, y, settings){
		this.parent(x, y, settings);
		this.z = Infinity;
		this.renderable.addAnimation("on",[0]);
		this.renderable.addAnimation("off",[1]);
		this.renderable.setCurrentAnimation("off");
		paused = false;
	},
	
	update: function(){
	    //PAUSE FUNCTION
	   if (game.data.pause === true) {
	   	paused = true;
	    me.state.pause();
		this.renderable.setCurrentAnimation("on");
		me.audio.pauseTrack();
		    var resume_loop = setInterval(function check_resume() {
		        if (game.data.back === true) {
		            clearInterval(resume_loop);
		            me.audio.resumeTrack();
		            me.state.resume();
		            paused = false;
		            game.data.pause = false;
		            game.data.back = false;
		        }
		        if (game.data.restart === true){
		        	clearInterval(resume_loop);
		        	me.state.resume();
		        	me.state.change(me.state.PLAY);
		        	paused = false;
		        	game.data.pause = false;
		        	game.data.restart = false;
		        }
		    }, 100);
		}
		if(paused === false)
    		this.renderable.setCurrentAnimation("off");
		this.parent();
	}
});