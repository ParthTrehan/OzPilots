; (function ($) {
    $.fn.datepicker.language['en'] = {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
        dateFormat: 'mm/dd/yyyy',
        timeFormat: 'hh:ii aa',
        firstDay: 0
    };
})(jQuery);

// Check for the File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('Permit').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}
function handleFileSelect(evt) {
    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            //Converting Binary Data to base 64
            var base64String = window.btoa(binaryData);
            //showing file converted to base64
            document.getElementById('fileContent').value = base64String;
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $("#submitText").hide();
        $("#loader").show();
    }).ajaxStop(function () {
        $("#submitText").show();
        $("#loader").hide();
    });
});

$(document).ready(function () {
    //DOM manipulation code

    pickDate = document.getElementById('PICKUP.DATE');
    dropDate = document.getElementById('DROPOFF.DATE');

    $(pickDate).datepicker({
        language: 'en',
        minDate: new Date() // Now can select only dates, which goes after today
    });
    $(dropDate).datepicker({
        language: 'en',
        minDate: new Date() // Now can select only dates, which goes after today
    });
});

var geocoder = new google.maps.Geocoder();
google.maps.event.addDomListener(window, 'load', initialize);
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Basic U1lTVEVNOklua2l0c2NwQGF1ZGIwNA==",
    "cache-control": "no-cache",
    "Access-Control-Allow-Origin": "*"
}

function initialize() {
    var input1 = document.getElementById('PICKUP.searchTextField');
    var input2 = document.getElementById('DROPOFF.searchTextField');
    new google.maps.places.Autocomplete(input1);
    new google.maps.places.Autocomplete(input2);
}


function fetchAddress(addressType) {
    var address = document.getElementById(addressType + '.searchTextField').value;
    if (address != "" && address.length > 5) {
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
                } else {
                    alert("please enter address with Street and Street Number")
                    document.getElementById(addressType + '.searchTextField').value = ""
                }
            } else {
                alert("error in fetching address")
            }
        });
    } else {
        alert("please enter valid address with street")
        document.getElementById(addressType + '.searchTextField').value = ""
    }
}

function getDataForAttachment(enquiryId, file) {
    var json = {};
    json["DOCID"] = ""
    json["LINKID"] = enquiryId
    json["DOCUCAT_CATEGORY"] = "A1"
    json["TYPE"] = file.type
    json["TITLE"] = "Document for " + enquiryId
    json["CREATEDAT"] = "1996-01-02 00:00:00"
    json["DESCRIPTION"] = "Document Description"
    json["SIZE"] = file.size.toString()
    console.log(json);
    return json
}


function ConvertFormToJSON(form) {
    var array = jQuery(form).serializeArray();
    var json = {};
    jQuery.each(array, function () {
        json[this.name] = this.value || '';
    });
    var date = "/Date(" + Date.now() + ")/";
    json["HISTORY.CREATEDAT"] = date;
    json["HISTORY.CREATEDBY"] = "Website";
    json["STATUS.STATUS"] = "01"
    json.JOBHID = ""

    var pickDateTime = new Date(document.getElementById('PICKUP.DATE').value);
    var dropDateTime = new Date(document.getElementById('DROPOFF.DATE').value);

    json["PICKUP.DATETIME"] = "/Date(" + pickDateTime.getTime() + ")/";
    json["DROPOFF.DATETIME"] = "/Date(" + dropDateTime.getTime() + ")/";
    delete json["DROPOFF.LOCATION"]
    delete json["PICKUP.LOCATION"]
    delete json["PICKUP.DATE"]
    delete json["DROPOFF.DATE"]
    delete json["fileContent"]
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
        "headers": headers,
        success: function (enquiryMsg) {
            var payload = {};
            var file = {};
            var uploadedFile = $('#Permit')[0].files[0];
            if (uploadedFile != undefined) {
                file["file"] = $("#fileContent").val()
                payload["data"] = JSON.stringify(getDataForAttachment(enquiryMsg.d.JOBHID, uploadedFile));
                payload["file"] = JSON.stringify(file)
                console.log(payload)
                $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url": "https://audb01c77f3e83a.ap1.hana.ondemand.com/pilot/xsodata/attachment.xsjs?post=insert",
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic U1lTVEVNOklua2l0c2NwQGF1ZGIwNA==",
                        "Cache-Control": "no-cache",
                        "cache-control": "no-cache"
                    },
                    success: function (msg) {
                        // alert("Your enquiry has been recieved and your customer id is " + msg.d.JOBHID)
                        // set content
                        modal.setContent('<h4>Your enquiry has been submitted.</h4><p>Your JOB-ID is ' + enquiryMsg.d.JOBHID + ' </p>');
                        //open modal
                        modal.open();
                    },
                    error: function (err) {
                        alert("fail");
                    },
                    "data": payload
                }).done(function (response) {
                    console.log(response);
                });
            } else {
                // alert("Your enquiry has been recieved and your customer id is " + msg.d.JOBHID)
                // set content
                modal.setContent('<h4>Your enquiry has been submitted.</h4><p>Your JOB-ID is ' + enquiryMsg.d.JOBHID + ' </p>');
                //open modal
                modal.open();
            }
        },
        error: function (err) {
            alert("fail");
        },
        "processData": false,
        "data": ConvertFormToJSON($("#email-form"))
    }).done(function (response) {
        console.log(response);
        document.getElementById("email-form").reset();
    });

}
$("#email-form").on("submit", function (e) {
    e.preventDefault();
    customerID = document.getElementById('CUSTOMER.CUSTOMERID').value
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    errFlag = false
    console.log("https://audb01c77f3e83a.ap1.hana.ondemand.com/pilot/xsodata/pilot.xsodata/Customer('" + customerID + "')")
    $.ajax({
        "async": false,
        crossDomain: true,
        "url": proxy + "https://audb01c77f3e83a.ap1.hana.ondemand.com/pilot/xsodata/pilot.xsodata/Customer('" + customerID + "')",
        "method": "GET",
        "headers": headers,
        error: function (err) {
            console.log("error")
            errFlag = true
            // set content
            modal.setContent('<h4>Please enter a valid customer ID. </h4><p> Error Response - ' + err.responseJSON.error.message.value + ' </p>');
            //open modal
            modal.open();
        },
        "processData": false
    }).done(function (response) {
        console.log(response);
    });
    if (!errFlag) {
        sendEnquiry();
    }
});

function sendEmail() {
    var addresses = "sales@ozpilots.com.au";
    var body = "I have an enquiry regarding availability of cars"
    var subject = "Availability of Cars"
    var href = "mailto:" + addresses + "?" +
        "subject=" + subject + "&" +
        "body=" + body;
    window.open(href);
}