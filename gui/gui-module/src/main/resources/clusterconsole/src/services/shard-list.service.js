/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/shard.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ShardListService', ShardListService);

    ShardListService.$inject = ['$filter', '$q', 'ClusterConsoleConstants', 'ShardService'];

    function ShardListService($filter, $q, ClusterConsoleConstants, ShardService) {
        var service = {
            createList: createList,
        };

        return service;


        function ShardList() {
            var self = this;

            self.list = [];
            self.shardsWithExceededThreshold = 0;

            self.addToList = addToList;
            self.checkThresholds = checkThresholds;
            self.clearList = clearList;
            self.loadData = loadData;
            self.setData = setData;
            self.generateDummyStats = generateDummyStats;
            self.getShardByNameAndStatus = getShardByNameAndStatus;
            self.getShardObject = getShardObject;
            self.getShardIndex = getShardIndex;

            /**
             * Get pointer to shard matching given name and status
             */
            function getShardByNameAndStatus(nameStatus) {
                var nameStatusParts = nameStatus.split('-'),
                    shardStatus = nameStatusParts.pop(),
                    shardName = nameStatusParts.join('-'),
                    result = self.list.filter(function (shard) {
                        return shard.data.name === shardName && shard.data.status === shardStatus;
                    });

                if(result){
                    return result[0];
                }
            }

            /**
             * Generate dummy statistics for each member
             */
            function generateDummyStats() {
                self.list.forEach(function (shard) {
                    shard.generateDummyStats();
                });
            }

            /**
             * Check tresholds for each shard in list
             * @param thresholds threshold values got from settings
             */
            function checkThresholds(thresholds) {
                self.shardsWithExceededThreshold = 0;
                self.list.forEach(function (shard) {
                    self.shardsWithExceededThreshold += shard.checkThresholds(thresholds);
                });
            }


            /**
             * Load statistics for all shards in list
             */
            function loadData(generateShardDummyStats) {
                var promises = [];

                self.list.forEach(function (shard) {
                    promises = promises.concat(shard.loadData(generateShardDummyStats));
                });

                return promises;
            }


            /**
             * Adds item into list
             * @param item
             */
            function addToList(item, memberName, memberAddress, memberColor) {
                var nameParts = getShardNameParts(item),
                    shard = $filter('filter')(self.list,
                        {
                            data: {
                                name: nameParts.name,
                                status: nameParts.status,
                            },
                        }
                    )[0];

                if (!shard) {
                    shard = ShardService.createObject();
                    self.list.push(shard);
                }

                shard.setData(nameParts.name, nameParts.status, nameParts.member, memberAddress, memberColor);
            }

            /**
             * Clears list
             */
            function clearList() {
                self.list.length = 0;
            }

            /**
             * Parse shard name in format *memberName*-shard-*shardName*-*shardStatus*
             *
             * @param name
             * @returns {{member: string, name: string, status: string}}
             */
            function getShardNameParts(name) {
                var retVal = {
                    member: '',
                    name: '',
                    status: '',
                };
                var parts = name.split('-shard-'),
                    parts2 = parts[1].split('-');

                retVal.member = parts[0];
                retVal.status = parts2.pop();
                retVal.name = parts2.join('-');

                return retVal;
            }

            /**
             * Sets data to list
             * @param serverData
             */
            function setData(serverData) {
                serverData.forEach(function (widget) {
                    self.addToList(widget);
                });
            }

            /**
             * Filter and return Shard from ShardList
             * @param shard
             * @return {Shard}
             */
            function getShardObject(shard) {
                var shardObject = $filter('filter')(
                    self.list,
                    {
                        data: {
                            name: shard.name,
                            status: shard.status,
                        },
                    }
                )[0];

                return shardObject;
            }

            /**
             * Get index of shard in ShardList
             * @param  {Object} shardObj
             * @return {int}
             */
            function getShardIndex(shardObj) {
                return self.list.findIndex(function(shard) {
                    return shard.data.name === shardObj.name && shard.data.status === shardObj.status;
                });
            }
        }

        /**
         * Creates list object
         * @returns {ShardList}
         */
        function createList() {
            return new ShardList();
        }

    }

});
