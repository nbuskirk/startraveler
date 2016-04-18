/* A BULLET */
Crafty.c('Bullet', {
	init: function() {
		this._bulletspeed = 10;		
		this.requires('2D, Canvas, spr_bullet')
		.attr({z:2000})
		this.bind("EnterFrame", function() {
			this.y -= this._bulletspeed;
			if (this.y < 0) {
				this.destroy();
			}
        });
	}
});
/* AN EXPLOSION */
Crafty.c("Explosion", {
	init:function(){ 
		this.requires("2D, Canvas, spr_explosion, FadeOut, SpriteAnimation")
		.attr({z:1000})
		//.fadeOut(0.07)
		.reel('Explode', 400, 0, 0, 13)
		.animate('Explode', 1).bind("AnimationEnd",function(){
			//this.y-=2;
			this.destroy();
		});
	}
});

/* PLANET OBJECT */
Crafty.c('Planet', {
	init: function() {
		this.requires('2D, Canvas, spr_planet')
		.attr({z:1000})
		.bind("EnterFrame",function(){ 
			this.y+=0.50;
		});
	}
});
/* SPEED BOOSTER POWERUP */
Crafty.c('SpeedBooster',{
	init:function(){
		this._movespeed = 1;
		this.requires('2D, Canvas, Collision, spr_powerbomb, SpriteAnimation')
		.attr({z:2000})
		.reel('Animate', 500, 0, 0, 3)
		.animate('Animate',-1)
		.bind('EnterFrame',function(){ 
			this.y+=this._movespeed;
		})
		.onHit('PlayerCharacter', this._addBooster);
	},
	_addBooster:function(e) {
		var player = e[0].obj;
		Crafty.audio.play('powerup',1,0.50);
		var powerup_text = Crafty.e('2D, Canvas, Text, FadeOut')
			.text('SPEED INCREASED')
			.attr({ x: 220, y: 165, z:1001 })
			.textColor("#FFFFFF")
			.textFont({ size: '32px', family: 'Fixedsys'})
			.fadeOut(0.01);		
		var newspeed = player.flyspeed+=1;
		player._setSpeed(newspeed);
		this.destroy();
		return this;
	}
});
/* DOOR OBJECT */
Crafty.c('Door', {
	init:function() {
		this._sceneName = 'Game'; //spawns the hangar door for now
		this.requires('2D, Canvas, Collision, spr_door, SpriteAnimation')
		.collision( [(this.w/2)-10,0], [(this.w/2)+10,0], [(this.w/2+10),this.h], [(this.w/2)-10,this.h])
		.attr({  x:141, y:197,z : 200})
		.reel('OpenDoor',2000,0,0,4)
		.onHit('PlayerAvatar',this._openDoor)
	},
	_openDoor:function(e) {
		var player = e[0].obj;
		if ( player._enteringdoor === true ) {
			player._stopMovement();
			player._enteringdoor = false;
			this.animate('OpenDoor',1).bind('AnimationEnd',function(){ 
					Crafty.scene(this._sceneName);
			});
		}
	}
});
/* LIFE METER UI ELEMENT */
Crafty.c('ui_lifeMeter',{
	init:function(){
		this._lifeMax = Crafty.viewport.width;
		this._lifecount = this._lifeMax; //32 bits of health each hit 64 = 2 hits to start
		this._shieldsRecharging = false;
		this._rechargeDelay = 0.1;
		this._rechargeAmount = 0.10;
		this.requires('2D, Canvas, Color');
		this.attr({w:this._lifecount, h:16, x: 0, y: Crafty.viewport.height-16, z:10000 }).color('#14318e').alpha = 0.85;
		Game.ui_lifeMeter = this;
	},
	takeHit:function() {
		this._lifecount -= 300;
		this.attr({w:this._lifecount});
		if (typeof(Game.ui_lifeMeter._rechargeTimer) !== "undefined" && this._lifecount > 1) {
			this.stopRecharge();
			this.startRecharge();
		} else if(typeof(Game.ui_lifeMeter._rechargeTimer) !== "undefined" && this._lifecount <= 0) {
			this.stopRecharge();
			Game.enemySpawner._stopSpawner();
			Crafty('StageClicker')._reset();
			Crafty.scene('Lose');
		} else {
			this.startRecharge();
		}
	},
	startRecharge:function() {
		this._shieldsRecharging = true;
		this._rechargeTimer = setInterval(function(){ Game.ui_lifeMeter._updateLife() },this._rechargeDelay);
	},
	stopRecharge:function() {
		this._shieldsRecharging = false;
		clearInterval(Game.ui_lifeMeter._rechargeTimer);
	},
	_updateLife:function() {
		this.w+=this._rechargeAmount;
		this._lifecount+=this._rechargeAmount; 
		if(this._lifecount >= this._lifeMax) {
			this.stopRecharge();
		}
		requestAnimationFrame(Game.ui_lifeMeter._updateLife);
	}
});