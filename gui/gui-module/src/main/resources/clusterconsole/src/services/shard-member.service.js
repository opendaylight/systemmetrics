/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/shard-statistics.service'
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ShardMemberService', ShardMemberService);

    ShardMemberService.$inject = ['ClusterConsoleRestangular', 'ShardStatisticsService'];

    function ShardMemberService(ClusterConsoleRestangular, ShardStatisticsService) {
        var service = {
            createObject: createObject,
        };

        return service;


        function ShardMember() {
            var self = this;

            // properties
            self.data = {
                name: '',
                address: '',
                color: '',
                'raft-state': '',
                'follower-info': [],
                statistics: null,
            };


            // methods
            self.getData = getData;
            self.loadData = loadData;
            self.setData = setData;
            self.setLoadedData = setLoadedData;
            self.checkThresholds = checkThresholds;
            self.generateDummyStats = generateDummyStats;

            /**
             * Generate shardMember dummy statistics with current timestamp
             */
            function generateDummyStats() {
                var dummyData = {},
                    statsData = self.data.statistics.data;

                var lastIndex = statsData['last-index'].last();
                var commitIndex = statsData['commit-index'].last();

                dummyData['last-index'] = lastIndex ? parseInt(lastIndex) + getRandomInt(1, 10) : getRandomInt(1, 10);
                dummyData['commit-index'] = commitIndex ? parseInt(commitIndex) + getRandomInt(1, 10) : getRandomInt(1, 10);
                dummyData['pending-tx-commit-queue-size'] = getRandomInt(1, 10);
                dummyData['in-memory-journal-log-size'] = getRandomInt(1, 100);
                dummyData['replicated-to-all-index'] = getRandomInt(1, 10);
                dummyData['timestamp'] = Math.floor(Date.now() /1000);
                dummyData['last-applied'] = getRandomInt(1, 10);

                self.data.statistics.addData(dummyData);

                /**
                 * Returns a random integer between min (inclusive) and max (inclusive)
                 * Using Math.round() will give you a non-uniform distribution!
                 */
                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }


            /**
             *
             * @param thresholds
             */
            function checkThresholds(thresholds) {
                return self.data.statistics.checkThresholds(thresholds);
            }


            /**
             * Getter
             * @returns {{name: string, raft-state: string, follower-info: Array, statistics: Array}|*}
             */
            function getData() {
                return self.data;
            }

            /**
             * Loads data for each member calling stats-reflector:get-shard-mbean RPC
             * @param shardName
             * @param shardStatus
             * @returns {*}
             */
            function loadData(shardName, shardStatus, generateShardDummyStats) {
                var restObj = ClusterConsoleRestangular
                    .one('restconf')
                    .one('operations')
                    .one('stats-reflector:get-shard-mbean'),
                    restData = {
                        input: {
                            'member-address': self.data.address,
                            'member-name': self.data.name,
                            status: shardStatus,
                            shard: shardName
                        }
                    };

                return restObj.customPOST(restData).then(
                    function (data) {
                        if (data) {
                            if (generateShardDummyStats) {
                                self.generateDummyStats();
                            }
                            else{
                                setLoadedData(data.output);
                            }
                        }
                    },
                    function() {
                        console.warn('No cluster members data!');
                    });
            }

            /**
             * Set data loaded from controller
             * @param shardMemberData
             */
            function setLoadedData(shardMemberData) {
                self.data['raft-state'] = shardMemberData ? shardMemberData['raft-state'] : self.data['raft-state'];
                self.data.statistics.addData(shardMemberData);
            }

            /**
             * Grouped setter used to set data from parent object (ShardMemberList)
             *
             * @param name
             * @param status
             */
            function setData(memberName, memberAddress, memberColor, shardMemberData) {
                self.data.name = memberName;
                self.data.address = memberAddress;
                self.data.color = memberColor;
                self.data['raft-state'] = shardMemberData ? shardMemberData['raft-state'] : self.data['raft-state'];
                self.data.statistics = ShardStatisticsService.createObject();
            }
        }

        /**
         * Creates ShardMember object and sets data if available
         * @param memberName
         * @param memberAddress
         * @returns {ShardMember}
         */
        function createObject(memberName, memberAddress, memberColor) {
            var obj = new ShardMember();

            if (memberName) {
                obj.setData(memberName, memberAddress, memberColor, null);
            }

            return obj;
        }
    }

});
