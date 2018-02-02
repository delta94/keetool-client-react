@extends('landingpage::layouts.master')

@section('content')
    @if($landingpage)
        <script>
            landingpage_id = "{{$landingpage->id}}";
            path_landingpage = "{{$landingpage->path}}";
            var data = {!!$landingpage->content!!};
            for (var key in data) {
                localStorage.setItem(key, data[key]);
            }
        </script>
    @endif
    <div class="menu" id="menu">

        <div class="main" id="main">

            <h3 id="pixlogo"><span id="pixversion"></span><img
                        src="http://d1j8r0kxyu9tj8.cloudfront.net/files/1513615572wML0iNu6Dob9von.png"
                        style="width: 160px!important; height: auto!important;"></h3>


            <ul id="elements">
                <li><a href="#" id="all"><i class="pixicon-grid"></i>&nbsp;All Blocks</a></li>
            </ul>

            <a href="#" class="toggle"></a>


            <div class="left_headline"><i class="pi pixicon-paper-stack"></i> Pages</div>

            <ul id="pages">
                <li style="display: none;" id="newPageLI">
                    <input type="text" value="index" name="page">
                    <span class="pageButtons">
							<a href="" class="fileEdit"><i class="pi pixicon-cog"></i></a>
							<a href="" class="pix_dupliacte" title="Duplicate Page"><i class="pi pixicon-stack"></i></a>
							<a href="" class="fileDel"><i class="pi pixicon-trash"></i></a>
							<a class="btn btn-xs btn-primary btn-embossed fileSave" href="#"><span
                                        class="fui-check"></span></a>
						</span>
                </li>
                <li class="active">
                    <a href="#page1">index</a>
                    <span class="pageButtons">
							<a href="" class="fileEdit"><i class="pi pixicon-cog"></i></a>
							<a href="" class="pix_dupliacte" title="Duplicate Page"><i class="pi pixicon-stack"></i></a>
							<a class="btn btn-xs btn-primary btn-embossed fileSave" href="#"><span
                                        class="fui-check"></span></a>
						</span>
                </li>
            </ul>

            <div class="sideButtons clearfix">
                <a href="#" class="btn btn-sm btn-embossed" id="addPage"><i class="pi pixicon-circle-plus"></i> Add</a>
                <a href="#exportModal" data-toggle="modal" class="btn btn-sm btn-embossed disabled actionButtons"><i
                            class="pi pixicon-download"></i> Export</a>
            </div>

            <!--<div class="left_headline left_shadows"><i class="pi pixicon-file"></i> .PixBuilder Project</div>-->
            {{--<div class="pixbuilderdiv">--}}
            {{--<a href="#projModal" id="projPage" data-toggle="modal"--}}
            {{--class="btn btn-info btn-embossed pull-a actiosnButtons projexp" style="width:80%;margin:0 10%;"><i--}}
            {{--class="pi pixicon-open"></i> Export & Import</a>--}}
            {{--</div>--}}

        </div><!-- /.main -->

        <div class="second" id="second">

            <!-- <a href="#" class="hideSecond" id="hideSecond"><span class="fui-arrow-left"></span> hide</a> -->

            <ul id="elements">

            </ul>

        </div><!-- /.secondSide -->

    </div><!-- /.menu -->

    <header class="clearfix" data-spy="affix" data-offset-top="40" data-offset-bottom="180">


        <div class="modes">
            <span class="modes_title">BUILDING MODE</span>
            <label class="radio primary first">
                <input type="radio" name="mode" id="modeBlock" value="block" data-toggle="radio" disabled="" checked="">
                <span class="label_text">Elements</span>
            </label>
            <label class="radio primary first">
                <input type="radio" name="mode" id="modeContent" value="content" data-toggle="radio" disabled="">
                <span class="label_text">Content</span>
            </label>
            <label class="radio primary first">
                <input type="radio" name="mode" id="modeStyle" value="styling" data-toggle="radio" disabled="">
                <span class="label_text">Details</span>
            </label>

        </div>


        <a id="clearScreen" class="btn btn-danger btn-embossed pull-right disabled actionButtons pixbtn"><i
                    class="pi pixicon-trash"></i> Empty Page</a>

        <a href="#previewModal" id="preview" data-toggle="modal"
           class="btn btn-inverse btn-embossed pull-right disabled actionButtons pixbtn" style="display: none"><i
                    class="pi pixicon-eye"></i> Preview</a>


        <form action="preview.php" target="_blank" id="pix_preview_form" method="post" style="display:none;">
            <input type="hidden" name="markup" value="" id="markupField">
            <button type="submit" type="button" class="btn btn-inverse btn-embossed btn-blue actionButtons pixbtn"
                    id="pixshowPreview"><i class="pi pixicon-eye"></i> Preview
            </button>
        </form>

        <a href="#sourceModal" data-toggle="modal" id="sourceButton"
           class="btn btn-primary btn-embossed pull-right actionButtons pixbtn"><i
                    class="pi pixicon-cog"></i> <span class="bLabel">Source</span></a>


        <a href="#seoModal" id="seoButton" data-toggle="modal"
           class="btn btn-info btn-embossed  pull-right actionButtons seo_btn pixbtn" style=""><i
                    class="pi pixicon-cog"></i> SEO</a>

        <a href="#exportModal" id="exportPage" data-toggle="modal"
           class="btn btn-info btn-embossed pull-right disabled actionButtons pixbtn"><i
                    class="pi pixicon-download"></i>
            Export</a>

        <a href="#saveModal" data-toggle="modal" id="savePage"
           class="btn btn-primary btn-embossed pull-right actionButtons pixbtn"><i
                    class="pi pixicon-square-check"></i> <span class="bLabel">Nothing new to save</span></a>

    </header>

    <div class="container">


        <div class="screen" id="screen">

            <div class="toolbar">

                <div class="buttons clearfix">
                    <span class="left red"></span>
                    <span class="left yellow"></span>
                    <span class="left green"></span>
                </div>

                <div class="title" id="pageTitle">
                    <span><span id="current_pagename">index</span>.html</span>
                </div>

                <div class="top_right_options">
                    <a href="#cssModal" data-toggle="modal" id="open_page_css"><span><i class="pi pixicon-css3"></i> Custom CSS</span></a>
                    <!-- &nbsp;|&nbsp; -->
                    <a href="#sectionsModal" data-toggle="modal" id="open_page_sections"><span><i
                                    class="pi pixicon-menu"></i> Page Sections</span></a>
                </div>

            </div>

            <div id="frameWrapper" class="frameWrapper empty">
                <div id="pageList">
                    <ul style="display: block;" id="page1"></ul>
                </div>
                <div class="start" id="start">
                    <span>Build your page by dragging elements onto the canvas</span>
                </div>
            </div>

        </div><!-- /.screen -->
        <!--<div class="pix_copy_right"><span>All rights reserved Copyright © 2016 <a-->
        <!--href="http://themeforest.net/item/flatpack-landing-pages-pack-with-page-builder/10591107"-->
        <!--class="pix_copy_right" target="_blanck">FLATPACK</a> by <a href="http://pixfort.com" class="pix_copy_right"-->
        <!--target="_blanck">PixFort</a></span></div>-->
    </div><!-- /.container -->

    <div id="styleEditor" class="styleEditor">

        <div class="sidetitle">
            <a href="#" class="close"><i class="pi pixicon-cross"></i></a>

            <span><i class="pi pixicon-paper"></i> Detail Editor</span>
        </div>
        <ul class="breadcrumb">
            <li class="pixfirst_breadcrumb">Editing:</li>
            <li class="active" id="editingElement">p</li>
        </ul>

        <ul class="nav nav-tabs " id="detailTabs">
            <li class="active"><a href="#tab1"><i class="pi pixicon-drop"></i> Style</a></li>
            <li style="display: none;"><a href="#link_Tab" id="link_Link"><i class="pi pixicon-paper-clip"></i> Link</a>
            </li>
            <li style="display: none;"><a href="#image_Tab" id="img_Link"><i class="pi pixicon-image"></i> Image</a>
            </li>
            <li style="display: none;"><a href="#icon_Tab" id="icon_Link"><i class="pi pixicon-umbrella"></i> Icons</a>
            </li>
            <li style="display: none;"><a href="#video_Tab" id="video_Link"><span class="fa fa-youtube-play"></span>
                    Video</a></li>
            <li style="display: none;"><a href="#input_Tab" id="input_Link"><i class="pi pixicon-stack"></i> Field
                    Builder</a></li>
            <li style="display: none;"><a href="#checkbox_Tab" id="checkbox_Link"><i class="pi pixicon-stack"></i>
                    Checkbox</a>
            </li>
            <li style="display: none;"><a href="#form_Tab" id="form_Link"><i class="pi pixicon-stack"></i> Form Builder</a>
            </li>
            <li style="display: none;"><a href="#paypal_Tab" id="paypal_Link"><i class="pi pixicon-paypal"></i> PayPal
                    Builder</a></li>
            <li style="display: none;"><a href="#animation_Tab" id="animation_Link"><i class="pi pixicon-loader"></i>
                    Animation</a></li>
        </ul><!-- /tabs -->

        <div class="tab-content">

            <div class="tab-pane active" id="tab1">

                <form class="" role="form" id="stylingForm">

                    <div id="styleElements">

                        <div class="form-group clearfix" style="display: none;" id="styleElTemplate">
                            <label for="" class="control-label"></label>
                            <input type="text" class="form-control input-sm" id="" placeholder="">
                        </div>

                    </div>

                </form>

            </div>

            <!-- /tabs -->
            <div class="tab-pane link_Tab" id="link_Tab">

                <select id="internalLinksDropdown">
                    <option value="#">Choose a page</option>
                    <!-- <option value="index.html">index</option> -->
                </select>

                <p class="text-center or">
                    <span>OR</span>
                </p>

                <select id="pageLinksDropdown">
                    <option value="#">Choose a block (one page sites)</option>
                </select>

                <p class="text-center or">
                    <span>OR</span>
                </p>

                <input type="text" class="form-control" id="internalLinksCustom"
                       placeholder="http://somewhere.com/somepage"
                       value="">

            </div>

            <!-- /tabs -->
            <div class="tab-pane imageFileTab" id="image_Tab">


                <label>Enter image path:</label>

                <input type="text" class="form-control" id="imageURL" placeholder="Enter an image URL" value="">

                <p class="text-center or">
                    <span>OR</span>
                </p>

                <form id="imageUploadForm" action="iupload.php">

                    <label>Upload image:</label>

                    <div class="form-group">


                        <div class="fileinput fileinput-new" data-provides="fileinput"
                             style="display:inline-block;width:100% !important;postition:relative;">
                            <div class="fileinput-preview thumbnail" style="width: 100%; height: 150px;"></div>
                            <div class="buttons">
							<span class="btn btn-primary btn-sm btn-embossed btn-file">
								<span class="fileinput-new" data-trigger="fileinput"><i class="pi pixicon-image"></i>&nbsp;&nbsp;Select image</span>
								<span class="fileinput-exists"><i class="pi pixicon-cog"></i>&nbsp;&nbsp;Change</span>
								<input type="file" name="imageFileField" id="imageFileField">
							</span>
                                <a href="#" class="btn btn-sm btn-embossed fileinput-exists" data-dismiss="fileinput"><i
                                            class="pi pixicon-trash"></i>&nbsp;&nbsp;Remove</a>
                            </div>
                        </div>
                    </div>

                </form>

            </div><!-- /.tab-pane -->


            <div class="tab-pane imageFileTab pixformbuilder" id="input_Tab">
                <label>Enter Field Name:</label>
                <input type="text" class="form-control" id="inputname" placeholder="Enter Field Name" value="">
                <label>Enter Placeholder:</label>
                <input type="text" class="form-control" id="inputplace" placeholder="Enter Placeholder" value="">
                <label>Required Field:</label>
                <select id="is_required">
                    <option value="#">No</option>
                    <option value="required">Yes</option>
                </select>
            </div><!-- /.tab-pane -->

            <div class="tab-pane imageFileTab pixformbuilder" id="checkbox_Tab">
                <label>Enter checkbox Name:</label>
                <input type="text" class="form-control" id="input_checkbox_name" placeholder="Enter Field Name"
                       value="">
                <div class="pix_note" style="" id="pix_edit_note">*Use the same name for each group of checkboxes in the
                    form.
                </div>
                <label>Enter Value:</label>
                <input type="text" class="form-control" id="input_value" placeholder="Enter value" value="">
            </div><!-- /.tab-pane -->

            <div class="tab-pane imageFileTab pixformbuilder2" id="form_Tab">
                <label>Enter Popup ID:</label>
                <input type="text" class="form-control" id="popupid" placeholder="Enter Popup ID" value="">
                <label>Enter Redirect URL:</label>
                <input type="text" class="form-control" id="redirecturl" placeholder="Enter Redirect URL" value="">
                <label>Enter Form Type:</label>
                <select id="formprovider">
                    <option value="">Default Page Provider</option>
                    <option value="ce">Custom Email</option>
                    <option value="mc">Mailchimp</option>
                    <option value="cm">CampaginMonitor</option>
                    <option value="gr">GetResponse</option>
                    <option value="aw">AWeber</option>
                    <option value="ac">ActiveCampaign</option>
                    <option value="ml">MailerLite</option>
                    <option value="fm">FreshMail</option>
                    <option value="sl">Sendloop</option>
                </select>

                <div class="pix_note" style="display:none;" id="pix_edit_note">* Don't forget to input the email
                    provideder
                    setting before exporting the page (from the export button).
                </div>
                <br>
                <br>
                <label>Add new fields to the form:</label>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_field"><i
                            class="pi pixicon-square-plus"></i> Add new Field
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_select"><i
                            class="pi pixicon-add-to-list"></i> Add new Select
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_textarea"><i
                            class="pi pixicon-align-left"></i> Add new Text Area
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_radio"><i
                            class="pi pixicon-target"></i> Add new radio
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_checkboxs"><i
                            class="pi pixicon-list"></i> Add new checkboxs
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_date"><i
                            class="pi pixicon-clock"></i> Add new date field
                </button>
                <button type="button" class="btn btn-embossed btn-sm btn-block" id="add_terms"><i
                            class="pi pixicon-paper"></i> Add new accept terms
                </button>

                <br>

            </div><!-- /.tab-pane -->


            <div class="tab-pane imageFileTab pixpaypalbuilder" id="paypal_Tab">
                <label>Enter your Paypal email:</label>
                <input type="text" class="form-control" id="paypal_email" placeholder="Enter PayPal email" value="">
                <label>Enter item name:</label>
                <input type="text" class="form-control" id="paypal_item_name" placeholder="Enter item name" value="">
                <div id="paypal_complex" class="">
                    <label>Enter item Price:</label>
                    <input type="text" class="form-control" id="paypal_item_price" placeholder="Enter item price"
                           value="">
                    <div class="pix_note" style="display:none;padding:5px 0;padding-top:8px;" id="paypal_price_note">
                        This
                        form has complex price field, for more information about editing it please check <a
                                href="http://support.pixfort.com/doc/flatpack/#paypal_complex" target="_blanck">the
                            documentation file</a>.
                    </div>
                </div>

                <label>Enter successful return URL:</label>
                <input type="text" class="form-control" id="paypal_successful_url" placeholder="Enter return URL"
                       value="">
                <label>Enter cancel return URL:</label>
                <input type="text" class="form-control" id="paypal_cancel_url" placeholder="Enter return URL" value="">
                <label>Enter notify URL:</label>
                <input type="text" class="form-control" id="paypal_notify_url" placeholder="Enter return URL" value="">


                <div class="pix_note" id="pix_paypal_note">* For more information about the PayPal integration please
                    check
                    the <a href="http://support.pixfort.com/doc/flatpack/#paypal" target="_blanck">documentation
                        file</a>.
                </div>


                <br>

            </div><!-- /.tab-pane -->


            <div class="tab-pane imageFileTab pixanimations" id="animation_Tab">

                <label>Choose an Animation below: </label>
                <select id="animations" data-placeholder="Your Favorite Types of Bear">
                    <option value="">None</option>
                    <option value="fade-in">Fade In</option>
                    <option value="fade-in-up">Fade In Up</option>
                    <option value="fade-in-up-big">Fade In Up Big</option>
                    <option value="fade-in-up-large">Fade In Up Large</option>
                    <option value="fade-in-down">Fade In Down</option>
                    <option value="fade-in-down-big">Fade In Down Big</option>
                    <option value="fade-in-down-large">Fade In Down Large</option>
                    <option value="fade-in-left">Fade In Left</option>
                    <option value="fade-in-left-big">Fade In Left Big</option>
                    <option value="fade-in-left-large">Fade In Left Large</option>
                    <option value="fade-in-right">Fade In Right</option>
                    <option value="fade-in-right-big">Fade In Right Big</option>
                    <option value="fade-in-right-large">Fade In Right Large</option>

                    <option value="fade-in-up-left">Fade In Up Left</option>
                    <option value="fade-in-up-left-big">Fade In Up Left Big</option>
                    <option value="fade-in-up-left-large">Fade In Up Left Large</option>
                    <option value="fade-in-up-right">Fade In Up Right</option>
                    <option value="fade-in-up-right-big">Fade In Up Right Big</option>
                    <option value="fade-in-up-right-large">Fade In Up Right Large</option>
                    <option value="fade-in-down-left">Fade In Down Left</option>
                    <option value="fade-in-down-left-big">Fade In Down Left Big</option>
                    <option value="fade-in-down-left-large">Fade In Down Left Large</option>
                    <option value="fade-in-down-right">Fade In Down Right</option>
                    <option value="fade-in-down-right-big">Fade In Down Right Big</option>
                    <option value="fade-in-down-right-large">Fade In Down Right Large</option>

                    <option value="bounce-in">Bounce In</option>
                    <option value="bounce-in-big">Bounce In Big</option>
                    <option value="bounce-in-large">Bounce In Large</option>
                    <option value="bounce-in-up">Bounce In Up</option>
                    <option value="bounce-in-up-big">Bounce In Up Big</option>
                    <option value="bounce-in-up-large">Bounce In Up Large</option>
                    <option value="bounce-in-down">Bounce In Down</option>
                    <option value="bounce-in-down-big">Bounce In Down Big</option>
                    <option value="bounce-in-down-large">Bounce In Down Large</option>
                    <option value="bounce-in-left">Bounce In Left</option>
                    <option value="bounce-in-left-big">Bounce In Left Big</option>
                    <option value="bounce-in-left-large">Bounce In Left Large</option>
                    <option value="bounce-in-right">Bounce In Right</option>
                    <option value="bounce-in-right-big">Bounce In Right Big</option>
                    <option value="bounce-in-right-large">Bounce In Right Large</option>

                    <option value="bounce-in-up-left">Bounce In Up Left</option>
                    <option value="bounce-in-up-left-big">Bounce In Up Left Big</option>
                    <option value="bounce-in-up-left-large">Bounce In Up Left Large</option>
                    <option value="bounce-in-up-right">Bounce In Up Right</option>
                    <option value="bounce-in-up-right-big">Bounce In Up Right Big</option>
                    <option value="bounce-in-up-right-large">Bounce In Up Right Large</option>
                    <option value="bounce-in-down-left">Bounce In Down Left</option>
                    <option value="bounce-in-down-left-big">Bounce In Down Left Big</option>
                    <option value="bounce-in-down-left-large">Bounce In Down Left Large</option>
                    <option value="bounce-in-down-right">Bounce In Down Right</option>
                    <option value="bounce-in-down-right-big">Bounce In Down Right Big</option>
                    <option value="bounce-in-down-right-large">Bounce In Down Right Large</option>

                    <option value="zoom-in">Zoom In</option>
                    <option value="zoom-in-up">Zoom In Up</option>
                    <option value="zoom-in-up-big">Zoom In Up Big</option>
                    <option value="zoom-in-up-large">Zoom In Up Large</option>
                    <option value="zoom-in-down">Zoom In Down</option>
                    <option value="zoom-in-down-big">Zoom In Down Big</option>
                    <option value="zoom-in-down-large">Zoom In Down Large</option>
                    <option value="zoom-in-left">Zoom In Left</option>
                    <option value="zoom-in-left-big">Zoom In Left Big</option>
                    <option value="zoom-in-left-large">Zoom In Left Large</option>
                    <option value="zoom-in-right">Zoom In Right</option>
                    <option value="zoom-in-right-big">Zoom In Right Big</option>
                    <option value="zoom-in-right-large">Zoom In Right Large</option>

                    <option value="zoom-in-up-left">Zoom In Up Left</option>
                    <option value="zoom-in-up-left-big">Zoom In Up Left Big</option>
                    <option value="zoom-in-up-left-large">Zoom In Up Left Large</option>
                    <option value="zoom-in-up-right">Zoom In Up Right</option>
                    <option value="zoom-in-up-right-big">Zoom In Up Right Big</option>
                    <option value="zoom-in-up-right-large">Zoom In Up Right Large</option>
                    <option value="zoom-in-down-left">Zoom In Down Left</option>
                    <option value="zoom-in-down-left-big">Zoom In Down Left Big</option>
                    <option value="zoom-in-down-left-large">Zoom In Down Left Large</option>
                    <option value="zoom-in-down-right">Zoom In Down Right</option>
                    <option value="zoom-in-down-right-big">Zoom In Down Right Big</option>
                    <option value="zoom-in-down-right-large">Zoom In Down Right Large</option>

                    <option value="flip-in-x">Flip In X</option>
                    <option value="flip-in-y">Flip In Y</option>
                    <option value="flip-in-top-front">Flip In Top Front</option>
                    <option value="flip-in-top-back">Flip In Top Back</option>
                    <option value="flip-in-bottom-front">Flip In Bottom Front</option>
                    <option value="flip-in-bottom-back">Flip In Bottom Back</option>
                    <option value="flip-in-left-front">Flip In Left Front</option>
                    <option value="flip-in-left-back">Flip In Left Back</option>
                    <option value="flip-in-right-front">Flip In Right Front</option>
                    <option value="flip-in-right-back">Flip In Right Back</option>

                    <option value="flash">Flash</option>
                    <option value="strobe">Strobe</option>
                    <option value="shake-x">Shake X</option>
                    <option value="shake-y">Shake Y</option>
                    <option value="bounce">Bounce</option>
                    <option value="tada">Tada</option>
                    <option value="rubber-band">Rubber Band</option>
                    <option value="swing">Swing</option>
                    <option value="spin">Spin</option>
                    <option value="spin-reverse">Spin Reverse</option>
                    <option value="slingshot">Slingshot</option>
                    <option value="slingshot-reverse">Slingshot Reverse</option>
                    <option value="wobble">Wobble</option>
                    <option value="pulse">Pulse</option>
                    <option value="pulsate">Pulsate</option>
                    <option value="heartbeat">Heartbeat</option>
                    <option value="panic">Panic</option>
                </select>

                <label>Animation delay:</label>
                <input type="text" class="form-control" id="data-anim-delay"
                       placeholder="Enter delay time in milliseconds"
                       value="">

                <label>Animation duration:</label>
                <select id="animationdur">
                    <option value="">Default (1 second)</option>
                    <option value="slow-mo">slow-mo (2 second)</option>
                    <option value="super-slow-mo">super-slow-mo (3 second)</option>
                    <option value="ultra-slow-mo">ultra-slow-mo (4 second)</option>
                    <option value="hyper-slow-mo">hyper-slow-mo (5 second)</option>
                </select>


                <div class="pix_note" style="display:none;" id="pix_edit_note">* Don't forget to input the email
                    provideder
                    setting before exporting the page (from the export button).
                </div>
                <br>


            </div><!-- /.tab-pane -->


            <!-- /tabs -->
            <div class="tab-pane iconTab" id="icon_Tab">

                <label>Choose an icon below: </label>

                <select id="icons" data-placeholder="Your Favorite Types of Bear">
                    <option value="pixicon-eye">&#xe000; pixicon-eye</option>
                    <option value="pixicon-paper-clip">&#xe001; pixicon-paper-clip</option>
                    <option value="pixicon-mail">&#xe002; pixicon-mail</option>
                    <option value="pixicon-toggle">&#xe003; pixicon-toggle</option>
                    <option value="pixicon-layout">&#xe004; pixicon-layout</option>
                    <option value="pixicon-link">&#xe005; pixicon-link</option>
                    <option value="pixicon-bell">&#xe006; pixicon-bell</option>
                    <option value="pixicon-lock">&#xe007; pixicon-lock</option>
                    <option value="pixicon-unlock">&#xe008; pixicon-unlock</option>
                    <option value="pixicon-ribbon">&#xe009; pixicon-ribbon</option>
                    <option value="pixicon-image">&#xe010; pixicon-image</option>
                    <option value="pixicon-signal">&#xe011; pixicon-signal</option>
                    <option value="pixicon-target">&#xe012; pixicon-target</option>
                    <option value="pixicon-clipboard">&#xe013; pixicon-clipboard</option>
                    <option value="pixicon-clock">&#xe014; pixicon-clock</option>
                    <option value="pixicon-watch">&#xe015; pixicon-watch</option>
                    <option value="pixicon-air-play">&#xe016; pixicon-air-play</option>
                    <option value="pixicon-camera">&#xe017; pixicon-camera</option>
                    <option value="pixicon-video">&#xe018; pixicon-video</option>
                    <option value="pixicon-disc">&#xe019; pixicon-disc</option>
                    <option value="pixicon-printer">&#xe020; pixicon-printer</option>
                    <option value="pixicon-monitor">&#xe021; pixicon-monitor</option>
                    <option value="pixicon-server">&#xe022; pixicon-server</option>
                    <option value="pixicon-cog">&#xe023; pixicon-cog</option>
                    <option value="pixicon-heart">&#xe024; pixicon-heart</option>
                    <option value="pixicon-paragraph">&#xe025; pixicon-paragraph</option>
                    <option value="pixicon-align-justify">&#xe026; pixicon-align-justify</option>
                    <option value="pixicon-align-left">&#xe027; pixicon-align-left</option>
                    <option value="pixicon-align-center">&#xe028; pixicon-align-center</option>
                    <option value="pixicon-align-right">&#xe029; pixicon-align-right</option>
                    <option value="pixicon-book">&#xe030; pixicon-book</option>
                    <option value="pixicon-layers">&#xe031; pixicon-layers</option>
                    <option value="pixicon-stack">&#xe032; pixicon-stack</option>
                    <option value="pixicon-stack-2">&#xe033; pixicon-stack-2</option>
                    <option value="pixicon-paper">&#xe034; pixicon-paper</option>
                    <option value="pixicon-paper-stack">&#xe035; pixicon-paper-stack</option>
                    <option value="pixicon-search">&#xe036; pixicon-search</option>
                    <option value="pixicon-zoom-in">&#xe037; pixicon-zoom-in</option>
                    <option value="pixicon-zoom-out">&#xe038; pixicon-zoom-out</option>
                    <option value="pixicon-reply">&#xe039; pixicon-reply</option>
                    <option value="pixicon-circle-plus">&#xe040; pixicon-circle-plus</option>
                    <option value="pixicon-circle-minus">&#xe041; pixicon-circle-minus</option>
                    <option value="pixicon-circle-check">&#xe042; pixicon-circle-check</option>
                    <option value="pixicon-circle-cross">&#xe043; pixicon-circle-cross</option>
                    <option value="pixicon-square-plus">&#xe044; pixicon-square-plus</option>
                    <option value="pixicon-square-minus">&#xe045; pixicon-square-minus</option>
                    <option value="pixicon-square-check">&#xe046; pixicon-square-check</option>
                    <option value="pixicon-square-cross">&#xe047; pixicon-square-cross</option>
                    <option value="pixicon-microphone">&#xe048; pixicon-microphone</option>
                    <option value="pixicon-record">&#xe049; pixicon-record</option>
                    <option value="pixicon-skip-back">&#xe050; pixicon-skip-back</option>
                    <option value="pixicon-rewind">&#xe051; pixicon-rewind</option>
                    <option value="pixicon-play">&#xe052; pixicon-play</option>
                    <option value="pixicon-pause">&#xe053; pixicon-pause</option>
                    <option value="pixicon-stop">&#xe054; pixicon-stop</option>
                    <option value="pixicon-fast-forward">&#xe055; pixicon-fast-forward</option>
                    <option value="pixicon-skip-forward">&#xe056; pixicon-skip-forward</option>
                    <option value="pixicon-shuffle">&#xe057; pixicon-shuffle</option>
                    <option value="pixicon-repeat">&#xe058; pixicon-repeat</option>
                    <option value="pixicon-folder">&#xe059; pixicon-folder</option>
                    <option value="pixicon-umbrella">&#xe060; pixicon-umbrella</option>
                    <option value="pixicon-moon">&#xe061; pixicon-moon</option>
                    <option value="pixicon-thermometer">&#xe062; pixicon-thermometer</option>
                    <option value="pixicon-drop">&#xe063; pixicon-drop</option>
                    <option value="pixicon-sun">&#xe064; pixicon-sun</option>
                    <option value="pixicon-cloud">&#xe065; pixicon-cloud</option>
                    <option value="pixicon-cloud-upload">&#xe066; pixicon-cloud-upload</option>
                    <option value="pixicon-cloud-download">&#xe067; pixicon-cloud-download</option>
                    <option value="pixicon-upload">&#xe068; pixicon-upload</option>
                    <option value="pixicon-download">&#xe069; pixicon-download</option>
                    <option value="pixicon-location">&#xe070; pixicon-location</option>
                    <option value="pixicon-location-2">&#xe071; pixicon-location-2</option>
                    <option value="pixicon-map">&#xe072; pixicon-map</option>
                    <option value="pixicon-battery">&#xe073; pixicon-battery</option>
                    <option value="pixicon-head">&#xe074; pixicon-head</option>
                    <option value="pixicon-briefcase">&#xe075; pixicon-briefcase</option>
                    <option value="pixicon-speech-bubble">&#xe076; pixicon-speech-bubble</option>
                    <option value="pixicon-anchor">&#xe077; pixicon-anchor</option>
                    <option value="pixicon-globe">&#xe078; pixicon-globe</option>
                    <option value="pixicon-box">&#xe079; pixicon-box</option>
                    <option value="pixicon-reload">&#xe080; pixicon-reload</option>
                    <option value="pixicon-share">&#xe081; pixicon-share</option>
                    <option value="pixicon-marquee">&#xe082; pixicon-marquee</option>
                    <option value="pixicon-marquee-plus">&#xe083; pixicon-marquee-plus</option>
                    <option value="pixicon-marquee-minus">&#xe084; pixicon-marquee-minus</option>
                    <option value="pixicon-tag">&#xe085; pixicon-tag</option>
                    <option value="pixicon-power">&#xe086; pixicon-power</option>
                    <option value="pixicon-command">&#xe087; pixicon-command</option>
                    <option value="pixicon-alt">&#xe088; pixicon-alt</option>
                    <option value="pixicon-esc">&#xe089; pixicon-esc</option>
                    <option value="pixicon-bar-graph">&#xe090; pixicon-bar-graph</option>
                    <option value="pixicon-bar-graph-2">&#xe091; pixicon-bar-graph-2</option>
                    <option value="pixicon-pie-graph">&#xe092; pixicon-pie-graph</option>
                    <option value="pixicon-star">&#xe093; pixicon-star</option>
                    <option value="pixicon-arrow-left">&#xe094; pixicon-arrow-left</option>
                    <option value="pixicon-arrow-right">&#xe095; pixicon-arrow-right</option>
                    <option value="pixicon-arrow-up">&#xe096; pixicon-arrow-up</option>
                    <option value="pixicon-arrow-down">&#xe097; pixicon-arrow-down</option>
                    <option value="pixicon-volume">&#xe098; pixicon-volume</option>
                    <option value="pixicon-mute">&#xe099; pixicon-mute</option>
                    <option value="pixicon-content-right">&#xe100; pixicon-content-right</option>
                    <option value="pixicon-content-left">&#xe101; pixicon-content-left</option>
                    <option value="pixicon-grid">&#xe102; pixicon-grid</option>
                    <option value="pixicon-grid-2">&#xe103; pixicon-grid-2</option>
                    <option value="pixicon-columns">&#xe104; pixicon-columns</option>
                    <option value="pixicon-loader">&#xe105; pixicon-loader</option>
                    <option value="pixicon-bag">&#xe106; pixicon-bag</option>
                    <option value="pixicon-ban">&#xe107; pixicon-ban</option>
                    <option value="pixicon-flag">&#xe108; pixicon-flag</option>
                    <option value="pixicon-trash">&#xe109; pixicon-trash</option>
                    <option value="pixicon-expand">&#xe110; pixicon-expand</option>
                    <option value="pixicon-contract">&#xe111; pixicon-contract</option>
                    <option value="pixicon-maximize">&#xe112; pixicon-maximize</option>
                    <option value="pixicon-minimize">&#xe113; pixicon-minimize</option>
                    <option value="pixicon-plus">&#xe114; pixicon-plus</option>
                    <option value="pixicon-minus">&#xe115; pixicon-minus</option>
                    <option value="pixicon-check">&#xe116; pixicon-check</option>
                    <option value="pixicon-cross">&#xe117; pixicon-cross</option>
                    <option value="pixicon-move">&#xe118; pixicon-move</option>
                    <option value="pixicon-delete">&#xe119; pixicon-delete</option>
                    <option value="pixicon-menu">&#xe120; pixicon-menu</option>
                    <option value="pixicon-archive">&#xe121; pixicon-archive</option>
                    <option value="pixicon-inbox">&#xe122; pixicon-inbox</option>
                    <option value="pixicon-outbox">&#xe123; pixicon-outbox</option>
                    <option value="pixicon-file">&#xe124; pixicon-file</option>
                    <option value="pixicon-file-add">&#xe125; pixicon-file-add</option>
                    <option value="pixicon-file-subtract">&#xe126; pixicon-file-subtract</option>
                    <option value="pixicon-help">&#xe127; pixicon-help</option>
                    <option value="pixicon-open">&#xe128; pixicon-open</option>
                    <option value="pixicon-ellipsis">&#xe129; pixicon-ellipsis</option>
                    <option value="pixicon-mobile">&#xe00a; pixicon-mobile</option>
                    <option value="pixicon-laptop">&#xe00b; pixicon-laptop</option>
                    <option value="pixicon-desktop">&#xe00c; pixicon-desktop</option>
                    <option value="pixicon-tablet">&#xe00d; pixicon-tablet</option>
                    <option value="pixicon-phone">&#xe00e; pixicon-phone</option>
                    <option value="pixicon-document">&#xe00f; pixicon-document</option>
                    <option value="pixicon-documents">&#xe01a; pixicon-documents</option>
                    <option value="pixicon-search2">&#xe01b; pixicon-search2</option>
                    <option value="pixicon-clipboard2">&#xe01c; pixicon-clipboard2</option>
                    <option value="pixicon-newspaper">&#xe01d; pixicon-newspaper</option>
                    <option value="pixicon-notebook">&#xe01e; pixicon-notebook</option>
                    <option value="pixicon-book-open">&#xe01f; pixicon-book-open</option>
                    <option value="pixicon-browser">&#xe02a; pixicon-browser</option>
                    <option value="pixicon-calendar">&#xe02b; pixicon-calendar</option>
                    <option value="pixicon-presentation">&#xe02c; pixicon-presentation</option>
                    <option value="pixicon-picture">&#xe02d; pixicon-picture</option>
                    <option value="pixicon-pictures">&#xe02e; pixicon-pictures</option>
                    <option value="pixicon-video2">&#xe02f; pixicon-video2</option>
                    <option value="pixicon-camera2">&#xe03a; pixicon-camera2</option>
                    <option value="pixicon-printer2">&#xe03b; pixicon-printer2</option>
                    <option value="pixicon-toolbox">&#xe03c; pixicon-toolbox</option>
                    <option value="pixicon-briefcase2">&#xe03d; pixicon-briefcase2</option>
                    <option value="pixicon-wallet">&#xe03e; pixicon-wallet</option>
                    <option value="pixicon-gift">&#xe03f; pixicon-gift</option>
                    <option value="pixicon-bargraph">&#xe04a; pixicon-bargraph</option>
                    <option value="pixicon-grid2">&#xe04b; pixicon-grid2</option>
                    <option value="pixicon-expand2">&#xe04c; pixicon-expand2</option>
                    <option value="pixicon-focus">&#xe04d; pixicon-focus</option>
                    <option value="pixicon-edit">&#xe04e; pixicon-edit</option>
                    <option value="pixicon-adjustments">&#xe04f; pixicon-adjustments</option>
                    <option value="pixicon-ribbon2">&#xe05a; pixicon-ribbon2</option>
                    <option value="pixicon-hourglass">&#xe05b; pixicon-hourglass</option>
                    <option value="pixicon-lock2">&#xe05c; pixicon-lock2</option>
                    <option value="pixicon-megaphone">&#xe05d; pixicon-megaphone</option>
                    <option value="pixicon-shield">&#xe05e; pixicon-shield</option>
                    <option value="pixicon-trophy">&#xe05f; pixicon-trophy</option>
                    <option value="pixicon-flag2">&#xe06a; pixicon-flag2</option>
                    <option value="pixicon-map2">&#xe06b; pixicon-map2</option>
                    <option value="pixicon-puzzle">&#xe06c; pixicon-puzzle</option>
                    <option value="pixicon-basket">&#xe06d; pixicon-basket</option>
                    <option value="pixicon-envelope">&#xe06e; pixicon-envelope</option>
                    <option value="pixicon-streetsign">&#xe06f; pixicon-streetsign</option>
                    <option value="pixicon-telescope">&#xe07a; pixicon-telescope</option>
                    <option value="pixicon-gears">&#xe07b; pixicon-gears</option>
                    <option value="pixicon-key">&#xe07c; pixicon-key</option>
                    <option value="pixicon-paperclip">&#xe07d; pixicon-paperclip</option>
                    <option value="pixicon-attachment">&#xe07e; pixicon-attachment</option>
                    <option value="pixicon-pricetags">&#xe07f; pixicon-pricetags</option>
                    <option value="pixicon-lightbulb">&#xe08a; pixicon-lightbulb</option>
                    <option value="pixicon-layers2">&#xe08b; pixicon-layers2</option>
                    <option value="pixicon-pencil">&#xe08c; pixicon-pencil</option>
                    <option value="pixicon-tools">&#xe08d; pixicon-tools</option>
                    <option value="pixicon-tools-2">&#xe08e; pixicon-tools-2</option>
                    <option value="pixicon-scissors">&#xe08f; pixicon-scissors</option>
                    <option value="pixicon-paintbrush">&#xe09a; pixicon-paintbrush</option>
                    <option value="pixicon-magnifying-glass">&#xe09b; pixicon-magnifying-glass</option>
                    <option value="pixicon-circle-compass">&#xe09c; pixicon-circle-compass</option>
                    <option value="pixicon-linegraph">&#xe09d; pixicon-linegraph</option>
                    <option value="pixicon-mic">&#xe09e; pixicon-mic</option>
                    <option value="pixicon-strategy">&#xe09f; pixicon-strategy</option>
                    <option value="pixicon-beaker">&#xe0a0; pixicon-beaker</option>
                    <option value="pixicon-caution">&#xe0a1; pixicon-caution</option>
                    <option value="pixicon-recycle">&#xe0a2; pixicon-recycle</option>
                    <option value="pixicon-anchor2">&#xe0a3; pixicon-anchor2</option>
                    <option value="pixicon-profile-male">&#xe0a4; pixicon-profile-male</option>
                    <option value="pixicon-profile-female">&#xe0a5; pixicon-profile-female</option>
                    <option value="pixicon-bike">&#xe0a6; pixicon-bike</option>
                    <option value="pixicon-wine">&#xe0a7; pixicon-wine</option>
                    <option value="pixicon-hotairballoon">&#xe0a8; pixicon-hotairballoon</option>
                    <option value="pixicon-globe2">&#xe0a9; pixicon-globe2</option>
                    <option value="pixicon-genius">&#xe0aa; pixicon-genius</option>
                    <option value="pixicon-map-pin">&#xe0ab; pixicon-map-pin</option>
                    <option value="pixicon-dial">&#xe0ac; pixicon-dial</option>
                    <option value="pixicon-chat">&#xe0ad; pixicon-chat</option>
                    <option value="pixicon-heart2">&#xe0ae; pixicon-heart2</option>
                    <option value="pixicon-cloud2">&#xe0af; pixicon-cloud2</option>
                    <option value="pixicon-upload2">&#xe0b0; pixicon-upload2</option>
                    <option value="pixicon-download2">&#xe0b1; pixicon-download2</option>
                    <option value="pixicon-target2">&#xe0b2; pixicon-target2</option>
                    <option value="pixicon-hazardous">&#xe0b3; pixicon-hazardous</option>
                    <option value="pixicon-piechart">&#xe0b4; pixicon-piechart</option>
                    <option value="pixicon-speedometer">&#xe0b5; pixicon-speedometer</option>
                    <option value="pixicon-global">&#xe0b6; pixicon-global</option>
                    <option value="pixicon-compass">&#xe0b7; pixicon-compass</option>
                    <option value="pixicon-lifesaver">&#xe0b8; pixicon-lifesaver</option>
                    <option value="pixicon-clock2">&#xe0b9; pixicon-clock2</option>
                    <option value="pixicon-aperture">&#xe0ba; pixicon-aperture</option>
                    <option value="pixicon-quote">&#xe0bb; pixicon-quote</option>
                    <option value="pixicon-scope">&#xe0bc; pixicon-scope</option>
                    <option value="pixicon-alarmclock">&#xe0bd; pixicon-alarmclock</option>
                    <option value="pixicon-refresh">&#xe0be; pixicon-refresh</option>
                    <option value="pixicon-happy">&#xe0bf; pixicon-happy</option>
                    <option value="pixicon-sad">&#xe0c0; pixicon-sad</option>
                    <option value="pixicon-facebook">&#xe0c1; pixicon-facebook</option>
                    <option value="pixicon-twitter">&#xe0c2; pixicon-twitter</option>
                    <option value="pixicon-googleplus">&#xe0c3; pixicon-googleplus</option>
                    <option value="pixicon-rss">&#xe0c4; pixicon-rss</option>
                    <option value="pixicon-tumblr">&#xe0c5; pixicon-tumblr</option>
                    <option value="pixicon-linkedin">&#xe0c6; pixicon-linkedin</option>
                    <option value="pixicon-dribbble">&#xe0c7; pixicon-dribbble</option>
                    <option value="pixicon-heart3">&#xe600; pixicon-heart3</option>
                    <option value="pixicon-cloud3">&#xe601; pixicon-cloud3</option>
                    <option value="pixicon-star2">&#xe602; pixicon-star2</option>
                    <option value="pixicon-tv">&#xe603; pixicon-tv</option>
                    <option value="pixicon-sound">&#xe604; pixicon-sound</option>
                    <option value="pixicon-video3">&#xe605; pixicon-video3</option>
                    <option value="pixicon-trash2">&#xe606; pixicon-trash2</option>
                    <option value="pixicon-user">&#xe607; pixicon-user</option>
                    <option value="pixicon-key2">&#xe608; pixicon-key2</option>
                    <option value="pixicon-search3">&#xe609; pixicon-search3</option>
                    <option value="pixicon-settings">&#xe60a; pixicon-settings</option>
                    <option value="pixicon-camera3">&#xe60b; pixicon-camera3</option>
                    <option value="pixicon-tag2">&#xe60c; pixicon-tag2</option>
                    <option value="pixicon-lock3">&#xe60d; pixicon-lock3</option>
                    <option value="pixicon-bulb">&#xe60e; pixicon-bulb</option>
                    <option value="pixicon-pen">&#xe60f; pixicon-pen</option>
                    <option value="pixicon-diamond">&#xe610; pixicon-diamond</option>
                    <option value="pixicon-display">&#xe611; pixicon-display</option>
                    <option value="pixicon-location2">&#xe612; pixicon-location2</option>
                    <option value="pixicon-eye2">&#xe613; pixicon-eye2</option>
                    <option value="pixicon-bubble">&#xe614; pixicon-bubble</option>
                    <option value="pixicon-stack2">&#xe615; pixicon-stack2</option>
                    <option value="pixicon-cup">&#xe616; pixicon-cup</option>
                    <option value="pixicon-phone2">&#xe617; pixicon-phone2</option>
                    <option value="pixicon-news">&#xe618; pixicon-news</option>
                    <option value="pixicon-mail2">&#xe619; pixicon-mail2</option>
                    <option value="pixicon-like">&#xe61a; pixicon-like</option>
                    <option value="pixicon-photo">&#xe61b; pixicon-photo</option>
                    <option value="pixicon-note">&#xe61c; pixicon-note</option>
                    <option value="pixicon-clock3">&#xe61d; pixicon-clock3</option>
                    <option value="pixicon-paperplane">&#xe61e; pixicon-paperplane</option>
                    <option value="pixicon-params">&#xe61f; pixicon-params</option>
                    <option value="pixicon-banknote">&#xe620; pixicon-banknote</option>
                    <option value="pixicon-data">&#xe621; pixicon-data</option>
                    <option value="pixicon-music">&#xe622; pixicon-music</option>
                    <option value="pixicon-megaphone2">&#xe623; pixicon-megaphone2</option>
                    <option value="pixicon-study">&#xe624; pixicon-study</option>
                    <option value="pixicon-lab">&#xe625; pixicon-lab</option>
                    <option value="pixicon-food">&#xe626; pixicon-food</option>
                    <option value="pixicon-t-shirt">&#xe627; pixicon-t-shirt</option>
                    <option value="pixicon-fire">&#xe628; pixicon-fire</option>
                    <option value="pixicon-clip">&#xe629; pixicon-clip</option>
                    <option value="pixicon-shop">&#xe62a; pixicon-shop</option>
                    <option value="pixicon-calendar2">&#xe62b; pixicon-calendar2</option>
                    <option value="pixicon-wallet2">&#xe62c; pixicon-wallet2</option>
                    <option value="pixicon-vynil">&#xe62d; pixicon-vynil</option>
                    <option value="pixicon-truck">&#xe62e; pixicon-truck</option>
                    <option value="pixicon-world">&#xe62f; pixicon-world</option>
                    <option value="pixicon-fire2">&#xe630; pixicon-fire2</option>
                    <option value="pixicon-star3">&#xe631; pixicon-star3</option>
                    <option value="pixicon-play2">&#xe632; pixicon-play2</option>
                    <option value="pixicon-pause2">&#xe633; pixicon-pause2</option>
                    <option value="pixicon-stop2">&#xe634; pixicon-stop2</option>
                    <option value="pixicon-backward">&#xe635; pixicon-backward</option>
                    <option value="pixicon-forward">&#xe636; pixicon-forward</option>
                    <option value="pixicon-mail3">&#xe637; pixicon-mail3</option>
                    <option value="pixicon-mail4">&#xe638; pixicon-mail4</option>
                    <option value="pixicon-mail5">&#xe639; pixicon-mail5</option>
                    <option value="pixicon-mail6">&#xe63a; pixicon-mail6</option>
                    <option value="pixicon-google">&#xe63b; pixicon-google</option>
                    <option value="pixicon-googleplus2">&#xe63c; pixicon-googleplus2</option>
                    <option value="pixicon-googleplus3">&#xe63d; pixicon-googleplus3</option>
                    <option value="pixicon-googleplus4">&#xe63e; pixicon-googleplus4</option>
                    <option value="pixicon-googleplus5">&#xe63f; pixicon-googleplus5</option>
                    <option value="pixicon-google-drive">&#xe640; pixicon-google-drive</option>
                    <option value="pixicon-facebook2">&#xe641; pixicon-facebook2</option>
                    <option value="pixicon-facebook3">&#xe642; pixicon-facebook3</option>
                    <option value="pixicon-facebook4">&#xe643; pixicon-facebook4</option>
                    <option value="pixicon-instagram">&#xe644; pixicon-instagram</option>
                    <option value="pixicon-twitter2">&#xe645; pixicon-twitter2</option>
                    <option value="pixicon-twitter3">&#xe646; pixicon-twitter3</option>
                    <option value="pixicon-twitter4">&#xe647; pixicon-twitter4</option>
                    <option value="pixicon-feed">&#xe648; pixicon-feed</option>
                    <option value="pixicon-feed2">&#xe649; pixicon-feed2</option>
                    <option value="pixicon-feed3">&#xe64a; pixicon-feed3</option>
                    <option value="pixicon-youtube">&#xe64b; pixicon-youtube</option>
                    <option value="pixicon-youtube2">&#xe64c; pixicon-youtube2</option>
                    <option value="pixicon-vimeo">&#xe64d; pixicon-vimeo</option>
                    <option value="pixicon-vimeo2">&#xe64e; pixicon-vimeo2</option>
                    <option value="pixicon-vimeo3">&#xe64f; pixicon-vimeo3</option>
                    <option value="pixicon-lanyrd">&#xe650; pixicon-lanyrd</option>
                    <option value="pixicon-flickr">&#xe651; pixicon-flickr</option>
                    <option value="pixicon-flickr2">&#xe652; pixicon-flickr2</option>
                    <option value="pixicon-flickr3">&#xe653; pixicon-flickr3</option>
                    <option value="pixicon-flickr4">&#xe654; pixicon-flickr4</option>
                    <option value="pixicon-picassa">&#xe655; pixicon-picassa</option>
                    <option value="pixicon-picassa2">&#xe656; pixicon-picassa2</option>
                    <option value="pixicon-dribbble2">&#xe657; pixicon-dribbble2</option>
                    <option value="pixicon-dribbble3">&#xe658; pixicon-dribbble3</option>
                    <option value="pixicon-dribbble4">&#xe659; pixicon-dribbble4</option>
                    <option value="pixicon-forrst">&#xe65a; pixicon-forrst</option>
                    <option value="pixicon-forrst2">&#xe65b; pixicon-forrst2</option>
                    <option value="pixicon-deviantart">&#xe65c; pixicon-deviantart</option>
                    <option value="pixicon-deviantart2">&#xe65d; pixicon-deviantart2</option>
                    <option value="pixicon-steam">&#xe65e; pixicon-steam</option>
                    <option value="pixicon-steam2">&#xe65f; pixicon-steam2</option>
                    <option value="pixicon-github">&#xe660; pixicon-github</option>
                    <option value="pixicon-github2">&#xe661; pixicon-github2</option>
                    <option value="pixicon-github3">&#xe662; pixicon-github3</option>
                    <option value="pixicon-github4">&#xe663; pixicon-github4</option>
                    <option value="pixicon-github5">&#xe664; pixicon-github5</option>
                    <option value="pixicon-wordpress">&#xe665; pixicon-wordpress</option>
                    <option value="pixicon-wordpress2">&#xe666; pixicon-wordpress2</option>
                    <option value="pixicon-joomla">&#xe667; pixicon-joomla</option>
                    <option value="pixicon-blogger">&#xe668; pixicon-blogger</option>
                    <option value="pixicon-blogger2">&#xe669; pixicon-blogger2</option>
                    <option value="pixicon-tumblr2">&#xe66a; pixicon-tumblr2</option>
                    <option value="pixicon-tumblr3">&#xe66b; pixicon-tumblr3</option>
                    <option value="pixicon-yahoo">&#xe66c; pixicon-yahoo</option>
                    <option value="pixicon-tux">&#xe66d; pixicon-tux</option>
                    <option value="pixicon-apple">&#xe66e; pixicon-apple</option>
                    <option value="pixicon-finder">&#xe66f; pixicon-finder</option>
                    <option value="pixicon-android">&#xe670; pixicon-android</option>
                    <option value="pixicon-windows">&#xe671; pixicon-windows</option>
                    <option value="pixicon-windows8">&#xe672; pixicon-windows8</option>
                    <option value="pixicon-soundcloud">&#xe673; pixicon-soundcloud</option>
                    <option value="pixicon-soundcloud2">&#xe674; pixicon-soundcloud2</option>
                    <option value="pixicon-skype">&#xe675; pixicon-skype</option>
                    <option value="pixicon-reddit">&#xe676; pixicon-reddit</option>
                    <option value="pixicon-linkedin2">&#xe677; pixicon-linkedin2</option>
                    <option value="pixicon-lastfm">&#xe678; pixicon-lastfm</option>
                    <option value="pixicon-lastfm2">&#xe679; pixicon-lastfm2</option>
                    <option value="pixicon-delicious">&#xe67a; pixicon-delicious</option>
                    <option value="pixicon-stumbleupon">&#xe67b; pixicon-stumbleupon</option>
                    <option value="pixicon-stumbleupon2">&#xe67c; pixicon-stumbleupon2</option>
                    <option value="pixicon-stackoverflow">&#xe67d; pixicon-stackoverflow</option>
                    <option value="pixicon-pinterest">&#xe67e; pixicon-pinterest</option>
                    <option value="pixicon-pinterest2">&#xe67f; pixicon-pinterest2</option>
                    <option value="pixicon-xing">&#xe680; pixicon-xing</option>
                    <option value="pixicon-xing2">&#xe681; pixicon-xing2</option>
                    <option value="pixicon-flattr">&#xe682; pixicon-flattr</option>
                    <option value="pixicon-foursquare">&#xe683; pixicon-foursquare</option>
                    <option value="pixicon-foursquare2">&#xe684; pixicon-foursquare2</option>
                    <option value="pixicon-paypal">&#xe685; pixicon-paypal</option>
                    <option value="pixicon-paypal2">&#xe686; pixicon-paypal2</option>
                    <option value="pixicon-paypal3">&#xe687; pixicon-paypal3</option>
                    <option value="pixicon-yelp">&#xe688; pixicon-yelp</option>
                    <option value="pixicon-libreoffice">&#xe689; pixicon-libreoffice</option>
                    <option value="pixicon-file-pdf">&#xe68a; pixicon-file-pdf</option>
                    <option value="pixicon-file-openoffice">&#xe68b; pixicon-file-openoffice</option>
                    <option value="pixicon-file-word">&#xe68c; pixicon-file-word</option>
                    <option value="pixicon-file-excel">&#xe68d; pixicon-file-excel</option>
                    <option value="pixicon-file-zip">&#xe68e; pixicon-file-zip</option>
                    <option value="pixicon-file-powerpoint">&#xe68f; pixicon-file-powerpoint</option>
                    <option value="pixicon-file-xml">&#xe690; pixicon-file-xml</option>
                    <option value="pixicon-file-css">&#xe691; pixicon-file-css</option>
                    <option value="pixicon-html5">&#xe692; pixicon-html5</option>
                    <option value="pixicon-html52">&#xe693; pixicon-html52</option>
                    <option value="pixicon-css3">&#xe694; pixicon-css3</option>
                    <option value="pixicon-chrome">&#xe695; pixicon-chrome</option>
                    <option value="pixicon-firefox">&#xe696; pixicon-firefox</option>
                    <option value="pixicon-IE">&#xe697; pixicon-IE</option>
                    <option value="pixicon-opera">&#xe698; pixicon-opera</option>
                    <option value="pixicon-safari">&#xe699; pixicon-safari</option>
                    <option value="pixicon-paperclip2">&#xe69a; pixicon-paperclip2</option>
                    <option value="pixicon-map3">&#xe69b; pixicon-map3</option>
                    <option value="pixicon-compass2">&#xe69c; pixicon-compass2</option>
                    <option value="pixicon-heart4">&#xe69d; pixicon-heart4</option>
                    <option value="pixicon-network">&#xe69e; pixicon-network</option>
                    <option value="pixicon-key3">&#xe69f; pixicon-key3</option>
                    <option value="pixicon-battery2">&#xe6a0; pixicon-battery2</option>
                    <option value="pixicon-bucket">&#xe6a1; pixicon-bucket</option>
                    <option value="pixicon-magnet">&#xe6a2; pixicon-magnet</option>
                    <option value="pixicon-drive">&#xe6a3; pixicon-drive</option>
                    <option value="pixicon-cup2">&#xe6a4; pixicon-cup2</option>
                    <option value="pixicon-rocket">&#xe6a5; pixicon-rocket</option>
                    <option value="pixicon-progress-0">&#xe6a6; pixicon-progress-0</option>
                    <option value="pixicon-sun2">&#xe6a7; pixicon-sun2</option>
                    <option value="pixicon-sun3">&#xe6a8; pixicon-sun3</option>
                    <option value="pixicon-adjust">&#xe6a9; pixicon-adjust</option>
                    <option value="pixicon-code">&#xe6aa; pixicon-code</option>
                    <option value="pixicon-creditcard">&#xe6ab; pixicon-creditcard</option>
                    <option value="pixicon-database">&#xe6ac; pixicon-database</option>
                    <option value="pixicon-voicemail">&#xe6ad; pixicon-voicemail</option>
                    <option value="pixicon-droplets">&#xe6ae; pixicon-droplets</option>
                    <option value="pixicon-uniE6AF">&#xe6af; pixicon-uniE6AF</option>
                    <option value="pixicon-statistics">&#xe6b0; pixicon-statistics</option>
                    <option value="pixicon-pie">&#xe6b1; pixicon-pie</option>
                    <option value="pixicon-lock4">&#xe6b2; pixicon-lock4</option>
                    <option value="pixicon-lock-open">&#xe6b3; pixicon-lock-open</option>
                    <option value="pixicon-cross2">&#xe6b4; pixicon-cross2</option>
                    <option value="pixicon-minus2">&#xe6b5; pixicon-minus2</option>
                    <option value="pixicon-plus2">&#xe6b6; pixicon-plus2</option>
                    <option value="pixicon-minus3">&#xe6b7; pixicon-minus3</option>
                    <option value="pixicon-plus3">&#xe6b8; pixicon-plus3</option>
                    <option value="pixicon-erase">&#xe6b9; pixicon-erase</option>
                    <option value="pixicon-blocked">&#xe6ba; pixicon-blocked</option>
                    <option value="pixicon-info">&#xe6bb; pixicon-info</option>
                    <option value="pixicon-help2">&#xe6bc; pixicon-help2</option>
                    <option value="pixicon-cycle">&#xe6bd; pixicon-cycle</option>
                    <option value="pixicon-ccw">&#xe6be; pixicon-ccw</option>
                    <option value="pixicon-shuffle2">&#xe6bf; pixicon-shuffle2</option>
                    <option value="pixicon-arrow">&#xe6c0; pixicon-arrow</option>
                    <option value="pixicon-back">&#xe6c1; pixicon-back</option>
                    <option value="pixicon-switch">&#xe6c2; pixicon-switch</option>
                    <option value="pixicon-list">&#xe6c3; pixicon-list</option>
                    <option value="pixicon-add-to-list">&#xe6c4; pixicon-add-to-list</option>
                    <option value="pixicon-layout2">&#xe6c5; pixicon-layout2</option>
                    <option value="pixicon-list2">&#xe6c6; pixicon-list2</option>
                    <option value="pixicon-text">&#xe6c7; pixicon-text</option>
                    <option value="pixicon-document2">&#xe6c8; pixicon-document2</option>
                    <option value="pixicon-docs">&#xe6c9; pixicon-docs</option>
                    <option value="pixicon-landscape">&#xe6ca; pixicon-landscape</option>
                    <option value="pixicon-download3">&#xe6cb; pixicon-download3</option>
                    <option value="pixicon-disk">&#xe6cc; pixicon-disk</option>
                    <option value="pixicon-install">&#xe6cd; pixicon-install</option>
                    <option value="pixicon-cloud4">&#xe6ce; pixicon-cloud4</option>
                    <option value="pixicon-upload3">&#xe6cf; pixicon-upload3</option>
                    <option value="pixicon-bookmark">&#xe6d0; pixicon-bookmark</option>
                    <option value="pixicon-bookmarks">&#xe6d1; pixicon-bookmarks</option>
                    <option value="pixicon-volume2">&#xe6d2; pixicon-volume2</option>
                    <option value="pixicon-sound2">&#xe6d3; pixicon-sound2</option>
                    <option value="pixicon-mute2">&#xe6d4; pixicon-mute2</option>
                    <option value="pixicon-flow-cascade">&#xe6d5; pixicon-flow-cascade</option>
                    <option value="pixicon-arrow-left2">&#xe6d6; pixicon-arrow-left2</option>
                    <option value="pixicon-cc">&#xe6d7; pixicon-cc</option>
                    <option value="pixicon-cc-by">&#xe6d8; pixicon-cc-by</option>
                    <option value="pixicon-cc-nc">&#xe6d9; pixicon-cc-nc</option>
                    <option value="pixicon-cc-nc-eu">&#xe6da; pixicon-cc-nc-eu</option>
                    <option value="pixicon-cc-nc-jp">&#xe6db; pixicon-cc-nc-jp</option>
                    <option value="pixicon-cc-sa">&#xe6dc; pixicon-cc-sa</option>
                    <option value="pixicon-cc-nd">&#xe6dd; pixicon-cc-nd</option>
                    <option value="pixicon-cc-pd">&#xe6de; pixicon-cc-pd</option>
                    <option value="pixicon-cc-zero">&#xe6df; pixicon-cc-zero</option>
                    <option value="pixicon-github6">&#xe6e0; pixicon-github6</option>
                    <option value="pixicon-github7">&#xe6e1; pixicon-github7</option>
                    <option value="pixicon-flickr5">&#xe6e2; pixicon-flickr5</option>
                    <option value="pixicon-flickr6">&#xe6e3; pixicon-flickr6</option>
                    <option value="pixicon-vimeo4">&#xe6e4; pixicon-vimeo4</option>
                    <option value="pixicon-vimeo5">&#xe6e5; pixicon-vimeo5</option>
                    <option value="pixicon-twitter5">&#xe6e6; pixicon-twitter5</option>
                    <option value="pixicon-twitter6">&#xe6e7; pixicon-twitter6</option>
                    <option value="pixicon-facebook5">&#xe6e8; pixicon-facebook5</option>
                    <option value="pixicon-facebook6">&#xe6e9; pixicon-facebook6</option>
                    <option value="pixicon-facebook7">&#xe6ea; pixicon-facebook7</option>
                    <option value="pixicon-googleplus6">&#xe6eb; pixicon-googleplus6</option>
                    <option value="pixicon-googleplus7">&#xe6ec; pixicon-googleplus7</option>
                    <option value="pixicon-pinterest3">&#xe6ed; pixicon-pinterest3</option>
                    <option value="pixicon-pinterest4">&#xe6ee; pixicon-pinterest4</option>
                    <option value="pixicon-tumblr4">&#xe6ef; pixicon-tumblr4</option>
                    <option value="pixicon-tumblr5">&#xe6f0; pixicon-tumblr5</option>
                    <option value="pixicon-linkedin3">&#xe6f1; pixicon-linkedin3</option>
                    <option value="pixicon-linkedin4">&#xe6f2; pixicon-linkedin4</option>
                    <option value="pixicon-dribbble5">&#xe6f3; pixicon-dribbble5</option>
                    <option value="pixicon-dribbble6">&#xe6f4; pixicon-dribbble6</option>
                    <option value="pixicon-stumbleupon3">&#xe6f5; pixicon-stumbleupon3</option>
                    <option value="pixicon-stumbleupon4">&#xe6f6; pixicon-stumbleupon4</option>
                    <option value="pixicon-lastfm3">&#xe6f7; pixicon-lastfm3</option>
                    <option value="pixicon-lastfm4">&#xe6f8; pixicon-lastfm4</option>
                    <option value="pixicon-rdio">&#xe6f9; pixicon-rdio</option>
                    <option value="pixicon-rdio2">&#xe6fa; pixicon-rdio2</option>
                    <option value="pixicon-spotify">&#xe6fb; pixicon-spotify</option>
                    <option value="pixicon-spotify2">&#xe6fc; pixicon-spotify2</option>
                    <option value="pixicon-qq">&#xe6fd; pixicon-qq</option>
                    <option value="pixicon-instagram2">&#xe6fe; pixicon-instagram2</option>
                    <option value="pixicon-dropbox">&#xe6ff; pixicon-dropbox</option>
                    <option value="pixicon-evernote">&#xe700; pixicon-evernote</option>
                    <option value="pixicon-flattr2">&#xe701; pixicon-flattr2</option>
                    <option value="pixicon-skype2">&#xe702; pixicon-skype2</option>
                    <option value="pixicon-skype3">&#xe703; pixicon-skype3</option>
                    <option value="pixicon-renren">&#xe704; pixicon-renren</option>
                    <option value="pixicon-sina-weibo">&#xe705; pixicon-sina-weibo</option>
                    <option value="pixicon-paypal4">&#xe706; pixicon-paypal4</option>
                    <option value="pixicon-picasa">&#xe707; pixicon-picasa</option>
                    <option value="pixicon-soundcloud3">&#xe708; pixicon-soundcloud3</option>
                    <option value="pixicon-mixi">&#xe709; pixicon-mixi</option>
                    <option value="pixicon-behance">&#xe70a; pixicon-behance</option>
                    <option value="pixicon-circles">&#xe70b; pixicon-circles</option>
                    <option value="pixicon-vk">&#xe70c; pixicon-vk</option>
                    <option value="pixicon-smashing">&#xe70d; pixicon-smashing</option>
                </select>

            </div><!-- /.tab-pane -->

            <!-- /tabs -->
            <div class="tab-pane videoTab" id="video_Tab">

                <label>Youtube video ID:</label>

                <input type="text" class="form-control margin-bottom-20" id="youtubeID"
                       placeholder="Enter a Youtube video ID" value="">

                <p class="text-center or">
                    <span>OR</span>
                </p>

                <label>Vimeo video ID:</label>

                <input type="text" class="form-control margin-bottom-20" id="vimeoID"
                       placeholder="Enter a Vimeo video ID"
                       value="">

            </div><!-- /.tab-pane -->

        </div> <!-- /tab-content -->

        <div class="alert alert-success" style="display: none;" id="detailsAppliedMessage">
            <button class="close" type="button" id="detailsAppliedMessageHide"><i class="pi pixicon-cross"></i></button>
            The changes were applied successfully!
        </div>

        <div class="margin-bottom-5 savebtn_div">
            <button type="button" class="btn btn-primary btn-embossed btn-sm btn-block" id="saveStyling"><i
                        class="pi pixicon-circle-check"></i> Apply Changes
            </button>
        </div>

        <div class="sideButtons clearfix">
            <button type="button" class="btn btn-inverse btn-embossed btn-xs" id="cloneElementButton"><i
                        class="pi pixicon-stack"></i> Clone
            </button>
            <button type="button" class="btn btn-warning btn-embossed btn-xs" id="resetStyleButton"><i
                        class="pi pixicon-repeat"></i> Reset
            </button>
            <button type="button" class="btn btn-danger btn-embossed btn-xs" id="removeElementButton"><i
                        class="pi pixicon-trash"></i> Remove
            </button>
        </div>

        <!--<p class="text-center or">
            <span>OR</span>
        </p>

        <button type="button" class="btn btn-embossed btn-block btn-sm" id="closeStyling"><span class="fui-square-cross-inverted"></span> Close Editor</button>-->

    </div><!-- /.styleEditor -->

    <div id="hidden">
        <iframe src="elements/skeleton.html" id="skeleton"></iframe>
    </div>

    <!-- modals -->


    <div class="modal fade sectionsModal" id="sectionsModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><i class="pi pixicon-cross"></i><span
                                class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-menu"></i> Page Sections</h4>
                </div>
                <div class="modal-body">

                    <div class="table-responsive">
                        <table class="table" id="sections_table">
                            <tr>
                                <th>Section Order</th>
                                <th>Section Name</th>
                                <th></th>
                            </tr>
                            <tr>
                                <td class="warning"></td>
                                <td class="warning">Sections was not loaded!</td>
                                <td class="warning"></td>
                            </tr>
                        </table>
                    </div>


                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><span class="fui-cross"></span>
                        Close
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>


    <div class="modal fade cssModal" id="cssModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><i class="pi pixicon-cross"></i><span
                                class="sr-only">Close</span></button>
                    <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-css3"></i> Page Custom CSS</h4>
                </div>
                <div class="modal-body">
                    <label>You can input the custom CSS here (without style tag).</label>
                    <div id="cssToEdit"></div>
                    <!-- <textarea style="width:100%;max-width:100%;min-height:300px;" class="form-control" id="cssToEdit2">body *{background: #000 !important;}</textarea> -->

                    <!-- <button type="button" class="btn btn-embossed" id="firas2"><span class="fui-check"></span> shit</button> -->
                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><span class="fui-cross"></span>
                        Close
                    </button>
                    <button type="button" class="btn btn-embossed" data-dismiss="modal" id="css_save"><span
                                class="fui-check"></span> Save
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>


    <div class="modal fade seoModal" id="seoModal" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog modal-lg">

            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">
                        <i class="pi pixicon-cross"></i>
                        <span class="sr-only">Close</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-cog"></i> SEO Settings for <span
                                id="pix_seo_title" class="text-primary pName">index.html</span></h4>
                </div>

                <div class="modal-body">


                    <div class="modal-alerts"></div>

                    <form class="form-horizontal" role="form" id="pageSettingsForm" action="">

                        <input type="hidden" name="siteID" id="siteID" value="1">
                        <input type="hidden" name="pageID" id="pageID" value="25">
                        <input type="hidden" name="pageName" id="pageName" value="">

                        <div class="optionPane">

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label">Page Title:</label>
                                <div class="col-sm-12">
                                    <input type="text" class="form-control" id="pageData_title" name="pageData_title"
                                           placeholder="Page title" value="">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label pix_seo_label">Page Meta
                                    Description:</label>
                                <div class="col-sm-12">
                                <textarea class="form-control" id="pageData_metaDescription"
                                          name="pageData_metaDescription"
                                          placeholder="Page meta description"></textarea>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label">Page Meta
                                    Keywords:</label>
                                <div class="col-sm-12">
                                <textarea class="form-control" id="pageData_metaKeywords" name="pageData_metaKeywords"
                                          placeholder="Page meta keywords"></textarea>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label">Header Includes:</label>
                                <div class="col-sm-12">
                                <textarea class="form-control" id="pageData_headerIncludes"
                                          name="pageData_headerIncludes" rows="5"
                                          placeholder="Additional code you'd like to include in the <head> section"></textarea>
                                </div>
                            </div>

                        </div><!-- /.optionPane -->

                    </form>
                </div><!-- /.modal-body -->

                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><i class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary btn-embossed" data-dismiss="modal"
                            id="seoSubmittButton"><i
                                class="pi pixicon-check"></i> Save SEO Settings
                    </button>


                </div>

            </div><!-- /.modal-content -->

        </div><!-- /.modal-dialog -->

    </div>

    <div class="modal fade seoModal" id="sourceModal" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog modal-lg">

            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">
                        <i class="pi pixicon-cross"></i>
                        <span class="sr-only">Close</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-cog"></i>Source code</h4>
                </div>

                <div class="modal-body">


                    <div class="modal-alerts"></div>

                    <form class="form-horizontal" role="form" id="pageSettingsCodeForm" action="">

                        <input type="hidden" name="siteID" id="siteID" value="1">
                        <input type="hidden" name="pageID" id="pageID" value="25">
                        <input type="hidden" name="pageName" id="pageName" value="">

                        <div class="optionPane">

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label">Source code first body
                                    includes:</label>
                                <div class="col-sm-12">
                                <textarea class="form-control" id="source_first_body"
                                          name="source_first_body" rows="5"
                                          placeholder="Additional code you'd like to include in the first of <body> section"></textarea>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="name" class="col-sm-8 control-label pix_seo_label">Source code last body
                                    includes:</label>
                                <div class="col-sm-12">
                                <textarea class="form-control" id="source_last_body"
                                          name="source_last_body" rows="5"
                                          placeholder="Additional code you'd like to include in the last of <body> section"></textarea>
                                </div>
                            </div>

                        </div><!-- /.optionPane -->

                    </form>
                </div><!-- /.modal-body -->

                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><i class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary btn-embossed" data-dismiss="modal"
                            id="sourceSubmitButton"><i
                                class="pi pixicon-check"></i> Save Source Code
                    </button>


                </div>

            </div><!-- /.modal-content -->

        </div><!-- /.modal-dialog -->

    </div>


    <!-- export HTML popup -->
    <div class="modal fade" id="exportModal" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog modal-lg bigModal">
            <form class="form-horizontal">
                <input type="hidden" name="landing_page_id" id="landing_page_id"
                       value="{{$landingpage && $landingpage->id ? $landingpage->id : ''}}">
                <input type="hidden" name="markup" value="" id="markupField">

                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="pi pixicon-cross"></i>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-download"></i> Xuất landing page
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <br>
                            <div class="form-group">
                                <label for="link_landing_page" class="col-sm-8 control-label pix_seo_label"
                                       style="display: flex!important;"> Lưu tại địa chỉ:
                                    <star style="color: red;">*</star>&nbsp;
                                    <div id="domain-landing-page"></div>
                                    /landing-page/
                                </label>
                                <div class="col-sm-12">

                                    <input type="text" class="form-control" name="link_landing_page" id="doctype"
                                           placeholder="Nhập link(Không dấu, không khoảng trắng và kí tự đặc biệt)"
                                           value="{{$landingpage && $landingpage->path ? $landingpage->path : ''}}">
                                </div>
                            </div>
                        </div>
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-embossed" data-dismiss="modal" id="exportCancel"><i
                                    class="pi pixicon-cross"></i> Thoát
                        </button>
                        <button type="button" class="btn btn-primary btn-embossed" id="exportSubmit"><i
                                    class="pi pixicon-download"></i> Xuất
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </form>
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal --><!-- export HTML popup -->

    <div class="modal fade" id="saveModal" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog modal-lg bigModal">
            <form class="form-horizontal">
                <input type="hidden" name="markup" value="" id="markupField">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="pi pixicon-cross"></i>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-square-check"></i>Lưu landing
                            page
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <br>
                            <div class="form-group">
                                <label for="link_landing_page" class="col-sm-8 control-label pix_seo_label"
                                       style="display: flex!important;">Tên landing page:
                                    <star style="color: red;">*</star>
                                </label>
                                <div class="col-sm-12">
                                    <input type="text" class="form-control" name="name" id="landingpage_name"
                                           placeholder="Nhập tên của landing page"
                                           value="{{$landingpage && $landingpage->name ? $landingpage->name : ''}}">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-8 control-label pix_seo_label"
                                     style="display: flex!important;"> Lưu tại địa chỉ: &nbsp;
                                    <a id="domain-landing-page-save" href="{{
                                    $landingpage && $landingpage->path ? config("app.protocol").config("app.domain").'/landing-page/'.$landingpage->path : ''
                                    }}">{{
                                    $landingpage && $landingpage->path ? config("app.protocol").config("app.domain").'/landing-page/'.$landingpage->path : ''
                                    }}</a>
                                </div>
                            </div>
                        </div>
                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-embossed" data-dismiss="modal"><i
                                    class="pi pixicon-cross"></i> Thoát
                        </button>
                        <button type="button" class="btn btn-primary btn-embossed" id="savePageModal"><i
                                    class="pi pixicon-square-check"></i> Lưu
                        </button>
                    </div>
                </div><!-- /.modal-content -->
            </form>
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->


    <!-- export HTML success popup -->
    <div class="modal fade" id="exportModalSuccess" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog modal-lg">
            <div class="pix_form_export form-horizontal">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="pi pixicon-cross"></i>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-outbox"></i> Xuất landing page
                            thành
                            công</h4>
                    </div>
                    <div class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-embossed" data-dismiss="modal" id="exportCancel"><i
                                    class="pi pixicon-cross"></i> Thoát
                        </button>
                        <a type="button" class="btn btn-primary btn-embossed" id="open-link-landingpage"
                           target="_blank"><i
                                    class="pi pixicon-outbox"></i> Mở link
                        </a>
                    </div>
                </div><!-- /.modal-content -->
            </div>
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal --><!-- export HTML popup -->

    <div class="modal fade" id="previewModal" tabindex="-1" role="dialog" aria-hidden="true">

        <form action="preview.php" target="_blank" id="markupPreviewForm" method="post" class="form-horizontal">

            <input type="hidden" name="markup" value="" id="markupField">


            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="pi pixicon-cross"></i>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel"><i class="pi pixicon-eye"></i> Preview Page</h4>
                    </div>
                    <div class="modal-body">

                        <p>
                            <b class="white_text">Please note:</b> you can only preview a single page; links to other
                            pages
                            won't work. When you make changes to your page, reloading the preview won't work, instead
                            you'll
                            have to use the "Preview" button again.
                        </p>
                        <input type="checkbox" name="fast_preview" value="" id="pixcheck"><span
                                class="preview_remember"> Don't show this again. </span><br>

                    </div><!-- /.modal-body -->
                    <div class="modal-footer">
                        <button type="button" class="btn  btn-embossed" data-dismiss="modal" id="previewCancel"><i
                                    class="pi pixicon-cross"></i> Cancel
                        </button>
                        <button type="submit" type="button" class="btn btn-embossed btn-blue" id="showPreview"><i
                                    class="pi pixicon-eye"></i> Show Preview
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->

        </form>

    </div><!-- /.modal -->


    <!-- delete single block popup -->
    <div class="modal fade small-modal" id="deleteBlock" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    Are you sure you want to delete this block?

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn  btn-embossed" data-dismiss="modal"><i
                                class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="deleteBlockConfirm"><i
                                class="pi pixicon-trash"></i> Delete
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->


    <!-- reset block popup -->
    <div class="modal fade small-modal" id="resetBlock" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    <p>
                        Are you sure you want to reset this block?
                    </p>
                    <p>
                        All changes made to the content will be destroyed.
                    </p>

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><i class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="resetBlockConfirm">
                        Reset
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->


    <!-- delete all blocks popup -->
    <div class="modal fade small-modal" id="deleteAll" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    <span class="pix_warning">Are you sure you want to remove this page?</span>

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><i class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="deleteAllConfirm"><i
                                class="pi pixicon-trash"></i> Delete
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->

    <!-- delete page popup -->
    <div class="modal fade small-modal" id="deletePage" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    Are you sure you want to delete this entire page?

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal" id="deletePageCancel"><i
                                class="pi pixicon-cross"></i> Cancel
                    </button>
                    <a href="google.com" id="123ds" onclick="window.open('google.com','_blank')"></a>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="deletePageConfirm"><i
                                class="pi pixicon-trash"></i> Delete
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->

    <!-- delete elemnent popup -->
    <div class="modal fade small-modal" id="deleteElement" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    Are you sure you want to delete this element? Once deleted, it can not be restored.

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal" id="deletePageCancel"><i
                                class="pi pixicon-cross"></i> Cancel
                    </button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed" id="deleteElementConfirm">
                        Delete
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->


    <!-- edit content popup -->
    <div class="modal fade" id="editContentModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">

                    <textarea id="contentToEdit"></textarea>

                </div><!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-embossed" data-dismiss="modal"><i class="pi pixicon-cross"></i>
                        Cancel
                    </button>
                    <button type="button" type="button" class="btn btn-primary btn-embossed"
                            id="updateContentInFrameSubmit">Save Content
                    </button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->

    </div><!-- /.modal -->


@stop