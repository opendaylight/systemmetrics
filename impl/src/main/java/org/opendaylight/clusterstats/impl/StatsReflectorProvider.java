/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.StatsReflectorService;

public class StatsReflectorProvider implements AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(StatsReflectorProvider.class);

    private final DataBroker dataBroker;
    private final RpcProviderRegistry rpcProvider;

    private BindingAwareBroker.RpcRegistration<StatsReflectorService> rpcReg;

    public StatsReflectorProvider(final DataBroker dataBroker, final RpcProviderRegistry rpcProvider) {
        this.dataBroker = dataBroker;
        this.rpcProvider = rpcProvider;
    }

    /**
     * Method called when the blueprint container is created.
     */
    public void init() {
        LOG.info("StatsReflectorProvider Session Initiated");

        this.rpcReg = this.rpcProvider.addRpcImplementation(StatsReflectorService.class, new StatsReflectorServer());
    }

    /**
     * Method called when the blueprint container is destroyed.
     */
    @Override
    public void close() {
        LOG.info("StatsReflectorProvider Closed");
        this.rpcReg.close();
    }
}