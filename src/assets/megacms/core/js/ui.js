$(document).ready(function(e){
    $("body").prepend('<div id="megacms_navigation"><div id="megacms_noticebar"><img id="megacms_close" src="/megacms/core/style/icons/close.svg"/></div></div>');
    $("#megacms_close").click(function(){
        MEGA_close_noticebar($("#megacms_noticebar"),true);
    });
});

//handles ajax requests
//input: target url, data to transfer, callback function [,true if syncr]
//return: - callback with retrieved data, original data and url
function MEGA_ajax(url,data,command,asyncr = true){
  $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: asyncr,
    success: function(e) {
        if(megacms_error_handler(e)==true){
            command(e,data,url);
        }
    },
    error: function(xhr, textStatus, errorThrown){
        megacms_noticebar_func(textStatus);
        return false;
    }
  });
}

//sets language array (callback for ajax function)
//input: data from server
//return: language array
function MEGA_language(data){
  MEGA_lang = data.lang;
  MEGA_set = data.set;
}

//loads language
MEGA_ajax('/megacms/core/inc/lang.php','',MEGA_language,false);

//closes noticebar entries and complete noticebar if empty
//input: element to close, all=true if to close completely
//return: -
function MEGA_close_noticebar(elem,all){
  $(elem).slideUp(700,function(){
    if(all != true){
        $(elem).remove();
    }
    if($("#megacms_noticebar div").length == 0 || all == true){
      $("#megacms_noticebar").slideUp(100,function(){
        var save = $("#megacms_noticebar img").detach();
        $("#megacms_noticebar").empty().append(save);
      });
    }
  });
}

//opens new noticebar element + set timeout
//input: type of message, content
//return: -
function megacms_noticebar_func(token,message){
    console.log(token);
    $('.MEGA_load').removeClass("MEGA_load");
    var message_return;
    switch (token) {
      case "standard":
        message_return = MEGA_lang.ERR + message;
        break;
      case "parsererror":
      case "server_error":
        message_return = MEGA_lang.ERR_UNKN;
        break;
      case "error":
      case "timeout":
        message_return = MEGA_lang.ERR_AUTH_NET;
        break;
      default:
        message_return = MEGA_lang.ERR_UNKN;
    }

    $("#megacms_noticebar").slideDown(50,"swing");
    var new_elem = $("<div></div>").text(message_return);
    $("#megacms_noticebar").append(new_elem);
    $(new_elem).slideDown(1000,"swing");

    window.setTimeout(function (){
      MEGA_close_noticebar(new_elem);
    },8000);
}

//checks if errors occurred
//input: retrieved ajax object
//return: true if no error
function megacms_error_handler(e){
    console.log(e);
    if (e.error.status !=true){
        megacms_noticebar_func('standard',e.error.message);
        return false;
    }else{
        return true;
    }
}

//toggles accordion slider
//input: element to toggle
//return: -
function MEGA_folder_toggle(elem){
  $(elem).click(function(){
      var e = this;
      var hidden = $(e).next().is(":hidden")
      $(e).next().slideToggle(400,"swing",function(){
        if(!hidden){
            $(e).removeClass("MEGA_folder_active");
        }else{
            $(e).addClass("MEGA_folder_active");
        }
      });

  });
}

//appends options window and floating panel
//input: callback for save and cancel action
//return: -
function MEGA_actionwindow(cb_save,cb_exit){
  //Navigation erstellen
  $('#megacms_navigation').append('<div id="megacms_window_wrapper"></div><div id="megacms_popup"><a id="megacms_closepopup"><img src="/megacms/core/style/icons/closeblack.svg"/></a><h1>'+MEGA_lang.ED_PROP+'</h1><div></div></div>');       //fehler, weil megacms_markup aufgerufen wird
  $("body").prepend('<div id="megacms_functions"><button class="MEGA_panel_drag"></button><div id="megacms_functions_submit"><div id="megacms_functions_submit_save" title="'+MEGA_lang.FORM_SAVE+'">'+MEGA_lang.FORM_OK+'</div><div id="megacms_functions_submit_cancel" title="'+MEGA_lang.FORM_DISM_DESC+'"><img src="/megacms/core/style/icons/closeblack.svg" alt="'+MEGA_lang.FORM_DISM+'" /></div></div><div id="megacms_buttons"></div></div>');
  $('#megacms_functions_submit_save').click(cb_save);
  $('#megacms_functions_submit_cancel').click(cb_exit);
  $("#megacms_functions").draggable({
      cancel: false,
      handle: ".MEGA_panel_drag"
    });
  $("#megacms_closepopup, #megacms_window_wrapper").click(function(){
      megacms_closewindow();
  });
}

