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

    angular.module('app.clusterconsole').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$mdSidenav', '$scope', 'ClusterConsoleConstants'];

    function SettingsController($mdSidenav, $scope, ClusterConsoleConstants) {
        var vm = this;

        /**
         * controller properties
         */
        vm.settings = null;
        vm.settingsSrc = null;
        vm.constants = ClusterConsoleConstants;

        /**
         * controller methods
         */
        vm.init = init;
        vm.cancel = cancel;
        vm.applyValues = applyValues;

        /**
         * Apply new settings values
         * @param objectName
         * @param raiseEvents
         */
        function applyValues(objectName, raiseEvents) {
            var dataToSet = {};

            dataToSet[objectName] = vm.settings.data[objectName];

            vm.settingsSrc.setData(dataToSet);
            vm.settingsSrc.saveData();
            vm.settings = angular.copy(vm.settingsSrc);

            $mdSidenav('settingsPanel').close();

            if (raiseEvents) {
                applyChanges();
            }
        }


        /**
         * Cancel editing settings and hide sidenav
         */
        function cancel() {
            vm.settings = angular.copy(vm.settingsSrc);
            $mdSidenav('settingsPanel').close();
        }

        /**
         *
         */
        function init(settings) {
            vm.settingsSrc = settings;
            vm.settings = angular.copy(settings);
        }

        /**
         * Update charts after settings changed
         */
        function applyChanges() {
            $scope.$emit(vm.constants.CC_THRESHOLD_SETTINGS_CHANGED);
            $scope.$emit(vm.constants.CC_LOAD_STATISTICS);
            $scope.$emit(vm.constants.CC_MEMBERS_COLORS_SETTINGS_CHANGED);
        }
    }

});
