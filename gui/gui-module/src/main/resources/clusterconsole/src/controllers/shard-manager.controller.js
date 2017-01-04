/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    '',
], function () {
    'use strict';

    angular
        .module('app.clusterconsole')
        .controller('ShardManagerController', ShardManagerController);

    ShardManagerController.$inject = ['$scope', '$stateParams', 'ClusterConsoleConstants'];

    function ShardManagerController($scope, $stateParams, ClusterConsoleConstants) {
        var shardManager = this;

        shardManager.shardList = null;
        shardManager.metricNames = ClusterConsoleConstants.MEMBER_METRIC_NAMES.shard;
        shardManager.selectedShard = null;
        shardManager.settings = null;
        shardManager.constants = ClusterConsoleConstants;

        shardManager.selectShard = selectShard;
        shardManager.setDefaultShard = setDefaultShard;
        shardManager.init = init;
        shardManager.checkCurrentShardThreshold = checkCurrentShardThreshold;
        shardManager.generateDummyStats = generateDummyStats;

        /**
         * Generate dummy statistics for shard list
         */
        function generateDummyStats() {
            shardManager.shardList.generateDummyStats();
        }


        /**
         * Returns true if current value of metricName for currently selected shard exceeds threshold
         * @param metricName
         * @param memberName
         * @return {*}
         */
        function checkCurrentShardThreshold(memberName, metricName) {

            return (
                shardManager.selectedShard !== null &&
                shardManager.selectedShard.data.members.list[memberName].data.statistics.checkThreshold(
                    metricName,
                    shardManager.settings.data['shard-stats-threshold']
                )) ||
                false;
        }

        /**
         * Init controller with necessary data from main controller
         * Set default shard to be displayed
         *
         * @param shardList
         * @param settings
         */
        function init(shardList, settings) {

            shardManager.shardList = shardList;
            shardManager.settings = settings;

            if ($stateParams.shard.length > 0) {
                var shardToSelect = shardManager.shardList.getShardByNameAndStatus($stateParams.shard);
                if(shardToSelect){
                    shardManager.selectedShard = shardToSelect;
                }
            }

            $scope.$on(shardManager.constants.CC_STATISTICS_LOADED, refreshShardStatistics);

            refreshShardStatistics();
        }

        /**
         * Run routines which have to be run after data are loaded or refreshed
         */
        function refreshShardStatistics(){
            if (shardManager.selectedShard === null){
                shardManager.setDefaultShard();
            }

        }

        /**
         * Set dafault selected shard after all statistics are loaded
         */
        function setDefaultShard(){
            if (angular.isArray(shardManager.shardList.list) && shardManager.shardList.list.length > 0) {
                shardManager.selectShard(shardManager.shardList.list[0]);
            }
        }


        /**
         * Select shard by name to display its data table
         * @param shard
         */
        function selectShard(shard) {
            shardManager.selectedShard = shard;
        }

    }

});
