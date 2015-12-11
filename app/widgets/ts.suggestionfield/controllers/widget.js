(function constructor(args) {
    $.input.applyProperties(args);
    setSuggestionPanel();
    handleInputEvents();
    handleSuggestionPanelEvents();
})(arguments[0] || {});

/* --------------- HANDLE USER INTERACTIONS --------------- */

function handleInputEvents() {
    $.input.addEventListener('change', function (e) {
        // FIXME : blur input on ANDROID
        if (OS_ANDROID && $.selected === e.value) {
            $.selected = null;
            return hideSuggestionPanel();
        }

        $.suggestions.visible = !!e.value;
        $.suggestions.height = $.suggestions.visible ? Ti.UI.SIZE : 0;
        $.suggestions.visible && !$.suggestions.opacity && ($.suggestions.opacity = 1);
        $.suggestions.visible && $.trigger('change', e);
    });
}

function handleSuggestionPanelEvents() {
    $.suggestions.addEventListener('dragstart', function (e) {
        $.input.blur();
    });

    $.suggestions.addEventListener('click', function (e) {
        $.input.value = e.rowData.title;
        hideSuggestionPanel();
        $.input.blur();

        // FIXME : blur input on ANDROID
        if (OS_ANDROID) { $.selected = e.rowData.title; }

        $.trigger('exportData', e.rowData.data);
    });
}

/* --------------- EMBEDDED METHODS --------------- */

function hideSuggestionPanel() {
    $.suggestions.opacity = 0;
    $.suggestions.visible = false;
    $.suggestions.height = 0;
}

function setSuggestionPanel() {
    $.input.addEventListener('postlayout', function handlePostlayout() {
        $.input.removeEventListener('postlayout', handlePostlayout);
        $.suggestions.top = $.input.rect.y + $.input.rect.height;
        $.suggestions.left = $.input.rect.x;
        $.suggestions.width = $.input.rect.width;
        $.suggestions.height = Ti.UI.SIZE;
    });
}

function _setSuggestions(data) {
    var isValidated = true;
    _.each(data, function (item) {
        if (!item.title) {
            Ti.API.error('Item should have title property');
            isValidated = false;
        }
    });
    isValidated && $.suggestions.setData(_.map(data, function (item) {
        return {
            title : item.title,
            data : item
        };
    }));
}

/* --------------- EXPORTS --------------- */

exports.setSuggestions = _setSuggestions;

exports.blur = function () {
    hideSuggestionPanel();
    $.input.blur();
};
exports.focus = function () {
    $.input.focus();
};
exports.getValue = function () {
    return $.input.value
};
