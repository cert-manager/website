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
    var form = document.querySelector('.mauticform_wrapper form');
    var message = document.querySelector('.mauticform-message');
    form.addEventListener('reset', function() {
        message.scrollIntoView({ behavior: 'smooth' });
    });
}

$(function () {
    // Add event listener to the form so we can handle when Mautic clears the values on success.
    initHandleMauticFormReset();
});
  