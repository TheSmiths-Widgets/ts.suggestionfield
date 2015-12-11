(function constructor(args) {
    $.index.open();

    $.GOOGLEAPIKEY = '<YOUR_GOOGLE_API_KEY>';

    setUpAutocompleteForm();

    var theSmiths = Alloy.Globals.Map.createAnnotation({
        latitude: 52.373698,
        longitude: 4.886902,
        title: "The Smiths",
        subtitle: "Herengracht 182, Amsterdam\nThe Netherlands",
        image: 'pin.png'
    });

    $.mapview.annotations = [theSmiths];
})(arguments[0] || {});

function setUpAutocompleteForm(e) {
    // GOOGLE APIS
    // https://developers.google.com/places/web-service/autocomplete
    var _url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
    _url += [
        'types=geocode',
        'language=en',
        'sensor=true',
        'key=' + $.GOOGLEAPIKEY,
        'input={{input}}'
    ].join('&');

    setHTTPClient({
        url : _url
    })
}

function transformData(data) {
    if (!data || data.status !== 'OK') return [];
    return _.map(data.predictions, function (prediction) {

        // title is the property which used to populate data for suggestions
        // title is mandatory
        prediction.title = prediction.description;
        delete prediction.description;

        return prediction;
    })
}

function setHTTPClient(args) {
    if (!args.url) {
        Ti.API.error('Please provide URL');
        return false;
    }

    $.url = args.url;
    $.client = Ti.Network.createHTTPClient(_.extend({
        // function called when the response data is available
        onload : function(e) {
            if (this.responseText) {
                try {
                    var _data = JSON.parse(this.responseText);
                    $.searchbox.setSuggestions(transformData(_data));
                } catch(e) {
                    Ti.API.info(this.responseText);
                    Ti.API.error(e);

                }
            }
        },
        // function called when an error occurs, including a timeout
        onerror : function(e) {
            Ti.API.error(e);
        },
        timeout : 10000  // in milliseconds
    }, _.omit(args.opts, 'onload', 'onerror')));
}

function handleChange(e) {
    // Cancels a pending request.
    $.client.abort();

    console.log($.url);

    // Prepare the connection.
    $.client.open('GET', $.url.replace('{{input}}', e.value));

    // Send the request.
    $.client.send();
}

function handleExportData(data) {
    var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload : function(e) {
            if (this.responseText) {
                try {
                    var _data = JSON.parse(this.responseText);
                    $.mapview.setRegion({
                        latitude: _data.result.geometry.location.lat,
                        longitude: _data.result.geometry.location.lng,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                    });

                    var somewhere = Alloy.Globals.Map.createAnnotation({
                        latitude: _data.result.geometry.location.lat,
                        longitude: _data.result.geometry.location.lng,
                        title: _data.name,
                        subtitle: _data.vicinity
                    });

                    $.mapview.annotations = [somewhere];
                } catch(e) {
                    Ti.API.info(this.responseText);
                    Ti.API.error(e);

                }
            }
        },
        // function called when an error occurs, including a timeout
        onerror : function(e) {
            Ti.API.error(e);
        },
        timeout : 10000  // in milliseconds
    });

    // Prepare the connection.
    client.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + data.place_id + '&key=' + $.GOOGLEAPIKEY);

    // Send the request.
    client.send();
}

$.index.open();
