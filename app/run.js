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