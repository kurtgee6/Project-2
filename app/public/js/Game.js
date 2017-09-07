// -------------------------------------------------------------------------------------------
// INITALIZING GAME STATE 
// -------------------------------------------------------------------------------------------
// setting up rpg canvas by declaring single rpg state with div id='rpg'

var LoM = LoM || {};
var game;

LoM.Game = function(){};

LoM.Game = {
    // -------------------------------------------------------------------------------------------
    // INITALIZING GAME STATE
    // -------------------------------------------------------------------------------------------
    init:function(){
        this.stage.disableVisibilityChange = true;
    },

    // -------------------------------------------------------------------------------------------
    // CREATE GAME STATE
    // -------------------------------------------------------------------------------------------    
    create: function(){
        // GAME VIEWS INITIALIZATION
        // -----------------------------------------------------------
        
	    this.time.advancedTiming = true;
        this.time.desiredFps = 30;
        this.time.suggestedFps = 30;
        
        game = this
        this.gameReady = false;
        this.eventActive = {};
        this.eventActive.state = false;
        this.battleInfo = {}
        // generate data map
        this.groupMap = {}
        this.spriteMap = {}

        // generate children objects for this.groupMap and this.spriteMap
        // this allow any element generated by the game to be trackable and refer to later
        // look at generator.js for details
        this.genDataMap(['tileMap','layers','collisions','players','npcs','enemies','objects']);
        
        // Generate Layer Collisions
        // -----------------------------------------------------------------------
        
        // set collision events for the game for user interactions
        // look at collisions for more dtails
        this.setCollisions()

        // generate all online users accessing the game
        for(i = 0; i < this.playerArray.length;i++){
            this.addPlayer(this.playerArray[i])
        }

        var sprite2Info = {
            id: '1',
            sprite: 3,
            role: 'npc',
            name: 'Mysterious Stranger',
            velocity: {x: -10, y: 0},
            world: {x: 390,y:280}
        }


        this.addPlayer(sprite2Info);
        this.sprite2 = this.groupMap.npcs['sample'];

        // after all players is load for the current user, the game start
        // this prevent update from running before all the players is loaded
        this.gameReady = true;

        // ENABLE KEYBOARD INPUT
        // --------------------------------------------------------------
        this.cursor = this.input.keyboard.createCursorKeys();  
        this.input.keyboard.addKey(Phaser.Keyboard.W)
        this.input.keyboard.addKey(Phaser.Keyboard.A)
        this.input.keyboard.addKey(Phaser.Keyboard.S)
        this.input.keyboard.addKey(Phaser.Keyboard.D)
    },

    // -------------------------------------------------------------------------------------------
    // UPDATING GAME STATE
    // -------------------------------------------------------------------------------------------    
    update: function(){
        // if all player data is loaded, start the game update
        if(this.gameReady){
            // always listen to building collisions
            this.physics.arcade.collide(this.groupMap.players, this.spriteMap.collisions['wallCollisions'],this.spriteMap.collisions['wallCollisions'].data['onCollide'], null, this);
            
            // update world position 
            var worldX = this.spriteMap.players[this.userInfo.id].x;
            var worldY = this.spriteMap.players[this.userInfo.id].y;

            this.checkLayerCollisions();
            //  if no event is active
            if(this.eventActive.state){
                if(!this.lastLocationSaved){
                    this.spriteMap.players[this.userInfo.id].lastLocation = {
                        x: this.spriteMap.players[this.userInfo.id].x,
                        y: this.spriteMap.players[this.userInfo.id].y      
                    } 
                    this.lastLocationSaved = true
                }else{
                    var lastLocation = this.spriteMap.players[this.userInfo.id].lastLocation
                    var dX = worldX - lastLocation.x;
                    var dY = worldY - lastLocation.y;
                    var distance = Math.sqrt( Math.pow(dX, 2) + Math.pow(dY, 2));
                    if(distance > 20){
                        this.eventActive.state = false;
                        this.eventActive.player = {};
                        this.eventActive.target = {};
                        this.lastLocationSaved = false;
                        console.log('reset event')
                        removeInteractionDisplay()
                    }
                }
            }

            // listen for key press for character movement and pass that information to socket.io
            // if the last key pressed was 100ms ago, then listen stop updating to server 
            if(this.input.keyboard.isDown(Phaser.Keyboard.W)){     
                Client.move({dir:'up', id: this.userInfo.id,  worldX: worldX, worldY: worldY });
            }else if(this.input.keyboard.isDown(Phaser.Keyboard.S)){;
                Client.move({dir: 'down', id: this.userInfo.id, worldX: worldX, worldY: worldY });
            }else if(this.input.keyboard.isDown(Phaser.Keyboard.A)){
                Client.move({dir:'left', id: this.userInfo.id,  worldX: worldX, worldY: worldY })
            }else if(this.input.keyboard.isDown(Phaser.Keyboard.D)){
                Client.move({dir:'right', id: this.userInfo.id,  worldX: worldX, worldY: worldY })
            }else if(this.input.keyboard.upDuration(65,75)|| this.input.keyboard.upDuration(87,75) || this.input.keyboard.upDuration(83,75) || this.input.keyboard.upDuration(68,75)){
                Client.move({dir:'stationary', id:this.userInfo.id, worldX: worldX, worldY: worldY})
            }
        }
    },

    render: function(){
    },

    randomInt: function (low,high){
        return Math.floor(Math.random() * (high - low) + low);
    },

    checkLayerCollisions: function(){
        // listen to player-npc and player-player interactions
        // this.physics.arcade.collide(this.groupMap.players, this.groupMap.players, this.spriteCollisions, null, this);
        this.physics.arcade.collide(this.groupMap.players, this.groupMap.npcs, this.npcInteractions, null, this);
        // listen for collision interactions
        for(var collision in this.spriteMap.collisions){
            this.physics.arcade.collide(this.groupMap.players, this.spriteMap.collisions[collision], 
                this.spriteMap.collisions[collision].data['onCollide'],null, this);
        }
    }
}





