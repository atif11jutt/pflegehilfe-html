
// Get color with added transparency
function getColorOpacity( color,  opacity ) {
    if ( typeof color === "undefined" || color.length === 0 || color == 'inherit' ) {
        return "";
    }

    if ( typeof colorCalculator === "undefined" ) {
        window.colorCalculator = new Colors();
    }

    colorCalculator.setColor( color );
	var rgb = colorCalculator.colors.RND.rgb;
    var alpha = colorCalculator.colors.alpha;
    
	return 'rgba(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ', ' + (alpha*opacity).toFixed(2) + ')';
}



function Theme( slug ) {
    this.slug = slug,
    this.reinforce = jQuery('#_gform_setting_reinforce_styles').is(':checked') ? ' !important;' : ';';
    this.css = "",
    this.$el = jQuery('#' + this.slug),

    this.presets = {
        /*  Dual Ternary operator:
                Get Custom font if available.
                Remove /Native from string if native font
                Add quotes if GFonts
        */
        font_pri:   (this.$el.find('.font_pri').val() == 'custom/Native')
                    ? this.$el.find('.font_pri_custom').val()
                    : (this.$el.find('.font_pri').val().indexOf("/Native") < 0)
                        ? '"' + this.$el.find('.font_pri').val() + '"'
                        : this.$el.find('.font_pri').val().split("/Native")[0],


        font_sec:   (this.$el.find('.font_sec').val() == 'custom/Native')? this.$el.find('.font_sec_custom').val() : (this.$el.find('.font_sec').val().indexOf("/Native") < 0)? '"' + this.$el.find('.font_sec').val() + '"' : this.$el.find('.font_sec').val().split("/Native")[0],
    },

    this.getStyles = function( selector, styles ) {
        if ( styles.length > 0 ) {
            return selector.replace(/theme_slug/g, this.slug) + "{" + styles + "}\n";
        }    
        // Else
        return "";
    },

    this.getCss = function() {

        for (const selector in this.cssSet) {
            if (this.cssSet.hasOwnProperty(selector)) {

                const fields = this.cssSet[selector];

                this.css += this.getStyles ( selector, this.getDeclaractionBlock( fields ) );

            }
        }
        
        this.css += this.getChoiceStyles();


        // Add Button Shade
        // var shade_name = this.$el.find('.adv_shadow_box_wrapper input:checked').val();
        // this.css += this.getButtonShade( shade_name );

        return this.css;
    },

    this.getCss = function() {

        for (const selector in this.cssSet) {
            if (this.cssSet.hasOwnProperty(selector)) {

                const fields = this.cssSet[selector];

                this.css += this.getStyles ( selector, this.getDeclaractionBlock( fields ) );

            }
        }

        var css = this.getDeclaractionBlock( this.cssVars );
        
        if ( css !== "" ) {
            this.css += "."+this.slug+"_wrapper{"+css+"}";
        }
        // this.css += this.getChoiceStyles();


        // Add Button Shade
        // var shade_name = this.$el.find('.adv_shadow_box_wrapper input:checked').val();
        // this.css += this.getButtonShade( shade_name );

        return this.css;
    },

    /**
     * 
     * @param {string} settingName  CSS classname for the setting field
     * @param {string} property     Name of the CSS property to create rule with
     * @param {string} suffix       Unit for the value, or value itself in case of a checkbox
     * 
     * @returns {string} CSS delaration
     */
    this.getDeclaration = function( property, settingName ) {

        var $settingEl = "";
        var value = "";
        var calc = "";
        var preset_key = "";

        // TODO: Retire
        if ( settingName.indexOf("static-") === 0 ) {
            value = settingName.split("static-")[1];
        }

        // TODO: Could be more efficient
        if ( settingName.indexOf("var-") === 0 ) {
            var varName = settingName.split("var-")[1];
            if ( this.getDeclaractionBlock( this.cssVars ).indexOf(varName + ":") > -1 ) {
                value = "var("+varName+", inherit)";
            }
        }

        else if ( settingName.indexOf("calc-") === 0 ) {
            calc = settingName.split("calc-")[1];
            
            if ( calc == "placeholder") {
                
                value = this.$el.find('#' + this.slug + "_placeholder_color" ).val();

                if ( value == "" ) {
                    // Calculate based on the field color
                    value = getColorOpacity(this.$el.find('#' + this.slug + "_font_color" ).val(), .3);
                }
            
            } else if ( calc == "choice_style_color_muted") {
                value = getMutedColor( this.$el.find('#' + this.slug + "_choice_style_color" ).val() );
            }

        }

        else if ( settingName.indexOf('preset-') === 0 ) {
            preset_key = settingName.split('preset-')[1]; // Ex preset value: "preset-font_pri"
            value = this.presets[preset_key];
        }

        else {
            $settingEl = this.$el.find('#' + this.slug + "_" + settingName );

            
            // In case of a radio
            if ($settingEl.length == 0) {
                $settingEl = jQuery("[name=_gform_setting_" + this.slug + "_" + settingName + "]:checked");
            }


            if ($settingEl.length == 0 && settingName.indexOf("preset-") === -1 && settingName.indexOf("static-") === -1 ) {
                console.log("Setting " + settingName + " not found;");
                return '';
            }
            
            // if checkbox is selected
            if ( $settingEl.attr('type') == "checkbox" ) {
    
                if ( $settingEl.is(':checked') == false ) {
                    return "";
                } else {
                    // if checked
                    return "\n" + property + this.reinforce;
                }
    
    
            // if not a checkbox, get value from the field
            } else {
                value = $settingEl.val();
            }
        }

        // Check if the returned value is a preset
        if ( value.indexOf('preset-') === 0 ) {
            preset_key = value.split('preset-')[1]; // Ex preset value: "preset-font_pri"
            value = this.presets[preset_key];
        }
        


        if ( value != '') {

            // Depricated
            if ( property == "background-image" ) {
                value = "url('" +value+ "')";
            }

            var bg_type = this.$el.find( ".background:checked" ).val();

            if ( property == "--gfsp--bg-img" && bg_type == "image" ) {
                value = "url('" +value+ "')";
            }

            if ( property == "--gfsp--bg-color" && ! ( bg_type == "image" || bg_type == "color" ) ) {
                value = "";
            }

            return "\n" + property + ":" + value + this.reinforce;
        }

        // Default
        return '';

    },


    this.getDeclaractionBlock = function( fields ) {

        var block = "";
        for (const prop in fields) {
            if (fields.hasOwnProperty(prop)) {
                const settingName = fields[prop];
                block += this.getDeclaration( prop, settingName );
            }
        }

        return block;
    },

    this.cssVars = {
        "--gfsp--bg-color": "bg_color",
        "--gfsp--bg-img": "bg_image",
        "--gfsp--bg-size": "bg_size",
        "--gfsp--wr-padding": "wr_padding",
        "--gfsp--field-font-size": "font_size",
        "--gfsp--placeholder-color": "calc-placeholder",
    
        /* Base */
        "--gfsp--font": "preset-font_pri",
        "--gfsp--base-color": "label_font_color",
        "--gfsp--base-font-size": "base_font_size",
        
        "--gfsp--label-font-color": "label_color",
        "--gfsp--label-font-size": "label_font_size",
        "--gfsp--label-font-weight": "label_font_weight",
        "--gfsp--label-font-style: italic": "label_font_italic",
        "--gfsp--label-text-decoration: underline": "label_font_underline",
    
        "--gfsp--label-bg-color": "label_bg_color",
        "--gfsp--label-align": "label_text_align",
        "--gfsp--label-padding": "label_padding",
        "--gfsp--label-margin-bottom": "label_margin_bottom",
    
        "--gfsp--field-margin-bottom": "field_margin_bottom",
        "--gfsp--field-icon-color": "field_icon_color",
    
        "--gfsp--o-bg-color": "o_custom_bg",
        "--gfsp--o-bg-text-color": "o_custom_bg_text",
        
        "--gfsp--field-v-padding": "field_v_padding",
        "--gfsp--field-border-width": "field_border_width",

        "--gfsp--warning-color": "validation_color",
        "--gfsp--warning-bg-color": "validation_bg_color",
    
        "--gfsp--desc-font": "desc_font",
        "--gfsp--desc-font-size": "desc_font_size",
        "--gfsp--desc-color": "desc_color",
        "--gfsp--desc-align": "desc_text_align",
        "--gfsp--desc-padding": "desc_padding",
        "--gfsp--desc-margin-bottom": "desc_margin_bottom",
        "--gfsp--desc-bg-color": "desc_bg_color",
        "--gfsp--desc-font-weight": "desc_font_weight",
        "--gfsp--desc-font-style: italic": "desc_font_italic",
        "--gfsp--desc-text-decoration: underline": "desc_font_underline",
    
    };


    this.cssSet = {

        '.gf_stylespro.theme_slug .gfield':{
            "--gfsp-choice-style-color"         : "choice_style_color",
            "--gfsp-choice-style-color-muted"   : "calc-choice_style_color_muted",
        },
        '.gf_stylespro.theme_slug input,\
        .gf_stylespro.theme_slug select,\
        .gf_stylespro.theme_slug textarea,\
        .gf_stylespro.theme_slug .ginput_total,\
        .gf_stylespro.theme_slug .ginput_product_price,\
        .gf_stylespro.theme_slug .ginput_shipping_price,\
        .theme_slug .gfsp_icon,\
        .gf_stylespro.theme_slug input[type=checkbox]:not(old) + label,\
        .gf_stylespro.theme_slug input[type=radio   ]:not(old) + label,\
        .gf_stylespro.theme_slug .ginput_container' : {
            'font-family'               : 'preset-font_sec',
            'color'                     : 'font_color',
            'font-size'                 : 'font_size',
            'font-weight'               : 'field_font_weight',
            'font-style: italic'        : 'font_italic',
            'text-decoration: underline': 'font_underline',
        },

        ".theme_slug_wrapper .gf_stylespro" : {
            'font-family'                   : 'var---gfsp--font',
            'color'                         : 'var---gfsp--base-color',
        },
        ".theme_slug_wrapper .gf_stylespro .gfield_label" : {
            'font-family'                   : 'var---gfsp--font',
            'color'                         : 'var---gfsp--label-font-color',
        },
        
        '.theme_slug_wrapper.gform_wrapper input:not([type="radio"]):not([type="checkbox"]):not([type=button]):not([type=submit]),\
        .theme_slug_wrapper.gform_wrapper select,\
        .theme_slug_wrapper.gform_wrapper textarea,\
        .theme_slug_wrapper.gform_wrapper input[type="text"],\
        .theme_slug_wrapper.gform_wrapper input[type="tel"],\
        .theme_slug_wrapper.gform_wrapper input[type="email"],\
        .theme_slug_wrapper.gform_wrapper input[type="url"],\
        .theme_slug_wrapper.gform_wrapper input[type="password"],\
        .theme_slug_wrapper.gform_wrapper input[type="search"],\
        .theme_slug_wrapper.gform_wrapper input[type="number"],\
        .theme_slug_wrapper.gform_wrapper .chosen-choices': {
            'background-color'          : 'field_bg_color',
            'font-weight'               : 'field_font_weight',
            'text-align'                : 'field_text_align',
            'border-radius'             : 'field_border_radius',
            'border-style'              : 'field_border_style',
            'border-color'              : 'field_border_color',
        },
        '.theme_slug .gfsp_icon': {
            'padding-top'               : 'field_v_padding',
            'padding-bottom'            : 'field_v_padding',
            'border-width'              : 'field_border_width',
            'border-color'              : 'field_border_color',
        },
        '.theme_slug_wrapper.gform_wrapper input:not([type="radio"]):not([type="checkbox"]):not([type=button]):not([type=submit]):focus,\
        .theme_slug_wrapper.gform_wrapper select:focus,\
        .theme_slug_wrapper.gform_wrapper textarea:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="text"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="tel"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="email"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="url"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="password"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="search"]:focus,\
        .theme_slug_wrapper.gform_wrapper input[type="number"]:focus': {
            'background-color'          : 'field_focus_bg_color',
            'border-color'              : 'field_focus_border_color',
        },

        '.gf_stylespro_wrapper .gf_stylespro.theme_slug .button': {
            'background-color'          : 'btn_bg_color',
            'color '                    : 'var---gfsp--base-color',
            'color'                     : 'btn_color',
            'font-family'               : 'btn_font',
            'font-size'                 : 'btn_font_size',
            'font-weight'               : 'btn_font_weight',
            'padding'                   : 'btn_padding',
            'border-width'              : 'btn_border_width',
            'border-radius'             : 'btn_border_radius',
            'border-style'              : 'btn_border_style',
            'border-color'              : 'btn_border_color',
        },
        '.theme_slug .button:hover,\
        .theme_slug input[type=button]:hover,\
        .theme_slug input[type=submit]:hover' :{
            'color'                     : 'btn_hover_color',
            'border-color'              : 'btn_hover_border_color',
            'background-color'          : 'btn_hover_bg_color',
        },
        '.gf_stylespro_wrapper .gf_stylespro.theme_slug .gform_next_button,\
        .gf_stylespro_wrapper .gf_stylespro.theme_slug input[type=submit]': {
            'color'                     : 'btn_sbt_color',
            'border-color'              : 'btn_sbt_border_color',
            'background-color'          : 'btn_sbt_bg_color',
        },
        '.theme_slug .gform_next_button:hover,\
        .theme_slug input[type=button].gform_next_button:hover,\
        .theme_slug input[type=submit]:hover': {
            'color'                     : 'btn_sbt_hover_color',
            'border-color'              : 'btn_sbt_hover_border_color',
            'background-color'          : 'btn_sbt_hover_bg_color',
        },
    }


    this.getChoiceStyles = function() {

        var choice_style_color = this.$el.find('#' + this.slug + "_choice_style_color" ).val();

        if ( ! choice_style_color ) {
            return "";
        }

        // Choice Styles
        var choice_style_color_muted = getMutedColor(choice_style_color);
        
        var choiceStyleDeclaration = `.theme_slug .gfsp_toggle input[type]:not(old):checked + label:after,
        .theme_slug .gfsp_ios input[type]:not(old):checked + label:before,
        .theme_slug .gfsp_flip input[type]:not(old) + label:after{
            background-color:choiceColor
        }
        .theme_slug .gfsp_toggle input[type]:not(old):checked + label:before { background-color: choiceMuted }
        .theme_slug .gfsp_draw input[type]:not(old) + label:after { color:choiceColor }
        .theme_slug .gfsp_dot input[type]:not(old) + label:before {
            box-shadow: 0 0 0px 10px inset, 0 0 0px 15px choiceColor inset;
            border-color:choiceColor;
        }
        .theme_slug .gfsp_dot input[type]:not(old):checked + label:before {
            box-shadow: 0 0 0px 4px inset, 0 0 0px 15px choiceColor inset;
            border-color:choiceColor;
        }`;

    // Remove empty spaces
        choiceStyleDeclaration = choiceStyleDeclaration.replace(/    /g, "");
        choiceStyleDeclaration = choiceStyleDeclaration.replace(/theme_slug/g, this.slug);
        choiceStyleDeclaration = choiceStyleDeclaration.replace(/choiceColor/g, choice_style_color);
        choiceStyleDeclaration = choiceStyleDeclaration.replace(/choiceMuted/g, choice_style_color_muted);

        return choiceStyleDeclaration;
    }


    this.saveCss = function() {
        this.$el.find("#" + this.slug + "_theme_css").val( this.getCss() );
    }
    
}






