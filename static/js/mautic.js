if (typeof MauticSDKLoaded == 'undefined') {
    var MauticSDKLoaded = true;
    var head            = document.getElementsByTagName('head')[0];
    var script          = document.createElement('script');
    script.type         = 'text/javascript';
    script.src          = 'https://jetstack.mautic.net/mautic/media/js/mautic-form.js';
    script.onload       = function() {
        MauticSDK.onLoad();
    };
    head.appendChild(script);
    var MauticDomain = 'https://jetstack.mautic.net';
    var MauticLang   = {
        'submittingMessage': "Please wait..."
    }
}

function initHandleMauticFormReset() {
    var form = document.querySelector('#mauticform_subscriptionlandingpageform');
    form.addEventListener('reset', function() {
        var inputsThatHadValues = form.querySelectorAll('.subscription-form__input--has-value');
        inputsThatHadValues.forEach(function(input) {
            input.classList.remove('subscription-form__input--has-value');
            input.classList.add('subscription-form__input--success');
        });
    });
}

$(function () {
    // Add event listener to the form so we can handle when Mautic clears the values on success.
    initHandleMauticFormReset();
});
  