// normal jQuery stuff, should be called against a set of DOM / jQuery elemetns
(function ($)
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
        var settings = $.extend(true, {}, defaults, options);

        return this.each(function ()
        {
            var id = $.utils.createUUID();
            var $this = $(this);

            var $label = $("<label />").attr("id", "label-" + id)
                                       .css(settings.labelcss)
                            .append(document.createTextNode(settings.label));

            var $input = $("<input />").attr("id", "input-" + id)
                                       .css(settings.inputcss)
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

    
    $.fn.alert = function (message)
    {
        $.fn.dialogue("Alert", message);
    };
    $.fn.dialogue = function (title, message, options)
    {
        var defaults = {};
        // generate an id for the element - not 100% needed
        // could just as easily be passed in if you needed to reference it externally
        var id = $.utils.createUUID();

        // removal function
        var dismiss = function ()
        {
            // hide the dialogue
            $modal.modal("hide");
            // remove the blanking
            $modal.prev().remove();
            // remove the dialogue
            $modal.empty().remove();
        }
        // create the DOM structure
        var $modal = $("<div />").attr("id", id).attr("role", "dialog").addClass("modal fade")
                        .append($("<div />").addClass("modal-dialog")
                            .append($("<div />").addClass("modal-content")
                                .append($("<div />").addClass("modal-header")
                                    .append($("<button />").attr("type", "button").addClass("close").html("&times;").click(function () { dismiss() }))
                                    .append($("<h4 />").addClass("modal-title").text(title)))
                                .append($("<div />").addClass("modal-body")
                                    .append($("<p />").text(message)))
                                .append($("<div />").addClass("modal-footer")
                                    .append($("<button />").addClass("btn btn-default").attr("type", "button").text("Close").click(function () { dismiss() }))
                                )
                            )
                        );
        // show the dialogue
        $modal.modal("show");
    };

    //bs_progress
    ; (function ()
    {
        $.fn.extend(
        {
            // extension with methods http://stackoverflow.com/a/1117129/1286358
            bs_progress: function (options, args)
            {
                var defaults = { valuenow: 0, valuemin: 0, valuemax: 100 };
                if (!options || typeof (options) == 'object')
                {
                    options = $.extend(true, {}, defaults, options);
                }
                return this.each(function ()
                {
                    new $.bs_progress($(this), options, args);
                });
            }
        });
        $.bs_progress = function ($el, settings, args)
        {
            this.update = function ()
            {
                var settings = $el.data("settings");

                if (settings)
                {
                    var percentageFull = (100 / (settings.valuemax - settings.valuemin)) * (args - settings.valuemin);
                    $el.attr("aria-valuenow", args)
                    $el.find("div").css({ width: percentageFull + "%" })
                            .find("span").text(args);
                }
            }

            if (settings && typeof (settings) == 'string')
            {
                if (this[settings])
                    this[settings]();

                return;
            }

            // otherwise initial setup
            var percentageFull = (100 / (settings.valuemax - settings.valuemin)) * (settings.valuenow - settings.valuemin);

            $el.addClass("progress")
                .data("settings", settings)
                .append($("<div />").addClass("progress-bar")
                        .attr("role", "progressbar")
                        .attr("aria-valuenow", settings.valuenow)
                        .attr("aria-valuemin", settings.valuemin)
                        .attr("aria-valuemax", settings.valuemax)
                        .css({ width: percentageFull + "%" })
                        .append($("<span />").text(settings.valuenow))
                        );
        }
    })();
	
    $.fn.bs_breadcrumb = function (options)
    {
        var defaults = { trail: [] }
        var settings = $.extend(true, {}, defaults, options);

        return this.each(function ()
        {
            var $this = $(this);

            var $list = $("<ol />").addClass("breadcrumb");
            
            for (var crumb in settings.trail)
            {
                if(!settings.trail[crumb].link)
                    $list.append($("<li />").append(document.createTextNode(settings.trail[crumb].text)));
                else
                    $list.append($("<li />")
                            .append($("<a />")
                                .attr("href", settings.trail[crumb].link)
                                    .append(document.createTextNode(settings.trail[crumb].text))
                                   )
                        );
            }

            $list.find("li:last").addClass("active");

            $this.append($list);
        });
    }

    $.fn.bs_navbar = function (options)
    {
		var defaults = { groups: [], label: "", callback: function() { console.log("No callback on Navbar"); } }
		var settings = $.extend(true,{},defaults,options);
		
		return this.each(function()
		{
			var id = $.utils.createUUID();
			
			var $this = $(this);
			
			$this.addClass("navbar navbar-default")
				 .append($("<div />").addClass("container-fluid")
				    .append($("<div />").addClass("navbar-header")
                        .append($("<button />").addClass("navbar-toggle collapsed")
                            .attr("type","button")
                            .attr("aria-expanded", "false")
                            .attr("data-target", "#" + id) //.data("target","#" + id)
                            .attr("data-toggle", "collapse") // .data("toggle","collapse")
                            .html("<span class='sr-only'>Toggle navigation</span>"
						        + "			<span class='icon-bar'></span>"
						        + "			<span class='icon-bar'></span>"
						        + "			<span class='icon-bar'></span>"))
                            .append($("<a class='utils-link' />").addClass("navbar-brand")
                                .append(settings.label instanceof jQuery? settings.label : document.createTextNode(settings.label))))
				    .append($("<div />").addClass("collapse navbar-collapse navbar-primary-container").attr("id", id)));
				 
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
							  .append($("<a class='utils-link' />").text(group.elements[j].text))
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
        var defaults = { content: [], callback: function () { console.log("No callback on dropdown"); }, title: "Dropdown" };
        var settings = $.extend({}, defaults, options);
        return this.each(function ()
        {
            var $this = $(this);
            $this.addClass("dropdown");
            $this.append($("<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'><span class='caret'></span></a>")
                .text(settings.title)
                .append("<span class='caret'></span>"));
            var $ul = $("<ul />").addClass("dropdown-menu").attr("aria-labelledby", "dropdownMenu1")
				.on("click", "li", function ()
				{
				    (function ($el)
				    {
				        settings.callback($el.data("callback"));
				    })($(this));
				});

            for (var i = 0; i < settings.elements.length; i++)
            {
                if (settings.elements[i].prior === "seperator")
                    $ul.append("<li class='divider' role='seperator'></li>");

                var $li = $("<li />").addClass("dropdown-item")
					.data("callback", settings.elements[i].data)
					.append($("<a class='utils-link' />").text(settings.elements[i].text));

                $ul.append($li);
            }
            $this.append($ul);
        });
    }

    // bs_button
    ; (function ()
    {
        $.fn.extend(
        {
            // extension with methods http://stackoverflow.com/a/1117129/1286358
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
    })();

    // bs_switcher
    ; (function ()
    {
        // extension with methods http://stackoverflow.com/a/1117129/1286358
        $.fn.extend(
        {
            bs_switcher: function (options, args)
            {
                var defaults = { "method": ["fadeOut", "fadeIn"], "speed": 200 };
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
            this.previous = function ()
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
			
			this.mask = function ($content)
            {
                var settings = $el.data("settings");
                if (!settings)
                    settings = { "method": ["fadeOut", "fadeIn"], "speed": 200 };

                $el.children()[settings.method[0]](settings.speed, function ()
                {
                    $el.append($content);
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
                if (this[settings])
                    this[settings](args);

                return;
            }

            // set up
            var $first = $el.children(":first-child");
            $first.css({ display: "block" });
            $first.siblings().css({ display: "none" });

            $el.data("settings", settings);
        }
    })();

    // bs_table
    ;(function ()
    {
        $.fn.extend(
        {
            bs_table: function (options, args)
            {
                var defaults = { titles: [], data: [], classes: [], responsive: true, rowclick: function () { } };
                if (!options || typeof (options) == 'object')
                {
                    options = $.extend({}, defaults, options);
                }
                return this.each(function ()
                {
                    new $.bs_table($(this), options, args);
                });
            }
        });

        $.bs_table = function ($el, settings, args)
        {
            var self = this;

            self.sort = function (column)
            {
                var settings = $el.data("settings");
                // get the index of the column name
                for (var i = 0; i < settings.titles.length; i++)
                {
                    if (settings.titles[i] == column)
                    {
                        self.drawData(settings.data.sort(function (a, b)
                        {
                            if (a[i] < b[i])
                                return -1;
                            if (a[i] > b[i])
                                return 1;
                            return 0;
                        }));
                        break;
                    }
                }
            }

            self.drawData = function (data)
            {
                var $tbody = $el.find("tbody");
                $tbody.empty();

                for (var i = 0; i < data.length; i++)
                {
                    var $tr = $("<tr />");
                    for (var j = 0; j < data[i].length; j++)
                    {
                        $tr.append($("<td />").text(data[i][j]));
                    }
                    $tbody.append($tr);
                }
            }

            // call a function
            if (settings && typeof (settings) == 'string')
            {
                if (self[settings])
                    self[settings](args);

                return;
            }

            // set up - doesn't reach here if a function called
            // store the settings, this is data only not written out to the html
            $el.data("settings", settings);

            // i'm assuming here that $this is a table, and that we want to wipe the original content
            $el.empty().addClass("table").css({ cursor: "pointer" });

            if (settings.responsive)
                $el.wrap($("<div />").addClass("table-responsive"));

            for (var i = 0; i < settings.classes.length; i++)
            {
                // can add classes as either "hover" or "table-hover"
                $el.addClass("table-" + settings.classes[i].replace("table-", ""));
            }

            var $thead = $("<thead />").on("click", "th", function ()
            {
                $el.bs_table("sort", $(this).text());
            });
            for (var i = 0; i < settings.titles.length; i++)
            {
                $thead.append($("<th />").text(settings.titles[i]));
            }
            var $tbody = $("<tbody />").on("click", "tr", function ()
            {
                var settings = $el.data("settings");
                var colData = [];
                $(this).find("td").each(function ()
                {
                    colData.push($(this).text());
                });

                settings.rowclick(colData);
            });

            $el.append($thead);
            $el.append($tbody);

            self.drawData(settings.data);
        }
    })();

})(jQuery);

// these do not modify existing DOM elements, but adds elements
(function ($)
{
    $.utils.bs_alert = function (options)
    {
        var defaults = { parent: $("body"), position: "fixed-bottom", type: "danger", allowClose: true, title: "Notice", msg: "" };
        var settings = $.extend(true, {}, defaults, options);

        // parse off the position
        var cssPosition = { position: "relative", margin: "auto", width: "60%", left: "0", right: "0" };
        // valid entries are "fixed-[bottom | top]", "absolute-[bottom | top]", "relative"
        var expr = new RegExp("^([a-z]{0,})?(-)?([a-z]{0,})?$", "gi");
        var match = expr.exec(settings.position);
        if (match[1])
        {
            cssPosition.position = match[1];
            // match[2] is "-"
            if (match[3])
                cssPosition[match[3]] = "10px";
        }

        var $el = $("<div />").addClass("alert alert-" + settings.type);

        if (settings.allowClose)
        {
            $el.append("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>");
        }

        $el.append($("<strong />").text(settings.title + " "))
            .append(document.createTextNode(settings.msg));

        // there might be multiple messages, we want these to display stacked
        var $alertHolder = settings.parent.find("." + settings.position);
        if ($alertHolder.length == 0)
        {
            $alertHolder = $("<div />").css(cssPosition).addClass(settings.position);
            settings.parent.append($alertHolder);
        }
        
        $alertHolder.append($el);
    }
})(jQuery);