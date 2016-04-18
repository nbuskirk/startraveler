Crafty.scene('Game', function() {
	Game.enemyCount = 5; //reset the count
	Game.hitCounter = 0;
	Game.displayCounter = Crafty.e('2D, Canvas, Text')
		.text(Game.hitCounter+' / '+Game.enemyCount)
		.attr({ x: 32, y: 32,w:50,z:5000 })
		.textColor("#FFFFFF")
		.textFont({ size: '22px', family: 'Fixedsys'})
	Crafty.audio.stop("dock");
	Crafty.audio.play("wave1",1,1);
	Crafty.audio.play("theme",-1,0.25);
	var game_particles = Game.getParticles(150,Crafty.math.randomNumber(1,3),3,0.1,0,60,7,180,180,[255,255,255,1],[0,0,0,0],[255,255,255,0],[0,0,0,0],0,0,Crafty.viewport.width,-1,true,{x:0,y:0.1, z:1000},0);
	
	Crafty.e('2D,Canvas,Particles').particles(game_particles);
	Crafty.e('2D, Planet').attr({x:64,y:-400});
	Crafty.e('PlayerCharacter');
	Crafty.e('ui_lifeMeter');
   Crafty.e('EnemySpawner');
   //Crafty.e('Boss1');
	Crafty.e('StageClicker');
	
	Crafty.e('BGScroller');
	
	Crafty.e('2D, Canvas, Text')
		.text('R: RETURN')
		.attr({ x: 25, y: Crafty.viewport.height-64,w:672,z:5000 })
		.textColor("#FFFFFF")
		.textFont({ size: '22px', family: 'Fixedsys'})
});
Crafty.scene("Introduction",function(){ 	
	Crafty.audio.play("dock",-1);
	Crafty.audio.stop("theme");	
	Crafty.background('#000000 url(assets/introvert.png) no-repeat center center ');
	//$('#cr-stage').css('background-size','cover');
	var intro_particles = Game.getParticles(150,Crafty.math.randomNumber(1,5),5,0.1,0,60,7,0,0,[255,255,255,1],[0,0,0,0],[255,255,255,0],[0,0,0,0],0,0,Crafty.viewport.width,-1,true,{x:0,y:0.01},0);
	Crafty.e("2D,Canvas,Particles").particles(intro_particles);
	Crafty.e('ui_button').setup('spr_btn_newgame','spr_btn_newgame_over',0,80,'Dock');
});
Crafty.scene('Dock',function(){
	Crafty.audio.stop("theme");
	Crafty.audio.stop("dock");
	//Crafty.e("2D, Canvas, Image").image("assets/dock1.png");
	Crafty.background('url(assets/dock1.png) repeat-x center center');
	Crafty.e("Door")				
	Crafty.e('PlayerAvatar');
	
});
Crafty.scene('Win',function() {
	Crafty.audio.stop("theme");	
	Crafty.background('green');
	Crafty.e('ui_button').setup('spr_btn_restart','spr_btn_restart_over',0,0,'Introduction');
})
Crafty.scene('Lose',function() {
	Crafty.audio.stop("theme");	
	Crafty.background('red');
	Crafty.e('ui_button').setup('spr_btn_restart','spr_btn_restart_over',0,0,'Introduction');
})
Crafty.scene('Loading', function(){
	Crafty.e('2D, Canvas, Text, Color')
		.text('Loading...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.color('red')
	Crafty.load(['assets/boss1.png','assets/dock1.png','assets/bgscroll.png','assets/buttons.png','assets/door.png','assets/ship.png','assets/avatar.png','assets/effects2.png','assets/enemy.png','assets/planet.png','assets/ammo.png','assets/powerup.png','assets/audio/xwing.mp3','assets/audio/explosion.mp3','assets/audio/powerup.mp3','assets/audio/theme2.mp3','assets/audio/dock.mp3','assets/audio/wav1.mp3'], function(){
		Crafty.sprite(96, 'assets/ship.png', {
			spr_player:  [2, 0]
		});
		Crafty.sprite(450,'assets/boss1.png', {
			spr_boss1: [0,0]
		});
		Crafty.sprite(900,700,'assets/dock1.png',{
			spr_dockscroll: [0,0]
		});
		Crafty.sprite(450,2100,'assets/bgscroll.png', {
			spr_bgscroll: [0,0]
		});
		Crafty.sprite(24,39,'assets/powerup.png',{
			spr_powerbomb: [0,0]
		});
		Crafty.sprite(16,32, 'assets/ammo.png', {
			spr_bullet:    [0, 0]
		});
		Crafty.sprite(192, 'assets/planet.png', {
			spr_planet:    [0, 0]
		});
		Crafty.sprite(96, 'assets/enemy.png', {
			spr_enemy:    [0, 0]
		});
		Crafty.sprite(39,36, 'assets/effects2.png', {
			spr_explosion: [0,0]
		});
		Crafty.sprite(96, 'assets/avatar.png', {
			spr_avatar: [1,0]
		});
		Crafty.sprite(288, 192, 'assets/door.png', {
			spr_door:	[0,0]
		});
		Crafty.sprite(256,64, 'assets/buttons.png', {
			spr_btn_newgame: [0,0],
			spr_btn_newgame_over: [1,0],
			spr_btn_restart: [2,0],
			spr_btn_restart_over: [2,1]
		});
		Crafty.audio.add("shoot", "assets/audio/xwing.mp3");
		Crafty.audio.add("explode", "assets/audio/explosion.mp3");
		Crafty.audio.add("powerup", "assets/audio/powerup.mp3");
		Crafty.audio.add("theme", "assets/audio/theme2.mp3");
		Crafty.audio.add("dock", "assets/audio/dock.mp3");	
		//Crafty.audio.add("wave1","assets/audio/wav1.mp3");
		Crafty.scene("Introduction");
	},function(e){ 
		//console.log(e);
		Crafty.e('2D, Canvas, Text, Color')
		.text(e.percent)
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() }).color('red')
	})
});