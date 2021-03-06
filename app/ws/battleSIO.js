
module.exports = function(io){

    var online = [];
    var server = {};

    io.on('connection', function(socket) {

        // HANDLIGN BATTLE ACTIONS

        socket.on('battleAction', function(state){
            switch(state.action){
                case 'attack':
                    attackCallback(state)
                    return
                case 'spell':
                    spellCallback(state)
                    return
                case 'potion':
                    potionCallback(state)
                    return
            }
        })

        socket.on('actionCompleted', function(state){
            var room = state.room; 
            socket.to(room).emit('your-turn',{});
        })  
    })    

    function randomInt (low,high){
        return Math.floor(Math.random() * (high - low) + low);
    }

    function attackCallback(state){
        var attackerID = state.roleID.attacker;
        var defenderID = state.roleID.defender;
        var attacker = state.player[attackerID];
        var defender = state.player[defenderID];
        var room = state.room;

        // attack logic here with data
        var attackMod = randomInt(50,100);
        var defenseMod = randomInt(1,25);
        attackMod = attackMod/100;
        defenseMod = defenseMod/100;

        var attackMin = parseInt(attacker.weapon.damage[0] + (attacker.based_stats.attack *  attackMod));
        var attackMax = parseInt(attacker.weapon.damage[1] + (attacker.based_stats.attack * attackMod))
        var attackPoints = randomInt(attackMin,attackMax);
        console.log(attackPoints)
        defender.battle.hp -= parseInt( attackPoints - (defender.modified_stats.defense * defenseMod) );

        // emit signal to battling player
        io.in(room).emit('battleReaction',state)

    }

    function spellCallback(state){
        // spell logic here with data
        var attackerID = state.roleID.attacker;
        var defenderID = state.roleID.defender;
        var attacker = state.player[attackerID];
        var defender = state.player[defenderID];
        var room = state.room;
        console.log(attacker)
        var spellDamage = [attacker.equipments.spell.damage_min, attacker.equipments.spell.damage_max]
        console.log(spellDamage)
        var spellPoints = randomInt(spellDamage[0], spellDamage[1]);
        defender.battle.hp -= spellPoints;
        attacker.battle.mp -= attacker.spell.mp;
        // emit signal to battling player
        var room = state.room;
        io.in(room).emit('battleReaction',state)
    }

    function potionCallback(state){
        // attack logic here with data
        // spell logic here with data
        var attackerID = state.roleID.attacker;
        var defenderID = state.roleID.defender;
        var attacker = state.player[attackerID];
        var defender = state.player[defenderID];
        var room = state.room;
        var addHP = randomInt(25,30)
        attacker.battle.hp += addHP;

        // emit signal to battling player
        var room = state.room;
        io.in(room).emit('battleReaction',state)
    }
}
