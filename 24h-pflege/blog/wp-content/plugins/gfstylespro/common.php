<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}

/**
 * Class GFSPCommon
 *
 * Includes common methods accessed throughout Gravity Forms and add-ons.
 */
class GFSPCommon {

    /**
     * Get array of Google fonts choices for dropdown
     * @return array
     */
    public static function get_font_choices() {
        
        $g_fonts = include( "inc/gfonts.php" );

        $safe_fonts = array(
            "Arial",
            "Georgia",
            "Times New Roman",
            "Courier New",
            "Sans Serif",
            "Verdana",
            "Trebuchet MS",
            "Tahoma"
        );

        foreach ($g_fonts as $i) {
            $g_font_list[] = array(
            "label" => $i,
            "value" => $i
            );
        }

        foreach ($safe_fonts as $i) {
            $safe_font_list[] = array(
            "label" => $i,
            "value" => $i . '/Native'
            );
        }

        $choices = array(
            array(
                'label'   => esc_html__( 'No change', 'gf_supercharge' ),
                'value'  => '/Native',
            ),
            array(
                'label'   => esc_html__( 'Inherit from parent', 'gf_supercharge' ),
                'value'  => 'inherit/Native',
            ),
            array(
                'label'   => esc_html__( 'Custom font', 'gf_supercharge' ),
                'value'  => 'custom/Native',
            ),
            array(
                'label'   => esc_html__( 'Web safe/Native fonts', 'gf_supercharge' ),
                'disabled'  => 'disabled',
                'choices' => $safe_font_list
            ),
            array(
                'label' => esc_html__( 'Google Fonts', 'gf_supercharge' ),
                'disabled' => 'disabled',
                'choices' => $g_font_list
            )
        );

        return $choices;
    }

    
    /*
    * Reads data from all all theme files, return array
    */
    public static function get_themes( $variations_data = null ) {

        $all_themes = array();
        
        $themes_data = array(
            'label' => 'Theme Name',
            'value' => 'Theme Slug',
            'font'  => 'Font',
            'font_label' => 'Font Label',
            'field_margin' => 'Field Margin',
            'field_icon_color' => 'Icon',
            'choice_style_color' => 'Choice Style Color',
            'desc'  => 'Description',
            'scripts' => "Features",
            'scripts_desc' => "Features Description"
            );

        foreach ( glob( plugin_dir_path( __FILE__ ) . "themes/*.css" ) as $file ) {
            $gfsp_themes = get_file_data($file, $themes_data, $context='');
            if ( $gfsp_themes['value'] != '' ){
                    $all_themes[ $gfsp_themes['value'] ] = $gfsp_themes;
            }

        }
        foreach ( glob( get_stylesheet_directory() . "/gf_stylespro/*.css" ) as $file ) {
            $gfsp_themes = get_file_data( $file, $themes_data );
            if ( $gfsp_themes['value'] != '' ){
                $all_themes[ $gfsp_themes['value'] ] = $gfsp_themes;
            }
        }

        foreach ( glob( get_template_directory() . "/gf_stylespro/*.css" ) as $file ) {
            $gfsp_themes = get_file_data( $file, $themes_data );
            if ( $gfsp_themes['value'] != '' ){
                $all_themes[ $gfsp_themes['value'] ] = $gfsp_themes;
            }
        }

        // Sort theme list
        asort($all_themes);

        $variations = array();
        $variations_choices = array();

        if ( $variations_data ) {
            foreach ($variations_data as $slug => $obj) {
                if ( isset ( $all_themes[ $obj['base'] ] ) ) {

                    $obj['label'] = $obj['label'] ." (" . $all_themes[ $obj['base'] ]['label'] .")";
                    
                    $variations[$slug] = $obj + $all_themes[$obj['base']];

                    // $variations[$slug] = $variations[$slug] + $all_themes[$obj['base']];
                }
            }

        }

        asort($all_themes);
        $all_themes = array_merge( $variations, $all_themes );
        
        return $all_themes;
    }


    /**
     * 
     * Locates Styles Pro Theme's CSS file
     * 
     * @param theme Theme Slug
     * @return location path
     * 
     * @since 3.0
     * 
     */
    public static function locate_theme( $theme ) {

        $min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG || isset( $_GET['gform_debug'] ) ? '' : '.min';
        $location = '';

        if ( file_exists( get_stylesheet_directory() . "/gf_stylespro/{$theme}.css" ) ) {
            $location = get_stylesheet_directory_uri() . "/gf_stylespro/{$theme}.css";
        }
        else if ( file_exists( get_template_directory() . "/gf_stylespro/{$theme}.css" ) ) {
            $location = get_template_directory_uri() . "/gf_stylespro/{$theme}.css";
        }
        else if ( file_exists( plugin_dir_path( __FILE__ ) . "themes/{$theme}.min.css") ) {
            $location = plugin_dir_url( __FILE__ ) . "themes/{$theme}{$min}.css";
        }
        else if ( file_exists( plugin_dir_path( __FILE__ ) . "themes/{$theme}.css") ) {
            $location = plugin_dir_url( __FILE__ ) . "themes/{$theme}.css";
        }

        return $location;
    }



    /**
     * AJAX handler for returning Google Font Weights
     * 
     * @since 3.0
     */
    public function ajax_get_font_weights() {
        
        if ( ! rgget( 'font_family' ) ) {
            wp_send_json_error( array( 'message' => __( 'No font-family given', 'gf_stylespro' ) ) );
        }

        $font_family = rgget( 'font_family' );
        
        $fonts_json = @file_get_contents(dirname(__FILE__) . "\\scripts\\gfonts.json");
        $fonts_all = json_decode($fonts_json, true);

        
        if( isset( $fonts_all[$font_family] ) ) {
            $this_font_family = $fonts_all[$font_family];
            
            $variants = [];

            foreach ($fonts_all[$font_family]['variants'] as $value) {
                // Remove italics
                if ( strpos($value, "italic") === false ) {

                    // Change the 'regular' to match CSS weight
                    if ( $value === "regular" ) {   
                        $value = "400";
                    }

                    $variants[] = $value;
                }
            }
            
            $this_font_family['variants'] = $variants;

            wp_send_json_success( $this_font_family );

        } else {
            wp_send_json_error( array( 'message' => __( 'Font not found', 'gf_stylespro' ) ) );
        }

    }

    
}
