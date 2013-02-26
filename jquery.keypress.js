(function( $ ) {

    var _buffer = "";
    var element = null;
    var options = {};
    var _navigation_keys = [37, 38, 39, 40];
    var _deletion_keys = [8, 46];
    var _esc_keys = [27];
    var _keyup_keys = _navigation_keys + _deletion_keys + _esc_keys;
    var fragment_reload = false;
    var wait_callback = function(){};
    var wait_callback_allowed = true;

    $.fn.bufferKeypress = function(callback, timer, user_options) {
        if(timer == undefined){
            timer = 250
        }
        init(this, user_options);
        $(this).bind("keyup keypress",throttle(function (event) {
            end_wait_callback();
            var value = fragment_reload? _buffer : $(this).val();
            callback(element, value, event);
            flush_buffer();
        }, timer));
    };

    function init(elem, user_options){
        element = elem;
        if(user_options == undefined){
            user_options = {};
        }
        options = jQuery.extend(true, {}, user_options);
        if(options["fragment_reload"] == true || (options["fragment_reload"] == undefined) && !$(elem).is("input")){
            fragment_reload = true;
        }
        if(options["wait"] != undefined && typeof(options["wait"]) == "function"){
            wait_callback = options["wait"];
        }

    }
    function throttle(fn, delay) {
        var timer = null;
        return function () {
            start_wait_callback();
            var context = this, args = arguments;
            var event = args[0];
            if(event.type === "keyup"){
                if (contains(_keyup_keys, event.keyCode)){
//                    This code is redundant due to some boundations
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                    flush_buffer();
                }
            }
            else{

                load_bufffer(event);
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }

        };
    }

    function load_bufffer(event){
        var character = String.fromCharCode(event.keyCode);
        _buffer = _buffer + character;
    }

    function flush_buffer(){
        _buffer = "";
    }

    function contains(arr, val){
        return (arr.indexOf(val) > -1);
    }

    function start_wait_callback(){
        if(wait_callback_allowed){
            wait_callback(element);
            wait_callback_allowed = false;
        }
    }

    function end_wait_callback(){
        wait_callback_allowed = true;
    }

})( jQuery );