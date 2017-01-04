/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
define([], function () {
    'use strict';

    angular.module('app.clusterconsole').controller('EditWidgetController', EditWidgetController);

    EditWidgetController.$inject = ['$scope', '$mdDialog', 'ClusterConsoleConstants', 'widgetId', 'statisticsPage', 'widgetTypesSelector', 'shardList', 'parentScope'];
    /* @ngInject */
    function EditWidgetController($scope, $mdDialog, ClusterConsoleConstants, widgetId, statisticsPage, widgetTypesSelector, shardList, parentScope) {
        /**
         * Properties
         */
        var editWidgetCtrl = this;

        editWidgetCtrl.widgetTypesSelector = widgetTypesSelector;
        editWidgetCtrl.statisticsPage = statisticsPage;
        editWidgetCtrl.parentScope = parentScope;
        editWidgetCtrl.memberMetricNames = ClusterConsoleConstants.MEMBER_METRIC_NAMES;
        editWidgetCtrl.memberMetricTypes = Object.keys(editWidgetCtrl.memberMetricNames);
        editWidgetCtrl.widgetId = widgetId;
        editWidgetCtrl.widgetOld = editWidgetCtrl.statisticsPage.data['widget-list'].getWidget(editWidgetCtrl.widgetId);
        editWidgetCtrl.widget = angular.copy(editWidgetCtrl.widgetOld);
        editWidgetCtrl.widgetTypes = ClusterConsoleConstants.WIDGET_TYPES[editWidgetCtrl.widgetTypesSelector];
        editWidgetCtrl.showPrevieWidget = '';
        editWidgetCtrl.shardList = shardList;
        editWidgetCtrl.metricsSelectionOpened = false;
        editWidgetCtrl.widgetExists = false;
        editWidgetCtrl.constants = ClusterConsoleConstants;

        /**
         * Methods
         */
        editWidgetCtrl.closeDialog = closeDialog;
        editWidgetCtrl.save = save;
        editWidgetCtrl.init = init;
        editWidgetCtrl.initWidgetShard = initWidgetShard;
        editWidgetCtrl.updateWidgetShard = updateWidgetShard;
        editWidgetCtrl.updateWidgetMetricName = updateWidgetMetricName;
        editWidgetCtrl.resetWidgetShard = resetWidgetShard;
        editWidgetCtrl.initShardMetricName = initShardMetricName;
        editWidgetCtrl.resetValidity = resetValidity;

        init();

        function init() {
            editWidgetCtrl.widgetShardIndex = editWidgetCtrl.shardList.getShardIndex(editWidgetCtrl.widget.data.shard);
            editWidgetCtrl.widgetMetricName = editWidgetCtrl.widget.data['metric-names'][0];
        }

        /**
         * Init metric name after metric type change
         */
        function initShardMetricName() {
            editWidgetCtrl.widget.data['metric-names'] = [];
            editWidgetCtrl.widgetMetricName = '';
        }

        /**
         * Update widget metric name after metric name change
         */
        function updateWidgetMetricName() {
            editWidgetCtrl.widget.data['metric-names'] = [editWidgetCtrl.widgetMetricName];
        }

        /**
         * Update widget shard after widgetShardIndex change
         */
        function updateWidgetShard() {
            if (editWidgetCtrl.widgetShardIndex > -1) {
                editWidgetCtrl.widget.data.shard = {
                    name: editWidgetCtrl.shardList.list[editWidgetCtrl.widgetShardIndex].data.name,
                    status: editWidgetCtrl.shardList.list[editWidgetCtrl.widgetShardIndex].data.status
                };
            }
        }


        /**
         * Change widget shart object after metric type select change
         */
        function initWidgetShard() {
            if (editWidgetCtrl.widget.data['metric-type'] !== 'shard') {
                editWidgetCtrl.widgetShardIndex = null;
                editWidgetCtrl.widget.data.shard = { name: '', status: ''};
            }
        }

        /**
         * Reset widget shard object after widget type select change
         */
        function resetWidgetShard() {
            if(editWidgetCtrl.widget.data.type === 'gauge') {
                editWidgetCtrl.widget.data['metric-type'] = null;
                initWidgetShard();
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
            var widgetExists = editWidgetCtrl.statisticsPage.data['widget-list'].widgetExists(editWidgetCtrl.widget);

            if(widgetExists) {
                $scope.editWidgetDialogForm.metricName.$setValidity('unique', false);
            }
            else {
                saveWidget();
            }

            function saveWidget() {
                editWidgetCtrl.widgetExists = false;
                editWidgetCtrl.parentScope.$emit(editWidgetCtrl.constants.CC_WIDGET_EDITED, {
                    'widget' : editWidgetCtrl.widget,
                    'page' : editWidgetCtrl.statisticsPage,
                });
                closeDialog();
            }
        }

        function resetValidity() {
            $scope.editWidgetDialogForm.metricName.$setValidity('unique', true);
        }
    }
});
