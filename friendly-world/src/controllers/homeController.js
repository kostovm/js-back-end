const router = require('express').Router();
const animalService = require('../services/animalService');
const {extractErrorMsgs} = require('../utils/errorHandler');

router.get('/', async (req, res) => {

    try {
        const lastThree = await animalService.getAll().sort({ createdAt: -1 }).limit(3).lean();
        res.render("home", {lastThree});
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.render('home', {errorMessages});
    }
   
});

router.get('/404', (req, res) => {
    res.render('404');
})

module.exports = router;