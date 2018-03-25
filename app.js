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
                bedtime: new Date(2018, 2, 25, 20, 0),
                expected: null
            },
            {
                startTime: new Date(2018, 2, 25, 17, 0),
                endTime: new Date(2018, 2, 25, 20, 0),
                bedtime: new Date(2018, 2, 25, 19, 0),
                expected: 32
            },
            {
                startTime: new Date(2018, 2, 25, 19, 0),
                endTime: new Date(2018, 2, 25, 2, 0),
                bedtime: new Date(2018, 2, 25, 1, 0),
                expected: 92
            },
            {
                startTime: new Date(2018, 2, 25, 2, 0),
                endTime: new Date(2018, 2, 25, 20, 0),
                bedtime: new Date(2018, 2, 25, 0, 0),
                expected: null
            },
            {
                startTime: new Date(2018, 2, 25, 16, 0),
                endTime: new Date(2018, 2, 25, 3, 0),
                bedtime: new Date(2018, 2, 25, 13, 0),
                expected: null
            },
            {
                startTime: new Date(2018, 2, 25, 0, 0),
                endTime: new Date(2018, 2, 25, 5, 0),
                bedtime: new Date(2018, 2, 25, 6, 0),
                expected: null
            },
            {
                startTime: new Date(2018, 2, 25, 0, 0),
                endTime: new Date(2018, 2, 25, 4, 0),
                bedtime: new Date(2018, 2, 25, 0, 0),
                expected: 64
            },
            {
                startTime: new Date(2018, 2, 25, 4, 0),
                endTime: new Date(2018, 2, 25, 4, 0),
                bedtime: new Date(2018, 2, 25, 4, 0),
                expected: 0
            },
            {
                startTime: new Date(2018, 2, 25, 4, 0),
                endTime: new Date(2018, 2, 25, 2, 0),
                bedtime: new Date(2018, 2, 25, 1, 0),
                expected: null
            }
        ];

        //first rule - babysitter cannot start before 5pm
        //Question: Would a start time ever be after midnight? Start times after or equal to midnight are currently invalid.

        //second rule - babysitter leaves no later than 4am
        //Question: If a babysitter shows up and leaves at the same time (if a job were cancelled, for example) is the end time valid? Currently all end times between 5pm - 4am are valid.
        //Question: Since end time cannot be beyond 4am, can start time be up until 4am? If someone needed an emergency baby sitter, start times might be later? I've changed the start time to allow all the way up to 4am.

        //third rule - babysitter is paid $12/hour between start time to bedtime
        //Question: When is bedtime? Made bedtime a variable input.
        //Question: What if child is already asleep when babysitter arrives? I allow for bedtime to be anytime between start and end times.

        //fourth rule - babysitter is paid $8/hour between bedtime and midnight
        //Question: What if bedtime is after midnight? I'm going to pay the babysitter $12 an hour up until bedtime, regardless of time. Then an additional $8 an hour if bedtime is before midnight, until midnight.

        //fifth rule - babysitter is paid $16/hour after midnight until end of job
        //Question: if bedtime is after midnight, does babysitter get paid $12/hr or $16/hr? I'm going to pay the babysitter $16/hr after midnight, regardless of bedtime.

        //sixth rule - babysitter gets paid for full hours only
        //Thought: I hadn't really taken minutes into account when I started this, but adjusting the math at this point could have been easily worked in.


        function afterFivePM(input){
            return input && input.getHours() >= 17;
        }

        function beforeFourAM(input){
            return input && input.getHours() <= 4;
        }

        function validTime(input){
            return input && (afterFivePM(input) || beforeFourAM(input));
        }

        function validStartEnd(input){
            if(input.start && input.end && validTime(input.start) && validTime(input.end)){
                if((afterFivePM(input.end) && afterFivePM(input.start)) || (beforeFourAM(input.end) && beforeFourAM(input.start))){
                    return input.end.getHours() >= input.start.getHours();
                } else {
                    return afterFivePM(input.start) && beforeFourAM(input.end);
                }
                //If start must be later than 5pm, end must be either the same or later than start. End can't be earlier than start.
            }
            return false;
        }

        function validBedtime(input){
            if(input.bedtime.getHours() <= input.end.getHours() && input.bedtime.getHours() >= input.start.getHours()){
                return true;
            } else if((beforeFourAM(input.bedtime) && !beforeFourAM(input.start) && input.bedtime.getHours() <= input.end.getHours()) || (beforeFourAM(input.end) && !beforeFourAM(input.bedtime) && input.bedtime.getHours() >= input.start.getHours())){
                //accounts for bedtime being after midnight if start time was before midnight or end time after midnight when bedtime was before midnight.
                return true;
            }
            console.log('returning false in bedtime', input.bedtime);
            return false;
        }

        function calcStartPay(input){
            //calculates payment before bedtime
            if(beforeFourAM(input.bedtime)){
                if(!beforeFourAM(input.start)) {
                    return 12 * (24 - input.start.getHours());
                    //accounts for bedtime after midnight when start time was before midnight
                    //EDIT: no longer pays after midnight. pays until midnight, then end pay covers $16/hr after midnight
                }
            }
            return 12 * (input.bedtime.getHours() - input.start.getHours());
            //pays $12/hr if bedtime is before midnight
        }

        function calcEndPay(input){
            //calculates payment after bedtime until midnight
            if(afterFivePM(input.bedtime)){
                if(beforeFourAM(input.end)){
                    return (8 * (24 - input.bedtime.getHours())) + (16 * input.end.getHours());
                    //pays $8/hr after bedtime until midnight + 16/hr for every hour after midnight
                }
                return 8 * (input.end.getHours() - input.bedtime.getHours());
                //accounts for end time not being later than midnight, pays $8/hr after bedtime until end time
            } else if(beforeFourAM(input.end)){
                if(beforeFourAM(input.start)){
                    return 16 * (input.end.getHours() - input.start.getHours());
                    //accounts for use case of start being later than midnight, pays $16/hr from start to end
                }
                return 16 * input.end.getHours();
                // pays 16/hr after night
            }
            return 0;
        }

        $scope.validInput = function(start, end, bedtime){
            if(start && end && bedtime){
                if(validStartEnd({start: start, end: end, bedtime: bedtime}) && validTime(bedtime)){
                    //checks if start and end times are valid against each other and checks if bedtime is a valid time in that range
                    //Bedtime is valid if between or equal to the beginning or end of babysitting time frame.
                    return validBedtime({start: start, end: end, bedtime: bedtime});
                }
                return false;
            }
        };

        $scope.testRule = function(start, end, bedtime){
            if(start && end && bedtime){
                if($scope.validInput(start, end, bedtime)){
                    return calcStartPay({start: start, end: end, bedtime: bedtime}) + calcEndPay({start: start, end: end, bedtime: bedtime});
                }
                return null;
            }
            return null;
        };

    }
}());