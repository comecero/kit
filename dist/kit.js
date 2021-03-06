/*
Comecero Kit version: ﻿1.0.15
Build time: 2019-08-06T22:14:11.391Z
Checksum (SHA256): d2adbbb07dcbd90a3ec1be6933d6294be4362efc5c3bd6190a08c48299302bff
https://comecero.com
https://github.com/comecero/kit
Copyright Comecero and other contributors. Released under MIT license. See LICENSE for details.
*/

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
        queryParameters = {};

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
            var cDigit = value.charAt(n);
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
    
    function cleanPrice(price) {
        // Strip everything except numbers and decimals

        if (typeof price === 'undefined' || price == null) {
            return "";
        }

        var cleanedPrice = price.toString().replace(/[^0-9\.\s]/g, '').trim();

        if (isNaN(cleanedPrice) == true || cleanedPrice.trim() == "") {
            // The value is not reasonably close enough for it to be a valid price. Just return the original input.
            return price;
        } else {
            // Truncate at two decimal places.
            return parseFloat(cleanedPrice).toFixed(2);
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
        cleanPrice: cleanPrice
    };

})();

// Prototypes
String.prototype.replaceAll = function (f, r) {
    return this.split(f).join(r);
}

// The following code needs to run after app.js and after utilities.js are loaded but before any directive, controller, etc. are run. This bootstraps the app at run time with the initial settings and configurations.
// This is included in kit.js

app.run(['$rootScope', '$http', 'SettingsService', 'StorageService', 'LanguageService', 'ApiService', function ($rootScope, $http, SettingsService, StorageService, LanguageService, ApiService) {

    // Get the settings
    var settings = SettingsService.get();

    // Enable CORS when running in development environments.
    if (settings.config.development) {
        $http.defaults.useXDomain = true;
    }

    // Establish the app language
    LanguageService.establishLanguage($rootScope.languagesPath);

    // Establish the pageview load code. This is used to send Analytics data to the platform.
    var loadPageview = function () {

        // Find the pageview script in the DOM. If present, append the pageview analytics source to the page. Replace any previous to not pollute the page with each pageview.
        var app_pageview = document.getElementById("app_pageview");

        if (app_pageview && settings.config.development != true) {
            var head = document.getElementsByTagName("head")[0];
            var js = document.createElement("script");
            js.id = "app_pageviewload";
            js.type = "text/javascript";
            js.src = "analytics/pageview.js";

            // Remove any existing
            if (document.getElementById("app_pageviewload") != null) {
                head.removeChild(document.getElementById("app_pageviewload"));
            }

            // Add again to force reload.
            head.appendChild(js);
        }
    }

}]);
var amazonPay = (function () {

    var url = "https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js";
    if (window.__settings.account.test) {
        url = "https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js";
    }

    var access_token = null;
    var order_reference_id = null;
    var billing_agreement_id = null;
    var loaded = false;
    var consent_status = false;

    var address_book;

    // Load the Amazon Pay SDK, if available for this account.
    if (isAvailable()) {
        loadScript(url, function () {
            loaded = true;
        });
    }

    function createPaymentButton(client_id, seller_id, target_id, type, color, size, callback) {

        // client_id: The Amazon Pay client ID
        // seller_id: The Amazon Pay seller ID
        // target_id: The id of the HTML element the button should be placed within
        // type, color, size: Button customizations, see function code for possibilities
        // callback(error, data): The function that is called when the button is created, data returns the access_token, which needs to be passed to the API when submitting the payment.

        // Load the SDK, if not already loaded.
        if (!loaded) {
            loadScript(url, function () {
                loaded = true;
            });
        }

        // Run now if ready, otherwise wait till ready.
        if (!window.amazon) {
            window.onAmazonLoginReady = function () {
                _createPaymentButton(target_id, type, color, size, callback);
            }
        } else {
            _createPaymentButton(target_id, type, color, size, callback);
        }

        function _createPaymentButton(target_id, type, color, size, callback) {

            // Set the ids
            amazon.Login.setClientId(client_id);
            amazon.Login.setUseCookie(true);

            // Create the payment button
            OffAmazonPayments.Button(target_id, seller_id, {

                // https://pay.amazon.com/us/developer/documentation/lpwa/201953980
                type: type || "PwA", // "PwA", "Pay", "A"
                color: color || "Gold", // "Gold", "LightGray", "DarkGray"
                size: size || "medium", // "small", "medium", "large", "x-large"
                authorization: function () {
                    var loginOptions = { scope: 'profile payments:widget payments:shipping_address' };
                    authRequest = amazon.Login.authorize(loginOptions, function (response) {
                        access_token = response.access_token;
                    });
                },
                onSignIn: function (orderReferenece) {

                    // Return the order reference and the access token that was previously generated
                    if (callback) {
                        callback(null, { access_token: access_token, order_reference_id: null, billing_agreement_id: null, seller_id: seller_id });
                    }
                },
                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay button.");
                    console.log(error.getErrorMessage());
                }

            });
        }
    }

    function loadWidgets(client_id, seller_id, requires_billing_agreement, address_id, wallet_id, consent_id, onAddressSelect, onPaymentMethodSelect, onConsentChange, design_mode, display_mode, callback) {

        // client_id: The Amazon Pay client ID
        // seller_id: The Amazon Pay seller ID
        // requires_billing_agreement: indicates if the transaction requires establishing a billing agreement, which will generate a consent box for the user to select
        // address_id: The id of the HTML element (div) that will hold the address widget
        // wallet_id: The id of the HTML element (div) that will hold the wallet widget
        // consent_id: The id of the HTML element (div) that will hold the consent widget in the case of establishing a billing agreement
        // onAddressSelect: Fires when an address has been selected by the user
        // onPaymentMethodSelect: Fires when a payment method has been selected by the user
        // onConsentChange: Fires when the consent has been toggled by the user. A callback parameter of 'status' true / false indicates the state of the conset checkbox
        // design_mode: Indicates the design mode of the widgets, 'responsive' is used if not provided.
        // callback(error, data): The function that is called when the button is created, data returns an object that contains the access_token and the order_reference_id or billing_agreement_id, depending on establishment of a billing agreement

        if (requires_billing_agreement) {
            loadWidgetsWithBillingAgreement(seller_id, address_id, wallet_id, consent_id, design_mode, display_mode)
        } else {
            billing_agreement_id = null;
            loadWidgetsWithoutBillingAgreement(seller_id, address_id, wallet_id, design_mode, display_mode)
        }

        function loadWidgetsWithoutBillingAgreement(seller_id, address_id, wallet_id, design_mode, display_mode) {
            address_book = new OffAmazonPayments.Widgets.AddressBook({
                sellerId: seller_id,
                onOrderReferenceCreate: function (orderReference) {
                    order_reference_id = orderReference.getAmazonOrderReferenceId();
                },
                onAddressSelect: function (data) {
                    if (onAddressSelect) {
                        onAddressSelect();
                    }
                },
                display_mode: display_mode || "Edit",
                design: { designMode: design_mode || "responsive" },
                onReady: function (orderReference) {
                    callback(null, { access_token: access_token, order_reference_id: order_reference_id, billing_agreement_id: null, seller_id: seller_id });
                },
                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay address book.");
                    console.log(error.getErrorMessage());
                }
            }).bind(address_id);
            wallet = new OffAmazonPayments.Widgets.Wallet({
                sellerId: seller_id,
                onPaymentSelect: function () {
                    if (onPaymentMethodSelect) {
                        onPaymentMethodSelect();
                    }
                },
                display_mode: display_mode || "Edit",
                design: {
                    designMode: design_mode || "responsive"
                },
                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay wallet.");
                    console.log(error.getErrorMessage());
                }
            }).bind(wallet_id);
        }

        function loadWidgetsWithBillingAgreement(seller_id, address_id, wallet_id, consent_id, design_mode, display_mode) {

            var payload = {
                sellerId: seller_id,
                agreementType: "BillingAgreement",
                onReady: function (billingAgreement) {
                    billing_agreement_id = billingAgreement.getAmazonBillingAgreementId();
                    wallet = new OffAmazonPayments.Widgets.Wallet({
                        sellerId: seller_id,
                        amazonBillingAgreementId: billing_agreement_id,
                        onReady: function () {
                            callback(null, { access_token: access_token, billing_agreement_id: billing_agreement_id, seller_id: seller_id });
                        },
                        onPaymentSelect: function (billingAgreement) {
                            if (onPaymentMethodSelect) {
                                onPaymentMethodSelect();
                            }
                            consent = new OffAmazonPayments.Widgets.Consent({
                                sellerId: seller_id,
                                amazonBillingAgreementId: billing_agreement_id,
                                design: { designMode: design_mode || "responsive" },
                                onReady: function (billingAgreementConsentStatus) {
                                    if (billingAgreementConsentStatus.getConsentStatus) {
                                        if (consent_status !== utils.stringToBool(billingAgreementConsentStatus.getConsentStatus())) {
                                            consent_status = !consent_status;
                                            if (onConsentChange) {
                                                onConsentChange(consent_status);
                                            }
                                        }
                                    }
                                },
                                onConsent: function (billingAgreementConsentStatus) {
                                    if (consent_status !== utils.stringToBool(billingAgreementConsentStatus.getConsentStatus())) {
                                        consent_status = !consent_status;
                                        if (onConsentChange) {
                                            onConsentChange(consent_status);
                                        }
                                    }
                                },
                                onError: function (error) {
                                    callback("There was a problem attempting to load the Amazon Pay wallet.");
                                    console.log(error.getErrorMessage());
                                }
                            }).bind(consent_id);
                        },
                        display_mode: display_mode || "Edit",
                        design: { designMode: design_mode || "responsive" },
                        onError: function (error) {
                            callback("There was a problem attempting to load the Amazon Pay wallet.");
                            console.log(error.getErrorMessage());
                        }
                    }).bind(wallet_id);
                },
                onAddressSelect: function (billingAgreement) {
                    if (onAddressSelect) {
                        onAddressSelect();
                    }
                },
                display_mode: display_mode || "Edit",
                design: { designMode: design_mode || "responsive" },
                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay wallet.");
                    console.log(error.getErrorMessage());
                }
            };
            address_book = new OffAmazonPayments.Widgets.AddressBook(payload).bind(address_id);

        }

    }

    function reRenderWidgets(client_id, seller_id, order_reference_id, billing_agreement_id, wallet_id, onPaymentMethodSelect, design_mode, callback) {

        // seller_id: The Amazon Pay seller ID
        // order_reference_id: The order_reference_id for the transaction. Required if billing_agreement_id is null.
        // billing_agreement_id: The billing_agreement_id for the transaction. Required if order_reference_id is null.
        // wallet_id: The id of the HTML element (div) that will hold the wallet widget.
        // onPaymentMethodSelect: Fires when a payment method has been selected by the user.
        // design_mode: Indicates the design mode of the widgets, 'responsive' is used if not provided.
        // callback(error): The function that is called when the widget is refreshed, including a parameter 'error' that is populated if an error occurs when refreshing the widget.

        amazon.Login.setClientId(client_id);
        amazon.Login.setUseCookie(true);

        if (billing_agreement_id) {
            reRenderWidgetsWithBillingAgreement(seller_id, billing_agreement_id, wallet_id, onPaymentMethodSelect, callback);
        } else {
            reRenderWidgetsWithoutBillingAgreement(seller_id, order_reference_id, wallet_id, onPaymentMethodSelect, callback);
        }

        function reRenderWidgetsWithoutBillingAgreement(seller_id, order_reference_id, wallet_id, onPaymentMethodSelect, callback) {

            new OffAmazonPayments.Widgets.Wallet({
                sellerId: seller_id,

                amazonOrderReferenceId: order_reference_id,

                onPaymentSelect: function (orderReference) {
                    if (onPaymentMethodSelect) {
                        onPaymentMethodSelect();
                    }
                },
                design: {
                    designMode: design_mode || "responsive"
                },

                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay wallet.");
                    console.log(error.getErrorMessage());
                }
            }).bind(wallet_id);

        }

        function reRenderWidgetsWithBillingAgreement(seller_id, billing_agreement_id, wallet_id, onPaymentMethodSelect, callback) {

            new OffAmazonPayments.Widgets.Wallet({
                sellerId: seller_id,

                billingAgreementId: billing_agreement_id,

                onPaymentSelect: function (orderReference) {
                    if (onPaymentMethodSelect) {
                        onPaymentMethodSelect();
                    }
                },
                design: {
                    designMode: design_mode || "responsive"
                },

                onError: function (error) {
                    callback("There was a problem attempting to load the Amazon Pay wallet.");
                    console.log(error.getErrorMessage());
                }
            }).bind(wallet_id);

        }
    }

    function logout() {
        access_token = null;
        order_reference_id = null;
        billing_agreement_id = null;

        if (amazon) {
            amazon.Login.logout();
        }
    }

    function loadScript(url, callback) {
        // Appends a script to the DOM
        var head = document.getElementsByTagName("head")[0], done = false;
        var script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";
        script.async = 1;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                // Initialize
                if (typeof callback === 'function') callback();
            }
        };
        head.appendChild(script);
    }

    function isAvailable() {
        // Indicates if Amazon Pay is an available payment method
        if (window.__settings && window.__settings.account && window.__settings.account.payment_method_types.indexOf("amazon_pay") > -1) {
            return true;
        }
        return false;
    }

    function showWidgets(address_id, wallet_id, consent_id, recurring) {

        // Show the widgets
        var addressWidget = document.getElementById(address_id);
        var walletWidget = document.getElementById(wallet_id);
        var consentWidget = document.getElementById(consent_id);

        if (addressWidget)
            addressWidget.style.removeProperty("display");

        if (walletWidget)
            walletWidget.style.removeProperty("display");

        if (consentWidget && recurring)
            consentWidget.style.removeProperty("display");
    }

    function hideWidgets(address_id, wallet_id, consent_id) {

        // Hide the widgets
        var addressWidget = document.getElementById(address_id);
        var walletWidget = document.getElementById(wallet_id);
        var consentWidget = document.getElementById(consent_id);

        // Destroy the contents of each and then hide the element
        if (addressWidget) {
            addressWidget.style.display = "none";
            addressWidget.innerHTML = "";
        }

        if (walletWidget) {
            walletWidget.style.display = "none";
            walletWidget.innerHTML = "";
        }

        if (consentWidget) {
            consentWidget.style.display = "none";
            consentWidget.innerHTML = "";
        }

    }

    function getConsentStatus() {
        return consent_status;
    }

    // Public API
    return {
        createPaymentButton: createPaymentButton,
        loadWidgets: loadWidgets,
        showWidgets: showWidgets,
        hideWidgets: hideWidgets,
        reRenderWidgets: reRenderWidgets,
        logout: logout,
        getConsentStatus: getConsentStatus
    };

})();
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.0
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if (force && is_safari && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var base64Data = reader.result;
							view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define([], function() {
    return saveAs;
  });
}

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function () { function n(n) { function t(t, r, e, u, i, o) { for (; i >= 0 && o > i; i += n) { var a = u ? u[i] : i; e = r(e, t[a], a, t) } return e } return function (r, e, u, i) { e = b(e, i, 4); var o = !k(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1; return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a) } } function t(n) { return function (t, r, e) { r = x(r, e); for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n) if (r(t[i], i, t)) return i; return -1 } } function r(n, t, r) { return function (e, u, i) { var o = 0, a = O(e); if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1; else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1; if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1; for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n) if (e[i] === u) return i; return -1 } } function e(n, t) { var r = I.length, e = n.constructor, u = m.isFunction(e) && e.prototype || a, i = "constructor"; for (m.has(n, i) && !m.contains(t, i) && t.push(i) ; r--;) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i) } var u = this, i = u._, o = Array.prototype, a = Object.prototype, c = Function.prototype, f = o.push, l = o.slice, s = a.toString, p = a.hasOwnProperty, h = Array.isArray, v = Object.keys, g = c.bind, y = Object.create, d = function () { }, m = function (n) { return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3"; var b = function (n, t, r) { if (t === void 0) return n; switch (null == r ? 3 : r) { case 1: return function (r) { return n.call(t, r) }; case 2: return function (r, e) { return n.call(t, r, e) }; case 3: return function (r, e, u) { return n.call(t, r, e, u) }; case 4: return function (r, e, u, i) { return n.call(t, r, e, u, i) } } return function () { return n.apply(t, arguments) } }, x = function (n, t, r) { return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n) }; m.iteratee = function (n, t) { return x(n, t, 1 / 0) }; var _ = function (n, t) { return function (r) { var e = arguments.length; if (2 > e || null == r) return r; for (var u = 1; e > u; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) { var f = o[c]; t && r[f] !== void 0 || (r[f] = i[f]) } return r } }, j = function (n) { if (!m.isObject(n)) return {}; if (y) return y(n); d.prototype = n; var t = new d; return d.prototype = null, t }, w = function (n) { return function (t) { return null == t ? void 0 : t[n] } }, A = Math.pow(2, 53) - 1, O = w("length"), k = function (n) { var t = O(n); return "number" == typeof t && t >= 0 && A >= t }; m.each = m.forEach = function (n, t, r) { t = b(t, r); var e, u; if (k(n)) for (e = 0, u = n.length; u > e; e++) t(n[e], e, n); else { var i = m.keys(n); for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n) } return n }, m.map = m.collect = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) { var a = e ? e[o] : o; i[o] = t(n[a], a, n) } return i }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function (n, t, r) { var e; return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0 }, m.filter = m.select = function (n, t, r) { var e = []; return t = x(t, r), m.each(n, function (n, r, u) { t(n, r, u) && e.push(n) }), e }, m.reject = function (n, t, r) { return m.filter(n, m.negate(x(t)), r) }, m.every = m.all = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (!t(n[o], o, n)) return !1 } return !0 }, m.some = m.any = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (t(n[o], o, n)) return !0 } return !1 }, m.contains = m.includes = m.include = function (n, t, r, e) { return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0 }, m.invoke = function (n, t) { var r = l.call(arguments, 2), e = m.isFunction(t); return m.map(n, function (n) { var u = e ? t : n[t]; return null == u ? u : u.apply(n, r) }) }, m.pluck = function (n, t) { return m.map(n, m.property(t)) }, m.where = function (n, t) { return m.filter(n, m.matcher(t)) }, m.findWhere = function (n, t) { return m.find(n, m.matcher(t)) }, m.max = function (n, t, r) { var e, u, i = -1 / 0, o = -1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u) }); return i }, m.min = function (n, t, r) { var e, u, i = 1 / 0, o = 1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u) }); return i }, m.shuffle = function (n) { for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i]; return u }, m.sample = function (n, t, r) { return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t)) }, m.sortBy = function (n, t, r) { return t = x(t, r), m.pluck(m.map(n, function (n, r, e) { return { value: n, index: r, criteria: t(n, r, e) } }).sort(function (n, t) { var r = n.criteria, e = t.criteria; if (r !== e) { if (r > e || r === void 0) return 1; if (e > r || e === void 0) return -1 } return n.index - t.index }), "value") }; var F = function (n) { return function (t, r, e) { var u = {}; return r = x(r, e), m.each(t, function (e, i) { var o = r(e, i, t); n(u, e, o) }), u } }; m.groupBy = F(function (n, t, r) { m.has(n, r) ? n[r].push(t) : n[r] = [t] }), m.indexBy = F(function (n, t, r) { n[r] = t }), m.countBy = F(function (n, t, r) { m.has(n, r) ? n[r]++ : n[r] = 1 }), m.toArray = function (n) { return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : [] }, m.size = function (n) { return null == n ? 0 : k(n) ? n.length : m.keys(n).length }, m.partition = function (n, t, r) { t = x(t, r); var e = [], u = []; return m.each(n, function (n, r, i) { (t(n, r, i) ? e : u).push(n) }), [e, u] }, m.first = m.head = m.take = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t) }, m.initial = function (n, t, r) { return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t))) }, m.last = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t)) }, m.rest = m.tail = m.drop = function (n, t, r) { return l.call(n, null == t || r ? 1 : t) }, m.compact = function (n) { return m.filter(n, m.identity) }; var S = function (n, t, r, e) { for (var u = [], i = 0, o = e || 0, a = O(n) ; a > o; o++) { var c = n[o]; if (k(c) && (m.isArray(c) || m.isArguments(c))) { t || (c = S(c, t, r)); var f = 0, l = c.length; for (u.length += l; l > f;) u[i++] = c[f++] } else r || (u[i++] = c) } return u }; m.flatten = function (n, t) { return S(n, t, !1) }, m.without = function (n) { return m.difference(n, l.call(arguments, 1)) }, m.uniq = m.unique = function (n, t, r, e) { m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e)); for (var u = [], i = [], o = 0, a = O(n) ; a > o; o++) { var c = n[o], f = r ? r(c, o, n) : c; t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c) } return u }, m.union = function () { return m.uniq(S(arguments, !0, !0)) }, m.intersection = function (n) { for (var t = [], r = arguments.length, e = 0, u = O(n) ; u > e; e++) { var i = n[e]; if (!m.contains(t, i)) { for (var o = 1; r > o && m.contains(arguments[o], i) ; o++); o === r && t.push(i) } } return t }, m.difference = function (n) { var t = S(arguments, !0, !0, 1); return m.filter(n, function (n) { return !m.contains(t, n) }) }, m.zip = function () { return m.unzip(arguments) }, m.unzip = function (n) { for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e); return r }, m.object = function (n, t) { for (var r = {}, e = 0, u = O(n) ; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1]; return r }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function (n, t, r, e) { r = x(r, e, 1); for (var u = r(t), i = 0, o = O(n) ; o > i;) { var a = Math.floor((i + o) / 2); r(n[a]) < u ? i = a + 1 : o = a } return i }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function (n, t, r) { null == t && (t = n || 0, n = 0), r = r || 1; for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) u[i] = n; return u }; var E = function (n, t, r, e, u) { if (!(e instanceof t)) return n.apply(r, u); var i = j(n.prototype), o = n.apply(i, u); return m.isObject(o) ? o : i }; m.bind = function (n, t) { if (g && n.bind === g) return g.apply(n, l.call(arguments, 1)); if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function"); var r = l.call(arguments, 2), e = function () { return E(n, e, t, this, r.concat(l.call(arguments))) }; return e }, m.partial = function (n) { var t = l.call(arguments, 1), r = function () { for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o]; for (; e < arguments.length;) i.push(arguments[e++]); return E(n, r, this, this, i) }; return r }, m.bindAll = function (n) { var t, r, e = arguments.length; if (1 >= e) throw new Error("bindAll must be passed function names"); for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n); return n }, m.memoize = function (n, t) { var r = function (e) { var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e); return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i] }; return r.cache = {}, r }, m.delay = function (n, t) { var r = l.call(arguments, 2); return setTimeout(function () { return n.apply(null, r) }, t) }, m.defer = m.partial(m.delay, m, 1), m.throttle = function (n, t, r) { var e, u, i, o = null, a = 0; r || (r = {}); var c = function () { a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null) }; return function () { var f = m.now(); a || r.leading !== !1 || (a = f); var l = t - (f - a); return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i } }, m.debounce = function (n, t, r) { var e, u, i, o, a, c = function () { var f = m.now() - o; t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null))) }; return function () { i = this, u = arguments, o = m.now(); var f = r && !e; return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a } }, m.wrap = function (n, t) { return m.partial(t, n) }, m.negate = function (n) { return function () { return !n.apply(this, arguments) } }, m.compose = function () { var n = arguments, t = n.length - 1; return function () { for (var r = t, e = n[t].apply(this, arguments) ; r--;) e = n[r].call(this, e); return e } }, m.after = function (n, t) { return function () { return --n < 1 ? t.apply(this, arguments) : void 0 } }, m.before = function (n, t) { var r; return function () { return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r } }, m.once = m.partial(m.before, 2); var M = !{ toString: null }.propertyIsEnumerable("toString"), I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"]; m.keys = function (n) { if (!m.isObject(n)) return []; if (v) return v(n); var t = []; for (var r in n) m.has(n, r) && t.push(r); return M && e(n, t), t }, m.allKeys = function (n) { if (!m.isObject(n)) return []; var t = []; for (var r in n) t.push(r); return M && e(n, t), t }, m.values = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]]; return e }, m.mapObject = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n); return o }, m.pairs = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]]; return e }, m.invert = function (n) { for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e]; return t }, m.functions = m.methods = function (n) { var t = []; for (var r in n) m.isFunction(n[r]) && t.push(r); return t.sort() }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++) if (e = u[i], t(n[e], e, n)) return e }, m.pick = function (n, t, r) { var e, u, i = {}, o = n; if (null == o) return i; m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function (n, t, r) { return t in r }, o = Object(o)); for (var a = 0, c = u.length; c > a; a++) { var f = u[a], l = o[f]; e(l, f, o) && (i[f] = l) } return i }, m.omit = function (n, t, r) { if (m.isFunction(t)) t = m.negate(t); else { var e = m.map(S(arguments, !1, !1, 1), String); t = function (n, t) { return !m.contains(e, t) } } return m.pick(n, t, r) }, m.defaults = _(m.allKeys, !0), m.create = function (n, t) { var r = j(n); return t && m.extendOwn(r, t), r }, m.clone = function (n) { return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n }, m.tap = function (n, t) { return t(n), n }, m.isMatch = function (n, t) { var r = m.keys(t), e = r.length; if (null == n) return !e; for (var u = Object(n), i = 0; e > i; i++) { var o = r[i]; if (t[o] !== u[o] || !(o in u)) return !1 } return !0 }; var N = function (n, t, r, e) { if (n === t) return 0 !== n || 1 / n === 1 / t; if (null == n || null == t) return n === t; n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped); var u = s.call(n); if (u !== s.call(t)) return !1; switch (u) { case "[object RegExp]": case "[object String]": return "" + n == "" + t; case "[object Number]": return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t; case "[object Date]": case "[object Boolean]": return +n === +t } var i = "[object Array]" === u; if (!i) { if ("object" != typeof n || "object" != typeof t) return !1; var o = n.constructor, a = t.constructor; if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1 } r = r || [], e = e || []; for (var c = r.length; c--;) if (r[c] === n) return e[c] === t; if (r.push(n), e.push(t), i) { if (c = n.length, c !== t.length) return !1; for (; c--;) if (!N(n[c], t[c], r, e)) return !1 } else { var f, l = m.keys(n); if (c = l.length, m.keys(t).length !== c) return !1; for (; c--;) if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1 } return r.pop(), e.pop(), !0 }; m.isEqual = function (n, t) { return N(n, t) }, m.isEmpty = function (n) { return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length }, m.isElement = function (n) { return !(!n || 1 !== n.nodeType) }, m.isArray = h || function (n) { return "[object Array]" === s.call(n) }, m.isObject = function (n) { var t = typeof n; return "function" === t || "object" === t && !!n }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (n) { m["is" + n] = function (t) { return s.call(t) === "[object " + n + "]" } }), m.isArguments(arguments) || (m.isArguments = function (n) { return m.has(n, "callee") }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function (n) { return "function" == typeof n || !1 }), m.isFinite = function (n) { return isFinite(n) && !isNaN(parseFloat(n)) }, m.isNaN = function (n) { return m.isNumber(n) && n !== +n }, m.isBoolean = function (n) { return n === !0 || n === !1 || "[object Boolean]" === s.call(n) }, m.isNull = function (n) { return null === n }, m.isUndefined = function (n) { return n === void 0 }, m.has = function (n, t) { return null != n && p.call(n, t) }, m.noConflict = function () { return u._ = i, this }, m.identity = function (n) { return n }, m.constant = function (n) { return function () { return n } }, m.noop = function () { }, m.property = w, m.propertyOf = function (n) { return null == n ? function () { } : function (t) { return n[t] } }, m.matcher = m.matches = function (n) { return n = m.extendOwn({}, n), function (t) { return m.isMatch(t, n) } }, m.times = function (n, t, r) { var e = Array(Math.max(0, n)); t = b(t, r, 1); for (var u = 0; n > u; u++) e[u] = t(u); return e }, m.random = function (n, t) { return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1)) }, m.now = Date.now || function () { return (new Date).getTime() }; var B = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }, T = m.invert(B), R = function (n) { var t = function (t) { return n[t] }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g"); return function (n) { return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n } }; m.escape = R(B), m.unescape = R(T), m.result = function (n, t, r) { var e = null == n ? void 0 : n[t]; return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e }; var q = 0; m.uniqueId = function (n) { var t = ++q + ""; return n ? n + t : t }, m.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var K = /(.)^/, z = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" }, D = /\\|'|\r|\n|\u2028|\u2029/g, L = function (n) { return "\\" + z[n] }; m.template = function (n, t, r) { !t && r && (t = r), t = m.defaults({}, t, m.templateSettings); var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"), u = 0, i = "__p+='"; n.replace(e, function (t, r, e, o, a) { return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n"; try { var o = new Function(t.variable || "obj", "_", i) } catch (a) { throw a.source = i, a } var c = function (n) { return o.call(this, n, m) }, f = t.variable || "obj"; return c.source = "function(" + f + "){\n" + i + "}", c }, m.chain = function (n) { var t = m(n); return t._chain = !0, t }; var P = function (n, t) { return n._chain ? m(t).chain() : t }; m.mixin = function (n) { m.each(m.functions(n), function (t) { var r = m[t] = n[t]; m.prototype[t] = function () { var n = [this._wrapped]; return f.apply(n, arguments), P(this, r.apply(m, n)) } }) }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) { var t = o[n]; m.prototype[n] = function () { var r = this._wrapped; return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r) } }), m.each(["concat", "join", "slice"], function (n) { var t = o[n]; m.prototype[n] = function () { return P(this, t.apply(this._wrapped, arguments)) } }), m.prototype.value = function () { return this._wrapped }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function () { return "" + this._wrapped }, "function" == typeof define && define.amd && define("underscore", [], function () { return m }) }).call(this);
//# sourceMappingURL=underscore-min.map
/**
 * @ngdoc module
 * @name gettext
 * @packageName angular-gettext
 * @description Super simple Gettext for Angular.JS
 *
 * A sample application can be found at https://github.com/rubenv/angular-gettext-example.
 * This is an adaptation of the [TodoMVC](http://todomvc.com/) example. You can use this as a guideline while adding {@link angular-gettext angular-gettext} to your own application.
 * Version 2.4.1
 */
/**
 * @ngdoc factory
 * @module gettext
 * @name gettextPlurals
 * @param {String} [langCode=en] language code
 * @param {Number} [n=0] number to calculate form for
 * @returns {Number} plural form number
 * @description Provides correct plural form id for the given language
 *
 * Example
 * ```js
 * gettextPlurals('ru', 10); // 1
 * gettextPlurals('en', 1);  // 0
 * gettextPlurals();         // 1
 * ```
 */
angular.module('gettext', []);
/**
 * @ngdoc object
 * @module gettext
 * @name gettext
 * @kind function
 * @param {String} str annotation key
 * @description Gettext constant function for annotating strings
 *
 * ```js
 * angular.module('myApp', ['gettext']).config(function(gettext) {
 *   /// MyApp document title
 *   gettext('my-app.title');
 *   ...
 * })
 * ```
 */
angular.module('gettext').constant('gettext', function (str) {
    /*
     * Does nothing, simply returns the input string.
     *
     * This function serves as a marker for `grunt-angular-gettext` to know that
     * this string should be extracted for translations.
     */
    return str;
});

/**
 * @ngdoc service
 * @module gettext
 * @name gettextCatalog
 * @requires gettextPlurals
 * @requires gettextFallbackLanguage
 * @requires https://docs.angularjs.org/api/ng/service/$http $http
 * @requires https://docs.angularjs.org/api/ng/service/$cacheFactory $cacheFactory
 * @requires https://docs.angularjs.org/api/ng/service/$interpolate $interpolate
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope $rootScope
 * @description Provides set of method to translate strings
 */
angular.module('gettext').factory('gettextCatalog', ["gettextPlurals", "gettextFallbackLanguage", "$http", "$cacheFactory", "$interpolate", "$rootScope", function (gettextPlurals, gettextFallbackLanguage, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;
    var noContext = '$$noContext';

    // IE8 returns UPPER CASE tags, even though the source is lower case.
    // This can causes the (key) string in the DOM to have a different case to
    // the string in the `po` files.
    // IE9, IE10 and IE11 reorders the attributes of tags.
    var test = '<span id="test" title="test" class="tested">test</span>';
    var isHTMLModified = (angular.element('<span>' + test + '</span>').html() !== test);

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
            return catalog.debugPrefix + string;
        } else {
            return string;
        }
    };

    var addTranslatedMarkers = function (string) {
        if (catalog.showTranslatedMarkers) {
            return catalog.translatedMarkerPrefix + string + catalog.translatedMarkerSuffix;
        } else {
            return string;
        }
    };

    function broadcastUpdated() {
        /**
         * @ngdoc event
         * @name gettextCatalog#gettextLanguageChanged
         * @eventType broadcast on $rootScope
         * @description Fires language change notification without any additional parameters.
         */
        $rootScope.$broadcast('gettextLanguageChanged');
    }

    catalog = {
        /**
         * @ngdoc property
         * @name gettextCatalog#debug
         * @public
         * @type {Boolean} false
         * @see gettextCatalog#debug
         * @description Whether or not to prefix untranslated strings with `[MISSING]:` or a custom prefix.
         */
        debug: false,
        /**
         * @ngdoc property
         * @name gettextCatalog#debugPrefix
         * @public
         * @type {String} [MISSING]:
         * @description Custom prefix for untranslated strings when {@link gettextCatalog#debug gettextCatalog#debug} set to `true`.
         */
        debugPrefix: '[MISSING]: ',
        /**
         * @ngdoc property
         * @name gettextCatalog#showTranslatedMarkers
         * @public
         * @type {Boolean} false
         * @description Whether or not to wrap all processed text with markers.
         *
         * Example output: `[Welcome]`
         */
        showTranslatedMarkers: false,
        /**
         * @ngdoc property
         * @name gettextCatalog#translatedMarkerPrefix
         * @public
         * @type {String} [
         * @description Custom prefix to mark strings that have been run through {@link angular-gettext angular-gettext}.
         */
        translatedMarkerPrefix: '[',
        /**
         * @ngdoc property
         * @name gettextCatalog#translatedMarkerSuffix
         * @public
         * @type {String} ]
         * @description Custom suffix to mark strings that have been run through {@link angular-gettext angular-gettext}.
         */
        translatedMarkerSuffix: ']',
        /**
         * @ngdoc property
         * @name gettextCatalog#strings
         * @private
         * @type {Object}
         * @description An object of loaded translation strings. Shouldn't be used directly.
         */
        strings: {},
        /**
         * @ngdoc property
         * @name gettextCatalog#baseLanguage
         * @protected
         * @deprecated
         * @since 2.0
         * @type {String} en
         * @description The default language, in which you're application is written.
         *
         * This defaults to English and it's generally a bad idea to use anything else:
         * if your language has different pluralization rules you'll end up with incorrect translations.
         */
        baseLanguage: 'en',
        /**
         * @ngdoc property
         * @name gettextCatalog#currentLanguage
         * @public
         * @type {String}
         * @description Active language.
         */
        currentLanguage: 'en',
        /**
         * @ngdoc property
         * @name gettextCatalog#cache
         * @public
         * @type {String} en
         * @description Language cache for lazy load
         */
        cache: $cacheFactory('strings'),

        /**
         * @ngdoc method
         * @name gettextCatalog#setCurrentLanguage
         * @public
         * @param {String} lang language name
         * @description Sets the current language and makes sure that all translations get updated correctly.
         */
        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
            broadcastUpdated();
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getCurrentLanguage
         * @public
         * @returns {String} current language
         * @description Returns the current language.
         */
        getCurrentLanguage: function () {
            return this.currentLanguage;
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#setStrings
         * @public
         * @param {String} language language name
         * @param {Object.<String>} strings set of strings where the key is the translation `key` and `value` is the translated text
         * @description Processes an object of string definitions. {@link guide:manual-setstrings More details here}.
         */
        setStrings: function (language, strings) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            var defaultPlural = gettextPlurals(language, 1);
            for (var key in strings) {
                var val = strings[key];

                if (isHTMLModified) {
                    // Use the DOM engine to render any HTML in the key (#131).
                    key = angular.element('<span>' + key + '</span>').html();
                }

                if (angular.isString(val) || angular.isArray(val)) {
                    // No context, wrap it in $$noContext.
                    var obj = {};
                    obj[noContext] = val;
                    val = obj;
                }

                if (!this.strings[language][key]) {
                    this.strings[language][key] = {};
                }

                for (var context in val) {
                    var str = val[context];
                    if (!angular.isArray(str)) {
                        // Expand single strings
                        this.strings[language][key][context] = [];
                        this.strings[language][key][context][defaultPlural] = str;
                    } else {
                        this.strings[language][key][context] = str;
                    }
                }
            }

            broadcastUpdated();
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getStringFormFor
         * @protected
         * @param {String} language language name
         * @param {String} string translation key
         * @param {Number=} n number to build string form for
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String|Null} translated or annotated string or null if language is not set
         * @description Translate a string with the given language, count and context.
         */
        getStringFormFor: function (language, string, n, context) {
            if (!language) {
                return null;
            }
            var stringTable = this.strings[language] || {};
            var contexts = stringTable[string] || {};
            var plurals = contexts[context || noContext] || [];
            return plurals[gettextPlurals(language, n)];
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getString
         * @public
         * @param {String} string translation key
         * @param {$rootScope.Scope=} scope scope to do interpolation against
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String} translated or annotated string
         * @description Translate a string with the given scope and context.
         *
         * First it tries {@link gettextCatalog#currentLanguage gettextCatalog#currentLanguage} (e.g. `en-US`) then {@link gettextFallbackLanguage fallback} (e.g. `en`).
         *
         * When `scope` is supplied it uses Angular.JS interpolation, so something like this will do what you expect:
         * ```js
         * var hello = gettextCatalog.getString("Hello {{name}}!", { name: "Ruben" });
         * // var hello will be "Hallo Ruben!" in Dutch.
         * ```
         * Avoid using scopes - this skips interpolation and is a lot faster.
         */
        getString: function (string, scope, context) {
            var fallbackLanguage = gettextFallbackLanguage(this.currentLanguage);
            string = this.getStringFormFor(this.currentLanguage, string, 1, context) ||
                     this.getStringFormFor(fallbackLanguage, string, 1, context) ||
                     prefixDebug(string);
            string = scope ? $interpolate(string)(scope) : string;
            return addTranslatedMarkers(string);
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getPlural
         * @public
         * @param {Number} n number to build string form for
         * @param {String} string translation key
         * @param {String} stringPlural plural translation key
         * @param {$rootScope.Scope=} scope scope to do interpolation against
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String} translated or annotated string
         * @see {@link gettextCatalog#getString gettextCatalog#getString} for details
         * @description Translate a plural string with the given context.
         */
        getPlural: function (n, string, stringPlural, scope, context) {
            var fallbackLanguage = gettextFallbackLanguage(this.currentLanguage);
            string = this.getStringFormFor(this.currentLanguage, string, n, context) ||
                     this.getStringFormFor(fallbackLanguage, string, n, context) ||
                     prefixDebug(n === 1 ? string : stringPlural);
            if (scope) {
                scope.$count = n;
                string = $interpolate(string)(scope);
            }
            return addTranslatedMarkers(string);
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#loadRemote
         * @public
         * @param {String} url location of the translations
         * @description Load a set of translation strings from a given URL.
         *
         * This should be a JSON catalog generated with [angular-gettext-tools](https://github.com/rubenv/angular-gettext-tools).
         * {@link guide:lazy-loading More details here}.
         */
        loadRemote: function (url) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).then(function (response) {
                var data = response.data;
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang]);
                }
                return response;
            });
        }
    };

    return catalog;
}]);

