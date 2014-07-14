/**
 * Created by darulebreaker on 7/11/14.
 */
/**
 * Created by darulebreaker on 7/11/14.
 */





function list(title, element, values) {
    var newHTML = [];
    newHTML.push("<h3>" + title + "</h3>")
    newHTML.push("<ul>");
    $.each(values, function (index, value) {
        newHTML.push('<li>' + value + '</li>');
    });
    newHTML.push("</ul>");
    $(element).html(newHTML.join(""));
}


//This function will find the key for the current Image
function currentImageKey() {
    i = jQuery.inArray($('#slideshow').attr('src'), images);
    return i;
}


//This function will move the slideshow forward one
function forwardImage() {
    currentImageKey();
    if (i < images.length - 1) {
        changeImage(i + 1);
    } else {
        changeImage(0);
    }
}


//This function will change to image to whatever the variable i passes to it
function changeImage(i) {
    $('#slideshow').stop().animate({
        opacity: 0,
    }, 200, function () {
        $('#slideshow').attr('src', images[i]);
        $('#holder img').load(function () {
            $('#slideshow').stop().animate({
                opacity: 1,
            }, 200)
        })
    })
}


var images;
$(document).ready(function () {
    var socket = io.connect(host);
    socket.on('news', function (data) {
        console.log(JSON.stringify(data));
        $('#blockquote').text(data.result.blockquote);

        images = data.result.gallery;
        var newHTML = [];
        newHTML.push("<Div id='holder'>");
        newHTML.push("<img src=" + images[0] + " id='slideshow' /> </Div>");
        $("#gallery").html(newHTML.join(""));
        console.log(data.result.address);
        console.log(data.result.currentPrice);
        setInterval(forwardImage, 4000);
        //list("Gallery", "#gallery", data.result.gallery)
        $('#address h4').text(data.result.address);
        $('#currentPrice h4').text(data.result.currentPrice);
        list("Amenities:", "#amenities", data.result.amenities)
        // $('#price').text(+);
        list("Info:", "#listing_vitals", data.result.vitals)
        list("Building:", "#building", data.result.building)
        list("Transportation", "#transportation", data.result.transportation)
        list("Schools", "#schools", data.result.schools)
        // $('#item_rows').text(data.result.price);
        // $('#amenities').text(data.result.amenities);
        // $('#building').text(data.result.building);
        // $('#transportation').text(data.result.transportation);
        // $('#schools').text(data.result.schools);
    });
    //console.log("here")
    $('a[data-toggle=modal]').click(function () {

        var data_id = '';

        if (typeof $(this).data('id') !== 'undefined') {

            data_id = $(this).data('id');
            console.log(data_id)
        }
        //console.log("print_something", data_id)
        $('.modal-title').text(data_id);

        socket.emit('getInfo', { url: data_id })

    })
});