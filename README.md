## Overview ##
Kit is an open-source client-side shopping cart framework developed using AngularJS 1.5x. Kit contains common features and functions such as methods for interacting with the Comecero API, authentication, validation, error handling and more. Kit primarily consists of custom AngularJS services and directives that making building custom client-side shopping cart applications faster.

For convenience in development and testing, we have embedded Kit into a set of HTML templates and associated controllers which allow you to see how Kit can be used within your own custom application. 

Note that you are not required to use Kit when building custom client-side shopping cart applications. It is simply provided as a convenience and to decrease the amount of work required to deploy a custom shopping cart application. You are free to build your client-side applications using any technology or framework you’d like. In those cases, you would provide your own functions to handle things that Kit otherwise provides for you (such as API communication, authentication, validation, etc.).

While there may be a learning curve to understand what Kit provides, it is a relatively small and simple app that tries to not be too opinionated on how you should do things. You should be able to be productive building custom apps using Kit with a very modest time investment.

Kit is production-ready and tested. It is the basis for the default shopping cart application provided for all Comecero accounts.

## Quick Start ##
We don’t blame you if you want to get Kit up and running in your local test environment without reading through all the boring details first. Here’s a list of step-by-step instructions that will help you do just that. After you’ve got it running, come back and read more details on Kit and how you can customize it or use it as the basis for a new shopping cart application you would like to build.

1. Decide what local hostname that will be used to run the app in your local environment, such as “kit.your-development-hostname.com”. Maybe you’ll just use localhost, that’s fine. If you are using something other than localhost, you’ll need to add the hostname to your list of approved CORS hosts from within your account. You do not need to perform the following if you are using localhost.
	- Sign In to your account
	- Switch to Test mode (upper right corner)
	- Go to Settings> Technical, under “CORS Allowed Origins” add the fully qualified URL to your app, excluding any path, for example: http://kit.your-development-hostname.com

1. If you have not yet done so, add a product to your account while in Test mode. Navigate to Store> Products, click “Add New” in the upper right. Don’t worry about filling in too much detail, just the minimum required. Make sure the product is active and not hidden.

1. Place Kit's source code into the webserver folder you intend to run the app in.

1. Open the following two files within Kit's source code: settings/app.js, settings.account.js. In each file, change the account_id to the account_id you are using for your development. You can obtain the account_id of the account you are using for testing from within your account. Look under Administration> Account Info or click on the user icon in the upper right of any page.

1. Create a limited test token. You can do this from within your account. Go to Developer> API Tokens, click Add New, select “Limited Token” and select “Test”. Generate the token and save it for use in a moment.

