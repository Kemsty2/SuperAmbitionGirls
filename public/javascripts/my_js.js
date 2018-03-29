/**
 * Created by LeKemsty on 15/03/2018.
 */
$(document).ready(function(){
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/iplastic");
    editor.session.setMode("ace/mode/html");

    editor.getSession().setTabSize(5);
    editor.setFontSize(14);
    editor.setValue($('#contenu1').val(), -1);
    var source_code = editor.getValue();

    editor.getSession().on('change', function(){
        updateContent();
    });

    editor.session.getSelection().clearSelection();
    function updateContent(){
        source_code = editor.getValue();
    }
    $('#btn-new-article').on('click', function () {
        var checkbox = document.getElementById('specialcheck');
        if(checkbox.checked){
            document.getElementById('special').value = 'special';
        }
        $('#contenu1').val(source_code);
    });
    $('#type').val($('#typeselect').val());
});
