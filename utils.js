// hang everything off a global variable, if theres already an object called utils use that
// duplicate functions / variables might therefore behave in an unexpected manner depending on load order
var utils = utils || {};

utils.require = {
    jQuery: { type: "script", dependent: null, name: "jQuery", url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js", check: function () { return window.jQuery; }, state: "pending" },
    jQueryUI: { type: "script", dependent: "jQuery", name: "jQueryUI", url: "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js", check: function () { return window.jQuery && window.jQuery.ui; }, state: "pending" },
    moment: { type: "script", dependent: null, name: "moment", url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js", check: function () { return window.moment; }, state: "pending" },
    toastr: { type: "script", dependent: "jQuery", name: "toastr", url: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js", check: function () { return window.jQuery && window.toastr; }, state: "pending" }
}
utils.initilizeComplete = null;
utils.ready = function (func)
{
    utils.initilizeComplete = func;
}
// declared before checking the dependencies - so these need to not be dependent on anything
// http://stackoverflow.com/a/950146
utils.loadExternal = function (url, type, callback)
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
}
// create a UUID
// http://stackoverflow.com/a/8809472
utils.createUUID = function ()
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
}
// holder for page variables that dont really sit anywhere else
utils.vars = {};
utils.set = function (key, value, fixed)
{
    // set it if a.) it doesn't exist OR b.) its not fixed
    if (!utils.vars[key] || !utils.vars[key].fixed)
    {
        utils.vars[key] = { value: value, fixed: (fixed || false) }
        return true;
    }
    // either we passed in junk or tried to set a fixed var
    return false;
}
utils.get = function (key, info)
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
utils.localStorage = function (appId, persist)
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
}

// initilize - this will allow wait on loading dependencies.
utils.initilize = function ()
{
    // check our dependencies
    var loaded = true; // assume true, that way any fail can set it to false easily
    for (var dependent in utils.require)
    {
        var dependency = utils.require[dependent];
        switch (dependency.state)
        {
            case "pending": // not yet checked
                if (dependency.check())
                    dependency.state = "loaded";
                else // wasn't present, try to load it
                {
                    loaded = false;
                    // is it dependent on another dependencies - ie jQueryUI needs jQuery first
                    if (dependency.dependent == null || utils.require[dependency.dependent].state == "loaded")
                    {
                        dependency.state = "loading";
                        // load it then call initialize again
                        utils.loadExternal(dependency.url, dependency.type, function () { utils.initilize(); });
                    }
                }
                break;
            case "loading": // check to see if it has
                loaded = false;
                if (dependency.check())
                {
                    dependency.state = "loaded";
                    utils.initilize();
                }
                break;
        }
    }
    if (!loaded)
        return false;

    //basic alert dialogue
    utils.alert = function (message)
    {
        var id = utils.createUUID();
        var html = "<div id='" + id + "' title='alert'>"
                 + "<h1>" + message + "</h1>"
                 + "</div>";
        $(html).dialog(
        {
            modal: true,
            close: function ()
            {
                $(this).empty().remove();
            },
            buttons:
            {
                "OK": function ()
                {
                    $(this).dialog("close");
                }
            }
        });
    }
    // present a series of options to the user - not finished - alert() should call through to this as well, and there should be a short hand confirm() callign this
    utils.userChoice = function (message, buttons)
    {
        var id = utils.createUUID();
        var html = "<div id='" + id + "' title='alert'>"
                 + "<h1>" + message + "</h1>"
                 + "</div>";

        $(html).dialog(
        {
            modal: true,
            buttons: buttons
        });
    };

    // some styling for inputs
    (function($)
    {
        $.fn.input = function (css)
        {
            if (!css)
                css = {};
            return this.each(function ()
            {
                $(this).addClass("ui-widget ui-widget-content ui-corner-all ui-button");
                $(this).css(css);
            });
        }
    })(jQuery);
    // and labels
    (function ($)
    {
        $.fn.label = function (css)
        {
            if (!css)
                css = {};
            return this.each(function ()
            {
                $(this).addClass("ui-widget ui-button");
                $(this).css(css);
            });
        }
    })(jQuery);

    // wrapper to make Ajax calls easy - being as most of the time the settigns will be the same
    utils.ajaxOptions = { baseURL: "", type: "GET", contentType: "application/json", data: "", path: "", beforeSend: function (xhr) { }, success: function (data) { }, error: function (data) { } };
    utils.setAjaxOptions = function (options)
    {
        //  just merge what we pass in with whats already there
        utils.ajaxOptions = $.extend(utils.ajaxOptions, options);
    }
    utils.ajax = function (options)
    {
        var settings = $.extend({}, utils.ajaxOptions, options);

        $.ajax(
        {
            url: settings.baseURL + settings.path,
            type: settings.type,
            contentType: settings.contentType,
            data: settings.data,
            beforeSend: settings.beforeSend,
            success: function (data) { settings.success(data) },
            error: function (data) { settings.error(data) }
        });
    }

    if (utils.initilizeComplete)
        utils.initilizeComplete();
}
// load the dependencies, and create the functions which rely on them
utils.initilize();