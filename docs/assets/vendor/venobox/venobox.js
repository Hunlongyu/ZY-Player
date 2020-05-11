/*
 * VenoBox - jQuery Plugin
 * version: 1.8.6
 * @requires jQuery >= 1.7.0
 *
 * Examples at http://veno.es/venobox/
 * License: MIT License
 * License URI: https://github.com/nicolafranchini/VenoBox/blob/master/LICENSE
 * Copyright 2013-2019 Nicola Franchini - @nicolafranchini
 *
 */

/* global jQuery */

(function($){
    "use strict";
    var autoplay, bgcolor, blocknum, blocktitle, border, core, container, content, dest, extraCss,
        framewidth, frameheight, gallItems, infinigall, items, keyNavigationDisabled, margine, numeratio,
        overlayColor, overlay, title, thisgall, thenext, theprev, nextok, prevok, preloader, $preloader, navigation,
        obj, gallIndex, startouch, vbheader, images, startY, startX, endY, endX, diff, diffX, diffY, threshold;

    $.fn.extend({
        //plugin name - venobox
        venobox: function(options) {
            var plugin = this;
            // default options
            var defaults = {
                arrowsColor : '#B6B6B6',
                autoplay : false, // same as data-autoplay - thanks @codibit
                bgcolor: '#fff',
                border: '0',
                closeBackground : '#161617',
                closeColor : "#d2d2d2",
                framewidth: '',
                frameheight: '',
                gallItems: false,
                infinigall: false,
                htmlClose : '&times;',
                htmlNext : '<span>Next</span>',
                htmlPrev : '<span>Prev</span>',
                numeratio: false,
                numerationBackground : '#161617',
                numerationColor : '#d2d2d2',
                numerationPosition : 'top', // 'top' || 'bottom'
                overlayClose: true, // disable overlay click-close - thanx @martybalandis
                overlayColor : 'rgba(23,23,23,0.85)',
                spinner : 'double-bounce', // available: 'rotating-plane' | 'double-bounce' | 'wave' | 'wandering-cubes' | 'spinner-pulse' | 'chasing-dots' | 'three-bounce' | 'circle' | 'cube-grid' | 'fading-circle' | 'folding-cube'
                spinColor : '#d2d2d2',
                titleattr: 'title', // specific attribute to get a title (e.g. [data-title]) - thanx @mendezcode
                titleBackground: '#161617',
                titleColor: '#d2d2d2',
                titlePosition : 'top', // 'top' || 'bottom'
                cb_pre_open: function(){ return true; }, // Callbacks - thanx @garyee
                cb_post_open: function(){},
                cb_pre_close: function(){ return true; },
                cb_post_close: function(){},
                cb_post_resize: function(){},
                cb_after_nav: function(){},
                cb_content_loaded: function(){},
                cb_init: function(){}
            };

            var option = $.extend(defaults, options);

            // callback plugin initialization
            option.cb_init(plugin);

            return this.each(function() {

                obj = $(this);

                // Prevent double initialization - thanx @matthistuff
                if (obj.data('venobox')) {
                  return true;
                }

                // method to be used outside the plugin
                plugin.VBclose = function() {
                    closeVbox();
                };
                obj.addClass('vbox-item');
                obj.data('framewidth', option.framewidth);
                obj.data('frameheight', option.frameheight);
                obj.data('border', option.border);
                obj.data('bgcolor', option.bgcolor);
                obj.data('numeratio', option.numeratio);
                obj.data('gallItems', option.gallItems);
                obj.data('infinigall', option.infinigall);
                obj.data('overlaycolor', option.overlayColor);
                obj.data('titleattr', option.titleattr);

                obj.data('venobox', true);

                obj.on('click', function(e){

                    e.preventDefault();
                    obj = $(this);

                    // callback plugin initialization
                    var cb_pre_open = option.cb_pre_open(obj);

                    if (cb_pre_open === false) {
                      return false;
                    }

                    // methods to be used outside the plugin
                    plugin.VBnext = function() {
                        navigateGall(thenext);
                    };
                    plugin.VBprev = function() {
                        navigateGall(theprev);
                    };

                    overlayColor = obj.data('overlay') || obj.data('overlaycolor');

                    framewidth = obj.data('framewidth');
                    frameheight = obj.data('frameheight');
                    // set data-autoplay="true" for vimeo and youtube videos - thanx @zehfernandes
                    autoplay = obj.data('autoplay') || option.autoplay;
                    border = obj.data('border');
                    bgcolor = obj.data('bgcolor');
                    nextok = false;
                    prevok = false;
                    keyNavigationDisabled = false;

                    // set a different url to be loaded using data-href="" - thanx @pixeline
                    dest = obj.data('href') || obj.attr('href');
                    extraCss = obj.data( 'css' ) || '';
                    title = obj.attr(obj.data('titleattr')) || '';

                    preloader = '<div class="vbox-preloader">';

                    switch (option.spinner) {

                        case 'rotating-plane':
                            preloader += '<div class="sk-rotating-plane"></div>';
                            break;
                        case 'double-bounce':
                            preloader += '<div class="sk-double-bounce">'+
                            '<div class="sk-child sk-double-bounce1"></div>'+
                            '<div class="sk-child sk-double-bounce2"></div>'+
                            '</div>';
                            break;
                        case 'wave':
                            preloader += '<div class="sk-wave">'+
                            '<div class="sk-rect sk-rect1"></div>'+
                            '<div class="sk-rect sk-rect2"></div>'+
                            '<div class="sk-rect sk-rect3"></div>'+
                            '<div class="sk-rect sk-rect4"></div>'+
                            '<div class="sk-rect sk-rect5"></div>'+
                            '</div>';
                            break;
                        case 'wandering-cubes':
                            preloader += '<div class="sk-wandering-cubes">'+
                            '<div class="sk-cube sk-cube1"></div>'+
                            '<div class="sk-cube sk-cube2"></div>'+
                            '</div>';
                            break;
                          case 'spinner-pulse':
                            preloader += '<div class="sk-spinner sk-spinner-pulse"></div>';
                            break;
                        case 'chasing-dots':
                            preloader += '<div class="sk-chasing-dots">'+
                            '<div class="sk-child sk-dot1"></div>'+
                            '<div class="sk-child sk-dot2"></div>'+
                            '</div>';
                            break;
                        case 'three-bounce':
                            preloader += '<div class="sk-three-bounce">'+
                            '<div class="sk-child sk-bounce1"></div>'+
                            '<div class="sk-child sk-bounce2"></div>'+
                            '<div class="sk-child sk-bounce3"></div>'+
                            '</div>';
                            break;
                        case 'circle':
                            preloader += '<div class="sk-circle">'+
                            '<div class="sk-circle1 sk-child"></div>'+
                            '<div class="sk-circle2 sk-child"></div>'+
                            '<div class="sk-circle3 sk-child"></div>'+
                            '<div class="sk-circle4 sk-child"></div>'+
                            '<div class="sk-circle5 sk-child"></div>'+
                            '<div class="sk-circle6 sk-child"></div>'+
                            '<div class="sk-circle7 sk-child"></div>'+
                            '<div class="sk-circle8 sk-child"></div>'+
                            '<div class="sk-circle9 sk-child"></div>'+
                            '<div class="sk-circle10 sk-child"></div>'+
                            '<div class="sk-circle11 sk-child"></div>'+
                            '<div class="sk-circle12 sk-child"></div>'+
                            '</div>';
                            break;
                        case 'cube-grid':
                            preloader += '<div class="sk-cube-grid">'+
                            '<div class="sk-cube sk-cube1"></div>'+
                            '<div class="sk-cube sk-cube2"></div>'+
                            '<div class="sk-cube sk-cube3"></div>'+
                            '<div class="sk-cube sk-cube4"></div>'+
                            '<div class="sk-cube sk-cube5"></div>'+
                            '<div class="sk-cube sk-cube6"></div>'+
                            '<div class="sk-cube sk-cube7"></div>'+
                            '<div class="sk-cube sk-cube8"></div>'+
                            '<div class="sk-cube sk-cube9"></div>'+
                            '</div>';
                            break;
                        case 'fading-circle':
                            preloader += '<div class="sk-fading-circle">'+
                            '<div class="sk-circle1 sk-circle"></div>'+
                            '<div class="sk-circle2 sk-circle"></div>'+
                            '<div class="sk-circle3 sk-circle"></div>'+
                            '<div class="sk-circle4 sk-circle"></div>'+
                            '<div class="sk-circle5 sk-circle"></div>'+
                            '<div class="sk-circle6 sk-circle"></div>'+
                            '<div class="sk-circle7 sk-circle"></div>'+
                            '<div class="sk-circle8 sk-circle"></div>'+
                            '<div class="sk-circle9 sk-circle"></div>'+
                            '<div class="sk-circle10 sk-circle"></div>'+
                            '<div class="sk-circle11 sk-circle"></div>'+
                            '<div class="sk-circle12 sk-circle"></div>'+
                            '</div>';
                            break;
                        case 'folding-cube':
                            preloader += '<div class="sk-folding-cube">'+
                            '<div class="sk-cube1 sk-cube"></div>'+
                            '<div class="sk-cube2 sk-cube"></div>'+
                            '<div class="sk-cube4 sk-cube"></div>'+
                            '<div class="sk-cube3 sk-cube"></div>'+
                            '</div>';
                            break;
                    }
                    preloader += '</div>';

                    navigation = '<a class="vbox-next">' + option.htmlNext + '</a><a class="vbox-prev">' + option.htmlPrev + '</a>';
                    vbheader = '<div class="vbox-title"></div><div class="vbox-num">0/0</div><div class="vbox-close">' + option.htmlClose + '</div>';

                    core = '<div class="vbox-overlay ' + extraCss + '" style="background:'+ overlayColor +'">'+
                    preloader + '<div class="vbox-container"><div class="vbox-content"></div></div>' + vbheader + navigation + '</div>';

                    $('body').append(core).addClass('vbox-open');

                    $('.vbox-preloader div:not(.sk-circle) .sk-child, .vbox-preloader .sk-rotating-plane, .vbox-preloader .sk-rect, .vbox-preloader div:not(.sk-folding-cube) .sk-cube, .vbox-preloader .sk-spinner-pulse').css('background-color', option.spinColor);

                    overlay = $('.vbox-overlay');
                    container = $('.vbox-container');
                    content = $('.vbox-content');
                    blocknum = $('.vbox-num');
                    blocktitle = $('.vbox-title');
                    $preloader = $('.vbox-preloader');

                    $preloader.show();

                    blocktitle.css(option.titlePosition, '-1px');
                    blocktitle.css({
                      'color' : option.titleColor,
                      'background-color' : option.titleBackground
                    });

                    $('.vbox-close').css({
                      'color' : option.closeColor,
                      'background-color' : option.closeBackground
                    });

                    $('.vbox-num').css(option.numerationPosition, '-1px');
                    $('.vbox-num').css({
                      'color' : option.numerationColor,
                      'background-color' : option.numerationBackground
                    });

                    $('.vbox-next span, .vbox-prev span').css({
                      'border-top-color' : option.arrowsColor,
                      'border-right-color' : option.arrowsColor
                    });

                    content.html('');
                    content.css('opacity', '0');
                    overlay.css('opacity', '0');

                    checknav();

                    // fade in overlay
                    overlay.animate({opacity:1}, 250, function(){

                        if (obj.data('vbtype') == 'iframe') {
                          loadIframe();
                        } else if (obj.data('vbtype') == 'inline') {
                          loadInline();
                        } else if (obj.data('vbtype') == 'ajax') {
                          loadAjax();
                        } else if (obj.data('vbtype') == 'video') {
                          loadVid(autoplay);
                        } else {
                          content.html('<img src="'+dest+'">');
                          preloadFirst();
                        }
                        option.cb_post_open(obj, gallIndex, thenext, theprev);
                    });

                    /* -------- KEYBOARD ACTIONS -------- */
                    $('body').keydown(keyboardHandler);

                    /* -------- PREVGALL -------- */
                    $('.vbox-prev').on('click', function(){
                        navigateGall(theprev);
                    });
                    /* -------- NEXTGALL -------- */
                    $('.vbox-next').on('click', function(){
                        navigateGall(thenext);
                    });

                    return false;

                }); // click

                /* -------- CHECK NEXT / PREV -------- */
                function checknav(){

                    thisgall = obj.data('gall');
                    numeratio = obj.data('numeratio');
                    gallItems = obj.data('gallItems');
                    infinigall = obj.data('infinigall');

                    if (gallItems) {
                        items = gallItems;
                    } else {
                        items = $('.vbox-item[data-gall="' + thisgall + '"]');
                    }

                    thenext = items.eq( items.index(obj) + 1 );
                    theprev = items.eq( items.index(obj) - 1 );

                    if (!thenext.length && infinigall === true) {
                      thenext = items.eq(0);
                    }

                    // update gall numeration
                    if (items.length >= 1) {
                      gallIndex = items.index(obj)+1;
                      blocknum.html(gallIndex + ' / ' + items.length);
                    } else {
                      gallIndex = 1;
                    }
                    if (numeratio === true) {
                      blocknum.show();
                    } else {
                      blocknum.hide();
                    }

                    // update title
                    if (title !== '') {
                      blocktitle.show();
                    } else {
                      blocktitle.hide();
                    }

                    // update navigation arrows
                    if (!thenext.length && infinigall !== true) {
                      $('.vbox-next').css('display', 'none');
                      nextok = false;
                    } else {
                      $('.vbox-next').css('display', 'block');
                      nextok = true;
                    }

                    if (items.index(obj) > 0 || infinigall === true) {
                      $('.vbox-prev').css('display', 'block');
                      prevok = true;
                    } else {
                      $('.vbox-prev').css('display', 'none');
                      prevok = false;
                    }
                    // activate swipe
                    if (prevok === true || nextok === true) {
                      content.on(TouchMouseEvent.DOWN, onDownEvent);
                      content.on(TouchMouseEvent.MOVE, onMoveEvent);
                      content.on(TouchMouseEvent.UP, onUpEvent);
                    }
                }

                /* -------- gallery navigation -------- */
                function navigateGall(destination) {

                    if (destination.length < 1) {
                      return false;
                    }
                    if (keyNavigationDisabled) {
                      return false;
                    }
                    keyNavigationDisabled = true;

                    overlayColor = destination.data('overlay') || destination.data('overlaycolor');

                    framewidth = destination.data('framewidth');
                    frameheight = destination.data('frameheight');
                    border = destination.data('border');
                    bgcolor = destination.data('bgcolor');
                    dest = destination.data('href') || destination.attr('href');

                    autoplay = destination.data('autoplay');

                    title = (destination.data('titleattr') && destination.attr(destination.data('titleattr'))) || '';

                    // swipe out item
                    if (destination === theprev) {
                      content.addClass('vbox-animated').addClass('swipe-right');
                    }
                    if (destination === thenext) {
                      content.addClass('vbox-animated').addClass('swipe-left');
                    }

                    $preloader.show();

                    content.animate({
                      opacity : 0,
                    }, 500, function(){

                      overlay.css('background',overlayColor);

                      content
                      .removeClass('vbox-animated')
                      .removeClass('swipe-left')
                      .removeClass('swipe-right')
                      .css({'margin-left': 0,'margin-right': 0});

                      if (destination.data('vbtype') == 'iframe') {
                        loadIframe();
                      } else if (destination.data('vbtype') == 'inline') {
                        loadInline();
                      } else if (destination.data('vbtype') == 'ajax') {
                        loadAjax();
                      } else if (destination.data('vbtype') == 'video') {
                        loadVid(autoplay);
                      } else {
                        content.html('<img src="'+dest+'">');
                        preloadFirst();
                      }
                      obj = destination;
                      checknav();
                      keyNavigationDisabled = false;
                      option.cb_after_nav(obj, gallIndex, thenext, theprev);
                    });
                }

                /* -------- KEYBOARD HANDLER -------- */
                function keyboardHandler(e) {
                    if (e.keyCode === 27) { // esc
                      closeVbox();
                    }

                    if (e.keyCode == 37 && prevok === true) { // left
                      navigateGall(theprev);
                    }

                    if (e.keyCode == 39 && nextok === true) { // right
                      navigateGall(thenext);
                    }
                }

                /* -------- CLOSE VBOX -------- */
                function closeVbox(){

                    var cb_pre_close = option.cb_pre_close(obj, gallIndex, thenext, theprev);

                    if (cb_pre_close === false) {
                      return false;
                    }

                    $('body').off('keydown', keyboardHandler).removeClass('vbox-open');

                    obj.focus();

                    overlay.animate({opacity:0}, 500, function(){
                      overlay.remove();
                      keyNavigationDisabled = false;
                      option.cb_post_close();
                    });
                }

                /* -------- CLOSE CLICK -------- */
                var closeclickclass = '.vbox-overlay';
                if(!option.overlayClose){
                    closeclickclass = '.vbox-close'; // close only on X
                }

                $('body').on('click touchstart', closeclickclass, function(e){
                    if ($(e.target).is('.vbox-overlay') ||
						$(e.target).is('.vbox-content') ||
						$(e.target).is('.vbox-close') ||
						$(e.target).is('.vbox-preloader') ||
						$(e.target).is('.vbox-container')
                    ) {
                        closeVbox();
                    }
                });

                startX = 0;
                endX = 0;

                diff = 0;
                threshold = 50;
                startouch = false;

                function onDownEvent(e){
                    content.addClass('vbox-animated');
                    startY = endY = e.pageY;
                    startX = endX = e.pageX;
                    startouch = true;
                }

                function onMoveEvent(e){
                    if (startouch === true) {
                        endX = e.pageX;
                        endY = e.pageY;

                        diffX = endX - startX;
                        diffY = endY - startY;

                        var absdiffX = Math.abs(diffX);
                        var absdiffY = Math.abs(diffY);

                        if ((absdiffX > absdiffY) && (absdiffX <= 100)) {
                            e.preventDefault();
                            content.css('margin-left', diffX);
                        }
                    }
                }

                function onUpEvent(e){
                    if (startouch === true) {
                        startouch = false;
                        var subject = obj;
                        var change = false;
                        diff = endX - startX;

                        if (diff < 0 && nextok === true) {
                            subject = thenext;
                            change = true;
                        }
                        if (diff > 0 && prevok === true) {
                            subject = theprev;
                            change = true;
                        }

                        if (Math.abs(diff) >= threshold && change === true) {
                            navigateGall(subject);
                        } else {
                            content.css({'margin-left': 0,'margin-right': 0});
                        }
                    }
                }

                /* == GLOBAL DECLERATIONS == */
                var TouchMouseEvent = {
                    DOWN: "touchmousedown",
                    UP: "touchmouseup",
                    MOVE: "touchmousemove"
                };

                /* == EVENT LISTENERS == */
                var onMouseEvent = function(event) {
                    var type;
                    switch (event.type) {
                        case "mousedown": type = TouchMouseEvent.DOWN; break;
                        case "mouseup":   type = TouchMouseEvent.UP;   break;
                        case "mouseout":   type = TouchMouseEvent.UP;   break;
                        case "mousemove": type = TouchMouseEvent.MOVE; break;
                        default:
                            return;
                    }
                    var touchMouseEvent = normalizeEvent(type, event, event.pageX, event.pageY);
                    $(event.target).trigger(touchMouseEvent);
                };

                var onTouchEvent = function(event) {
                    var type;
                    switch (event.type) {
                        case "touchstart": type = TouchMouseEvent.DOWN; break;
                        case "touchend":   type = TouchMouseEvent.UP;   break;
                        case "touchmove":  type = TouchMouseEvent.MOVE; break;
                        default:
                            return;
                    }

                    var touch = event.originalEvent.touches[0];
                    var touchMouseEvent;

                    if (type == TouchMouseEvent.UP) {
                         touchMouseEvent = normalizeEvent(type, event, null, null);
                    } else {
                        touchMouseEvent = normalizeEvent(type, event, touch.pageX, touch.pageY);
                    }
                    $(event.target).trigger(touchMouseEvent);
                };

                /* == NORMALIZE == */
                var normalizeEvent = function(type, original, x, y) {
                    return $.Event(type, {
                        pageX: x,
                        pageY: y,
                        originalEvent: original
                    });
                };

                /* == LISTEN TO ORIGINAL EVENT == */
                if ("ontouchstart" in window) {
                    $(document).on("touchstart", onTouchEvent);
                    $(document).on("touchmove", onTouchEvent);
                    $(document).on("touchend", onTouchEvent);
                } else {
                    $(document).on("mousedown", onMouseEvent);
                    $(document).on("mouseup", onMouseEvent);
                    $(document).on("mouseout", onMouseEvent);
                    $(document).on("mousemove", onMouseEvent);
                }

                /* -------- LOAD AJAX -------- */
                function loadAjax(){
                  $.ajax({
                  url: dest,
                  cache: false
                  }).done(function( msg ) {
                      content.html('<div class="vbox-inline">'+ msg +'</div>');
                      preloadFirst();

                  }).fail(function() {
                      content.html('<div class="vbox-inline"><p>Error retrieving contents, please retry</div>');
                      updateoverlay();
                  });
                }

                /* -------- LOAD IFRAME -------- */
                function loadIframe(){
                    content.html('<iframe class="venoframe" src="'+dest+'"></iframe>');
                  //  $('.venoframe').load(function(){ // valid only for iFrames in same domain
                    updateoverlay();
                  //  });
                }

                /* -------- LOAD VIDEOs -------- */
                function loadVid(autoplay){

                    var player;
                    var videoObj = parseVideo(dest);

                    // set rel=0 to hide related videos at the end of YT + optional autoplay
                    var stringAutoplay = autoplay ? "?rel=0&autoplay=1" : "?rel=0";
                    var queryvars = stringAutoplay + getUrlParameter(dest);

                    if (videoObj.type == 'vimeo') {
                      player = 'https://player.vimeo.com/video/';
                    } else if (videoObj.type == 'youtube') {
                      player = 'https://www.youtube.com/embed/';
                    }
                    content.html('<iframe class="venoframe vbvid" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay" frameborder="0" src="'+player+videoObj.id+queryvars+'"></iframe>');
                    updateoverlay();
                }

                /**
                * Parse Youtube or Vimeo videos and get host & ID
                */
                function parseVideo (url) {
                    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
                    var type;
                    if (RegExp.$3.indexOf('youtu') > -1) {
                        type = 'youtube';
                    } else if (RegExp.$3.indexOf('vimeo') > -1) {
                        type = 'vimeo';
                    }
                    return {
                        type: type,
                        id: RegExp.$6
                    };
                }

                /**
                * get additional video url parameters
                */
                function getUrlParameter(name) {
                  var result = '';
                  var sPageURL = decodeURIComponent(name);
                  var firstsplit = sPageURL.split('?');

                  if (firstsplit[1] !== undefined) {
                      var sURLVariables = firstsplit[1].split('&');
                      var sParameterName;
                      var i;
                      for (i = 0; i < sURLVariables.length; i++) {
                          sParameterName = sURLVariables[i].split('=');
                          result = result + '&'+ sParameterName[0]+'='+ sParameterName[1];
                      }
                  }
                  return encodeURI(result);
                }

                /* -------- LOAD INLINE -------- */
                function loadInline(){
                    content.html('<div class="vbox-inline">'+$(dest).html()+'</div>');
                    updateoverlay();
                }

                /* -------- PRELOAD IMAGE -------- */
                function preloadFirst(){
                    images = content.find('img');

                    if (images.length) {
                        images.each(function(){
                            $(this).one('load', function() {
                                updateoverlay();
                            });
                        });
                    } else {
                        updateoverlay();
                    }
                }

                /* -------- FADE-IN THE NEW CONTENT -------- */
                function updateoverlay(){

                    blocktitle.html(title);

                    content.find(">:first-child").addClass('vbox-figlio').css({
                        'width': framewidth,
                        'height': frameheight,
                        'padding': border,
                        'background': bgcolor
                    });

                    $('img.vbox-figlio').on('dragstart', function(event) {
                        event.preventDefault();
                    });

                    updateOL();

                    content.animate({
                        'opacity': '1'
                    },'slow', function(){
                        $preloader.hide();
                    });
                    option.cb_content_loaded(obj, gallIndex, thenext, theprev);
                }

                /* -------- CENTER FRAME -------- */
                function updateOL(){

                    var sonH = content.outerHeight();
                    var finH = $(window).height();

                    if (sonH + 60 < finH) {
                        margine = (finH - sonH)/2;
                    } else {
                        margine = '30px';
                    }
                    content.css('margin-top', margine);
                    content.css('margin-bottom', margine);
                    option.cb_post_resize();
                }

                $(window).resize(function(){
                    if($('.vbox-content').length){
                        setTimeout(updateOL(), 800);
                    }
                });
            }); // each
        } // venobox
    }); // extend
})(jQuery);
