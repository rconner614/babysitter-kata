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
                startTime: new Date(2018, 2, 25, 18, 0),
                endTime: new Date(2018, 2, 25, 17, 0),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 17, 0),
                endTime: new Date(2018, 2, 25, 20, 0),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 19, 0),
                endTime: new Date(2018, 2, 25, 2, 0),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 2, 0),
                endTime: new Date(2018, 2, 25, 20, 0),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 16, 0),
                endTime: new Date(2018, 2, 25, 3, 0),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 0, 0),
                endTime: new Date(2018, 2, 25, 5, 0),
                expected: false
            },
            {
                startTime: new Date(2018, 2, 25, 0, 0),
                endTime: new Date(2018, 2, 25, 4, 0),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 4, 0),
                endTime: new Date(2018, 2, 25, 4, 0),
                expected: true
            },
            {
                startTime: new Date(2018, 2, 25, 4, 0),
                endTime: new Date(2018, 2, 25, 2, 0),
                expected: false
            }
        ];

        //first rule - babysitter cannot start before 5pm
        //Question: Would a start time ever be after midnight? Start times after or equal to midnight are currently invalid.

        //second rule - babysitter leaves no later than 4am
        //Question: If a babysitter shows up and leaves at the same time (if a job were cancelled, for example) is the end time valid? Currently all end times between 5pm - 4am are valid.
        //Question: Since end time cannot be beyond 4am, can start time be up until 4am? If someone needed an emergency baby sitter, start times might be later? I've changed the start time to allow all the way up to 4am.

        function afterFivePM(input){
            return input && input.getHours() >= 17;
        }

        function beforeFourAM(input){
            return input && input.getHours() <= 4;
        }

        function validTime(input){
            return input && (afterFivePM(input) || beforeFourAM(input));
        }

        function validEnd(start, end){
            if(start && end){
                if((afterFivePM(end) && afterFivePM(start)) || (beforeFourAM(end) && beforeFourAM(start))){
                    return end.getHours() >= start.getHours();
                } else {
                    return afterFivePM(start) && beforeFourAM(end);
                }
            }
            //If start must be later than 5pm, end must be either the same or later than start. End can't be earlier than start.
        }

        $scope.testRule = function(start, end){
            return start && end && validTime(start) && validTime(end) && validEnd(start, end);
        };
    }
}());