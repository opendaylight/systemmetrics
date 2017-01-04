/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/shard-member-list.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ShardService', ShardService);

    ShardService.$inject = ['ShardMemberListService'];

    function ShardService(ShardMemberListService) {
        var service = {
            createObject: createObject,
        };

        return service;


        function Shard() {
            var self = this;

            // properties
            self.data = {
                name: '',
                status: '',
                members: ShardMemberListService.createList(),
            };
            self.thresholdsExceeded = 0;


            // methods
            self.setData = setData;
            self.getData = getData;
            self.loadData = loadData;
            self.checkThresholds = checkThresholds;
            self.generateDummyStats = generateDummyStats;

            /**
             * Generate dummy statistics for members list
             */
            function generateDummyStats() {
                self.data.members.generateDummyStats();
            }


            /**
             * Set number of statistics exceeding threshold
             * @param thresholds
             */
            function checkThresholds(thresholds) {
                self.thresholdsExceeded = self.data.members.checkThresholds(thresholds);
                return self.thresholdsExceeded;
            }


            /**
             * Force ShardMembersList to load statistics
             */
            function loadData(generateShardDummyStats) {
                return self.data.members.loadData(self.data.name, self.data.status, generateShardDummyStats);
            }

            function getData() {
                return self.data;
            }

            /**
             * Grouped setter
             *
             * @param name
             * @param status
             */
            function setData(name, status, memberName, memberAddress, memberColor) {
                if (name && status) {
                    self.data.name = name;
                    self.data.status = status;
                }
                self.data.members.addToList(memberName, memberAddress, memberColor, name, status);
            }
        }

        function createObject(name, status, memberName, memberAddress, memberColor) {
            var obj = new Shard();

            if (name && name && memberName) {
                obj.setData(name, status, memberName, memberAddress, memberColor);
            }

            return obj;
        }
    }

});
