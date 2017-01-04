/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/shard-member.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ShardMemberListService', ShardMemberListService);

    ShardMemberListService.$inject = ['$filter', '$q',  'ShardMemberService'];

    function ShardMemberListService($filter, $q, ShardMemberService) {
        var service = {
            createList: createList,
        };

        return service;


        function ShardMemberList() {
            var self = this;

            /**
             * properties
             */
            self.list = {};


            /**
             * methods
             */
            self.addToList = addToList;
            self.clearList = clearList;
            self.setData = setData;
            self.loadData = loadData;
            self.checkThresholds = checkThresholds;
            self.generateDummyStats = generateDummyStats;
            self.getShardMemberListKeys = getShardMemberListKeys;
            self.prepareCombinedLineData = prepareCombinedLineData;
            self.getThresholdData = getThresholdData;

            /**
             * Generate dummy statistics for each member
             */
            function generateDummyStats() {
                angular.forEach(self.list, function (member, memberName) {
                    member.generateDummyStats();
                });
            }


            /**
             *
             * @param thresholds
             */
            function checkThresholds(thresholds) {
                var exceededThresholdsCount = 0;

                angular.forEach(self.list, function (member) {
                    exceededThresholdsCount += member.checkThresholds(thresholds);
                });

                return exceededThresholdsCount;
            }


            /**
             * Load statistics for each member in list
             */
            function loadData(shardName, shardStatus, generateShardDummyStats) {
                var promises = [];

                angular.forEach(self.list, function (shardMember) {
                    promises.push(shardMember.loadData(shardName, shardStatus, generateShardDummyStats));
                });

                return promises;
            }

            /**
             * Adds item into list
             * @param item
             */
            function addToList(memberName, memberAddress, memberColor, shardName, shardStatus) {

                if (!self.list.hasOwnProperty(memberName)) {
                    self.list[memberName] = ShardMemberService.createObject(memberName, memberAddress, memberColor);
                }
                //self.list[memberName].loadData(shardName, shardStatus);
            }

            /**
             * Clears list
             */
            function clearList() {
                self.list = {};
            }

            /**
             * Sets data to list
             * @param serverData
             */
            function setData(serverData) {
                serverData.forEach(function (member) {
                    self.addToList(member);
                });
            }

            /**
             * Return list of shard members
             * @return {Array}
             */
            function getShardMemberListKeys() {
                return Object.keys(self.list);
            }

            /**
             * Prepare data to be used in combined line chart
             */
            function prepareCombinedLineData(metric, shardThresholds) {
                var combinedData = {};
                var memberData = {};
                combinedData.values = [];
                combinedData.labels = [];

                var shardMemberListKeys = self.getShardMemberListKeys();

                if(shardMemberListKeys && shardMemberListKeys.length) {
                    memberData = shardMemberListKeys.map(function (memberName) {
                        return self.list[memberName].data.statistics.getMetricChartData(metric);
                    });

                    combinedData.values = memberData.map(function(shardMember) {
                        combinedData.labels = shardMember.labels;
                        return shardMember.values;
                    });

                    if (combinedData.labels.length && shardThresholds[metric] > 0) {
                        combinedData.values.push(new Array(combinedData.labels.length).fill(shardThresholds[metric]));
                    }

                    return combinedData;
                }
            }

            /**
             * Prepare data for threshold line in chart
             * @param thresholds
             * @param memberName
             * @param metricName
             * @return {Array}
             */
            function getThresholdData(thresholds, memberName, metricName) {
                var thresholdValue = thresholds,
                    arrayLength = self.list[memberName].data.statistics.data[metricName].length;

                return thresholdValue > 0 && new Array(arrayLength).fill(thresholdValue);
            }
        }

        /**
         * Creates list object
         * @returns {ShardMemberList}
         */
        function createList() {
            return new ShardMemberList();
        }

    }

});
