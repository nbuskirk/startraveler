Crafty.c('Boss1',{
	init:function() {
		this._moving = false;
		this._life = 5000;
		this._flashing = false;
		this.requires('2D,Canvas, spr_boss1, Collision').attr({x:0,y:-450,z:1000})
		.onHit('Bullet',this._hit)
		.onHit('PlayerCharacter',this._hitpc)
		this._makeEntrance();
	},
	_hitpc:function(e) {
		e[0].obj.destroy();
		Crafty.audio.play("explode",1,0.25);
		Crafty('StageClicker')._reset();
		Crafty.scene('Lose');
	},
	_hit:function(e) {
		bullet = e[0].obj;
		bullet.destroy();
		this._life--;
		this._alpha = 0.5;
		this._alpha = 1;
		if(this._life === 0) {
			Crafty('StageClicker')._reset();
			Crafty.scene('Win');
		}
		var bullet_particles = Game.getParticles(1000,2,5,1,1.2,Crafty.math.randomNumber(0,30),Crafty.math.randomNumber(0,30),Crafty.math.randomNumber(0,360),Crafty.math.randomNumber(0,360),[Crafty.math.randomNumber(0,255),Crafty.math.randomNumber(0,255),Crafty.math.randomNumber(0,255),1],[0,0,0,0],[Crafty.math.randomNumber(0,255),Crafty.math.randomNumber(0,255),Crafty.math.randomNumber(0,255),0.25],[0,0,0,0],20,10,2,3,true,{x:0,y:0},0);
		Crafty.e("2D,Canvas,Particles").particles(bullet_particles).attr({x:bullet.x,y:bullet.y}); //bullet particles
	},
	_makeEntrance:function() {
		this._moving = true;
		this.bind('EnterFrame',function() {
			this.y+=2;
			if(this.y>=0){
				this.unbind('EnterFrame').collision().onHit('Bullet',this._hit).onHit('PlayerCharacter',this._hitpc);
				Game.rainbowText = Crafty.e('2D, Canvas, Text, FadeOut')
				.attr({ x:50, y: Crafty.viewport.height/2,z:5000 })
		
				.text('Super lasers activated!')
				.textColor("#FFFFFF")
				.textFont({ size: '22px', family: 'Fixedsys'}).fadeOut(0.005);
				Crafty.trigger('MouseUp');
				Game.activeShip._refireRate = 25; //rainbow laser time
				
			}
		})
	}
})
Crafty.c('EnemyShip', {
	init:function(){
		this._life = 3; //shots to kill
		this._flyspeed = Crafty.math.randomNumber(1,7);
		this.requires('2D, Canvas, Collision, spr_enemy')
		.attr({z:2000});
		this.flip("Y");
		this._randomlyPosition()
		.collision([48,96], [0,6], [90,6])
		.onHit("Bullet",this._hitByBullet)
		.onHit("PlayerCharacter",this._hitByPlayer)
		.bind("EnterFrame",function(){
		
			this.y+=this._flyspeed;
			if(this.y>Crafty.viewport.height){
				this._hitwall();
			}
		});
	},
	_hitwall:function(e){
		Game.removeEnemy();
		this.destroy();
		var poptions = Game.getParticles(1000,5,15,3,3,29,7,0,0,[200,200,200,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],20,10,100,1,true,{ x: 0, y: 0.1 },1);
		Crafty.e("2D,Canvas,Particles").particles(poptions).attr({x:this.x+16,y:this.y+96});
		Crafty.audio.play("explode",1,0.25);
	},
	_hitByPlayer:function(data){ 
		Game.removeEnemy();
		Game.ui_lifeMeter.takeHit();
		this.destroy();
		var poptions = Game.getParticles(500,3,5,1,1.2,29,7,0,0,[255,0,0,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],48,10,50,1,true,{x:0,y:0},1);
		Crafty.e("2D,Canvas,Particles").particles(poptions).attr({x:this.x+16,y:this.y+96});
		Crafty.e("Explosion").attr({x:this.x+16,y:this.y+50});
		Crafty.audio.play("explode",1,0.25);
	},
	_hitByBullet:function(data){
		this._life--;
		var bullet = data[0].obj;
		var bullet_particles = Game.getParticles(500,2,5,1,1.2,29,7,Crafty.math.randomNumber(0,360),Crafty.math.randomNumber(0,360),[208,20,0,1],[0,0,0,0],[248,200,48,0.25],[0,0,0,0],20,10,5,1,true,{x:0,y:0},0);
		Crafty.e("2D,Canvas,Particles").particles(bullet_particles).attr({x:bullet.x,y:bullet.y}); //bullet particles	
		bullet.destroy(); //bullet
		if(this._life===0){
			Game.hitCounter++;
			Game.removeEnemy();
			this.destroy();			
			var ship_particles =  Game.getParticles(1500,Crafty.math.randomNumber(1,5),Crafty.math.randomNumber(1,5),1,1.2,29,7,Crafty.math.randomNumber(0,360),Crafty.math.randomNumber(0,360),[200,200,200,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],20,10,5,1,true,{x:0,y:0},1);
			var dropchance = Crafty.math.randomNumber(1,5);
			Crafty.e("2D,Canvas,Particles").particles(ship_particles).attr({x:(this.x+(this.w/2)),y:this.y+(this.h/2) }); //ship explosion particles
			Crafty.e("Explosion").attr({x:(this.x+(this.w/2))-20,y:(this.y+(this.h/2))-20});
			Crafty.audio.play("explode",1,0.25);
			if(Crafty.math.withinRange(dropchance,1,1)){
				Crafty.e('SpeedBooster').attr({x:this.x+16,y:this.y+96});
			}
		}
	},
	_randomlyPosition:function() {
		var randomX = Crafty.math.randomNumber(1, Crafty.viewport.width - 96);
		var randomY = Crafty.math.randomNumber(1,-Crafty.viewport.height);
		randomY = randomY+(-this._flyspeed*(Crafty.viewport.height));		
		this.attr({x: randomX, y: randomY });
		return this;
	}
});