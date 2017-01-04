/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/widget.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('WidgetListService', WidgetListService);

    WidgetListService.$inject = ['$filter', 'WidgetService'];

    function WidgetListService($filter, WidgetService) {
        var service = {
            createList: createList,
        };

        return service;


        function WidgetList(name) {
            var self = this;

            /**
             * properties
             */
            self.list = [];


            /**
             * methods
             */
            self.addObjectToList = addObjectToList;
            self.addToList = addToList;
            self.clearList = clearList;
            self.editWidget = editWidget;
            self.getArrayOfData = getArrayOfData;
            self.getWidget = getWidget;
            self.removeFromList = removeFromList;
            self.setData = setData;
            self.widgetExists = widgetExists;

            /**
             * Implementations
             */

            function addObjectToList(object) {
                self.list.push(object);
            }

            /**
             * Adds item into list
             * @param item
             */
            function addToList(item) {
                self.list.push(WidgetService.createObject(item));
            }

            /**
             * Clears list
             */
            function clearList() {
                self.list.length = 0;
            }

            /**
             * Edits Widget by ID
             * @param  {Widget} widget
             */
            function editWidget(widget) {
                var widgetObj = getWidget(widget.data.id);
                self.list[self.list.indexOf(widgetObj)] = widget;
            }

            /**
             * Returns array of .data properties of the list
             * @returns {Array}
             */
            function getArrayOfData() {
                return self.list.map(function (item) {
                    return item.data;
                });
            }

            /**
             * Returns Widget object from list by ID
             * @param  {string} widgetId
             * @return {Widget}
             */
            function getWidget(widgetId) {
                return $filter('filter')(self.list, {
                    data: {
                        id: widgetId
                    }
                })[0];
            }

            /**
             * Removes item from the list based on parameters
             * @param type
             * @param metric
             */
            function removeFromList(id) {
                self.list.forEach(function (elem, $index) {
                    if (elem.data.id === id) {
                        self.list.splice($index, 1);
                    }
                });
            }

            /**
             * Sets data to list
             * @param serverData
             */
            function setData(serverData) {
                self.clearList();
                serverData.list.forEach(function (widget) {
                    self.addToList(widget.data);
                });
            }

            /**
             * Check, if widget exists in widget array
             * @param  {Widget}  widgetObj
             * @return {Boolean}
             */
            function widgetExists(widgetObj) {
                return self.list.some(function(widget) {
                    return Object.keys(widget.data).every(function(key) {
                        // skip id comparision
                        if(key === 'id') {
                            return true;
                        }

                        // compare arrays
                        if(angular.isArray(widget.data[key])) {
                            // prevent sorting existing widget array
                            var list = angular.copy(widget.data[key]);

                            return angular.equals(list.sort(), widgetObj.data[key].sort());
                        }
                        // compare objects, strings
                        else {
                            return angular.equals(widget.data[key], widgetObj.data[key]);
                        }
                    });
                });
            }
        }

        /**
         * Creates list object
         * @param name
         * @returns {WidgetList}
         */
        function createList() {
            return new WidgetList();
        }

    }

});