/* Hide all theme and Show @param: theme */
function toggleTheme ( theme ) {
  jQuery('.thm').slideUp();
  var $theme_container = jQuery('.' + theme );
  $theme_container.slideDown();

  // Trigger change to calculate font-weights
  $theme_container.find('.font_pri, .font_sec').trigger('change');

  if ( has_gfsp_preview ) {
      jQuery('.thm').off('.gfspPreview');
      $theme_container.on('input.gfspPreview colorChange.gfspPreview', 'input, select', function() {
        if (previewTimeout)
            clearTimeout(previewTimeout);
    
        previewTimeout = setTimeout(() => {
            updatePreview( theme );
        }, 300);
    });
  }
  
}

function updatePreview(theme) {

    window.previewTheme = new Theme( theme );
    window.previewTheme.getCss();

    var pri_font = previewTheme.$el.find('.font_pri').val();
    if ( pri_font.indexOf("/Native") < 0 ) {
      pri_font = pri_font.split("/Native")[0];
    } else {
      pri_font = false;
    }

    var sec_font = previewTheme.$el.find('.font_sec').val();
    if ( sec_font.indexOf("/Native") < 0 ) {
      sec_font = sec_font.split("/Native")[0];
    } else {
      sec_font = false;
    }

    var css = "";
    updateGFontWeights();
    if ( pri_font ) {
      var pri_wght_val = previewTheme.$el.find('#'+theme+'_label_gfont_wght').val();
      var pri_wght = pri_wght_val === "" ? "" : ":" + pri_wght_val
      css += "@import url('//fonts.googleapis.com/css?family="+pri_font+pri_wght+"');";
    }
    if ( sec_font ) {
      var sec_wght_val = previewTheme.$el.find('#'+theme+'_gfont_wght').val();
      var sec_wght = sec_wght_val === "" ? "" : ":" + sec_wght_val
      css += "@import url('//fonts.googleapis.com/css?family="+sec_font+sec_wght+"');";
    }

    css += previewTheme.css;
    updatePreviewCss( theme, css );

}

