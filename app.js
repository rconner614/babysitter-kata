(function(){
    'use strict';
    var app = angular.module('myApp', []);
    app.controller('mainCtrl', mainCtrl);
    mainCtrl.$inject = ['$scope'];
    function mainCtrl($scope){
        //init variables
        $scope.manual = {
            start: null
        };
        $scope.tests = [
            {
                startTime: new Date(2018, 2, 25, 12, 0),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 20, 45),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 16, 68),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 0, 43),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 22, 15),
                expected: true
            }
        ];

        //first rule - babysitter cannot start before 5pm
        $scope.testRule = function(input){
            return input && input.getHours() >= 17;
            //question: would a start time ever be after midnight? start times after or equal to midnight are currently invalid.
        };
    }
}());