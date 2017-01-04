/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ShardStatisticsService', ShardStatisticsService);

    ShardStatisticsService.$inject = ['ClusterConsoleConstants'];

    function ShardStatisticsService(ClusterConsoleConstants) {
        var service = {
            createObject: createObject,
        };

        return service;


        function ShardStatistics() {
            var self = this;

            // properties
            self.data = {};

            // methods
            self.addData = addData;
            self.getData = getData;
            self.init = init;
            self.checkThresholds = checkThresholds;
            self.checkThreshold = checkThreshold;
            self.resetData = resetData;
            self.resetAllData = resetAllData;
            self.getMetricChartData = getMetricChartData;

            /**
             * Get data for given metric in format customized for chart directive
             */
            function getMetricChartData(metricName) {
                if (self.data[metricName].length) {
                    return {
                        labels: self.data.timestamp.slice(-self.data[metricName].length),
                        values: self.data[metricName]
                    };
                }
                else{
                    return {labels: [], values: []};
                }
            }

            /**
             * Check if threshold for metricName is exceeded (comparing last value in statistics)
             * Returns true if current metric value exceeds given threshold
             * @param metricName
             * @param thresholds
             * @returns {boolean}
             */
            function checkThreshold(metricName, thresholds) {
                return thresholds[metricName] !== 0 && self.data[metricName].last() >= thresholds[metricName];
            }

            /**
             * Check thresholds for all metrics and return number of metrics, where threshold is exceeded
             * @param thresholds
             * @returns {number}
             */
            function checkThresholds(thresholds) {
                var result = 0;

                if(self.data.timestamp.length > 0){
                    ClusterConsoleConstants.MEMBER_METRIC_NAMES.shard.forEach(function (metricName) {
                        result += checkThreshold(metricName, thresholds);
                    });
                }

                return result;
            }

            /**
             * Init data object with shard member metric names from ClusterConsoleConstants
             */
            function init() {
                ClusterConsoleConstants.MEMBER_METRIC_NAMES.shard.forEach(function (metricName) {
                    self.data[metricName] = [];
                });

            }

            function getData() {
                return self.data;
            }

            /**
             * Grouped setter
             *
             * @param shardStatisticsData
             */
            function addData(shardStatisticsData) {

                shardStatisticsData.timestamp = timestampToTime(shardStatisticsData.timestamp);
                if(self.data.timestamp.indexOf(shardStatisticsData.timestamp)===-1){
                    ClusterConsoleConstants.MEMBER_METRIC_NAMES.shard.forEach(function (metricName) {
                        self.data[metricName].push(shardStatisticsData[metricName].toString());
                    });
                }

                function timestampToTime(timestamp) {
                    var date = new Date(timestamp * 1000);
                    return date.toLocaleTimeString();
                }
            }

            function resetAllData() {
                Object.keys(self.data).forEach(function (metricName) {
                    resetData(metricName);
                });
            }

            function resetData(metricName) {
                self.data[metricName].length = 0;
            }
        }

        /**
         * Create empty ShardStatistics object
         * @returns {ShardStatistics}
         */
        function createObject() {
            var obj = new ShardStatistics();
            obj.init();
            return obj;
        }
    }

});
