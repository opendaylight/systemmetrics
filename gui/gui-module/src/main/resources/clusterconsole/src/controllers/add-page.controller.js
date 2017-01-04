/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
define([], function () {
    'use strict';

    angular.module('app.clusterconsole').controller('AddPageController', AddPageController);

    AddPageController.$inject = ['$mdDialog', '$scope', 'PageService', 'ClusterConsoleConstants'];
    /* @ngInject */
    function AddPageController($mdDialog, $scope, PageService, ClusterConsoleConstants) {
        /**
         * Properties
         */
        var addPageCtrl = this;
        addPageCtrl.page = PageService.createObject();
        addPageCtrl.constants = ClusterConsoleConstants;

        /**
         * Methods
         */
        addPageCtrl.closeDialog = closeDialog;
        addPageCtrl.save = save;


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
            $scope.broadcastFromRoot(addPageCtrl.constants.CC_PAGE_ADDED, { page: addPageCtrl.page });
            closeDialog();
        }
    }
});
