/**
 * Created by LeKemsty on 07/03/2018.
 */
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Newsletter = require('../models/newsletter');
const title = "SAG, Ambition & Distinction";


router.get('/', isAuthenticated, function(req, res, next){
    res.render('Admin/dashboard', {title, layout: 'Admin/layout.hbs', admin: req.session.admin});
});

router.get('/new_redacteur', isAuthenticated, function(req, res, next){
    res.render('Admin/Redacteur/new_redacteur', {title, layout:'Admin/layout.hbs', admin: req.session.admin});
});

router.get('/login', notAuthenticated,  function(req, res, next){
    res.render('Admin/login', {title, layout: 'Index/layout.hbs', admin: req.session.admin});
});

router.post('/login_admin', notAuthenticated, function(req, res, next){
  const realAdmin = req.session.admin ? req.session.admin : {};
  console.log(realAdmin);
    if(!(isEmpty(realAdmin))){
        console.log('here');
        res.redirect('/admin');
    }else{
        Admin.findOne({'email': req.body.email}, function(err, admin){
            req.session.admin = admin;
            if(err)
                return res.redirect('/admin/login');
            if(isEmpty(admin))
                return res.redirect('/admin/login');
            console.log(admin);
            if(!admin.validPassword(req.body.password))
                return res.redirect('/admin/login');

            return res.redirect('/admin')
        });
    }
});

router.get('/profil', isAuthenticated, function(req, res, next){
   res.render('Admin/Redacteur/profil', {title, layout: 'Admin/layout.hbs', admin: req.session.admin} );
});

router.get('/edit_profil', isAuthenticated, function(req, res, next){
    res.render('Admin/Redacteur/edit_profil', {title, layout: 'Admin/layout.hbs', admin: req.session.admin});
});

router.get('/list_newsletter', isAuthenticated, function (req, res, next) {
    Newsletter.find({}, function (err, newsletters) {
        res.render('Admin/Newsletter/list_newsletter', {newsletters: newsletters, title, layout: 'Admin/layout.hbs', admin: req.session.admin});
    });
});

function isAuthenticated(req, res, next){
  const realAdmin = req.session.admin ? req.session.admin : {};

  if(!(isEmpty(realAdmin))){
        return next();
    }
    res.redirect('/admin/login')
}

function notAuthenticated(req, res, next){
  const realAdmin = req.session.admin ? req.session.admin : {};

  if(isEmpty(realAdmin)){
        return next();
    }
    res.redirect('/admin')
}

module.exports = router;

const hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}