/**
 * @ngdoc directive
 * @module gettext
 * @name translate
 * @requires gettextCatalog
 * @requires gettextUtil
 * @requires https://docs.angularjs.org/api/ng/service/$parse $parse
 * @requires https://docs.angularjs.org/api/ng/service/$animate $animate
 * @requires https://docs.angularjs.org/api/ng/service/$compile $compile
 * @requires https://docs.angularjs.org/api/ng/service/$window $window
 * @restrict AE
 * @param {String} [translatePlural] plural form
 * @param {Number} translateN value to watch to substitute correct plural form
 * @param {String} translateContext context value, e.g. {@link doc:context Verb, Noun}
 * @description Annotates and translates text inside directive
 *
 * Full interpolation support is available in translated strings, so the following will work as expected:
 * ```js
 * <div translate>Hello {{name}}!</div>
 * ```
 *
 * You can also use custom context parameters while interpolating. This approach allows usage
 * of angular filters as well as custom logic inside your translated messages without unnecessary impact on translations.
 *
 * So for example when you have message like this:
 * ```js
 * <div translate>Last modified {{modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'}} by {{author}}.</div>
 * ```
 * you will have it extracted in exact same version so it would look like this:
 * `Last modified {{modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'}} by {{author}}`.
 * To start with it might be too complicated to read and handle by non technical translator. It's easy to make mistake
 * when copying format for example. Secondly if you decide to change format by some point of the project translation will broke
 * as it won't be the same string anymore.
 *
 * Instead your translator should only be concerned to place {{modificationDate}} correctly and you should have a free hand
 * to modify implementation details on how to present the results. This is how you can achieve the goal:
 * ```js
 * <div translate translate-params-modification-date="modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'">Last modified {{modificationDate}} by {{author}}.</div>
 * ```
 *
 * There's a few more things worth to point out:
 * 1. You can use as many parameters as you want. Each parameter begins with `translate-params-` followed by snake-case parameter name.
 * Each parameter will be available for interpolation in camelCase manner (just like angular directive works by default).
 * ```js
 * <div translate translate-params-my-custom-param="param1" translate-params-name="name">Param {{myCustomParam}} has been changed by {{name}}.</div>
 * ```
 * 2. You can rename your variables from current scope to simple ones if you like.
 * ```js
 * <div translate translate-params-date="veryUnintuitiveNameForDate">Today's date is: {{date}}.</div>
 * ```
 * 3. You can use translate-params only for some interpolations. Rest would be treated as usual.
 * ```js
 * <div translate translate-params-cost="cost | currency">This product: {{product}} costs {{cost}}.</div>
 * ```
 */
angular.module('gettext').directive('translate', ["gettextCatalog", "$parse", "$animate", "$compile", "$window", "gettextUtil", function (gettextCatalog, $parse, $animate, $compile, $window, gettextUtil) {
    var msie = parseInt((/msie (\d+)/i.exec($window.navigator.userAgent) || [])[1], 10);
    var PARAMS_PREFIX = 'translateParams';

    function getCtxAttr(key) {
        return gettextUtil.lcFirst(key.replace(PARAMS_PREFIX, ''));
    }

    function handleInterpolationContext(scope, attrs, update) {
        var attributes = Object.keys(attrs).filter(function (key) {
            return gettextUtil.startsWith(key, PARAMS_PREFIX) && key !== PARAMS_PREFIX;
        });

        if (!attributes.length) {
            return null;
        }

        var interpolationContext = scope.$new();
        var unwatchers = [];
        attributes.forEach(function (attribute) {
            var unwatch = scope.$watch(attrs[attribute], function (newVal) {
                var key = getCtxAttr(attribute);
                interpolationContext[key] = newVal;
                update(interpolationContext);
            });
            unwatchers.push(unwatch);
        });
        scope.$on('$destroy', function () {
            unwatchers.forEach(function (unwatch) {
                unwatch();
            });

            interpolationContext.$destroy();
        });
        return interpolationContext;
    }

    return {
        restrict: 'AE',
        terminal: true,
        compile: function compile(element, attrs) {
            // Validate attributes
            gettextUtil.assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
            gettextUtil.assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');

            var msgid = gettextUtil.trim(element.html());
            var translatePlural = attrs.translatePlural;
            var translateContext = attrs.translateContext;

            if (msie <= 8) {
                // Workaround fix relating to angular adding a comment node to
                // anchors. angular/angular.js/#1949 / angular/angular.js/#2013
                if (msgid.slice(-13) === '<!--IE fix-->') {
                    msgid = msgid.slice(0, -13);
                }
            }

            return {
                post: function (scope, element, attrs) {
                    var countFn = $parse(attrs.translateN);
                    var pluralScope = null;
                    var linking = true;

                    function update(interpolationContext) {
                        interpolationContext = interpolationContext || null;

                        // Fetch correct translated string.
                        var translated;
                        if (translatePlural) {
                            scope = pluralScope || (pluralScope = scope.$new());
                            scope.$count = countFn(scope);
                            translated = gettextCatalog.getPlural(scope.$count, msgid, translatePlural, null, translateContext);
                        } else {
                            translated = gettextCatalog.getString(msgid, null, translateContext);
                        }
                        var oldContents = element.contents();

                        if (!oldContents && !translated){
                            return;
                        }

                        // Avoid redundant swaps
                        if (translated === gettextUtil.trim(oldContents.html())){
                            // Take care of unlinked content
                            if (linking){
                                $compile(oldContents)(scope);
                            }
                            return;
                        }

                        // Swap in the translation
                        var newWrapper = angular.element('<span>' + translated + '</span>');
                        $compile(newWrapper.contents())(interpolationContext || scope);
                        var newContents = newWrapper.contents();

                        $animate.enter(newContents, element);
                        $animate.leave(oldContents);
                    }

                    var interpolationContext = handleInterpolationContext(scope, attrs, update);
                    update(interpolationContext);
                    linking = false;

                    if (attrs.translateN) {
                        scope.$watch(attrs.translateN, function () {
                            update(interpolationContext);
                        });
                    }

                    /**
                     * @ngdoc event
                     * @name translate#gettextLanguageChanged
                     * @eventType listen on scope
                     * @description Listens for language updates and changes translation accordingly
                     */
                    scope.$on('gettextLanguageChanged', function () {
                        update(interpolationContext);
                    });

                }
            };
        }
    };
}]);

/**
 * @ngdoc factory
 * @module gettext
 * @name gettextFallbackLanguage
 * @param {String} langCode language code
 * @returns {String|Null} fallback language
 * @description Strips regional code and returns language code only
 *
 * Example
 * ```js
 * gettextFallbackLanguage('ru');     // "null"
 * gettextFallbackLanguage('en_GB');  // "en"
 * gettextFallbackLanguage();         // null
 * ```
 */
angular.module("gettext").factory("gettextFallbackLanguage", function () {
    var cache = {};
    var pattern = /([^_]+)_[^_]+$/;

    return function (langCode) {
        if (cache[langCode]) {
            return cache[langCode];
        }

        var matches = pattern.exec(langCode);
        if (matches) {
            cache[langCode] = matches[1];
            return matches[1];
        }

        return null;
    };
});
/**
 * @ngdoc filter
 * @module gettext
 * @name translate
 * @requires gettextCatalog
 * @param {String} input translation key
 * @param {String} context context to evaluate key against
 * @returns {String} translated string or annotated key
 * @see {@link doc:context Verb, Noun}
 * @description Takes key and returns string
 *
 * Sometimes it's not an option to use an attribute (e.g. when you want to annotate an attribute value).
 * There's a `translate` filter available for this purpose.
 *
 * ```html
 * <input type="text" placeholder="{{'Username'|translate}}" />
 * ```
 * This filter does not support plural strings.
 *
 * You may want to use {@link guide:custom-annotations custom annotations} to avoid using the `translate` filter all the time. * Is
 */
angular.module('gettext').filter('translate', ["gettextCatalog", function (gettextCatalog) {
    function filter(input, context) {
        return gettextCatalog.getString(input, null, context);
    }
    filter.$stateful = true;
    return filter;
}]);

// Do not edit this file, it is autogenerated using genplurals.py!
angular.module("gettext").factory("gettextPlurals", function () {
    var languageCodes = {
        "pt_BR": "pt_BR",
        "pt-BR": "pt_BR"
    };
    return function (langCode, n) {
        switch (getLanguageCode(langCode)) {
            case "ay":  // Aymará
            case "bo":  // Tibetan
            case "cgg": // Chiga
            case "dz":  // Dzongkha
            case "fa":  // Persian
            case "id":  // Indonesian
            case "ja":  // Japanese
            case "jbo": // Lojban
            case "ka":  // Georgian
            case "kk":  // Kazakh
            case "km":  // Khmer
            case "ko":  // Korean
            case "ky":  // Kyrgyz
            case "lo":  // Lao
            case "ms":  // Malay
            case "my":  // Burmese
            case "sah": // Yakut
            case "su":  // Sundanese
            case "th":  // Thai
            case "tt":  // Tatar
            case "ug":  // Uyghur
            case "vi":  // Vietnamese
            case "wo":  // Wolof
            case "zh":  // Chinese
                // 1 form
                return 0;
            case "is":  // Icelandic
                // 2 forms
                return (n%10!=1 || n%100==11) ? 1 : 0;
            case "jv":  // Javanese
                // 2 forms
                return n!=0 ? 1 : 0;
            case "mk":  // Macedonian
                // 2 forms
                return n==1 || n%10==1 ? 0 : 1;
            case "ach": // Acholi
            case "ak":  // Akan
            case "am":  // Amharic
            case "arn": // Mapudungun
            case "br":  // Breton
            case "fil": // Filipino
            case "fr":  // French
            case "gun": // Gun
            case "ln":  // Lingala
            case "mfe": // Mauritian Creole
            case "mg":  // Malagasy
            case "mi":  // Maori
            case "oc":  // Occitan
            case "pt_BR":  // Brazilian Portuguese
            case "tg":  // Tajik
            case "ti":  // Tigrinya
            case "tr":  // Turkish
            case "uz":  // Uzbek
            case "wa":  // Walloon
            case "zh":  // Chinese
                // 2 forms
                return n>1 ? 1 : 0;
            case "lv":  // Latvian
                // 3 forms
                return (n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);
            case "lt":  // Lithuanian
                // 3 forms
                return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);
            case "be":  // Belarusian
            case "bs":  // Bosnian
            case "hr":  // Croatian
            case "ru":  // Russian
            case "sr":  // Serbian
            case "uk":  // Ukrainian
                // 3 forms
                return (n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
            case "mnk": // Mandinka
                // 3 forms
                return (n==0 ? 0 : n==1 ? 1 : 2);
            case "ro":  // Romanian
                // 3 forms
                return (n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);
            case "pl":  // Polish
                // 3 forms
                return (n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
            case "cs":  // Czech
            case "sk":  // Slovak
                // 3 forms
                return (n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;
            case "sl":  // Slovenian
                // 4 forms
                return (n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0);
            case "mt":  // Maltese
                // 4 forms
                return (n==1 ? 0 : n==0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3);
            case "gd":  // Scottish Gaelic
                // 4 forms
                return (n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3;
            case "cy":  // Welsh
                // 4 forms
                return (n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3;
            case "kw":  // Cornish
                // 4 forms
                return (n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3;
            case "ga":  // Irish
                // 5 forms
                return n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4;
            case "ar":  // Arabic
                // 6 forms
                return (n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5);
            default: // Everything else
                return n != 1 ? 1 : 0;
        }
    };

    /**
     * Method extracts iso639-2 language code from code with locale e.g. pl_PL, en_US, etc.
     * If it's provided with standalone iso639-2 language code it simply returns it.
     * @param {String} langCode
     * @returns {String} iso639-2 language Code
     */
    function getLanguageCode(langCode) {
        if (!languageCodes[langCode]) {
            languageCodes[langCode] = langCode.split(/\-|_/).shift();
        }
        return languageCodes[langCode];
    }
});

/**
 * @ngdoc factory
 * @module gettext
 * @name gettextUtil
 * @description Utility service for common operations and polyfills.
 */
angular.module('gettext').factory('gettextUtil', function gettextUtil() {
    /**
     * @ngdoc method
     * @name gettextUtil#trim
     * @public
     * @param {string} value String to be trimmed.
     * @description Trim polyfill for old browsers (instead of jQuery). Based on AngularJS-v1.2.2 (angular.js#620).
     *
     * Example
     * ```js
     * gettextUtil.assert('  no blanks  '); // "no blanks"
     * ```
     */
    var trim = (function () {
        if (!String.prototype.trim) {
            return function (value) {
                return (typeof value === 'string') ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
            };
        }
        return function (value) {
            return (typeof value === 'string') ? value.trim() : value;
        };
    })();

    /**
     * @ngdoc method
     * @name gettextUtil#assert
     * @public
     * @param {bool} condition condition to check
     * @param {String} missing name of the directive missing attribute
     * @param {String} found name of attribute that has been used with directive
     * @description Throws error if condition is not met, which means that directive was used with certain parameter
     * that requires another one (which is missing).
     *
     * Example
     * ```js
     * gettextUtil.assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
     * //You should add a translate-n attribute whenever you add a translate-plural attribute.
     * ```
     */
    function assert(condition, missing, found) {
        if (!condition) {
            throw new Error('You should add a ' + missing + ' attribute whenever you add a ' + found + ' attribute.');
        }
    }

    /**
     * @ngdoc method
     * @name gettextUtil#startsWith
     * @public
     * @param {string} target String on which checking will occur.
     * @param {string} query String expected to be at the beginning of target.
     * @returns {boolean} Returns true if object has no ownProperties. For arrays returns true if length == 0.
     * @description Checks if string starts with another string.
     *
     * Example
     * ```js
     * gettextUtil.startsWith('Home sweet home.', 'Home'); //true
     * gettextUtil.startsWith('Home sweet home.', 'sweet'); //false
     * ```
     */
    function startsWith(target, query) {
        return target.indexOf(query) === 0;
    }

    /**
     * @ngdoc method
     * @name gettextUtil#lcFirst
     * @public
     * @param {string} target String to transform.
     * @returns {string} Strings beginning with lowercase letter.
     * @description Makes first letter of the string lower case
     *
     * Example
     * ```js
     * gettextUtil.lcFirst('Home Sweet Home.'); //'home Sweet Home'
     * gettextUtil.lcFirst('ShouldBeCamelCase.'); //'shouldBeCamelCase'
     * ```
     */
    function lcFirst(target) {
        var first = target.charAt(0).toLowerCase();
        return first + target.substr(1);
    }

    return {
        trim: trim,
        assert: assert,
        startsWith: startsWith,
        lcFirst: lcFirst
    };
});

// https://github.com/oblador/angular-scroll
var duScrollDefaultEasing = function (e) { "use strict"; return .5 > e ? Math.pow(2 * e, 2) / 2 : 1 - Math.pow(2 * (1 - e), 2) / 2 }; angular.module("duScroll", ["duScroll.scrollspy", "duScroll.smoothScroll", "duScroll.scrollContainer", "duScroll.spyContext", "duScroll.scrollHelpers"]).value("duScrollDuration", 350).value("duScrollSpyWait", 100).value("duScrollGreedy", !1).value("duScrollOffset", 0).value("duScrollEasing", duScrollDefaultEasing).value("duScrollCancelOnEvents", "scroll mousedown mousewheel touchmove keydown").value("duScrollBottomSpy", !1).value("duScrollActiveClass", "active"), angular.module("duScroll.scrollHelpers", ["duScroll.requestAnimation"]).run(["$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", "duScrollDuration", "duScrollOffset", "duScrollCancelOnEvents", function (e, t, n, r, o, l, u, i) { "use strict"; var c = {}, a = function (e) { return "undefined" != typeof HTMLDocument && e instanceof HTMLDocument || e.nodeType && e.nodeType === e.DOCUMENT_NODE }, s = function (e) { return "undefined" != typeof HTMLElement && e instanceof HTMLElement || e.nodeType && e.nodeType === e.ELEMENT_NODE }, d = function (e) { return s(e) || a(e) ? e : e[0] }; c.duScrollTo = function (t, n, r, o) { var l; if (angular.isElement(t) ? l = this.duScrollToElement : angular.isDefined(r) && (l = this.duScrollToAnimated), l) return l.apply(this, arguments); var u = d(this); return a(u) ? e.scrollTo(t, n) : (u.scrollLeft = t, void (u.scrollTop = n)) }; var f, p; c.duScrollToAnimated = function (e, l, u, c) { u && !c && (c = o); var a = this.duScrollLeft(), s = this.duScrollTop(), d = Math.round(e - a), m = Math.round(l - s), S = null, g = 0, h = this, v = function (e) { (!e || g && e.which > 0) && (i && h.unbind(i, v), n(f), p.reject(), f = null) }; if (f && v(), p = t.defer(), 0 === u || !d && !m) return 0 === u && h.duScrollTo(e, l), p.resolve(), p.promise; var y = function (e) { null === S && (S = e), g = e - S; var t = g >= u ? 1 : c(g / u); h.scrollTo(a + Math.ceil(d * t), s + Math.ceil(m * t)), 1 > t ? f = r(y) : (i && h.unbind(i, v), f = null, p.resolve()) }; return h.duScrollTo(a, s), i && h.bind(i, v), f = r(y), p.promise }, c.duScrollToElement = function (e, t, n, r) { var o = d(this); (!angular.isNumber(t) || isNaN(t)) && (t = u); var l = this.duScrollTop() + d(e).getBoundingClientRect().top - t; return s(o) && (l -= o.getBoundingClientRect().top), this.duScrollTo(0, l, n, r) }, c.duScrollLeft = function (t, n, r) { if (angular.isNumber(t)) return this.duScrollTo(t, this.duScrollTop(), n, r); var o = d(this); return a(o) ? e.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft : o.scrollLeft }, c.duScrollTop = function (t, n, r) { if (angular.isNumber(t)) return this.duScrollTo(this.duScrollLeft(), t, n, r); var o = d(this); return a(o) ? e.scrollY || document.documentElement.scrollTop || document.body.scrollTop : o.scrollTop }, c.duScrollToElementAnimated = function (e, t, n, r) { return this.duScrollToElement(e, t, n || l, r) }, c.duScrollTopAnimated = function (e, t, n) { return this.duScrollTop(e, t || l, n) }, c.duScrollLeftAnimated = function (e, t, n) { return this.duScrollLeft(e, t || l, n) }, angular.forEach(c, function (e, t) { angular.element.prototype[t] = e; var n = t.replace(/^duScroll/, "scroll"); angular.isUndefined(angular.element.prototype[n]) && (angular.element.prototype[n] = e) }) }]), angular.module("duScroll.polyfill", []).factory("polyfill", ["$window", function (e) { "use strict"; var t = ["webkit", "moz", "o", "ms"]; return function (n, r) { if (e[n]) return e[n]; for (var o, l = n.substr(0, 1).toUpperCase() + n.substr(1), u = 0; u < t.length; u++) if (o = t[u] + l, e[o]) return e[o]; return r } }]), angular.module("duScroll.requestAnimation", ["duScroll.polyfill"]).factory("requestAnimation", ["polyfill", "$timeout", function (e, t) { "use strict"; var n = 0, r = function (e, r) { var o = (new Date).getTime(), l = Math.max(0, 16 - (o - n)), u = t(function () { e(o + l) }, l); return n = o + l, u }; return e("requestAnimationFrame", r) }]).factory("cancelAnimation", ["polyfill", "$timeout", function (e, t) { "use strict"; var n = function (e) { t.cancel(e) }; return e("cancelAnimationFrame", n) }]), angular.module("duScroll.spyAPI", ["duScroll.scrollContainerAPI"]).factory("spyAPI", ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", "duScrollBottomSpy", "duScrollActiveClass", function (e, t, n, r, o, l, u, i, c) { "use strict"; var a = function (o) { var a = !1, s = !1, d = function () { s = !1; var t, u = o.container, a = u[0], d = 0; "undefined" != typeof HTMLElement && a instanceof HTMLElement || a.nodeType && a.nodeType === a.ELEMENT_NODE ? (d = a.getBoundingClientRect().top, t = Math.round(a.scrollTop + a.clientHeight) >= a.scrollHeight) : t = Math.round(n.pageYOffset + n.innerHeight) >= r[0].body.scrollHeight; var f, p, m, S, g, h, v = i && t ? "bottom" : "top"; for (S = o.spies, p = o.currentlyActive, m = void 0, f = 0; f < S.length; f++) g = S[f], h = g.getTargetPosition(), h && (i && t || h.top + g.offset - d < 20 && (l || -1 * h.top + d) < h.height) && (!m || m[v] < h[v]) && (m = { spy: g }, m[v] = h[v]); m && (m = m.spy), p === m || l && !m || (p && (p.$element.removeClass(c), e.$broadcast("duScrollspy:becameInactive", p.$element, angular.element(p.getTargetElement()))), m && (m.$element.addClass(c), e.$broadcast("duScrollspy:becameActive", m.$element, angular.element(m.getTargetElement()))), o.currentlyActive = m) }; return u ? function () { a ? s = !0 : (d(), a = t(function () { a = !1, s && d() }, u, !1)) } : d }, s = {}, d = function (e) { var t = e.$id, n = { spies: [] }; return n.handler = a(n), s[t] = n, e.$on("$destroy", function () { f(e) }), t }, f = function (e) { var t = e.$id, n = s[t], r = n.container; r && r.off("scroll", n.handler), delete s[t] }, p = d(e), m = function (e) { return s[e.$id] ? s[e.$id] : e.$parent ? m(e.$parent) : s[p] }, S = function (e) { var t, n, r = e.$scope; if (r) return m(r); for (n in s) if (t = s[n], -1 !== t.spies.indexOf(e)) return t }, g = function (e) { for (; e.parentNode;) if (e = e.parentNode, e === document) return !0; return !1 }, h = function (e) { var t = S(e); t && (t.spies.push(e), t.container && g(t.container) || (t.container && t.container.off("scroll", t.handler), t.container = o.getContainer(e.$scope), t.container.on("scroll", t.handler).triggerHandler("scroll"))) }, v = function (e) { var t = S(e); e === t.currentlyActive && (t.currentlyActive = null); var n = t.spies.indexOf(e); -1 !== n && t.spies.splice(n, 1), e.$element = null }; return { addSpy: h, removeSpy: v, createContext: d, destroyContext: f, getContextForScope: m } }]), angular.module("duScroll.scrollContainerAPI", []).factory("scrollContainerAPI", ["$document", function (e) { "use strict"; var t = {}, n = function (e, n) { var r = e.$id; return t[r] = n, r }, r = function (e) { return t[e.$id] ? e.$id : e.$parent ? r(e.$parent) : void 0 }, o = function (n) { var o = r(n); return o ? t[o] : e }, l = function (e) { var n = r(e); n && delete t[n] }; return { getContainerId: r, getContainer: o, setContainer: n, removeContainer: l } }]), angular.module("duScroll.smoothScroll", ["duScroll.scrollHelpers", "duScroll.scrollContainerAPI"]).directive("duSmoothScroll", ["duScrollDuration", "duScrollOffset", "scrollContainerAPI", function (e, t, n) { "use strict"; return { link: function (r, o, l) { o.on("click", function (o) { if (l.href && -1 !== l.href.indexOf("#") || "" !== l.duSmoothScroll) { var u = l.href ? l.href.replace(/.*(?=#[^\s]+$)/, "").substring(1) : l.duSmoothScroll, i = document.getElementById(u) || document.getElementsByName(u)[0]; if (i && i.getBoundingClientRect) { o.stopPropagation && o.stopPropagation(), o.preventDefault && o.preventDefault(); var c = l.offset ? parseInt(l.offset, 10) : t, a = l.duration ? parseInt(l.duration, 10) : e, s = n.getContainer(r); s.duScrollToElement(angular.element(i), isNaN(c) ? 0 : c, isNaN(a) ? 0 : a) } } }) } } }]), angular.module("duScroll.spyContext", ["duScroll.spyAPI"]).directive("duSpyContext", ["spyAPI", function (e) { "use strict"; return { restrict: "A", scope: !0, compile: function (t, n, r) { return { pre: function (t, n, r, o) { e.createContext(t) } } } } }]), angular.module("duScroll.scrollContainer", ["duScroll.scrollContainerAPI"]).directive("duScrollContainer", ["scrollContainerAPI", function (e) { "use strict"; return { restrict: "A", scope: !0, compile: function (t, n, r) { return { pre: function (t, n, r, o) { r.$observe("duScrollContainer", function (r) { angular.isString(r) && (r = document.getElementById(r)), r = angular.isElement(r) ? angular.element(r) : n, e.setContainer(t, r), t.$on("$destroy", function () { e.removeContainer(t) }) }) } } } } }]), angular.module("duScroll.scrollspy", ["duScroll.spyAPI"]).directive("duScrollspy", ["spyAPI", "duScrollOffset", "$timeout", "$rootScope", function (e, t, n, r) { "use strict"; var o = function (e, t, n, r) { angular.isElement(e) ? this.target = e : angular.isString(e) && (this.targetId = e), this.$scope = t, this.$element = n, this.offset = r }; return o.prototype.getTargetElement = function () { return !this.target && this.targetId && (this.target = document.getElementById(this.targetId) || document.getElementsByName(this.targetId)[0]), this.target }, o.prototype.getTargetPosition = function () { var e = this.getTargetElement(); return e ? e.getBoundingClientRect() : void 0 }, o.prototype.flushTargetCache = function () { this.targetId && (this.target = void 0) }, { link: function (l, u, i) { var c, a = i.ngHref || i.href; if (a && -1 !== a.indexOf("#") ? c = a.replace(/.*(?=#[^\s]+$)/, "").substring(1) : i.duScrollspy ? c = i.duScrollspy : i.duSmoothScroll && (c = i.duSmoothScroll), c) { var s = n(function () { var n = new o(c, l, u, -(i.offset ? parseInt(i.offset, 10) : t)); e.addSpy(n), l.$on("$locationChangeSuccess", n.flushTargetCache.bind(n)); var a = r.$on("$stateChangeSuccess", n.flushTargetCache.bind(n)); l.$on("$destroy", function () { e.removeSpy(n), a() }) }, 0, !1); l.$on("$destroy", function () { n.cancel(s) }) } } } }]);
//# sourceMappingURL=angular-scroll.min.js.map
/*! 
 * angular-loading-bar v0.9.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2016 Wes Cruver
 * License: MIT
 */
/*
 * angular-loading-bar
 *
 * intercepts XHR requests and creates a loading bar.
 * Based on the excellent nprogress work by rstacruz (more info in readme)
 *
 * (c) 2013 Wes Cruver
 * License: MIT
 */


(function() {

'use strict';

// Alias the loading bar for various backwards compatibilities since the project has matured:
angular.module('angular-loading-bar', ['cfp.loadingBarInterceptor']);
angular.module('chieffancypants.loadingBar', ['cfp.loadingBarInterceptor']);


/**
 * loadingBarInterceptor service
 *
 * Registers itself as an Angular interceptor and listens for XHR requests.
 */
angular.module('cfp.loadingBarInterceptor', ['cfp.loadingBar'])
  .config(['$httpProvider', function ($httpProvider) {

    var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log', 'cfpLoadingBar', function ($q, $cacheFactory, $timeout, $rootScope, $log, cfpLoadingBar) {

      /**
       * The total number of requests made
       */
      var reqsTotal = 0;

      /**
       * The number of requests completed (either successfully or not)
       */
      var reqsCompleted = 0;

      /**
       * The amount of time spent fetching before showing the loading bar
       */
      var latencyThreshold = cfpLoadingBar.latencyThreshold;

      /**
       * $timeout handle for latencyThreshold
       */
      var startTimeout;


      /**
       * calls cfpLoadingBar.complete() which removes the
       * loading bar from the DOM.
       */
      function setComplete() {
        $timeout.cancel(startTimeout);
        cfpLoadingBar.complete();
        reqsCompleted = 0;
        reqsTotal = 0;
      }

      /**
       * Determine if the response has already been cached
       * @param  {Object}  config the config option from the request
       * @return {Boolean} retrns true if cached, otherwise false
       */
      function isCached(config) {
        var cache;
        var defaultCache = $cacheFactory.get('$http');
        var defaults = $httpProvider.defaults;

        // Choose the proper cache source. Borrowed from angular: $http service
        if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
            cache = angular.isObject(config.cache) ? config.cache
              : angular.isObject(defaults.cache) ? defaults.cache
              : defaultCache;
        }

        var cached = cache !== undefined ?
          cache.get(config.url) !== undefined : false;

        if (config.cached !== undefined && cached !== config.cached) {
          return config.cached;
        }
        config.cached = cached;
        return cached;
      }


      return {
        'request': function(config) {
          // Check to make sure this request hasn't already been cached and that
          // the requester didn't explicitly ask us to ignore this request:
          if (!config.ignoreLoadingBar && !isCached(config)) {
            $rootScope.$broadcast('cfpLoadingBar:loading', {url: config.url});
            if (reqsTotal === 0) {
              startTimeout = $timeout(function() {
                cfpLoadingBar.start();
              }, latencyThreshold);
            }
            reqsTotal++;
            cfpLoadingBar.set(reqsCompleted / reqsTotal);
          }
          return config;
        },

        'response': function(response) {
          if (!response || !response.config) {
            $log.error('Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50');
            return response;
          }

          if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: response.config.url, result: response});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              cfpLoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return response;
        },

        'responseError': function(rejection) {
          if (!rejection || !rejection.config) {
            $log.error('Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50');
            return $q.reject(rejection);
          }

          if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: rejection.config.url, result: rejection});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              cfpLoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return $q.reject(rejection);
        }
      };
    }];

    $httpProvider.interceptors.push(interceptor);
  }]);


/**
 * Loading Bar
 *
 * This service handles adding and removing the actual element in the DOM.
 * Generally, best practices for DOM manipulation is to take place in a
 * directive, but because the element itself is injected in the DOM only upon
 * XHR requests, and it's likely needed on every view, the best option is to
 * use a service.
 */
angular.module('cfp.loadingBar', [])
  .provider('cfpLoadingBar', function() {

    this.autoIncrement = true;
    this.includeSpinner = true;
    this.includeBar = true;
    this.latencyThreshold = 100;
    this.startSize = 0.02;
    this.parentSelector = 'body';
    this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
    this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>';

    this.$get = ['$injector', '$document', '$timeout', '$rootScope', function ($injector, $document, $timeout, $rootScope) {
      var $animate;
      var $parentSelector = this.parentSelector,
        loadingBarContainer = angular.element(this.loadingBarTemplate),
        loadingBar = loadingBarContainer.find('div').eq(0),
        spinner = angular.element(this.spinnerTemplate);

      var incTimeout,
        completeTimeout,
        started = false,
        status = 0;

      var autoIncrement = this.autoIncrement;
      var includeSpinner = this.includeSpinner;
      var includeBar = this.includeBar;
      var startSize = this.startSize;

      /**
       * Inserts the loading bar element into the dom, and sets it to 2%
       */
      function _start() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        $timeout.cancel(completeTimeout);

        // do not continually broadcast the started event:
        if (started) {
          return;
        }

        var document = $document[0];
        var parent = document.querySelector ?
          document.querySelector($parentSelector)
          : $document.find($parentSelector)[0]
        ;

        if (! parent) {
          parent = document.getElementsByTagName('body')[0];
        }

        var $parent = angular.element(parent);
        var $after = parent.lastChild && angular.element(parent.lastChild);

        $rootScope.$broadcast('cfpLoadingBar:started');
        started = true;

        if (includeBar) {
          $animate.enter(loadingBarContainer, $parent, $after);
        }

        if (includeSpinner) {
          $animate.enter(spinner, $parent, loadingBarContainer);
        }

        _set(startSize);
      }

      /**
       * Set the loading bar's width to a certain percent.
       *
       * @param n any value between 0 and 1
       */
      function _set(n) {
        if (!started) {
          return;
        }
        var pct = (n * 100) + '%';
        loadingBar.css('width', pct);
        status = n;

        // increment loadingbar to give the illusion that there is always
        // progress but make sure to cancel the previous timeouts so we don't
        // have multiple incs running at the same time.
        if (autoIncrement) {
          $timeout.cancel(incTimeout);
          incTimeout = $timeout(function() {
            _inc();
          }, 250);
        }
      }

      /**
       * Increments the loading bar by a random amount
       * but slows down as it progresses
       */
      function _inc() {
        if (_status() >= 1) {
          return;
        }

        var rnd = 0;

        // TODO: do this mathmatically instead of through conditions

        var stat = _status();
        if (stat >= 0 && stat < 0.25) {
          // Start out between 3 - 6% increments
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
          // increment between 0 - 3%
          rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
          // increment between 0 - 2%
          rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
          // finally, increment it .5 %
          rnd = 0.005;
        } else {
          // after 99%, don't increment:
          rnd = 0;
        }

        var pct = _status() + rnd;
        _set(pct);
      }

      function _status() {
        return status;
      }

      function _completeAnimation() {
        status = 0;
        started = false;
      }

      function _complete() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        $rootScope.$broadcast('cfpLoadingBar:completed');
        _set(1);

        $timeout.cancel(completeTimeout);

        // Attempt to aggregate any start/complete calls within 500ms:
        completeTimeout = $timeout(function() {
          var promise = $animate.leave(loadingBarContainer, _completeAnimation);
          if (promise && promise.then) {
            promise.then(_completeAnimation);
          }
          $animate.leave(spinner);
        }, 500);
      }

      return {
        start            : _start,
        set              : _set,
        status           : _status,
        inc              : _inc,
        complete         : _complete,
        autoIncrement    : this.autoIncrement,
        includeSpinner   : this.includeSpinner,
        latencyThreshold : this.latencyThreshold,
        parentSelector   : this.parentSelector,
        startSize        : this.startSize
      };


    }];     //
  });       // wtf javascript. srsly
})();       //

