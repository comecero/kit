﻿var app = angular.module("checkout", ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'gettext', 'duScroll', 'tmh.dynamicLocale']);

app.config(['$httpProvider', '$routeProvider', '$locationProvider', '$provide', 'cfpLoadingBarProvider', 'tmhDynamicLocaleProvider', function ($httpProvider, $routeProvider, $locationProvider, $provide, cfpLoadingBarProvider, tmhDynamicLocaleProvider) {
        
        // Configure the app routes
        $routeProvider.when("/cart", { templateUrl: "app/pages/cart/cart.html", reloadOnSearch: false });
        $routeProvider.when("/payment/review/:id", { templateUrl: "app/pages/payment/review.html" });
        $routeProvider.when("/receipt/:id", { templateUrl: "app/pages/receipt/receipt.html" });
        $routeProvider.when("/", { templateUrl: "app/pages/products/products.html" });
        
        // Loading bar https://github.com/chieffancypants/angular-loading-bar A global loading bar when HTTP requests are being made so you don't have to manually trigger spinners on each ajax call.
        cfpLoadingBarProvider.latencyThreshold = 300;
        cfpLoadingBarProvider.includeSpinner = false;
        
        // Dynamically load locale files
        tmhDynamicLocaleProvider.localeLocationPattern("https://cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.4.8/angular-locale_{{locale}}.js");

    }]);

app.run(['$rootScope', function ($rootScope) {
        
        // There is another app.run function in run.js. This app.run is here for settings that apply to kit's direct implementation and wouldn't necessarily be done the same way by apps that consume kit.js.
        // Only things that are not desirable to port into other apps should be here. Otherise you should use run.js.
        
        // This defines the languages supported by the app. Each supported language must have an associated translation file in the languages folder. It ain't magic.
        $rootScope.languages = [
            {
                code: "en",
                name: "English"
            },
            {
                code: "fr",
                name: "français"
            },
            {
                code: "es",
                name: "Español"
            },
            {
                code: "ru",
                name: "русский"
            }
        ]

    }]);