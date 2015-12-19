$(document).ready(function () {
    var DEFAULT_BITBUCKET_API_URL = 'https://bitbucket.org/!api/2.0';
    // Make sure to not exceed the valid value - e.g. 100 is too much
    var DEFAULT_MAX_PULL_REQUESTS_COUNT = 50;

    function loadOptions() {

        // set default values if custom are not specified

        if (!localStorage['bitbucket-api-url']) {
            localStorage['bitbucket-api-url'] = DEFAULT_BITBUCKET_API_URL;
        }

        var bitbucketApiUrlField = $("#bitbucket-api-url");
        bitbucketApiUrlField.attr('value', localStorage['bitbucket-api-url']);

        if (!localStorage['max-pull-requests-count']) {
            localStorage['max-pull-requests-count'] = DEFAULT_MAX_PULL_REQUESTS_COUNT;
        }

        var maxPullRequestsCountField = $("#max-pull-requests-count");
        maxPullRequestsCountField.attr('value', localStorage['max-pull-requests-count']);
    }

    function saveOptions(bitbucketApiUrl, maxPullRequestsCount) {
        localStorage['bitbucket-api-url'] = bitbucketApiUrl;
        localStorage['max-pull-requests-count'] = maxPullRequestsCount;
    }

    function getApiUrl() {
        return $.trim($("#bitbucket-api-url").val());
    }

    function getMaxPullRequestsCount() {
        return $("#max-pull-requests-count").val();
    }

    var flash = $('.flash');
    flash.hide();
    loadOptions();
    $("form#options").submit(function () {
        if (getApiUrl() && getMaxPullRequestsCount() > 0) {
            saveOptions(getApiUrl(), getMaxPullRequestsCount());
            flash.html('<i>Settings saved.</i>');
            flash.show();
        } else {
            flash.html("<strong>Invalid settings!</strong>")
        }

        return false;
    });
});
