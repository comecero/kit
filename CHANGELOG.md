<a name="1.0.13"></a>
# 1.0.13

- Add "on complete" callback for Amazon Pay logout
- Update settings samples
- Bug fix javascript references on index page

<a name="1.0.12"></a>
# 1.0.12

- Add support for cross-sells in the shopping cart
- Updated translations

<a name="1.0.11"></a>
# 1.0.11

- Expose user style selections through SettingsService so they can be passed into consuming apps.
- Add directive to support form entry labels as placeholders, including the option to hide them, based on user input settings.
- Update angular-loading-bar to latest version, expose CSS to allow user override of default colors.
- Translation updates

<a name="1.0.10"></a>
# 1.0.10

- Update a cart or invoice to the latest version when a payment is made using a submit-payment directive

<a name="1.0.9"></a>
# 1.0.9

- Send the user's app language selection with API calls so that API response messages match the selected app language.
- Add support for the following language: Chinese

<a name="1.0.8"></a>
# 1.0.8

- Allow a language parameter to be added to the URL to override the default language selection

<a name="1.0.7"></a>
# 1.0.7

- Add support for the following languages: Czech, German, Greek, Spanish, Finnish, French, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Swedish
- Add support for Amazon Pay

<a name="1.0.6"></a>
# 1.0.6

- Bug fix to clear invoice_id when completing an invoice payment
- Bug fix when signing into an existing cart or invoice, properly set the payment method object
- Bug fix getting browser locale and language when creating a new API token on app load

<a name="1.0.5"></a>
# 1.0.5

- Add support for direct customer payments (a payment without a cart or invoice)
- Minor bug fixes and refactoring

<a name="1.0.4"></a>
# 1.0.4

- Update analytics to load by JavaScript rather than HTML tag
- Update to latest version of Angular UI Bootstrap

<a name="1.0.3"></a>
# 1.0.3

- Allow option for manually triggering pageview and conversions.
- Update to latest version of AngularJS Bootstrap UI.
- Add support to set path for language and image files in directives.
- Added support to download PDF files returned from the API.
- Handle API changes to support PayPal recurring payments.

<a name="1.0.2"></a>
# 1.0.2

- Bug fix: Prevent the API from receiving the shipping address in the cart checkout page if indicated that the billing address is the shipping address.

<a name="1.0.1"></a>
# 1.0.1

- Applied a fix to the currency drop down. When loading the cart page directly with a new session (no existing cart), the currency was not properly displayed in the select menu in the upper right of the order form.

<a name="1.0.0"></a>
# 1.0.0

This is the initial public release of the Comecero Kit application. Kit has been in use in a production environment for quite some time, but this '1.0' release represents the public, open source release of the project, including an MIT license.
