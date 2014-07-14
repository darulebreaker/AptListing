/**
 * Created by darulebreaker on 7/11/14.
 */
function sortlist(){

    var cl = document.getElementById('area_select');
    var clTexts = new Array();

    for(i = 2; i < cl.length; i++){
        clTexts[i-2] =
            cl.options[i].text.toUpperCase() + "," +
                cl.options[i].text + "," +
                cl.options[i].value;
    }

    clTexts.sort();

    for(i = 2; i < cl.length; i++){
        var parts = clTexts[i-2].split(',');

        cl.options[i].text = parts[1];
        cl.options[i].value = parts[2];
    }
}

sortlist();
