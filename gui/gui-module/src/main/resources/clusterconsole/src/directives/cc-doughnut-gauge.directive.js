/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angular'], function (angular) {
    'use strict';

    angular.module('app.clusterconsole').directive('ccDoughnutGauge', ccDoughnutGauge);

    /**
     * Directive for displaying gauge chart for given parameters
     */
    function ccDoughnutGauge() {
        return {
            restrict: 'E',
            scope: {
                gaugeSize: '@',
                members: '=',
                metric: '=',
                node: '=',
                page: '=',
                widgetId: '=',
                maxValues: '=',
                shardsData: '=',
                widgetTypes: '@',
            },
            controller: ccDoughnutGageController,
            controllerAs: 'gaugeCtrl',
            bindToController: true,
            templateUrl: 'src/app/clusterconsole/views/directives/cc-doughnut-gauge.tpl.html',
        };
    }

    ccDoughnutGageController.$inject = ['$scope', 'ClusterConsoleConstants'];
    /**
     * Controller for {@link ccDoughnutGauge} directive
     * @param $scope
     */
    function ccDoughnutGageController($scope, ClusterConsoleConstants) {

        var gaugeCtrl = $scope.gaugeCtrl;

        /* Properties */
        gaugeCtrl.gaugeLabels = ['', ''];
        gaugeCtrl.gaugeOptions = {
            responsive: false,
            responsiveAnimationDuration: 0,
            animation: false,
            maintainAspectRatio: true,
            cutoutPercentage: 60,
            circumference: Math.PI,
            rotation: (-1 * Math.PI),
            legend: { display: false },
        };
        gaugeCtrl.constants = ClusterConsoleConstants;

        /* Methods */
        gaugeCtrl.isNumber = isNumber;

        init();

        /**
         * Initialization
         */
        function init() {
            prepareData();
            $scope.$on(gaugeCtrl.constants.CC_STATISTICS_LOADED, prepareData);
            $scope.$watch('maxValues', prepareData);
        }

        /**
         * Parse statistic data
         */
        function prepareData() {
            gaugeCtrl.gaugeData = gaugeCtrl.members.prepareGaugeData(gaugeCtrl.metric, gaugeCtrl.node, gaugeCtrl.maxValues);
        }

        /**
         * Check if value is an infinite number
         * @param  {value}
         * @return {Boolean}
         */
        function isNumber(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
    }
});
