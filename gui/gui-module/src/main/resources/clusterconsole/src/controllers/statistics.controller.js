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

    angular.module('app.clusterconsole').controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['$mdDialog', '$scope', 'ClusterConsoleConstants', 'PageListService'];

    function StatisticsController($mdDialog, $scope, ClusterConsoleConstants, PageListService) {
        var stats = this;

        /**
         * controller properties
         */
        stats.statisticsPageList = PageListService.createList(ClusterConsoleConstants.LOCAL_STORAGE_STATS_PAGE_NAME);

        /**
         * controller methods
         */
        stats.openAddPageDialog = openAddPageDialog;
        stats.openEditPageDialog = openEditPageDialog;
        stats.removePage = removePage;
        stats.constants = ClusterConsoleConstants;

        init();

        /**
         * Implementations
         */

        /**
         * Initialization - loads data for pages
         */
        function init() {
            stats.statisticsPageList.loadData();

            $scope.$on(stats.constants.CC_PAGE_ADDED, function (event, args) {
                stats.statisticsPageList.addToList(args.page);
            });

            $scope.$on(stats.constants.CC_SAVE_PAGE_LIST, function () {
                stats.statisticsPageList.saveData();
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
                stats.statisticsPageList.switchPage();
                stats.statisticsPageList.removeFromList(page);
            });
        }
    }

});