function updatePreviewCss( theme, css ) {
    // Create element if it doesn't exist in the preview frame
    if ( ! ( window.previewFrame && theme in window.previewFrame ) ) {
        
        if ( previewFrame.oldCss.length > 0 ) {
            window.previewFrame.oldCss.before('<style id="gforms_stylespro_css_'+theme+'-inline-css">'+css+'</style>');
        } else {
            // If no inline settings are found, embed after the main stylesheet
            jQuery('#preview_frame').contents().find('link#gforms_stylespro_css-css, style[id^=gforms_stylespro_]').last().after('<style id="gforms_stylespro_css_'+theme+'-inline-css">'+css+'</style>');
        }
        
        window.previewFrame[theme] = jQuery('#preview_frame').contents().find('#gforms_stylespro_css_'+theme+'-inline-css');
    } else {
        window.previewFrame[theme].html( css );
    }
    if ( theme === "sp_inherit" ) {

        var frame_window = window.frames["preview_frame"].window;

        frame_window.gf_stylespro_icon_default = false;

        if (typeof frame_window.setGfspIconHeights == 'function') {
            frame_window.setGfspIconHeights()
        }
    }
}

function closePreview() {
    jQuery('.thm').off('.gfspPreview');
    jQuery('body').removeClass('has_gfsp_preview');
    jQuery('.preview_frame_wrapper').remove();
    
    // Clear URL Param
    const url = new URL(location);
    url.searchParams.delete('gfsp_preview_url');
    history.replaceState(null, null, url)
}

