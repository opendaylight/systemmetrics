/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('WidgetService', WidgetService);

    WidgetService.$inject = [];

    function WidgetService() {
        var service = {
            createObject: createObject,
        };

        return service;


        function Widget() {
            var self = this;

            // properties
            self.data = {
                id: Math.random().toString(36).substring(7),
                type: '',
                'metric-names': [],
                'metric-type': '',
                'shard': {
                    name: '',
                    status: '',
                },
            };


            // methods
            self.setData = setData;
            self.getData = getData;

            function getData() {
                return self.data;
            }

            /**
             * Grouped setter
             *
             * @param name
             * @param value
             */
            function setData(widgetData) {
                self.data.id = widgetData.id;
                self.data.type = widgetData.type.toLowerCase();
                self.data['metric-names'] = widgetData['metric-names'];
                self.data['metric-type'] = widgetData['metric-type'];
                self.data.shard.name = widgetData.shard.name;
                self.data.shard.status = widgetData.shard.status;
            }
        }

        function createObject(data) {
            var obj = new Widget();

            if (data) {
                obj.setData(data);
            }

            return obj;
        }
    }

});
