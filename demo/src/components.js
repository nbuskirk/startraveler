Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  }, 
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});
Crafty.c('ui_button', {
	init: function() {
		this.requires('2D, Canvas, Mouse');
	},
	setup: function(spr,sprOver, sprX, sprY,sceneName) {
		this._sprName = spr;
		this._sprNameOver = sprOver;
		this.addComponent(this._sprName)
		this.x = (Crafty.viewport.width/2 - this.w/2)+sprX;
		this.y = (Crafty.viewport.height/2 - this.h/2)+sprY;
		this.bind('MouseOver',function(){ 
			this.removeComponent(this._sprName).addComponent(this._sprNameOver);
		})
		.bind('MouseOut',function() {
			this.removeComponent(this._sprNameOver).addComponent(this._sprName);
		})
		.bind('Click',function() {
			Crafty.scene(sceneName);
		})
		return this;
	}
});
Crafty.c('ViewportBounded', {
	init: function() {
		this.requires('2D');
	},
	checkOutOfBounds: function(oldPosition) {
		if(!this.within(0, 0, Crafty.viewport.width, Crafty.viewport.height-16)) {
			this.attr({x: oldPosition.x, y: oldPosition.y});
		}
	}
});
Crafty.c('FadeOut', {
	init: function() {
		this.requires('2D');
		this.bind("EnterFrame", function() {
			this.alpha = Math.max(this._alpha - this._fadeSpeed, 0.0);
			if (this.alpha < 0.05) {
				this.trigger('Faded');
				this.destroy();
			}
		});
	},
	fadeOut: function(speed) {
		this._fadeSpeed = speed;
		return this; // so we can chain calls to setup functions
	}
});
Crafty.c('PlayerAvatar', {
	init:function() {
        this._movementSpeed = 2;
		this._enteringdoor = false;
		this.requires('2D, Canvas,Twoway,ViewportBounded, spr_avatar, SpriteAnimation, Collision')
		.collision( [(this.w/2)-5,0], [(this.w/2)+5,0], [(this.w/2+5),this.h], [(this.w/2)-5,this.h])
		.attr({x:32,y:Crafty.viewport.height/2,z:1000})
		.twoway(this._movementSpeed)
		.reel('WalkLeft',400,0,1,3)
		.reel('WalkRight',400,0,2,3)
		.reel('WalkDown',400,0,0,2)
		.reel('WalkUp',400,0,3,3)
		.bind('KeyDown',function(e) {
			if (e.key === Crafty.keys.W || e.key === Crafty.keys.UP_ARROW) {
				this.animate('WalkUp',-1);
				this._enteringdoor = true;
			}
		})
		.bind('KeyUp',function(){
			this.animate('WalkDown',1,0);
			this._enteringdoor = false;
		})
		.bind('NewDirection', function(oldPosition) {
            if(oldPosition.x>0) {
				this.animate('WalkRight',-1);
            } else if(oldPosition.x<0) {
				this.animate('WalkLeft',-1);
            }  else {
				this.animate('WalkDown',1,0);
            }
        })
        .bind('Moved',function(oldPosition){ 
            this.checkOutOfBounds(oldPosition);
        });
	},
	_stopMovement:function(){ 
		this._speed = 0;
		this.unbind('KeyDown');
		this.unbind('KeyUp');
		this.removeComponent('Twoway');
		this.animate('WalkUp',1);
	}
});
Crafty.c('PlayerCharacter', {
	init: function() {
		this.flyspeed = 4;
		this._refireRate = 300; //milliseconds
		this.requires('2D, Canvas, Fourway, Collision, ViewportBounded, spr_player, Mouse, SpriteAnimation')
		.collision([48,0], [0,90], [96,90])
		.reel('FlyLeft', 350, 2, 0, -3)
		.reel('FlyRight',350,2,0,3)
		.reel('FlyUp',0,2,0,1)
		.attr({x: (Crafty.viewport.width/2)-48, y: Crafty.viewport.height - 128,z:1000})
		.fourway(this.flyspeed)		
		.bind('KeyDown', function(e) {
			if (e.key === Crafty.keys.SPACE) {
				this._fire();
			}
			if(e.key === Crafty.keys.R) {
				this._return_to_base();
			}
		})
		.bind("Click",function(){ 
			this._fire();
		})
		.bind("NewDirection",function(data){
			if (data.x > 0) {
				this.animate('FlyRight',1);
			} else if (data.x < 0) {
				this.animate('FlyLeft',1);
			} 
			else {
				this.animate('FlyUp',1);
			}
		})
		.bind('Moved', function(oldPosition) {
			this.checkOutOfBounds(oldPosition);
         });
		 Game.activeShip = this;
	},
	_fire:function(){ 
		Crafty.audio.play("shoot",1, 0.75);
		Crafty.e('Bullet').attr({x:this.x+41,y:this.y-10});
		return this;
	},
	_setSpeed:function(e){
		this.removeComponent('Fourway');
        this.addComponent('Fourway').fourway(e);
		return this;
	},
	_return_to_base: function() {
		Game.enemySpawner._stopSpawner();
		Crafty.scene('Dock');
		return this;
	}
});
Crafty.c('EnemySpawner', {
	init:function() {
		this.requires('2D');
		Game._spawnedenemies = 0;
		Game.enemySpawner = this;
		this._timer = setInterval(function(){ Game.enemySpawner._enemySpawner() },1000);
	},
	_enemySpawner:function() {
		console.log('spawning enemy');
		Crafty.e('EnemyShip');
		Game._spawnedenemies++;
		if(Game._spawnedenemies>=Game.enemyMax){
			this._stopSpawner();
		}
	},
	_stopSpawner:function() {
		clearInterval(this._timer);
	}
});
Crafty.c('StageClicker', {
	init:function() {
		this.requires('2D, Canvas, Mouse')
		.attr({w: Crafty.viewport.width, h: Crafty.viewport.height, x:0, y:0,z:5000})
		.bind("MouseDown",function(e){
			if(e.mouseButton == Crafty.mouseButtons.LEFT) {
				Crafty('PlayerCharacter')._fire();		
				this.__refire  = setInterval(function(){ 
					Crafty('PlayerCharacter')._fire();
				}, Crafty('PlayerCharacter')._refireRate);
			}
		})
		.bind("MouseUp",function(){ 
			this._reset();
		})
	},
	_reset:function() {
		clearInterval(this.__refire);
	}
});
Crafty.c('BGScroller',{
	init:function() {
		this.requires('2D, Canvas, spr_bgscroll')
		.attr({x:0,y:0,z:1})
		this._setup()
		.bind('EnterFrame',function() {
			this.y+=0.25;
			if(this.y>=0){
				this.y=0;
				this.unbind('EnterFrame');
			}
		});
	},
	_setup:function() {
		this._y = (this._h * - 1)+Crafty.viewport.height;
		return this;
	}
})