(function (window) {
    'use strict';
    angular.module('tmh.dynamicLocale', []).provider('tmhDynamicLocale', function () {

        var defaultLocale,
          localeLocationPattern = 'angular/i18n/angular-locale_{{locale}}.js',
          storageFactory = 'tmhDynamicLocaleStorageCache',
          storage,
          storeKey = 'tmhDynamicLocale.locale',
          promiseCache = {},
          activeLocale;

        /**
         * Loads a script asynchronously
         *
         * @param {string} url The url for the script
         @ @param {function) callback A function to be called once the script is loaded
         */
        function loadScript(url, callback, errorCallback, $timeout) {
            var script = document.createElement('script'),
              body = document.getElementsByTagName('body')[0],
              removed = false;

            script.type = 'text/javascript';
            if (script.readyState) { // IE
                script.onreadystatechange = function () {
                    if (script.readyState === 'complete' ||
                        script.readyState === 'loaded') {
                        script.onreadystatechange = null;
                        $timeout(
                          function () {
                              if (removed) return;
                              removed = true;
                              body.removeChild(script);
                              callback();
                          }, 30, false);
                    }
                };
            } else { // Others
                script.onload = function () {
                    if (removed) return;
                    removed = true;
                    body.removeChild(script);
                    callback();
                };
                script.onerror = function () {
                    if (removed) return;
                    removed = true;
                    body.removeChild(script);
                    errorCallback();
                };
            }
            script.src = url;
            script.async = false;
            body.appendChild(script);
        }

        /**
         * Loads a locale and replaces the properties from the current locale with the new locale information
         *
         * @param localeUrl The path to the new locale
         * @param $locale The locale at the curent scope
         */
        function loadLocale(localeUrl, $locale, localeId, $rootScope, $q, localeCache, $timeout) {

            function overrideValues(oldObject, newObject) {
                if (activeLocale !== localeId) {
                    return;
                }
                angular.forEach(oldObject, function (value, key) {
                    if (!newObject[key]) {
                        delete oldObject[key];
                    } else if (angular.isArray(newObject[key])) {
                        oldObject[key].length = newObject[key].length;
                    }
                });
                angular.forEach(newObject, function (value, key) {
                    if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
                        if (!oldObject[key]) {
                            oldObject[key] = angular.isArray(newObject[key]) ? [] : {};
                        }
                        overrideValues(oldObject[key], newObject[key]);
                    } else {
                        oldObject[key] = newObject[key];
                    }
                });
            }


            if (promiseCache[localeId]) return promiseCache[localeId];

            var cachedLocale,
              deferred = $q.defer();
            if (localeId === activeLocale) {
                deferred.resolve($locale);
            } else if ((cachedLocale = localeCache.get(localeId))) {
                activeLocale = localeId;
                $rootScope.$evalAsync(function () {
                    overrideValues($locale, cachedLocale);
                    $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
                    storage.put(storeKey, localeId);
                    deferred.resolve($locale);
                });
            } else {
                activeLocale = localeId;
                promiseCache[localeId] = deferred.promise;
                loadScript(localeUrl, function () {
                    // Create a new injector with the new locale
                    var localInjector = angular.injector(['ngLocale']),
                      externalLocale = localInjector.get('$locale');

                    overrideValues($locale, externalLocale);
                    localeCache.put(localeId, externalLocale);
                    delete promiseCache[localeId];

                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
                        storage.put(storeKey, localeId);
                        deferred.resolve($locale);
                    });
                }, function () {
                    delete promiseCache[localeId];

                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('$localeChangeError', localeId);
                        deferred.reject(localeId);
                    });
                }, $timeout);
            }
            return deferred.promise;
        }

        this.localeLocationPattern = function (value) {
            if (value) {
                localeLocationPattern = value;
                return this;
            } else {
                return localeLocationPattern;
            }
        };

        this.useStorage = function (storageName) {
            storageFactory = storageName;
        };

        this.useCookieStorage = function () {
            this.useStorage('$cookieStore');
        };

        this.defaultLocale = function (value) {
            defaultLocale = value;
        };

        this.$get = ['$rootScope', '$injector', '$interpolate', '$locale', '$q', 'tmhDynamicLocaleCache', '$timeout', function ($rootScope, $injector, interpolate, locale, $q, tmhDynamicLocaleCache, $timeout) {
            var localeLocation = interpolate(localeLocationPattern);

            storage = $injector.get(storageFactory);
            $rootScope.$evalAsync(function () {
                var initialLocale;
                if ((initialLocale = (storage.get(storeKey) || defaultLocale))) {
                    loadLocale(localeLocation({ locale: initialLocale }), locale, initialLocale, $rootScope, $q, tmhDynamicLocaleCache, $timeout);
                }
            });
            return {
                /**
                 * @ngdoc method
                 * @description
                 * @param {string=} value Sets the locale to the new locale. Changing the locale will trigger
                 *    a background task that will retrieve the new locale and configure the current $locale
                 *    instance with the information from the new locale
                 */
                set: function (value) {
                    return loadLocale(localeLocation({ locale: value }), locale, value, $rootScope, $q, tmhDynamicLocaleCache, $timeout);
                }
            };
        }];
    }).provider('tmhDynamicLocaleCache', function () {
        this.$get = ['$cacheFactory', function ($cacheFactory) {
            return $cacheFactory('tmh.dynamicLocales');
        }];
    }).provider('tmhDynamicLocaleStorageCache', function () {
        this.$get = ['$cacheFactory', function ($cacheFactory) {
            return $cacheFactory('tmh.dynamicLocales.store');
        }];
    }).run(['tmhDynamicLocale', angular.noop]);
}(window));
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.alert", "ui.bootstrap.dropdown", "ui.bootstrap.multiMap", "ui.bootstrap.position", "ui.bootstrap.modal", "ui.bootstrap.stackedMap", "ui.bootstrap.popover", "ui.bootstrap.tooltip"]), angular.module("ui.bootstrap.tpls", ["uib/template/alert/alert.html", "uib/template/modal/window.html", "uib/template/popover/popover-html.html", "uib/template/popover/popover-template.html", "uib/template/popover/popover.html", "uib/template/tooltip/tooltip-html-popup.html", "uib/template/tooltip/tooltip-popup.html", "uib/template/tooltip/tooltip-template-popup.html"]), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$element", "$attrs", "$interpolate", "$timeout", function (t, e, o, n, i) { t.closeable = !!o.close, e.addClass("alert"), o.$set("role", "alert"), t.closeable && e.addClass("alert-dismissible"); var r = angular.isDefined(o.dismissOnTimeout) ? n(o.dismissOnTimeout)(t.$parent) : null; r && i(function () { t.close() }, parseInt(r, 10)) }]).directive("uibAlert", function () { return { controller: "UibAlertController", controllerAs: "alert", restrict: "A", templateUrl: function (t, e) { return e.templateUrl || "uib/template/alert/alert.html" }, transclude: !0, scope: { close: "&" } } }), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.multiMap", "ui.bootstrap.position"]).constant("uibDropdownConfig", { appendToOpenClass: "uib-dropdown-open", openClass: "open" }).service("uibDropdownService", ["$document", "$rootScope", "$$multiMap", function (t, e, o) { var n = null, i = o.createNew(); this.isOnlyOpen = function (t, e) { var o = i.get(e); if (o) { var n = o.reduce(function (e, o) { return o.scope === t ? o : e }, {}); if (n) return 1 === o.length } return !1 }, this.open = function (e, o, l) { if (n || t.on("click", r), n && n !== e && (n.isOpen = !1), n = e, l) { var a = i.get(l); if (a) { var p = a.map(function (t) { return t.scope }); -1 === p.indexOf(e) && i.put(l, { scope: e }) } else i.put(l, { scope: e }) } }, this.close = function (e, o, l) { if (n === e && (t.off("click", r), t.off("keydown", this.keybindFilter), n = null), l) { var a = i.get(l); if (a) { var p = a.reduce(function (t, o) { return o.scope === e ? o : t }, {}); p && i.remove(l, p) } } }; var r = function (t) { if (n && n.isOpen && !(t && "disabled" === n.getAutoClose() || t && 3 === t.which)) { var o = n.getToggleElement(); if (!(t && o && o[0].contains(t.target))) { var i = n.getDropdownElement(); t && "outsideClick" === n.getAutoClose() && i && i[0].contains(t.target) || (n.focusToggleElement(), n.isOpen = !1, e.$$phase || n.$apply()) } } }; this.keybindFilter = function (t) { if (n) { var e = n.getDropdownElement(), o = n.getToggleElement(), i = e && e[0].contains(t.target), l = o && o[0].contains(t.target); 27 === t.which ? (t.stopPropagation(), n.focusToggleElement(), r()) : n.isKeynavEnabled() && -1 !== [38, 40].indexOf(t.which) && n.isOpen && (i || l) && (t.preventDefault(), t.stopPropagation(), n.focusDropdownEntry(t.which)) } } }]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function (t, e, o, n, i, r, l, a, p, u, s) { function c() { e.append(m.dropdownMenu) } var d, f, m = this, h = t.$new(), v = i.appendToOpenClass, b = i.openClass, g = angular.noop, w = o.onToggle ? n(o.onToggle) : angular.noop, $ = !1, y = p.find("body"); e.addClass("dropdown"), this.init = function () { o.isOpen && (f = n(o.isOpen), g = f.assign, t.$watch(f, function (t) { h.isOpen = !!t })), $ = angular.isDefined(o.keyboardNav) }, this.toggle = function (t) { return h.isOpen = arguments.length ? !!t : !h.isOpen, angular.isFunction(g) && g(h, h.isOpen), h.isOpen }, this.isOpen = function () { return h.isOpen }, h.getToggleElement = function () { return m.toggleElement }, h.getAutoClose = function () { return o.autoClose || "always" }, h.getElement = function () { return e }, h.isKeynavEnabled = function () { return $ }, h.focusDropdownEntry = function (t) { var o = m.dropdownMenu ? angular.element(m.dropdownMenu).find("a") : e.find("ul").eq(0).find("a"); switch (t) { case 40: m.selectedOption = angular.isNumber(m.selectedOption) ? m.selectedOption === o.length - 1 ? m.selectedOption : m.selectedOption + 1 : 0; break; case 38: m.selectedOption = angular.isNumber(m.selectedOption) ? 0 === m.selectedOption ? 0 : m.selectedOption - 1 : o.length - 1 } o[m.selectedOption].focus() }, h.getDropdownElement = function () { return m.dropdownMenu }, h.focusToggleElement = function () { m.toggleElement && m.toggleElement[0].focus() }, h.$watch("isOpen", function (i, f) { var $ = null, C = !1; if (angular.isDefined(o.dropdownAppendTo)) { var k = n(o.dropdownAppendTo)(h); k && ($ = angular.element(k)) } if (angular.isDefined(o.dropdownAppendToBody)) { var T = n(o.dropdownAppendToBody)(h); T !== !1 && (C = !0) } if (C && !$ && ($ = y), $ && m.dropdownMenu && (i ? ($.append(m.dropdownMenu), e.on("$destroy", c)) : (e.off("$destroy", c), c())), $ && m.dropdownMenu) { var E, O, D, M = a.positionElements(e, m.dropdownMenu, "bottom-left", !0), x = 0; if (E = { top: M.top + "px", display: i ? "block" : "none" }, O = m.dropdownMenu.hasClass("dropdown-menu-right"), O ? (E.left = "auto", D = a.scrollbarPadding($), D.heightOverflow && D.scrollbarWidth && (x = D.scrollbarWidth), E.right = window.innerWidth - x - (M.left + e.prop("offsetWidth")) + "px") : (E.left = M.left + "px", E.right = "auto"), !C) { var S = a.offset($); E.top = M.top - S.top + "px", O ? E.right = window.innerWidth - (M.left - S.left + e.prop("offsetWidth")) + "px" : E.left = M.left - S.left + "px" } m.dropdownMenu.css(E) } var A = $ ? $ : e, P = $ ? v : b, N = A.hasClass(P), I = r.isOnlyOpen(t, $); if (N === !i) { var R; R = $ ? I ? "removeClass" : "addClass" : i ? "addClass" : "removeClass", l[R](A, P).then(function () { angular.isDefined(i) && i !== f && w(t, { open: !!i }) }) } if (i) m.dropdownMenuTemplateUrl ? s(m.dropdownMenuTemplateUrl).then(function (t) { d = h.$new(), u(t.trim())(d, function (t) { var e = t; m.dropdownMenu.replaceWith(e), m.dropdownMenu = e, p.on("keydown", r.keybindFilter) }) }) : p.on("keydown", r.keybindFilter), h.focusToggleElement(), r.open(h, e, $); else { if (r.close(h, e, $), m.dropdownMenuTemplateUrl) { d && d.$destroy(); var U = angular.element('<ul class="dropdown-menu"></ul>'); m.dropdownMenu.replaceWith(U), m.dropdownMenu = U } m.selectedOption = null } angular.isFunction(g) && g(t, i) }) }]).directive("uibDropdown", function () { return { controller: "UibDropdownController", link: function (t, e, o, n) { n.init() } } }).directive("uibDropdownMenu", function () { return { restrict: "A", require: "?^uibDropdown", link: function (t, e, o, n) { if (n && !angular.isDefined(o.dropdownNested)) { e.addClass("dropdown-menu"); var i = o.templateUrl; i && (n.dropdownMenuTemplateUrl = i), n.dropdownMenu || (n.dropdownMenu = e) } } } }).directive("uibDropdownToggle", function () { return { require: "?^uibDropdown", link: function (t, e, o, n) { if (n) { e.addClass("dropdown-toggle"), n.toggleElement = e; var i = function (i) { i.preventDefault(), e.hasClass("disabled") || o.disabled || t.$apply(function () { n.toggle() }) }; e.on("click", i), e.attr({ "aria-haspopup": !0, "aria-expanded": !1 }), t.$watch(n.isOpen, function (t) { e.attr("aria-expanded", !!t) }), t.$on("$destroy", function () { e.off("click", i) }) } } } }), angular.module("ui.bootstrap.multiMap", []).factory("$$multiMap", function () { return { createNew: function () { var t = {}; return { entries: function () { return Object.keys(t).map(function (e) { return { key: e, value: t[e] } }) }, get: function (e) { return t[e] }, hasKey: function (e) { return !!t[e] }, keys: function () { return Object.keys(t) }, put: function (e, o) { t[e] || (t[e] = []), t[e].push(o) }, remove: function (e, o) { var n = t[e]; if (n) { var i = n.indexOf(o); -1 !== i && n.splice(i, 1), n.length || delete t[e] } } } } } }), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function (t, e) { var o, n, i = { normal: /(auto|scroll)/, hidden: /(auto|scroll|hidden)/ }, r = { auto: /\s?auto?\s?/i, primary: /^(top|bottom|left|right)$/, secondary: /^(top|bottom|left|right|center)$/, vertical: /^(top|bottom)$/ }, l = /(HTML|BODY)/; return { getRawNode: function (t) { return t.nodeName ? t : t[0] || t }, parseStyle: function (t) { return t = parseFloat(t), isFinite(t) ? t : 0 }, offsetParent: function (o) { function n(t) { return "static" === (e.getComputedStyle(t).position || "static") } o = this.getRawNode(o); for (var i = o.offsetParent || t[0].documentElement; i && i !== t[0].documentElement && n(i) ;) i = i.offsetParent; return i || t[0].documentElement }, scrollbarWidth: function (i) { if (i) { if (angular.isUndefined(n)) { var r = t.find("body"); r.addClass("uib-position-body-scrollbar-measure"), n = e.innerWidth - r[0].clientWidth, n = isFinite(n) ? n : 0, r.removeClass("uib-position-body-scrollbar-measure") } return n } if (angular.isUndefined(o)) { var l = angular.element('<div class="uib-position-scrollbar-measure"></div>'); t.find("body").append(l), o = l[0].offsetWidth - l[0].clientWidth, o = isFinite(o) ? o : 0, l.remove() } return o }, scrollbarPadding: function (t) { t = this.getRawNode(t); var o = e.getComputedStyle(t), n = this.parseStyle(o.paddingRight), i = this.parseStyle(o.paddingBottom), r = this.scrollParent(t, !1, !0), a = this.scrollbarWidth(l.test(r.tagName)); return { scrollbarWidth: a, widthOverflow: r.scrollWidth > r.clientWidth, right: n + a, originalRight: n, heightOverflow: r.scrollHeight > r.clientHeight, bottom: i + a, originalBottom: i } }, isScrollable: function (t, o) { t = this.getRawNode(t); var n = o ? i.hidden : i.normal, r = e.getComputedStyle(t); return n.test(r.overflow + r.overflowY + r.overflowX) }, scrollParent: function (o, n, r) { o = this.getRawNode(o); var l = n ? i.hidden : i.normal, a = t[0].documentElement, p = e.getComputedStyle(o); if (r && l.test(p.overflow + p.overflowY + p.overflowX)) return o; var u = "absolute" === p.position, s = o.parentElement || a; if (s === a || "fixed" === p.position) return a; for (; s.parentElement && s !== a;) { var c = e.getComputedStyle(s); if (u && "static" !== c.position && (u = !1), !u && l.test(c.overflow + c.overflowY + c.overflowX)) break; s = s.parentElement } return s }, position: function (o, n) { o = this.getRawNode(o); var i = this.offset(o); if (n) { var r = e.getComputedStyle(o); i.top -= this.parseStyle(r.marginTop), i.left -= this.parseStyle(r.marginLeft) } var l = this.offsetParent(o), a = { top: 0, left: 0 }; return l !== t[0].documentElement && (a = this.offset(l), a.top += l.clientTop - l.scrollTop, a.left += l.clientLeft - l.scrollLeft), { width: Math.round(angular.isNumber(i.width) ? i.width : o.offsetWidth), height: Math.round(angular.isNumber(i.height) ? i.height : o.offsetHeight), top: Math.round(i.top - a.top), left: Math.round(i.left - a.left) } }, offset: function (o) { o = this.getRawNode(o); var n = o.getBoundingClientRect(); return { width: Math.round(angular.isNumber(n.width) ? n.width : o.offsetWidth), height: Math.round(angular.isNumber(n.height) ? n.height : o.offsetHeight), top: Math.round(n.top + (e.pageYOffset || t[0].documentElement.scrollTop)), left: Math.round(n.left + (e.pageXOffset || t[0].documentElement.scrollLeft)) } }, viewportOffset: function (o, n, i) { o = this.getRawNode(o), i = i !== !1 ? !0 : !1; var r = o.getBoundingClientRect(), l = { top: 0, left: 0, bottom: 0, right: 0 }, a = n ? t[0].documentElement : this.scrollParent(o), p = a.getBoundingClientRect(); if (l.top = p.top + a.clientTop, l.left = p.left + a.clientLeft, a === t[0].documentElement && (l.top += e.pageYOffset, l.left += e.pageXOffset), l.bottom = l.top + a.clientHeight, l.right = l.left + a.clientWidth, i) { var u = e.getComputedStyle(a); l.top += this.parseStyle(u.paddingTop), l.bottom -= this.parseStyle(u.paddingBottom), l.left += this.parseStyle(u.paddingLeft), l.right -= this.parseStyle(u.paddingRight) } return { top: Math.round(r.top - l.top), bottom: Math.round(l.bottom - r.bottom), left: Math.round(r.left - l.left), right: Math.round(l.right - r.right) } }, parsePlacement: function (t) { var e = r.auto.test(t); return e && (t = t.replace(r.auto, "")), t = t.split("-"), t[0] = t[0] || "top", r.primary.test(t[0]) || (t[0] = "top"), t[1] = t[1] || "center", r.secondary.test(t[1]) || (t[1] = "center"), t[2] = e ? !0 : !1, t }, positionElements: function (t, o, n, i) { t = this.getRawNode(t), o = this.getRawNode(o); var l = angular.isDefined(o.offsetWidth) ? o.offsetWidth : o.prop("offsetWidth"), a = angular.isDefined(o.offsetHeight) ? o.offsetHeight : o.prop("offsetHeight"); n = this.parsePlacement(n); var p = i ? this.offset(t) : this.position(t), u = { top: 0, left: 0, placement: "" }; if (n[2]) { var s = this.viewportOffset(t, i), c = e.getComputedStyle(o), d = { width: l + Math.round(Math.abs(this.parseStyle(c.marginLeft) + this.parseStyle(c.marginRight))), height: a + Math.round(Math.abs(this.parseStyle(c.marginTop) + this.parseStyle(c.marginBottom))) }; if (n[0] = "top" === n[0] && d.height > s.top && d.height <= s.bottom ? "bottom" : "bottom" === n[0] && d.height > s.bottom && d.height <= s.top ? "top" : "left" === n[0] && d.width > s.left && d.width <= s.right ? "right" : "right" === n[0] && d.width > s.right && d.width <= s.left ? "left" : n[0], n[1] = "top" === n[1] && d.height - p.height > s.bottom && d.height - p.height <= s.top ? "bottom" : "bottom" === n[1] && d.height - p.height > s.top && d.height - p.height <= s.bottom ? "top" : "left" === n[1] && d.width - p.width > s.right && d.width - p.width <= s.left ? "right" : "right" === n[1] && d.width - p.width > s.left && d.width - p.width <= s.right ? "left" : n[1], "center" === n[1]) if (r.vertical.test(n[0])) { var f = p.width / 2 - l / 2; s.left + f < 0 && d.width - p.width <= s.right ? n[1] = "left" : s.right + f < 0 && d.width - p.width <= s.left && (n[1] = "right") } else { var m = p.height / 2 - d.height / 2; s.top + m < 0 && d.height - p.height <= s.bottom ? n[1] = "top" : s.bottom + m < 0 && d.height - p.height <= s.top && (n[1] = "bottom") } } switch (n[0]) { case "top": u.top = p.top - a; break; case "bottom": u.top = p.top + p.height; break; case "left": u.left = p.left - l; break; case "right": u.left = p.left + p.width } switch (n[1]) { case "top": u.top = p.top; break; case "bottom": u.top = p.top + p.height - a; break; case "left": u.left = p.left; break; case "right": u.left = p.left + p.width - l; break; case "center": r.vertical.test(n[0]) ? u.left = p.left + p.width / 2 - l / 2 : u.top = p.top + p.height / 2 - a / 2 } return u.top = Math.round(u.top), u.left = Math.round(u.left), u.placement = "center" === n[1] ? n[0] : n[0] + "-" + n[1], u }, adjustTop: function (t, e, o, n) { return -1 !== t.indexOf("top") && o !== n ? { top: e.top - n + "px" } : void 0 }, positionArrow: function (t, o) { t = this.getRawNode(t); var n = t.querySelector(".tooltip-inner, .popover-inner"); if (n) { var i = angular.element(n).hasClass("tooltip-inner"), l = t.querySelector(i ? ".tooltip-arrow" : ".arrow"); if (l) { var a = { top: "", bottom: "", left: "", right: "" }; if (o = this.parsePlacement(o), "center" === o[1]) return void angular.element(l).css(a); var p = "border-" + o[0] + "-width", u = e.getComputedStyle(l)[p], s = "border-"; s += r.vertical.test(o[0]) ? o[0] + "-" + o[1] : o[1] + "-" + o[0], s += "-radius"; var c = e.getComputedStyle(i ? n : t)[s]; switch (o[0]) { case "top": a.bottom = i ? "0" : "-" + u; break; case "bottom": a.top = i ? "0" : "-" + u; break; case "left": a.right = i ? "0" : "-" + u; break; case "right": a.left = i ? "0" : "-" + u } a[o[1]] = c, angular.element(l).css(a) } } } } }]), angular.module("ui.bootstrap.modal", ["ui.bootstrap.multiMap", "ui.bootstrap.stackedMap", "ui.bootstrap.position"]).provider("$uibResolve", function () { var t = this; this.resolver = null, this.setResolver = function (t) { this.resolver = t }, this.$get = ["$injector", "$q", function (e, o) { var n = t.resolver ? e.get(t.resolver) : null; return { resolve: function (t, i, r, l) { if (n) return n.resolve(t, i, r, l); var a = []; return angular.forEach(t, function (t) { a.push(angular.isFunction(t) || angular.isArray(t) ? o.resolve(e.invoke(t)) : angular.isString(t) ? o.resolve(e.get(t)) : o.resolve(t)) }), o.all(a).then(function (e) { var o = {}, n = 0; return angular.forEach(t, function (t, i) { o[i] = e[n++] }), o }) } } }] }).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function (t, e, o) { function n(e, n, i) { i.modalInClass && (t.addClass(n, i.modalInClass), e.$on(o.NOW_CLOSING_EVENT, function (o, r) { var l = r(); e.modalOptions.animation ? t.removeClass(n, i.modalInClass).then(l) : l() })) } return { restrict: "A", compile: function (t, e) { return t.addClass(e.backdropClass), n } } }]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function (t, e, o, n) { return { scope: { index: "@" }, restrict: "A", transclude: !0, templateUrl: function (t, e) { return e.templateUrl || "uib/template/modal/window.html" }, link: function (i, r, l) { r.addClass(l.windowTopClass || ""), i.size = l.size, i.close = function (e) { var o = t.getTop(); o && o.value.backdrop && "static" !== o.value.backdrop && e.target === e.currentTarget && (e.preventDefault(), e.stopPropagation(), t.dismiss(o.key, "backdrop click")) }, r.on("click", i.close), i.$isRendered = !0; var a = e.defer(); i.$$postDigest(function () { a.resolve() }), a.promise.then(function () { var a = null; l.modalInClass && (a = o(r, { addClass: l.modalInClass }).start(), i.$on(t.NOW_CLOSING_EVENT, function (t, e) { var n = e(); o(r, { removeClass: l.modalInClass }).start().then(n) })), e.when(a).then(function () { var e = t.getTop(); if (e && t.modalRendered(e.key), !n[0].activeElement || !r[0].contains(n[0].activeElement)) { var o = r[0].querySelector("[autofocus]"); o ? o.focus() : r[0].focus() } }) }) } } }]).directive("uibModalAnimationClass", function () { return { compile: function (t, e) { e.modalAnimation && t.addClass(e.uibModalAnimationClass) } } }).directive("uibModalTransclude", ["$animate", function (t) { return { link: function (e, o, n, i, r) { r(e.$parent, function (e) { o.empty(), t.enter(e, o) }) } } }]).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function (t, e, o, n, i, r, l, a, p) { function u(t) { var e = "-"; return t.replace(S, function (t, o) { return (o ? e : "") + t.toLowerCase() }) } function s(t) { return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length) } function c() { for (var t = -1, e = k.keys(), o = 0; o < e.length; o++) k.get(e[o]).value.backdrop && (t = o); return t > -1 && O > t && (t = O), t } function d(t, e) { var o = k.get(t).value, n = o.appendTo; k.remove(t), D = k.top(), D && (O = parseInt(D.value.modalDomEl.attr("index"), 10)), h(o.modalDomEl, o.modalScope, function () { var e = o.openedClass || C; T.remove(e, t); var i = T.hasKey(e); n.toggleClass(e, i), !i && y && y.heightOverflow && y.scrollbarWidth && (n.css(y.originalRight ? { paddingRight: y.originalRight + "px" } : { paddingRight: "" }), y = null), f(!0) }, o.closedDeferred), m(), e && e.focus ? e.focus() : n.focus && n.focus() } function f(t) { var e; k.length() > 0 && (e = k.top().value, e.modalDomEl.toggleClass(e.windowTopClass || "", t)) } function m() { if (w && -1 === c()) { var t = $; h(w, $, function () { t = null }), w = void 0, $ = void 0 } } function h(e, o, n, i) { function l() { l.done || (l.done = !0, t.leave(e).then(function () { n && n(), e.remove(), i && i.resolve() }), o.$destroy()) } var a, p = null, u = function () { return a || (a = r.defer(), p = a.promise), function () { a.resolve() } }; return o.$broadcast(E.NOW_CLOSING_EVENT, u), r.when(p).then(l) } function v(t) { if (t.isDefaultPrevented()) return t; var e = k.top(); if (e) switch (t.which) { case 27: e.value.keyboard && (t.preventDefault(), i.$apply(function () { E.dismiss(e.key, "escape key press") })); break; case 9: var o = E.loadFocusElementList(e), n = !1; t.shiftKey ? (E.isFocusInFirstItem(t, o) || E.isModalFocused(t, e)) && (n = E.focusLastFocusableElement(o)) : E.isFocusInLastItem(t, o) && (n = E.focusFirstFocusableElement(o)), n && (t.preventDefault(), t.stopPropagation()) } } function b(t, e, o) { return !t.value.modalScope.$broadcast("modal.closing", e, o).defaultPrevented } function g() { Array.prototype.forEach.call(document.querySelectorAll("[" + M + "]"), function (t) { var e = parseInt(t.getAttribute(M), 10), o = e - 1; t.setAttribute(M, o), o || (t.removeAttribute(M), t.removeAttribute("aria-hidden")) }) } var w, $, y, C = "modal-open", k = a.createNew(), T = l.createNew(), E = { NOW_CLOSING_EVENT: "modal.stack.now-closing" }, O = 0, D = null, M = "data-bootstrap-modal-aria-hidden-count", x = "a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]", S = /[A-Z]/g; return i.$watch(c, function (t) { $ && ($.index = t) }), o.on("keydown", v), i.$on("$destroy", function () { o.off("keydown", v) }), E.open = function (e, r) { function l(t) { function e(t) { var e = t.parent() ? t.parent().children() : []; return Array.prototype.filter.call(e, function (e) { return e !== t[0] }) } if (t && "BODY" !== t[0].tagName) return e(t).forEach(function (t) { var e = "true" === t.getAttribute("aria-hidden"), o = parseInt(t.getAttribute(M), 10); o || (o = e ? 1 : 0), t.setAttribute(M, o + 1), t.setAttribute("aria-hidden", "true") }), l(t.parent()) } var a = o[0].activeElement, s = r.openedClass || C; f(!1), D = k.top(), k.add(e, { deferred: r.deferred, renderDeferred: r.renderDeferred, closedDeferred: r.closedDeferred, modalScope: r.scope, backdrop: r.backdrop, keyboard: r.keyboard, openedClass: r.openedClass, windowTopClass: r.windowTopClass, animation: r.animation, appendTo: r.appendTo }), T.put(s, e); var d = r.appendTo, m = c(); m >= 0 && !w && ($ = i.$new(!0), $.modalOptions = r, $.index = m, w = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), w.attr({ "class": "modal-backdrop", "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}", "uib-modal-animation-class": "fade", "modal-in-class": "in" }), r.backdropClass && w.addClass(r.backdropClass), r.animation && w.attr("modal-animation", "true"), n(w)($), t.enter(w, d), p.isScrollable(d) && (y = p.scrollbarPadding(d), y.heightOverflow && y.scrollbarWidth && d.css({ paddingRight: y.right + "px" }))); var h; r.component ? (h = document.createElement(u(r.component.name)), h = angular.element(h), h.attr({ resolve: "$resolve", "modal-instance": "$uibModalInstance", close: "$close($value)", dismiss: "$dismiss($value)" })) : h = r.content, O = D ? parseInt(D.value.modalDomEl.attr("index"), 10) + 1 : 0; var v = angular.element('<div uib-modal-window="modal-window"></div>'); v.attr({ "class": "modal", "template-url": r.windowTemplateUrl, "window-top-class": r.windowTopClass, role: "dialog", "aria-labelledby": r.ariaLabelledBy, "aria-describedby": r.ariaDescribedBy, size: r.size, index: O, animate: "animate", "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}", tabindex: -1, "uib-modal-animation-class": "fade", "modal-in-class": "in" }).append(h), r.windowClass && v.addClass(r.windowClass), r.animation && v.attr("modal-animation", "true"), d.addClass(s), r.scope && (r.scope.$$topModalIndex = O), t.enter(n(v)(r.scope), d), k.top().value.modalDomEl = v, k.top().value.modalOpener = a, l(v) }, E.close = function (t, e) { var o = k.get(t); return g(), o && b(o, e, !0) ? (o.value.modalScope.$$uibDestructionScheduled = !0, o.value.deferred.resolve(e), d(t, o.value.modalOpener), !0) : !o }, E.dismiss = function (t, e) { var o = k.get(t); return g(), o && b(o, e, !1) ? (o.value.modalScope.$$uibDestructionScheduled = !0, o.value.deferred.reject(e), d(t, o.value.modalOpener), !0) : !o }, E.dismissAll = function (t) { for (var e = this.getTop() ; e && this.dismiss(e.key, t) ;) e = this.getTop() }, E.getTop = function () { return k.top() }, E.modalRendered = function (t) { var e = k.get(t); e && e.value.renderDeferred.resolve() }, E.focusFirstFocusableElement = function (t) { return t.length > 0 ? (t[0].focus(), !0) : !1 }, E.focusLastFocusableElement = function (t) { return t.length > 0 ? (t[t.length - 1].focus(), !0) : !1 }, E.isModalFocused = function (t, e) { if (t && e) { var o = e.value.modalDomEl; if (o && o.length) return (t.target || t.srcElement) === o[0] } return !1 }, E.isFocusInFirstItem = function (t, e) { return e.length > 0 ? (t.target || t.srcElement) === e[0] : !1 }, E.isFocusInLastItem = function (t, e) { return e.length > 0 ? (t.target || t.srcElement) === e[e.length - 1] : !1 }, E.loadFocusElementList = function (t) { if (t) { var e = t.value.modalDomEl; if (e && e.length) { var o = e[0].querySelectorAll(x); return o ? Array.prototype.filter.call(o, function (t) { return s(t) }) : o } } }, E }]).provider("$uibModal", function () { var t = { options: { animation: !0, backdrop: !0, keyboard: !0 }, $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function (e, o, n, i, r, l, a) { function p(t) { return t.template ? o.when(t.template) : i(angular.isFunction(t.templateUrl) ? t.templateUrl() : t.templateUrl) } var u = {}, s = null; return u.getPromiseChain = function () { return s }, u.open = function (i) { function u() { return v } var c = o.defer(), d = o.defer(), f = o.defer(), m = o.defer(), h = { result: c.promise, opened: d.promise, closed: f.promise, rendered: m.promise, close: function (t) { return a.close(h, t) }, dismiss: function (t) { return a.dismiss(h, t) } }; if (i = angular.extend({}, t.options, i), i.resolve = i.resolve || {}, i.appendTo = i.appendTo || n.find("body").eq(0), !i.appendTo.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM."); if (!i.component && !i.template && !i.templateUrl) throw new Error("One of component or template or templateUrl options is required."); var v; v = i.component ? o.when(l.resolve(i.resolve, {}, null, null)) : o.all([p(i), l.resolve(i.resolve, {}, null, null)]); var b; return b = s = o.all([s]).then(u, u).then(function (t) { function o(e, o, n, i) { e.$scope = l, e.$scope.$resolve = {}, n ? e.$scope.$uibModalInstance = h : e.$uibModalInstance = h; var r = o ? t[1] : t; angular.forEach(r, function (t, o) { i && (e[o] = t), e.$scope.$resolve[o] = t }) } var n = i.scope || e, l = n.$new(); l.$close = h.close, l.$dismiss = h.dismiss, l.$on("$destroy", function () { l.$$uibDestructionScheduled || l.$dismiss("$uibUnscheduledDestruction") }); var p, u, s = { scope: l, deferred: c, renderDeferred: m, closedDeferred: f, animation: i.animation, backdrop: i.backdrop, keyboard: i.keyboard, backdropClass: i.backdropClass, windowTopClass: i.windowTopClass, windowClass: i.windowClass, windowTemplateUrl: i.windowTemplateUrl, ariaLabelledBy: i.ariaLabelledBy, ariaDescribedBy: i.ariaDescribedBy, size: i.size, openedClass: i.openedClass, appendTo: i.appendTo }, v = {}, b = {}; i.component ? (o(v, !1, !0, !1), v.name = i.component, s.component = v) : i.controller && (o(b, !0, !1, !0), u = r(i.controller, b, !0, i.controllerAs), i.controllerAs && i.bindToController && (p = u.instance, p.$close = l.$close, p.$dismiss = l.$dismiss, angular.extend(p, { $resolve: b.$scope.$resolve }, n)), p = u(), angular.isFunction(p.$onInit) && p.$onInit()), i.component || (s.content = t[0]), a.open(h, s), d.resolve(!0) }, function (t) { d.reject(t), c.reject(t) })["finally"](function () { s === b && (s = null) }), h }, u }] }; return t }), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function () { return { createNew: function () { var t = []; return { add: function (e, o) { t.push({ key: e, value: o }) }, get: function (e) { for (var o = 0; o < t.length; o++) if (e === t[o].key) return t[o] }, keys: function () { for (var e = [], o = 0; o < t.length; o++) e.push(t[o].key); return e }, top: function () { return t[t.length - 1] }, remove: function (e) { for (var o = -1, n = 0; n < t.length; n++) if (e === t[n].key) { o = n; break } return t.splice(o, 1)[0] }, removeTop: function () { return t.pop() }, length: function () { return t.length } } } } }), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("uibPopoverTemplatePopup", function () { return { restrict: "A", scope: { uibTitle: "@", contentExp: "&", originScope: "&" }, templateUrl: "uib/template/popover/popover-template.html" } }).directive("uibPopoverTemplate", ["$uibTooltip", function (t) { return t("uibPopoverTemplate", "popover", "click", { useContentExp: !0 }) }]).directive("uibPopoverHtmlPopup", function () { return { restrict: "A", scope: { contentExp: "&", uibTitle: "@" }, templateUrl: "uib/template/popover/popover-html.html" } }).directive("uibPopoverHtml", ["$uibTooltip", function (t) { return t("uibPopoverHtml", "popover", "click", { useContentExp: !0 }) }]).directive("uibPopoverPopup", function () { return { restrict: "A", scope: { uibTitle: "@", content: "@" }, templateUrl: "uib/template/popover/popover.html" } }).directive("uibPopover", ["$uibTooltip", function (t) { return t("uibPopover", "popover", "click") }]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.stackedMap"]).provider("$uibTooltip", function () { function t(t) { var e = /[A-Z]/g, o = "-"; return t.replace(e, function (t, e) { return (e ? o : "") + t.toLowerCase() }) } var e = { placement: "top", placementClassPrefix: "", animation: !0, popupDelay: 0, popupCloseDelay: 0, useContentExp: !1 }, o = { mouseenter: "mouseleave", click: "click", outsideClick: "outsideClick", focus: "blur", none: "" }, n = {}; this.options = function (t) { angular.extend(n, t) }, this.setTriggers = function (t) { angular.extend(o, t) }, this.$get = ["$window", "$compile", "$timeout", "$document", "$uibPosition", "$interpolate", "$rootScope", "$parse", "$$stackedMap", function (i, r, l, a, p, u, s, c, d) { function f(t) { if (27 === t.which) { var e = m.top(); e && (e.value.close(), e = null) } } var m = d.createNew(); return a.on("keyup", f), s.$on("$destroy", function () { a.off("keyup", f) }), function (i, s, d, f) { function h(t) { var e = (t || f.trigger || d).split(" "), n = e.map(function (t) { return o[t] || t }); return { show: e, hide: n } } f = angular.extend({}, e, n, f); var v = t(i), b = u.startSymbol(), g = u.endSymbol(), w = "<div " + v + '-popup uib-title="' + b + "title" + g + '" ' + (f.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + b + "content" + g + '" ') + 'origin-scope="origScope" class="uib-position-measure ' + s + '" tooltip-animation-class="fade"uib-tooltip-classes ng-class="{ in: isOpen }" ></div>'; return { compile: function () { var t = r(w); return function (e, o, n) { function r() { H.isOpen ? d() : u() } function u() { (!L || e.$eval(n[s + "Enable"])) && (w(), C(), H.popupDelay ? P || (P = l(v, H.popupDelay, !1)) : v()) } function d() { b(), H.popupCloseDelay ? N || (N = l(g, H.popupCloseDelay, !1)) : g() } function v() { return b(), w(), H.content ? ($(), void H.$evalAsync(function () { H.isOpen = !0, k(!0), _() })) : angular.noop } function b() { P && (l.cancel(P), P = null), I && (l.cancel(I), I = null) } function g() { H && H.$evalAsync(function () { H && (H.isOpen = !1, k(!1), H.animation ? A || (A = l(y, 150, !1)) : y()) }) } function w() { N && (l.cancel(N), N = null), A && (l.cancel(A), A = null) } function $() { x || (S = H.$new(), x = t(S, function (t) { W ? a.find("body").append(t) : o.after(t) }), m.add(H, { close: g }), T()) } function y() { b(), w(), E(), x && (x.remove(), x = null, R && l.cancel(R)), m.remove(H), S && (S.$destroy(), S = null) } function C() { H.title = n[s + "Title"], H.content = j ? j(e) : n[i], H.popupClass = n[s + "Class"], H.placement = angular.isDefined(n[s + "Placement"]) ? n[s + "Placement"] : f.placement; var t = p.parsePlacement(H.placement); U = t[1] ? t[0] + "-" + t[1] : t[0]; var o = parseInt(n[s + "PopupDelay"], 10), r = parseInt(n[s + "PopupCloseDelay"], 10); H.popupDelay = isNaN(o) ? f.popupDelay : o, H.popupCloseDelay = isNaN(r) ? f.popupCloseDelay : r } function k(t) { q && angular.isFunction(q.assign) && q.assign(e, t) } function T() { z.length = 0, j ? (z.push(e.$watch(j, function (t) { H.content = t, !t && H.isOpen && g() })), z.push(S.$watch(function () { B || (B = !0, S.$$postDigest(function () { B = !1, H && H.isOpen && _() })) }))) : z.push(n.$observe(i, function (t) { H.content = t, !t && H.isOpen ? g() : _() })), z.push(n.$observe(s + "Title", function (t) { H.title = t, H.isOpen && _() })), z.push(n.$observe(s + "Placement", function (t) { H.placement = t ? t : f.placement, H.isOpen && _() })) } function E() { z.length && (angular.forEach(z, function (t) { t() }), z.length = 0) } function O(t) { H && H.isOpen && x && (o[0].contains(t.target) || x[0].contains(t.target) || d()) } function D(t) { 27 === t.which && d() } function M() { var t = [], i = [], l = e.$eval(n[s + "Trigger"]); Y(), angular.isObject(l) ? (Object.keys(l).forEach(function (e) { t.push(e), i.push(l[e]) }), F = { show: t, hide: i }) : F = h(l), "none" !== F.show && F.show.forEach(function (t, e) { "outsideClick" === t ? (o.on("click", r), a.on("click", O)) : t === F.hide[e] ? o.on(t, r) : t && (o.on(t, u), o.on(F.hide[e], d)), o.on("keypress", D) }) } var x, S, A, P, N, I, R, U, W = angular.isDefined(f.appendToBody) ? f.appendToBody : !1, F = h(void 0), L = angular.isDefined(n[s + "Enable"]), H = e.$new(!0), B = !1, q = angular.isDefined(n[s + "IsOpen"]) ? c(n[s + "IsOpen"]) : !1, j = f.useContentExp ? c(n[i]) : !1, z = [], _ = function () { x && x.html() && (I || (I = l(function () { var t = p.positionElements(o, x, H.placement, W), e = angular.isDefined(x.offsetHeight) ? x.offsetHeight : x.prop("offsetHeight"), n = W ? p.offset(o) : p.position(o); x.css({ top: t.top + "px", left: t.left + "px" }); var i = t.placement.split("-"); x.hasClass(i[0]) || (x.removeClass(U.split("-")[0]), x.addClass(i[0])), x.hasClass(f.placementClassPrefix + t.placement) || (x.removeClass(f.placementClassPrefix + U), x.addClass(f.placementClassPrefix + t.placement)), R = l(function () { var t = angular.isDefined(x.offsetHeight) ? x.offsetHeight : x.prop("offsetHeight"), o = p.adjustTop(i, n, e, t); o && x.css(o), R = null }, 0, !1), x.hasClass("uib-position-measure") ? (p.positionArrow(x, t.placement), x.removeClass("uib-position-measure")) : U !== t.placement && p.positionArrow(x, t.placement), U = t.placement, I = null }, 0, !1))) }; H.origScope = e, H.isOpen = !1, H.contentExp = function () { return H.content }, n.$observe("disabled", function (t) { t && b(), t && H.isOpen && g() }), q && e.$watch(q, function (t) { H && !t === H.isOpen && r() }); var Y = function () { F.show.forEach(function (t) { "outsideClick" === t ? o.off("click", r) : (o.off(t, u), o.off(t, r)), o.off("keypress", D) }), F.hide.forEach(function (t) { "outsideClick" === t ? a.off("click", O) : o.off(t, d) }) }; M(); var K = e.$eval(n[s + "Animation"]); H.animation = angular.isDefined(K) ? !!K : f.animation; var X, G = s + "AppendToBody"; X = G in n && void 0 === n[G] ? !0 : e.$eval(n[G]), W = angular.isDefined(X) ? X : W, e.$on("$destroy", function () { Y(), y(), H = null }) } } } } }] }).directive("uibTooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function (t, e, o, n) { return { link: function (i, r, l) { var a, p, u, s = i.$eval(l.tooltipTemplateTranscludeScope), c = 0, d = function () { p && (p.remove(), p = null), a && (a.$destroy(), a = null), u && (t.leave(u).then(function () { p = null }), p = u, u = null) }; i.$watch(e.parseAsResourceUrl(l.uibTooltipTemplateTransclude), function (e) { var l = ++c; e ? (n(e, !0).then(function (n) { if (l === c) { var i = s.$new(), p = n, f = o(p)(i, function (e) { d(), t.enter(e, r) }); a = i, u = f, a.$emit("$includeContentLoaded", e) } }, function () { l === c && (d(), i.$emit("$includeContentError", e)) }), i.$emit("$includeContentRequested", e)) : d() }), i.$on("$destroy", d) } } }]).directive("uibTooltipClasses", ["$uibPosition", function (t) { return { restrict: "A", link: function (e, o, n) { if (e.placement) { var i = t.parsePlacement(e.placement); o.addClass(i[0]) } e.popupClass && o.addClass(e.popupClass), e.animation && o.addClass(n.tooltipAnimationClass) } } }]).directive("uibTooltipPopup", function () { return { restrict: "A", scope: { content: "@" }, templateUrl: "uib/template/tooltip/tooltip-popup.html" } }).directive("uibTooltip", ["$uibTooltip", function (t) {
    return t("uibTooltip", "tooltip", "mouseenter")
}]).directive("uibTooltipTemplatePopup", function () { return { restrict: "A", scope: { contentExp: "&", originScope: "&" }, templateUrl: "uib/template/tooltip/tooltip-template-popup.html" } }).directive("uibTooltipTemplate", ["$uibTooltip", function (t) { return t("uibTooltipTemplate", "tooltip", "mouseenter", { useContentExp: !0 }) }]).directive("uibTooltipHtmlPopup", function () { return { restrict: "A", scope: { contentExp: "&" }, templateUrl: "uib/template/tooltip/tooltip-html-popup.html" } }).directive("uibTooltipHtml", ["$uibTooltip", function (t) { return t("uibTooltipHtml", "tooltip", "mouseenter", { useContentExp: !0 }) }]), angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function (t) { t.put("uib/template/alert/alert.html", '<button ng-show="closeable" type="button" class="close" ng-click="close({$event: $event})">\n  <span aria-hidden="true">&times;</span>\n  <span class="sr-only">Close</span>\n</button>\n<div ng-transclude></div>\n') }]), angular.module("uib/template/modal/window.html", []).run(["$templateCache", function (t) { t.put("uib/template/modal/window.html", "<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n") }]), angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function (t) { t.put("uib/template/popover/popover-html.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content" ng-bind-html="contentExp()"></div>\n</div>\n') }]), angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function (t) { t.put("uib/template/popover/popover-template.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content"\n      uib-tooltip-template-transclude="contentExp()"\n      tooltip-template-transclude-scope="originScope()"></div>\n</div>\n') }]), angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function (t) { t.put("uib/template/popover/popover.html", '<div class="arrow"></div>\n\n<div class="popover-inner">\n    <h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>\n    <div class="popover-content" ng-bind="content"></div>\n</div>\n') }]), angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function (t) { t.put("uib/template/tooltip/tooltip-html-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n') }]), angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function (t) { t.put("uib/template/tooltip/tooltip-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner" ng-bind="content"></div>\n') }]), angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function (t) { t.put("uib/template/tooltip/tooltip-template-popup.html", '<div class="tooltip-arrow"></div>\n<div class="tooltip-inner"\n  uib-tooltip-template-transclude="contentExp()"\n  tooltip-template-transclude-scope="originScope()"></div>\n') }]), angular.module("ui.bootstrap.position").run(function () { !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0 }), angular.module("ui.bootstrap.tooltip").run(function () { !angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find("head").prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'), angular.$$uibTooltipCss = !0 });
app.directive('updateCart', ['CartService', function (CartService) {

    // Shared scope:
    // updateCart: The updated cart to save. If an existing cart does not exist, one will be created and returned.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a cart update is submitted.
    // onSuccess: A function that will be called from scope when the cart is successfully updated. Will include the response cart object as a parameter.
    // onFailure: A function that will be called from scope when the update fails. Will include the error object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            cart: '=updateCart',
            shippingIsBilling: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Make a copy of the cart so you can modify the data without modifying the view. This is used when the user has supplied values in shipping fields but then checks "shipping is billing". We don't want to clear the view but we don't want to send a shipping address to the API.
                var cartCopy = angular.copy(scope.cart);

                // If set that billing is same as shipping, set all shipping values to null so that the API doesn't receive any of the data set on the view.
                if (scope.shippingIsBilling) {
                    if (cartCopy.customer.shipping_address) {
                        cartCopy.customer.shipping_address.name = null;
                        cartCopy.customer.shipping_address.address_1 = null;
                        cartCopy.customer.shipping_address.address_2 = null;
                        cartCopy.customer.shipping_address.city = null;
                        cartCopy.customer.shipping_address.state_prov = null;
                        cartCopy.customer.shipping_address.postal_code = null;
                        cartCopy.customer.shipping_address.country = null;
                    }
                }

                CartService.update(cartCopy, scope.params).then(function (cart) {

                    // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                    if (scope.cart) {
                        cart.customer = scope.cart.customer;
                    }

                    scope.cart = cart;

                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(cart);
                    }

                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('updateInvoice', ['InvoiceService', function (InvoiceService) {

    // Shared scope:
    // updateCart: The updated invoice to save. If an existing invoice does not exist, one will be created and returned.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a invoice update is submitted.
    // onSuccess: A function that will be called from scope when the invoice is successfully updated. Will include the response invoice object as a parameter.
    // onFailure: A function that will be called from scope when the update fails. Will include the error object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            invoice: '=updateInvoice',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                InvoiceService.update(scope.invoice, scope.params).then(function (invoice) {
                    scope.invoice = invoice;
                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(invoice);
                    }
                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('addToCart', ['CartService', 'gettextCatalog', function (CartService, gettextCatalog) {

    // Shared scope:
    // addToCart: The product to add to the cart. Must include the product_id.
    // quantity: The quantity of the item to add to teh cart.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when the function is triggered.
    // onSuccess: A function that will be called from scope when the item is successfully added. Will include the response item object as a parameter.
    // onError: A function that will be called from scope when the function fails. Will include the error object as a parameter.
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            product: '=addToCart',
            params: '=?',
            quantity: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                if (ctrl.$invalid == true) {
                    scope.$apply(function () {
                        scope.error = { type: "bad_request", reference: "AWu1twY", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    });
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Build the item
                var item = { product_id: scope.product.product_id };

                // Set the quantity
                if (scope.quantity) {
                    item.quantity = scope.quantity;
                }

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.addItem(item, scope.params).then(function (item) {
                    scope.item = item;
                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(item);
                    }
                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('submitPayment', ['CartService', 'InvoiceService', 'PaymentService', 'gettextCatalog', function (CartService, InvoiceService, PaymentService, gettextCatalog) {

    // Shared scope:
    // submitPayment: Provide the payment_method to be used for payment. Should include, at a minimum, the following properties: payment_type, data (data includes payment method-specific fields such as credit card number).
    // cart: Provide the cart that will be paid for. The cart will automatically be updated (or created if not yet created) through the API before the payment for the payment is submitted. Cart or invoice can be supplied, but not both.
    // invoice: Provide the invoice that will be paid for. The invoice will automatically be updated through the API before the payment for the payment is submitted (i.e. a currency change). Cart or invoice can be supplied, but not both.
    // payment: Provide the payment object for a direct, stand-alone payment (no cart or invoice). If payment is provided cart and invoice should NOT be provided.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a payment is submitted. If the function that is called returns false, then the directive will stop processing and return.
    // onSuccess: A function that will be called from scope when the payment is successfully completed. Will include the response payment object as a parameter.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.
    // onValidationSuccess: A function that will be called from scope when the validation is successful. If the function that is called returns false, then the directive will stop processing and return.
    // onValidationError: A function that will be called from scope when the validation fails. The error object will be returned as a parameter.
    // loading: This value is true while the submit payment is processing, false when done processing.

    // Shared scope that are specific to different payment methods:

    // Credit Card
    // shippingIsBilling: A flag to indicate if the billing address and shipping address are the same. If so, the shipping address will be removed.

    // Amazon Pay
    // getConsentStatus: Pass in a function that allows you get the status of the Amazon Pay consent checkbox. This function you pass in is provided by the amazonPayButton directive.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api for the payment, such as show, hide, formatted, etc. Used to customize the response object.
    // cartParams: When a payment is submitted, a cart may be created or updated. An object that supplies a list of parameters to send to the api for the cart, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            paymentMethod: '=submitPayment',
            cart: '=?',
            invoice: '=?',
            payment: '=?',
            params: '=?',
            cartParams: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onValidationSuccess: '=?',
            onValidationError: '=?',
            onError: '=?',
            shippingIsBilling: '=?',
            getConsentStatus: '=?',
            loading: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                scope.loading = true;

                // Fire the submit event
                if (scope.onSubmit) {
                    var result = scope.onSubmit();
                    if (result === false) {
                        scope.loading = false;
                        return;
                    }
                }

                // Validation functions. 
                function validateFormData() {

                    var error = null;

                    if (ctrl.$invalid == true) {
                        error = { type: "bad_request", reference: "kI1ETNz", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    }

                    if (scope.onValidationError)
                        scope.onValidationError(error);

                    scope.loading = false;
                    return error;

                }

                function validateAmountIsProvided() {

                    var error = null;

                    if (!scope.payment.total && !scope.payment.subtotal && !scope.payment.shipping) {
                        error = { type: "bad_request", reference: "eiptRbg", code: "invalid_input", message: gettextCatalog.getString("Please provide an amount for your payment."), status: 400 };
                    }

                    if (scope.onValidationError)
                        scope.onValidationError(error);

                    scope.loading = false;
                    return error;

                }

                // Perform validatations, depending on payment method type
                var error = null;
                switch (scope.paymentMethod.type) {

                    case "credit_card":

                        // Wallet providers such as PayPal and Amazon Pay provide customer data as a callback so no need to collect from the user directly.
                        error = validateFormData();

                        if (error) {
                            scope.$apply(function () {
                                scope.error = error;
                            });

                            if (scope.onValidationError)
                                scope.onValidationError(error);

                            scope.loading = false;
                            return;
                        }

                        break;

                    case "paypal":

                        // We skip validating form data for this payment method as customer data is provided by the provider. If a direct payment, we need to validate that an amount is provided.
                        if (!scope.cart && !scope.invoice) {
                            error = validateAmountIsProvided();
                        }

                        if (error) {
                            scope.$apply(function () {
                                scope.error = error;

                                if (scope.onValidationError)
                                    scope.onValidationError(error);

                            });
                            scope.loading = false;
                            return;
                        }

                    case "amazon_pay":

                        // If the payment method contains a billing agreement ID or the payment is marked to be saved and the user has not given consent, return an error.
                        if ((scope.paymentMethod.data.billing_agreement_id || scope.paymentMethod.save) && !scope.getConsentStatus()) {
                            error = { type: "bad_request", reference: "nauRcF8", code: "invalid_input", message: gettextCatalog.getString("Please check the box to provide consent to save your payment method for future payments."), status: 400 };
                        }

                        // We skip validating form data for this payment method as customer data is provided by the provider. If a direct payment, we need to validate that an amount is provided.
                        if (!scope.cart && !scope.invoice) {
                            error = validateAmountIsProvided();
                        }

                        if (error) {
                            scope.$apply(function () {
                                scope.error = error;

                                if (scope.onValidationError)
                                    scope.onValidationError(error);

                            });
                            scope.loading = false;
                            return;
                        }

                        break;

                }

                if (scope.onValidationSuccess) {
                    var result = scope.onValidationSuccess();
                    if (result === false) {
                        scope.loading = false;
                        return;
                    }
                }

                // For direct payments, amounts are provided by form input. If supplied, make sure the values are numbers and not strings. This ensures that the JSON sent to the API will be in numeric format and not string, which the API will reject as invalid.
                if (scope.payment) {
                    if (scope.payment.total)
                        scope.payment.total = Number(scope.payment.total);

                    if (scope.payment.subtotal)
                        scope.payment.subtotal = Number(scope.payment.subtotal);

                    if (scope.payment.shipping)
                        scope.payment.shipping = Number(scope.payment.shipping);

                    if (scope.payment.tax)
                        scope.payment.tax = Number(scope.payment.tax);
                }

                // Disable the clicked element
                elem.prop("disabled", true);

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "order");

                if (scope.cart) {

                    // If billing is shipping, remove the shipping address
                    if (scope.shippingIsBilling) {
                        delete scope.cart.customer.shipping_address;
                    }

                    CartService.pay(scope.cart, scope.paymentMethod, params, scope.cartParams).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // If the cart is expanded, update the cart.
                        if (payment.cart && payment.cart.url) {
                            scope.cart = payment.cart;
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    });
                }

                if (scope.invoice) {

                    InvoiceService.pay(scope.invoice, scope.paymentMethod, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // If the invoice is expanded, update the invoice.
                        if (payment.invoice && payment.invoice.url) {
                            scope.invoice = payment.invoice;
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    });
                }

                if (scope.payment) {

                    scope.payment.payment_method = scope.paymentMethod;

                    // If billing is shipping, remove the shipping address
                    if (scope.shippingIsBilling && scope.payment.customer) {
                        delete scope.payment.customer.shipping_address;
                    }

                    PaymentService.createDirect(scope.payment, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        scope.loading = false;
                        elem.prop("disabled", null);

                    });
                }

            });

        }
    };
}]);

app.directive('commitPayment', ['CartService', 'InvoiceService', 'PaymentService', 'gettextCatalog', function (CartService, InvoiceService, PaymentService, gettextCatalog) {

    // This is used for payment methods such as PayPal and Amazon Pay that need to be tiggered for completion after they have been reviewed by the customer. 

    // Shared scope:
    // commitPayment: Provide the payment_id of the payment that will be committed.
    // sale: If a the payment is associated with a cart or invoice, you can supply the it here. If you supply a cart, any changes to the cart (such as customer data changes) will be saved before the commit is attempted.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a payment is submitted.
    // onSuccess: A function that will be called from scope when the payment is successfully completed. Will include the response payment object as a parameter.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            paymentId: '=commitPayment',
            sale: '=?',
            invoice: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Data is not validated with PayPal since the customer data will come from the response.
                if (ctrl.$invalid == true) {

                    scope.$apply(function () {
                        scope.error = { type: "bad_request", reference: "eS9G9MA", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    });

                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                    return;
                }

                // Disable the clicked element
                elem.prop("disabled", true);

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "order");

                // Define the commit function.
                var commit = function (payment_id, params) {

                    PaymentService.commit(payment_id, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });
                };

                // Perform the commit. If a cart, update the cart before running the payment.
                if (attrs.saleType == "cart") {

                    CartService.update(scope.sale).then(function (cart) {
                        commit(scope.paymentId, params);
                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });

                } else {
                    // An invoice or direct payment. Nothing to update in advance, just run the commit.
                    commit(scope.paymentId, params);
                }

            });

        }
    };
}]);

app.directive('currencySelect', ['CurrencyService', 'CartService', 'InvoiceService', 'PaymentService', 'ProductService', 'SettingsService', 'StorageService', '$timeout', '$rootScope', function (CurrencyService, CartService, InvoiceService, PaymentService, ProductService, SettingsService, StorageService, $timeout, $rootScope) {

    return {
        restrict: 'A',
        scope: {
            currency: '=selectCurrency',
            cart: '=?',
            invoice: '=?',
            payment: '=?',
            options: '=?',
            products: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // currency: The new currency
            // cart: If running on a page with an cart, pass the cart object in and it will be updated with the pricing in the new currency
            // invoice: If running on a page with an invoice, pass the invoice object in and it will be updated with the pricing in the new currency
            // payment: If running on a page with a stand-alone payment, pass the payment object in and the currency will be set on the object
            // options: If suppying a payment, you can supply the payment/options object and it will be updated with a new version as a result of the currency selection / change.
            // product: If running on a page with a single product, pass the product in and it will be updated with the pricing in the new currency
            // products: If running on a page with a list of products, pass the products list in and it will be updated with the pricing in the new currency
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // asDropdown: If specified, a Bootstrap dropdown will be output. Otherwise, a HTML select intput will be output.

            // Get the settings
            var settings = SettingsService.get();

            if (utils.hasProperty(attrs, "asDropdown")) {

                var elemNg = angular.element(elem[0]);
                _.each(settings.account.currencies, function (item) {

                    var option = '<li><a class="pointer">' + item.name + '</a></li>';
                    optionNg = angular.element(option);

                    elemNg.append(optionNg);

                    optionNg.bind("click", function (event) {

                        // Clear previous errors
                        scope.error = null;

                        // Placed within a timeout otherwise the update was happening before the change to the model occured.
                        $timeout(function () {
                            setCurrency(scope, item.code, attrs);
                        });
                    });

                });

                // Set the current value for display
                var elems = angular.element(elem.parent().children());
                var label = elems.find("span");
                if (label) {
                    label.text(CurrencyService.getCurrencyName());
                }

                // Listen for a change
                $rootScope.$on("currencyChanged", function (event, currency) {
                    var elems = angular.element(elem.parent().children());
                    var label = elems.find("span");
                    if (label) {
                        label.text(CurrencyService.getCurrencyName());
                    }
                });

            } else {

                var elemNg = angular.element(elem[0]);
                _.each(settings.account.currencies, function (item) {

                    var option = '<option value="' + item.code + '"';
                    if (item.code == CurrencyService.getCurrency()) {
                        option += " selected";
                    }
                    option += '>' + item.name + '</option>';
                    elemNg.append(option);

                });

                elem.bind("change", function (event) {

                    // Clear previous errors
                    scope.error = null;

                    var selectedCurrency = angular.element(elem[0]).val();

                    // Placed within a timeout otherwise the update was happening before the change to the model occured.
                    $timeout(function () {
                        setCurrency(scope, selectedCurrency, attrs);
                    });

                });

                // Listen for a change
                $rootScope.$on("currencyChanged", function (event, currency) {
                    elemNg[0].value = currency;
                });
            }

            var setCurrency = function (scope, selectedCurrency, attrs) {

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // If associated with a cart, update the cart.
                if (scope.cart && StorageService.get("cart_id")) {

                    CartService.update({ currency: selectedCurrency }, scope.params).then(function (cart) {

                        CurrencyService.setCurrency(selectedCurrency);

                        // We don't want to remove unsaved customer values from the view.
                        var customer = null;
                        if (scope.cart) {
                            customer = scope.cart.customer;
                        }
                        scope.cart = cart;

                        if (customer) {
                            // Restore the original customer data.
                            scope.cart.customer = customer;
                        }

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });

                };

                // If associated with an invoice, update the invoice.
                if (scope.invoice && StorageService.get("invoice_id")) {

                    InvoiceService.update({ currency: selectedCurrency }, scope.params).then(function (invoice) {

                        CurrencyService.setCurrency(selectedCurrency);

                        // We don't want to remove unsaved customer values from the view.
                        var customer = null;
                        if (scope.invoice) {
                            customer = scope.invoice.customer;
                        }
                        scope.invoice = invoice;

                        if (customer) {
                            // Restore the original customer data.
                            scope.invoice.customer = customer;
                        }

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });

                };

                // If associated with a payment, update the payment. Refresh the payment options, if provided.
                if (scope.payment) {

                    scope.payment.currency = selectedCurrency;

                    if (scope.options) {
                        // Update the options according to the supplied currency.
                        PaymentService.getOptions({ currency: selectedCurrency }).then(function (options) {
                            scope.options = options;
                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (scope.onSuccess) {
                        scope.onSuccess(selectedCurrency);
                    }

                    CurrencyService.setCurrency(selectedCurrency);
                    scope.payment.currency = selectedCurrency;

                };

                // If products were supplied, refresh the list of products to show the products in the newly selected currency
                if (scope.products) {

                    // Pass through the current parameters from products (such as pagination)
                    var pageParams = utils.getQueryParameters(scope.products.current_page_url);

                    // Set the new currency
                    params.currency = selectedCurrency;

                    ProductService.getList(scope.params).then(function (products) {

                        scope.products = products;
                        CurrencyService.setCurrency(selectedCurrency);

                        // If the user changes the currency of a product and has a cart, update the cart to that same currency to provide a better experience.
                        if (StorageService.get("cart_id")) {
                            CartService.update({ currency: selectedCurrency }, scope.params, true);
                        };

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });
                }

                // If a product was supplied, refresh the product to show the product in the newly selected currency
                if (scope.product) {

                    // Pass through the current parameters from product
                    var pageParams = utils.getQueryParameters(scope.product.url);

                    // Set the new currency
                    scope.params.currency = selectedCurrency;

                    ProductService.get(scope.product.product_id, scope.params).then(function (product) {

                        scope.product = product;
                        CurrencyService.setCurrency(selectedCurrency);

                        // If the user changes the currency of a product and has a cart, update the cart to that same currency to provide a better experience.
                        if (StorageService.get("cart_id")) {
                            CartService.update({ currency: selectedCurrency }, scope.params, true);
                        };

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });
                }

            };
        }
    };
}]);

app.directive('languageSelect', ['LanguageService', '$timeout', '$rootScope', function (LanguageService, $timeout, $rootScope) {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            // Get the languages
            var languages = LanguageService.getLanguages();

            if (utils.hasProperty(attrs, "asDropdown")) {

                var elemNg = angular.element(elem[0]);

                _.each(languages, function (language) {
                    var option = '<li><a class="pointer">' + language.name + '</a></li>';
                    optionNg = angular.element(option);
                    elemNg.append(optionNg);

                    optionNg.bind("click", function (event) {

                        // Placed within a timeout otherwise the update was happening before the change to the model occured.
                        $timeout(function () {
                            LanguageService.setLanguage(language.code, attrs.languagesPath);
                        });

                    });
                });

                // Set the current value for display
                var elems = angular.element(elem.parent().children());
                var label = elems.find("span");
                if (label) {
                    label.text(LanguageService.getSelectedLanguage().name);
                }

                // Listen for a change
                $rootScope.$on("languageChanged", function (event, currency) {
                    var elems = angular.element(elem.parent().children());
                    var label = elems.find("span");
                    if (label) {
                        label.text(LanguageService.getSelectedLanguage().name);
                    }
                });

            } else {

                var elemNg = angular.element(elem[0]);
                _.each(languages, function (language) {

                    var option = '<option value="' + language.code + '"';
                    if (language.code == LanguageService.getSelectedLanguage().code) {
                        option += " selected";
                    }
                    option += '>' + language.name + '</option>';
                    elemNg.append(option);

                });

                elem.bind("change", function (event) {

                    var selectedLanguage = angular.element(elem[0]).val();

                    // Placed within a timeout otherwise the update was happening before the change to the model occured.
                    $timeout(function () {
                        LanguageService.setLanguage(selectedLanguage);
                    });

                });

                // Listen for a change
                $rootScope.$on("languageChanged", function (event, language) {
                    elemNg[0].value = language;
                });
            }
        }
    };
}]);

app.directive('shippingSelect', ['CartService', 'InvoiceService', '$timeout', function (CartService, InvoiceService, $timeout) {

    return {
        restrict: 'A',
        scope: {
            sale: '=?',
            shippingQuotes: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // sale: The cart or invoice that is on the current page.
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

            scope.$watch("shippingQuotes", function (newValue, oldValue) {

                if (newValue) {

                    var method_id = null;
                    if (scope.sale.shipping_item) {
                        method_id = scope.sale.shipping_item.item_id;
                    }

                    var elemNg = angular.element(elem[0]);

                    // Clear any previous options
                    elemNg.html("");

                    _.each(scope.shippingQuotes, function (item) {

                        var option = '<option value="' + item.method_id + '"';
                        if (item.method_id == method_id) {
                            option += " selected";
                        }
                        option += '>' + item.description + ' (' + item.formatted.price + ')</option>';
                        elemNg.append(option);

                    });

                }
            });

            elem.bind("change", function (event) {

                // Clear previous errors
                scope.error = null;

                var selectedMethod = angular.element(elem[0]).val();

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Placed within a timeout otherwise the update was happening before the change to the model occured.
                $timeout(function () {

                    var data = { shipping_method_id: selectedMethod };

                    if (attrs.saleType == "cart") {
                        CartService.update(data, scope.params).then(function (cart) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            cart.customer = scope.sale.customer;

                            // Sync the scope to the response.
                            scope.sale = cart;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (attrs.saleType == "invoice") {
                        InvoiceService.update(data, scope.params).then(function (invoice) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            invoice.customer = scope.sale.customer;

                            // Sync the scope to the response.
                            scope.sale = invoice;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                });
            });
        }
    };
}]);

app.directive('shippingRadio', ['CartService', 'InvoiceService', '$timeout', function (CartService, InvoiceService, $timeout) {

    return {
        restrict: 'A',
        scope: {
            sale: '=?',
            shippingQuotes: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // sale: The cart or invoice that is on the current page.
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

            elem.bind("change", function (event) {

                // Clear previous errors
                scope.error = null;

                var selectedMethod = attrs.shippingRadio;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Placed within a timeout otherwise the update was happening before the change to the model occured.
                $timeout(function () {
                    var data = { shipping_method_id: selectedMethod };

                    if (attrs.saleType == "cart") {
                        CartService.update(data, scope.params).then(function (cart) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            if (scope.sale) {
                                cart.customer = scope.sale.customer;
                            }

                            // Sync the scope to the response.
                            scope.sale = cart;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (attrs.saleType == "invoice") {
                        InvoiceService.update(data, scope.params).then(function (invoice) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            if (scope.sale) {
                                invoice.customer = scope.sale.customer;
                            }

                            // Sync the scope to the response.
                            scope.sale = invoice;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                });
            });
        }
    };
}]);

app.directive('customerCountries', ['GeoService', '$timeout', function (GeoService, $timeout) {

    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            customerCountries: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            // Attributes
            // customerCountries: A list of allowed customer countries
            // placeholderName: A value to display as the "empty" option, rather than leaving blank.

            scope.$watch("customerCountries", function (customerCountries, oldValue) {

                if (customerCountries) {

                    var elemNg = angular.element(elem[0]);

                    // Reset the existing options. If the value is empty, leave in place, this is the "blank" option in the list.
                    var hasEmpty = false;
                    for (var i = elemNg[0].options.length - 1 ; i >= 0 ; i--) {
                        if (elemNg[0].options[i].value) {
                            elemNg[0].remove(i);
                        } else {
                            hasEmpty = true;
                        }
                    }

                    // If it doesn't have an empty value, add it.
                    if (!hasEmpty) {
                        elemNg[0].appendChild(document.createElement("option"));
                    }

                    // Get the entire list of countries
                    var countries = GeoService.getData().countries;

                    countries = _.filter(countries, function (country) { return customerCountries.indexOf(country.code) > -1; });

                    // Get the value
                    var value = ctrl.$viewValue || ctrl.$modelValue;

                    // Set a flag to indicate if you found a match of current country
                    var match = false;

                    _.each(countries, function (item) {

                        var option = '<option class="select-options-color" value="' + item.code + '"';
                        if (item.code == value) {
                            option += " selected";
                            match = true;
                        }
                        option += '>' + item.name + '</option>';
                        elemNg.append(option);

                    });

                    // If no match, remove the value of the current control
                    if (match == false) {
                        ctrl.$setViewValue(null);
                    }

                }
            });

        }
    };
}]);

app.directive('showErrors', ['$timeout', 'SettingsService', function ($timeout, SettingsService) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, elem, attrs, ctrl) {

            // Find the input element and error block elements
            var load = function () {
                $timeout(function () {

                    var inputEl = elem[0].querySelector("[name]");
                    var labelEl = elem[0].querySelector("label");
                    var errorEl = angular.element(elem[0].querySelector(".error-block"));

                    // Convert the native angular elements
                    var inputNgEl = angular.element(inputEl);
                    var labelNgEl = angular.element(labelEl);
                    var errorNgEl = angular.element(errorEl);

                    // Remove errors, by default
                    elem.removeClass("has-error");
                    errorNgEl.addClass("hidden");

                    // Get the name of the text box
                    var inputName = inputNgEl.attr("name");

                    // If required, add a required class to the label, if supplied
                    scope.$watch(attrs.showErrors, function (newValue, oldValue) {
                        if (newValue && inputEl) {
                            if (inputEl.required) {
                                if (labelNgEl) {
                                    labelNgEl.addClass("required");
                                }
                            } else {
                                labelNgEl.removeClass("required");
                            }
                        }
                    });

                    // Define the action upon which we re-validate
                    var action = "blur";

                    // We don't do select elements on change because it can get cause a huge performance hit if a user navigates up and down a select list with a keyboard, causing many requests per second.
                    if (inputEl) {
                        if (inputEl.type == "checkbox" || inputEl.type == "radio") {
                            action = "change";
                        }
                    }

                    // Apply and remove has-error and hidden on blur
                    inputNgEl.bind(action, function () {

                        var settings = SettingsService.get();
                        var errorLevel = settings.app.error_notifications || "moderate";

                        // Define how aggressive error messaging is on blur: mild, moderate, aggressive
                        if (errorLevel == "moderate") {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                        }

                        if (errorLevel == "aggressive") {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                            errorNgEl.toggleClass("hidden", !ctrl[inputName].$invalid);
                        }

                        // We only show on form submit, so on blur we only hide.
                        if (ctrl[inputName].$invalid == false) {
                            errorNgEl.toggleClass("hidden", true);
                        }

                    });

                    // Listen for the form submit and show any errors (plus error text)
                    scope.$on("show-errors-check-validity", function () {
                        if (ctrl[inputName]) {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                            errorNgEl.toggleClass("hidden", !ctrl[inputName].$invalid);
                        }
                    });

                });
            };

            // Set the initial listener
            load();

            // Watch for a trigger to reload the listener
            if (attrs.refreshOnChange) {
                scope.$watch(attrs.refreshOnChange, function (newValue, oldValue) {
                    load();
                });
            }
        }
    };
}]);

app.directive('conversion', ['SettingsService', 'StorageService', function (SettingsService, StorageService) {

    // Attributes:
    // orderId: The order_id from the order, if null we don't record the conversion, which helps prevent false positives.

    return {
        restrict: 'A',
        scope: {
            conversion: '@'
        },
        link: function (scope, elem, attrs, ctrl) {

            // Define your observe function
            var setTracking = function () {
                attrs.$observe("conversion", function (order_id) {
                    if (utils.isNullOrEmpty(order_id) == false) {

                        var head = document.getElementsByTagName("head")[0];
                        var js = document.createElement("script");
                        js.id = "__conversion";
                        js.type = "text/javascript";
                        js.src = "analytics/conversion.js";
                        js.setAttribute("data-order_id", order_id);

                        // Remove any existing
                        if (document.getElementById("__conversion") != null) {
                            head.removeChild(document.getElementById("__conversion"));
                        }

                        // Add again to force reload.
                        head.appendChild(js);
                    }
                });
            };

            // Get the settings
            var settings = SettingsService.get();
            if (settings.config.development != true) {
                // Your are not in a development environment, so set the tracking. 
                setTracking();
            }
        }
    };
}]);

app.directive('validateOnSubmit', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {
                scope.$broadcast('show-errors-check-validity');
            });

        }
    };
});

app.directive('validateExpMonth', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                if (viewValue > 12) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                if (viewValue < 1) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                ctrl.$setValidity('month', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateExpYear', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                if (viewValue.length > 4) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                if (viewValue.length < 2) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                ctrl.$setValidity('year', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateCvv', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                var type = attrs.validateCvv;
                var length;

                // If the supplied cart number is Amex, then the length must be 4. Otherwise, 3.
                if (type) {
                    if (type.substring(0, 1).toString() == "3") {
                        length = 4;
                    } else {
                        length = 3;
                    }
                }

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                if (viewValue.length < 3) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                if (viewValue.length > 4) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                // If the length is defined, we have a card number which means we know the card type. If the length does not match the card type, error.
                if (length) {
                    if (viewValue.length != length) {
                        ctrl.$setValidity('cvv', false);
                        return undefined;
                    }
                }

                ctrl.$setValidity('cvv', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateCard', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                // Strip any whitespace
                viewValue = utils.removeWhitespace(viewValue);

                if (utils.isNullOrEmpty(viewValue)) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (/^\d+$/.test(viewValue) == false) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (viewValue.length < 14) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (viewValue.length > 19) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (utils.luhnCheck(viewValue) == false) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                ctrl.$setValidity('card', true);
                return viewValue;

            });

        }

    };

});

