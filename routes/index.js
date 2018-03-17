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
                                    res.render('Index/index', { title , layout: '/Index/layout.hbs',article1:articlesrecent.slice(0,1), articlesrecent: articlesrecent.slice(0, 3), articlesrecent2:articlesrecent.slice(3,5), superambitieuxarticle: superambitieuxarticle,superambitieuxarticle: superambitieuxarticle[0], editoarticle:editoarticle,editoarticle2:editoarticle[0], lifestylearticle: lifestylearticle,lifestylearticle2: lifestylearticle[0], loverelationarticle: loverelationarticle,loverelationarticle2: loverelationarticle[0], popular_post: popular_post, recent_post: recent_post});
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
    console.log(req.params.type_article);
    res.render('Index/type_article', {title, layout: 'Index/layout.hbs'});
});

router.get('/aboutUs', function(req, res, next){
  res.render('Index/aboutUs', {title, layout: 'Index/layout.hbs'});
});

router.get('/contactUs', function(req, res, next){
    res.render('Index/contactUs', {title, layout: 'Index/layout.hbs'});
});



module.exports = router;
