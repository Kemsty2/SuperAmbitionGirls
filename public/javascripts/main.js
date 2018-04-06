(function ($) {
    "use strict";
	$(document).ready(function() {
		/*$('#carousel-example-generic1').carousel({
		  interval: 1600
		});*/
		$('.header_submit').attr('value','');
		$('.fm_newsletter').attr('value','');
		
		$('.header_submit') .on('click', function(){
            $('.header_input').toggleClass('display_block');
        });
	});
});

$(document).ready(function() {
    $('#contenu').html($('#contenuhidden').val());
    $('#href').val(document.location);
    $('#href2').val(document.location);
    $('#href3').val(document.location);
    $('#href4').val(document.location);
    $('#href5').val(document.location);
});

$('.ofm li.m_nav').on('click',function(){$(".mobi-menu").slideToggle("slow");$(this).find(".mobi-menu").slideToggle("slow");});$('#cssmenu li.has-sub>a').on('click',function(){$(this).removeAttr('href');var element=$(this).parent('li');if(element.hasClass('open')){element.removeClass('open');element.find('li').removeClass('open');element.find('ul').slideUp();}else{element.addClass('open');element.children('ul').slideDown();element.siblings('li').children('ul').slideUp();element.siblings('li').removeClass('open');element.siblings('li').find('li').removeClass('open');element.siblings('li').find('ul').slideUp();}});$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');(function getColor(){var r,g,b;var textColor=$('#cssmenu').css('color');textColor=textColor.slice(4);r=textColor.slice(0,textColor.indexOf(','));textColor=textColor.slice(textColor.indexOf(' ')+1);g=textColor.slice(0,textColor.indexOf(','));textColor=textColor.slice(textColor.indexOf(' ')+1);b=textColor.slice(0,textColor.indexOf(')'));var l=rgbToHsl(r,g,b);if(l>0.7){$('#cssmenu>ul>li>a').css('text-shadow','0 1px 1px rgba(0, 0, 0, .35)');$('#cssmenu>ul>li>a>span').css('border-color','rgba(0, 0, 0, .35)');}else{$('#cssmenu>ul>li>a').css('text-shadow','0 1px 0 rgba(255, 255, 255, .35)');$('#cssmenu>ul>li>a>span').css('border-color','rgba(255, 255, 255, .35)');}})();

$('#comms1').on('click', function () {
    $('#boxcomms1').show();
});

$(".alert").delay(4000).slideUp(200, function() {
    $(this).alert('close');
});

$(function(){
    $("#user_login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email: "Svp Entrez votre adresse email",
            password:{
                required: "Svp Entrer votre mot de passe"
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});
