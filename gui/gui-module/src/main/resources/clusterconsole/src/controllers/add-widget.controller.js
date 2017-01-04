/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
define([], function () {
    'use strict';

    angular.module('app.clusterconsole').controller('AddWidgetController', AddWidgetController);

    AddWidgetController.$inject = ['$scope', '$filter', '$mdDialog', 'broadcastFromRoot', 'shardList', 'statisticsPage',
        'widgetTypesSelector', 'ClusterConsoleConstants', 'WidgetService'];
    /* @ngInject */
    function AddWidgetController($scope, $filter, $mdDialog, broadcastFromRoot, shardList, statisticsPage,
                                 widgetTypesSelector, ClusterConsoleConstants, WidgetService) {
        /**
         * Properties
         */
        var addWidgetCtrl = this;

        addWidgetCtrl.widgetTypesSelector = widgetTypesSelector;
        addWidgetCtrl.statisticsPage = statisticsPage;
        addWidgetCtrl.memberMetricNames = ClusterConsoleConstants.MEMBER_METRIC_NAMES;
        addWidgetCtrl.memberMetricTypes = Object.keys(addWidgetCtrl.memberMetricNames);
        addWidgetCtrl.widget = WidgetService.createObject();
        addWidgetCtrl.widgetTypes = ClusterConsoleConstants.WIDGET_TYPES[addWidgetCtrl.widgetTypesSelector];
        addWidgetCtrl.showPrevieWidget = '';
        addWidgetCtrl.shardList = shardList;
        addWidgetCtrl.metricsSelectionOpened = false;
        addWidgetCtrl.widgetExists = false;
        addWidgetCtrl.constants = ClusterConsoleConstants;

        addWidgetCtrl.widgetShardIndex = '';
        addWidgetCtrl.widgetMetricName = '';

        /**
         * Methods
         */
        addWidgetCtrl.closeDialog = closeDialog;
        addWidgetCtrl.save = save;
        addWidgetCtrl.broadcastFromRoot = broadcastFromRoot;
        addWidgetCtrl.initWidgetShard = initWidgetShard;
        addWidgetCtrl.updateWidgetShard = updateWidgetShard;
        addWidgetCtrl.updateWidgetMetricName = updateWidgetMetricName;
        addWidgetCtrl.initShardMetricName = initShardMetricName;
        addWidgetCtrl.resetValidity = resetValidity;

        /**
         * Filters for
         * @returns {*}
         */
        // function filterMemberMetricTypes() {
        //     if (addWidgetCtrl.widgetTypesSelector === 'dashboard') {
        //         return $filter('filter')(Object.keys(addWidgetCtrl.memberMetricNames), '!shard');
        //     }

        //     return Object.keys(addWidgetCtrl.memberMetricNames);
        // }

        /**
         * Init metric name after metric type change
         */
        function initShardMetricName() {
            addWidgetCtrl.widget.data['metric-names'] = [];
            addWidgetCtrl.widgetMetricName = '';
        }

        /**
         * Update widget metric name after metric name change
         */
        function updateWidgetMetricName() {
            addWidgetCtrl.widget.data['metric-names'] = [addWidgetCtrl.widgetMetricName];
        }

        /**
         * Update widget shard after widgetShardIndex change
         */
        function updateWidgetShard() {
            if (addWidgetCtrl.widgetShardIndex > -1) {
                addWidgetCtrl.widget.data.shard = {
                    name: addWidgetCtrl.shardList.list[addWidgetCtrl.widgetShardIndex].data.name,
                    status: addWidgetCtrl.shardList.list[addWidgetCtrl.widgetShardIndex].data.status
                };
            }
        }


        /**
         * Change widget shart object after metric type select change
         */
        function initWidgetShard() {
            if (addWidgetCtrl.widget.data['metric-type'] !== 'shard') {
                addWidgetCtrl.widgetShardIndex = null;
                addWidgetCtrl.widget.data.shard = { name: '', status: ''};
            }
        }


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
         * Calls WIDGET_ADDED event and sends widget object as argument.
         */
        function save() {
            var widgetExists = addWidgetCtrl.statisticsPage.data['widget-list'].widgetExists(addWidgetCtrl.widget);

            if(widgetExists) {
                $scope.addWidgetDialogForm.metricName.$setValidity('unique', false);
            }
            else {
                saveWidget();
            }

            function saveWidget() {
                addWidgetCtrl.widgetExists = false;
                addWidgetCtrl.statisticsPage.data['widget-list'].addObjectToList(addWidgetCtrl.widget);
                addWidgetCtrl.broadcastFromRoot(addWidgetCtrl.constants.CC_SAVE_PAGE_LIST);
                closeDialog();
            }
        }

        function resetValidity() {
            $scope.addWidgetDialogForm.metricName.$setValidity('unique', true);
        }
    }
});