/* Show and hide background options */
function toggleBgOption(theme, bg_type) {
    jQuery('#gform_setting_' + theme + '_bg_color, #gform_setting_' + theme + '_bg_image, #gform_setting_' + theme + '_bg_size').hide();

    if (bg_type == 'color' || bg_type == 'image') {
        jQuery('#gform_setting_' + theme + '_bg_color').slideDown();
    }

    if (bg_type == 'image') {
        jQuery('#gform_setting_' + theme + '_bg_image, #gform_setting_' + theme + '_bg_size').slideDown();
    }
}


// Media uploader
var gk_media_init = function(selector, button_selector)  {
    var clicked_button = false;

    jQuery(selector).each(function (i, input) {
        var button = jQuery(input).closest("div").find(button_selector);
        button.click(function (event) {
            event.preventDefault();
            var selected_img;
            clicked_button = jQuery(this);

            // check for media manager instance
            if(wp.media.frames.gk_frame) {
                wp.media.frames.gk_frame.open();
                return;
            }
            // configuration of the media manager new instance
            wp.media.frames.gk_frame = wp.media({
                title: 'Select image',
                multiple: false,
                library: {
                    type: 'image'
                },
                button: {
                    text: 'Use selected image'
                }
            });

            // Function used for the image selection and media manager closing
            var gk_media_set_image = function() {
                var selection = wp.media.frames.gk_frame.state().get('selection');

                // no selection
                if (!selection) {
                    return;
                }

                // iterate through selected elements
                selection.each(function(attachment) {
                    var url = attachment.attributes.url;
                    clicked_button.closest("div").find(selector).val(url).trigger('input.gfspPreview');                    
                });
            };

            // closing event for media manger
            wp.media.frames.gk_frame.on('close', gk_media_set_image);
            // image selection event
            wp.media.frames.gk_frame.on('select', gk_media_set_image);
            // showing media manager
            wp.media.frames.gk_frame.open();
        });
    });
};


function maybeShowFontOptions( e ) {

	var el = jQuery(e.target);
	var thm = el.closest('.thm').attr('id');

    var maybe_label = el.hasClass('label_font') ? "_label" : "" ;

    var font = e.target.value.split("/");
	var $theme_options = el.closest('fieldset');
    
    if ( font[0] === "" ) {
        font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_custom"]').fadeOut();
        font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_load_cb"]').fadeOut();
    }
	else if ( font.length > 1 && font[1] == "Native" ) {
	
	    if ( font[0] == "custom" ) {
			// Custom Font. Show only Custon Font option
            font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_custom"]').fadeIn();
            font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_load_cb"]').fadeOut();
        } else {
			// Native Font. Hide both options
            font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_custom"]').fadeOut();
            font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_load_cb"]').fadeOut();
			
		}
	}

	else {
        // Google Font. Show only Dont Load G Font option
        font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_custom"]').fadeOut();
        font_custom = $theme_options.find('div[id*="'+thm+maybe_label+'_font_load_cb"]').fadeIn();
	}
}




