/*
 * Copyright (c) 2016 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([], function () {
    'use strict';

    angular.module('app.clusterconsole').service('UtilsService', UtilsService);

    function UtilsService() {
        var service = {
            init: init,
            formatLargeNumber: formatLargeNumber,
        };

        return service;

        /**
         * Initialization
         * - add last() function to array prototype
         * - add equals() function to array prototype
         */
        function init() {
            /**
             * Returns last item from array
             */
            if (!Array.prototype.last){
                Array.prototype.last = function(){
                    return this[this.length - 1];
                };
            }
        }

        /**
         * Add metric suffix to the value
         * @param  {value}
         * @return {value}
         */
        function formatLargeNumber(value) {
            if(!isNaN(value)) {
                if(value < 1000) {
                    value += '';
                }
                else if(value < 1000000) {
                    value /= 1000;
                    value = Math.round(value * 10) / 10;
                    value += 'k';
                }
                else if(value < 1000000000){
                    value /= 1000000;
                    value = Math.round(value * 10) / 10;
                    value += 'M';
                }
                else if(value < 1000000000000){
                    value /= 1000000000;
                    value = Math.round(value * 10) / 10;
                    value += 'G';
                }
                else {
                    value /= 1000000000000;
                    value = Math.round(value * 10) / 10;
                    value += 'T';
                }
            }

            return value;
        }
    }

});
