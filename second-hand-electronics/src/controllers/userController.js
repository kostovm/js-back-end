const router = require('express').Router();
const userService = require('../services/userService');
const {extractErrorMsgs} = require('../utils/errorHandler');

router.get('/login', (req, res) => {
    const {user} = req;
    
    if(!user){
        res.render('user/login');
    }else{
        res.render('home')
    };
});

router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
    const token = await userService.login(email, password);

    res.cookie('token', token, {httpOnly: true})
    res.redirect('/');
    } catch (error) {
        const errorMessages = extractErrorMsgs(error);
        res.status(404).render('user/login', {errorMessages});
    }
});

router.get('/register', (req, res) => {

    const {user} = req;
    
    if(!user){
        res.render('user/register');
    }else{
        res.render('home')
    };
});

router.post('/register', async (req, res) => {
    const {
        email,
        username,
        password,
        rePassword
        } = req.body;

        try {

            const token = await userService.register({email, username, password, rePassword});
        
            res.cookie('token', token, {httpOnly: true})
            res.redirect('/');
        
            } catch (error) {
                const errorMessages = extractErrorMsgs(error);
                console.log(errorMessages)
                res.status(404).render('user/register', {errorMessages});
            }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;