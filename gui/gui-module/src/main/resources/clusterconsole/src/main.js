/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
require.config({
    paths: {
        'angular-animate': 'app/clusterconsole/vendor/angular-animate/angular-animate.min',
        'angular-aria': 'app/clusterconsole/vendor/angular-aria/angular-aria.min',
        'angular-chart': 'app/clusterconsole/vendor/angular-chart.js/dist/angular-chart.min',
        'chart': 'app/clusterconsole/vendor/chart.js/dist/Chart.min',
        'angular-material-data-table': 'app/clusterconsole/vendor/angular-material-data-table/dist/md-data-table.min',
        'ngMessages': '../vendor/angular-messages/angular-messages.min',
        //'angular-bind-notifier': 'app/clusterconsole/vendor/angular-bind-notifier/dist/angular-bind-notifier.min',
        'colorpicker-module': 'app/clusterconsole/vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min',
    },

    shim: {
        'angular-material': ['angular'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-ui-grid': ['angular'],
        'chart.js': ['angular', 'chart'],
        'angular-material-data-table': ['angular', 'ngMaterial'],
        'colorpicker-module': ['angular']
    },

});

define(['app/clusterconsole/clusterconsole.module']);
