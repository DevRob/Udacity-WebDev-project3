var Game = function() {
    'use strict';                         //Game Class constructor.
    this.level = 1;                             //Holds basic variables of the game.
    this.enemies = 4 ;                          //Level, number of enemies, Collectables.
    this.map = [];
    this.player  = new Player(images[3][0]);
    this.key  = 0;
    this.gems = 0;
    this.girl = new Collectable(images[3][1]);
};

Game.prototype.newLevel = function() {      //This function holds the logic of the game and create enemies and collectables.
    this.map = allMaps[this.level - 1];             //Additional properties : current (map/level)
    this.freeLanes = this.map.freeLane(this.map);   //holds the lanes built up only from stones.
    this.gems = allMaps[this.level - 1].gems;       //number of gems spawn on level.
    this.allGems =[];
    this.allEnemies  = [];

    for (var i = 0, len =  this.enemies + this.level; i < len; i++) {
        var enemy = new Enemy(images[2]);               							//this for loop creates enemies and fill up the allEnemies Object.
        this.allEnemies.push(enemy);
        this.allEnemies[i].position = [0, this.freeLanes[i % this.freeLanes.length]];
    }

    this.key = new Collectable(images[4]);          //creates the key and place it on the map.
    this.key.position = [2, 0];
    this.key.scale = 0.5;
    this.vacStone = this.map.freePlace(this.map);   				//stores the stone position on map.
    if (this.level < allMaps.length) {              				//checking if the player in on the last map .
        for (i = 0, len = this.gems; i < len; i++) {
            var gem = new Collectable(images[1][Math.floor((Math.random() * 3))]);
            this.allGems.push(gem);                 								//this for loop creates gems and fill up the allGems Object.
            this.allGems[i].position = this.vacStone[Math.floor(Math.random() * this.vacStone.length)];
            this.vacStone.splice(this.allGems[i],1);
        }

    }
    else if (this.level == allMaps.length) {        //if player on last map draw the girl and reset selector.
        this.key.sprite = images[5];
        this.key.position = [2, 2];
        this.girl.position = [2, 1];
        this.girl.scale = 1;
    }
    this.player.reset(this.map);                    //reset player.
};

Game.prototype.checkCollisions = function(actor1, actor2, area) { 		//Checking collision between actors.
    var x1 = actor1.position[0] * pixOfGrid[0];
    var y1 = actor1.position[1] * pixOfGrid[1];
    var x2 = actor2.position[0] * pixOfGrid[0];
    var y2 = actor2.position[1] * pixOfGrid[1];
    return (Math.abs(x1 - x2) < area) && (Math.abs(y1 - y2) < area);
};

Game.prototype.eventHandler = function() {                      		//Holds the commands for events in game.
    this.allEnemies.forEach(function(enemy) {
        if (enemy.exist && this.checkCollisions(enemy, this.player, 50)) {
            if (this.player.lives > 1) {                        		//checking for collision between player and enemies.
                this.player.lives--;
                this.player.reset(this.map);
            }
            else {
            location.reload();
            }
        }
    }, this);

    this.allGems.forEach(function(gem) {
        if (gem.exist && this.checkCollisions(gem, this.player, 50)) {
            gem.exist = false;                                  		//checking for collision between player and gems.
            this.player.score += 150;
        }
    }, this);

    if (this.key.exist && this.checkCollisions(this.key, this.player, 50)) {
        if (this.level < allMaps.length) {                      		//checking for collision between player and key.
            this.key.exist = false;
            this.level++;
            this.player.score += 300;
            this.newLevel();
        }
        else {
            location.reload();
        }
    }
};
