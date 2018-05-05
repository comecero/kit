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
                        callback(null, { access_token: access_token, order_reference_id: null, billing_agreement_id: null });
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
                    callback(null, { access_token: access_token, order_reference_id: order_reference_id, billing_agreement_id: null });
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
                            callback(null, { access_token: access_token, billing_agreement_id: billing_agreement_id });
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

    function reRenderWidgets(seller_id, order_reference_id, billing_agreement_id, wallet_id, onPaymentMethodSelect, design_mode, callback) {

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
            addressWidget.style.display = null;

        if (walletWidget)
            walletWidget.style.display = null;

        if (consentWidget && recurring)
            consentWidget.style.display = null;
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