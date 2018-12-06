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
    // onSubmit: A function that will be called from scope when a payment is submitted.
    // onSuccess: A function that will be called from scope when the payment is successfully completed. Will include the response payment object as a parameter.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.

    // Shared scope that are specific to different payment methods:

    // Credit Card
    // shippingIsBilling: A flag to indicate if the billing address and shipping address are the same. If so, the shipping address will be removed.

    // Amazon Pay
    // getConsentStatus: Pass in a function that allows you get the status of the Amazon Pay consent checkbox. This function you pass in is provided by the amazonPayButton directive.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            paymentMethod: '=submitPayment',
            cart: '=?',
            invoice: '=?',
            payment: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?',
            shippingIsBilling: '=?',
            getConsentStatus: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Validation functions. 
                function validateFormData() {

                    var error = null;

                    if (ctrl.$invalid == true) {
                        error = { type: "bad_request", reference: "kI1ETNz", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    }

                    return error;

                }

                function validateAmountIsProvided() {

                    var error = null;

                    if (!scope.payment.total && !scope.payment.subtotal && !scope.payment.shipping) {
                        error = { type: "bad_request", reference: "eiptRbg", code: "invalid_input", message: gettextCatalog.getString("Please provide an amount for your payment."), status: 400 };
                    }

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
                            });
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
                            });
                            return;
                        }

                        break;

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

                    CartService.pay(scope.cart, scope.paymentMethod, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // If the cart is expanded, update the cart.
                        if (payment.cart && payment.cart.url) {
                            scope.cart = payment.cart;
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

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // quiet: true / false to indicate if the loading bar should be displayed while calling the API. Default is false.

    return {
        restrict: 'A',
        scope: {
            cart: '=customerBackgroundSave',
            shippingIsBilling: '=?',
            params: '=?',
            error: '=?'
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
                        cartCopy.items.push({ product_id: scope.commit.product_id, cross_sell_id: scope.commit.cross_sell_id });
                    } else {

                        if (scope.commitQueued.length == 0)
                            return;

                        _.each(scope.commitQueued, function (item) {
                            cartCopy.items.push({ product_id: item.product_id, cross_sell_id: item.cross_sell_id });
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

