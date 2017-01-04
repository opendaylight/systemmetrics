/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
    'app/clusterconsole/services/page.service',
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('PageListService', PageListService);

    PageListService.$inject = ['$filter', 'PageService', 'ClusterConsoleConstants'];

    function PageListService($filter, PageService, ClusterConsoleConstants) {
        var service = {
            createList: createList,
        };

        return service;


        function PageList(pageListName) {
            var self = this;

            /**
             * properties
             */
            self.data = {name: pageListName};
            self.list = [];
            self.selectedPage = 0;


            /**
             * methods
             */
            self.addToList = addToList;
            self.clearList = clearList;
            self.getArrayOfData = getArrayOfData;
            self.loadData = loadData;
            self.removeFromList = removeFromList;
            self.saveData = saveData;
            self.setData = setData;
            self.switchPage = switchPage;

            /**
             * Implementations
             */

            /**
             * Adds item into list
             * @param item
             */
            function addToList(item) {
                var page = $filter('filter')(self.list,
                    {
                        data: {
                            name: item.data.name,
                        },
                    }
                )[0];

                if (!page) {
                    self.list.push(item);
                }

                self.saveData();
            }

            /**
             * Clears list
             */
            function clearList() {
                self.list.length = 0;
                self.saveData();
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
             * Loads data from local storage
             */
            function loadData() {
                var storageList = JSON.parse(localStorage.getItem(self.data.name));

                if (storageList) {
                    if(storageList.length == 0 && self.data.name === ClusterConsoleConstants.LOCAL_STORAGE_DASHBOARD_PAGE_NAME) {
                        self.setData(ClusterConsoleConstants.DASHBOARD_DEFAULT_WIDGETS);
                    }
                    else {
                        self.setData(storageList);
                    }
                }
                else if(self.data.name === ClusterConsoleConstants.LOCAL_STORAGE_DASHBOARD_PAGE_NAME) {
                    self.setData(ClusterConsoleConstants.DASHBOARD_DEFAULT_WIDGETS);
                }
            }

            /**
             * Removes item from the list based on parameters
             * @param type
             * @param metric
             */
            function removeFromList(pageObject) {
                self.list.forEach(function (page, $index) {
                    if (page.data.name === pageObject.data.name) {
                        self.list.splice($index, 1);
                    }
                });

                self.saveData();
            }

            /**
             * Saves data into local storage
             */
            function saveData() {
                var self = this;

                try {
                    localStorage.setItem(
                        self.data.name,
                        JSON.stringify(self.getArrayOfData())
                    );
                } catch (e) {
                    console.error('Local storage save failed!', e);
                }

            }

            /**
             * Sets data to list
             * @param serverData
             */
            function setData(serverData) {
                self.clearList();
                serverData.forEach(function (page) {
                    self.addToList(PageService.createObject(page));
                });
            }

            /**
             * Prevent selecting last (+) page
             */
            function switchPage() {
                if(self.selectedPage && self.selectedPage === self.list.length-1) {
                    self.selectedPage--;
                }
            }
        }

        /**
         * Creates list object
         * @param name
         * @returns {PageList}
         */
        function createList(pageListName) {
            return new PageList(pageListName);
        }

    }

});
