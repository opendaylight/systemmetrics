/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angular'], function (angular) {
    'use strict';

    angular.module('app.clusterconsole').directive('ccLineChart', ccLineChartDirective);

    function ccLineChartDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                metric: '=',
                members: '=',
                widgetType: '=',
                widgetId: '=',
                node: '=',
                page: '=',
                shardsData: '=',
                shard: '=',
                shardThresholds: '=',
                colors: '=',
                widgetTypes: '@',
            },
            controller: ccLineChartController,
            controllerAs: 'lineCtrl',
            bindToController: true,
            link: ccLineChartLink,
            templateUrl: 'src/app/clusterconsole/views/directives/cc-line-chart.tpl.html',
        };
    }

    ccLineChartController.$inject = ['$scope', 'ClusterConsoleConstants'];

    function ccLineChartController($scope, ClusterConsoleConstants) {
        var lineCtrl = $scope.lineCtrl;

        /**
         * public properties
         */
        lineCtrl.chart = {
            options: {
                animation: false,
                maintainAspectRatio: false,
                responsive: true,
                elements: {
                    line: {
                        tension: 0,
                        fill: false,
                    },
                },
            },
        };

        lineCtrl.combinedData = {};
        lineCtrl.shardObject = {};
        lineCtrl.shardMemberListKeys = [];
        lineCtrl.shardData = {};
        lineCtrl.constants = ClusterConsoleConstants;

        /**
         * public methods
         */
        lineCtrl.getThresholdData = getThresholdData;
        lineCtrl.loadShardData = loadShardData;
        lineCtrl.fillIndividualShardData = fillIndividualShardData;

        init();

        /**
         * Implementations
         */

        /**
         * Cleans lineCtrl.combinedData.values and lineCtrl.combinedData.labels arrays
         */
        function cleanCombinedData() {
            lineCtrl.combinedData.values = [];
            lineCtrl.combinedData.labels = [];
        }
        /**
         * Fills lineCtrl.combinedData.values and lineCtrl.combinedData.labels arrays with data
         */
        function fillCombinedData() {
            if(lineCtrl.widgetType === 'combined') {
                cleanCombinedData();

                if (lineCtrl.node === 'shard') {
                    if(lineCtrl.shardObject) {
                        lineCtrl.combinedData = lineCtrl.shardObject.data.members.prepareCombinedLineData(lineCtrl.metric, lineCtrl.shardThresholds);
                    }
                }
                else {
                    lineCtrl.combinedData = lineCtrl.members.prepareCombinedLineData(lineCtrl.metric, lineCtrl.node);
                }
            }
        }

        /**
         * Fills lineCtrl.shardData with labels and values
         */
        function fillIndividualShardData() {
            if(lineCtrl.widgetType === 'individual') {
                lineCtrl.shardMemberListKeys.forEach(function(memberName) {
                    lineCtrl.shardData[memberName] = lineCtrl.shardObject.data.members.list[memberName].data.statistics.getMetricChartData(lineCtrl.metric);
                });
            }
        }

        /**
         * Prepare data for threshold line in chart
         * @param memberName
         * @param metricName
         * @return {Array}
         */
        function getThresholdData(memberName, metricName) {
            return lineCtrl.shardObject.data.members.getThresholdData(
                lineCtrl.shardThresholds[metricName],
                memberName,
                metricName
            );
        }

        /**
         * Load shards data
         */
        function loadShardData() {
            if (lineCtrl.node === 'shard') {
                lineCtrl.shardObject = lineCtrl.shardsData.getShardObject(lineCtrl.shard);
                if (lineCtrl.shardObject) {
                    lineCtrl.shardMemberListKeys = lineCtrl.shardObject.data.members.getShardMemberListKeys();
                }
            }
        }

        /**
         * Initialization
         */
        function init() {
            loadShardData();
            fillIndividualShardData();
            fillCombinedData();

            /**
             * On MEMBERS_LOADED event load all statistics
             */
            $scope.$on(lineCtrl.constants.CC_STATISTICS_LOADED, function () {
                loadShardData();
                fillIndividualShardData();
                fillCombinedData();
            });

        }
    }

    function ccLineChartLink(scope, element, attr, lineCtrl) {
        lineCtrl.getContentUrl = function () {
            return lineCtrl.widgetType ?
                'src/app/clusterconsole/views/directives/cc-line-chart-' + lineCtrl.widgetType + '.tpl.html' :
                '';
        };
    }
});
