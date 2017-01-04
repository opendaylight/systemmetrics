/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/controllers/add-page.controller',
    'app/clusterconsole/controllers/add-widget.controller',
    'app/clusterconsole/controllers/dashboard.controller',
    'app/clusterconsole/controllers/edit-page.controller',
    'app/clusterconsole/controllers/edit-widget.controller',
    'app/clusterconsole/controllers/page.controller',
    'app/clusterconsole/controllers/settings.controller',
    'app/clusterconsole/controllers/statistics.controller',
    'app/clusterconsole/controllers/shard-manager.controller',
    'app/clusterconsole/services/clusterconsole.service',
    'app/clusterconsole/services/cluster-member-list.service',
    'app/clusterconsole/services/page-list.service',
    'app/clusterconsole/services/restangular.service',
    'app/clusterconsole/services/settings.service',
    'app/clusterconsole/services/statistics.service',
    'app/clusterconsole/services/shard-list.service',
    'app/clusterconsole/services/utils.service',
    'app/clusterconsole/services/widget-list.service',
    'app/clusterconsole/directives/cc-doughnut-gauge.directive',
    'app/clusterconsole/directives/cc-line-chart.directive',
    'app/clusterconsole/directives/cc-radar-chart.directive',
    'app/clusterconsole/directives/cc-widget-toolbar.directive',
], function () {
    'use strict';

    angular.module('app.clusterconsole').controller('ClusterConsoleCtrl', ClusterConsoleCtrl);

    ClusterConsoleCtrl.$inject = ['$interval', '$mdSidenav', '$q', '$scope', '$timeout', 'ClusterConsoleService', 'ClusterMemberListService',
        'ShardListService', 'SettingsService', 'UtilsService', 'ClusterConsoleConstants',
    ];

    function ClusterConsoleCtrl($interval, $mdSidenav,  $q, $scope, $timeout, ClusterConsoleService,
                                ClusterMemberListService, ShardListService, SettingsService, UtilsService,
                                ClusterConsoleConstants
    ) {
        var main = this;

        /**
         * local variables
         */
        main.clusterMemberList = ClusterMemberListService.createList();
        main.autoRefreshPromise = null;
        main.shardList = ShardListService.createList();
        main.settings = SettingsService.createSettings();
        main.generateShardDummyStats = false;
        main.constants = ClusterConsoleConstants;
        main.colorsFiltered = [];

        /**
         * Local methods
         */
        main.showSettings = showSettings;



        /**
         * global methods
         */
        $scope.broadcastFromRoot = broadcastFromRoot;
        $scope.loadClusterMembers = loadClusterMembers;
        $scope.loadAllStatistics = loadAllStatistics;



        init();

        /**
         * Implementations
         */


        /**
         * Toggle settings sidebar
         */
        function showSettings() {
            $mdSidenav('settingsPanel').open();
        }

        /**
         * Broadcast event from root controller
         * @param eventName
         * @param val
         */
        function broadcastFromRoot(eventName, val) {
            $scope.$broadcast(eventName, val);
        }

        function filterColorsByClusterMembers() {
            main.colorsFiltered = main.settings.data['members-color']
                .slice(0, main.clusterMemberList.list.length)
                .concat(['#ff0000']);
        }

        /**
         * Initialization
         */
        function init() {
            UtilsService.init();
            ClusterConsoleService.setMainClass();
            main.settings.loadData();

            $scope.loadClusterMembers(main.settings);

            $scope.$on(main.constants.CC_LOAD_STATISTICS, reload);

            $scope.$on(main.constants.CC_RESET_ALL_STATISTICS_DATA, resetAllStatisticsData);

            $scope.$on(main.constants.CC_MEMBERS_COLORS_SETTINGS_CHANGED, updateMembersColors);

            $scope.$on(main.constants.CC_THRESHOLD_SETTINGS_CHANGED, checkShardsThresholds);

            $scope.$watch(function watchFunction() {
                return main.settings.data['polling-interval'];
            }, function () {
                stopLiveReload();

                if (main.settings.data['auto-refresh']) {
                    startLiveReload();
                }
                main.settings.saveData();
            });

            $scope.$watch(function watchFunction() {
                return main.settings.data['auto-refresh'];
            }, function () {
                toggleLiveReload();
                main.settings.saveData();
            });
        }

        function loadAllShardsAndStatistics() {
            loadAllShards();
            loadAllStatistics();
        }

        /**
         * Check if any shard has some metric exceeding threshold, call this function after statistics load or settings
         * change or anything what may affect
         */
        function checkShardsThresholds() {
            main.shardList.checkThresholds(main.settings.data['shard-stats-threshold']);
        }

        /**
         * Init shardList with shards got from clusterMemberList
         */
        function loadAllShards() {
            main.clusterMemberList.list.forEach(function (member) {
                member.data.shards.forEach(function (shard) {
                    main.shardList.addToList(shard, member.data.name, member.data.address, member.data.color);
                });
            });
        }

        /**
         * Load statistics for all members
         */
        function loadAllStatistics() {
            var promises = [];

            main.clusterMemberList.list.forEach(function (member) {
                promises.push(loadStatistic(member));
            });

            promises = promises.concat(main.shardList.loadData(main.generateShardDummyStats));

            $q.all(promises).then(function() {
                checkShardsThresholds();
                filterColorsByClusterMembers();
                $scope.broadcastFromRoot(main.constants.CC_STATISTICS_LOADED);
            });
        }

        /**
         * Loads cluster members from controller
         */
        function loadClusterMembers(settings) {
            main.clusterMemberList.loadData(
                settings,
                loadAllShardsAndStatistics,
                loadAllShardsAndStatistics
            );
        }

        /**
         * Load statistics for one member
         * @param member
         */
        function loadStatistic(member) {
            return member.data.statistics.loadData(
                member.data.address
            );
        }

        /**
         * Loads cluster members and statistics.
         */
        function reload() {
            loadAllShardsAndStatistics();
        }

        /**
         * Clears statistics data
         */
        function resetAllStatisticsData() {
            main.clusterMemberList.list.forEach(function (clusterMember) {
                clusterMember.data.statistics.loadData(clusterMember.data.address, null, function() {
                    clusterMember.data.statistics.resetAllStatistics();
                });
            });

            main.shardList.list.forEach(function (shard) {
                Object.keys(shard.data.members.list).forEach(function (member) {
                    shard.data.members.list[member].data.statistics.resetAllData();
                });
            });

            $timeout(reload, 5000);
        }

        /**
         * Registers the interval for reloading data.
         */
        function startLiveReload() {
            main.autoRefreshPromise = $interval(reload, main.settings.data['polling-interval'] * 1000);
        }

        /**
         * Cancels the live reload interval
         */
        function stopLiveReload() {
            $interval.cancel(main.autoRefreshPromise);
            main.autoRefreshPromise = null;
        }

        /**
         * Toggle live reload interval
         */
        function toggleLiveReload() {
            if (main.settings.data['auto-refresh'] && !main.autoRefreshPromise) {
                startLiveReload();
            }
            else if (!main.settings.data['auto-refresh'] && main.autoRefreshPromise){
                stopLiveReload();
            }
        }

        /**
         * Update members colors
         */
        function updateMembersColors() {
            main.clusterMemberList.setColors(main.settings.data['members-color']);
            filterColorsByClusterMembers();
            reload();
        }

    }

});
