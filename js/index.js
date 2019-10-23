$(document).ready(function () {
    // $(".full-form").hide()
    $("input[id='CUSTOMER.CUSTOMERID']").focus(function () {
        $(".full-form").slideDown();
    });
    $("#bookButton").focus(function () {
        $(".full-form").slideDown();
    });
});

function initialize() {
    var input1 = document.getElementById('PICKUP.searchTextField');
    var input2 = document.getElementById('DROPOFF.searchTextField');
    new google.maps.places.Autocomplete(input1);
    new google.maps.places.Autocomplete(input2);
}

var geocoder = new google.maps.Geocoder();
google.maps.event.addDomListener(window, 'load', initialize);


function fetchAddress(addressType) {
    var address = document.getElementById(addressType + '.searchTextField').value;
    if (address != "") {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                console.log(results[0])
                length = results[0].address_components.length
                if (length >= 7) {
                    i = 0
                    if (length == 8) {
                        i = 1
                    }
                    street = results[0].address_components[i].long_name + " " + results[0].address_components[i + 1].short_name
                    lat = results[0].geometry.location.lat()
                    lng = results[0].geometry.location.lng()
                    city = results[0].address_components[i + 2].long_name
                    state = results[0].address_components[i + 4].long_name
                    country = results[0].address_components[i + 5].long_name
                    postalCode = results[0].address_components[i + 6].long_name
                    document.getElementById(addressType + '.LATITUDE').value = lat
                    document.getElementById(addressType + '.LONGITUDE').value = lng
                    document.getElementById(addressType + '.CITY').value = city
                    document.getElementById(addressType + '.STREET').value = street
                    document.getElementById(addressType + '.POSTALCODE').value = postalCode
                    document.getElementById(addressType + '.COUNTRY').value = country
                    document.getElementById(addressType + '.STATE').value = state
                }
                else {
                    alert("please enter address with street")
                    document.getElementById(addressType + '.searchTextField').value = ""
                }
            } else {
                alert("error in fetching address")
            }
        });
    } else {

    }
}
function ConvertFormToJSON(form) {
    var array = jQuery(form).serializeArray();
    var json = {};
    jQuery.each(array, function () {
        json[this.name] = this.value || '';
    });
    var date = "/Date(" + Date.now() + ")/";
    json["HISTORY.CREATEDAT"] = date;
    json.JOBHID = ""
    delete json["DROPOFF.LOCATION"]
    delete json["PICKUP.LOCATION"]
    delete json["name"]
    delete json["email"]
    delete json["Contact"]
    console.log(json);
    console.log(JSON.stringify(json));
    return JSON.stringify(json);
}
// instanciate new modal
var modal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function () {
        console.log('modal open');
    },
    onClose: function () {
        console.log('modal closed');
    },
    beforeClose: function () {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
        return false; // nothing happens
    }
});

function sendEnquiry() {
    // However to make it work, we are going to use the cors-anywhere free service to bypass this
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    $.ajax({
        "async": true,
        crossDomain: true,
        "url": proxy + "https://audb01c77f3e83a.ap1.hana.ondemand.com/pilot/xsodata/pilot.xsodata/Enquiry",
        "method": "POST",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic UElMT1REQlVTUjAxOlBpbG90c2NwQGRidXNyMDE=",
            "cache-control": "no-cache",
            "Access-Control-Allow-Origin": "*"
        },
        success: function (msg) {
            console.log(msg);
            // alert("Your enquiry has been recieved and your customer id is " + msg.d.JOBHID)

            // set content
            modal.setContent('<h4>Your enquiry has been submitted.</h4><p>Your JOB-ID is ' + msg.d.JOBHID + ' </p>');
            //open modal
            modal.open();
        },
        error: function (err) {
            alert("fail");
        },
        "processData": false,
        "data": ConvertFormToJSON($("#email-form"))
    }).done(function (response) {
        console.log(response);
    });

}
$("#email-form").on("submit", function (e) {

    e.preventDefault();

});

function sendEmail() {
    alert("hello")
    var addresses = "";//between the speech mark goes the receptient. Seperate addresses with a ;
    var body = ""//write the message text between the speech marks or put a variable in the place of the speech marks
    var subject = ""//between the speech marks goes the subject of the message
    var href = "mailto:" + addresses + "?"
        + "subject=" + subject + "&"
        + "body=" + body;
    window.open('mailto:test@example.com?subject=subject&body=body');
}