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

    angular.module('app.clusterconsole').controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$mdDialog', '$scope', 'ClusterConsoleConstants', 'PageListService'];

    function DashboardController($mdDialog, $scope, ClusterConsoleConstants, PageListService) {
        var dboard = this;

        /**
         * controller properties
         */
        dboard.dashboardPageList = PageListService.createList(
            ClusterConsoleConstants.LOCAL_STORAGE_DASHBOARD_PAGE_NAME
        );
        dboard.constants = ClusterConsoleConstants;
        dboard.shardsTableOrder = 'data.name';
        dboard.membersTableOrder = 'data.name';

        /**
         * controller methods
         */
        dboard.openAddPageDialog = openAddPageDialog;
        dboard.openEditPageDialog = openEditPageDialog;
        dboard.removePage = removePage;

        init();

        /**
         * Implementations
         */


        /**
         * Initialization - loads data for pages
         */
        function init() {
            dboard.dashboardPageList.loadData();

            $scope.$on(dboard.constants.CC_PAGE_ADDED, function (event, args) {
                dboard.dashboardPageList.addToList(args.page);
            });

            $scope.$on(dboard.constants.CC_SAVE_PAGE_LIST, function () {
                dboard.dashboardPageList.saveData();
            });
        }

        function openAddPageDialog() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'AddPageController',
                controllerAs: 'addPageCtrl',
                preserveScope: true,
                templateUrl: 'src/app/clusterconsole/views/add-page.tpl.html',
                parent: angular.element(document.body),
                scope: $scope,
                locals: {
                },
            });
        }

        function openEditPageDialog(page) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'EditPageController',
                controllerAs: 'editPageCtrl',
                preserveScope: true,
                templateUrl: 'src/app/clusterconsole/views/edit-page.tpl.html',
                parent: angular.element(document.body),
                scope: $scope,
                locals: {
                    page: page,
                },
            });
        }

        function removePage(page) {
            var confirm = $mdDialog.confirm()
                .title('Delete page')
                .textContent('Do you really want to remove this page?')
                .ariaLabel('Delete page')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                dboard.dashboardPageList.switchPage();
                dboard.dashboardPageList.removeFromList(page);
            });
        }
    }

});
