;(function($) {
"use strict";
// instaFeed By Dhananjaya @dkarandana 2016-10-12
$.fn.instaFeed = function( options ) {
	var o;
    if ( this.length === 0 && !$.isReady ) {
        o = { s: this.selector, c: this.context };
        $.fn.instaFeed.log('(dom not ready)');
        $(function() {
            $( o.s, o.c ).instaFeed( options );
        });
        return this;
    }
	return this.each(function() {
		var data, opts, shortName, val;
        var container = $(this);
       	var log = $.fn.instaFeed.log;

        if ( container.data('instafeed-log') === false || 
           ( options && options.log === false ) ||
           ( opts && opts.log === false) ) {
         //  log = $.noop;
        }

        log('--initialized--');

        data = container.data();

        for (var p in data) {
            // allow props to be accessed sans 'cycle' prefix and log the overrides
            if (data.hasOwnProperty(p) && /^instafeed[A-Z]+/.test(p) ) {
                val = data[p];
                shortName = p.match(/^instafeed(.*)/)[1].replace(/^[A-Z]/, lowerCase);
                log(shortName+':', val, '('+typeof val +')');
                data[shortName] = val;
            }
        }

        opts = $.extend( {}, $.fn.instaFeed.defaults, data, options || {});

        opts.API = $.extend ( { _container: container }, $.fn.instaFeed.API );
 		opts.API.log = log;

 		container.data( 'instaFeed.opts', opts );
        container.data( 'instaFeed.API', opts.API );
        if (/\S/.test( opts.profile )) {
			opts.API.loadImages(container, opts );
        }
	});
};

function lowerCase(s) {
    return (s || '').toLowerCase();
}

$.fn.instaFeed.API = {
	opts: function() {
        return this._container.data( 'instaFeed.opts' );
    },
    template: function( str, opts /*, ... */) {
        var regex = new RegExp( opts.templateRegex || $.fn.instaFeed.defaults.templateRegex, 'g' );
        var args = $.makeArray( arguments );
        args.shift();
        return str.replace(regex, function(_, str) {
            var i, j, obj, prop, names = str.split('.');
            for (i=0; i < args.length; i++) {
                obj = args[i];
                if ( ! obj )
                    continue;
                if (names.length > 1) {
                    prop = obj;
                    for (j=0; j < names.length; j++) {
                        obj = prop;
                        prop = prop[ names[j] ] || str;
                    }
                } else {
                    prop = obj[str];
                }

                if ($.isFunction(prop))
                    return prop.apply(obj, args);
                if (prop !== undefined && prop !== null && prop != str)
                    return prop;
            }
            return str;
        });
    },
    loadImages:function( container ){
    	var opts = this.opts();
    	opts.API.log('requesting images from', opts.profile );
    	$.ajax({
			url: opts.apiURL + opts.endpoint,
			dataType: 'jsonp',
			type: 'GET',
			data: {access_token: opts.token, count: opts.maxphotos},
			success: function(data){

				opts.API.log(opts);
				var $element = container,
					num=1,
                    templateString,
                    allowWrap;

				if( $element.length > 0 ){
					for( var x in data.data ){ 
                        if( typeof data.data[x] === "object"){

                            templateString =  opts.API.template( opts.template , {
                                parentCls:opts.parentclass,
                                num:num++,
                                lowResolutionURL:data.data[x].images.low_resolution.url
                            }, opts );

                            allowWrap = opts.centerwrap == true && opts.maxphotos %2!==0 && Math.round( opts.maxphotos /2);

                            if( allowWrap === ( num - 1) ){

								$element.append( $( templateString ).addClass('center-item')[0] );

							}else{
								$element.append( templateString );
							}
                            
                        }
					}
					
					if( typeof opts.wrap == "number" && opts.wrap > 0){
                        var wrapper =  $element.find('.' + opts.parentclass).not('.center-item');
                        console.log( wrapper );
						for(var i = 0; i < wrapper.length; i+= opts.wrap ) {
					 	 wrapper.slice(i, i + opts.wrap ).wrapAll("<div class='wrap wrap_"+ (i+1) + "'></div>");
						}
					}
				}
			},
			error: function(data){
				console.log(data); // Ajax error
			}
		});
    }
}; // API

// default logger
$.fn.instaFeed.log = function log() {
    /*global console:true */
    if (window.console && console.log)
        console.log('[instaFeed] ' + Array.prototype.join.call(arguments, ' ') );
};

$.fn.instaFeed.defaults = {
	apiURL 			: 'https://api.instagram.com/v1',
	autoSelector	: '.instafeed[data-instafeed-profile]',
	endPoint		: '/users/self/media/recent',
 	maxPhotos		: 20,
 	wrap			: 0,
    sync			: true,
    log 			: true,
    parentClass		: 'insta',
    template		: '<div class="{{parentCls}}" style="background-image:url({{lowResolutionURL}})"></div>',
    templateRegex	: '{{((.)?.*?)}}',
    centerWrap		: false
};

$(document).ready(function() {
    $( $.fn.instaFeed.defaults.autoSelector ).instaFeed();
});

})(jQuery);
// 13/10/2016 @dkarandana
