/*
 * Add request listener for listening message comming from content script to this background worker.
 */
chrome.extension.onRequest.addListener(onRequest);

/*
 * Handles data sent via chrome.extension.sendRequest().
 * @param request Object Data sent in the request.
 * @param sender Object Origin of the request.
 * @param callbackFunction Function The method to call when the request completes - created worker will be passed
 *              as a parameter to this function
 */
function onRequest(request, sender, response) {
    switch (request.action) {
        case 'get_options' :
            response({
                         "bitbucketApiUrl": localStorage['bitbucket-api-url'],
                         "maxPullRequestsCount": localStorage['max-pull-requests-count']
                     });
            break;
    }
}