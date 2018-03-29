/**
 * Created by LeKemsty on 07/03/2018.
 */

// Ici je gère les articles et tout ce qui concerne les articles, Commentaires, Lecture ...

var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Commentaire = require('../models/commentaires');
var types = ['Super Ambitieux', 'LifeStyle', 'Edito',  'Empowering', 'Love & Relation'];
var csurf = require('csurf');
var csrfProtection = csurf({cookie: true});
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/upload_images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });


const title = "SAG, Ambition & Distinction";

router.get('/lecture/:article_id', csrfProtection, function(req, res, next){
    Article.findById(req.params.article_id, function(err, article){
        Article.find({_id: {$gt: req.params.article_id}}).sort({_id: 1}).limit(1).exec(function(err, next){
            Article.find({_id: {$lt: req.params.article_id}}).sort({_id: -1}).limit(1).exec(function(err, previous){
                Article.find({}).sort({'nombre_comms': -1}).limit(3).exec(function(err, popular_post){
                    Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
                        Commentaire.find({article_id: req.params.article_id}, function (err, commentaires) {
                            var EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
                            var EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
                            res.render('Article/article', {title, layout: 'Index/layout.hbs', article: article, next: next, previous: previous, popular_post:popular_post, recent_post:recent_post,recent_post2: recent_post.slice(0,1), article1: recent_post.slice(0,1), user:req.user, EnrollSuccessNewsletter: EnrollSuccessNewsletter, EnrollFailureNewsletter: EnrollFailureNewsletter, commentaires:commentaires, csrfToken: req.csrfToken()});
                        });
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

router.post('/enroll_article', upload.single('photo'), isAuthenticated, function(req, res, next){
    console.log(req.body.type);
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

    //Gestions Fichiers
    if(!req.file){
        req.flash('NewArticleMessage', 'Choissiez Une Image');
        res.redirect('/articles/new_article');
    }

    var file = req.file;
    var path = file.path.substring(6);
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg"){
        newArticle.photo = path;
    }
    else{
        req.flash('NewArticleMessage', "Format Image Incompatible");
        res.redirect('/articles/new_article');
    }
    newArticle.save(function(err){
        if(err)
            throw err
    });
    res.redirect('/articles/list_article');
});

router.post('/uploadPhotos', upload.single('file'), isAuthenticated, function (req, res, next) {
    return res.status(200).send(req.file);
});

//TODO Edit Article
router.get('/edit_article/:article_id', isAuthenticated, function (req, res, next) {
    Article.findById(req.params.article_id, function (err, article) {
        res.render('Admin/Article/edit_article', {title, layout:'Admin/layout.hbs', article: article, type: types.indexOf(article.type) + 1});
    });
});

router.post('/edit_article/', upload.single('photo'), isAuthenticated, function (req, res, next) {
    Article.findById(req.body.article_id, function (err, article) {
        article.auteur_nom = req.body.auteur;
        article.titre = req.body.titre;
        article.type = types[parseInt(req.body.type) - 1];
        article.contenu = req.body.contenu;
        console.log(req.file);
        if(req.file){
            article.photo = req.file.path.substring(6);
        }
        article.save(function (err) {
            if(err)
                throw err;
            console.log(article);
            return res.redirect('/articles/list_article');
        });
    });
});
router.get('/del_article/:article_id', isAuthenticated, function (req, res, next) {
    Article.remove({_id: req.params.article_id}, function (err) {
        if(err)
            throw err;
        return res.redirect('/articles/list_article');
    });
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