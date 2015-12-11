[![Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://www.appcelerator.com/titanium/) [![Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/) [![License](http://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](http://choosealicense.com/licenses/apache-2.0/)

## ts.suggestionfield
An [Alloy](http://appcelerator.com/alloy) [Widget](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Widgets) to create an search field with suggestion box like [Google Maps](https://itunes.apple.com/us/app/google-maps/id585027354?mt=8) application. Furthermore, it is easy to add auto complete a form function as well.

* Source code: [https://github.com/bduyng/ts.suggestionfield/tree/master](https://github.com/bduyng/ts.suggestionfield/tree/master)
* Test app: [https://github.com/bduyng/ts.suggestionfield/tree/test](https://github.com/bduyng/ts.suggestionfield/tree/test)

## Preview
![Preview](demo.gif)

## How to use
Feel free to modify if need.

**index.xml**
```xml
<Alloy>
    ...
    <Widget id="searchbox" hintText="Search Google Maps" src="ts.suggestionfield" onChange="handleChange" onExportData="handleExportData"></Widget>
    ...
</Alloy>
```

**index.js**
```javascript
// SEND REQUEST TO GET NEW DATA
function handleChange(e) {}

// HANDLE RETURNED DATA WHEN USER CLICKED ON A SUGGESTION ROW
function handleExportData(data) {}

// IN YOUR XHR CLIENT
...
onload : function(e) {
    if (this.responseText) {
        try {
            var data = JSON.parse(this.responseText);
            $.searchbox.setSuggestions(transformData(data));
        } catch(e) {
            Ti.API.info(this.responseText);
            Ti.API.error(e);

        }
    }
}
...
```

**index.tss**
```javascript
'#searchbox' : {
    height : 50,
    top : 25,
    borderRadius : 3,
    backgroundColor : '#FFFFFF',
    hintText : 'Search',
    clearButtonMode : Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
    returnKeyType: Titanium.UI.RETURNKEY_SEARCH,
    color : '#000',
    zIndex: 1,
    width: '85%',
    paddingLeft: 15,
    suggestions: {
        bottom : 15,
        height: Ti.UI.SIZE,
        visible : false,
        opacity : 0,
        footerTitle : null,
        backgroundColor : '#FFFFFF',
        zIndex: 10
    }
}
```

## Changelog

* 1.0.0 Initial version
 
[![wearesmiths](http://wearesmiths.com/media/logoGitHub.png)](http://wearesmiths.com)
