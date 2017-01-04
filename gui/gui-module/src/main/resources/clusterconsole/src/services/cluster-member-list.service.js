/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/cluster-member.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ClusterMemberListService', ClusterMemberListService);

    ClusterMemberListService.$inject = ['ClusterConsoleRestangular', 'ClusterMemberService', 'UtilsService'];

    function ClusterMemberListService(ClusterConsoleRestangular, ClusterMemberService, UtilsService) {
        var service = {
            createList: createList,
        };

        return service;


        function ClusterMemberList() {
            var self = this;

            // properties
            self.list = [];

            // methods
            self.addToList = addToList;
            self.clearList = clearList;
            self.loadData = loadData;
            self.setColors = setColors;
            self.setData = setData;
            self.sortMembers = sortMembers;
            self.resetMembersStats = resetMembersStats;
            self.prepareGaugeData = prepareGaugeData;
            self.prepareRadarData = prepareRadarData;
            self.prepareCombinedLineData = prepareCombinedLineData;

            /**
             * Prepare data to be used in gauge chart
             */
            function prepareGaugeData(metric, node, maxValues) {

                var value, value_complement;
                var values_arr = [];
                var exceededMaxValue;

                return self.list.map(function (member) {
                    value = Math.round(member.data.statistics.data[metric][node].values.last() * 100) / 100;
                    value_complement = maxValues[metric] - value;
                    values_arr = [value, value_complement];

                    exceededMaxValue = value_complement < 0;
                    value = UtilsService.formatLargeNumber(value);

                    var data = {
                        'name': member.data.name,
                        'label': metric.replace(/:/g, ': '),
                        'colors': [
                            member.data.color,
                            '#DDDDDD',
                        ],
                        'values': values_arr,
                        'valueLabel': value,
                        'exceededMaxValue': exceededMaxValue,
                    };
                    return data;
                });
            }

            /**
             * Prepare data to be used in radar chart
             */
            function prepareRadarData(metrics, node) {
                var radarData,
                    radarColors = [];

                radarData = self.list.map(function(member) {
                    radarColors.push(member.data.color);
                    return metrics.map(function(metric) {
                        return Math.round(member.data.statistics.data[metric][node].values.last() * 100) / 100;
                    });
                });

                return {
                    'data': radarData,
                    'colors': radarColors,
                };
            }

            function prepareCombinedLineData(metric, node) {
                var combinedLabels;
                var combinedValues = self.list.map(function(member) {
                    combinedLabels = member.data.statistics.data[metric][node].labels;
                    return member.data.statistics.data[metric][node].values;
                });

                return {
                    'values': combinedValues,
                    'labels': combinedLabels,
                };
            }

            /**
             * Force each statistics of each member in list to reload its statistics
             */
            function resetMembersStats(metric, node) {
                if (angular.isArray(metric)) {
                    self.list.forEach(function (clusterMember) {
                        clusterMember.data.statistics.resetStatistics(metric, node);
                    });
                }
                else {
                    self.list.forEach(function (clusterMember) {
                        clusterMember.data.statistics.loadData(clusterMember.data.address, metric, function() {
                            clusterMember.data.statistics.resetStatistic(metric, node);
                        });
                    });
                }
            }

            function addToList(item, memberColor) {
                self.list.push(ClusterMemberService.createObject(item, memberColor));
            }

            function clearList() {
                self.list.length = 0;
            }

            /**
             *
             * @param successCallback
             * @param errorCallback
             * @returns {*}
             */
            function loadData(settings, successCallback, errorCallback) {
                var restObj = ClusterConsoleRestangular
                    .one('restconf')
                    .one('operations')
                    .one('stats-reflector:get-cluster-members'),
                    restData = { input: {} };

                return restObj.customPOST(restData).then(
                    function (data) {
                        if (data) {
                            self.setData(data.output, settings);
                            (successCallback || angular.noop)();
                        }
                    },
                    function() {
                        console.warn('No cluster members data!');
                        (errorCallback || angular.noop)();
                    });
            }

            function setData(serverData, settings) {
                self.clearList();
                // sort by member-name
                var filteredList = self.sortMembers(serverData['cluster-members']);
                filteredList['cluster-members'].forEach(function (member, $index) {
                    self.addToList(member, settings.data['members-color'][$index]);
                });
            }

            function sortMembers(unsortedMbrs){
                var sortedMbrs = unsortedMbrs.sort(function (a, b) {
                    if (a['member-name'] > b['member-name']) { return 1; }
                    if (a['member-name'] < b['member-name']) { return -1; }
                    return 0;
                });
                return {'cluster-members': sortedMbrs};
            }

            function setColors(colors) {
                self.list.forEach(function (clusterMember, $index) {
                    clusterMember.setColor(colors[$index]);
                });
            }
        }

        function createList() {
            return new ClusterMemberList();
        }

    }

});
