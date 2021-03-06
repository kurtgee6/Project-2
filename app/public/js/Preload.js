var LoM = LoM || {};

var initialized = false;
var start = false;

// loading game assets
LoM.Preload = function(){};

LoM.Preload = {
    preload: function(){
        // show logo in loading screen
        // this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo')
        this.game.add.tileSprite(0 ,0, width, height, 'boot-bg'); 
        // this.splash.anchor.setTo(0.5);
    for(id in LoM.playerDB){
        LoM.Preload.load.spritesheet('user-'+id,'img/users/user-'+id+'.png',64,64,273)
    }
    // load spells
    var spellType = ['fire','ice','poison',"shadow"]
    
    spellType.forEach(function(spell){
        LoM.Preload.load.spritesheet(spell,'img/spells/'+spell+'.png',126,124,38);
    })

    this.load.image('battleBG','/img/battleBG.png')
    this.load.image('health','/img/items/health.png',64,64)
    this.load.tilemap('map', 'img/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('tileset', 'img/map/tilesheet.png',32,32);
    this.load.spritesheet('npc-1','img/sprites/3.png',63,63,36); // this will be the sprite of the players

    },

    create: function(){
        // white background for loading screen
        this.game.stage.backgroundColor = '#fff';
        //physics system for movement
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody = true;

        // grab user from localStorage
        var userLocalStor = JSON.parse(localStorage.getItem('user'));
        var userID = userLocalStor.user_id; 
        let userDB = LoM.playerDB[userID];
        var sprite = userDB.Sprite;
        
        // console.log(userDB)
        // generate user game profile
        var user = {
            id: userID,
            profile: userDB.profile,
            name: userDB.name,
            online: true,
            role: 'player',
            status: userDB.status,
            spells: userDB.Spell_Inventories,
            game_state: userDB.Game_State,
            world:{
                x: userDB.Game_State.lastX ,
                y: userDB.Game_State.lastY, 
                state: userDB.Game_State.state
            },
            velocity: {x:0,y:0},
            sprite: 'user-'+userID,
            based_stats: userDB.Stat,
            inventory: userDB.Inventories,
            equipments: {},
            spritesheet: {
                weapon: parsePNG(sprite.weapon),
                spell: parsePNG(sprite.spell),
                head: parsePNG(sprite.head),
                torso: parsePNG(sprite.torso),
                leg: parsePNG(sprite.leg),
                feet: parsePNG(sprite.feet),
                body: parsePNG(sprite.body)
            }
        }

        LoM.userInfo = user;
        // ENABLE KEYBOARD INPUT
        // --------------------------------------------------------------
        LoM.cursor = LoM.game.input.keyboard.createCursorKeys();  
        LoM.game.input.keyboard.addKey(Phaser.Keyboard.W)
        LoM.game.input.keyboard.addKey(Phaser.Keyboard.A)
        LoM.game.input.keyboard.addKey(Phaser.Keyboard.S)
        LoM.game.input.keyboard.addKey(Phaser.Keyboard.D)
        
        setTimeout(function(){
            setTimeout(function(){
                $('ul.tabs').tabs()
                },200);

            $('#sidebar').fadeIn()
            },100
        )
        LoM.user.getInventory(function(){
            Client.userInfoDB(user);
        })
    }
}

LoM.playerControl.eventListener = function(worldX,worldY){
     //  if no event is active
     if(LoM.eventActive.state){
         if(!LoM.eventActive.lastLocationSaved){
             LoM.eventActive.lastLocation = {
                 x: LoM.spriteMaster[LoM.userInfo.id].x,
                 y: LoM.spriteMaster[LoM.userInfo.id].y      
             } 
             LoM.eventActive.lastLocationSaved = true
         }else{
             var lastLocation = LoM.eventActive.lastLocation
             var dX = worldX - lastLocation.x;
             var dY = worldY - lastLocation.y;
             var distance = Math.sqrt( Math.pow(dX, 2) + Math.pow(dY, 2));
             if(distance > 20){
                 LoM.eventActive.state = false;
                 removeInteraction('.interaction')
                 removeInteraction('.npc-interaction')
                 LoM.eventActive.player = {};
                 LoM.eventActive.target = {};
                 LoM.eventActive.lastLocationSaved = false;
                //  console.log('reset event')
             }
         }
     }
};

LoM.playerControl.controlInput = function(worldX,worldY){

    if(LoM.game.input.keyboard.isDown(Phaser.Keyboard.W)){  
        Client.move({dir:'up', id: LoM.userInfo.id,  worldX: worldX, worldY: worldY, state: LoM.userInfo.world.state});
    }else if(LoM.game.input.keyboard.isDown(Phaser.Keyboard.S)){;
        Client.move({dir: 'down', id: LoM.userInfo.id, worldX: worldX, worldY: worldY, state: LoM.userInfo.world.state});
    }else if(LoM.game.input.keyboard.isDown(Phaser.Keyboard.A)){
        Client.move({dir:'left', id: LoM.userInfo.id,  worldX: worldX, worldY: worldY, state: LoM.userInfo.world.state})
    }else if(LoM.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        Client.move({dir:'right', id: LoM.userInfo.id,  worldX: worldX, worldY: worldY, state: LoM.userInfo.world.state})
    }else if(LoM.game.input.keyboard.upDuration(65,75)|| LoM.game.input.keyboard.upDuration(87,75) || LoM.game.input.keyboard.upDuration(83,75) || LoM.game.input.keyboard.upDuration(68,75)){
        Client.move({dir:'stationary', id:LoM.userInfo.id, worldX: worldX, worldY: worldY, state: LoM.userInfo.world.state})
    }
}

var parsePNG = function(url){
    // console.log(url)
    if(url !== null){
    var parsedURL = url.split('/')
    var imgFile = parsedURL[parsedURL.length-1];
    var filename = imgFile.split('.')[0];
    return filename;
    }
}

function randomInt (low,high){
    return Math.floor(Math.random() * (high - low) + low);
}


function removeInteraction(div){
    
    $(div).fadeOut(function(){
        $(div).empty();
    });
    // console.log('hey')
}


var updateStats = function(){
    let stats = ['attack','defense','agility','hp','mp']
    let inventory = LoM.userInfo.inventory
    for(i = 0; i < inventory.length; i++){
        switch(iventory.item.slot){
            case 1:
        }
    }
}