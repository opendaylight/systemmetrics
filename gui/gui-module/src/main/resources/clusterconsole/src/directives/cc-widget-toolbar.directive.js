/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angular'], function (angular) {
    'use strict';

    angular.module('app.clusterconsole').directive('ccWidgetToolbar', ccWidgetToolbar);

    /**
     * Widget toolbar containing widget title (if contains) and base action buttons for data refresh,
     * reload and remove widget
     * Needs widgetCtrl to be defined to gather necessary data
     */
    function ccWidgetToolbar() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                widgetCtrl: '='
            },
            controller: ccWidgetToolbarController,
            controllerAs: 'ccWidgetToolbarCtrl',
            bindToController: true,
            templateUrl: 'src/app/clusterconsole/views/directives/cc-widget-toolbar.tpl.html',
        };
    }

    ccWidgetToolbarController.$inject = ['$mdDialog', '$scope', '$timeout', 'ClusterConsoleConstants'];

    /**
     * Controller for {@link ccWidgetToolbar} directive
     * @param $mdDialog
     * @param $scope
     */
    function ccWidgetToolbarController($mdDialog, $scope, $timeout, ClusterConsoleConstants) {

        var ccWidgetToolbarCtrl = $scope.ccWidgetToolbarCtrl;

        ccWidgetToolbarCtrl.reload = reload;
        ccWidgetToolbarCtrl.removeWidget = removeWidget;
        ccWidgetToolbarCtrl.openEditWidgetDialog = openEditWidgetDialog;
        ccWidgetToolbarCtrl.resetData = resetData;
        ccWidgetToolbarCtrl.constants = ClusterConsoleConstants;

        /**
         * Reload button
         */
        function reload(){
            $scope.$emit(ccWidgetToolbarCtrl.constants.CC_LOAD_STATISTICS);
        }

        /**
         * Broadcast event for removing widget from the list if confirmed
         */
        function removeWidget() {
            var confirm = $mdDialog.confirm()
                .title('Delete widget')
                .textContent('Do you really want to delete this widget?')
                .ariaLabel('Delete widget')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                $scope.$emit(ccWidgetToolbarCtrl.constants.CC_WIDGET_REMOVED, {
                    widgetId: ccWidgetToolbarCtrl.widgetCtrl.widgetId,
                    page: ccWidgetToolbarCtrl.widgetCtrl.page,
                });
            });
        }

        /**
         * Reset statistic data
         * After reset reload statistics in STATS_REFLECTOR_REFRESH_INTERVAL milliseconds,
         * when Stats reflector has new data
         */
        function resetData(metric, node){
            var confirm = $mdDialog.confirm()
                .title('Reset data')
                .textContent('Do you really want to reset graph data?')
                .ariaLabel('Reset data')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function () {
                if(node === 'shard') {
                    ccWidgetToolbarCtrl.widgetCtrl.shardMemberListKeys.forEach(function (shardMember) {
                        ccWidgetToolbarCtrl.widgetCtrl.shardObject.data.members.list[shardMember].data.statistics.resetData(metric);
                    });
                }
                else {
                    ccWidgetToolbarCtrl.widgetCtrl.members.resetMembersStats(
                        ccWidgetToolbarCtrl.widgetCtrl.metric,
                        ccWidgetToolbarCtrl.widgetCtrl.node
                    );
                }
                $timeout(reload, ccWidgetToolbarCtrl.constants.STATS_REFLECTOR_REFRESH_INTERVAL);
            });
        }

        /**
         * Opens dialog for editing widgets
         */
        function openEditWidgetDialog() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'EditWidgetController',
                controllerAs: 'editWidgetCtrl',
                preserveScope: true,
                templateUrl: 'src/app/clusterconsole/views/edit-widget.tpl.html',
                parent: angular.element(document.body),
                locals: {
                    widgetId: ccWidgetToolbarCtrl.widgetCtrl.widgetId,
                    statisticsPage: ccWidgetToolbarCtrl.widgetCtrl.page,
                    widgetTypesSelector: ccWidgetToolbarCtrl.widgetCtrl.widgetTypes,
                    shardList: ccWidgetToolbarCtrl.widgetCtrl.shardsData,
                    parentScope: $scope,
                },
            });
        }
    }
});
