var express = require('express');
var router = express.Router();

// Cache control to prevent caching on sensitive routes
router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// admin credentials
const credentials = {
    email: "admin@gmail.com",
    password: "admin123"
}

// login user
router.post('/login',(req,res) => {
    
     if(req.body.email === credentials.email && req.body.password === credentials.password){
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
     }else{
        res.redirect("/?error=invalid credentials");
     }
});

// router for dashboard
router.get('/dashboard',(req,res) => {

    if(req.session.user){
        res.render('dashboard', {title: 'dashboard', user: req.session.user});
    }else{
         res.redirect('/');   
    }
});

// router for logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.end('Error logging out');
        } else {
            res.clearCookie('connect.sid'); // Clear session cookie
            res.redirect('/?logout=success');
        }
    });
});



module.exports = router;