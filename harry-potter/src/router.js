const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const postsController = require('./controllers/postsController');

router.use(homeController)
router.use('/users', userController);
router.use('/posts', postsController);


router.get('*', (req, res) => {
    res.redirect('/404');
})

module.exports = router;