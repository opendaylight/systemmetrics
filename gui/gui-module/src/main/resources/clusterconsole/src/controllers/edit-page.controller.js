/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
define([], function () {
    'use strict';

    angular.module('app.clusterconsole').controller('EditPageController', EditPageController);

    EditPageController.$inject = ['$mdDialog', '$scope', 'PageService', 'page', 'ClusterConsoleConstants'];
    /* @ngInject */
    function EditPageController($mdDialog, $scope, PageService, page, ClusterConsoleConstants) {
        /**
         * Properties
         */
        var editPageCtrl = this;
        editPageCtrl.page = page;
        editPageCtrl.newName = angular.copy(editPageCtrl.page.data.name);
        editPageCtrl.constants = ClusterConsoleConstants;

        /**
         * Methods
         */
        editPageCtrl.closeDialog = closeDialog;
        editPageCtrl.save = save;


        /**
         * Implementations
         */

        /**
         * Closes dialog.
         */
        function closeDialog(){
            $mdDialog.cancel();
        }

        /**
         * Calls CC_PAGE_ADDED event and sends widget object as argument.
         */
        function save() {
            editPageCtrl.page.data.name = editPageCtrl.newName;
            $scope.broadcastFromRoot(editPageCtrl.constants.CC_SAVE_PAGE_LIST);
            closeDialog();
        }
    }
});