/**
 * 
 * @param {string} settingName  CSS classname for the setting field
 * @param {string} property     Name of the CSS property to create rule with
 * @param {string} suffix       Unit for the value, or value itself in case of a checkbox
 * 
 * @returns {string} CSS delaration
 */
function getDeclaration(settingName, property, suffix='' ) {

    $settingEl = $el.find('.' + settingName );

    if ($settingEl.length == 0) {
        console.log("Setting " + settingName + " not found;");
        return '';
    }
    
    // if checkbox is selected
	if ( $settingEl.attr('type') == "checkbox" ) {

        if ( $settingEl.is(':checked') == false ) {
            return "";
        } else {
            // if checked
            return property + ":" + suffix + reinforce;
        }


    // if not a checkbox, get value from the field
    } else {
        value = $settingEl.val();
    }

    if ( value != '') {
        return property + ":" + value + suffix + reinforce;
    }

    // Default
    return '';

}


function getMutedColor ( color ) {
    
    if ( typeof color !== "undefined" && color.length == 0) {
        return "";
    }

    if ( typeof colorCalculator === "undefined" ) {
        window.colorCalculator = new Colors();
    }

    colorCalculator.setColor( color );

    var hsl = colorCalculator.colors.RND.hsl;
    var newHsl = "";

    if ( colorCalculator.colors.RND.hsl.l < 5 ) {
        newHsl = "hsl("+ hsl.h + "," + (hsl.s * 0.5) + "," + ((hsl.l + 5) * 5) + ")";
    }
    else if ( colorCalculator.colors.RND.hsl.l < 10 ) {
        newHsl = "hsl("+ hsl.h + "," + (hsl.s * 0.5) + "," + ((hsl.l) * 4) + ")";
    }
    else if ( colorCalculator.colors.RND.hsl.l < 20 ) {
        newHsl = "hsl("+ hsl.h + "," + (hsl.s * 0.5) + "," + ((hsl.l) * 2.5) + ")";
    }
    else if (colorCalculator.colors.RND.hsl.l > 70) {
        newHsl = "hsl("+ hsl.h + "," + (hsl.s * 0.5) + "," + (hsl.l * .85) + ")";
    } else {
        newHsl = "hsl("+ hsl.h + "," + (hsl.s * 0.5) + "," + (hsl.l * 1.3) + ")";
    }
 
    colorCalculator.setColor(newHsl);

    var newColor = colorCalculator.colors.RND.rgb;
    
    return "rgb("+ newColor.r + "," + newColor.g + "," + newColor.b + ")";
}


saveExpandedFields = function() {
    var theme_id = jQuery(".toggle_theme").val();
    var expanded_adv = jQuery("fieldset#"+theme_id+" .gform-settings-field.expanded");
    var expanded_adv_arr = [];
    
    expanded_adv.each( function() {
        var adv_id = this.id.split("gform_setting_"+theme_id+"_")[1]
        expanded_adv_arr.push(adv_id);
    });

    localStorage.setItem("spAdvFieldsExpand", expanded_adv_arr)
}

function markGFontsOptions(el, weights) {
    jQuery(el).find("option").each((i, e) => {
        if ( weights.includes(jQuery(e).val()) ) {
            jQuery(e).addClass("gfont_weight");
        } else {
            jQuery(e).removeClass("gfont_weight");
        }
    });
}



function updateGFontWeights() {
    var $theme = jQuery(".thm:visible"),
        theme_slug = $theme.attr("id");
        weights_pri = [],
        weights_sec = [];
    var $g_weight_field_pri = $theme.find('#'+theme_slug+'_label_gfont_wght'),
        $g_weight_field_sec = $theme.find('#'+theme_slug+'_gfont_wght');

    var g_weights_pri = $g_weight_field_pri.data("gfont-weights") || [],
        g_weights_sec = $g_weight_field_sec.data("gfont-weights") || [];

    $theme.find("select.adv_font_weight").each( (i, item) => {
        
        var this_weight = jQuery(item).val(),
            is_for_field = jQuery(item).is(".btn_font_weight, .field_font_weight"),
            font_preset = is_for_field ? "preset-font_sec" : "preset-font_pri",
            $the_font = jQuery(item).closest(".adv_fields").find(".adv_font select");
            
        font_preset = $the_font.val() || font_preset;

        if ( font_preset === "preset-font_pri" ) {
            markGFontsOptions(item, g_weights_pri)
            weights_pri.push(this_weight)
        }
        else {
            markGFontsOptions(item, g_weights_sec)
            weights_sec.push(this_weight)
        }
    });

    // Filter
    weights_pri = weights_pri.sort().filter( (item) => g_weights_pri.includes(item) );
    weights_sec = weights_sec.sort().filter( (item) => g_weights_sec.includes(item) );
    // Sort
    weights_pri = weights_pri.sort().filter( (item, pos, ary) => !pos || item != ary[pos - 1] );
    weights_sec = weights_sec.sort().filter( (item, pos, ary) => !pos || item != ary[pos - 1] );

    $g_weight_field_pri.val( weights_pri.join() ).trigger('change');
    $g_weight_field_sec.val( weights_sec.join() ).trigger('change');
}

