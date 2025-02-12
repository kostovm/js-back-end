const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const creatureService = require('../services/creatureService');
const {extractErrorMsgs} = require('../utils/errorHandler');

router.get('/all', async (req, res) => {
    const creatures = await creatureService.getAll().lean();
    res.render('post/all-posts', {creatures});
});

router.get('/create', isAuth, (req, res) => {

    res.render('post/create');
});

router.post('/create', isAuth, async (req, res) => {
    const {name, species, skinColor, eyeColor, image, description} = req.body;
    const payload = {name, species, skinColor, eyeColor, image, description, owner: req.user};

    try {
        await creatureService.create(payload);
        res.redirect('/posts/all');
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render('post/create', {errorMessages});
    }
});

router.get('/profile', isAuth, async (req, res) => {

    const {user} = req;

    const myCreatures = await creatureService.getMyCreatures(user._id).lean();
    
    res.render('post/my-posts', {myCreatures});
});

router.get('/:creatureId/details', async (req, res) => {
    const { creatureId } = req.params;

    const creature = await creatureService.singleCreature(creatureId).populate('owner').lean();
    const { user } = req;
    const { owner } = creature;
    const isOwner = user?._id === owner._id.toString();
    const hasVoted = creature.votes?.some((v) => v?._id.toString() === user?._id);
    const ownerFullName = `${owner.firstName} ${owner.lastName}`;
    const joinedEmailsOfVoters = creature.votes.map((v) => v.email).join(", ");

    res.render('post/details', { creature, isOwner, hasVoted, ownerFullName, joinedEmailsOfVoters });
});

router.get('/:creatureId/edit', isAuth, async (req, res) => {
    const {creatureId} = req.params;
    const creature = await creatureService.singleCreature(creatureId).lean();

    res.render('post/edit', {creature});
});

router.post('/:creatureId/edit', isAuth, async (req, res) => {
    const {creatureId} = req.params;
    const {name, species, skinColor, eyeColor, image, description} = req.body;
    const payload = {name, species, skinColor, eyeColor, image, description, owner: req.user};

    try {
        await creatureService.update(creatureId, payload);
        res.redirect(`/posts/${creatureId}/details`);
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        const creature = await creatureService.singleCreature(creatureId).lean();
        res.status(404).render('post/edit',  {creature, errorMessages} );
    };

    
});

router.get('/:creatureId/delete', isAuth, async (req, res) => {
    const {creatureId} = req.params;

    await creatureService.delete(creatureId);

    res.redirect('/posts/all');
});

router.get('/:creatureId/vote', async (req, res) => {
    const {creatureId} = req.params;
    const {_id} = req.user;

    await creatureService.addVotesToCreature(creatureId, _id);
    res.redirect(`/posts/${creatureId}/details`);
})

module.exports = router;