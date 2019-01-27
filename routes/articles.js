/**
 * Created by LeKemsty on 07/03/2018.
 */
const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Commentaire = require('../models/commentaires');
const types = ['Super Ambitieux', 'LifeStyle', 'Edito', 'Empowering', 'Love & Relation'];
const csurf = require('csurf');
const csrfProtection = csurf({cookie: true});
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/upload_images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});


const title = "SAG, Ambition & Distinction";

router.get('/lecture/:article_id', csrfProtection, function(req, res, next){
    Article.findById(req.params.article_id, function(err, article){
        Article.find({_id: {$gt: req.params.article_id}}).sort({_id: 1}).limit(1).exec(function(err, next){
            Article.find({_id: {$lt: req.params.article_id}}).sort({_id: -1}).limit(1).exec(function(err, previous){
                Article.find({}).sort({'nombre_comms': -1}).limit(3).exec(function(err, popular_post){
                    Article.find({}).sort({'date_publication': -1}).limit(3).exec(function(err, recent_post){
                        Commentaire.find({article_id: req.params.article_id}, function (err, commentaires) {
                          const LoginSuccessMessage = req.flash('LoginSuccessMessage');
                          const LoginFailureMessage = req.flash('LoginFailureMessage');
                          const EnrollSuccessNewsletter = req.flash('EnrollSuccessNewsletter');
                          const EnrollFailureNewsletter = req.flash('EnrollFailureNewsletter');
                          const RegisterSuccessMessage = req.flash('RegisterSuccessMessage');
                          const RegisterFailureMessage = req.flash('RegisterFailureMessage');
                          let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                            if(article.vues.indexOf(ip) === -1){
                                console.log('yeah');
                                article.vues.push(ip);
                                console.log(article.vues);
                                article.save();
                            }
                            res.render('Article/article', {title, layout: 'Index/layout.hbs', article: article, next: next, previous: previous, popular_post:popular_post, recent_post:recent_post,recent_post2: recent_post.slice(0,1), article1: recent_post.slice(0,1), user:req.user, EnrollSuccessNewsletter: EnrollSuccessNewsletter, EnrollFailureNewsletter: EnrollFailureNewsletter, commentaires:commentaires, csrfToken: req.csrfToken(), LoginFailureMessage: LoginFailureMessage, LoginSuccessMessage: LoginSuccessMessage, RegisterFailureMessage: RegisterFailureMessage, RegisterSuccessMessage: RegisterSuccessMessage});
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
  const newArticle = new Article({
    titre: req.body.titre,
    type: types[parseInt(req.body.type) - 1],
    auteur_id: req.session.admin._id,
    auteur_nom: req.session.admin.noms,
    contenu: req.body.contenu,
    description: req.body.description
  });
  const tags = req.body.tags.split(',');
  for(let i=0; i<tags.length; i++){
        newArticle.tags[i] = tags[i];
    }
    if(req.body.special === 'special'){
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

  const file = req.file;
  const path = file.path.substring(6);
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/jpg"){
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
        article.description = req.body.description;
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