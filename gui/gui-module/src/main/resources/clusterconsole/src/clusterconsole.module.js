/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
define([
    'angular',
    'app/routingConfig',
    'Restangular',
    'angular-translate',
    'angular-translate-loader-partial',
    'angular-animate',
    'angular-aria',
    'ngMessages',
    'angular-chart',
    'angular-material-data-table',
    'colorpicker-module'
], function () {
    'use strict';

    angular.module('app.clusterconsole', [
        'ui.router.state',
        'app.core',
        'restangular',
        'pascalprecht.translate',
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngMessages',
        'chart.js',
        'md.data.table',
        'colorpicker.module',
    ]);

    angular.module('app.clusterconsole')
        .config(ClusterConsoleConfig)
        .constant('ClusterConsoleConstants', ClusterConsoleConstants());


    function ClusterConsoleConfig($stateProvider, $mdThemingProvider, $translatePartialLoaderProvider,
                                  NavHelperProvider, ChartJsProvider) {

        //$translatePartialLoaderProvider.addPart('app/clusterconsole/assets/data/locale');


        ChartJsProvider.setOptions({
            chartColors: ['#97bbcd', '#dcdcdc', '#803690', '#46bfbd', '#fdb45c'],
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue');

        NavHelperProvider.addControllerUrl('app/clusterconsole/controllers/clusterconsole.controller');
        NavHelperProvider.addControllerUrl('app/clusterconsole/controllers/statistics.controller');
        NavHelperProvider.addControllerUrl('app/clusterconsole/controllers/settings.controller');

        NavHelperProvider.addToMenu('clusterconsole', {
            link: '#/clusterconsole/index',
            active: 'main.clusterconsole',
            title: 'Cluster Console',
            icon: 'icon-rocket',
            page: {
                title: 'Cluster Console',
                description: 'Cluster Console',
            },
        });

        var access = routingConfig.accessLevels;
        $stateProvider.state('main.clusterconsole', {
            url: 'clusterconsole',
            abstract: true,
            views: {
                content: {
                    templateUrl: 'src/app/clusterconsole/views/root.tpl.html',
                },
            },
        });

        $stateProvider.state('main.clusterconsole.index', {
            url: '/index',
            abstract: true,
            access: access.admin,
            views: {
                '': {
                    templateUrl: 'src/app/clusterconsole/views/index.tpl.html',
                },
            },
        });

        $stateProvider.state('main.clusterconsole.index.dashboard', {
            url: '',
            access: access.admin,
            templateUrl: 'src/app/clusterconsole/views/index.tpl.html',
            views: {
                '': {
                    controller: 'DashboardController',
                    controllerAs: 'dboard',
                    templateUrl: 'src/app/clusterconsole/views/dashboard.tpl.html',
                },
            },
        });

        $stateProvider.state('main.clusterconsole.index.statistics', {
            url: '/statistics',
            access: access.admin,
            templateUrl: 'src/app/clusterconsole/views/index.tpl.html',
            views: {
                '': {
                    controller: 'StatisticsController',
                    controllerAs: 'stats',
                    templateUrl: 'src/app/clusterconsole/views/statistics.tpl.html',
                },
            },
        });

        $stateProvider.state('main.clusterconsole.index.shard-manager', {
            url: '/shards/:shard',
            access: access.admin,
            templateUrl: 'src/app/clusterconsole/views/index.tpl.html',
            views: {
                '': {
                    controller: 'ShardManagerController',
                    controllerAs: 'shardManager',
                    templateUrl: 'src/app/clusterconsole/views/shard-manager.tpl.html',
                },
            },
        });
    }

    function ClusterConsoleConstants() {
        return  {
            CLUSTER_MEMBER_COLOR: ['#97bbcd', '#FDB45C', '#803690', '#ff0000', '#fdb45c'],
            LOCAL_STORAGE_STATS_PAGE_NAME: 'cluster_console_statistics_page_list',
            LOCAL_STORAGE_DASHBOARD_PAGE_NAME: 'cluster_console_dashboard_page_list',
            LOCAL_STORAGE_SETTINGS: 'cluster_console_settings',
            MEMBER_METRIC_NAMES: {
                'controller': [
                    'CPU:Usage',
                    'Heap:Memory:Usage',
                    'NonHeap:Memory:Usage',
                    'Current:Loaded:Classes',
                    'Total:Loaded:Classes',
                    'Live:Daemon:Thread:Count',
                    'Live:Thread:Count',
                    'Peak:Thread:Count',
                ],
                'machine': ['CPU:Usage'],
                'shard': [
                    'last-index',
                    'commit-index',
                    'pending-tx-commit-queue-size',
                    'in-memory-journal-log-size',
                    'replicated-to-all-index',
                    'timestamp',
                    'last-applied',
                ],
            },
            WIDGET_TYPES: {
                'statistics': ['Combined', 'Individual'],
                'dashboard': ['Gauge', 'Combined', 'Individual'],
            },
            GAUGE_MAX_VALUES: {
                'CPU:Usage': 1,
                'Heap:Memory:Usage': 512000000,
                'NonHeap:Memory:Usage': 512000000,
                'Current:Loaded:Classes': 100000,
                'Total:Loaded:Classes': 100000,
                'Live:Daemon:Thread:Count': 100000,
                'Live:Thread:Count': 10000,
                'Peak:Thread:Count': 10000,
            },
            DASHBOARD_DEFAULT_WIDGETS: [
                {
                    'name':'CPU',
                    'widget-list':{
                        'list':[
                            {
                                'data':{
                                    'id':'xt4mescrzy4x6cl0izfr',
                                    'type':'gauge',
                                    'metric-names':[
                                        'CPU:Usage'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            },
                            {
                                'data':{
                                    'id':'9aygq4z93bhv4cv9ara4i',
                                    'type':'gauge',
                                    'metric-names':[
                                        'CPU:Usage'
                                    ],
                                    'metric-type':'machine',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            }
                        ]
                    }
                },
                {
                    'name':'Memory',
                    'widget-list':{
                        'list':[
                            {
                                'data':{
                                    'id':'k5igfanscc24ldk4vx6r',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Heap:Memory:Usage'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            },
                            {
                                'data':{
                                    'id':'ydpqfiy55rpxkwn3cv7vi',
                                    'type':'gauge',
                                    'metric-names':[
                                        'NonHeap:Memory:Usage'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            }
                        ]
                    }
                },
                {
                    'name':'Classes',
                    'widget-list':{
                        'list':[
                            {
                                'data':{
                                    'id':'brsmud1lb254ry3c8fr',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Current:Loaded:Classes'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            },
                            {
                                'data':{
                                    'id':'wk1ka8pmbg5z2os3v7vi',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Total:Loaded:Classes'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            }
                        ]
                    }
                },
                {
                    'name':'Threads',
                    'widget-list':{
                        'list':[
                            {
                                'data':{
                                    'id':'u805dy0tj4u36vbwqaor',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Live:Daemon:Thread:Count'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            },
                            {
                                'data':{
                                    'id':'67lnn6w0qpm09ivish5mi',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Live:Thread:Count'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                },
                            },
                            {
                                'data':{
                                    'id':'0xk3htijqrp1mwqwr8uxr',
                                    'type':'gauge',
                                    'metric-names':[
                                        'Peak:Thread:Count'
                                    ],
                                    'metric-type':'controller',
                                    'shard':{
                                        'name':'',
                                        'status':''
                                    }
                                }
                            }
                        ]
                    }
                }
            ],
            STATS_REFLECTOR_REFRESH_INTERVAL: 5000,
            CC_LOAD_STATISTICS: 'CC_LOAD_STATISTICS',
            CC_MEMBERS_COLORS_SETTINGS_CHANGED: 'CC_MEMBERS_COLORS_SETTINGS_CHANGED',
            CC_RESET_ALL_STATISTICS_DATA: 'CC_RESET_ALL_STATISTICS_DATA',
            CC_THRESHOLD_SETTINGS_CHANGED: 'CC_THRESHOLD_SETTINGS_CHANGED',
            CC_STATISTICS_LOADED: 'CC_STATISTICS_LOADED',
            CC_PAGE_ADDED: 'CC_PAGE_ADDED',
            CC_SAVE_PAGE_LIST: 'CC_SAVE_PAGE_LIST',
            CC_WIDGET_REMOVED: 'CC_WIDGET_REMOVED',
            CC_WIDGET_EDITED: 'CC_WIDGET_EDITED',
        };
    }
});
