
const express = require('express');
const models = require('../models');
const fs = require('fs');
const path = require('path');
const User = models.User;
const Sprite = models.Sprite;
const Item = models.Item;
const Stats = models.Stats;
const Game_State = models.Game_State;
const router = express.Router();
var spriteSheetFolder = path.join(__dirname,'../public/img/players');
var spriteSheetID = {}

router.get('/all', (req,res) => {
    User.findAll({
        include: [Sprite,Item,Stats,Game_State]
    })
    .then((playerDB) => {
        // grab all player infomation on database
        res.json(playerDB)
            // fs.readdir(spriteSheetFolder, (err, files) => {
            //     // read the id of the already created spritesheet files and send it to client
            // })
    })
});


module.exports = router;