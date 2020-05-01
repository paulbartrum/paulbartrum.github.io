'use strict';

function log(text) {
    const statusElement = document.getElementById('status');
    statusElement.innerText += text;
    statusElement.appendChild(document.createElement("br"));
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
            log('Service worker successfully registered.');
            return registration;
        })
        .catch(function (err) {
            log('Unable to register service worker.' + err);
        });
}

function askPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
            log('We weren\'t granted permission.');
        }
    });
}

/**
 * urlBase64ToUint8Array
 * 
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribe(serviceWorker) {
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            'BC2u_b8s1ROBt4lN88ZSuCyTs5C_ghCZmcknziO2y6xWWzuMj7VQGcVygQ98XB3TXKE0Z2DJOgzqTTD7-lFqGOg'
        )
    };

    return serviceWorker.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
        log(JSON.stringify(pushSubscription));
    }).catch(function (err) {
        log('Unable to subscribe: ' + err);
    });
}

async function run() {
    await askPermission();
    var serviceWorker = await registerServiceWorker();
    return await subscribe(serviceWorker);
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    run();
}