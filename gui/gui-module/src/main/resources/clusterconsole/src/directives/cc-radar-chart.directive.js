/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angular'], function (angular) {
    'use strict';

    angular.module('app.clusterconsole').directive('ccRadarChart', ccRadarChart);

    /**
     * Directive for displaying radar chart for given parameters
     */
    function ccRadarChart() {
        return {
            restrict: 'E',
            scope: {
                metric: '=',
                members: '=',
                node: '=',
                page: '=',
                widgetId: '=',
            },
            controller: ccRadarChartController,
            controllerAs: 'radarCtrl',
            bindToController: true,
            templateUrl: 'src/app/clusterconsole/views/directives/cc-radar-chart.tpl.html',
        };
    }

    ccRadarChartController.$inject = ['$scope', 'ClusterConsoleConstants'];

    /**
     * Controller for {@link ccRadarChart} directive
     * @param $scope
     */
    function ccRadarChartController($scope, ClusterConsoleConstants) {
        var radarCtrl = $scope.radarCtrl;

        /**
         * public properties
         */
        radarCtrl.radarOptions = {
            animation: false,
        };
        radarCtrl.radarData = {};
        radarCtrl.constants = ClusterConsoleConstants;

        init();

        /**
         * Implementations
         */

        /**
         * Initialization
         */
        function init() {
            prepareData();
            $scope.$on(radarCtrl.constants.CC_STATISTICS_LOADED, prepareData);
        }

        /**
         * Parse statistic data
         */
        function prepareData() {
            radarCtrl.radarData = radarCtrl.members.prepareRadarData(radarCtrl.metric, radarCtrl.node);
        }
    }
});
