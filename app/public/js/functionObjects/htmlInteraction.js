
// create interaction div
function genBattleInteraction(){

    var interaction = $('.interaction');
    var option = $('.battle-options');
    var wrapper = $("<div class='wrapper'>");
    var battleReq = $("<button class='battle-btn' id='battle-request'>Request Battle</button>");
    var battleAccept = $("<button class='battle-btn' id='battle-accept'>Accept Battle</button>");
    var battleDecline = $("<button class='battle-btn' id='battle-decline'>Decline Battle</button>");


    wrapper.append(battleReq,battleAccept,battleDecline);
    interaction.empty();
    interaction.append(wrapper);
    interaction.fadeIn();
    option.fadeIn();
}


function removeInteractionDisplay(){
    $('.interaction').fadeOut(function(){
        $('.interaction').empty();
    });
    
    // $('.announcement').empty();
}

function announcement(body){
    var announcement = $('.announcement');
    announcement.empty();
    
    var item = $("<p class='announcement-item'>")
    // item.css('display','none')
    item.text(body)

    announcement.append(item)
    item.fadeIn();
    setTimeout(function(){
        item.fadeOut(function(){
        item.remove()})
    },3000)
}

$('.interaction').on('click','#battle-request', function(ev){
    ev.preventDefault();
    Client.battleRequest();
})

$('.interaction').on('click','#battle-accept', function(ev){
    ev.preventDefault();
    Client.battleAccept();
})


$('.interaction').on('click','#battle-decline', function(ev){
    ev.preventDefault();
    Client.battleDecline();
})


// BATTLE STATE

function battleUpdate(){
    var menu = $('.battle-info');
    var iStats = $("<div class='stats-wrapper'>")
    var rStats = $("<div class='stats-wrapper'>")

    var iName = "<p class='stats-name'>"+LoM.Battle.battleInfo.initiator.id+"</p>";
    var iHP = "<p class='stats-HP'>HP:"+100+"</p>";
    var iMP= "<p class='stats-MP'>HP:"+100+"</p>";
    iStats.append(iName,iHP,iMP)

    var rName = "<p class='stats-name'>"+LoM.Battle.battleInfo.receiver.id+"</p>";
    var rHP = "<p class='stats-HP'>HP:"+100+"</p>";
    var rMP= "<p class='stats-MP'>HP:"+100+"</p>";

    rStats.append(rName,rHP,rMP);
    menu.append(iStats,rStats);
    menu.fadeIn();
  

    addBattleButton()
}

function addBattleButton(){
    
    var attack;
    var spell;
    var health;

    attack = "<button class='action-btn' id='attack-btn'>Attack</button>"
    spell = "<button class='action-btn' id='spell-btn'>Spell</button>"
    health = "<button class='action-btn' id='health-btn'>Potion</button>"

    $('.battle-options').append(attack,spell,health)
}

var enableSubmit = function(ele) {
    $(ele).removeAttr("disabled");
}

$('.battle-options').on('click','#attack-btn', function(ev){
    ev.preventDefault();
    Client.battleAction(LoM.Battle.battleInfo,'attack',user.id);
})

$('.battle-options').on('click','#spell-btn', function(ev){
    ev.preventDefault();
    Client.battleAction(LoM.Battle.battleInfo,'spell',user.id)
})

$('.battle-options').on('click','#health-btn', function(ev){
    ev.preventDefault();
    Client.battleAction(LoM.Battle.battleInfo,'potion',user.id)
})

$('.battle-options').on('click','.action-btn', function(){
    LoM.Battle.battleInfo[user.control].turn = false;
})
    