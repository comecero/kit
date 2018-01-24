app.service("ApiService", ['$http', '$q', '$location', 'SettingsService', 'HelperService', 'StorageService', '$rootScope', 'gettextCatalog', function ($http, $q, $location, SettingsService, HelperService, StorageService, $rootScope, gettextCatalog) {

    // Return public API.
    return {
        create: create,
        getItem: getItem,
        getList: getList,
        update: update,
        remove: remove,
        getItemPdf: getItemPdf,
        getToken: getToken,
        getTokenExpiration: getTokenExpiration
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
        var parameters = {};
        var settings = SettingsService.get();

        if (settings.account.account_id && settings.config.development == true) {
            parameters = { account_id: settings.account.account_id, browser_info: true };
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
            StorageService.set("locale", response.data.browser_info.locale);
            StorageService.set("language", response.data.browser_info.language);

            // If you got a new token, delete any cart_id or invoice_id cookie. The new token won't be bound to them and letting them remain will cause a conflict when the new token tries to access a cart_id that it's not associated with.
            StorageService.remove("cart_id");
            StorageService.remove("invoice_id");

            deferred.resolve(response.data.token);
        }, function (error) {
            deferred.reject({ type: "internal_server_error", reference: "6lnOOW1", code: "unspecified_error", message: "There was a problem obtaining authorization for this session. Please reload the page to try your request again.", status: error.status });
        });

        return deferred.promise;
    }

    function create(data, url, parameters, quiet) {

        var deferred = $q.defer();

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

app.service("CartService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService) {

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

    function pay(cart, payment_method, parameters, quiet) {

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

        // If there currently is no cart, create it. Otherwise, update the existing cart.
        if (cart.cart_id == null) {
            create(cart, parameters, quiet).then(function (cart) {
                sendPayment(cart.cart_id, payment_method);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            update(cart, parameters, quiet).then(function (cart) {
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

app.service("InvoiceService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService) {

    // Return public API.
    return {
        get: get,
        update: update,
        pay: pay
    };

    function get(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var invoice_id = StorageService.get("invoice_id");

        var url = "/invoices/" + invoice_id;

        ApiService.getItem(url, parameters, quiet).then(function (response) {

            var invoice = response.data;

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

app.service("PaymentService", ['$http', '$q', 'ApiService', 'SettingsService', 'StorageService', function ($http, $q, ApiService, SettingsService, StorageService) {

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
        geo.caProvinces = [{ code: "AB", name: "Alberta" }, { code: "BC", name: "British Columbia" }, { code: "LB", name: "Labrador" }, { code: "MB", name: "Manitoba" }, { code: "NB", name: "New Brunswick" }, { code: "NL", name: "Newfoundland" }, { code: "NS", name: "Nova Scotia" }, { code: "NU", name: "Nunavut" }, { code: "NW", name: "Northwest Territories" }, { code: "ON", name: "Ontario" }, { code: "PE", name: "Prince Edward Island" }, { code: "QC", name: "Quebec" }, { code: "SK", name: "Saskatchewen" }, { code: "YT", name: "Yukon" }];

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

app.service("LanguageService", ['$q', '$rootScope', 'SettingsService', 'StorageService', 'gettextCatalog', 'ApiService', function ($q, $rootScope, SettingsService, StorageService, gettextCatalog, ApiService) {

    // Angular gettext https://angular-gettext.rocketeer.be/ Used to provide application translations. Translation files are located in the languages folder.

    // Return public API.
    return {
        getSelectedLanguage: getSelectedLanguage,
        getLanguages: getLanguages,
        setLanguage: setLanguage,
        establishLanguage: establishLanguage
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

        if (language != null) {
            StorageService.set("language", language);
            gettextCatalog.setCurrentLanguage(language);

            // Emit the change
            $rootScope.$emit("languageChanged", language);

            // English does not need to be loaded since it's embedded in the HTML.
            if (language != "en") {
                // Load the language configuration file.
                gettextCatalog.loadRemote((languagesPath || "languages/") + language + "/" + language + ".json");
            }
        }

    }

    function getUserLanguage() {

        var deferred = $q.defer();

        // Check if languages are provided. If not, just return english and don't bother fetching the user's language from the server.
        if (!$rootScope.languages) {
            deferred.resolve("en");
            return deferred.promise;
        }

        // If a language is already set and it's valid, just return that language.
        var language = getSelectedLanguage();

        if (language.code) {

            // We already have a language set, return it.
            deferred.resolve(language.code);

        } else {

            // Determine the user's language from the server, which is the most reliable way to get browser language settings into JavaScript.
            var settings = SettingsService.get();
            ApiService.getItem("/browser_info", null, true).then(function (response) {

                // The value returned in language will either be a valid two-character language code or null.
                deferred.resolve(response.data.language);

            }, function (error) {
                // We always resolve the promise, just with null in the case of error.
                deferred.resolve(null);
            });

        }

        return deferred.promise;

    }

    function establishLanguage(languagesPath) {

        // This called when the app is intially bootstrapped and sets the language according to the user's preference, auto-detected language or default language.
        getUserLanguage().then(function (language) {

            // If null, set the default
            if (language == null) {
                language = "en";
            }

            // Set the language
            setLanguage(language, languagesPath);

        });

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

        // Build and return the settings object
        var settings = { account: getAccountSettings(), app: getAppSettings(), config: {} };

        // Define the api prefix
        settings.config.apiPrefix = "/api/v1";

        settings.config.development = false;

        // For convenience, if you place a development flag in either one of the settings stubs (during local development), the app will be marked as running in development mode.
        if (settings.account.development || settings.app.development) {

            settings.config.development = true;

            // Make the apiPrefix a fully qualified url since requests in development mode don't have access to the reverse proxy.
            settings.config.apiPrefix = "https://api.comecero.com" + settings.config.apiPrefix;
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