app.directive('isValidInteger', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$validators.characters = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (attrs.allowEmptyValue == "true" && (value == "" || value == null)) {
                    return true;
                }
                if (utils.isValidInteger(value) == false) {
                    return false;
                }
                if (attrs.max) {
                    if (value > attrs.max) {
                        return false;
                    }
                }
                if (attrs.lessThan) {
                    if (value >= attrs.lessThan) {
                        return false;
                    }
                }
                if (attrs.min) {
                    if (value < attrs.min) {
                        return false;
                    }
                }
                if (attrs.greaterThan) {
                    if (value <= attrs.greaterThan) {
                        return false;
                    }
                }
                return true;
            };
        }
    };
});

app.directive('isValidNumber', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$validators.characters = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (attrs.allowEmptyValue == "true" && (value == "" || value == null)) {
                    return true;
                }
                if (utils.isValidNumber(value) == false) {
                    return false;
                }
                if (attrs.max) {
                    if (value > attrs.max) {
                        return false;
                    }
                }
                if (attrs.lessThan) {
                    if (value >= attrs.lessThan) {
                        return false;
                    }
                }
                if (attrs.min) {
                    if (value < attrs.min) {
                        return false;
                    }
                }
                if (attrs.greaterThan) {
                    if (value <= attrs.greaterThan) {
                        return false;
                    }
                }
                return true;
            };
        }
    };
});

