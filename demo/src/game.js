var Game = {
	enemyCount: 5,
	enemyMax: 5,
	hitCounter: 0,
	map_grid: {
		width:  15,
		height: 50,
			tile: {
				width:  32,
				height: 32
			}
	},
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},
	start: function() {
		Crafty.init(450,700); 
		
		Crafty.scene('Loading');
	},
	getParticles: function(maxParticles, size, sizeRandom, speed, speedRandom, lifeSpan, lifeSpanRandom, angle, angleRandom, startColour, startColourRandom, endColour, endColourRandom, sharpness, sharpnessRandom, spread, duration, fastMode, gravity, jitter){
		var options = {
			maxParticles: maxParticles,
			size: size,
			sizeRandom: sizeRandom,
			speed: speed,
			speedRandom: speedRandom,
			lifeSpan: lifeSpan,
			lifeSpanRandom: lifeSpanRandom,
			angle: angle,
			angleRandom: angleRandom,
			startColour: startColour,
			startColourRandom: startColourRandom,
			endColour: endColour,
			endColourRandom: endColourRandom,
			sharpness: sharpness,
			sharpnessRandom: sharpnessRandom,
			spread: spread,
			duration: duration,
			fastMode: fastMode,
			gravity: gravity,
			jitter: jitter
		};
		return options; 
	},
	removeEnemy: function() {
		Game.enemyCount--;
		Game.displayCounter.text(Game.hitCounter+' / '+Game.enemyCount);
		if(Game.enemyCount === 0){
			//Crafty.trigger('MouseUp'); // in case you are autofiring, release the button
			if (typeof(Game.ui_lifeMeter._rechargeTimer) !== "undefined") {
			Game.ui_lifeMeter.stopRecharge();
			Game.enemySpawner._stopSpawner();
			Crafty('StageClicker')._reset();
			//Crafty.scene('Win');
			}else {
				Game.enemySpawner._stopSpawner();
				Crafty('StageClicker')._reset();
				//Crafty.scene('Win');
			}
			
			//spawn boss
			Crafty.e('Boss1');
			
		}
	}
};
