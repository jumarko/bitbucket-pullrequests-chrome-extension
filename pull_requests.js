$(document).ready(function () {
    chrome.extension.sendRequest({ action: 'get_options'}, function (result) {
        loadReviewers(result.bitbucketApiUrl, result.maxPullRequestsCount);
    });

    function loadReviewers(bitbucketApiUrl, maxPullRequestsCount) {

        checkArguments();

        insertReviewersHeaderColumn();

        // TODO: move ajax calls to the background.js ?

        // setup sensible timeout to avoid infinite waiting for data
        $.ajaxSetup({timeout: 10000});

        var bitbucketPullRequestsPageUrl = window.location.href;
        // urlParts looks like: ["https:", "", "bitbucket.org", "organization", "repository", "pull-requests", ""]
        var urlParts = bitbucketPullRequestsPageUrl.split('/');
        var organizationName = urlParts[3];
        var repoName = urlParts[4];

        fetchPullRequests();



        // ------------------ HELPER FUNCTIONS --------------------------

        function checkArguments() {
            if (!bitbucketApiUrl) {
                throw "Bitbucket api url cannot be empty - please, fix this in extension settings."
            }

            if (maxPullRequestsCount < 1) {
                throw "Max count of pull requests must be a positive number - please, fix this in extension settings."
            }
        }

        /**
         * add reviewers column to the pull requests table as the second one, just after the author column and before
         * title column
         */
        function insertReviewersHeaderColumn() {
            var reviewersHeaderColumn = document.createElement('th');
            reviewersHeaderColumn.className = 'user';
            reviewersHeaderColumn.textContent = 'Reviewers';
            var titleHeaderColumn = document.querySelectorAll("th.title")[0];
            titleHeaderColumn.parentNode.insertBefore(reviewersHeaderColumn, titleHeaderColumn);
        }

        function fetchPullRequests() {

            $.ajax({
                       type: "GET",
                       url: bitbucketApiUrl + "/repositories/" + organizationName + "/" + repoName
                            + "/pullrequests?pagelen=" + maxPullRequestsCount,
                       dataType: "json",
                       success: function (responseJson) {

                           responseJson.values.forEach(function (pullRequest) {
                               var pullRequestApiLink = pullRequest.links.self.href

                               fetchPullRequest(pullRequestApiLink, pullRequest);

                           });

                       },
                       error: function (request, status, error) {
                           window.alert('ERROR:\n.' +
                                        '\nCannot load pull requests data.\n Error message: ' + error +
                                        '\nBitbucket pull requests extension error.');
                       }
                   });

            function fetchPullRequest(pullRequestApiLink, pullRequest) {

                $.ajax({
                           type: "GET",
                           url: pullRequestApiLink,
                           dataType: "json",
                           success: function (responseJson) {

                               var reviewersNames = [];
                               responseJson.reviewers.forEach(function (reviewer) {
                                   reviewersNames.push(reviewer.display_name);
                               });

                               pushReviewersToHtmlPage(pullRequest, reviewersNames);

                           },
                           error: function (request, status, error) {
                               window.alert('ERROR:\n.' +
                                            '\nCannot load pull request data.\n Error message: ' + error
                                            +
                                            '\nBitbucket pull requests extension error.');
                           }
                       });

            }

        }

        function pushReviewersToHtmlPage(pullRequest, reviewersNames) {
            var pullRequestItemElement;
            var pullRequestTableRows = document.getElementsByClassName(
                'iterable-item');
            for (var i = 0; i < pullRequestTableRows.length; ++i) {
                var pullRequestRow = pullRequestTableRows[i];
                var pullRequestHref = pullRequestRow.querySelector('a.execute');
                if (pullRequestHref.href.indexOf('/' + pullRequest.id + '/') > -1) {
                    pullRequestItemElement = pullRequestRow;
                }
            }

            var reviewersColumn = document.createElement('td');
            // the same css class as user
            reviewersColumn.className = 'user';
            reviewersColumn.textContent = reviewersNames.join(", ");

            // insert reviewers column as the second one, just after the author
            pullRequestItemElement.insertBefore(reviewersColumn,
                                                pullRequestItemElement.childNodes[2]);
        }

    }
});