app.directive('promoCode', ['CartService', '$timeout', function (CartService, $timeout) {

    // Shared scope:
    // cart: The cart to which the promo code should be applied
    // onAdd: A function that will be called from scope when the currency is successfully changed. Will include the newly updated cart as a parameter.
    // onRemove: A function that will be called from scope when the currency is successfully changed. Will include the newly updated cart as a parameter.
    // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the promotion code request
    //<div class="col-xs-12 promo-code" ng-cloak promo-code cart="data.cart" error="data.error">
    //    <label class="ask-promo-code">Enter Promo Code</label>
    //    <div class="form-inline supply-promo-code">
    //        <input class="form-control" type="text" placeholder="{{ 'Enter Promo Code' | translate}}">
    //        <button type="submit" class="btn btn-info apply-promo-code">Apply</button>
    //    </div>
    //    <div class="applied-promo-code">
    //        <strong translate>Discount applied.</strong>&nbsp;&nbsp;<strong class="text-success">{{data.cart.promotion_code}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-trash fa-lg pointer remove-promo-code"></i>
    //    </div>
    //</div>

    return {
        restrict: 'A',
        scope: {
            cart: '=?',
            params: '=?',
            error: '=?',
            onAdd: '=?',
            onRemove: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            var label = angular.element(elem[0].querySelector('.ask-promo-code'));
            var request = angular.element(elem[0].querySelector('.supply-promo-code'));
            var applied = angular.element(elem[0].querySelector('.applied-promo-code'));
            var input = angular.element(elem.find("input"));
            var button = angular.element(elem[0].querySelector('.apply-promo-code'));
            var remove = angular.element(elem[0].querySelector('.remove-promo-code'));

            // Set the state
            request.addClass("hidden");
            applied.addClass("hidden");

            scope.$watch("cart", function (newCart, oldCart) {
                if (newCart) {
                    if (newCart.promotion_code) {
                        label.addClass("hidden");
                        applied.removeClass("hidden");
                    } else {
                        applied.addClass("hidden");
                    }
                }
            });

            label.bind("click", function () {

                label.addClass("hidden");
                request.removeClass("hidden");

                // Focus the input
                $timeout(function () {
                    elem.find("input")[0].focus();
                });

            });

            button.bind("click", function () {

                // Get the promo code
                var promoCode = input.val();

                if (utils.isNullOrEmpty(promoCode)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Build the request
                var cart = { promotion_code: promoCode };

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.update(cart, scope.params).then(function (cart) {
                    scope.cart = cart;

                    // Fire the add event
                    if (scope.onAdd) {
                        scope.onAdd(cart);
                    }

                    // Hide the request form
                    request.addClass("hidden");

                    // Show the applied field
                    applied.removeClass("hidden");

                }, function (error) {

                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });

            });

            remove.bind("click", function () {

                // Reset the promo code
                input.val("");

                // Clear previous errors
                scope.error = null;

                // Build the request
                var cart = { promotion_code: null };

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.update(cart, scope.params).then(function (cart) {
                    scope.cart = cart;

                    // Fire the remove event
                    if (scope.onRemove) {
                        scope.onRemove(cart);
                    }

                    // Show the label
                    label.removeClass("hidden");

                    // Hide the applied field
                    applied.addClass("hidden");

                }, function (error) {
                    scope.error = error;

                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });

            });

            input.bind("blur", function () {

                // On blur, if no code is supplied, reset back to default
                if (utils.isNullOrEmpty(input.val())) {
                    request.addClass("hidden");
                    applied.addClass("hidden");
                    label.removeClass("hidden");

                    // Clear previous errors
                    $timeout(function () {
                        scope.error = null;
                    });
                }

            });

        }
    };
}]);

app.directive('customerSignin', ['CartService', 'CustomerService', '$timeout', function (CartService, CustomerService, $timeout) {

    // Shared scope:
    // cart: The cart to which the login should be applied, if the login is associated with a cart
    // customer: The customer object to which the login should be applied. Must be provided if a cart is not provided, if a cart is provided this is unnecessary and will not be used.
    // paymentMethod: The cart's payment method object
    // onSigninSubmit: A function that will be called when the signin is submitted.
    // onSignoutSubmit: A function that will be called when the signout is submitted.
    // onSigninSuccess: A function that will be called when the signin is successfully completed. Will include the cart as a parameter.
    // onSignoutSuccess: A function that will be called when the signout is successfully completed. Will include the cart as a parameter.
    // onSigninError: A function that will be called when the signin fails. Will include an error object as a parameter.
    // onSignoutError: A function that will be called when the signout fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.
    // options: The cart options that indicates if the login prompt should be shown or not.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the signin
    //<div customer-signin cart="data.cart" payment-method="data.payment_method" options="data.cart.options" error="data.error" params="params">

    //    <div class="well clearfix ask-signin">
    //        <strong><span translate>Have an account?</span></strong>
    //        <strong><a class="pointer pull-right show-signin" translate>Sign In</a></strong>
    //    </div>

    //    <div class="well clearfix supply-signin">
    //        <div class="col-xs-12 col-md-6" id="un">
    //            <div class="form-group">
    //                <label class="control-label" for="un" translate>Username</label>
    //                <input class="form-control signin-username" name="un" type="text">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 col-md-6" id="pw">
    //            <div class="form-group">
    //                <label class="control-label" for="pw" translate>Password</label>
    //                <input class="form-control signin-password" name="pw" type="password">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 text-right">
    //            <button class="btn btn-sm cancel-signin" translate>Cancel</button>
    //            <button type="submit" class="btn btn-default btn-sm submit-signin" customer-login cart="data.cart" username="data.un" password="data.pw" error="data.error" translate>Sign In</button>
    //        </div>
    //    </div>

    //    <div class="well signed-in">
    //        <span>Signed in as {{data.cart.customer.username}}</span><strong><a class="pointer pull-right submit-signout" customer-logout cart="data.cart" error="data.error" translate>Sign out</a></strong>
    //    </div>

    //</div>        


    return {
        restrict: 'A',
        scope: {
            cart: '=',
            customer: '=',
            paymentMethod: '=?',
            options: '=?',
            params: '=?',
            error: '=?',
            onSigninSubmit: '=?',
            onSignoutSubmit: '=?',
            onSigninSuccess: '=?',
            onSignoutSuccess: '=?',
            onSigninError: '=?',
            onSignoutError: '=?'
        },
        link: function (scope, elem, attrs) {

            var askSignin = angular.element(elem[0].querySelector('.ask-signin'));
            var showSignin = angular.element(elem[0].querySelector('.show-signin'));
            var supplySignin = angular.element(elem[0].querySelector('.supply-signin'));
            var username = angular.element(elem[0].querySelector('.signin-username'));
            var password = angular.element(elem[0].querySelector('.signin-password'));
            var submit = angular.element(elem[0].querySelector('.submit-signin'));
            var cancel = angular.element(elem[0].querySelector('.cancel-signin'));
            var signedIn = angular.element(elem[0].querySelector('.signed-in'));
            var signOut = angular.element(elem[0].querySelector('.submit-signout'));

            var hideAll = function () {
                askSignin.addClass("hidden");
                supplySignin.addClass("hidden");
                signedIn.addClass("hidden");
            };

            // Set the default state
            elem.addClass("hidden");
            hideAll();

            scope.$watchGroup(["options", "cart", "customer"], function (newValues, oldValues) {

                var options = newValues[0];
                var cart = newValues[1];
                var customer = newValues[2];

                if (options) {
                    if (options.customer_optional_fields) {
                        if (options.customer_optional_fields.indexOf("username") >= 0) {
                            hideAll();
                            elem.removeClass("hidden");
                            askSignin.removeClass("hidden");
                        }
                    }
                }

                if (cart) {
                    if (cart.customer) {
                        hideAll();
                        if (cart.customer.username) {
                            signedIn.removeClass("hidden");
                        } else {
                            askSignin.removeClass("hidden");
                        }
                    }
                }

                if (customer) {
                    hideAll();
                    if (customer.username) {
                        signedIn.removeClass("hidden");
                    } else {
                        askSignin.removeClass("hidden");
                    }
                }

            }, true);

            showSignin.bind("click", function () {

                askSignin.addClass("hidden");
                supplySignin.removeClass("hidden");

                // Focus the input
                $timeout(function () {
                    elem.find("input")[0].focus();
                });

            });

            // Bind to the password enter event
            password.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the username enter event
            username.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the submit button click          
            submit.bind("click", function (event) {
                submitForm();
            });

            signOut.bind("click", function () {

                // Fire the event
                if (scope.onSignoutSubmit) {
                    scope.onSignoutSubmit();
                }

                // If associated with a cart, log the customer out of the cart to disassociated the cart from the user.
                if (scope.cart) {

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "customer.payment_methods");

                    CartService.logout(params).then(function (cart) {

                        scope.cart = cart;

                        // Delete the payment_method_id on the payment method object
                        delete scope.paymentMethod.payment_method_id;

                        // Fire the success event
                        if (scope.onSignoutSuccess) {
                            scope.onSignoutSuccess(cart);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSignoutError) {
                            scope.onSignoutError(error);
                        }

                    });

                } else {

                    // Not associated with a cart
                    if (scope.customer) {

                        scope.$apply(function () {

                            // Reset the customer to empty. Set country explicitly to null otherwise you end up with an option 'undefined' in country HTML select controls.
                            scope.customer = { billing_address: { country: null }, shipping_address: { country: null } };

                            // Delete the payment_method_id on the payment method object
                            delete scope.paymentMethod.payment_method_id;
                        });

                        // Fire the success event
                        if (scope.onSignoutSuccess) {
                            scope.onSignoutSuccess();
                        }
                    }

                }

            });

            cancel.bind("click", function () {

                // Reset the username and password
                username.val("");
                password.val("");

                // Clear previous errors
                scope.error = null;

                // Reset back to login prompt.
                hideAll();
                askSignin.removeClass("hidden");

            });

            var submitForm = function () {

                // Get the login values
                var un = username.val();
                var pw = password.val();

                if (utils.isNullOrEmpty(un) || utils.isNullOrEmpty(pw)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Fire the event
                if (scope.onSigninSubmit) {
                    scope.onSigninSubmit();
                }

                // Build the login object
                var login = { username: un, password: pw };

                // If a cart is provided, log the user into the cart.
                if (scope.cart) {

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "customer.payment_methods");

                    CartService.login(login, params).then(function (cart) {

                        scope.cart = cart;

                        // Remove the username and password
                        username.val("");
                        password.val("");

                        // If the customer has payment methods and the payment method object is supplied, assign the default payment method id
                        if (cart.customer.payment_methods.data.length > 0 && scope.paymentMethod) {
                            var payment_method_id = _.findWhere(cart.customer.payment_methods.data, { is_default: true }).payment_method_id;
                            scope.paymentMethod = { payment_method_id: payment_method_id };
                        }

                        // Fire the success event
                        if (scope.onSigninSuccess) {
                            scope.onSigninSuccess(cart);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSigninError) {
                            scope.onSigninError(error);
                        }

                    });

                } else {

                    // Otherwise, log the customer in directly.

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "payment_methods");

                    CustomerService.login(login, params).then(function (customer) {

                        // Update the customer object with the returned customer.
                        scope.customer = customer;

                        // Remove the username and password
                        username.val("");
                        password.val("");

                        // If the customer has payment methods and the payment method object is supplied, assign the default payment method id
                        if (customer.payment_methods.data.length > 0 && scope.paymentMethod) {
                            var payment_method_id = _.findWhere(customer.payment_methods.data, { is_default: true }).payment_method_id;
                            scope.paymentMethod = { payment_method_id: payment_method_id };
                        }

                        // Fire the success event
                        if (scope.onSigninSuccess) {
                            scope.onSigninSuccess(customer);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSigninError) {
                            scope.onSigninError(error);
                        }

                    });

                }

            };

        }
    };
}]);

