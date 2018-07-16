/*
Comecero Kit version: ﻿1.0.9
https://comecero.com
https://github.com/comecero/kit
Copyright Comecero and other contributors. Released under MIT license. See LICENSE for details.
*/

app.controller("CartController", ['$scope', '$location', 'CartService', 'GeoService', 'CurrencyService', 'SettingsService', 'HelperService', '$document', function ($scope, $location, CartService, GeoService, CurrencyService, SettingsService, HelperService, $document) {

    // Define a place to hold your data
    $scope.data = {};

    // Load in some helpers
    $scope.geoService = GeoService;
    $scope.settings = SettingsService.get();
    $scope.helpers = HelperService;

    // Set the cart parameters
    $scope.data.params = {};
    $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods,options";
    $scope.data.params.hide = "items.product.formatted,items.product.prices,items.product.url,items.product.description,items.product.images.link_small,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified";

    // Set default values.
    $scope.data.shipping_is_billing = true; // User can toggle.
    $scope.data.payment_method = {}; // Will be populated from the user's input into the form.

    // Build your payment method models
    $scope.data.card = { "type": "credit_card" };
    $scope.data.paypal = {
        "type": "paypal",
        data: {
            // The following tokens are allowed in the URL: {{payment_id}}, {{order_id}}, {{customer_id}}, {{invoice_id}}. The tokens will be replaced with the actual values upon redirect.
            "success_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/payment/review/{{payment_id}}",
            "cancel_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/cart"
        }
    };

    // Get the current cart
    CartService.get().then(function (cart) {

        // Build up any items from the query string, if provided. This loads in products, quantities and other data (such as customer name, email address) that may have been supplied through the query string. If nothing is provided in the query string, then no values are supplied to the cart.
        cart = CartService.fromParams(cart, $location);

        // Update the cart. There might not be a cart on the server at this point; if not, the CartService.update process will create the new cart for the user.
        CartService.update(cart, $scope.data.params, false, true).then(function (cart) {

            // Set the cart on the scope.
            $scope.data.cart = cart;

            // If there is a shipping address line 1, set shipping_is_billing to false so the user will see what's provided in the shipping address.
            $scope.data.shipping_is_billing = !HelperService.hasShippingAddress(cart.customer);

            // If the customer already has payment methods, set the default payment method onto the payment method object. This will make their default "on file" payment method the selected payment method. The user can change the selection or add a new payment method, as required.
            var data = ((cart.customer || {}).payment_methods || {}).data;
            if (data) {
                if (data.length > 0) {
                    $scope.data.payment_method.payment_method_id = _.find(cart.customer.payment_methods.data, function (payment_method) { return payment_method.is_default == true; }).payment_method_id;
                }
            }

        }, function (error) {
            // Error updating the cart
            $scope.data.error = error;
        });

    }, function (error) {
        // Error getting the cart
        $scope.data.error = error;
    });

    // Handle a successful payment
    $scope.onPaymentSuccess = function (payment) {

        // Handle the payment response, depending on the type.
        switch (payment.payment_method.type) {

            case "paypal":
                // Redirect to PayPal to make the payment.
                window.location = payment.response_data.redirect_url;
                break;

            default:
                // Redirect to the receipt.
                $location.path("/receipt/" + payment.payment_id);
        }

    };

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);

app.controller("PaymentController", ['$scope', '$location', '$routeParams', 'CartService', 'PaymentService', 'SettingsService', 'HelperService', 'GeoService', '$document', function ($scope, $location, $routeParams, CartService, PaymentService, SettingsService, HelperService, GeoService, $document) {

        // Define a place to hold your data
        $scope.data = {};
        $scope.options = {};
        
        // Parse the query parameters
        var query = $location.search();

        // Define the payment_id
        $scope.data.payment_id = $routeParams.id;
        
        // If no payment_id is supplied, redirect back to the cart.
        if (!$scope.data.payment_id) {
            // Redirect back to the cart
            $location.path("/cart");
        }
                
        // Load in some helpers
        $scope.settings = SettingsService.get();
        $scope.helpers = HelperService;
        $scope.geoService = GeoService;
        
        // Set the cart parameters
        $scope.data.params = {};

        // The payment will have a cart or an invoice, we don't know which. Expand both and we'll use whatever one comes back as not null.
        $scope.data.params.expand = "cart.items.product,cart.items.subscription_terms,invoice.items.product,invoice.items.subscription_terms,cart.options,invoice.options";
        $scope.data.params.hide = "cart.items.product.formatted,cart.items.product.prices,cart.items.product.url,cart.items.product.description,cart.items.product.images.link_small,cart.items.product.images.link_medium,cart.items.product.images.link_large,cart.items.product.images.link,cart.items.product.images.filename,cart.items.product.images.formatted,cart.items.product.images.url,cart.items.product.images.date_created,cart.items.product.images.date_modified,invoice.items.product.formatted,invoice.items.product.prices,invoice.items.product.url,invoice.items.product.description,invoice.items.product.images.link_small,invoice.items.product.images.link_medium,invoice.items.product.images.link_large,invoice.items.product.images.link,invoice.items.product.images.filename,invoice.items.product.images.formatted,invoice.items.product.images.url,invoice.items.product.images.date_created,invoice.items.product.images.date_modified";
        
        // Set the cart params for your shipping dropdown directive. They are the same as above, but you have to remove the "cart" and "invoice" prefixes. We'll also have a bunch of duplicates after stripping the prefix, so we'll remove them.
        $scope.data.saleParams = { expand: utils.deDuplicateCsv($scope.data.params.expand.replaceAll("cart.", "").replaceAll("invoice.", "")), hide: utils.deDuplicateCsv($scope.data.params.hide.replaceAll("cart.", "").replaceAll("invoice.", "")) };
        
        PaymentService.get($scope.data.payment_id, $scope.data.params).then(function (payment) {
            
            if (payment.status == "completed") {
                // The payment was previously completed, redirect to receipt.
                $location.path("/receipt/" + payment.payment_id);
            }
            
            $scope.data.sale = payment.cart;
            if ($scope.data.sale == null) {
                // No cart, use the invoice
                $scope.data.sale = payment.invoice;
            }

            // Set flags to indicate if we need to request the company name and phone number fields, which happens when they're required and not already populated.
            if (HelperService.isRequiredCustomerField('company_name', $scope.data.sale.options) && $scope.data.sale.customer.company_name == null) {
                $scope.options.showCompanyName = true;
            }

            if (HelperService.isRequiredCustomerField('phone', $scope.data.sale.options) && $scope.data.sale.customer.phone == null) {
                $scope.options.showPhone = true;
            }

        }, function (error) {
            $scope.data.error = error;
        });
        
        // Handle a successful payment
        $scope.onPaymentSuccess = function (payment) {

            // If the payment comes back as initiated, it means significant changes to the cart have been done that has changed the payment amount significantly enough that the buyer must re-approve the total through PayPal. Redirect.
            if (payment.status == "initiated") {
                
                // Redirect to the supplied redirect URL.
                window.location.replace(payment.response_data.redirect_url);

            } else {
                
                // The payment is completed. Redirect to the receipt.
                $location.path("/receipt/" + payment.payment_id);

            }
        }
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);

app.controller("ProductsController", ['$scope', '$routeParams', '$location', '$document', 'ProductService', 'CartService', 'GeoService', 'CurrencyService', function ($scope, $routeParams, $location, $document, ProductService, CartService, GeoService, CurrencyService) {
        
        // Define a place to hold your data
        $scope.data = {};
        
        // Load the geo service for countries, states, provinces (used for dropdowns).
        $scope.geo = GeoService.getData();
        
        $scope.data.params = {};
        $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods";
        $scope.data.params.show = "product_id,name,price,currency,description,images.*";
        $scope.data.params.currency = CurrencyService.getCurrency();
        $scope.data.params.formatted = true;
        $scope.data.params.limit = 50;
        
        $scope.data.cartParams = {};
        $scope.data.cartParams.show = "cart_id";
        
        // Load the products
        ProductService.getList($scope.data.params).then(function (products) {
            $scope.data.products = products;
        }, function (error) {
            $scope.data.error = error;
        });
        
        $scope.onAddToCart = function (item) {
            $location.path("/cart");
        }
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);
app.controller("ReceiptController", ['$scope', '$routeParams', 'PaymentService', 'SettingsService', function ($scope, $routeParams, PaymentService, SettingsService) {
        
        // Define a place to hold your data
        $scope.data = {};
        var params = {};
        
        // Load in some helpers
        $scope.settings = SettingsService.get();
        
        // Note that when displaying the receipt, we use data from the cart and not the order. The reason is that not every successful payment contains an order.
        // While most successful payments immediately include an order, some payments may be subject to manual review and approval and the order will not be created until the manual review is completed.
        // Because of this, we use the associated cart to display the order summary.
        // If the payment.order contains a value, the order is complete. If payment.order is null, then the order is not yet created.
        // If the order is not yet created, you may want to show a message on the receipt page such as "your order is being processed" rather than "your order is complete" to provide more clear communication to the customer about the status.
        // You will see an example of this at the bottom of the receipt HTML.
        
        // Define your parameters. To reduce the size of the response payload, limit the properties to those you plan to display.
        params.show = "payment_method.*,payment_method.data.*,date_created,cart.order_id,cart.total,cart.tax,cart.currency,cart.customer.name,cart.customer.billing_address.*,cart.items.quantity,cart.items.name,cart.items.subtotal,cart.shipping_item.quantity,cart.shipping_item.name,cart.shipping_item.subtotal,cart.items.product.images.link_square,order";
        params.expand = "payment_method,payment_method.data,cart.items.product";
        params.formatted = true;
        
        // Get the payment.
        PaymentService.get($routeParams.id, params).then(function (payment) {
            $scope.data.payment = payment;

            // Invoke the conversion. If the user reloads the receipt page the conversion code will prevent the conversion from being recorded multiple times.
            if (window.__conversion && window.__conversion.recordConversion) {
                window.__conversion.recordConversion(payment.order.order_id);
            }

        }, function (error) {
            $scope.exception = error;
        });
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);