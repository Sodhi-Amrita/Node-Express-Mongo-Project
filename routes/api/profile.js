
const express = require('express')
const router = express.Router()
const passport = require('passport')

const ObjectId = require('mongodb').ObjectId;


const { celebrate, Joi } = require('celebrate');

// Define the validation schema
const schema = Joi.object({
  page: Joi.number().integer().min(0).max(120).required(),
  perPage: Joi.number().integer().min(0).max(120).required(),
  depth: Joi.number()
});


// Import ShipWreck schema
const ShipWreck = require('../../models/ShipWreck')

//@type     -   GET
//@route    -   /api/profile
//@desc     -   Just for testing
//@access   -   PUBLIC
router.get('/', (req, res) => res.send('Profile related routes'))


//@type     -   GET
//@route    -   /api/profile/get
//@desc     -   Get all wrecks record
//@access   -   PUBLIC
router.get('/get/data',
passport.authenticate('jwt', { session: false }), 
async (req, res) => {
    
    // without cursor.
    const wrecks = await ShipWreck.find({});
    console.log("Hello")
    try {
        res.send(wrecks);
    } catch (error) {
        res.status(500).send(error);
    }

})

//@type     -   GET
//@route    -   /api/profile/get/:username
//@desc     -   Get a ShipWreck record
//@access   -   PUBLIC
router.get('/data/', 
passport.authenticate('jwt', { session: false }), async (req, res) => {
    const page = req.query.page
    const perPage = req.query.perPage
    const depth = req.query.depth
    console.log(depth)

    const startIndex = (page - 1) * perPage;
    if(depth)
    {
        ShipWreck
         .find({depth}).skip(startIndex).limit(perPage).lean()
         .then(shipwreck => res.send(shipwreck))
         .catch(err => console.log(err))
    }
    else
    {

     ShipWreck
     .find({}).skip(startIndex).limit(perPage).lean()
     .then(shipwreck => res.send(shipwreck))
     .catch(err => console.log(err))
    }


   // const endIndex = page * perPage;
   
    //const filter = depth ? { depth: parseInt(depth) } : {};
    //console.log(filter)
    // Query database with filter and pagination options

    //res.send(data)

})

//ExtraChallenge

router.get('/extraC', celebrate({ query: schema }), (req, res) => {
    const page = req.query.page
    const perPage = req.query.perPage
    const depth = req.query.depth
    console.log(depth)

    const startIndex = (page - 1) * perPage;
    if(depth)
    {
        ShipWreck
         .find({depth}).skip(startIndex).limit(perPage).lean()
         .then(shipwreck => res.send(shipwreck))
         .catch(err => console.log(err))
    }
    else
    {

     ShipWreck
     .find({}).skip(startIndex).limit(perPage).lean()
     .then(shipwreck => res.send(shipwreck))
     .catch(err => console.log(err))
    }

    // Do something with the validated query params
  });
  

//Step 3
router.get('/Step3data/', (req, res) => 
{
    
    res.render('form', 
        {
            
        }
    )
})

router.post('/step3', async (req, res) => {
    const page = req.body.page
    const perPage = req.body.perPage
    const depth = req.body.depth
    console.log(depth)

    const startIndex = (page - 1) * perPage;
    if(depth)
    {
        ShipWreck
         .find({depth}).skip(startIndex).limit(perPage).lean()
         .then(shipwreck => res.render('insert', 
         { 
             body: shipwreck, 
             title: "Ship Wreck Data."
            // layout: false 
         }))
         .catch(err => console.log(err))
    }
    else
    {

     ShipWreck
     .find({}).skip(startIndex).limit(perPage).lean()
     .then(shipwreck => res.render('insert', 
     { 
         body: shipwreck, 
         title: "Ship Wreck Data."
        // layout: false 
     }))
     .catch(err => console.log(err))
    }


   // const endIndex = page * perPage;
   
    //const filter = depth ? { depth: parseInt(depth) } : {};
    //console.log(filter)
    // Query database with filter and pagination options

    //res.send(data)

})



//@type     -   POST
//@route    -   /api/profile/add
//@desc     -   Insert a ShipWreck record
//@access   -   PUBLIC
router.post('/data', (req, res) => {

    
    const lat = parseFloat(req.body.latdec)
    const lon = parseFloat(req.body.londec)
        const newShipWreck = ShipWreck({
            recrd: req.body.name,
            vesslterms: req.body.vesslterms,
            feature_type: req.body.feature_type,
            chart: req.body.chart,
            latdec: lat,
            londec: lon,
            gp_quality: req.body.gp_quality,
            depth: req.body.depth,
            sounding_type: req.body.sounding_type,
            history: req.body.history,
            quasou: req.body.quasou,
            watlev: req.body.watlev,
            coordinates: [lat, lon]
        })

        newShipWreck
            .save()
            .then(shipwreck => res.send(shipwreck))
            .catch(err => console.log(err))
            
        })
  
//Getting data from Atlas DB based upon ID
router.get('/data/:id', (req, res) => {
    const id = req.params.id
    const o_id = new ObjectId(id);
    ShipWreck
        .findOne({_id: o_id})
        .then(shipwreck => res.send(shipwreck))
        .catch(err => console.log(err))
})





//@type     -   PUT
//@route    -   /api/profile/update-pwd/:username
//@desc     -   Update a record on the basis of username
//@access   -   PUBLIC
router.put('/data/:id', (req, res) => {
    const id = req.params.id
    const o_id = new ObjectId(id);
    ShipWreck.updateOne(
        {_id: o_id},
        { $set: { chart: req.body.chart }})
        .exec()
        .then(() => {
            res.status(201).send('ShipWreck document Updated.')
        })
        .catch((err) => { console.log(err);
        })
})

//@type     -   DELETE
//@route    -   /api/profile/delete/:username
//@desc     -   Delete a record on the basis of username
//@access   -   PUBLIC
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    const o_id = new ObjectId(id);
    ShipWreck.deleteOne({_id: o_id})
        .exec()
        .then(() => {
            res.status(201).send('ShipWreck Deleted.')
        })
        .catch((err) => { console.log(err);
        })
})

module.exports = router