1. Load the app in your browser by navigating to the locally hosted location in your browser (i.e. http://localhost). The app should load, but will be running with a “live” token at this point. This may lead to errors if the account is not yet live or active. We need to replace the live token with the test token we generated in Step 5. Navigate to /settings/set_api_token.html with your browser and use the provided tool to manually set the API token in the cookie. You can also use a browser debugger tool to manually set the cookie.

1. You are now running with a test API token, which means you are running in test mode. Navigate back to the root of the application and reload the page to have the app load the test API token.

1. Add a product to your cart, fill in whatever data you are asked for, and use the following credit card number to place a test order: 444455556666111. Choose any valid expiration date and supply any 3 digit security code. Submit the order. 

1. Sign in to your account, go to Sales> Orders and take a look at your order. Take a peek in your inbox, you should have received an email confirmation as well. Congratulations, you are running Kit locally.

## Local Development vs. Hosted Environment ##
For security, compliance and performance reasons, client-side storefront apps should run within Comecero's hosted environment. With support for custom domain names, redundant systems, constant monitoring and full PCI-compliance, deploying your applications in Comecero's hosted environment makes a lot of sense. And the best part - it's provided to your account free of charge.

However, it is far more convenient to run apps locally during development and testing. It's quite easy to do this, however, a few considerations need to be made to successfully run your app in a local environment.

### API Endpoints ###
Comecero's hosted app environment automatically "reverse-proxies" the API so that the API hostname matches the app hostname. Therefore, apps should communicate with the API using relative URLs (for example, /api/v1/...). This prevents the need for cross-origin requests (CORS), which improves performance by removing the need for "pre-flight" requests for every API call, therefore improving speed and performance. Additionally, some older browsers do not fully support CORS (including IE9) and therefore will not permit cross-origin requests, regardless of client and server configuration.

In local development environments, calls to the API cannot be processed through the reverse proxy that is provided in the hosted environment, and therefore you must use the fully qualified API URL (i.e. https://api.comecero.com/api/v1/...) when making calls to the API. The API server is set up to allow CORS requests, however, before doing so you must add the hostname you are using locally to run the app to your list of CORS-approved origins in your account settings (Settings> General). The hostname you use doesn't have to be valid in the real world, but whatever it is, it must be in your CORS-approved origins list or the API server will not provide the proper response to allow your cross-origin requests.

The good news is that Kit provides a very easy way to run in local development mode: Just set a property of "development" to true in the app or account settings files as described in the Kit Components> settings section later in this document. ***The Kit source code you are working with already has this setting in place by default***.

### Tokens ###
The type of tokens that are used to interact with client-side storefront apps are called limited tokens. These tokens have the ability to read very specific public resources (such as products) and have the ability to create specific resources (such as carts and payments) and then have the ability to read and update resources they create. For more information about limited tokens, [please refer to the documentation](https://docs.comecero.com/basic-concepts/#authentication). 

When a user first loads the app in their browser, there will be no API token set in the user's cookies. The app will detect this and will obtain a live (not test) limited token for the user.

When you deploy an application into Comecero's hosted environment, Comecero provides you with a convenient list of your installed apps and an easy way to launch an app and have a test limited token injected into the app automatically (thus allowing you to run the app in test mode). When running in local development mode, however, this is not possible, so you'll need to set the "token" cookie manually. You can use the tool located at settings/set_api_token.html or a browser debug tool or add-in (such as Cookie Inspector for Chrome, Firebug in Firefox, etc.). The name of the cookie should be "token". Limited tokens expire approximately two weeks after last use, so you should not have to do this often.

To generate the test limited token, you can either use the API, or even easier, just sign in to your account, navigate to Developer> API Tokens, select “Add New”, choose “Limited” and select “Test” and click “Create Limited Token”.

Note that while cookies are used for storage of tokens within apps, the API does not examine, consider or use cookies for authorization. Requests to the API must include the HTTP Authorization header using "Bearer token-goes-here" as the value in order to perform proper authorization.

## Kit Components ##
You don’t need to have a deep understanding of AngularJS to use Kit, however, a basic understanding can be helpful, particularly if you intend to perform deep customization. If your intention is to only modify HTML and CSS, you may be successful without any understanding of AngularJS. Kit tries hard to provide strong separation between the logic and presentation layers, which simplifies presentation-layer changes.

**index.html**
Kit runs as a “single page app” which means that index.html is the only “full” page the user will load as the use the app. Index.html loads the necessary JavaScript, CSS and provides the container (wrapper) for the page contents. It is a great place to supply a global header and footer for the app.

**index.min.html**
This file is not used by the application and is provided for demonstration purposes only. It shows how you can construct the index.html page if you concatenate and compress the kit files together to decrease page load times. See the “gulpfile.js” section for more information about concatenation and compression.

**gulpfile.js**
The kit files can be concatenated and compressed using the supplied gulpfile.js script (also in the app root). You will need to install gulp.js if you would like to use the automated build process, which requires node.js to be installed on your local system. See the gulpfile.js source code for a list of modules that are required to concat and compress the source files.

**app/app.js**
This provides the main app configuration function, which loads the Angular modules used by the app. This also defines the app routes, meaning the pages that load based on the URL in the address bar.

**app/run.js**
This is the app “bootstrap” process. Various settings are configured and processes are run. See the comments in the source code for details about what happens in this file. You can perform custom bootstrapping tasks in this script, as needed.

**app/utilities.js**
This is a set of custom JavaScript utility functions that are used throughout Kit to perform common tasks such as setting and reading cookies, parsing URL elements, modifying strings, validation functions, etc. You can extend this page with your own custom functions or invoke these functions within your own custom code, as needed.

**app/languages**
Kit uses an open-source Angular module to provide translation features. Strings can be marked for translation within the HTML by adding the “translate” attribute to any HTML element, as in the example below:

    <span translate>This is the test</span>

After your HTML is complete and your HTML elements are marked for translation, you can run a simple grunt task to extract all your strings marked for translation and turn them into a .pot file that can be sent to a translator. When the translation is complete, it is simply dropped into the languages folder to be loaded by the app when the user changes languages.

The module is feature rich, including support for things like gender and plurals in a huge number of languages.

Note: While the HTML in the Kit sample contains HTML elements marked for translation and bootstraps the configuration for the translation module in run.js, it does not currently provide a way for the user to supply a language selection or a sample translation file. An updated version of Kit will contain all of these elements very soon.

**app/libraries**
Contains open-source, public libraries used by the app. You can add libraries you intend to use to the application. If you drop additional libraries in this folder, they will be included in the gulp concatenation and compression process, thereby reducing the number of requests required to load your app. See the gulpfile.js section for more information.

**app/modules**
Contains public, open-source modules used by the app. You can add libraries you intend to use in the application. If you drop additional modules in this folder, they will be included in the gulp concatenation and compression process, thereby reducing the number of requests required to load your app. See the gulpfile.js section for more information.

If you add additional modules, remember to invoke them in the angular.module function in app.js to make them available to your application.

**app/pages**
These are the pages within the app that your users interact with. The pages are split into two components: A view (the HTML) and a controller. The controller provides the resources that are necessary to the HTML, and the HTML provides the template that will be presented to the user.

The controllers have been designed to be very lightweight and are typically limited to getting data and setting it on the scope (so that the data is available to the HTML template), which should make them easy to understand.

As a rule, we don’t perform DOM manipulation within the controllers. You certainly can manipulate the DOM from the controllers, but that is generally regarded as a poor practice. Instead, DOM changes should be handled by the HTML and / or custom Angular directives. See shared/directives.js for more information.

The Kit sample includes a simple “product picker” page, cart / checkout page and receipt page. This allows you to see how a typical cart flow is accomplished. You can modify the existing pages and / or add your own. If you add new pages, remember to add the route within the app.js file so Angular will know what to load based on the user’s URL.

The HTML within the Kit sample pages rely heavily on the Bootstrap framework. While not required, we strongly recommend using Bootstrap or another CSS framework in your HTML to ensure a good experience across a wide variety of devices.

**app/shared/directives.js**
Kit has a variety of custom directives that you can see in use in the sample pages that do common things such as displaying error messages, displaying or hiding input fields as required, populating drop down menus, selecting currencies, etc. You can add your own directives to add additional functionality, as needed. You don’t have to be deeply familiar with Angular to make use of the directives that Kit provides. However, you will need some familiarity to build your own custom directives.

**app/shared/factories.js**
Kit makes limited use of custom factories. You can add your own factories here, as needed.

**app/shared/filters.js**
Filters provide the ability to easily manipulate values within HTML. Angular provides a variety of built-in filters (such as formatting of numbers, dates, etc.) and you can add your own custom filters here, as needed. 

**app/shared/services.js**
Services primarily provide wrapper functions to the backend API. It provides a higher-level interface to the REST API, making it easier to interact within from within the application by taking care of things such as supplying the appropriate headers, authentication parameters, appropriate timeout settings, and making sure the application receives consistent error responses, among other things. 

The ApiService does direct communication with the API, but it’s generally better to have your app integrate with one of the other services (such as CartService, PaymentService, etc.). ApiService provides a generic CRUD interface to the API while the other services already know the target URL for your request based on the type of request you are making.

Services also provides a few other convenience items, making it easy to obtain app and account settings, get geography data (used to populate drop down menus), and some helper functions that you can use from directives or controllers.

**css**
Contains stylesheets used within the Kit sample pages.

**dist**
Contains the concatenated and compressed JavaScript files created by gulpfile.js that you can reference from your index.html page to reduce the number of calls required to run your app. See the gulpfile.js section for more information.

Do not manually modify or include any custom files in the dist folder. They will be overwritten when the gulpfile.js process is run.

**images**
Includes images used within the Kit sample pages.

## Account and App Settings ##
Custom apps rely on dynamic data about the account they are operating within that cannot be known until runtime, such as currencies the account supports. Even in cases when you expect that the app will only run within a single account, it is a best practice to obtain these values at runtime vs. hard-coding them. This will ensure that the app provides the appropriate options to the user every time, even if the account settings change over time.

The settings folder is used during local development to provide “mock” data to your app. When you package your app for deployment within the hosted environment, you won’t include the “settings” folder (in fact, if you attempt to upload an app package with a “settings” folder in the root, an error will occur that asks you to remove it). In the hosted environment, the settings folder is injected automatically at runtime and includes the values for the account your app is running within at the time the app launches.

There are two settings files: account and app. Account settings give “global” information about the account, meaning general settings that are independent of any app. App settings are specific to your app and are based on settings you request from the user.

If you would like to see a preview of the account settings, just load one of the URLs below. These endpoint are public and don't required any authentication.

You can obtain the account_id of the account you are testing against from within your account. Look under Administration> Account Info or click on the user icon in the upper right of any page.

For live account settings:

https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/live/account.js
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/live/account.json

For test account settings:

https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/test/account.js
https://api.comecero.com/api/v1/app_installations/public_settings/{account_id}/test/account.json

You’ll note that there are two options to obtain the settings: a JavaScript or JSON file. They both contain the same data, but in different formats. Kit uses the JavaScript versions and stores the values contained in the account settings in the following global variable: 

    window.__settings.account

After the settings are loaded, you can access, for example, the currencies an account supports with the following code:

    window.__settings.account.currencies

### Custom App Settings ###
If you are building a custom app for use within a single account, you may not have any need to collect app settings from the user as preference will be built into the app itself. However, if you are building an app that will be used across multiple accounts, you may want to collect preferences from the user that can be read from the app settings file and used in the app at runtime. For more information on collecting custom settings from app users, visit the documentation.

When developing locally, you should place “stubs” of mock settings in the /settings/app.js file. Kit will read from these local stubs and use the settings when it runs, and the source code includes a sample app.js settings file for your reference. 

When you prepare your code to be uploaded to the Comecero hosted environment, you should exclude the settings folder as it will be injected into your app automatically with the settings at app runtime.

An important note about local development: When Kit runs, it will look in both the app and account settings for the following property: development. If found and set to true, Kit will run in “local mode”, which means Kit will configure to run itself outside of the hosted environment, which means setting the appropriate API URL and configuring itself to perform CORS requests. See the section Local Development vs. Hosted Environment for more information.

When doing local development, if you do not set a property of development to true in either the account or app mock settings files, you will get errors when Kit runs as it will not call the correct API endpoints.

## Publishing to the Hosted Environment ##
After you’ve made changes to the app, you probably want to see how it runs in Comecero's hosted environment. To do so, you just need to create a custom app and install it from within your account.

- Zip the contents of the root of your app. Make sure you exclude the “settings” folder, otherwise you’ll receive an error when you try to create the app.
- Sign in to your account
- Navigate to Developer> Custom Apps, click “Create an App” in the upper right
- Fill in the necessary details, here are some tips:
- Make public? No
- Environment: Client-side
- Type of App: Storefront
- Platform Hosted: Yes
- Version: (whatever you want)
- Allow Source Download: No
- Click “Add an App Package”
- Give any information you want about this app package build, such as a name and version / build.
- Upload the app package you previously zipped.
- Settings Fields, Style Fields: (leave blank)
- Hash Based Navigation: Yes (As a single page app, it uses the hash character in the URL for navigation.)
- Set Active: Yes
- Create the app. It will take a few moments as the app is deployed.
- Upon success, you will be redirected to your list of apps. Find your new app and click Install.
- Upon completion of the installation, go back to your account and navigate to Apps (note, not Developer> Custom Apps, but Apps from the main menu. This is the list of apps that have been installed in your account).
Launch the app to test it.

## A note about jQuery ##
Kit does not use jQuery. Angular supplies a tiny, API-compatible subset of jQuery called “jqlite” that allows Angular to manipulate the DOM in a cross-browser compatible way. As currently built, Kit is able to accomplish all DOM manipulation using jqlite, which saves the need to load jQuery into the application.

If you use or would like to use jQuery within your application, simply add a reference to jQuery in the index.html file. If the full jQuery library is provided, Angular will use it instead of jqlite. This means that jQuery must be called in the index.html page before the Angular library is called.	
