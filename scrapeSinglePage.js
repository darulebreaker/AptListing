/**
 * Created by darulebreaker on 6/21/14.
 */
var street = require('./street')
    , cheerio = require("cheerio")
    ,dataEmitter= require("./EventManager").dataEmitter;

//var query = "http://streeteasy.com/building/304-west-76-street-manhattan/3d?featured=1"
var scrape = function (query) {
    street.download(query.query, function (data) {
        if (data) {

            var $ = cheerio.load(data);
            var address;
            var currentPrice;
            var blockquote;
            var gallery = new Array();
            var amenities = new Array();
            var building = new Array();
            var vitals = new Array();
            var price = new Array();
            var transportation = new Array();
            var schools= new Array();



            $('.incognito').each(function(){
                address=$(this).text();
            });

            $('.price').each(function(){
                currentPrice=$(this).text();
            });


            $('blockquote').each(function(){
                blockquote=$(this).text();
            });


            //Image path
            $('.gallery_large_wrapper').each(function () {
                try {

                   // console.log($(this).find("img").attr('src'));
                    gallery.push($(this).find("img").attr('src'));
                }
                catch (err) {
                    console.log(err)
                }
            });


            //Amenity
            $('.amenities ul li').each(function () {
                try {
                    //console.log($(this).find("ul").text().trim())
                    amenities.push($(this).text().trim())
                }
                catch (err) {
                    console.log(err)
                }
            });
            console.log(amenities);
            //Building
            $('.in_this_building .details_info').each(function () {
                try {

                   // console.log($(this).text().trim())
                    var txt=$(this).text().trim();
                    if(txt.indexOf("google")==-1)
                       building.push(txt)
                }
                catch (err) {
                    console.log(err)
                }
            });

            //Listing Vitals
            $('#listing_vitals .details_info').each(function () {
                try {

                    var txt=$(this).text().trim();
                    if(txt.indexOf("google")==-1)
                     vitals.push(txt);
                }
                catch (err) {
                    console.log(err)
                }
            });

            //Listed at
            $('.item_rows').each(function () {
                try {
                    //item_rows.push($(this).text().trim());
                    //console.log($(this).text().trim())
                }
                catch (err) {
                    console.log(err)
                }
            });

            //price_info
            $('.price_info tr').each(function () {
                try {
                    price.push($(this).text().trim());
                    //console.log($(this).text().trim())
                }
                catch (err) {
                    console.log(err)
                }
            });


            //Nearby Transportation
            $(".transportation p").each(function () {
                try {

                    //console.log($(this).find('p').text().trim());
                    transportation.push($(this).text().trim());
                }
                catch (err) {
                    console.log(err)
                }
            });


            //Nearby schools
            $(".schools p").each(function () {
                try {

                   // console.log($(this).find('p').text().trim());
                    schools.push($(this).text().trim());
                }
                catch (err) {
                    console.log(err)
                }
            });

            dataEmitter.emit("gotData",
            { 'id': query.id,
             'currentPrice':currentPrice,
             'address': address,
             'blockquote': blockquote,
             'gallery' : gallery,
            'amenities' :amenities,
            'building' :building,
            'vitals' :vitals,
            'price':price,
            'transportation':transportation,
            'schools':schools});

        }


    });

}
exports.scrape=scrape;