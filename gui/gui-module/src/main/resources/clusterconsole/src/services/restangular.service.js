/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('ClusterConsoleRestangular', ClusterConsoleRestangular);

    ClusterConsoleRestangular.$inject = ['Restangular', 'ENV'];

    function ClusterConsoleRestangular(Restangular, ENV) {

        return Restangular.withConfig(function (RestangularConfig) {
            RestangularConfig.setBaseUrl(ENV.getBaseURL('MD_SAL'));
            RestangularConfig.setRequestInterceptor(function (elem, operation) {
                if (operation === 'post' && isEmptyElement(elem)) {
                    return null;
                } else {
                    return elem;
                }
            });
        });

        function isEmptyElement(element) {
            return element.hasOwnProperty('id') && element.id === undefined;
        }
    }
});