app.directive('createAccount', ['CustomerService', '$timeout', function (CustomerService, $timeout) {

    // Shared scope:
    // customer: The customer for which an account will be created. Must include the customer_id.
    // onSubmit: A function that will be called when the signin is submitted.
    // onSuccess: A function that will be called when the signin is successfully completed. Will include the cart as a parameter.
    // onError: A function that will be called when the signout fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.
    // options: The cart options that indicates if the create account prompt should be shown or not.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the signin
    //<div customer-signin cart="data.cart" payment-method="data.payment_method" options="data.cart.options" error="data.error" params="params">

    //    <div class="well clearfix ask-signin">
    //        <strong><span translate>Have an account?</span></strong>
    //        <strong><a class="pointer pull-right show-signin" translate>Sign In</a></strong>
    //    </div>

    //    <div class="well clearfix create-account">
    //        <div class="col-xs-12 col-md-6" id="un">
    //            <div class="form-group">
    //                <label class="control-label" for="un" translate>Username</label>
    //                <input class="form-control signin-username" name="un" type="text">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 col-md-6" id="pw">
    //            <div class="form-group">
    //                <label class="control-label" for="pw" translate>Password</label>
    //                <input class="form-control signin-password" name="pw" type="password">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 text-right">
    //            <button class="btn btn-sm cancel-signin" translate>Cancel</button>
    //            <button type="submit" class="btn btn-default btn-sm submit-signin" customer-login cart="data.cart" username="data.un" password="data.pw" error="data.error" translate>Sign In</button>
    //        </div>
    //    </div>

    //    <div class="well signed-in">
    //        <span>Signed in as {{data.cart.customer.username}}</span><strong><a class="pointer pull-right submit-signout" customer-logout cart="data.cart" error="data.error" translate>Sign out</a></strong>
    //    </div>

    //</div>        


    return {
        restrict: 'A',
        scope: {
            customer: '=',
            options: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs) {

            var supplyCredentials = angular.element(elem[0].querySelector('.supply-credentials'));
            var username = angular.element(elem[0].querySelector('.create-account-username'));
            var password = angular.element(elem[0].querySelector('.create-account-password'));
            var submit = angular.element(elem[0].querySelector('.submit-create-account'));
            var accountCreated = angular.element(elem[0].querySelector('.account-created'));

            // Set the default state
            elem.addClass("hidden");
            accountCreated.addClass("hidden");

            scope.$watchGroup(["options", "customer"], function (newValues, oldValues) {

                var options = newValues[0];
                var customer = newValues[1];

                // When both the options and customer come through, look to see if the field is set in the options and that a customer username is not already set.
                if (options && customer) {
                    if (options.customer_optional_fields) {
                        if (options.customer_optional_fields.indexOf("username") >= 0 && !customer.username) {
                            // Show the form.
                            elem.removeClass("hidden");
                        }
                    }
                }
            });

            // Bind to the password enter event
            password.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the username enter event
            username.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the submit button click          
            submit.bind("click", function (event) {
                submitForm();
            });

            var submitForm = function () {

                // Get the login values
                var un = username.val();
                var pw = password.val();

                if (utils.isNullOrEmpty(un) || utils.isNullOrEmpty(pw)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Fire the event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Build the login object
                scope.customer.username = un;
                scope.customer.password = pw;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "customer.payment_methods");

                CustomerService.createAccount(scope.customer, scope.params).then(function (customer) {

                    scope.customer = customer;

                    // Remove the username and password
                    username.val("");
                    password.val("");

                    // Show the success message
                    accountCreated.removeClass("hidden");

                    // Hide the login form
                    supplyCredentials.addClass("hidden");

                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(customer);
                    }

                }, function (error) {

                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });
            };
        }
    };
}]);

app.directive('selectStateProv', ['GeoService', '$timeout', function (GeoService, $timeout) {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            scope.$watch(attrs.country, function (country, oldCountry) {

                if (country) {
                    var statesProvs = GeoService.getStatesProvs(country);

                    var elemNg = angular.element(elem[0]);

                    // Reset the existing options. If the value is empty, leave in place, this is the "blank" option in the list.
                    var hasEmpty = false;
                    for (var i = elemNg[0].options.length - 1; i >= 0; i--) {
                        if (elemNg[0].options[i].value) {
                            elemNg[0].remove(i);
                        } else {
                            hasEmpty = true;
                        }
                    }

                    // If it doesn't have an empty value, add it.
                    if (!hasEmpty) {
                        elemNg[0].appendChild(document.createElement("option"));
                    }

                    var value = ctrl.$viewValue || ctrl.$modelValue;
                    var hasSelected = false;

                    _.each(statesProvs, function (stateProv) {
                        var option = '<option class="select-options-color" value="' + stateProv.code + '"';
                        if (value == stateProv.code) {
                            option += " selected";
                            hasSelected = true;
                        }
                        option += '>' + stateProv.name + '</option>';
                        elemNg.append(option);
                    });

                    // If not item was selected, then there was no match. If the control currently has a value for state, reset it.
                    if (hasSelected == false) {
                        ctrl.$setViewValue(null);
                    }
                }
            });
        }
    };
}]);

app.directive('customerBackgroundSave', ['CartService', '$timeout', function (CartService, $timeout) {

    // Shared scope:
    // cart: The updated cart to save. If an existing cart does not exist, one will be created and returned.
    // error: The error object to communicate errors.
    // onSuccess: A function that will be called from scope when the save is successfully completed. Includes the cart as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // quiet: true / false to indicate if the loading bar should be displayed while calling the API. Default is false.

    return {
        restrict: 'A',
        scope: {
            cart: '=customerBackgroundSave',
            shippingIsBilling: '=?',
            params: '=?',
            error: '=?',
            onSuccess: '=?',
    },
        link: function (scope, elem, attrs, ctrl) {

            // Find all inputs that have the attribute of customer-field
            var fields = document.querySelectorAll(".customer-background-save");

            // Only allow one update buffer per page.
            var updateBuffer;

            _.each(fields, function (input) {

                // Bind on blur as the default, on change for select.
                var event = "blur";
                if (input.nodeName == "SELECT") {
                    event = "change";
                }
                if (input.type == "checkbox") {
                    event = "click";
                }

                var inputNg = angular.element(input);

                // Track original value because blur events don't care if value has changed.
                var originalVal = inputNg.val();

                inputNg.bind(event, function () {
                    // Ensure that value has really changed, triggering on blur event makes this needed.
                    if (event == 'blur' && angular.equals(originalVal,inputNg.val())) return;
                    // Reset original value so we can track later changes by user.
                    originalVal = inputNg.val();

                    if (updateBuffer) {
                        $timeout.cancel(updateBuffer);
                    }

                    // Wrap in timeout and apply a buffer so that if a form fill agent is used you only perform one update at the end. The buffer is 25 ms, which seems to accomplish the job.
                    updateBuffer = $timeout(function () {

                        // Since this is a "background update", we need special handling. Angular converts required fields to undefined when they are zero-length, which means they are stripped from the api payload.
                        // This means that if a user sets an item to blank, it will re-populate itself on update because the API didn't see it and didn't know to null it. We'll set all undefined items to null.
                        var cartCopy = angular.copy(scope.cart);
                        utils.undefinedToNull(cartCopy);

                        // Prep the params
                        var params = scope.params || attrs.params;
                        params = utils.mergeParams(params, null, null);

                        if (scope.cart) {

                            // Use the ngModel attribute to get the property name
                            var property = input.getAttribute("ng-model");

                            if (property) {

                                // Strip everything before customer.
                                property = property.split("customer.")[1];

                                scope.cart.customer[property] = inputNg.val();

                                // If set that billing is same as shipping, set all shipping values to null so that the API doesn't receive any of the data set on the view.
                                if (scope.shippingIsBilling) {
                                    if (cartCopy.customer.shipping_address) {
                                        cartCopy.customer.shipping_address.name = null;
                                        cartCopy.customer.shipping_address.address_1 = null;
                                        cartCopy.customer.shipping_address.address_2 = null;
                                        cartCopy.customer.shipping_address.city = null;
                                        cartCopy.customer.shipping_address.state_prov = null;
                                        cartCopy.customer.shipping_address.postal_code = null;
                                        cartCopy.customer.shipping_address.country = null;
                                    }
                                }

                                CartService.update(cartCopy, scope.params, true).then(function (cart) {

                                    // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                                    if (scope.cart) {
                                        cart.customer = scope.cart.customer;
                                    }

                                    // Sync the scope to the response.
                                    scope.cart = cart;

                                    // Fire the success event
                                    if (scope.onSuccess) {
                                        scope.onSuccess(cart);
                                    }

                                }, function (error) {
                                    scope.error = error;
                                });
                            }
                        }
                    }, 25); // Timeout set to a value that prevents sending every value if user presses and holds down arrow on country select.
                });
            });

        }
    };
}]);

app.directive('creditCardImage', [function () {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            scope.$watch(attrs.creditCardImage, function (creditCardImage) {

                var path = "images/";
                if (attrs.path) {
                    path = attrs.path;
                }

                if (creditCardImage) {
                    var filename = creditCardImage.replace(" ", "").toLowerCase() + ".png";
                    var image = '<img src="' + path + filename + '" />';
                    var elemNg = angular.element(elem);
                    elemNg.empty();
                    elemNg.html(image);
                }

            });
        }
    };
}]);

app.directive('creditCards', ['CartService', function (CartService) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            var path = "images/";
            if (attrs.path) {
                path = attrs.path;
            }

            scope.$watch(attrs.creditCards, function (newVal) {
                if (_.isArray(newVal)) {
                    var images = "";
                    _.each(newVal, function (item) {
                        var filename = item.replace(" ", "").toLowerCase() + ".png";
                        images += '<img src="' + path + filename + '" title="' + item + '" />';
                    });

                    var elemNg = angular.element(elem);
                    elemNg.empty();
                    elemNg.html(images);
                }
            });

        }
    };
}]);

app.directive('stateProvInput', ['GeoService', '$compile', function (GeoService, $compile) {

    return {
        restrict: 'E',
        terminal: true,
        link: function (scope, elem, attrs) {

            attrs.$observe('country', function (country) {

                if (country) {

                    var statesProvs = GeoService.getStatesProvs(attrs.country);

                    if (attrs.type == "select") {

                        // The select element is the template
                        var template = elem[0].querySelector("select").outerHTML;

                        if (statesProvs == null) {

                            // Remove ngModel
                            template = template.replace("ng-model", "suspend-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        } else {

                            // Add ngModel
                            template = template.replace("suspend-model", "ng-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        }

                    }

                    if (attrs.type == "input") {

                        // The select element is the template
                        var template = elem[0].querySelector("input").outerHTML;

                        if (statesProvs != null) {

                            // Remove ngModel
                            template = template.replace("ng-model", "suspend-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        } else {

                            // Add ngModel
                            template = template.replace("suspend-model", "ng-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        }

                    }

                }
            });

        }
    };

}]);

app.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                this.select();
            });
        }
    };
});

app.directive('fields', ['CartService', 'InvoiceService', '$timeout', '$rootScope', 'LanguageService', function (CartService, InvoiceService, $timeout, $rootScope, LanguageService) {

    return {
        restrict: 'AE',
        templateUrl: "app/templates/fields.html",
        scope: {
            fieldlist: '=',
            sale: '=',
            appSettings: '=',
            appStyle: '='
        },
        link: function (scope, elem, attrs, ctrl) {

            // Shared scope:
            // fieldlist: The list of field configurations
            // sale: The cart or invoice
            // appSettings: The app settings as delivered through settings/app.js (or .json)
            // appStyle: The app style as delivered through settings/style.js (or .json)

            // The fieldlist will be supplied as a JSON string that must be parsed into an object.
            scope.fields = [];

            var loadFields = function (fieldsJson) {

                // If the fields are a string, parse to an object.
                var fields = [];

                if (typeof fieldsJson == "string" && utils.isNullOrEmpty(fieldsJson) == false) {
                    // Make sure you have valid JSON
                    try {
                        fields = JSON.parse(fieldsJson);
                    } catch (e) {
                        // Set to an empty array if not.
                        fields = [];
                        // Log to help in debugging
                        console.log("The JSON provided for custom fields is not valid JSON. As a result, no custom fields will display. Error message: " + e);
                    }
                }

                // Group by section.
                fields = groupFields(fields);

                // If the user's language is provided in any of the fields, use that language.
                var language = LanguageService.getSelectedLanguage().code;

                _.each(fields, function (field) {

                    if (field.languages) {
                        if (field.languages[language]) {

                            if (field.languages[language].label) {
                                field.label = field.languages[language].label;
                            }

                            if (field.languages[language].description) {
                                field.description = field.languages[language].description;
                            }

                            if (field.languages[language].section) {
                                field.section = field.languages[language].section;
                            }

                            if (field.languages[language].options) {
                                field.options = field.languages[language].options;
                            }

                        }
                    }

                });

                return fields;

            };

            var groupFields = function (fields) {

                // Group the objects together by section
                var sorted = [];
                var processed = [];
                _.each(fields, function (item) {

                    if (processed.indexOf(item.section) == -1) {
                        var matches = _.where(fields, { section: item.section });

                        if (matches) {
                            sorted = sorted.concat(matches);
                            processed.push(item.section);
                        }
                    }

                });

                return sorted;
            };

            var loadDefaults = function (fields, meta) {

                // Loop through the fields and set the default values if a value is not already provided.
                for (var property in fields) {

                    // Set default values for any selections that don't already have a value.
                    if (fields.hasOwnProperty(property)) {
                        if (scope.sale.meta[fields[property].name] == null) {
                            scope.sale.meta[fields[property].name] = fields[property].default_value;
                        }
                    }

                }

            };

            // Load the fields.           
            scope.fields = loadFields(scope.fieldlist);

            // On the first time the sale is loaded, loop through the fields and set default vaules for items that don't already have a value.
            var cancelWatch = scope.$watch('sale.meta', function (newVal, oldValue) {

                // If the sale isn't populated yet, return.
                if (scope.sale == null) {
                    return;
                }

                // If the current selections are null, set to an empty object.
                if (scope.sale.meta == null) {
                    scope.sale.meta = {};
                }

                loadDefaults(scope.fields, scope.sale.meta);

                // With the initial load done, we can cancel the watcher.
                cancelWatch();

            }, true);

            // If the language changes, reload the fields, which will update the display language.
            $rootScope.$on("languageChanged", function (event, language) {
                scope.fields = loadFields(scope.fieldlist);
            });

            scope.pushToProperty = function (property, value, recordOnChange) {

                // If it doesn't exist, add it. If it exists, remove it.
                if (scope.isInProperty(property, value) == false) {
                    if (scope.sale.meta[property] == null) {
                        scope.sale.meta[property] = [];
                        scope.sale.meta[property].push(value);
                    } else {
                        scope.sale.meta[property].push(value);
                    }
                } else {
                    scope.sale.meta[property] = _.without(scope.sale.meta[property], value);
                }

                // If record, save the change
                if (recordOnChange) {
                    scope.record();
                }

            };

            scope.isInProperty = function (property, value) {

                if (scope.sale == null) {
                    return false;
                }

                if (scope.sale.meta == null) {
                    return false;
                }

                if (scope.sale.meta[property] != null) {
                    if (_.indexOf(scope.sale.meta[property], value) >= 0) {
                        return true;
                    }
                }

                return false;

            };

            scope.isNewSection = function (field, index) {

                // The fields come from the api grouped in sections which makes it easy to determine when sections have changed.

                // The first item is always "new"
                if (index == 0) {
                    return true;
                }

                // Otherwise, select the item immediately before this item and see if it's different
                var previous = scope.fields[index - 1];
                if (previous != null) {
                    if (previous.section != field.section) {
                        return true;
                    }
                }

                return false;

            };

            // Save any changes, as requested.
            scope.record = function () {
                // We'll only update the meta
                var sale = { meta: scope.sale.meta };
                if (scope.sale.object == "invoice") {
                    InvoiceService.update(sale);
                } else {
                    CartService.update(sale);
                }
            };

        }
    };

}]);

app.directive('validateField', ['gettextCatalog', '$timeout', function (gettextCatalog, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            field: '=validateField',
            error: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            var error = scope.error;
            var field = scope.field;

            // If required, initialize the error with a required error message.
            if (utils.isNullOrEmpty(elem[0].value) && field.required == true) {
                scope.error = gettextCatalog.getString("Please provide a value");
            }

            // Use a different message for boolean or toggle.
            if (field.type == "boolean" && field.required == true) {
                scope.error = gettextCatalog.getString("Please make a selection");
            }

            // A toggle field with required == true means a checkbox that you must check (i.e. accept terms and conditions or something, not allowed to leave it unchecked)
            if (field.type == "toggle" && field.required == true) {
                scope.error = gettextCatalog.getString("Please confirm");
            }

            ctrl.$parsers.unshift(function (viewValue) {

                // Reset the error
                var errorMsg = null;

                // Do some additinal testing for decimals and numbers.
                if (viewValue != null || field.required == true) {

                    switch (field.type) {

                        case "integer":

                            if (!utils.isValidInteger(viewValue)) {
                                errorMsg = gettextCatalog.getString("Please supply a number without decimals");
                            }
                            break;

                        case "decimal":

                            if (!utils.isValidNumber(viewValue)) {
                                errorMsg = gettextCatalog.getString("Please supply a number");
                            }
                            break;

                    }

                    // Regardless of the above, if options is not null, change the text
                    if (field.options != null && utils.isNullOrEmpty(viewValue)) {
                        errorMsg = gettextCatalog.getString("Please make a selection");
                    }

                    // If no error, check restraints
                    if (errorMsg == null) {

                        // If a list of options are provided, ensure the provided value is within the range.
                        if (field.options != null) {
                            if (_.where(field.options, { value: viewValue }) == null) {
                                errorMsg = gettextCatalog.getString("Please provide one of the available options");
                            }
                        }

                        // Range check if a integer or decimal
                        if (field.type == "integer" || field.type == "decimal") {

                            if (field.min_value) {
                                if (viewValue < field.min_value) {
                                    errorMsg = gettextCatalog.getPlural(field.min_value, "The value you provide must be greater than {{$count}}", "The value you provide must be greater than {{$count}}", {});
                                }
                            }

                            if (field.max_value) {
                                if (viewValue > field.max_value) {
                                    errorMsg = gettextCatalog.getPlural(field.max_value, "The value you provide must be less than {{$count}}", "The value you provide must be less than {{$count}}", {});
                                }
                            }

                        }

                        // Size check if string or text
                        if (field.type == "string" || field.type == "text") {

                            if (field.min_length) {
                                if (viewValue.length < field.min_length) {
                                    errorMsg = gettextCatalog.getPlural(field.min_length, "The value must be at least one character", "The value must be at least {{$count}} characters", {});
                                }
                            }

                            if (field.max_length) {
                                if (viewValue.length > field.max_length) {
                                    errorMsg = gettextCatalog.getPlural(field.max_length, "The value must be less than one character", "The value must be less than {{$count}} characters", {});
                                }
                            }
                        }

                    }
                }

                if (errorMsg != null) {
                    ctrl.$setValidity('field', false);
                    scope.error = errorMsg;
                    return undefined;
                }

                ctrl.$setValidity('field', true);
                return viewValue;

            });
        }
    };
}]);

app.directive('cleanPrice', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            var clean = function (value) {
                if (angular.isUndefined(value)) {
                    return;
                }
                var cleanedPrice = utils.cleanPrice(value);
                if (cleanedPrice !== value) {
                    ctrl.$setViewValue(cleanedPrice);
                    ctrl.$render();
                }
                return cleanedPrice;
            }

            ctrl.$parsers.unshift(clean);
            clean(scope[attrs.ngModel]);
        }
    };
}]);

