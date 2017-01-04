/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('StatisticsService', StatisticsService);

    StatisticsService.$inject = ['ClusterConsoleConstants', 'ClusterConsoleRestangular'];

    function StatisticsService(ClusterConsoleConstants, ClusterConsoleRestangular) {
        var service = {
            createObject: createObject,
        };

        return service;

        /**
         * Contructor for Statistics object
         * @constructor
         */
        function Statistics() {
            var self = this;

            /**
             * properties
              */
            self.data = {};
            createStatisticsObject();

            /**
             * methods
             */
            self.loadData = loadData;
            self.setData = setData;
            self.resetAllStatistics = resetAllStatistics;
            self.resetStatistic = resetStatistic;
            self.resetStatistics = resetStatistics;

            /**
             * Creates statistics object from constants MEMBER_METRIC_NAMES data
             */
            function createStatisticsObject() {
                Object.keys(ClusterConsoleConstants.MEMBER_METRIC_NAMES).forEach(function (node) {
                    ClusterConsoleConstants.MEMBER_METRIC_NAMES[node].forEach(function (metricName) {
                        if (!self.data.hasOwnProperty(metricName)) {
                            self.data[metricName] = {};
                        }

                        if (!self.data[metricName].hasOwnProperty(node.toLowerCase())) {
                            self.data[metricName][node] = {
                                labels: [],
                                values: [],
                            };
                        }
                    });
                });
            }

            /**
             * Loads statistics data based on input properties
             * @param memberAddress
             * @param metricName
             * @param successCallback
             * @param errorCallback
             * @returns {*}
             */
            function loadData(memberAddress, metricName, successCallback, errorCallback) {
                var restObj = ClusterConsoleRestangular
                                .one('restconf')
                                .one('operations')
                                .one('stats-reflector:get-stats'),
                    restData = {
                        input: {
                            'cluster-member': memberAddress,
                            'data-category': 'EXTERNAL',
                            //'metric-name': metricName,
                        },
                    };

                return restObj.customPOST(restData).then(
                    function (data) {
                        if (data) {
                            self.setData(data.output);
                            (successCallback || angular.noop)();
                        }
                    },
                    function () {
                        console.warn('No statistics members data!');
                        (errorCallback || angular.noop)();
                    });
            }

            /**
             * Process raw statistics data and saves them into Statistics object
             * @param serverData
             */
            function processRawData(serverData) {
                serverData.forEach(function (rawDataItem) {
                    var node = splitNodeId(rawDataItem['node-id']).toLowerCase();
                    var dateTime = new Date(rawDataItem['time-stamp']);

                    if (self.data[rawDataItem['metric-name']][node]) {
                        if(self.data[rawDataItem['metric-name']][node].labels.last() !== dateTime.toLocaleTimeString()) {
                            self.data[rawDataItem['metric-name']][node].labels.push(dateTime.toLocaleTimeString());
                            self.data[rawDataItem['metric-name']][node].values.push(rawDataItem['metric-value']);
                        }
                    }
                });
            }

            function resetAllStatistics() {
                Object.keys(self.data).forEach(function (metric) {
                    Object.keys(self.data[metric]).forEach(function (node) {
                        resetStatistic(metric, node);
                    });
                });
            }

            function resetStatistic(metric, node) {
                self.data[metric][node].labels.length = 0;
                self.data[metric][node].values.length = 0;
            }

            function resetStatistics(metrics, node) {
                metrics.forEach(function (metric) {
                    resetStatistic(metric, node);
                });
            }

            /**
             * Grouped setter
             *
             * @param name
             * @param value
             */
            function setData(serverData) {
                if (serverData && serverData['data-points']) {
                    processRawData(serverData['data-points']);
                }
            }

            /**
             * Splits node-id from statistics and return first part
             * @param nodeId
             * @returns {*}
             */
            function splitNodeId(nodeId) {
                return nodeId.split(':')[0];
            }
        }

        /**
         * Creates statistics object
         * @returns {Statistics}
         */
        function createObject() {
            return new Statistics();
        }
    }

});
