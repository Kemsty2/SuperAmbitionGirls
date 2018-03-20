var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Newsletter = require('../models/newsletter');
var Publicite = require('../models/publicite');
var Reponse = require('../models/reponse');
var User = require('../models/user');
var Commentaire = require('../models/commentaires');

const title = "SAG, Ambition & Distinction"

/* GET home page. */
router.get('/', function(req, res, next) {

    Article.find({}).sort({'date_publication': -1}).limit(5).exec(function(err, articlesrecent){
        if(err)
            throw err;
        Article.find({}).or([{'type': 'Super Ambition'}, {'type': 'Empowering'}]).sort({'date_publication': 1}).limit(3).exec(function(err, superambitieuxarticle){
            Article.find({'type': 'Edito'}).sort({'date_publication': -1}).limit(3).exec(function(err, editoarticle){
                Article.find({'type': 'LifeStyle'}).sort({'date_publication': -1}).limit(3).exec(function(err, lifestylearticle){
                    Article.find({'type': 'Love & RelationShip'}).sort({'date_publication': -1}).limit(3).exec(function(err, loverelationarticle){
                        Publicite.find(function(err, pubs){
                            Article.find({}).sort({'nombre_comms': -1}).limit(3).exec(function(err, popular_post){
                                Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
                                    res.render('Index/index', { title , layout: '/Index/layout.hbs',article1:articlesrecent.slice(0,1), articlesrecent: articlesrecent.slice(0, 3), articlesrecent2:articlesrecent.slice(3,5), superambitieuxarticle: superambitieuxarticle,superambitieuxarticle: superambitieuxarticle[0], editoarticle:editoarticle,editoarticle2:editoarticle[0], lifestylearticle: lifestylearticle,lifestylearticle2: lifestylearticle[0], loverelationarticle: loverelationarticle,loverelationarticle2: loverelationarticle[0], popular_post: popular_post, recent_post: recent_post, user:req.user});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/typearticle/:type_article', function(req, res, next){
    Article.find({'type': req.params.type_article}).sort({'date_publication': -1}).limit(11).exec(function(err, articles){

        if(articles.length > 10){
            var plus = true;
        }
        res.render('Index/type_article', {title, layout: 'Index/layout.hbs', articlefirst: articles.slice(0,1), articles: articles.slice(1,10), last: articles[articles.length -2], type_article: req.params.type_article, plus:plus,user:req.user});
    });
});

router.get('/typearticle/:type_article/pagination/:last_id', function(req, res, next){
    Article.find({}).or([{'type' : req.params.type_article}, {'_id': {$lt: req.params.article_id}}]).sort({'date_publication': -1}).limit(11).exec(function(err, articles){
        if(articles.length > 10){
            var plus = true;
        }
        res.render('Index/type_article', {title, layout: 'Index/layout.hbs', articles: articles.slice(0,10), last: articles[articles.length -2], type_article: req.params.type_article, plus:plus, user:req.user});
    });
});

router.get('/aboutUs', function(req, res, next){
  res.render('Index/aboutUs', {title, layout: 'Index/layout.hbs', user:req.user});
});

router.get('/contactUs', function(req, res, next){
    res.render('Index/contactUs', {title, layout: 'Index/layout.hbs', user:req.user});
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