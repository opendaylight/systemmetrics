/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([
], function () {
    'use strict';

    angular.module('app.clusterconsole').service('SettingsService', SettingsService);

    SettingsService.$inject = ['ClusterConsoleConstants'];

    function SettingsService(ClusterConsoleConstants) {
        var service = {
            createSettings: createSettings,
        };

        return service;


        function AppSettings() {
            var self = this;

            /**
             * properties
             */
            self.data = {
                'polling-interval': 30,
                'auto-refresh': false,
                'shard-stats-threshold': {
                    'in-memory-journal-log-size': 0,
                    'last-applied': 0,
                    'last-index': 0,
                    'pending-tx-commit-queue-size': 0,
                    'commit-index': 0,
                    'replicated-to-all-index': 0,
                },
                'gauge-max-values': {
                    'CPU:Usage': 1,
                    'Heap:Memory:Usage': 512000000,
                    'NonHeap:Memory:Usage': 512000000,
                    'Current:Loaded:Classes': 100000,
                    'Total:Loaded:Classes': 100000,
                    'Live:Daemon:Thread:Count': 100000,
                    'Live:Thread:Count': 10000,
                    'Peak:Thread:Count': 10000,
                },
                'members-color': ['#97bbcd', '#FDB45C', '#803690', '#ff0000', '#fdb45c'],
            };



            /**
             * methods
             */
            self.loadData = loadData;
            self.saveData = saveData;
            self.setData = setData;

            /**
             * Implementations
             */

            /**
             * Loads settings from local storage
             */
            function loadData() {
                var storageSettings = JSON.parse(localStorage.getItem(ClusterConsoleConstants.LOCAL_STORAGE_SETTINGS));

                if (storageSettings){
                    setData(storageSettings);
                }
                else {
                    saveData();
                }
            }

            /**
             * Saves settings into local storage
             */
            function saveData() {
                try {
                    localStorage.setItem(ClusterConsoleConstants.LOCAL_STORAGE_SETTINGS, JSON.stringify(self.data));
                } catch (e) {
                    console.error('Local storage save failed!', e);
                }
            }

            function setData(data) {
                angular.forEach(data, function (value, key) {
                    if (key === 'shard-stats-threshold' || key === 'gauge-max-values') {
                        angular.forEach(data[key], function (value2, key2) {
                            self.data[key][key2] = data[key][key2];
                        });
                    }
                    else {
                        self.data[key] = data[key];
                    }
                });
            }
        }

        /**
         * Creates settings object
         * @param none
         * @returns {AppSettings}
         */
        function createSettings() {
            return new AppSettings();
        }
    }
});