app.directive('amazonPayButton', ['gettextCatalog', function (gettextCatalog) {

    // Shared scope:
    // paymentMethod: Provide the payment method object that will hold the Amazon Pay settings that are returned from the Amazon Pay button and widgets.
    // options: The cart, invoice or payment options, from which the Amazon Pay client and seller settings will be obtained.
    // items: The cart or invoice items, if applicable, to determine if the order contains subscription products and a billing agreemement should be established for the customer.
    // onLoaded: A function that will be called when the Amazon Pay button has been loaded.
    // onAddressSelect: A function that will be called when the customer selects an address from their Amazon Pay address book.
    // onPaymentMethodSelect: A function that will be called when the customer selects a payment method from their Amazon Pay wallet.
    // onConsentChange: A function that will be called when the user toggles the Amazon Pay consent checkbox. Returns the status of the consent checkbox as a parameter.
    // getConsentStatus: A function that is set by the directive and can be called to get the status of the Amazon Pay consent checkbox.
    // error: The error object to communicate errors.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // amazonPayAddressId: The ID of the HTML element that will hold the Amazon Pay address widget
    // amazonPayWalletId: The ID of the HTML element that will hold the Amazon Pay wallet widget
    // amazonPayConsentId: The ID of the HTML element that will hold the Amazon Pay consent widget (used when the payment method will be stored)
    // amazonPayDesignMode: Provides the Amazon Pay design mode, the only current value seems to be "responsive". If nothing is provided, "responsive" will be provided automatically. See https://pay.amazon.com/us/developer/documentation/lpwa/201952070.
    // amazonPayType: The type of button, "PwA", "Pay", "A"
    // amazonPayColor: The color of the button, "Gold", "LightGray", "DarkGray"
    // amazonPayButtonSize: The size of the button, "small", "medium", "large", "x-large"

    return {
        restrict: 'A',
        scope: {
            paymentMethod: '=?',
            options: '=?',
            items: '=?',
            params: '=?',
            onLoaded: '=?',
            onAddressSelect: '=?',
            onPaymentMethodSelect: '=?',
            onConsentChange: '=?',
            getConsentStatus: '=?',
            error: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            var client_id = null;
            var seller_id = null;

            // Watch options and set Amazon Pay parameters if provided.
            scope.$watch("options", function (newValue, oldValue) {

                if (newValue) {

                    // Check if it has Amazon Pay
                    var ap = _.findWhere(newValue.payment_methods, { payment_method_type: "amazon_pay" });
                    if (ap) {

                        // Only create the button if the client_id or seller_id have changed.
                        if (ap.amazon_pay_client_id != client_id || ap.amazon_pay_seller_id != seller_id) {

                            // Hide any widgets and logout
                            amazonPay.hideWidgets(attrs.amazonPayAddressId, attrs.amazonPayWalletId, attrs.amazonPayConsentId);

                            // If these values currently aren't null, that means the values have changed. Log the customer out of any previous session.
                            if (client_id || seller_id) {
                                logout();
                            }

                            // Set the new ids.
                            client_id = ap.amazon_pay_client_id;
                            seller_id = ap.amazon_pay_seller_id;

                            // Create the button
                            createAmazonPayButton(client_id, seller_id);
                        }

                    } else {

                        // Hide the widgets
                        amazonPay.hideWidgets(attrs.amazonPayAddressId, attrs.amazonPayWalletId, attrs.amazonPayConsentId);
                    }
                }

            });

            // This function can be used by the user of the directive to get the consent status. It is typically passed into the submit-payment directive so it can error check the status of the checkbox.
            scope.getConsentStatus = function () {
                return amazonPay.getConsentStatus();
            }

            function createAmazonPayButton(client_id, seller_id) {

                // Create the button
                amazonPay.createPaymentButton(client_id, seller_id, attrs.id, attrs.amazonPayType, attrs.amazonPayColor, attrs.amazonPayButtonSize, function (error, data) {

                    if (error) {
                        setError("external_server_error", "remote_server_error", error, 502);
                        return;
                    }

                    // Set the data on the payment method
                    scope.$apply(function () {
                        setPaymentMethodData(data.access_token, data.order_reference_id, data.billing_agreement_id, seller_id);
                    });

                    // Determine if a billing agreement is required.
                    var recurring = requiresBillingAgreement(scope.items, scope.paymentMethod.save);

                    // Show the widgets
                    amazonPay.showWidgets(attrs.amazonPayAddressId, attrs.amazonPayWalletId, attrs.amazonPayConsentId, recurring);

                    amazonPay.loadWidgets(client_id, seller_id, recurring, attrs.amazonPayAddressId, attrs.amazonPayWalletId, attrs.amazonPayConsentId, scope.onAddressSelect, scope.onPaymentMethodSelect, scope.onConsentChange, attrs.amazonPayDesignMode, "Edit", function (error, data) {

                        if (error) {
                            setError("external_server_error", "remote_server_error", error, 502);
                            return;
                        }

                        // Set the data on the payment method
                        scope.$apply(function () {
                            setPaymentMethodData(data.access_token, data.order_reference_id, data.billing_agreement_id, data.seller_id);
                        });

                    });
                });
            }

            function requiresBillingAgreement(items, save) {
                var recurring = false
                for (var item_id in scope.items) {
                    if (scope.items[item_id].subscription_plan) {
                        return true;
                    }
                }

                if (scope.paymentMethod.save) {
                    return true;
                }

                return false;
            }

            function logout() {
                client_id = null;
                seller_id = null;
                setPaymentMethodData(null, null, null, null);
                amazonPay.logout();
            }

            function setPaymentMethodData(access_token, order_reference_id, billing_agreement_id, seller_id) {

                // If no access token, order reference or billing agreement, revmove the object to completely reset it.
                if (!access_token && !order_reference_id && !billing_agreement_id) {
                    if (scope.paymentMethod.data) {
                        delete scope.paymentMethod.data;
                    }
                    return;
                }

                scope.paymentMethod.data = { access_token: access_token, order_reference_id: order_reference_id, billing_agreement_id: billing_agreement_id, seller_id: seller_id };
            }

            function setError(type, code, message, status) {
                scope.$apply(function () {
                    scope.error = { type: type, reference: "MmJAvA8", code: code, message: message, status: status };
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });
            }

        }
    };
}]);

app.directive('amazonPayReset', ['gettextCatalog', function (gettextCatalog) {

    // Shared scope:
    // paymentMethod: Provide the payment method object that will hold the Amazon Pay settings that are returned from the Amazon Pay button and widgets.
    // onComplete: A function that is called after the reset is complete

    return {
        restrict: 'A',
        scope: {
            paymentMethod: '=?',
            onComplete: '=?',
    },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Reset the payment method data
                scope.$apply(function () {
                    amazonPay.logout();

                    if (scope.paymentMethod && scope.paymentMethod.data)
                    delete scope.paymentMethod.data;

                    if (scope.onComplete)
                        scope.onComplete();
                });

                // Hide the widgets
                amazonPay.hideWidgets(attrs.amazonPayAddressId, attrs.amazonPayWalletId, attrs.amazonPayConsentId);

            });
        }
    };
}]);

app.directive('amazonPayWidgetRefresh', ['gettextCatalog', function (gettextCatalog) {

    // Shared scope:
    // paymentError: The payment object of the failed payment that requires the widgets to be refreshed.
    // options: The cart, invoice or payment options, from which the Amazon Pay client and seller settings will be obtained.
    // onPaymentMethodSelect: A function that will be called when the customer selects a payment method from their Amazon Pay wallet.
    // error: The error object to communicate errors.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // amazonPayWalletId: The ID of the HTML element that will hold the Amazon Pay wallet widget
    // amazonPayDesignMode: Provides the Amazon Pay design mode, the only current value seems to be "responsive". If nothing is provided, "responsive" will be provided automatically. See https://pay.amazon.com/us/developer/documentation/lpwa/201952070.

    return {
        restrict: 'A',
        scope: {
            paymentError: '=?',
            options: '=?',
            params: '=?',
            onLoaded: '=?',
            onPaymentMethodSelect: '=?',
            error: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {


            scope.$watchGroup(["paymentError", 'options'], function (newValues, oldValues) {

                if (newValues && newValues != oldValues) {

                    var paymentError = newValues[0];
                    var options = newValues[1];

                    if (paymentError && options) {

                        var data = paymentError.payment_method.data;
                        var ap = _.findWhere(options.payment_methods, { payment_method_type: "amazon_pay" });
                        var recurring = data.billing_agreement_id != null;

                        amazonPay.reRenderWidgets(ap.amazon_pay_client_id, ap.amazon_pay_seller_id, data.order_reference_id, data.billing_agreement_id, attrs.amazonPayWalletId, scope.onPaymentMethodSelect, attrs.amazonPayDesignMode, function (error, data) {

                            if (error) {
                                setError("external_server_error", "remote_server_error", error, 502);
                                return;
                            }

                            // Show the widgets
                            amazonPay.showWidgets(null, attrs.amazonPayWalletId, null, false);

                        });
                    }
                }
            });

            function setError(type, code, message, status) {
                scope.$apply(function () {
                    scope.error = { type: type, reference: "MmJAvA8", code: code, message: message, status: status };
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });
            }

        }
    };
}]);

app.directive('hidePlaceholder', function () {
    return {
        restrict: 'A',
        scope: {
            hidePlaceholder: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {
            if (scope.hidePlaceholder && elem[0].getAttribute("placeholder")) {
                
                elem[0].removeAttribute("placeholder");

                arr = elem[0].className.split(" ");
                var name = "hide-placeholder";
                if (arr.indexOf(name) == -1) {
                    elem[0].className += " " + name;
                }

                // The translation filter can replace the removed placeholder, so we are going to allow the placeholder text to be made invisible by adding a hidden-placeholder class to the element.
                // The application will need to add the following CSS make use of the hidden-placeholder class:

                //  /* WebKit, Blink, Edge */
                //  .hide-placeholder.hidden-placeholder::-webkit-input-placeholder { color: transparent; opacity: 0 }

                //  /* Mozilla Firefox 4 to 18 */
                //  .hide-placeholder:-moz-placeholder { color: transparent; opacity: 0; }

                //  /* Mozilla Firefox 19+ */
                //  .hide-placeholder::-moz-placeholder { color: transparent; opacity: 0; }

                //  /* Internet Explorer 10-11, don't include opacity with IE or it will hide input borders */
                //  .hide-placeholder:-ms-input-placeholder { color: transparent; }

                //  /* Microsoft Edge */
                //  .hide-placeholder::-ms-input-placeholder { color: transparent; opacity: 0 }

                //  /* Most modern browsers */
                //  .hide-placeholder::placeholder { color: transparent; opacity: 0 }

                // The line below is the same as the rules above, just in a single line for easy portability.
                // .hide-placeholder::-webkit-input-placeholder{color:transparent;opacity:0}.hide-placeholder:-moz-placeholder{color:transparent;opacity:0}.hide-placeholder::-moz-placeholder{color:transparent;opacity:0}.hide-placeholder:-ms-input-placeholder{color:transparent;opacity:0}.hide-placeholder::-ms-input-placeholder{color:transparent;opacity:0}.hide-placeholder::placeholder{color:transparent;opacity:0}

            }
        }
    };
});

app.directive('selectNumbers', ['GeoService', '$timeout', function (GeoService, $timeout) {

    return {
        restrict: 'A',
        scope: {
            start: '=?',
            end: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            // Attributes
            // start: The starting number in the range
            // end: The ending number in the range
            // minLength: If less than this length, the number will be padded with leading zeros.

            scope.$watchGroup(['start', 'end'], function (newValues, oldValues) {

                if (newValues[0] && newValues[1]) {

                    var elemNg = angular.element(elem[0]);

                    // Reset the existing options. If the value is empty, leave in place, this is the "blank" option in the list.
                    var hasEmpty = false;
                    for (var i = elemNg[0].options.length - 1 ; i >= 0 ; i--) {
                        if (elemNg[0].options[i].value) {
                            elemNg[0].remove(i);
                        } else {
                            hasEmpty = true;
                        }
                    }

                    // If it doesn't have an empty value, add it.
                    if (!hasEmpty) {
                        elemNg[0].appendChild(document.createElement("option"));
                    }

                    for (var i = newValues[0]; i < newValues[1] + 1; i++) {
                        var display = i;
                        if (attrs.minLength && String(i).length < Number(attrs.minLength)) {
                            display = utils.right(("0" + i), 2);
                        }
                        var option = '<option class="select-options-color" value="' + i + '">' + display + '</option>';
                        elemNg.append(option);
                    }
                }

            });
        }
    };
}]);

app.directive('crossSell', ['CartService', function (CartService) {

    // Shared scope:
    // cart: The cart.

    // NOTE that the cross-sell element should have exactly one of the following attributes (and not more than one). See below for a couple of samples of usage.
    // add: A cross sell object to add to the queue of cross sells to be added to the cart at a later time.
    // remove: A cross sell object to remove from the queue of cross sells that would be added to the cart at a later time. Note this does not remove a cross sell item that has already been added to the cart.
    // toggle: Add a cross-sell item if it is in the queue, remove a cross sell item if it's already in the queue.
    // commit: Add a cross sell item to the cart. This only adds the item provided by commit and ignores any in queue.
    // commitQueued: Add the queue of cross sells to the cart. Provide the list of cross sells to add to the cart as the value

    // The 'queue' parameter is used to pass the items that have been selected for addition to the cart. It is used in combination with some of the items above.
    // queue: An object that holds the items that have been placed in queue to be added to the cart (for example, if you are using checkboxes to select cross sell items to add to cart)

    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object when the cart API is called.
    // onSuccess: A function that will be called when adding the cross sell(s) to the cart is successful. The cart will be included as a parameter.
    // onError: A function that will be called when adding the cross sell(s) to the cart fails. The error will be included as a parameter.
    // error: The error object to communicate errors.

    // A simple cross-sell "add to cart"
    // <div class="row" ng-repeat="item in data.cart.cross_sells.data">
    //     <div>{{item.name}}</div>
    //     <button class="btn btn-primary" cross-sell cart="data.cart" commit="item" params="data.params" error="data.error">Add to Cart</button>
    // </div>

    // Using checkboxes
    // <div class="row" ng-repeat="item in data.cart.cross_sells.data">
    //     <span>{{item.name}}</span>
    //     <input type="checkbox" cross-sell cart="data.cart" queue="data.queue" toggle="item" params="data.params">
    // </div>
    // <div class="row">
    //     <button class="btn btn-primary" cross-sell cart="data.cart" commit-queued="data.queue" params="data.params" error="data.error">Add to Cart</button>
    // </div>

    // A horrible UI but shows another methodology that might be worked into a particular use case.
    // <div class="row" ng-repeat="item in data.cart.cross_sells.data">
    //     <div>{{item.name}}</div>
    //     <button class="btn btn-primary" cross-sell cart="data.cart" add="item" queue="data.queue" params="data.params">Place in Queue</button>
    //     <button class="btn btn-primary" cross-sell cart="data.cart" remove="item" queue="data.queue" params="data.params">Remove from Queue</button>
    // </div>
    // <div class="row">
    //     <button class="btn btn-primary" cross-sell cart="data.cart" commit-queued="data.queue" params="data.params" error="data.error">Commit Selections</button>
    // </div>

    return {
        restrict: 'A',
        scope: {
            cart: '=?',
            add: '=?',
            remove: '=?',
            toggle: '=?',
            commit: '=?',
            commitQueued: '=?',
            queue: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?',
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Clear previous errors
                scope.error = null;

                // Set default value
                scope.queue = scope.queue || [];

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Determine what action to take
                if (attrs.add) {
                    if (!isQueued(scope.add)) {
                        scope.$apply(function () { scope.queue.push(scope.add); });
                    }
                    return;
                }

                if (attrs.remove) {
                    scope.queue = _.reject(scope.queue, function (item) { item.product_id == scope.remove.product_id });
                    for (var i = 0; i < scope.queue.length; i++) {
                        if (scope.queue[i].product_id == scope.remove.product_id) {
                            scope.$apply(function () {
                                scope.queue.splice(i, 1);
                            });
                        }
                    }
                    return;
                }

                if (attrs.toggle) {
                    if (!isQueued(scope.toggle)) {
                        scope.$apply(function () { scope.queue.push(scope.toggle) });
                    } else {
                        for (var i = 0; i < scope.queue.length; i++) {
                            if (scope.queue[i].product_id == scope.toggle.product_id) {
                                scope.$apply(function () {
                                    scope.queue.splice(i, 1);
                                });
                            }
                        }
                    }
                    return;
                }

                if (attrs.commit || attrs.commitQueued) {

                    var cartCopy = angular.copy(scope.cart);
                    if (scope.commit) {
                        cartCopy.items.push({ product_id: scope.commit.product_id, cross_sell_id: scope.commit.cross_sell_id, quantity: scope.commit.quantity || 1 });
                    } else {

                        if (scope.commitQueued.length == 0)
                            return;

                        _.each(scope.commitQueued, function (item) {
                            cartCopy.items.push({ product_id: item.product_id, cross_sell_id: item.cross_sell_id, quantity: item.quantity || 1 });
                        });
                    }

                    CartService.update(cartCopy, scope.params).then(function (cart) {
                        scope.cart = cart;
                        scope.commitQueued = [];
                        if (scope.onSuccess)
                            scope.onSuccess(cart);
                    }, function (error) {
                        scope.error = error;
                        if (scope.onError)
                            scope.onError(error);
                    });
                    return;
                }

                function isQueued(crossSell) {
                    if (_.findWhere(scope.queue, { product_id: crossSell.product_id }) == null) {
                        return false;
                    }
                    return true;
                }

            });

        }
    };
}]);


app.factory('appCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('appCache');
    }]);
