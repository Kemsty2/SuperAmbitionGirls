var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Newsletter = require('../models/newsletter');
var Publicite = require('../models/publicite');
var Reponse = require('../models/reponse');
var User = require('../models/user');
var Commentaire = require('../models/commentaires');
var mailer = require('nodemailer');
var csurf = require('csurf');
var csrfProtection = csurf({ cookie: true });




const title = "SAG, Ambition & Distinction"

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {

    Article.find({}).sort({'date_publication': -1}).limit(5).exec(function(err, articlesrecent){
        if(err)
            throw err;
        Article.find({}).or([{'type': 'Super Ambitieux'}, {'type': 'Empowering'}]).sort({'date_publication': 1}).limit(3).exec(function(err, superambitieuxarticle){
            Article.find({'type': 'Edito'}).sort({'date_publication': -1}).limit(3).exec(function(err, editoarticle){
                Article.find({'type': 'LifeStyle'}).sort({'date_publication': -1}).limit(3).exec(function(err, lifestylearticle){
                    Article.find({'type': 'Love & RelationShip'}).sort({'date_publication': -1}).limit(3).exec(function(err, loverelationarticle){
                        Publicite.find(function(err, pubs){
                            Article.find({}).sort({'nombre_comms': -1}).limit(3).exec(function(err, popular_post){
                                Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
                                    var LoginSuccessMessage = req.flash('LoginSuccessMessage');
                                    var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
                                    var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
                                    res.render('Index/index', { title , layout: '/Index/layout.hbs',article1:articlesrecent.slice(0,1), articlesrecent: articlesrecent.slice(0, 3), articlesrecent2:articlesrecent.slice(3,5), superambitieuxarticles: superambitieuxarticle,superambitieuxarticle: superambitieuxarticle[0], editoarticle:editoarticle,editoarticle2:editoarticle[0], lifestylearticle: lifestylearticle,lifestylearticle2: lifestylearticle[0], loverelationarticle: loverelationarticle,loverelationarticle2: loverelationarticle[0], popular_post: popular_post, recent_post: recent_post, user:req.user, LoginSuccessMessage: LoginSuccessMessage, EnrollFailureNewsletter: EnrollFailureNewsletter, EnrollSuccessNewsletter: EnrollSuccessNewsletter, csrfToken: req.csrfToken()});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/typearticle/:type_article', csrfProtection, function(req, res, next){
    Article.find({'type': req.params.type_article}).sort({'date_publication': -1}).limit(11).exec(function(err, articles){

        if(articles.length > 10){
            var plus = true;
        }
        var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
        var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
        res.render('Index/type_article', {title, layout: 'Index/layout.hbs', articlefirst: articles.slice(0,1), articles: articles.slice(1,10), last: articles[articles.length -2], type_article: req.params.type_article, plus:plus,user:req.user, EnrollSuccessNewsletter:EnrollSuccessNewsletter, EnrollFailureNewsletter:EnrollFailureNewsletter, csrfToken: req.csrfToken()});
    });
});

router.get('/typearticle/:type_article/pagination/:last_id', csrfProtection,  function(req, res, next){
    Article.find({}).or([{'type' : req.params.type_article}, {'_id': {$lt: req.params.article_id}}]).sort({'date_publication': -1}).limit(11).exec(function(err, articles){
        if(articles.length > 10){
            var plus = true;
        }
        var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
        var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
        res.render('Index/type_article', {title, layout: 'Index/layout.hbs', articles: articles.slice(0,10), last: articles[articles.length -2], type_article: req.params.type_article, plus:plus, user:req.user, EnrollFailureNewsletter:EnrollFailureNewsletter, EnrollSuccessNewsletter: EnrollSuccessNewsletter, csrfToken: req.csrfToken()});
    });
});

router.get('/aboutUs', csrfProtection, function(req, res, next){
    var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
    var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
    res.render('Index/aboutUs', {title, layout: 'Index/layout.hbs', user:req.user, EnrollSuccessNewsletter: EnrollSuccessNewsletter, EnrollFailureNewsletter: EnrollFailureNewsletter, csrfToken: req.csrfToken()});
});

router.get('/contactUs', csrfProtection, function(req, res, next){
    var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
    var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
    var EmailSuccess = req.flash('EmailSuccess');
    res.render('Index/contactUs', {title, layout: 'Index/layout.hbs', user:req.user, EnrollFailureNewsletter: EnrollFailureNewsletter, EnrollSuccessNewsletter: EnrollSuccessNewsletter, EmailSuccess: EmailSuccess, csrfToken: req.csrfToken()});
});

router.post('/contactUs', csrfProtection, function (req, res, next) {
    var smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: "sagcontactus@gmail.com",
            pass: "Naruto1997"
        }
    });

    var message = `<p>Vous avez une nouvelle requete contact</p>
        <h3>Information sur le message</h3>
        <ul><li>Nom: ${req.body.nom}</li><li>Email: ${req.body.email}</li><li>Téléphone: ${req.body.tel}</li></ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>`

    var mail = {
        from: "sagcontactus@gmail.com",
        to: "superambitiongirls@gmail.com",
        subject: "Contact Request",
        html: message
    }

    smtpTransport.sendMail(mail, function (err, response) {
        if(err){
            throw err;
        }
        console.log("Mail envoyé");
        req.flash('EmailSuccess', 'Votre Mail a été envoyé');
        res.redirect('/contactUs');
        smtpTransport.close();
    });
});


module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}