jQuery(document).ready(function() {

    window.previewTimeout = null;
    window.has_gfsp_preview = jQuery("body").hasClass("has_gfsp_preview");

    // Resets Additonal Script values in case they've been changed
    jQuery('.additional_scripts').each( function() {
        jQuery(this).val( jQuery(this).data('value') );
    });


    // Changes Font names in select box labels
    jQuery('.font_pri').on('change', function(){
        var txt = jQuery(this).find(':selected').text();
        var thm = jQuery(this).closest('.thm');
        thm.find(".adv_font option[value='preset-font_pri']").text(txt + " (Label)");

        if (txt == "Custom font") {
            thm.find('.font_pri_custom').trigger('change');
        }

        if (  this.value.indexOf("/Native") === -1  ) {
            var target_field_id = thm.attr('id') + '_label_gfont_wght';
            addFontWeight( txt, target_field_id );
        }
        
    });
    jQuery('.font_pri_custom').on('change', function(){
        var txt = jQuery(this).val();
        var thm = jQuery(this).closest('.thm');
        thm.find(".adv_font option[value='preset-font_pri']").text(txt + " (Label)");
    });
    // Same as above. Duplication is simpler
    jQuery('.font_sec').on('change', function(){
        var txt = jQuery(this).find(':selected').text();
        var thm = jQuery(this).closest('.thm');
        thm.find(".adv_font option[value='preset-font_sec']").text(txt + " (Field)");

        if (txt == "Custom font") {
            thm.find('.font_sec_custom').trigger('change');
        }

        if (  this.value.indexOf("/Native") === -1  ) {
            var target_field_id = thm.attr('id') + '_gfont_wght';
            addFontWeight( txt, target_field_id );
        }

    });
    jQuery('.font_sec_custom').on('change', function(){
        var txt = jQuery(this).val();
        var thm = jQuery(this).closest('.thm');
        thm.find(".adv_font option[value='preset-font_sec']").text(txt + " (Field)");
    });

    jQuery('.adv_font_weight, .adv_font').on('change', updateGFontWeights);

    // Bind font options to font select boxes
    // immediately trigger after
    jQuery('.font, .label_font').on('change init', maybeShowFontOptions.bind(this) )
    .trigger('init');




    /* Generate CSS from settings and submit form */
    jQuery('#gform-settings').submit(function(e) {

        // Add px unit to values which are left with numbers only
        jQuery(".auto_px").each(function() {
            var vl = jQuery(this).val();
            var vl_ar  = vl.split(" ");
    
            vl_ar.forEach( (val, ind) => {
                if ( val == parseInt(val) )
                    vl_ar[ind] = val + "px";
                }
            );
    
            jQuery(this).val( vl_ar.join(" ") );
        });
        
        // e.preventDefault();
        jQuery('.thm').each(function () {
            // var theme_name = jQuery(this).attr('id').split('_')[1];
            var theme_name = jQuery(this).attr('id');

            var this_theme = new Theme( theme_name );

            // Clear BG color in case it is not selected
            var bg = jQuery('#gform_setting_' + theme_name + '_background :checked').val();
            if ( bg == "none" || bg === "default" ) {
                jQuery('#' + theme_name + '_bg_color').val("");
            }

            jQuery(this).find("input, select").each( function() {
                if ( this.value === "" ) {
                    jQuery(this).attr('disabled', 'disabled');
                }
            })

            this_theme.saveCss();

        });

        jQuery('.no_submit').attr('disabled', 'disabled');

        saveExpandedFields();


    });

    /* Initiate color picker */
    myColorPicker = jQuery(".color").colorPicker({
        opacity: true,

        convertCallback: function(colors, type) {
            rgb = colors.RND.rgb;
            placeholder_color = 'rgba(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ', ' + (colors.alpha*0.47).toFixed(2) + ')';
        },
        renderCallback: function($elm, toggled) {
            if (typeof placeholder_color !== undefined && placeholder_color != '' && placeholder_color != null) {
                $elm.attr('data-ph-color', placeholder_color);
                $elm.trigger("colorChange")
            }
            window.lastColorPicker = $elm;
        }
    });

    /* Calculate placeholder colors and save to the field's data-ph-color */
    jQuery(".font_color").each( function() {

        rgb = jQuery(this).colorPicker().colorPicker.color.colors.RND.rgb;
        alpha = jQuery(this).colorPicker().colorPicker.color.colors.alpha;
        placeholder_color = 'rgba(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ', ' + (alpha*0.47).toFixed(2) + ')';

        jQuery(this).attr('data-ph-color', placeholder_color);
    });


    /* Apply Media Uploader to upload background image fields */
    gk_media_init('.bg_image', '.media-button');


    /* Set background options per saved or default settings */
    jQuery('.background:checked').each ( function() {
        toggleBgOption(jQuery( this ).data('theme'), jQuery( this ).val())
    });

    /* Empty Fields Styles */
    
    jQuery("input, select").each( function() {
        if (jQuery(this).val() == '')
            jQuery(this).css('opacity', '.7');
    });
    
    jQuery("input, select").on('blur', function() {
        if (jQuery(this).val() == '')
            jQuery(this).css('opacity', '.7');
    });
    
    jQuery("input, select").on('focus', function() {
            jQuery(this).css('opacity', '1');
    });


    // Expand last expanded fields as set in localStorage
    var theme_id = jQuery(".toggle_theme").val();
    var expanded_adv = localStorage.getItem("spAdvFieldsExpand")

    if ( expanded_adv ) {
        var adv_expanded_arr = expanded_adv.split(",");

        jQuery.each(adv_expanded_arr,  function(i, adv_field) {
            jQuery("#gform_setting_"+theme_id+"_"+adv_field).addClass("expanded");
        })
    }


    // Hide Gravity Flow setting if Gravity Flow is not available
    $gflow_field_wrapper = jQuery('#gform_setting_gravity_flow_form_style');
    if ( $gflow_field_wrapper.find('select').hasClass('hide_field') ) {
        $gflow_field_wrapper.css('display','none')
    }

    // Display Themes
    jQuery(".thm").css('display', 'none');

    toggleTheme( jQuery('#theme').val() );

    jQuery('body').addClass('loading_completed');

    changeThemeToHash();

    maybeRefreshPage();

}); // Document ready ends


