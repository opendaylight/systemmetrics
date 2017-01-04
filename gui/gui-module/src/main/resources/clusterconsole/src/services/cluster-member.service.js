/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ClusterMemberService', ClusterMemberService);

    ClusterMemberService.$inject = ['StatisticsService'];

    function ClusterMemberService(StatisticsService) {
        var service = {
            createObject: createObject,
        };

        return service;


        function ClusterMember() {
            var self = this;

            // properties
            self.data = {
                name: '',
                address: '',
                voter: false,
                shards: [],
                color: '',
                statistics: StatisticsService.createObject(),
            };


            // methods
            self.getData = getData;
            self.setColor = setColor;
            self.setData = setData;

            function getData() {
                return self.data;
            }

            /**
             * Grouped setter
             *
             * @param name
             * @param value
             */
            function setData(serverData, memberColor) {
                self.data.name = serverData['member-name'];
                self.data.address = serverData['member-address'];
                self.data.voter = serverData.voter;
                self.data.shards = serverData['local-shards'];

                setColor(memberColor);
            }

            function setColor(color) {
                self.data.color = color;
            }
        }

        function createObject(data, memberColor) {
            var obj = new ClusterMember();

            if (data) {
                obj.setData(data, memberColor);
            }

            return obj;
        }
    }

});
