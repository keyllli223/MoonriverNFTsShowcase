const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const router = express.Router()
const Model = require('../models/model');


router.post('/createLink', jsonParser, async (req, res) => {
    const data = new Model({
        link: req.body.link,
        wallet: req.body.wallet
    })

    try {
        var validRegEx = /^0x([A-Fa-f0-9]{40})$/;
        if (!validRegEx.test(data.wallet.trim())) {
            res.status(500).json({message: "Incorect wallet address"})
        } else{
            const result = await Model.find( { 'link' : { '$regex' : req.body.link, '$options' : 'i' } } )
            const match = [];
            for(var i = 0; i < result.length; i++){
                if(result[i].link.toLowerCase() == req.body.link.toLowerCase()){
                    match.push(result[i]);
                    break;
                }
            }
            if(match.length == 0){
                const dataToSave = await data.save();
                res.status(200).json(dataToSave)
            }
            else {
                res.status(500).json({message: "Already exist"})
            }
        }
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/getAll', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/getOne/:link', async (req, res) => {
    try{
        const result = await Model.find( { 'link' : { '$regex' : req.params.link, '$options' : 'i' } } );
        const match = [];
        for(var i = 0; i < result.length; i++){
            if(result[i].link.toLowerCase() == req.params.link.toLowerCase()){
                match.push(result[i]);
                break;
            }
        }
        res.json(match)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }

})

module.exports = router;