app.filter('range', function () {
    return function (input, min, max, pad) {
        
        // Convert string to int
        min = parseInt(min); 
        max = parseInt(max);
        
        function pad(number, length) {
            var r = String(number);
            if (r.length < length) {
                r = utils.repeat(0, length - number.toString().length) + r;
            }
            return r;
        }

        for (var i = min; i <= max; i++)
            if (!pad) {
                input.push(i);
            } else {
                input.push(pad(i, max.toString().length));
            }
        return input;
    };
});
app.service("ApiService", ['$http', '$q', 'SettingsService', 'HelperService', 'StorageService', 'LanguageService', 'gettextCatalog', function ($http, $q, SettingsService, HelperService, StorageService, LanguageService, gettextCatalog) {

    // Return public API.
    return {
        create: create,
        getItem: getItem,
        getList: getList,
        update: update,
        remove: remove,
        getItemPdf: getItemPdf,
    };

    function getTokenExpiration(expiresInSeconds) {

        // The header response tells us when the cookie expires. Note that the expiration date slides, we'll update the token expiration with every API call.
        var expiresInMinutes = 360; // 6 hours, default if for some reason we didn't get a header value.

        if (expiresInSeconds != null && isNaN(expiresInSeconds) == false) {
            expiresInMinutes = expiresInSeconds / 60;
        }

        // Subtract 5 minutes to ensure we'll be less than the server.
        expiresInMinutes = expiresInMinutes - 10;

        return expiresInMinutes;

    }

    function getToken() {

        var deferred = $q.defer();

        var token = StorageService.get("token");

        if (token != null) {
            deferred.resolve(token);
            return deferred.promise;
        }

        // The account_id is only needed in development environments. The hosted environment can call this endpoint without the account_id and it will be determined on the api side from the hostname.
        var settings = SettingsService.get();
        var parameters = {};

        // Pass in the user's language selection.
        parameters.user_locale = LanguageService.getLocale();

        // Pass in the account_id, which is required when asking for a token.
        parameters.account_id = settings.account.account_id;

        // If this is a test app, send a test flag to request a test token.
        if (settings.account.test) {
            parameters.test = true;
        }

        // Prepare the url
        var endpoint = buildUrl("/auths/limited", settings);

        var request = $http({
            ignoreLoadingBar: false,
            method: "post",
            url: endpoint + "?timezone=UTC",
            params: parameters,
            timeout: 15000,
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Get the token
        request.then(function (response) {

            StorageService.set("token", response.data.token, response.headers("X-Token-Expires-In-Seconds"));

            // If you got a new token, delete any cart_id or invoice_id cookie. The new token won't be bound to them and letting them remain will cause a conflict when the new token tries to access a cart_id that it's not associated with.
            StorageService.remove("cart_id");
            StorageService.remove("invoice_id");

            deferred.resolve(response.data.token);
        }, function (error) {

            var msg = gettextCatalog.getString("There was a problem obtaining authorization for this session. Please reload the page to try your request again.");

            // If this is a 403 error and you are in test mode, add a note to the error message about test orders.
            if (settings.account.test && error.data.error.status == 403 && error.data.error.code == "insufficient_permissions") {
                msg = "This app is installed in test mode and can only be run by authorized test users. To run this app, launch it from within your account while in test mode. If you would like to allow unauthenticated users to run apps in test mode, sign into your account, and enable 'Allow Public Test Orders' under Settings> Technical.";
            }

            deferred.reject({ type: "internal_server_error", reference: "6lnOOW1", code: "unspecified_error", message: msg, status: error.status });
        });

        return deferred.promise;
    }

    function create(data, url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            if (data == null) {
                data = undefined;
            }

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            // Timeout is high to handle payment requests that return slowly.
            var request = $http({
                ignoreLoadingBar: quiet,
                method: "post",
                data: angular.toJson(data),
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 65000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItem(url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getList(url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            // Parse the query parameters in the url
            var queryParameters = utils.getQueryParameters(url);

            // Remove any query parameters that are explicitly provided in parameters
            _.each(parameters, function (item, index) {
                if (queryParameters[index] != null) {
                    delete queryParameters[index];
                }
            });

            // Remove the current query string
            if (url.indexOf("?") > 0) {
                url = url.substring(0, url.indexOf("?"));
            }

            // Append the parameters
            url = utils.appendParams(url, queryParameters);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint,
                params: parameters,
                timeout: 25000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            if (data == null) {
                data = undefined;
            }

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "post",
                data: angular.toJson(slim(data)),
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 25000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function remove(url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "delete",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItemPdf(url, parameters, quiet) {

        var deferred = $q.defer();

        // Pass in the user's language selection.
        parameters = parameters || {};
        parameters.user_locale = LanguageService.getLocale();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                responseType: "arraybuffer",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/pdf"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function buildUrl(endpoint, settings) {

        // If the url is fully qualified, just return it.
        if (endpoint.substring(0, 7) == "http://" || endpoint.substring(0, 8) == "https://") {
            return endpoint;
        } else {
            // The api prefix will contain the fully qualified URL if you are running in development mode. The prefix is defined during the app's bootstrap.
            return settings.config.apiPrefix + endpoint;
        }

    }

    function slim(data) {

        // Trim down the size of the payload
        if (data != null && typeof data === 'object') {
            var dataCopy = JSON.parse(JSON.stringify(data));

            if (dataCopy.object == "cart") {
                delete dataCopy.options;
                delete dataCopy.shipping_item;
                delete dataCopy.payments;
                _.each(dataCopy.items, function (item) {
                    delete item.subscription_terms;
                    delete item.url;
                    delete item.date_created;
                    delete item.date_modified;
                    delete item.formatted;
                    delete item.product;
                    delete item.subscription_plan;
                });
                delete dataCopy.customer.url;
                delete dataCopy.customer.payments;
                delete dataCopy.customer.refunds;
                delete dataCopy.customer.orders;
                delete dataCopy.customer.subscriptions;
                delete dataCopy.customer.invoices;
                delete dataCopy.promotion;
            }

            delete dataCopy.date_created;
            delete dataCopy.date_modified;
            delete dataCopy.object;
            delete dataCopy.url;
            delete dataCopy.test;
            delete dataCopy.account_id;
            delete dataCopy.formatted;
        }

        return dataCopy;

    }

    function onApiSuccess(response, defer) {

        // Update the token expiration date
        if (StorageService.get("token")) {
            StorageService.set("token", StorageService.get("token"), response.headers("X-Token-Expires-In-Seconds"));
        }

        return defer.resolve(response);
    }

    function onApiError(response, defer) {

        var error = {};

        if (response.data) {
            if (response.data.error) {
                error = response.data.error;
            }
        }

        var type;
        var reference;
        var code;
        var message;

        if (error) {

            if (error.type) {
                type = error.type;
            }

            if (error.code) {
                code = error.code;
            }

            if (error.reference) {
                reference = error.reference;
            }

            if (error.message) {
                message = error.message;
            }

        }

        // If your error is 401, then the token has died, or a login failure.
        if (response.status == 401) {

            // If the response code is invalid_login or account_locked, then don't get a new token. This is a failed login attempt and not a bad token.
            if (code != "invalid_login" && code != "account_locked") {

                // We'll do a full reset because the token is invalid and that means any associated cart_id is now orphaned.
                HelperService.newSessionRedirect(true, "Performing session reset due to invalid token in the cookie / request.");
            }
        }

        if (response.status == 403) {
            message = "There was a problem establishing your session. Please reload the page to try again.";
        }

        // If you don't have an error.message, then you didn't receive a normalized error message from the server. This should not happen rarely but prevents the application from having to consider edge cases where an unexpected response format is returned.
        if (!message) {

            switch (response.status) {
                case 404:
                    type = "not_found";
                    reference = "4jnJPb7";
                    code = "resource_not_found";
                    message = gettextCatalog.getString("The item you are trying to access could not be found.");
                    break;
                default:
                    type = "internal_server_error";
                    reference = "XEnf9FY";
                    code = "unspecified_error";
                    message = gettextCatalog.getString("An error occured while attempting to process your request. Please try your request again. If the problem persists, please contact support.");
            }

        }

        error.type = type;
        error.reference = reference;
        error.code = code;
        error.message = message;
        error.status = response.status;

        defer.reject(error);

    }

}]);

app.service("CartService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', 'LanguageService', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService, LanguageService) {

    // Return public API.
    return {
        create: create,
        get: get,
        update: update,
        addItem: addItem,
        getItems: getItems,
        pay: pay,
        login: login,
        logout: logout,
        fromParams: fromParams
    };

    function create(data, parameters, quiet, fromParams) {

        // The fromParams parameter indicates if this call is being made with a cart created from URL parameters.
        // This helps determine how invalid promotion codes should be handled.

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // If defined, set the currency
        var currency = StorageService.get("currency");
        if (currency) {
            data.currency = currency;
        }

        var url = "/carts";
        ApiService.create(data, url, parameters, quiet).then(function (response) {
            var cart = response.data;
            // Set a cookie. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // Set the display currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If the error is 400, the error code is "invalid_promotion_code" and the cart was built from URL parameters, replay the request without the promotion code.
            // This allows a user to still create a cart when the URL contains an invalid embedded promotion code, although without a promotion. But it allows the order to continue.
            if (error.code == "invalid_promotion_code" && fromParams) {
                delete data.promotion_code;
                create(data, parameters, quiet, false).then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            } else {
                // Jus reject it
                deferred.reject(error);
            }
        });

        return deferred.promise;

    }

    function get(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        // Set up some stubs in the event of no cart or customer
        var customerStub = { billing_address: {}, shipping_address: {} };
        var cartStub = { items: [], customer: customerStub };

        if (cart_id) {
            var url = "/carts/" + cart_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var cart = response.data;
                // If the customer is null, set a stub
                if (cart.customer == null) {
                    cart.customer = customerStub;
                }

                // If the billing country is null, supply from the ip address
                if (cart.customer.billing_address.country == null) {
                    cart.customer.billing_address.country = cart.customer_ip_country;
                }

                // If the shiping country is null, supply from the ip address
                if (cart.customer.shipping_address.country == null) {
                    cart.customer.shipping_address.country = cart.customer_ip_country;
                }

                // In case it changed, sync the currency
                syncCurrency(cart.currency);

                deferred.resolve(cart);

            }, function (error) {

                // If 404, perform a session reset.
                if (error.status == 404) {
                    HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
                }

                deferred.reject(error);
            });

        } else {
            // Return an empty cart. Build a stub object to make it easy to reference deep items even before a cart is created.
            deferred.resolve(cartStub);
        }

        return deferred.promise;

    }

    function update(data, parameters, quiet, fromParams) {

        // The fromParams parameter indicates if this call is being made with a cart created from URL parameters.
        // This helps determine how invalid promotion codes should be handled.

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        if (cart_id) {

            var url = "/carts/" + cart_id;
            ApiService.update(data, url, parameters, quiet).then(function (response) {

                var cart = response.data;
                // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
                StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

                // In case it changed, sync the currency
                syncCurrency(cart.currency);

                deferred.resolve(cart);

            }, function (error) {

                // If the error is 400, the error code is "invalid_promotion_code" and the cart was built from URL parameters, replay the request without the promotion code.
                // This allows a user to still create a cart when the URL contains an invalid embedded promotion code, although without a promotion. But it allows the order to continue.
                if (error.code == "invalid_promotion_code" && fromParams) {
                    delete data.promotion_code;
                    update(data, parameters, quiet, false).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });
                } else {
                    // If 404, perform a session reset.
                    if (error.status == 404) {
                        HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
                    }

                    // If invalid state, then the cart is already closed, perform a session reset.
                    if (error.code == "invalid_state") {
                        // Delete the cart_id as it can no longer be modified.
                        StorageService.remove("cart_id");
                        HelperService.newSessionRedirect(false, "Performing a cart_id reset due to an invalid cart_id in the cookie / request. (422 - invalid state): " + error.message);
                    }

                    deferred.reject(error);

                }

            });

            return deferred.promise;

        } else {

            // No cart exists. Create a new cart.
            return create(data, parameters, quiet, fromParams);

        }

    }

    function login(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        var url = "/carts/" + cart_id + "/login";
        ApiService.update(data, url, parameters, quiet).then(function (response) {

            var cart = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function logout(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        var url = "/carts/" + cart_id + "/logout";
        ApiService.update(null, url, parameters, quiet).then(function (response) {

            var cart = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function addItem(data, parameters, quiet) {

        var deferred = $q.defer();

        if (data == null) {
            deferred.reject({ type: "bad_request", reference: "vbVcrcF", code: "invalid_input", message: "You must supply an item to add to the cart.", status: 400 });
            return deferred.promise;
        }

        parameters = setDefaultParameters(parameters);

        // Get the cart.
        get(parameters).then(function (cart) {

            // Check if the cart has already been created.
            if (cart.url) {
                // Is the item in the cart?
                var existingItem = _.findWhere(cart.items, data);

                if (existingItem != null) {
                    ApiService.update(data, existingItem.url, parameters, quiet).then(function (response) {

                        var item = response.data;
                        // In case it changed, sync the currency
                        syncCurrency(item.currency);

                        deferred.resolve(item);

                    }, function (error) {
                        deferred.reject(error);
                    });
                } else {
                    // Add it
                    ApiService.create(data, cart.url + "/items", parameters, quiet).then(function (response) {

                        var item = response.data;
                        // In case it changed, sync the currency
                        syncCurrency(item.currency);

                        deferred.resolve(item);

                    }, function (error) {
                        deferred.reject(error);
                    });
                }

            } else {
                // No cart created yet, create a cart with this item and send it.
                cart.items.push(data);
                create(cart, parameters, quiet).then(function (cart) {
                    deferred.resolve(_.findWhere(cart.items, { item_id: data.product_id }));
                }, function (error) {
                    deferred.reject(error);
                });
            }

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItems(parameters, quiet) {

        get(parameters, quiet).then(function (cart) {

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart.items);

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function pay(cart, payment_method, parameters, cartParameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // Define a function to send the payment, which happens after we create or update the cart.
        var sendPayment = function (cart_id, payment_method) {

            // Create the payment url
            var url = "/carts/" + cart.cart_id + "/payments";

            // Run the payment
            PaymentService.create(payment_method, url, parameters, quiet).then(function (payment) {

                // If the payment status is completed or the payment status is pending and the payment method is credit card, delete the cart_id. Attempting to interact with a closed cart (due to a successful payment) will result in errors.
                if (payment.status == "completed" || payment.status == "pending") {
                    StorageService.remove("cart_id");
                }

                deferred.resolve(payment);

            }, function (error) {
                deferred.reject(error);
            });
        };

        var copyObject = function (cart, newCart) {
            for (var property in newCart) {
                if (newCart.hasOwnProperty(property)) {
                    cart[property] = newCart[property];
                }
            }
        }

        // If there currently is no cart, create it. Otherwise, update the existing cart.
        if (!cart || cart.cart_id == null) {
            create(cart, cartParameters, quiet).then(function (data) {
                copyObject(cart, data);
                sendPayment(cart.cart_id, payment_method);
            }, function (error) {
                deferred.reject(error);
            });
        } else {
            update(cart, cartParameters, quiet).then(function (data) {
                copyObject(cart, data);
                sendPayment(cart.cart_id, payment_method);
            }, function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;

    }

    function fromParams(cart, location) {

        // location should be the angular $location object

        var params = location.search();

        // We are looking for the following parameters. This can be exapnded at any time, as needed.
        // product_id:xxxx, promotion_code, currency, name, email.

        // If empty_cart is true, remove the items from the current cart.
        if (utils.stringToBool(params.empty_cart)) {
            cart.items = [];
            location.search("empty_cart", null);
        }

        // Find the product_ids
        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (utils.left(property, 11) == "product_id:") {

                    var item = { product_id: property.substring(11) };
                    if (utils.isValidInteger(params[property]) == false) {
                        item.quantity = 1;
                    } else {
                        item.quantity = params[property];
                    }

                    // Remove the item if it already exists in the cart
                    var existingItem = _.find(cart.items, function (i) { return i.product_id == item.product_id; });
                    if (existingItem != null) {
                        cart.items = _.reject(cart.items, function (i) { return i.product_id == item.product_id; });
                    }

                    // Set the item into the cart
                    cart.items = cart.items || [];
                    cart.items.push(item);
                    location.search(property, null);

                }
            }
        }

        // Append the others
        if (params.promotion_code) {
            cart.promotion_code = params.promotion_code;
            location.search("promotion_code", null);
        }

        if (params.currency) {
            cart.currency = params.currency;
            location.search("currency", null);
        }

        if (params.name) {
            cart.customer.name = params.name;
            location.search("name", null);
        }

        if (params.email) {
            if (utils.isValidEmail(params.email)) {
                cart.customer.email = params.email;
            }
            location.search("email", null);
        }

        if (params.referrer) {
            cart.referrer = params.referrer;
            location.search("referrer", null);
        }

        if (params.affiliate_id) {
            cart.affiliate_id = params.affiliate_id;
            location.search("affiliate_id", null);
        }

        // If there are no customer properties, delete the customer property
        if (_.size(cart.customer) == 0) {
            delete cart.customer;
        }

        if (params.language) {
            LanguageService.setLanguage(params.language);
            location.search("language", null);
        }

        // Append any other parameters as meta
        params = location.search();

        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (cart.meta == null) {
                    cart.meta = {};
                }
                cart.meta[property] = params[property];
            }
        }


        return cart;

    }

    function syncCurrency(newCurrency) {

        // This makes sure that the currency in cart payload responses automatically sync the stored currency value
        var currentCurrency = StorageService.get("currency");

        if (newCurrency != currentCurrency) {

            StorageService.set("currency", newCurrency);

            // Emit the change
            $rootScope.$emit("currencyChanged", newCurrency);
        }
    }

    function setDefaultParameters(parameters, quiet) {

        var parametersCopy = angular.copy(parameters);

        // Cart is a complicated object and a lot of directives interact with it at the same time. As such, we don't allow the show parameter. Too likely toes will get stepped on.
        if (parametersCopy) {
            parametersCopy.formatted = true;
            delete parametersCopy.show;
            return parametersCopy;
        } else {
            return { formatted: true, options: true };
        }

    }

}]);

app.service("InvoiceService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', '$location', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService, $location) {

    // Return public API.
    return {
        get: get,
        update: update,
        pay: pay
    };

    function get(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // Get the invoice ID
        var invoice_id = $location.search().invoice_id;
        if (!invoice_id) {
            invoice_id = StorageService.get("invoice_id");
        }

        var url = "/invoices/" + invoice_id;

        ApiService.getItem(url, parameters, quiet).then(function (response) {

            var invoice = response.data;
            StorageService.set("invoice_id", invoice.invoice_id);

            // In case it changed, sync the currency
            syncCurrency(invoice.currency);

            deferred.resolve(invoice);

        }, function (error) {

            // If 404, perform a redirect to base entry page. Don't perform a hard reset, just delete the invoice ID from storage and redirect. Also remove from the query string, if provided.
            if (error.status == 404) {
                $location.search("invoice_id", null);
                StorageService.remove("invoice_id");
                HelperService.newSessionRedirect(false, "Performing a redirect due to an invalid invoice_id in the cookie / request. (404 - invoice not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var invoice_id = StorageService.get("invoice_id");

        var url = "/invoices/" + invoice_id;
        ApiService.update(data, url, parameters, quiet).then(function (response) {

            var invoice = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("invoice_id", invoice.invoice_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(invoice.currency);

            deferred.resolve(invoice);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid invoice_id in the cookie / request. (404 - invoice not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function pay(invoice, payment_method, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        var sendPayment = function (invoice_id, payment_method) {

            // Create the payment url
            var url = "/invoices/" + invoice.invoice_id + "/payments";

            // Run the payment
            PaymentService.create(payment_method, url, parameters, quiet).then(function (payment) {

                // If the payment is completed or pending, remove the invoice_id from the cookie.
                if (payment.status == "completed" || payment.status == "pending") {
                    StorageService.remove("invoice_id");
                }

                deferred.resolve(payment);

            }, function (error) {
                deferred.reject(error);
            });
        };

        // Send the payment.
        sendPayment(invoice.invoice_id, payment_method);

        return deferred.promise;

    }

    function syncCurrency(newCurrency) {

        // This makes sure that the currency in invoice payload responses automatically sync the stored currency value
        var currentCurrency = StorageService.get("currency");

        if (newCurrency != currentCurrency) {

            StorageService.set("currency", newCurrency);

            // Emit the change
            $rootScope.$emit("currencyChanged", newCurrency);
        }
    }

    function setDefaultParameters(parameters, quiet) {

        var parametersCopy = angular.copy(parameters);

        // Invoice is a complicated object and a lot of directives interact with it at the same time. As such, we don't allow the show parameter. Too likely toes will get stepped on.
        if (parametersCopy) {
            parametersCopy.formatted = true;
            delete parametersCopy.show;
            return parametersCopy;
        } else {
            return { formatted: true, options: true };
        }

    }

}]);

app.service("PaymentService", ['$http', '$q', 'ApiService', 'SettingsService', 'StorageService', 'LanguageService', function ($http, $q, ApiService, SettingsService, StorageService, LanguageService) {

    // Return public API.
    return {
        create: create,
        createDirect: createDirect,
        get: get,
        update: update,
        getOptions: getOptions,
        commit: commit,
        fromParams: fromParams
    };

    function create(payment_method, url, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // Build the payment method object
        var data = { payment_method: payment_method };

        ApiService.create(data, url, parameters, quiet).then(function (response) {
            var payment = response.data;
            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        ApiService.update(data, "/payments/" + data.payment_id, parameters, quiet).then(function (response) {
            var payment = response.data;
            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function createDirect(payment, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var url = "/payments";

        ApiService.create(payment, url, parameters, quiet).then(function (response) {
            var result = response.data;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function get(payment_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (payment_id) {
            var url = "/payments/" + payment_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var payment = response.data;
                deferred.resolve(payment);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "HdPWrih", code: "invalid_input", message: "You request contained invalid data and could not be processed.", status: 400 });
            console.log("Your request for a payment must include a payment_id.");
        }

        return deferred.promise;

    }

    function getOptions(parameters, quiet) {

        var deferred = $q.defer();

        var url = "/payments/options";
        ApiService.getItem(url, parameters, quiet).then(function (response) {
            var options = response.data;
            deferred.resolve(options);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function commit(payment_id, parameters, quiet) {

        // This is used for payment methods such as PayPal and Amazon Pay that need to be tiggered for completion after they have been reviewed by the customer.

        var url = "/payments/" + payment_id + "/commit";

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        ApiService.create(null, url, parameters, quiet).then(function (response) {
            var payment = response.data;

            // If the payment status is completed or pending, delete the cart_id and / or invoice_id. Attempting to interact with a closed cart or invoice (due to a successful payment) will result in errors.
            if (payment.status == "completed" || payment.status == "pending") {
                StorageService.remove("cart_id");
                StorageService.remove("invoice_id");
            }

            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function fromParams(payment, location) {

        // Set payment as an object if null
        payment = payment || {}

        // location should be the angular $location object

        // Make a copy so we can modify without changing the original params
        var params = angular.copy(location.search());

        // This is designed to be used for a "hosted payment page", where the customer makes an arbitrary payment not associated with a cart or invoice. Parameters such as amount, currency, description, reference and customer details can be passed as URL params.

        if (params.currency) {
            payment.currency = params.currency;
            delete params.currency;
            location.search("currency", null);
        }

        if (params.total && utils.isValidNumber(params.total)) {
            payment.total = params.total;
            delete params.total;
            location.search("total", null);
        }

        // If the total is not supplied, look for subtotal, shipping, tax.
        if (!payment.total) {

            if (params.subtotal && utils.isValidNumber(params.subtotal)) {
                payment.subtotal = params.subtotal;
                delete params.subtotal;
                location.search("subtotal", null);
            }

            if (params.shipping && utils.isValidNumber(params.shipping)) {
                payment.shipping = params.shipping;
                delete params.shipping;
                location.search("shipping", null);
            }

            if (params.tax && utils.isValidNumber(params.tax)) {
                payment.tax = params.tax;
                delete params.tax;
                location.search("tax", null);
            }

        }

        if (params.reference) {
            payment.reference = params.reference;
            delete params.reference;
            location.search("reference", null);
        }

        if (params.description) {
            payment.description = params.description;
            delete params.description;
            location.search("description", null);
        }

        payment.customer = payment.customer || {};

        if (params.company_name) {
            payment.customer.company_name = params.company_name;
            delete params.company_name;
        }

        if (params.name) {
            payment.customer.name = params.name;
            delete params.name;
        }

        if (params.email) {
            if (utils.isValidEmail(params.email)) {
                payment.customer.email = params.email;
            }
            delete params.email;
        }

        if (params.referrer) {
            payment.referrer = params.referrer;
            delete params.referrer;
        }

        if (params.language) {
            LanguageService.setLanguage(params.language);
            location.search("language", null);
        }

        // Append any other parameters as meta
        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (payment.meta == null) {
                    payment.meta = {};
                }
                payment.meta[property] = params[property];
            }
        }

        return payment;

    }

    function setDefaultParameters(parameters, quiet) {

        // Make sure the response data and payment method is expanded.
        if (parameters) {

            parameters.formatted = true;

            if (parameters.expand == null) {
                parameters.expand = "response_data,payment_method";
            } else {
                if (parameters.expand.indexOf("response_data") == "-1") {
                    parameters.expand += ",response_data";
                }
                if (parameters.expand.indexOf("payment_method") == "-1") {
                    parameters.expand += ",payment_method";
                }
            }

            return parameters;

        } else {

            return { formatted: true, expand: "response_data,payment_method" };

        }

    }

}]);

app.service("OrderService", ['$http', '$q', 'ApiService', function ($http, $q, ApiService) {

    // Return public API.
    return {
        get: get
    };

    function get(order_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (order_id) {
            var url = "/orders/" + order_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var payment = response.data;
                deferred.resolve(payment);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "HdPWrih", code: "invalid_input", message: "The order you are trying to view cannot be found.", status: 400 });
            console.log("The order_id was not provided.");
        }

        return deferred.promise;

    }

    function setDefaultParameters(parameters, quiet) {

        if (parameters) {
            parameters.formatted = true;
            return parameters;
        } else {
            return { formatted: true };
        }

    }

}]);

app.service("CustomerService", ['$http', '$q', 'ApiService', function ($http, $q, ApiService) {

    // Return public API.
    return {
        createAccount: createAccount,
        login: login
    };

    function createAccount(customer, parameters, quiet) {

        var deferred = $q.defer();

        if (customer.customer_id) {
            var url = "/customers/" + customer.customer_id;

            ApiService.update(customer, url, parameters, quiet).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "8b1oMYs", code: "invalid_input", message: "The request could not be completed.", status: 400 });
            console.log("The customer object in the account creation request did not contain a customer_id.");
        }

        return deferred.promise;

    }

    function login(data, parameters, quiet) {

        var deferred = $q.defer();

        var url = "/customers/login";
        ApiService.create(data, url, parameters, quiet).then(function (response) {

            var customer = response.data;
            deferred.resolve(customer);

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

}]);

app.service("ProductService", ['$http', '$q', 'ApiService', 'CurrencyService', function ($http, $q, ApiService, CurrencyService) {

    // Return public API.
    return {
        get: get,
        getList: getList
    };

    function get(product_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (product_id) {
            var url = "/products/" + product_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var product = response.data;
                // If the currency is not currently set, set it to the value of the returned product.
                if (CurrencyService.getCurrency() == null) {
                    CurrencyService.setCurrency(product.currency);
                }

                deferred.resolve(product);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "IrUQTRv", code: "invalid_input", message: "The product you are trying to view cannot be found.", status: 400 });
            console.log("The product_id was not provided.");
        }

        return deferred.promise;

    }

    function getList(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var url = "/products";

        ApiService.getList(url, parameters, quiet).then(function (response) {
            var products = response.data;
            // If the currency is not currently set, set it to the value of the returned product.
            if (CurrencyService.getCurrency() == null) {
                if (products.data[0]) {
                    CurrencyService.setCurrency(products.data[0].currency);
                }
            }

            deferred.resolve(products);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function setDefaultParameters(parameters, quiet) {

        if (parameters) {
            parameters.formatted = true;
            return parameters;
        } else {
            return { formatted: true };
        }

    }

}]);

app.service("GeoService", [function () {

    // Return public API.
    return {
        getData: getData,
        getStatesProvs: getStatesProvs,
        isEu: isEu,
        getCurrencySymbol: getCurrencySymbol
    };

    function getData() {

        var geo = {};

        geo.countries = [{ name: 'Afghanistan', code: 'AF' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'Andorra', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia, Plurinational State of', code: 'BO' }, { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, the Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote d Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Curacao', code: 'CW' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands', code: 'AX' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guine Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and McDonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao Peoples Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia', code: 'FM' }, { name: 'Moldova', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montenegro', code: 'ME' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'Rwanda', code: 'RW' }, { name: 'Saint Barthélemy', code: 'BL' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Martin French', code: 'MF' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Senegal', code: 'SN' }, { name: 'Serbia', code: 'RS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Sint Maarten Dutch', code: 'SX' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Sudan', code: 'SS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands British', code: 'VG' }, { name: 'Virgin Islands U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }];
        geo.usStates = [{ name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "American Samoa", code: "AS" }, { name: "Arizona", code: "AZ" }, { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" }, { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "District Of Columbia", code: "DC" }, { name: "Federated States Of Micronesia", code: "FM" }, { name: "Florida", code: "FL" }, { name: "Georgia", code: "GA" }, { name: "Guam", code: "GU" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" }, { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" }, { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" }, { name: "Maine", code: "ME" }, { name: "Marshall Islands", code: "MH" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" }, { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" }, { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" }, { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" }, { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" }, { name: "North Dakota", code: "ND" }, { name: "Northern Mariana Islands", code: "MP" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" }, { name: "Oregon", code: "OR" }, { name: "Palau", code: "PW" }, { name: "Pennsylvania", code: "PA" }, { name: "Puerto Rico", code: "PR" }, { name: "Rhode Island", code: "RI" }, { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" }, { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" }, { name: "Virgin Islands", code: "VI" }, { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" }, { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }, { name: "U.S. Armed Forces Americas", code: "AA" }, { name: "U.S. Armed Forces Europe", code: "AE" }, { name: "U.S. Armed Forces Pacific", code: "AP" }];
        geo.caProvinces = [{ code: "AB", name: "Alberta" }, { code: "BC", name: "British Columbia" }, { code: "MB", name: "Manitoba" }, { code: "NB", name: "New Brunswick" }, { code: "NL", name: "Newfoundland" }, { code: "NS", name: "Nova Scotia" }, { code: "NU", name: "Nunavut" }, { code: "NT", name: "Northwest Territories" }, { code: "ON", name: "Ontario" }, { code: "PE", name: "Prince Edward Island" }, { code: "QC", name: "Quebec" }, { code: "SK", name: "Saskatchewen" }, { code: "YT", name: "Yukon" }];

        return geo;
    }

    function getStatesProvs(country) {

        var data = getData();

        if (country == "US") {
            return data.usStates;
        }

        if (country == "CA") {
            return data.caProvinces;
        }

        return null;

    }

    function isEu(country) {

        var euCountries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB"];

        if (euCountries.indexOf(country) > -1) {
            return true;
        }

        return false;

    }

    function getCurrencySymbol(code) {

        var currencies = { "AED": "د.إ", "AFN": "؋", "ALL": "L", "AMD": "֏", "ANG": "ƒ", "AOA": "Kz", "ARS": "$", "AUD": "$", "AWG": "ƒ", "AZN": "ман", "BAM": "KM", "BBD": "$", "BDT": "৳", "BGN": "лв", "BHD": ".د.ب", "BIF": "FBu", "BMD": "$", "BND": "$", "BOB": "$b", "BRL": "R$", "BSD": "$", "BTC": "฿", "BTN": "Nu.", "BWP": "P", "BYR": "p.", "BZD": "BZ$", "CAD": "$", "CDF": "FC", "CHF": "CHF", "CLP": "$", "CNY": "¥", "COP": "$", "CRC": "₡", "CUC": "$", "CUP": "₱", "CVE": "$", "CZK": "Kč", "DJF": "Fdj", "DKK": "kr", "DOP": "RD$", "DZD": "دج", "EEK": "kr", "EGP": "£", "ERN": "Nfk", "ETB": "Br", "ETH": "Ξ", "EUR": "€", "FJD": "$", "FKP": "£", "GBP": "£", "GEL": "₾", "GGP": "£", "GHC": "₵", "GHS": "GH₵", "GIP": "£", "GMD": "D", "GNF": "FG", "GTQ": "Q", "GYD": "$", "HKD": "$", "HNL": "L", "HRK": "kn", "HTG": "G", "HUF": "Ft", "IDR": "Rp", "ILS": "₪", "IMP": "£", "INR": "₹", "IQD": "ع.د", "IRR": "﷼", "ISK": "kr", "JEP": "£", "JMD": "J$", "JOD": "JD", "JPY": "¥", "KES": "KSh", "KGS": "лв", "KHR": "៛", "KMF": "CF", "KPW": "₩", "KRW": "₩", "KWD": "KD", "KYD": "$", "KZT": "лв", "LAK": "₭", "LBP": "£", "LKR": "₨", "LRD": "$", "LSL": "M", "LTC": "Ł", "LTL": "Lt", "LVL": "Ls", "LYD": "LD", "MAD": "MAD", "MDL": "lei", "MGA": "Ar", "MKD": "ден", "MMK": "K", "MNT": "₮", "MOP": "MOP$", "MRO": "UM", "MUR": "₨", "MVR": "Rf", "MWK": "MK", "MXN": "$", "MYR": "RM", "MZN": "MT", "NAD": "$", "NGN": "₦", "NIO": "C$", "NOK": "kr", "NPR": "₨", "NZD": "$", "OMR": "﷼", "PAB": "B/.", "PEN": "S/.", "PGK": "K", "PHP": "₱", "PKR": "₨", "PLN": "zł", "PYG": "Gs", "QAR": "﷼", "RMB": "￥", "RON": "lei", "RSD": "Дин.", "RUB": "₽", "RWF": "R₣", "SAR": "﷼", "SBD": "$", "SCR": "₨", "SDG": "ج.س.", "SEK": "kr", "SGD": "$", "SHP": "£", "SLL": "Le", "SOS": "S", "SRD": "$", "SSP": "£", "STD": "Db", "SVC": "$", "SYP": "£", "SZL": "E", "THB": "฿", "TJS": "SM", "TMT": "T", "TND": "د.ت", "TOP": "T$", "TRL": "₤", "TRY": "₺", "TTD": "TT$", "TVD": "$", "TWD": "NT$", "TZS": "TSh", "UAH": "₴", "UGX": "USh", "USD": "$", "UYU": "$U", "UZS": "лв", "VEF": "Bs", "VND": "₫", "VUV": "VT", "WST": "WS$", "XAF": "FCFA", "XBT": "Ƀ", "XCD": "$", "XOF": "CFA", "XPF": "₣", "YER": "﷼", "ZAR": "R", "ZWD": "Z$" }

        return currencies[code] || "";
    }

}]);

app.service("CurrencyService", ['$q', '$rootScope', 'SettingsService', 'CartService', 'InvoiceService', 'StorageService', 'ApiService', function ($q, $rootScope, SettingsService, CartService, InvoiceService, StorageService, ApiService) {

    // Return public API.
    return {
        getCurrency: getCurrency,
        getCurrencyName: getCurrencyName,
        setCurrency: setCurrency
    };

    function getCurrency() {
        return StorageService.get("currency");
    }

    function getCurrencyName() {

        var code = getCurrency();
        var settings = SettingsService.get();

        var name = null;
        _.each(settings.account.currencies, function (item) {
            if (item.code == code) {
                name = item.name;
            }
        });

        return name;

    }

    function setCurrency(newValue) {

        // Store in a cookie to persist page refreshes
        StorageService.set("currency", newValue);

        // Emit the change
        $rootScope.$emit("currencyChanged", newValue);

    }

}]);

app.service("LanguageService", ['$q', '$rootScope', 'SettingsService', 'StorageService', 'gettextCatalog', function ($q, $rootScope, SettingsService, StorageService, gettextCatalog) {

    // Angular gettext https://angular-gettext.rocketeer.be/ Used to provide application translations. Translation files are located in the languages folder.

    // Return public API.
    return {
        getSelectedLanguage: getSelectedLanguage,
        getLanguages: getLanguages,
        setLanguage: setLanguage,
        establishLanguage: establishLanguage,
        getLocale: getLocale
    };

    function getLanguages() {

        // The supported languages are defined in rootScope. This allows the setting to be changed by apps that use kit don't want to modify kit's source.
        if ($rootScope.languages) {
            return $rootScope.languages;
        } else {
            // Return the default language
            return [{ code: "en", name: "English" }];
        }

    }

    function getSelectedLanguage() {

        var languages = getLanguages();
        var language = StorageService.get("language");

        // Only return if the value is valid.
        language = _.findWhere(languages, { code: language });
        if (language) {
            return language;
        }

        // Return empty.
        return { name: null, code: null };

    }

    function isSupportedLanguage(language) {

        var languages = getLanguages();
        return !(_.findWhere(languages, { code: language }) == null);

    }

    function setLanguage(language, languagesPath) {

        // Only attempt to set the language if the supplied value is valid.
        if (isSupportedLanguage(language) == false) {
            return;
        }

        StorageService.set("language", language);

        var languages = getLanguages();
        $rootScope.language = _.find(languages, function (l) { return l.code == language });

        gettextCatalog.setCurrentLanguage(language);

        // Emit the change
        $rootScope.$emit("languageChanged", language);

        // English does not need to be loaded since it's embedded in the HTML.
        if (language != "en") {
            // Load the language configuration file.
            gettextCatalog.loadRemote((languagesPath || "languages/") + language + "/" + language + ".json");
        }

    }

    function establishLanguage(languagesPath) {

        // If a language has already been selected, use it.
        var selectedLanguage = getSelectedLanguage();
        if (selectedLanguage.code && isSupportedLanguage(selectedLanguage.code)) {
            setLanguage(selectedLanguage.code, languagesPath);
            return;
        }

        var locale = null, language = null;
        if (SettingsService.get().account.browser_info) {

            // Check for an exact match on the locale, such as fr-CA.
            locale = SettingsService.get().account.browser_info.locale;
            if (isSupportedLanguage(locale)) {
                setLanguage(locale, languagesPath);
                return;
            }

            // Check for an exact match on the langauge, such as fr.
            language = SettingsService.get().account.browser_info.language;
            if (isSupportedLanguage(language)) {
                setLanguage(language, languagesPath);
                return;
            }

            // Check for a language that starts with the same language as the user language
            // This is helpful in cases where the user's language is zh and we don't have zh but we do have zh-CN.
            var result = _.find(getLanguages(), function (i) { return i.code.substring(0, 2) == language });
            if (result) {
                setLanguage(result.code, languagesPath);
                return;
            }

        }

    }

    function getLocale() {

        // If the language portion of the user's locale (for example: fr-ca, es-MX) is the same as the selected app language (for example: fr, es), use the full locale.
        // Otherwise, if there is a mismatch between the language portion of the user's locale and the selected app language (for example: en-US, es), use the language code as the locale.

        // The locale determines things such as number formatting, so if it important to send in the full locale, if possible. Otherwise the user will end up with default number formatting for the language, rather than for the specific locale.
        // However, if the selected app language conflicts with the user locale, you can't send it or the API response text will be returned in the locale's language.

        var locale = null;
        if (SettingsService.get().account.browser_info) {
            locale = SettingsService.get().account.browser_info.locale;
        }

        var language = getSelectedLanguage().code;

        if (locale && locale.length >= 2 && language && language.length >= 2) {
            if (locale.substring(0, 2).toLowerCase() == language.substring(0, 2).toLowerCase()) {
                return locale;
            }
        }

        return language;

    }

}]);

app.service("SettingsService", [function ($http, $q) {

    // Return public API.
    return {
        get: get
    };

    function get() {

        // The embedded settings/app.js and settings/account.js set the values within the __settings global variable.

        // Get account settings
        var getAccountSettings = function () {

            var accountSettings = {};

            if (window.__settings) {
                if (window.__settings.account) {
                    accountSettings = window.__settings.account;
                }
            }

            // If accountSettings doesn't have the property "date_utc", inject the current client-side date.
            // The purpose is to provide the current server date to the app when running in the hosted environment. It is not designed to give precise time (because the settings file may be cached for minutes) 
            // Therefore, it always returns a date with the time at midnight, but will provide a reliable date "seed" in the application for things like credit card expiration date lists and copyright dates. Useful when you don't want to rely on a client-side clock.
            if (!accountSettings.date_utc) {
                // No value provided in the settings file, which is likely in development environments. Inject the client-side date so the app doesn't have to consider null values.
                accountSettings.date_utc = utils.getCurrentIsoDate(true);
            }

            // Split the date into parts for easy access
            var date = new Date(accountSettings.date_utc);
            accountSettings.year = date.getFullYear();
            accountSettings.month = date.getMonth();
            accountSettings.date = date.getDate();

            return accountSettings;
        };

        // Get app settings
        var getAppSettings = function () {

            var appSettings = {};

            if (window.__settings) {
                if (window.__settings.app) {
                    appSettings = window.__settings.app;
                }
            }

            return appSettings;
        };

        // Get style settings
        var getStyleSettings = function () {

            var styleSettings = {};

            if (window.__settings) {
                if (window.__settings.style) {
                    styleSettings = window.__settings.style;
                }
            }

            return styleSettings;
        };

        // Build and return the settings object
        var settings = { account: getAccountSettings(), app: getAppSettings(), style: getStyleSettings(), config: {} };

        // Define the api prefix
        settings.config.apiPrefix = "/api/v1";

        settings.config.development = false;

        // For convenience, if you place a development flag in either one of the settings stubs (during local development), the app will be marked as running in development mode.
        if (settings.account.development || settings.app.development || settings.style.development) {

            settings.config.development = true;

            var apiHost = settings.account.api_host || settings.app.api_host || settings.style.api_host || "api.comecero.com";
            apiHost = "https://" + apiHost;

            // Make the apiPrefix a fully qualified url since requests in development mode don't have access to the reverse proxy.
            settings.config.apiPrefix = apiHost + settings.config.apiPrefix;
        }

        return settings;

    }

}]);

app.service("HelperService", ['SettingsService', 'StorageService', '$location', function (SettingsService, StorageService, $location) {

    // Return public API.
    return {
        isRequiredCustomerField: isRequiredCustomerField,
        isOptionalCustomerField: isOptionalCustomerField,
        isCustomerField: isCustomerField,
        hasRequiredFields: hasRequiredFields,
        hasShippingAddress: hasShippingAddress,
        newSessionRedirect: newSessionRedirect,
        getShoppingUrl: getShoppingUrl,
        hasSubscription: hasSubscription,
        hasPhysical: hasPhysical,
        supportsPaymentMethod: supportsPaymentMethod
    };

    function isRequiredCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        // If shippingIsBilling == false and the field is a shipping address, swap shipping_address in the field name with billing_address before you compare.
        var isShippingField = false;
        if (field.substring(0, 17) == "shipping_address.") {
            field = "billing_address." + field.substring(17);
            isShippingField = true;
        }

        if (field == "billing_address.name") {
            field = "name";
        }

        if (shippingIsBilling === true) {
            return false;
        }

        if (!options.customer_required_fields) {
            return false;
        }

        if (options.customer_required_fields.indexOf(field) >= 0) {
            return true;
        }

        return false;

    }

    function isOptionalCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        // If shippingIsBilling == false and the field is a shipping address, swap shipping_address in the field name with billing_address before you compare.
        var isShippingField = false;
        if (field.substring(0, 17) == "shipping_address.") {
            field = "billing_address." + field.substring(17);
            isShippingField = true;
        }
        if (field == "billing_address.name") {
            field = "name";
        }

        if (shippingIsBilling === true) {
            return false;
        }

        if (!options.customer_optional_fields) {
            return false;
        }

        if (options.customer_optional_fields.indexOf(field) >= 0) {
            return true;
        }

        return false;

    }

    function isCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        if (options.customer_required_fields) {
            if (isRequiredCustomerField(field, options, shippingIsBilling)) {
                return true;
            }
        }

        if (options.customer_optional_fields) {
            if (isOptionalCustomerField(field, options, shippingIsBilling)) {
                return true;
            }
        }

        return false;

    }

    function hasRequiredFields(customer, options) {

        for (i = 0; i < options.customer_required_fields.length; i++) {
            if (options.customer_required_fields[i].substring(0, 16) == "billing_address.") {
                if (!customer.billing_address[options.customer_required_fields[i].substring(16)]) {
                    return false;
                }
            } else {
                if (!customer[options.customer_required_fields[i]]) {
                    return false;
                }
            }
        }

        return true;

    }

    function hasShippingAddress(customer) {

        if (customer) {
            if (customer.shipping_address) {
                if (customer.shipping_address.address_1) {
                    return true;
                }
            }
        }

        return false;

    }

    function newSessionRedirect(reset, debug) {

        // This redirects the user to the base location of a new session, which may be an external URL.
        // If reset == true, then it flushes the cart_id and token before performing the redirect.

        // In the case of a bad token, invalid cart id or other unfortunate situation, this resets the user's session and redirects them to the desired URL.

        console.log(debug);

        if (reset === true) {
            StorageService.remove("cart_id");
            StorageService.remove("invoice_id");
            StorageService.remove("token");
        }

        var settings = SettingsService.get().app;

        if (settings.main_shopping_url) {

            // If a main shopping URL has been provided, redirect to it.
            window.location.replace(settings.main_shopping_url);

        } else {

            // Otherwise, redirect to the app root. If the destination is the same page they're on, the location.replace won't do anything. Reload the current page in that case.
            if ($location.path() != "/") {
                $location.path("/");
                $location.replace();
            } else {
                window.location.reload();
            }

        }
    }

    function getShoppingUrl() {

        var settings = SettingsService.get().app;

        if (settings.main_shopping_url == null) {
            return window.location.href.substring(0, window.location.href.indexOf("#")) + "#/";
        } else {
            return settings.main_shopping_url;
        }

    }

    function hasSubscription(items) {

        if (_.find(items, function (item) { return item.subscription_plan != null; }) != null) {
            return true;
        }

        return false;

    }

    function hasPhysical(items) {

        if (_.find(items, function (item) { return item.type == "physical"; }) != null) {
            return true;
        }

        return false;

    }

    function supportsPaymentMethod(type, options) {

        if (!type || !options) {
            return false;
        }

        if (_.find(options.payment_methods, function (item) { return item.payment_method_type == type; }) != null) {
            return true;
        }

        return false;

    }

}]);

app.service("StorageService", ['appCache', function (appCache) {

    // Return public API.
    return {
        get: get,
        set: set,
        remove: remove
    };

    function get(key) {

        var value = appCache.get(key);

        if (value == null) {
            // Look to to cookie for a backup
            value = utils.getCookie(key);
        }

        return value;

    }

    function set(key, value, expiresInSeconds) {

        appCache.put(key, value);

        // If expiresInSeconds is not defined, we'll use 14 days as the default
        if (expiresInSeconds == null) {
            expiresInSeconds = 1209600;
        }

        // Backup to a cookie
        utils.setCookie(key, value, expiresInSeconds / 60);

    }

    function remove(key) {

        appCache.remove(key);

        // Remove the associated cookie
        utils.deleteCookie(key);

    }

}]);
//# sourceMappingURL=kit.js.map