//checks user device
//input: -
//return: -
function MEGA_check_device(){
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

//closes options window
//input: -
//return: -
function megacms_closewindow(){
    $("#megacms_popup, #megacms_window_wrapper").css("display","none");
    $("#megacms_popup div").html("");
}

//inserts file selector form into options windows
//input: type of files to select image/media/file, callback for submission
//return: - callback
//callback gets variables for options (custom variable) and another callback with array of elements as parameter - elements in format {id: value}, value displayed
function MEGA_window(opt, callback){
    var options = [];
    if(Array.isArray(opt)){
        var options = opt.reverse();
    }else{
        options.push(opt);
    }

    $("#megacms_popup, #megacms_window_wrapper").css("display","block");

    //create form
    $("#megacms_popup>div").append('<form class="megacms_form_attr MEGA_form" method="post" action="" enctype="multipart/form-data"><input type=\'submit\' value=\''+MEGA_lang.FORM_OK+'\'/></form>')

    //attr-form submit
    $(".megacms_form_attr").submit(function(e){
        e.preventDefault();
        var attr = {};

        $(".megacms_form_attr input[type='radio']:checked, .megacms_form_attr input:not([type='submit'],[type='radio'])").each(function (i){
            attr[$(this).attr("name")] = $(this).val();
        });
        callback(attr);
        /*attr["command"] = filetype;
        if(typeof attr.img == "undefined" && typeof attr.src == "undefined"){
            megacms_closewindow();
        }else{
          switch(attr.command){
              case "image":
                callback(attr.img, {alt: attr.text});
                break;
              case "media":
                callback(attr.src, {source2: attr.src2, poster: attr.img});
                break;
              case "file":
                callback(attr.src, {text: attr.text});
                break;
              default:
          }*/
          megacms_closewindow();
    });

    //iterates over input objects
    options.forEach(function(val){
        var ref = $("<fieldset><legend>" + val.desc + "</legend></fieldset>");
        $(".megacms_form_attr").prepend(ref);
        if(val.hasOwnProperty("cb")){
            val.cb(val.opt, function(cont){
                form_components(cont, val.type, ref, val.id);
            });
        }else{
            if(!val.hasOwnProperty("val")){
                values = "";
            }
            form_components(values, val.type, ref, val.id);
        }

    });

    //creates components in the fieldset elements
    //input: array of elements from callback function, form component type, reference to fieldset element
    function form_components(cont, type, ref, id){
        switch(type){
            case "list":
                $.each(cont, function(index, value){
                    var list = $("<div></div>");
                    $(ref).append(list);
                    var inp_container = $('<div></div>');
                    $("<input />",{
                        "name":id,
                        "type":"radio",
                        "value":index,
                        "data-cmsname":"list",
                        "id": "MEGA_formid_" + index,
                        appendTo: inp_container
                    });
                    var label = $("<label></label>",{
                        "for": "MEGA_formid_" + index
                    });
                    $(label).text(value);
                    $(inp_container).append(label);

                    $(list).append(inp_container);

                });
                break;
            case "text":
                $(ref).append('<input type="text" data-cmsname="text" placeholder="'+MEGA_lang.FORM_DESC+'"/>');
                break;
            case "thumbnails":
                $(ref).addClass("megacms_form_image");
                $.each(cont,function(index,value){
                    var imageradio = $("<div></div>");
                    $(ref).append(imageradio);
                    var input = $("<input />",{
                                "name":id,
                                "type":"radio",
                                "value":index,
                                //"data-cmsname":"img",
                                "id":index,
                                appendTo: imageradio
                            });
                    var label = $("<label></label>",{
                                "for":index,
                                appendTo: imageradio
                            });

                    $(label).append('<img src="' + value + '_thumb.' + value.substr(value.length - 3) +'"/>');
                });
                break;
            default:
        }

    }

}

//displays labels
//input: container element, e.g. mce editor element, settings
//example settings: array({
//  selector: jQuery selector (required),
//  class: additional class for labels
//  features: array([url to button, function])
//  init: initial function(container element)
//})
//return: container element
function MEGA_highlightarea(e, labels){
  $(e).find(".MEGA_label").remove();
  function set_handler(func, elem, button){
    $(button).click(function(){
        func($(elem));
    });
  }
  labels.forEach(function(item, index){
    var objects = $(e).parent().find(item.selector);
    objects.each(function(){
      //labels
      if(item.hasOwnProperty('features')){
        var appendto = this;

        //relative for label position
        if($(appendto).css("position") == "static"){
            $(appendto).css("position", "relative"); /////////needs removed when saving
        }

        //check if label already exists
        var par = $(appendto).children(".MEGA_label");
        var label = $.grep(par, function(e){
          return e.cmsref == this;
        })[0];
        if(typeof label == 'undefined'){
          var label = $("<div class='MEGA_label MEGA_elem mceNonEditable' contenteditable='false'></div>");
          label[0].cmsref = this;
        }

        //add buttons to label
        var elem = this;
        $(label).addClass(item.class);
        item.features.forEach(function(btn){
          if($(label).find("[src='" + btn[0] +"']").length == 0){
            var button = $("<a class='MEGA_elem'><img class='MEGA_elem' src='" + btn[0] + "' /></a>");
            if(typeof btn[1] == "string"){
              $(button).addClass(btn[1]);
            }else{
              set_handler(btn[1], elem, button);
            }
            $(label).prepend(button);
          }
        });
        $(appendto).append(label);
      }
      //init function
      if(item.hasOwnProperty('init')){
        item.init(elem);
      }
    });
  });
  return e;
}
