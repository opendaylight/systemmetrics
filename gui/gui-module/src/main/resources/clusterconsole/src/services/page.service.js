/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('PageService', PageService);

    PageService.$inject = ['WidgetListService'];

    function PageService(WidgetListService) {
        var service = {
            createObject: createObject,
        };

        return service;


        function Page() {
            var self = this;

            // properties
            self.data = {
                name: '',
                'widget-list': WidgetListService.createList(),
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
            function setData(pageData) {
                if(pageData.name) {
                    self.data.name = pageData.name;
                }

                if (pageData['widget-list']) {
                    self.data['widget-list'].setData(pageData['widget-list']);
                }
            }
        }

        function createObject(data) {
            var obj = new Page();

            if (data) {
                obj.setData(data);
            }

            return obj;
        }
    }

});