jQuery(document).ready(function() {

    if ( !has_gfsp_preview ) {
        return;
    }

    jQuery('#preview_frame').on('load', function() {

        var $frame = jQuery(this);

        $frame.contents().find('html').append('<style>#wpadminbar{display: none;} html{margin-top: 0!important}</style>');

        var $oldCssAll = $frame.contents().find('style[id^=gforms_stylespro_theme]');
        
        $oldCssAll.each( function() {
            // Leave Custom CSS here
            if ( jQuery(this).html().indexOf("/* Custom CSS */") > -1 ) {
                jQuery(this).html( jQuery(this).html().substring(jQuery(this).html().indexOf("/* Custom CSS */")) )
            } else {
                jQuery(this).html("");
            }
        } );

        window.previewFrame = {
            oldCss: $oldCssAll.last(),
        }
    
        var themesOnPage = [];
        $frame.contents().find("form.gf_stylespro").each( function() {
            var ind = Array.from(this.classList).indexOf("gf_stylespro") + 1;
            var thm = this.classList.item(ind);
            updatePreview(thm);
            themesOnPage.push(thm)
        });

        if ( themesOnPage.length === 1 ) {
            var thm = themesOnPage[0];
            jQuery( "#theme" ).has( "option[value="+thm+"]" ).val( thm ).trigger('change');
        }

        if ( themesOnPage.length === 0 ) {
            var plainGf = $frame.contents().find(".gform_wrapper").first();

            tb_warning_show()

            if  ( plainGf.length ) {
                var plainGfId = plainGf.attr("id").split("_")[2];
                jQuery(".goto_form_settings_gfsp").attr("href", jQuery(".goto_form_settings_gfsp").attr("href") + "&id=" + plainGfId);
                jQuery(".has_form").removeClass("hidden")
            }

        }

    });

    setTimeout(() => {
        jQuery(".gforms_note_success").slideUp()
    }, 7000);

}); // Preview Document ready ends






// Get font weight
function addFontWeight( fontFamily, target_field_id ) {

    var requestData = {
        action:      'gfspget_font_weight',
        font_family: fontFamily,
    };

    jQuery.ajax(
        {
            url:      ajaxurl,
            type:     'GET',
            dataType: 'json',
            data:     requestData,
            success:  function ( response ) {

                var $target_field = jQuery( "#"+target_field_id );

                $target_field.data("gfont-weights", response.data.variants);
                updateGFontWeights();
                
            },
            error:   function ( response ) {
                console.error( reponse )
            }
        }
    );
}




/* Theme Handlers */

// Import Theme
function importTheme( fieldsObj ) {
    
    var $theme = jQuery(".thm:visible");
    var theme_name = $theme.attr('id').split('_')[1];

    jQuery.each( fieldsObj, function( id, value ) {
        var id = id.replace("slug", theme_name);
        var $field = jQuery("#" + id)

        if ($field.attr('type') == 'radio' || $field.attr('type') == 'checkbox') {
            $field.prop( "checked", true ).trigger('change');
        }

        else {
            $field.val( value )
                .trigger('blur')
                .css('opacity', '1');
        }
    });


    // Set color fields BG
    $theme.find('.color').each( function() {
        
        var value = this.value;
        var colorInstance = jQuery(this).colorPicker().colorPicker.color;
        var colors = colorInstance.colors;
        
        colors.HEX = value; // first set the value in the color model
        jQuery(this).
            css({
                'background-color': '#' + colors.HEX,
                'color' : colors.rgbaMixBGMixCustom.luminance > 0.22 ? '#222' : '#ddd'
            })
            .blur();
        
    } );

}

// Get all data
jQuery(document).on('change', '#theme_upload_field', function(event) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var jsonObj = JSON.parse(event.target.result);
        importTheme( jsonObj );
    }

    reader.readAsText(event.target.files[0]);

    alert("Import completed");
    jQuery("#TB_closeWindowButton").click();
});



