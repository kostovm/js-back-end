const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');

router.use(homeController)
router.use('/users', userController);
router.use('/products', productController);


router.get('*', (req, res) => {
    res.redirect('/404');
})

module.exports = router;