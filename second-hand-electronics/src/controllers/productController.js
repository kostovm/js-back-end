const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const productService = require('../services/productService');
const {extractErrorMsgs} = require('../utils/errorHandler');


router.get('/catalog', async (req, res) => {
    const products = await productService.getAll().lean();
    res.render('product/catalog', {products});
});

router.get('/search', async (req, res) => {

    const {searchByName, searchByType} = req.query;
    const products = await productService.search(searchByName, searchByType);

    res.render('product/search', {products});
});

router.get('/create', isAuth, (req, res) => {
    res.render('product/create');
});

router.post('/create', isAuth, async (req, res) => {
    const {name, type, production, exploitation, damages, image, price, description} = req.body;
    const payload = {name, type, production, exploitation, damages, image, price, description, owner: req.user};

    try {
        await productService.create(payload);
        res.redirect('/products/catalog');
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render('product/create', {errorMessages});
    }
});

router.get('/:productId/details', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await productService.singleProduct(productId).populate('owner').lean();
        const { user } = req;
    const { owner } = product;
    const isOwner = user?._id === owner._id.toString();
    const hasBought = product.buyingList?.some((p) => p?._id.toString() === user?._id);
    res.render('product/details', { product, isOwner, hasBought });
    } catch (error) {
        res.redirect('/404')
    }
    
});

router.get('/:productId/edit', isAuth, async (req, res) => {
    const {productId} = req.params;
    const { user } = req;

    try {
        const product = await productService.singleProduct(productId).lean();
        if (product.owner.toString() === user._id){
            res.render('product/edit', {product});
        }else{
            res.redirect(`/products/${productId}/details`);
        }
    } catch (error) {
        res.redirect('/404');
    }

});

router.post('/:productId/edit', isAuth, async (req, res) => {
    const {productId} = req.params;
    const {name, type, production, exploitation, damages, image, price, description} = req.body;
    const payload = {name, type, production, exploitation, damages, image, price, description};

    try {
        await productService.update(productId, payload);
        res.redirect(`/products/${productId}/details`);
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        const product = await productService.singleProduct(productId).lean();
        res.status(404).render('product/edit',  {product, errorMessages} );
    };
    
});

router.get('/:productId/delete', isAuth, async (req, res) => {
    const {productId} = req.params;
    const { user } = req;

    try {
        const product = await productService.singleProduct(productId).lean();
        if (product.owner.toString() === user._id){
                await productService.delete(productId);
                res.redirect('/products/catalog');
            }else{
                res.redirect(`/products/${productId}/details`);
            };
    } catch (error) {
        res.redirect('/404');
    }
    
});

router.get('/:productId/buy', isAuth, async (req, res) => {
    const {productId} = req.params;
    const {_id} = req.user;

    try {
        const product = await productService.singleProduct(productId).lean();
        const isOwner = product.owner.toString() === _id;
        const hasBought = product.buyingList?.some((b) => b?._id.toString() === _id);

        if(hasBought || isOwner){
            res.redirect(`/products/${productId}/details`);
        }else{
            await productService.buyProduct(productId, _id);
            res.redirect(`/products/${productId}/details`);
        };
        
    } catch (error) {
        res.redirect('/404');
    };
});

module.exports = router;