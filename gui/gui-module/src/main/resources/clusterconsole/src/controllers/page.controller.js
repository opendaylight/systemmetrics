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

    angular.module('app.clusterconsole').controller('PageController', PageController);

    PageController.$inject = ['$mdDialog', '$scope', 'ClusterConsoleConstants'];

    function PageController($mdDialog, $scope, ClusterConsoleConstants) {
        var pageCtrl = this;

        /**
         * controller properties
         */
        pageCtrl.widgetTypes = null;
        pageCtrl.shardList = null;
        pageCtrl.constants = ClusterConsoleConstants;

        /**
         * controller methods
         */
        pageCtrl.clearWidgetList = clearWidgetList;
        pageCtrl.init = init;
        pageCtrl.openAddWidgetDialog = openAddWidgetDialog;
        pageCtrl.resetAllStatisticsData = resetAllStatisticsData;

        /**
         * Listening on CC_WIDGET_REMOVED event.
         * On event removes the widget from widget-list by parameters.
         */
        $scope.$on(pageCtrl.constants.CC_WIDGET_REMOVED, function (event, args) {
            args.page.data['widget-list'].removeFromList(args.widgetId);
            $scope.broadcastFromRoot(pageCtrl.constants.CC_SAVE_PAGE_LIST);
        });

        /**
         * Listening on CC_WIDGET_EDITED event.
         * On event edits the widget in widget-list
         */
        $scope.$on(pageCtrl.constants.CC_WIDGET_EDITED, function (event, args) {
            args.page.data['widget-list'].editWidget(args.widget);
            $scope.broadcastFromRoot(pageCtrl.constants.CC_SAVE_PAGE_LIST);
        });

        /**
         * Implementations
         */

        /**
         * Clears widget list for specifica page
         * @param listName
         */
        function clearWidgetList(page) {
            var confirm = $mdDialog.confirm()
                .title('Delete widgets')
                .textContent('Do you really want to delete all widgets?')
                .ariaLabel('Delete widgets')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                page.data['widget-list'].clearList();
                $scope.broadcastFromRoot(pageCtrl.constants.CC_SAVE_PAGE_LIST);
            });
        }

        function init(widgetTypes, shardList) {
            pageCtrl.widgetTypes = widgetTypes;
            pageCtrl.shardList = shardList;
        }
        /**
         * Opens dialog for adding widgets
         * @param statisticsPage
         */
        function openAddWidgetDialog(statisticsPage) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'AddWidgetController',
                controllerAs: 'addWidgetCtrl',
                preserveScope: true,
                templateUrl: 'src/app/clusterconsole/views/add-widget.tpl.html',
                parent: angular.element(document.body),
                locals: {
                    statisticsPage: statisticsPage,
                    widgetTypesSelector: pageCtrl.widgetTypes,
                    shardList: pageCtrl.shardList,
                    broadcastFromRoot: $scope.broadcastFromRoot,
                },
            });
        }

        /**
         * Remove all statistics data
         */
        function resetAllStatisticsData() {
            var confirm = $mdDialog.confirm()
                .title('Reset data')
                .textContent('Do you really want to reset graph data?')
                .ariaLabel('Reset data')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                $scope.broadcastFromRoot(pageCtrl.constants.CC_RESET_ALL_STATISTICS_DATA);
            });
        }
    }

});
