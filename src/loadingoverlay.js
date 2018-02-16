/***************************************************************************************************
LoadingOverlay - A flexible loading overlay jQuery plugin
    Author          : Gaspare Sganga
    Version         : 2.0.0dev
    License         : MIT
    Documentation   : https://gasparesganga.com/labs/jquery-loading-overlay/
***************************************************************************************************/
;(function(factory){
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        // Node/CommonJS
        factory(require("jquery"));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($, undefined){
    "use strict";
    
    // Default Settings
    var _defaults = {
        // Background
        "backgroundClass"   : "",
        "backgroundCss"     : {
            "background-color"   : "rgba(255, 255, 255, 0.8)"
        },
        // Image
        "image"             : "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjxlbGxpcHNlIHJ4PSI4MCIgcnk9IjgwIiBjeD0iNTAwIiBjeT0iOTAiLz48ZWxsaXBzZSByeD0iODAiIHJ5PSI4MCIgY3g9IjUwMCIgY3k9IjkxMCIvPjxlbGxpcHNlIHJ4PSI4MCIgcnk9IjgwIiBjeD0iOTAiIGN5PSI1MDAiLz48ZWxsaXBzZSByeD0iODAiIHJ5PSI4MCIgY3g9IjkxMCIgY3k9IjUwMCIvPjxlbGxpcHNlIHJ4PSI4MCIgcnk9IjgwIiBjeD0iMjEyIiBjeT0iMjEyIi8+PGVsbGlwc2Ugcng9IjgwIiByeT0iODAiIGN4PSI3ODgiIGN5PSIyMTIiLz48ZWxsaXBzZSByeD0iODAiIHJ5PSI4MCIgY3g9IjIxMiIgY3k9Ijc4OCIvPjxlbGxpcHNlIHJ4PSI4MCIgcnk9IjgwIiBjeD0iNzg4IiBjeT0iNzg4Ii8+PC9zdmc+",
        "imageClass"        : "",
        "imageCss"          : {
            "animation-name"            : "loadingoverlay_animation__rotate_right",
            "animation-duration"        : "2000ms",
            "animation-timing-function" : "linear",
            "animation-iteration-count" : "infinite",
            "fill"                      : "#202020"
        },
        
        
        "custom"            : "",
        "fade"              : [400, 200],
        "fontawesome"       : "",
        "imagePosition"     : "center center",
        "maxSize"           : 120,
        "minSize"           : 20,
        "resizeInterval"    : 50,
        "size"              : "50%",
        "zIndex"            : 2147483647
    };
    
    // Required CSS
    var _css = {
        overlay : {
            "box-sizing"        : "border-box",
            "position"          : "relative",
            "display"           : "flex",
            "flex-direction"    : "column",
            "align-items"       : "center",
            "justify-content"   : "center"
        },
        element : {
            "box-sizing"        : "border-box",
            "display"           : "flex",
            "align-items"       : "center",
            "justify-content"   : "center"
        },
        element_child : {
            "width"     : "100%",
            "height"    : "100%"
        }
    };
    
    // Data Template
    var _dataTemplate = {
        "count"             : 0,
        "fadeOut"           : 0,
        "overlay"           : undefined,
        "resizeIntervalId"  : undefined
    };
    
    
    $.LoadingOverlaySetup = function(settings){
        $.extend(true, _defaults, settings);
    };
    
    $.LoadingOverlay = function(action, options){
        switch (action.toLowerCase()) {
            case "show":
                var settings = $.extend(true, {}, _defaults, options);
                _Show("body", settings);
                break;
                
            case "hide":
                _Hide("body", options);
                break;
        }
    };
    
    $.fn.LoadingOverlay = function(action, options){
        switch (action.toLowerCase()) {
            case "show":
                var settings = $.extend(true, {}, _defaults, options);
                return this.each(function(){
                    _Show(this, settings);
                });
                
            case "hide":
                return this.each(function(){
                    _Hide(this, options);
                });
        }
    };
    
    
    function _Show(container, settings){
        container       = $(container);    
        var data        = container.data("loadingoverlay");
        var wholePage   = container.is("body");
        if (typeof data === "undefined") {
            // Init data
            data = $.extend({}, _dataTemplate);
            container.data("loadingoverlay", data);
            
            // Overlay
            data.overlay = $("<div>", {
                "class" : "loadingoverlay",
                "css"   : settings.backgroundCss
            })
            .addClass(settings.backgroundClass)
            .css(_css.overlay);
            if (typeof settings.zIndex !== "undefined") data.overlay.css("z-index", settings.zIndex);
            
            // Image
            if (settings.image) {
                var element = _CreateElement(data.overlay, settings.imageClass, settings.imageCss);
                if (settings.image.slice(0, 14).toLowerCase() === "data:image/svg" || settings.image.slice(-4).toLowerCase() === ".svg") {
                    element.load(settings.image);
                } else {
                    $("<img>", {
                        "src"   : settings.image
                    }).appendTo(element);
                }
            }
            
            
            
            // Font Awesome
            if (settings.fontawesome) $("<div>", {
                "class" : "loadingoverlay_fontawesome " + settings.fontawesome
            }).appendTo(data.overlay);
            if (settings.custom) $(settings.custom).appendTo(data.overlay);
            if (wholePage) {
                data.overlay.css({
                    "position"  : "fixed",
                    "top"       : 0,
                    "left"      : 0,
                    "width"     : "100%",
                    "height"    : "100%"
                });
            } else {
                data.overlay.css("position", (container.css("position") === "fixed") ? "fixed" : "absolute");
            }
            
            // Resize
            _Resize(container, data.overlay, settings, wholePage);
            if (settings.resizeInterval > 0) {
                data.resizeIntervalId = setInterval(function(){
                    _Resize(container, data.overlay, settings, wholePage);
                }, settings.resizeInterval);
            }
            
            //Fade
            if (!settings.fade) {
                settings.fade = [0, 0];
            } else if (settings.fade === true) {
                settings.fade = _defaults.fade;
            } else if (typeof settings.fade === "string" || typeof settings.fade === "number") {
                settings.fade = [settings.fade, settings.fade];
            }
            data.fadeOut = settings.fade[1];
            
            
            // Elements children CSS
            data.overlay.children(".loadingoverlay_element").children().css(_css.element_child);
            
            // Show LoadingOverlay
            data.overlay
                    .hide()
                    .appendTo("body")
                    .fadeIn(settings.fade[0]);
        }
        data.count++;
    }
    
    function _CreateElement(overlay, customClass, customCss){
        return $("<div>", {
            "class" : "loadingoverlay_element",
            "css"   : customCss
        })
        .addClass(customClass)
        .css(_css.element || {})
        .appendTo(overlay);
    }
    
    
    function _Hide(container, force){
        container   = $(container);
        var data    = container.data("loadingoverlay");
        if (typeof data === "undefined") return;
        data.count--;
        if (force || data.count <= 0) {
            if (data.resizeIntervalId) clearInterval(data.resizeIntervalId);
            data.overlay.fadeOut(data.fadeOut, function(){
                $(this).remove();
            });
            container.removeData("loadingoverlay");
        }
    }
    
    function _Resize(container, overlay, settings, wholePage){
        if (!wholePage) {
            var x = (container.css("position") === "fixed") ? container.position() : container.offset();
            overlay.css({
                "top"       : x.top + parseInt(container.css("border-top-width"), 10),
                "left"      : x.left + parseInt(container.css("border-left-width"), 10),
                "width"     : container.innerWidth(),
                "height"    : container.innerHeight()
            });
        }
        var c    = wholePage ? $(window) : container;
        var size = "auto";
        if (settings.size && settings.size != "auto") {
            size = Math.min(c.innerWidth(), c.innerHeight()) * parseFloat(settings.size) / 100;
            if (settings.maxSize && size > parseInt(settings.maxSize, 10)) size = parseInt(settings.maxSize, 10) + "px";
            if (settings.minSize && size < parseInt(settings.minSize, 10)) size = parseInt(settings.minSize, 10) + "px";
        }
        overlay.children(".loadingoverlay_element").css({
            "width"  : size,
            "height" : size
        });
        overlay.children(".loadingoverlay_fontawesome").css("font-size", size);
    }
    
    
    $(function(){
        $("head").append([
            "<style>",
                "@-webkit-keyframes loadingoverlay_animation__rotate_right {",
                  "to {",
                    "-webkit-transform : rotate(360deg);",
                            "transform : rotate(360deg);",
                  "}",
                "}",
                "@keyframes loadingoverlay_animation__rotate_right {",
                  "to {",
                    "-webkit-transform : rotate(360deg);",
                            "transform : rotate(360deg);",
                  "}",
                "}",
                
                "@-webkit-keyframes loadingoverlay_animation__rotate_left {",
                  "to {",
                    "-webkit-transform : rotate(-360deg);",
                            "transform : rotate(-360deg);",
                  "}",
                "}",
                "@keyframes loadingoverlay_animation__rotate_left {",
                  "to {",
                    "-webkit-transform : rotate(-360deg);",
                            "transform : rotate(-360deg);",
                  "}",
                "}",
                
                "@-webkit-keyframes loadingoverlay_animation__fadein {",
                  "0% {",
                            "opacity   : 0;",
                    "-webkit-transform : scale(0.1, 0.1);",
                            "transform : scale(0.1, 0.1);",
                  "}",
                  "50% {",
                            "opacity   : 1;",
                  "}",
                  "100% {",
                            "opacity   : 0;",
                    "-webkit-transform : scale(1, 1);",
                            "transform : scale(1, 1);",
                  "}",
                "}",
                "@keyframes loadingoverlay_animation__fadein {",
                  "0% {",
                            "opacity   : 0;",
                    "-webkit-transform : scale(0.1, 0.1);",
                            "transform : scale(0.1, 0.1);",
                  "}",
                  "50% {",
                            "opacity   : 1;",
                  "}",
                  "100% {",
                            "opacity   : 0;",
                    "-webkit-transform : scale(1, 1);",
                            "transform : scale(1, 1);",
                  "}",
                "}",
                
                "@-webkit-keyframes loadingoverlay_animation__pulse {",
                  "0% {",
                    "-webkit-transform : scale(0, 0);",
                            "transform : scale(0, 0);",
                  "}",
                  "50% {",
                    "-webkit-transform : scale(1, 1);",
                            "transform : scale(1, 1);",
                  "}",
                  "100% {",
                    "-webkit-transform : scale(0, 0);",
                            "transform : scale(0, 0);",
                  "}",
                "}",
                "@keyframes loadingoverlay_animation__pulse {",
                  "0% {",
                    "-webkit-transform : scale(0, 0);",
                            "transform : scale(0, 0);",
                  "}",
                  "50% {",
                    "-webkit-transform : scale(1, 1);",
                            "transform : scale(1, 1);",
                  "}",
                  "100% {",
                    "-webkit-transform : scale(0, 0);",
                            "transform : scale(0, 0);",
                  "}",
                "}",
            "</style>"
        ].join(" "));
    });
    
}));