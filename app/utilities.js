var utils = (function () {

    // These are general, home-grown javascript functions for common functions used withing the app.

    function setCookie(name, value, minutes) {
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            var expires = "; expires=" + date.toUTCString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=");
            if (c_start != -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return null;
    }

    function deleteCookie(name) {
        setCookie(name, "", -60);
    }

    function resetCookieExpiration(name, minutes) {

        var value = getCookie(name);

        if (value != null) {
            setCookie(name, value, minutes);
        }

    }

    function getPageHashParameters() {

        return getHashParameters(window.location.href);

    }

    function getHashParameters(url) {

        var hashParameters = {};

        if (url.indexOf("#") == -1) {
            return hashParameters;
        }

        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = url.substring(url.indexOf("#") + 1);

        while (e = r.exec(q))
            hashParameters[d(e[1])] = d(e[2]);

        return hashParameters;
    }

    function getPageQueryParameters() {

        return getQueryParameters(window.location.href);

    }

    function getQueryParameters(url) {

        if (url.indexOf("?") == -1) {
            return {};
        }

        q = url.substring(url.indexOf("?") + 1);

        // Strip off any hash parameters
        if (q.indexOf("#") > 0) {
            q = q.substring(0, q.indexOf("#"));
        }

        return parseQueryParameters(q);
    }

    function parseQueryParameters(query) {

        var queryParameters = {};

        if (isNullOrEmpty(query)) {
            return queryParameters;
        }

        var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); }
        var queryParameters = {};

        while (e = r.exec(query))
            queryParameters[d(e[1])] = d(e[2]);

        return queryParameters;

    }

    function appendParams(url, params) {

        if (params.length == 0) {
            return url;
        }

        url += "?";

        _.each(params, function (item, index) {
            url += index + "=" + item + "&";
        });

        // remove the trailing ampersand
        url = url.substring(0, (url.length - 1));

        return url;

    }

    function left(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else
            return String(str).substring(0, n);
    }

    function right(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    }

    function isValidNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function isValidInteger(value) {

        if (isValidNumber(value) == false) {
            return false;
        }

        value = parseFloat(value);

        var result = (value === (parseInt(value) | 0));

        return result;
    }

    function isValidEmail(value) {

        // http://stackoverflow.com/a/46181/2002383 anystring@anystring.anystring
        return /\S+@\S+\.\S+/.test(value);

    }

    function getRandom() {
        return Math.floor((Math.random() * 10000000) + 1);
    }

    function hasProperty(obj, prop) {

        // Determine if an object has a particular property http://stackoverflow.com/a/136411/2002383

        if (obj != null) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) &&
                (!(prop in proto) || proto[prop] !== obj[prop]);
        }

        return false;
    }

    function sumProperties(collection, prop) {

        // Get the sum of a particular property from a collection
        var sum = 0;

        _.each(collection, function (item) {
            if (hasProperty(item, prop)) {
                sum += item[prop];
            }
        });

        return sum;
    }

    function areEqual() {
        
        // For an unlimited number of parameters, determines if they are all equal, i.e. areEqual(x, y, z, ...)
        var len = arguments.length;
        for (var i = 1; i < len; i++) {
            if (arguments[i] == null || arguments[i] != arguments[i - 1])
                return false;
        }

        return true;
    }

    function isNullOrEmpty(string) {

        if (string == null || string == undefined) {
            return true;
        }

        if (string == "") {
            return true;
        }

        if (removeWhitespace(string) == null) {
            return true;
        }

        return false;

    }

    function stringsToBool(object) {

        // This converts all properties with "true" and "false" values to true and false, respectively.

        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (object[property] === "false") {
                    object[property] = false;
                }
                if (object[property] === "true") {
                    object[property] = true;
                }
            }
        }
    }

    function stringToBool(string) {
        return (string == "true");
    }

    function removeWhitespace(string) {
        return string.replace(/ /g, '');
    }
    
    function convert(money, rate) {
        return Math.round((money * rate) * 100) / 100;
    }

    function luhnCheck(value) {

        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    function undefinedToNull(object) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {

                // If an object, run through all its properties
                if (Object.prototype.toString.call(object[property]) === '[object Object]') {
                    undefinedToNull(object[property]);
                }

                // If an array, run through all items in the array
                if (Object.prototype.toString.call(object[property]) === '[object Array]') {
                    for (var obj in object[property]) {
                        undefinedToNull(obj);
                    }
                }

                // Otherwise, convert to null
                if (object[property] === undefined) {
                    object[property] = null;
                }
            }
        }
    }

    function getChildrenElements(n, skipMe, type) {
        // Get children elements from an HTML element
        var r = [];
        for (; n; n = n.nextSibling)
            if (n.nodeType == 1 && n != skipMe)
                if (type) {
                    if (type.toUpperCase() == n.nodeName.toUpperCase()) {
                        r.push(n);
                    }
                } else {
                    r.push(n);
                }
        return r;
    };

    function getSiblingElements(n, type) {
        // Get sibling elements from an HTML element, excluding self.
        return getChildrenElements(n.parentNode.firstChild, n, type);
    }
    
    function getCurrentIsoDate(atStartOfDay) {

        var date = new Date();
        
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }
        
        var hours = "00";
        var minutes = "00";
        var seconds = "00"
        
        if (!atStartOfDay) {
            hours = date.getUTCHours();
            minutes = date.getUTCMinutes();
            seconds = date.getUTCSeconds();
        }

        return date.getUTCFullYear() 
        + '-' + pad(date.getUTCMonth() + 1) 
        + '-' + pad(date.getUTCDate())
        + 'T' + pad(hours) 
        + ':' + pad(minutes) 
        + ':' + pad(seconds) 
        + 'Z';
    };
    
    function repeat(char, number) {
        var e = "";
        for (i = 0; i < number; i++) {
            e += char;
        }
        return e;
    }
    
    function mergeParams(params, required, expand) {
        
        // If you have a string, parse it into an object
        if (_.isString(params)) {
            params = parseQueryParameters(params);
        }

        // If null, set as an empty object
        params = params || {};
        
        // Takes parameters, removes any hidden that are listed in required from the existing, adds any supplied expand parameters.

        var currentHide = String((params.hide || "")).split(",");
        var currentExpand = String((params.expand || "")).split(",");
        
        var newRequired = String((required || "")).split(",");
        var newExpand = String((expand || "")).split(",");

        // Remove items from hide that are in newRequired
        currentHide = _.reject(currentHide, function (val) {
            return (newRequired.indexOf(val) >= 0);
        });
        
        // Concat expand
        currentExpand = currentExpand.concat(newExpand);
        currentExpand = _.uniq(currentExpand);

        // Return
        params.hide = currentHide.join(",");
        params.expand = currentExpand.join(",");
        
        // Remove any leading or trailing commas
        params.hide = TrimIf(params.hide, ",");
        params.expand = TrimIf(params.expand, ",");

        return params;

    }
    
    function LeftTrimIf(str, char) {
        if (str) {
            if (str.substring(0, 1) == char) {
                str = str.substring(1);
            }
        }
        return str;
    }
    
    function RightTrimIf(str, char) {
        if (str) {
            if (str.charAt(str.length - 1) == "/") {
                str = str.substr(0, str.length - 1)
            }
        }
        return str;
    }
    
    function deDuplicateCsv(csv) {
        var array = csv.split(',');
        var unique = _.uniq(array);
        return unique.join(",");
    }
    
    function TrimIf(str, char) {
        return (RightTrimIf(LeftTrimIf(str, char), char));
    }
    
    function getLocale(language) {
        
        // Array of supported locales
        var locales = [];
        locales.push("af-na", "af-za", "af", "ar-ae", "ar-bh", "ar-dj", "ar-dz", "ar-eg", "ar-eh", "ar-er", "ar-il", "ar-iq", "ar-jo", "ar-km", "ar-kw", "ar-lb", "ar-ly", "ar-ma", "ar-mr", "ar-om", "ar-ps", "ar-qa", "ar-sa", "ar-sd", "ar-so", "ar-ss", "ar-sy", "ar-td", "ar-tn", "ar-ye", "ar", "az-cyrl-az", "az-cyrl", "az-latn-az", "az-latn", "az", "bg-bg", "bg", "bo-cn", "bo-in", "bo", "cs-cz", "cs", "da-dk", "da-gl", "da", "dav-ke", "dav", "de-at", "de-be", "de-ch", "de-de", "de-li", "de-lu", "de", "el-cy", "el-gr", "el", "en-ag", "en-ai", "en-as", "en-au", "en-bb", "en-be", "en-bm", "en-bs", "en-bw", "en-bz", "en-ca", "en-cc", "en-ck", "en-cm", "en-cx", "en-dg", "en-dm", "en-dsrt-us", "en-dsrt", "en-er", "en-fj", "en-fk", "en-fm", "en-gb", "en-gd", "en-gg", "en-gh", "en-gi", "en-gm", "en-gu", "en-gy", "en-hk", "en-ie", "en-im", "en-in", "en-io", "en-iso", "en-je", "en-jm", "en-ke", "en-ki", "en-kn", "en-ky", "en-lc", "en-lr", "en-ls", "en-mg", "en-mh", "en-mo", "en-mp", "en-ms", "en-mt", "en-mu", "en-mw", "en-na", "en-nf", "en-ng", "en-nr", "en-nu", "en-nz", "en-pg", "en-ph", "en-pk", "en-pn", "en-pr", "en-pw", "en-rw", "en-sb", "en-sc", "en-sd", "en-sg", "en-sh", "en-sl", "en-ss", "en-sx", "en-sz", "en-tc", "en-tk", "en-to", "en-tt", "en-tv", "en-tz", "en-ug", "en-um", "en-us", "en-vc", "en-vg", "en-vi", "en-vu", "en-ws", "en-za", "en-zm", "en-zw", "en", "es-ar", "es-bo", "es-cl", "es-co", "es-cr", "es-cu", "es-do", "es-ea", "es-ec", "es-es", "es-gq", "es-gt", "es-hn", "es-ic", "es-mx", "es-ni", "es-pa", "es-pe", "es-ph", "es-pr", "es-py", "es-sv", "es-us", "es-uy", "es-ve", "es", "et-ee", "et", "eu-es", "eu", "fa-af", "fa-ir", "fa", "fi-fi", "fi", "fil-ph", "fil", "fr-be", "fr-bf", "fr-bi", "fr-bj", "fr-bl", "fr-ca", "fr-cd", "fr-cf", "fr-cg", "fr-ch", "fr-ci", "fr-cm", "fr-dj", "fr-dz", "fr-fr", "fr-ga", "fr-gf", "fr-gn", "fr-gp", "fr-gq", "fr-ht", "fr-km", "fr-lu", "fr-ma", "fr-mc", "fr-mf", "fr-mg", "fr-ml", "fr-mq", "fr-mr", "fr-mu", "fr-nc", "fr-ne", "fr-pf", "fr-pm", "fr-re", "fr-rw", "fr-sc", "fr-sn", "fr-sy", "fr-td", "fr-tg", "fr-tn", "fr-vu", "fr-wf", "fr-yt", "fr", "hi-in", "hi", "hr-ba", "hr-hr", "hr", "hu-hu", "hu", "hy-am", "hy", "is-is", "is", "it-ch", "it-it", "it-sm", "it", "ja-jp", "ja", "ka-ge", "ka", "kab-dz", "kab", "kam-ke", "kam", "kk-cyrl-kz", "kk-cyrl", "kk", "kkj-cm", "kkj", "kl-gl", "kl", "kln-ke", "kln", "km-kh", "km", "ko-kp", "ko-kr", "ko", "kok-in", "kok", "lo-la", "lo", "lt-lt", "lt", "mg-mg", "mg", "mgh-mz", "mgh", "mgo-cm", "mgo", "mk-mk", "mk", "mn-cyrl-mn", "mn-cyrl", "mn", "ms-bn", "ms-latn-bn", "ms-latn-my", "ms-latn-sg", "ms-latn", "ms-my", "ms", "mt-mt", "mt", "ne-in", "ne-np", "ne", "nl-aw", "nl-be", "nl-bq", "nl-cw", "nl-nl", "nl-sr", "nl-sx", "nl", "no-no", "no", "pl-pl", "pl", "pt-ao", "pt-br", "pt-cv", "pt-gw", "pt-mo", "pt-mz", "pt-pt", "pt-st", "pt-tl", "pt", "ro-md", "ro-ro", "ro", "rof-tz", "rof", "ru-by", "ru-kg", "ru-kz", "ru-md", "ru-ru", "ru-ua", "ru", "shi-latn-ma", "shi-latn", "shi-tfng-ma", "shi-tfng", "shi", "sk-sk", "sk", "sl-si", "sl", "sq-al", "sq-mk", "sq-xk", "sq", "sr-cyrl-ba", "sr-cyrl-me", "sr-cyrl-rs", "sr-cyrl-xk", "sr-cyrl", "sr-latn-ba", "sr-latn-me", "sr-latn-rs", "sr-latn-xk", "sr-latn", "sr", "sv-ax", "sv-fi", "sv-se", "sv", "th-th", "th", "tl", "to-to", "to", "tr-cy", "tr-tr", "tr", "uk-ua", "uk", "uz-arab-af", "uz-arab", "uz-cyrl-uz", "uz-cyrl", "uz-latn-uz", "uz-latn", "uz", "vi-vn", "vi", "zh-cn", "zh-hans-cn", "zh-hans-hk", "zh-hans-mo", "zh-hans-sg", "zh-hans", "zh-hant-hk", "zh-hant-mo", "zh-hant-tw", "zh-hant", "zh-hk", "zh-tw", "zh");
        
        // If their locale exists in the locale list, use it. Otherwise, use the locale from their selected language.
        if (locales.indexOf(localStorage.getItem("locale")) >= 0) {
            return localStorage.getItem("locale");
        } else {
            return language;
        }

    }
    
    return {
        setCookie: setCookie,
        getCookie: getCookie,
        deleteCookie: deleteCookie,
        getPageHashParameters: getPageHashParameters,
        getHashParameters: getHashParameters,
        getPageQueryParameters: getPageQueryParameters,
        getQueryParameters: getQueryParameters,
        appendParams: appendParams,
        left: left,
        right: right,
        isValidNumber: isValidNumber,
        isValidInteger: isValidInteger,
        getRandom: getRandom,
        stringsToBool: stringsToBool,
        stringToBool: stringToBool,
        hasProperty: hasProperty,
        areEqual: areEqual,
        sumProperties: sumProperties,
        isNullOrEmpty: isNullOrEmpty,
        resetCookieExpiration: resetCookieExpiration,
        removeWhitespace: removeWhitespace,
        luhnCheck: luhnCheck,
        undefinedToNull: undefinedToNull,
        parseQueryParameters: parseQueryParameters,
        isValidEmail: isValidEmail,
        getChildrenElements: getChildrenElements,
        getSiblingElements: getSiblingElements,
        convert: convert,
        getCurrentIsoDate: getCurrentIsoDate,
        repeat: repeat,
        mergeParams: mergeParams,
        deDuplicateCsv: deDuplicateCsv,
        getLocale: getLocale
    };

})();

// Prototypes
String.prototype.replaceAll = function (f, r) {
    return this.split(f).join(r);
}
