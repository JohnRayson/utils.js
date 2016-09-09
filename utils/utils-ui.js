(function($)
{
    $.fn.input = function (css)
    {
        css = $.extend({}, { "background-color": "#fff", "background-image": "none" }, css);
        return this.each(function ()
        {
            $(this).addClass("ui-widget ui-widget-content ui-corner-all ui-button");
            $(this).css(css);
        });
    };

    $.fn.label = function (css)
    {
        css = $.extend({}, { "border": "0px", "background-color": "#fff", "background-image": "none" }, css);
        return this.each(function ()
        {
            $(this).addClass("ui-widget ui-button");
            $(this).css(css);
        });
    };

    $.fn.labeledInput = function (options)
    {
        var defaults = {
            labelcss: { width: "200px", textAlign: "right", display: "inline-block", marginRight: "5px", marginLeft: "5px" },
            inputcss: { width: "200px", display: "inline-block" },
            label: "", placeholder: "", inputtype: "text", labelposition: "left"
        };
        var settings = $.extend(true, {},defaults,options);

        return this.each(function()
        {
            var id = $.utils.createUUID();
            var $this = $(this);

            var $label = $("<label />").attr("id", "label-" + id)
                                       .css(settings.labelcss)
                            .append(document.createTextNode(settings.label));

            var $input = $("<input />").attr("id", "input-" + id)
                                       .css( settings.inputcss)
                                       .prop("type", settings.inputtype)
                                       .attr("placeholder", settings.placeholder)
                                       .attr("aria-describedby", "label-" + id)
                                       .addClass("form-control");

            if (settings.labelposition == "right")
                $this.append($input).append($label);
            else
                $this.append($label).append($input);
                 
        });
    };
	
    $.fn.bs_navbar = function (options)
    {
		var defaults = { groups: [], label: "", callback: function() { console.log("No callback on Navbar"); } }
		var settings = $.extend({},defaults,options);
		
		return this.each(function()
		{
			var id = $.utils.createUUID();
			
			var $this = $(this);
			
			$this.addClass("navbar navbar-default")
				 .append($("<div />").addClass("container-fluid"))
				 .append($("<div />").addClass("navbar-header")
                    .append($("<button />").addClass("navbar-toggle collapsed")
                        .attr("type","button")
                        .attr("aria-expanded","false")
                        .data("toggle","collapse")
                        .data("target","#" + id)
                        .html("<span class='sr-only'>Toggle navigation</span>"
						    + "			<span class='icon-bar'></span>"
						    + "			<span class='icon-bar'></span>"
						    + "			<span class='icon-bar'></span>"))
                        .append($("<a href='#' />").addClass("navbar-brand")
                            .append(document.createTextNode(settings.label))))
				 .append($("<div />").addClass("collapse navbar-collapse").attr("id",id));
				 
			for(var i=0; i < settings.groups.length; i++)
			{
				(function(group, $nav)
				{
				    if (!group.callback)
				        group.callback = settings.callback;

					var $ul = $("<ul />").addClass("nav navbar-nav " + (group.position==="right"?"navbar-right":"navbar-left"))
						.on("click","li",function()
						{
							(function($el)
							{
								if(!$el.hasClass("dropdown") && !$el.hasClass("dropdown-item"))
									group.callback($el.data("callback"));
							})($(this));
						});
					for(var j=0; j<group.elements.length; j++)
					{
						$ul.append(group.elements[j] instanceof jQuery?content = group.elements[j]:
						$("<li />").attr("id",group.elements[j].id || $.utils.createUUID())
							  .append($("<a href='#'/>").text(group.elements[j].text))
							  .data("callback",group.elements[j].data)
						);
					}
					$nav.append($ul);
				})(settings.groups[i],$("#" + id))
			}
		});
    }
	
	$.fn.bs_dropdown = function (options)
	{
		var defaults = { content: [], callback: function() { console.log("No callback on dropdown"); }, title: "Dropdown" };
		var settings = $.extend({},defaults,options);
		return this.each(function()
		{
			var $this = $(this);
			$this.addClass("dropdown");
			$this.append($("<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'><span class='caret'></span></a>").text(settings.title));
			var $ul = $("<ul />").addClass("dropdown-menu").attr("aria-labelledby","dropdownMenu1")
				.on("click","li",function()
				{
					(function($el)
					{
						settings.callback($el.data("callback"));
					})($(this));
				});
			
			for(var i=0; i<settings.elements.length; i++)
			{
				if(settings.elements[i].prior === "seperator")
					$ul.append("<li class='divider' role='seperator'></li>");
					
				var $li = $("<li />").addClass("dropdown-item")
					.data("callback",settings.elements[i].data)
					.append($("<a href='#' />").text(settings.elements[i].text));

				$ul.append($li);
			}
			$this.append($ul);
		});
	}
	$.fn.extend(
    {
        bs_button: function (options)
        {
            var defaults = {};
            if (!options || typeof (options) == 'object')
            {
                options = $.extend({}, defaults, options);
            }
            return this.each(function ()
            {
                new $.bs_button($(this), options);
            });
        }
    });

	$.bs_button = function ($el, settings)
	{
	    var that = this;
	    this.disable = function ()
	    {
	        $el.prop("disabled", true);
	        $el.addClass("btn-disabled");
	    }
	    this.enable = function ()
	    {
	        $el.prop("disabled", false);
	        $el.removeClass("btn-disabled");
	    }
	    if (settings && typeof (settings) == 'string')
	    {
	        if (this[settings])
	            this[settings]();

	        return;
	    }

	    //if it has any text - extract that into a span
	    $el.html($("<span />").css({ display: "inline-block", margin: "5px" }).text($el.text()))
	            .addClass("btn btn-primary");
	}
    // extension with methods http://stackoverflow.com/a/1117129/1286358
	$.fn.extend(
    {
        bs_switcher: function (options, args)
        {
            var defaults = { "method": ["fadeOut","fadeIn"], "speed": 200 };
            if (!options || typeof (options) == 'object')
            {
                options = $.extend({}, defaults, options);
            }
            return this.each(function ()
            {
                new $.bs_switcher($(this), options, args);
            });
        }
    });
    
	$.bs_switcher = function ($el, settings, args)
	{
	    var that = this;
	    this.next = function ()
	    {
	        if (!args)
	            args = { number: 1 };

	        var settings = $el.data("settings");
	        var $current = $el.children(":visible")
	        $current[settings.method[0]](200, function ()
	        {
	            if ($current.next().length > 0)
	                $current.next()[settings.method[1]](200, function () { doOver("next"); });
	            else
	                $el.find(":first-child")[settings.method[1]](200, function () { doOver("next"); });
	        });
	    }
	    this.previous = function()
	    {
	        if (!args)
	            args = { number: 1 };

	        var settings = $el.data("settings");
	        var $current = $el.children(":visible")
	        $current[settings.method[0]](200, function ()
	        {
	            if ($current.prev().length > 0)
	                $current.prev()[settings.method[1]](200, function () { doOver("previous"); });
	            else
	                $el.find(":first-child")[settings.method[1]](200, function () { doOver("previous"); });
	        });
	    }

	    function doOver(func)
	    {
	        args.number--;
	        if (args.number > 0)
	            that[func]();
	    }

        // should be called on a div (or other element) - it will cycle the contents between the elements direct children
	    if (settings && typeof (settings) == 'string')
	    {
            if(this[settings])
	            this[settings]();
	        
	        return;
	    }

	    // set up
	    var $first = $el.children(":first-child");
	    $first.css({ display: "block" });
	    $first.siblings().css({ display: "none" });

	    $el.data("settings", settings);
	}
 })(jQuery);