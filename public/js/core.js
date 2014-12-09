'use strict';

var eventsearch = angular.module('eventsearch', ['infinite-scroll']);

function mainController($scope, $http) {
    $scope.formData = {};
    var busy = false;
    // when submitting the add form, send the text to the node API
    $scope.search = function () {
        $scope.formData.newsearch = 0; // 0 if same search, 1 else
        if ($scope.formData.page === 1) {
            $scope.formData.previousearch = $scope.formData.text;
        }

        if ($scope.formData.text !== $scope.formData.previousearch) { // not a scroll --> new search
            $scope.information = "";
            $scope.scroll = "";
            $scope.formData.newsearch = 1;
            $scope.formData.previousearch = $scope.formData.text;
            $scope.formData.page = 1;
        }
        if (busy) {
            return;
        }

        // busy during the http request
        busy = true;
        $http.post('/events', $scope.formData)
            .success(function (data) {
                $scope.information = "";
                $scope.formData.page++;
                $scope.busy = busy;

                if ($scope.formData.text) {
                    if (data[data.length - 1].isevent === "yes") { // last event of the array is "no" if scroll to load more
                        var substr = data[data.length - 1].title.substring(0, 5);
                        if (substr === "Sorry") { // no events found
                            $scope.events = [];
                            $scope.information = "Sorry, no events matched '" + $scope.formData.text + "'";
                        } else {
                            $scope.events = data;
                        }
                    } else {
                        $scope.scroll = 'Scroll to top <i class="fa fa-arrow-up fa-4x"></i>';
                        $scope.information = "No more events for this search";
                    }
                } else { // empty request
                    $scope.events = [];
                    $scope.information = "Please enter at least a keyword";
                }
                
                // not busy anymore
                busy = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
        
    };

}