// add the no-close style (this hides the close icon on dialogs - jQuery UI recommended way of doing it. http://api.jqueryui.com/dialog/
var head = document.getElementsByTagName('head')[0];
var styles = document.createElement("style");
styles.innerHTML = ".no-close .ui-dialog-titlebar-close { display: none; } "
                 + ".utils-centre { text-align: center !important; margin-left: auto !important; margin-right: auto !important; }"
                 + ".utils-plain-list { list-style-type:none; padding: 0px; }"
                 + ".utils-link { cursor: pointer; }"
; // on this line so its easy to add new ones without accidentally screwing it up
head.appendChild(styles);

// hang everything off a global variable, if theres already an object called utils use that
// duplicate functions / variables might therefore behave in an unexpected manner depending on load order

(function ($)
{
    $.utils = {
        // http://stackoverflow.com/a/950146
        loadExternal: function (url, type, callback)
        {
            var head = document.getElementsByTagName('head')[0];
            var external;

            if (type == "stylesheet")
            {
                external = document.createElement("link");
                external.rel = 'stylesheet';
                external.type = 'text/css';
                external.href = url;
            }
            else
            {
                external = document.createElement("script");
                external.type = 'text/javascript';
                external.src = url;
            }

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            external.onreadystatechange = callback;
            external.onload = callback;

            // Fire the loading
            head.appendChild(external);
        },
        // http://stackoverflow.com/a/8809472
        createUUID: function ()
        {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function")
            {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
            {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        vars: {
            set: function (key, value, fixed)
            {
                // set it if a.) it doesn't exist OR b.) its not fixed
                if (!utils.vars[key] || !utils.vars[key].fixed)
                {
                    utils.vars[key] = { value: value, fixed: (fixed || false) }
                    return true;
                }
                // either we passed in junk or tried to set a fixed var
                return false;
            },
            get: function (key, info)
            {
                // just get the value
                if (utils.vars[key] && !info)
                    return utils.vars[key].value;
                // get the whole schebang
                if (info)
                    return utils.vars[key] || false;
                // not found
                return false;
            }
        },
        // store stuff in the browser
        localStorage: function (appId, persist)
        {
            var _storage = (persist ? localStorage : sessionStorage);
            var _appId = appId + "__";

            this.getAppId = function ()
            {
                return _appId;
            }

            this.set = function (name, value)
            {
                name = _appId + name;
                _storage.setItem(name, JSON.stringify(value));
            }
            this.get = function (name)
            {
                name = _appId + name;

                if (_storage.getItem(name))
                {
                    try // "undefined" as the value breaks it
                    { return JSON.parse(_storage.getItem(name)); }
                    catch (ex)
                    { return null; }
                }
                else
                    return null;
            }
            this.clear = function (name)
            {
                name = _appId + name;
                _storage.removeItem(name);
            }
            this.clearAll = function ()
            {
                for (key in _storage)
                {
                    var appId = key.split("__")[0];
                    if (appId + "__" == _appId)
                        _storage.removeItem(key);
                }
            }
            this.getAll = function (verbose)
            {
                if (verbose != true)
                    verbose = false;

                var ret = []
                for (key in _storage)
                {
                    var details = key.split("__");
                    if ((details[0] + "__" == _appId) || verbose)
                        ret.push({ "key": details[1], "data": this.get(details[1]) });
                }
                return ret;
            }
        },
        toRGB: function(hex)
        {
            var reply = {};
            hex = hex.replace('#','');
            reply.r = parseInt(hex.substring(0,2), 16);
            reply.g = parseInt(hex.substring(2,4), 16);
            reply.b = parseInt(hex.substring(4,6), 16);
	
            return reply;
        },
        // wrapper to make Ajax calls easy - being as most of the time the settigns will be the same
        ajaxOptions: { global: true, baseURL: "/", type: "GET", contentType: "application/json", data: "", path: "", beforeSend: function (xhr) { }, success: function (data) { }, error: function (data) { },
            set: function (options)
            {
                //  just merge what we pass in with whats already there
                $.extend(this, options);
            },
        },
        ajax: function (options)
        {
            var settings = $.extend({}, this.ajaxOptions, options);
            var that = this;
            $.ajax(
            {
                global: settings.global,
                url: settings.baseURL + settings.path,
                type: settings.type,
                contentType: settings.contentType,
                data: JSON.stringify(settings.data), // otherwise jQuery sends it as Form encoded
                beforeSend: settings.beforeSend,
                success: function (data) { that.parseAjaxReply(data, settings.success); },
                error: function (data) { that.parseAjaxReply(data, settings.error); }
            });
        },
        parseAjaxReply: function (data, replyFunc)
        {
            // to remove the wrapping
            if (data["d"])
                data = data["d"];
            replyFunc(data);
        },
        await: function (calls, complete)
        {
            var set = {
                count: calls.length,
                replied: 0,
                check: function()
                {
                    this.replied++;
                    if(this.replied == this.count)
                        complete();
                }
            }

            for (var call = 0; call<calls.length; call++)
            {
                (function(that)
                {
                    that.baseSuccess = that.success;
                    that.baseError = that.error;
                    that.success = function (data)
                    {
                        if(that.baseSuccess)
                            that.baseSuccess(data);
                        set.check();
                    };
                    that.error = function(data)
                    {
                        if(that.baseError)
                            that.baseError(data);
                        set.check();
                    };
                    // send off the call
                    utils.ajax(that);
                })(calls[call]);
            }
        },
        // display elements
        alert: function (message)
        {
            utils.userChoice("Alert", message);
        },
        userChoice: function (title, message, options)
        {
            var viewportWidth = $(window).width();
            var viewportHeight = $(window).height();

            var id = utils.createUUID();
            var html = "<div id='" + id + "' title='" + title + "'>" // overflow: hidden - control the scrolling in what ever you pass in
                        + "<div style='overflow: hidden; max-height: " + viewportHeight / 2 + "px; max-width: " + viewportWidth / 2 + "px;'>" + message + "</div>"
                        + "</div>";

            var defaults = { dialogClass: "no-close", modal: true, closeOnEscape: false, autoOpen: true, buttons: { "Close": function () { $(this).empty().remove(); }}};
            var settings = $.extend({},defaults, options);

            $(html).dialog(settings);
        },
    };
})(jQuery);
