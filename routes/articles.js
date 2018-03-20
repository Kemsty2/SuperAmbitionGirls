/**
 * Created by LeKemsty on 07/03/2018.
 */

// Ici je gère les articles et tout ce qui concerne les articles, Commentaires, Lecture ...

var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var types = ['Super Ambitieux', 'LifeStyle', 'Edito',  'Empowering', 'Love & RelationShip'];


const title = "SAG, Ambition & Distinction";

router.get('/lecture/:article_id', function(req, res, next){
    Article.findById(req.params.article_id, function(err, article){
        Article.find({_id: {$gt: req.params.article_id}}).sort({_id: 1}).limit(1).exec(function(err, next){
            Article.find({_id: {$lt: req.params.article_id}}).sort({_id: -1}).limit(1).exec(function(err, previous){
                Article.find({}).sort({'nombre_comms': -1}).limit(3).exec(function(err, popular_post){
                    Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
                        console.log(article);
                        res.render('Article/article', {title, layout: 'Index/layout.hbs', article: article, next: next, previous: previous, popular_post:popular_post, recent_post:recent_post, article1: recent_post.slice(0,1), user:req.user});
                    });
                });
            });
        });
    });
});

router.get('/new_article', isAuthenticated, function(req, res, next){
    res.render('Admin/Article/new_article', {title, layout:'Admin/layout.hbs'});
});

router.get('/list_article', isAuthenticated, function(req, res, next){
    Article.find(function(err, articles){
        res.render('Admin/Article/list_article', {title, layout:'Admin/layout.hbs', articles: articles});
    })
});

router.post('/enroll_article', isAuthenticated, function(req, res, next){
    var newArticle = new Article({
        titre: req.body.titre,
        type: types[parseInt(req.body.type) - 1],
        auteur_id: req.session.admin._id,
        auteur_nom: req.session.admin.noms,
        contenu: req.body.contenu
    });
    var tags = req.body.tags.split(',');
    for(var i=0; i<tags.length; i++){
        newArticle.tags[i] = tags[i];
    }
    if(req.body.special == 'special'){
        newArticle.special = true;
    }
    else{
        newArticle.special = false;
    }

    if(!req.files){
        req.flash('NewArticleMessage', 'Choissiez Une Image');
        res.redirect('/articles/new_article');
    }

    var file = req.files.photo;
    var img_path = 'public/images/upload_images/' + file.name;
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg"){
        newArticle.photo = '/images/upload_images/' + file.name;
        file.mv(img_path, function(err){
            if(err){
                req.flash('NewArticleMessage', "Erreur lors de l'importation de l'image");
                throw err;
            }
        });
    }
    else{
        req.flash('NewArticleMessage', "Format Image Incompatible");
        res.redirect('/articles/new_article');
    }
    console.log(newArticle);
    newArticle.save(function(err){
        if(err)
            throw err
    });
    res.redirect('/articles/list_article');
});

router.post('/post_commentaire', function(req, res, next){

});

router.post('/post_reply', function(req, res, next){

});

function isAuthenticated(req, res, next){
    var realAdmin = req.session.admin ? req.session.admin: {};

    if(!(isEmpty(realAdmin))){
        return next();
    }
    res.redirect('/admin/login')
}

function notAuthenticated(req, res, next){
    var realAdmin = req.session.admin ? req.session.admin: {};

    if(isEmpty(realAdmin)){
        return next();
    }
    res.redirect('/admin')
}

module.exports = router;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}