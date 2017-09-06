var LoM = LoM || {};
var battleInfo = {};
var room;
var user;

// loading game assets
LoM.Battle = function(){};

LoM.Battle = {
    preload: function(){
        var width = 24*32;
        var height = 17*32;

        this.backgroundSprite = this.game.add.tileSprite(0,0, width, height, 'battleBG');
        this.backgroundSprite.scale.x = 3.2  
        this.backgroundSprite.scale.y = 3.2  
        
        this.load.spritesheet('sprite5','img/sprites/sample.png',64,64,273);
        this.load.spritesheet('sprite6','img/sprites/6.png',64,64,273);

        this.battleInfo = LoM.Game.battleInfo;
        user = LoM.Game.userInfo;
    },
    create: function(){
        this.spriteMap = {}
        this.tweenMap = {}

        this.createReceiver(this.battleInfo.receiver)
        this.createInitiator(this.battleInfo.initiator)
        battleUpdate();
    },
    update: function(){

    },
    render: function(){
        // LoM.debug.geom(menu,'#0fffff');
    },

    createInitiator: function(info){
        // console.log(info)
        var sprite =  this.add.sprite(160, 230, 'sprite6');
        sprite.frame = 40;
        sprite.scale.x = 2;
        sprite.scale.y = 2;

        sprite.data.position = "initiator";
        sprite.data.weapon = {};
        sprite.data.weapon.type = 'sword';

        this.battleInfo.initiator.position = "initiator";

        this.addBattleAnimations(sprite,info.id)

        this.spriteMap[info.id] = sprite
    },

    createReceiver: function(info){
        
        this.battleInfo.receiver.position = "receiver";

        var sprite =  this.add.sprite(515, 230, 'sprite5');
        sprite.frame = 13;
        sprite.scale.x = 2;
        sprite.scale.y = 2;
        
        sprite.data.position = "receiver";
        sprite.data.weapon = {};
        sprite.data.weapon.type = 'sword';



        this.addBattleAnimations(sprite,info.id)

        this.spriteMap[info.id] = sprite;   
    },

    addBattleAnimations: function(sprite,id){

        var tweenT = 1500;
        var animT = 15

        if(sprite.data.position === 'initiator'){
            this.tweenMap[id] = {}
            var spell = sprite.animations.add('spell',[39,40,41,42,43,44,44,44,44,44,44,44,44,43,42,41,40,39],true)

            spell.onStart.add(function(){

                var fireball = LoM.Battle.add.sprite(200,230,'fireball')
                var genBall = fireball.animations.add('genBall',[1,2,3,4,5],1000, false)
                var shootBall = fireball.animations.add('shootBall',[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],5000, true)
                var explodeBall = fireball.animations.add('explode', [32,33,34,35,36,37,38,39],1000, false)


                genBall.onComplete.add(function(){
                        var tweenBall =  LoM.Battle.add.tween(fireball).to({x: 500},1000, 'Linear', false);
                        tweenBall.start()
                        tweenBall.onStart.add(function(){
                            console.log('hey')
                            fireball.animations.play('shootBall',20, true)
                        })
                        tweenBall.onComplete.add(function(){
                            fireball.animations.stop();
                            console.log('exploded')
                            fireball.animations.play('explode',15, false)
                            explodeBall.onComplete.add(function(){
                                fireball.kill()
                            })
                    })
                })

                fireball.animations.play('genBall',10,false)
            })

            var left = sprite.animations.add('left',[117,118,119,120,121,122,123,124],true);
            left.onComplete.add(function(){
                console.log('frame')
            })
            var right = sprite.animations.add('right',[144,145,146,147,148],true);
            var sword = sprite.animations.add('sword',[195,196,197,198,199,200,199,198,197,196,195],true);
                sprite.animations._anims.sword.onComplete.add(function(){
                    sprite.animations.play('left',10, true);
                    // this is the window object
                    var returnTween = LoM.Battle.add.tween(sprite).to({x: 160, y: 230},tweenT, 'Linear', true);
                    returnTween.onComplete.addOnce(function(){
                        sprite.animations.stop();
                        sprite.animations.play('right',50,false)
                        sprite.frame = 13
                    })
                })
    
                this.tweenMap[id].sword = this.add.tween(sprite).to({x: 450, y: 230},tweenT, 'Linear', false);
                this.tweenMap[id].sword.onStart.add(function(){sprite.animations.play('right',animT,true)}, this);
                this.tweenMap[id].sword.onComplete.add(function(){
                    sprite.animations.stop()
                    sprite.animations.play('sword',animT,false)
                }, this);

            var spear = sprite.animations.add('spear',[247,248,249,250,251,252,253,254,255,255,254,253,252,251,250,249,248,247],true);
            
                sprite.animations._anims.spear.onComplete.add(function(){
                    sprite.animations.play('left',10, true);
                    // this is the window object
                    var returnTween = LoM.Battle.add.tween(sprite).to({x: 160, y: 230},tweenT, 'Linear', true);
                    returnTween.onComplete.addOnce(function(){
                        sprite.animations.stop();
                        sprite.animations.play('right',50,false)
                        sprite.frame = 13
                    })
                })

                this.tweenMap[id].spear = this.add.tween(sprite).to({x: 430, y: 230},tweenT, 'Linear', false);
                this.tweenMap[id].spear.onStart.add(function(){sprite.animations.play('right',animT,true)}, this);
                this.tweenMap[id].spear.onComplete.add(function(){
                    sprite.animations.stop()
                    sprite.animations.play('spear',animT,false)
                }, this);

            var bow = sprite.animations.add('bow',[247,248,249,250,251,252,253,254,255,256,257,258,259],true);

            sprite.animations._anims.bow.onComplete.add(function(){
                sprite.animations.play('left',10, true)
            })

            var die = sprite.animations.add('die',[260,261,262,263,264,265],true)
            
        }else if(sprite.data.position === 'receiver'){


            this.tweenMap[id] = {}
            
            var spell = sprite.animations.add('spell',[13,14,15,16,17,18,18,18,18,18,18,18,18,17,16,15,14,13],true)

            spell.onStart.add(function(){

                var fireball = LoM.Battle.add.sprite(470,230,'fireball')
                var genBall = fireball.animations.add('genBall',[1,2,3,4,5],1000, false)
                var shootBall = fireball.animations.add('shootBall',[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],5000, true)
                var explodeBall = fireball.animations.add('explode', [32,33,34,35,36,37,38,39],1000, false)


                genBall.onComplete.add(function(){
                    var tweenBall =  LoM.Battle.add.tween(fireball).to({x: 150},1000, 'Linear', false);
                    tweenBall.start()
                    tweenBall.onStart.add(function(){
                        console.log('hey')
                        fireball.animations.play('shootBall',20, true)
                    })

                    tweenBall.onComplete.add(function(){
                        fireball.animations.stop();
                        console.log('exploded')
                        fireball.animations.play('explode',15, false)
                        explodeBall.onComplete.add(function(){
                            fireball.kill()
                        })
                    })
                })
                
                fireball.animations.play('genBall',10,false)
            })

            var left = sprite.animations.add('left',[117,118,119,120,121,122,123,124],true);
            var right = sprite.animations.add('right',[144,145,146,147,148],true);
            var sword = sprite.animations.add('sword',[169,170,171,172,173,174,173,172,171,170,169],true);

                sprite.animations._anims.sword.onComplete.add(function(){
                    sprite.animations.play('right',10, true);
                    // this is the window object
                    var returnTween = LoM.Battle.add.tween(sprite).to({x: 515, y: 230},tweenT, 'Linear', true);
                    returnTween.onComplete.addOnce(function(){
                        sprite.animations.stop();
                        sprite.animations.play('left',50,false)
                        sprite.frame = 13
                    })
                })

                this.tweenMap[id].sword = this.add.tween(sprite).to({x: 230, y: 230},tweenT, 'Linear', false);
                this.tweenMap[id].sword.onStart.add(function(){sprite.animations.play('left',animT,true)}, this);
                this.tweenMap[id].sword.onComplete.add(function(){
                    sprite.animations.stop()
                    sprite.animations.play('sword',animT,false)
                }, this);

            var spear = sprite.animations.add('spear',[221,222,223,224,225,226,227,228,229,229,228,227,226,225,224,223,222,221],true);
            
                sprite.animations._anims.spear.onComplete.add(function(){
                    sprite.animations.play('right',10, true);
                    // this is the window object
                    var returnTween = LoM.Battle.add.tween(sprite).to({x: 515, y: 230},tweenT, 'Linear', true);
                    returnTween.onComplete.addOnce(function(){
                        sprite.animations.stop();
                        sprite.animations.play('left',50,false)
                        sprite.frame = 13
                    })
                })

                this.tweenMap[id].spear = this.add.tween(sprite).to({x: 250, y: 230},tweenT, 'Linear', false);
                this.tweenMap[id].spear.onStart.add(function(){sprite.animations.play('left',animT,true)}, this);
                this.tweenMap[id].spear.onComplete.add(function(){
                    sprite.animations.stop()
                    sprite.animations.play('spear',animT,false)
                }, this);

            var bow = sprite.animations.add('bow',[221,222,223,224,225,226,227,228,229,229,228,227,226,225,224,223,222,221],true);
            
            sprite.animations._anims.bow.onComplete.add(function(){
                sprite.animations.play('right',10, true)
            })

            var die = sprite.animations.add('die',[260,261,262,263,264,265],true)
        }
    },

    attack: function(battleInfo,id){
        this.tweenMap[id].sword.start();
    },
    spell: function(battleInfo,id){
        console.log(id) 
        // this.tweenMap[id].spell.start();
        this.spriteMap[id].animations.play('spell', 10,  false)
    },
    potion: function(battleInfo,id){
        this.spriteMap[id].animations.play('die', 10,  false)
    }
}

