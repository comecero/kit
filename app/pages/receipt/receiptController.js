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