window.gfStylesproThemes = (function() {
    
    function downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function exportTheme() {
        var $theme = jQuery(".thm:visible");
        var theme_name = $theme.attr('id').split('_')[1];
        var fieldsObj = {};

        $theme.find("input[type=text], input:checked, select").each( function() {
            var val = jQuery(this).val();
            var id = jQuery(this).attr('id');

        if ( val != '' ) {
                id = id.replace(theme_name, "slug");
                fieldsObj[id] = val;
            }
        });

        if ( ! jQuery.isEmptyObject(fieldsObj) ) {
            downloadObjectAsJson(fieldsObj, "gf_stylespro_export_theme_" + theme_name);
        }

    }

    var presetsModal = function() {
        tb_show('Styles Pro: Import and Export Theme Settings', '#TB_inline?height=500&width=600&inlineId=plugin_settings_import_export_modal', '');
    }    

    var addVariationModal = function() {
        tb_show('Styles Pro: Theme Variations', '#TB_inline?height=500&width=600&inlineId=add_gf_stylespro_new_variation_modal', '');
    }

    // Reset theme options
    var resetTheme = function() {

        var currentTheme = jQuery('#theme option:selected').text();

        var sure = confirm( "Are you sure you want to reset all changes for "+ currentTheme +" theme?" );

        if ( ! sure ) {
            return;
        }

        var $thm = jQuery(".thm:visible");

        $thm.find("input[type=text]").each( function () {
            var val = jQuery(this).data('default') || "";
            jQuery(this).val( val );
            
            if ( jQuery(this).is(".color, .font_color") ) {
                jQuery(this).css("background-color", val)
            }
        });

        $thm.find("select").each( function () {
            var val = jQuery(this).data('default') || "";
            jQuery(this).val( val )
            jQuery(this).trigger('change');
        });

        $thm.find('input[type="checkbox"]').each( function () {
            if ( jQuery(this).prop('checked') == true ) {
                jQuery(this).trigger('click')
            }
        });

        $thm.find('.background').each( function () {
            if (jQuery(this).val() == 'default' ) {
                jQuery(this).trigger('click');
            }
        });

        $thm.find("[type=radio][value='']").attr('checked', 'checked').trigger('change');

        $thm.find('.adv_field_options_wrapper').find('input, select').trigger('blur')

        // Fix for Color Picker
        if (typeof lastColorPicker !== 'undefined') {
            jQuery(lastColorPicker).trigger('change');
        }

    }

    var addVariation = function() {

        var variationsVal = jQuery("#theme_variations").val() || "{}";
        var variationsObj = JSON.parse( variationsVal );
        var name = jQuery("#new_variation_name").val();
        var base = jQuery("#new_variation_base").val();
        
        if (!name)
            return;

        var slug = String( slugify(name) );

        if ( variationsObj.hasOwnProperty(slug) ) {
            alert("Already exists. Please choose another name");
        }
        else {
            variationsObj[slug] = {
                value: slug,
                label: name,
                base: base
            };

            var newObj = Object.assign({}, variationsObj);

            jQuery("#theme_variations").val( JSON.stringify(newObj) );

            addRefreshHash();
            
            jQuery("#gform-settings-save").click();
        }
    }


    var removeVariation = function() {
        var slug = String( jQuery("#remove_variation").val() );
        var theme_name = jQuery("#remove_variation").text().trim();

        var themesObj = JSON.parse( jQuery("#theme_variations").val() );

        if ( ! ( slug in themesObj ) ) {
            alert("Please select a variation to be removed.");
            return;
        }

        var sure = confirm( `WARNING: This action is irreversible.\n` +
            `Are you sure you want to delete theme variation "` + theme_name + `"?`);

        if ( sure ) {
            delete themesObj[slug];

            jQuery("#theme_variations").val( JSON.stringify(themesObj) );

            addRefreshHash();

            jQuery("#gform-settings-save").click();	
        }
    }


    /* Hide all theme and Show @param: showTheme */
    var toggleTheme = function(showTheme) {
        jQuery('.thm').slideUp();
        jQuery('.theme_' + showTheme).slideDown();
    }


    /* Show and hide background options */
    var toggleBgOption = function(theme, bg_type) {
        jQuery('#gaddon-setting-row-' + theme + '_bg_color, #gaddon-setting-row-' + theme + '_bg_image').hide();

        if (bg_type == 'color') {
            jQuery('#gaddon-setting-row-' + theme + '_bg_color').slideDown();
        }

        if (bg_type == 'image') {
            jQuery('#gaddon-setting-row-' + theme + '_bg_image').slideDown();
        }
    }


    var preColorOptionChange = function ( pre_color_field ) {

        var $pre_color_field = jQuery(pre_color_field);
        var pre_color_val = $pre_color_field.val();
        var $color = $pre_color_field.siblings('.color_presets');
        var default_preset = $color.attr('default_preset');
    
        var pre_color_class = pre_color_val ? pre_color_val : default_preset
    
        $pre_color_field.removeClass('color_bg_preset-color_pri color_bg_preset-color_sec color_bg_preset-color_cnt color_bg_custom');
        $pre_color_field.addClass('color_bg_' + pre_color_class);
    
        if (pre_color_val != 'custom') {
            $pre_color_field.parent().addClass('pre_color_show');
            $color.val( pre_color_val );
        } else {
            $pre_color_field.parent().removeClass('pre_color_show');
    
            var $temp_color = $color.siblings(".color");
            $color.val( $temp_color.val() ).trigger('change');
            setTimeout(() => {
                $temp_color.trigger('focus');
            }, 50);
        }
    
    }

    // Publicly accessible functions
return {
    presetsModal: presetsModal,
    addVariationModal: addVariationModal,
    exportTheme: exportTheme,
    resetTheme: resetTheme,
    addVariation: addVariation,
    removeVariation: removeVariation,
    toggleTheme: toggleTheme,
    toggleBgOption: toggleBgOption,
    preColorOptionChange: preColorOptionChange,
}
})();







/**
 * ----------------
 * Helper Functions
 * ----------------
 */

/**
 * https://andrew.stwrt.ca/posts/js-slugify/
 */
 function slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
}

function changeThemeToHash() {
    var $themes = jQuery("#theme");
    var hash = window.location.hash.split("#")[1];

    $themes.find("option").each( function() {
        if ( jQuery(this).val() == hash ) {
            jQuery($themes).val(hash).trigger('change');
            history.replaceState(null, null, ' ');
            return false;
        }
    } );
}

function addRefreshHash() {
    var url_ob = new URL(document.URL);
    url_ob.hash = '#refresh';
    // new url
    var new_url = url_ob.href;
    document.location.href = new_url;
}

function maybeRefreshPage() {
    var hash = document.location.hash.split("#")[1];
    if ( hash == "refresh" ) {
        jQuery('body').removeClass('loading_completed');
        window.location.href = document.location.href.split("#")[0];
    }
}