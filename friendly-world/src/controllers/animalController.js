const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const animalService = require('../services/animalService');
const {extractErrorMsgs} = require('../utils/errorHandler');

router.get('/dashboard', async (req, res) => {
    const animals = await animalService.getAll().lean();
    res.render('animal/dashboard', {animals});
});

router.get('/search', async (req, res) => {

    const {search} = req.query;
    const animals = await animalService.search(search);

    res.render('animal/search', {animals});
});

router.get('/create', isAuth, (req, res) => {
    res.render('animal/create');
});

router.post('/create', isAuth, async (req, res) => {
    const {name, age, kind, image, need, location, description} = req.body;
    const payload = {name, age, kind, image, need, location, description, owner: req.user};

    try {
        await animalService.create(payload);
        res.redirect('/animals/dashboard');
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render('animal/create', {errorMessages});
    }
});

router.get('/:animalId/details', async (req, res) => {
    const { animalId } = req.params;

    try {
        const animal = await animalService.singleAnimal(animalId).populate('owner').lean();
        const { user } = req;
    const { owner } = animal;
    const isOwner = user?._id === owner._id.toString();
    const hasDonated = animal.donations?.some((d) => d?._id.toString() === user?._id);
    res.render('animal/details', { animal, isOwner, hasDonated });
    } catch (error) {
        res.redirect('/404')
    }
    
});

router.get('/:animalId/edit', isAuth, async (req, res) => {
    const {animalId} = req.params;
    const { user } = req;

    try {
        const animal = await animalService.singleAnimal(animalId).lean();
        if (animal.owner.toString() === user._id){
            res.render('animal/edit', {animal});
        }else{
            res.redirect(`/animals/${animalId}/details`);
        }
    } catch (error) {
        res.redirect('/404');
    }

});

router.post('/:animalId/edit', isAuth, async (req, res) => {
    const {animalId} = req.params;
    const {name, age, kind, image, need, location, description} = req.body;
    const payload = {name, age, kind, image, need, location, description};

    try {
        await animalService.update(animalId, payload);
        res.redirect(`/animals/${animalId}/details`);
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        const animal = await animalService.singleAnimal(animalId).lean();
        res.status(404).render('animal/edit',  {animal, errorMessages} );
    };
});

router.get('/:animalId/delete', isAuth, async (req, res) => {
    const {animalId} = req.params;
    const { user } = req;

    try {
        const animal = await animalService.singleAnimal(animalId).lean();
        if (animal.owner.toString() === user._id){
                await animalService.delete(animalId);
                res.redirect('/animals/dashboard');
            }else{
                res.redirect(`/animals/${animalId}/details`);
            };
    } catch (error) {
        res.redirect('/404');
    }
    
});

router.get('/:animalId/donate', isAuth, async (req, res) => {
    const {animalId} = req.params;
    const {_id} = req.user;

    try {
        const animal = await animalService.singleAnimal(animalId).lean();
        const isOwner = animal.owner.toString() === _id;
        const hasDonated = animal.donations?.some((d) => d?._id.toString() === _id);

        if(hasDonated || isOwner){
            res.redirect(`/animals/${animalId}/details`);
        }else{
            await animalService.donate(animalId, _id);
            res.redirect(`/animals/${animalId}/details`);
        };
        
    } catch (error) {
        res.redirect('/404');
    };

    
});


module.exports = router;