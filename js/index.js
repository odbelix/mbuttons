$(document).ready(function(){
      document.addEventListener('deviceready', onDeviceReady, false);
});
function onDeviceReady(){
  var parentElement = document.getElementById('deviceready');
  var listeningElement = parentElement.querySelector('.listening');
  var receivedElement = parentElement.querySelector('.received');
  listeningElement.setAttribute('style', 'display:none;');
  receivedElement.setAttribute('style', 'display:block;');
}

function getQuestion() {
  $("#message").empty();
  var code = document.getElementById('classroomcode');
  var url = "http://192.168.0.20/button/web/app_dev.php/api/v1/classroom/CODE/question/get"
  url = url.replace("CODE",code.value)
  $.ajax(url,{
    statusCode: {
       204: function() {
         $("#message").empty();
         $("#message").append('<p>Código de Sala Invalido</p>');
         $("#message").show();
       },
       200: function(data) {
         var content = $("#questioncontent");
         content.empty();
         content.append("<h3>"+data['title']+"</h3>");
         if (data['detail'].length > 0) {
            content.append("<p>"+data['detail']+"<p>");
         }
         //var options = document.createElement("ul");
         content.append("<h5>Las opciones son Opciones:</h5>");
         var options = $('<ul id="options" data-role="listview" class="ui-listview"></ul>');
         data['options'].forEach(function(entry) {
            var node = $('<li onclick="selectResponse(this);" question="'+data['id']+'" option="'+data['id']+'" user="4" iscorrect="'+entry['iscorrect']+'">'+entry['detail']+'</li>');
            //node.appendChild(textnode);
            options.append(node);
         });
         content.append(options);
         content.append("<hr>");
         content.enhanceWithin();
         $("#sendbutton").show();
         $("#codeform").hide();
       }
    }
  });
}

function selectResponse(option){
  $("#message").empty();
  var varclass = option.getAttribute("class");
  $("#options li").removeClass('active-option');
  varclass = varclass + " " + "active-option";
  option.setAttribute("class",varclass);
  $("#question").val(option.getAttribute("question"))
  $("#option").val(option.getAttribute("option"));
  $("#user").val(option.getAttribute("user"));
  $("#iscorrect").val(option.getAttribute("iscorrect"));
}

function submitAnswer() {
  $("#message").empty();
  if($("#question").val().length == 0) {
      $("#message").append('<p>Debes seleccionar una respuesta</p>');
      $("#message").show();
      return;
  }
  var url = "http://192.168.0.20/button/web/app_dev.php/api/v1/answer/question/{QUESTION}/option/{OPTION}/user/{USER}/answer/{ISCORRECT}";
  url = url.replace("{QUESTION}",$("#question").val());
  url = url.replace("{OPTION}",$("#option").val());
  url = url.replace("{USER}",$("#user").val());
  if ($("#iscorrect").val() == "false")
    url = url.replace("{ISCORRECT}",0);
  else
    url = url.replace("{ISCORRECT}",1);

  $.post( url )
  .done(function( data ) {
    $("#message").append('<p>Tu respuesta fue enviada satisfactoriamente.</p>');
    $("#message").show();
    $("#questioncontent").empty();
    $("#codeform").show();
    $("#sendbutton").hide();
  })
  .fail(function() {
    $("#message").empty();
    $("#message").append('<p>Error al enviar tu respuesta, vuelve a intentar</p>');
    $("#message").show();
  });

}
