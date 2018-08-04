"use strict";
/**
 * get json data (AJAX)
 * @param {String} url
 * @param {requestCallback} callback - The callback that handles the response.
 */
export let makeRequest = (url, callback) => {
    // Create new ajax call with the assets function called XMLHttpRequest
    const request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        // This in here is our callback function
        // Check our server responsecode, 200 means ok, success: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        if (this.status === 200)
            callback(JSON.parse(request.responseText));
        else
            console.log('Something is probably wrong with the url');
    });

    request.addEventListener('error', () => {
        console.log('Server error like timeout');
    });

    // initializes a request with an http method
    request.open("GET", url);
    // Sends the request
    request.send();
};
/**
 * This callback is displayed as a global member.
 * @callback requestCallback
 * @param {JSON} responseText
 * @return {Array} responseData
 */
