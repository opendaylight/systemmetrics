/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import com.google.common.base.Preconditions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.inet.types.rev130715.IpAddress;

import javax.annotation.Nonnull;

/**
 * Factory class for generating valid URLs to various statistics endpoints which are supported by stats reflector
 */
public class RestUrlFactory {

    private static final Logger LOG = LoggerFactory.getLogger(RestUrlFactory.class);

    private static final String CLUSTER_MEMBER_IP = "localhost";

    private static final String TSDR_URL_FORMAT = "http://%s:8181/tsdr/metrics/query?%s";
    private static final String TSDR_QUERY_FORMAT = "tsdrkey=%s&from=%s";

    private static final String CLUSTER_MEMBER_FORMAT = "http://%s:8181/jolokia/read/org.opendaylight.controller:" +
            "type=RemoteRpcBroker,name=RemoteRpcRegistry";

    private static final String SHARD_MANAGER_FORMAT = "http://%s:8181/jolokia/read/org.opendaylight.controller:" +
            "Category=ShardManager,name=shard-manager-operational,type=DistributedOperationalDatastore";

    private static final String GENERAL_RUNTIME_INFO_FORMAT = "http://%s:8181/jolokia/read/org.opendaylight.controller:" +
            "name=GeneralRuntimeInfo,type=%s";

    private static final String SHARD_URL_FORMAT = "http://%s:8181/jolokia/read/org.opendaylight.controller:" +
            "Category=Shards,name=%s,type=%s";

    private RestUrlFactory() {}

    /**
     * Generate a URL for a TSDR REST endpoint.
     *
     * @param clusterMember IP Address of the cluster member where TSDR requests will be made
     * @param tsdrKey The TSDR key which specifies what data will be returned by TSDR
     * @param lastRequestTime The last time a request was made for this
     * @return A well-formed TSDR URL suitable for making HTTP requests towards
     */
    @Nonnull
    public static String getTsdrUrl(@Nonnull final IpAddress clusterMember,
                                    @Nonnull final String tsdrKey,
                                    @Nonnull final Long lastRequestTime) {

        Preconditions.checkNotNull(clusterMember);
        Preconditions.checkNotNull(tsdrKey);
        Preconditions.checkNotNull(lastRequestTime);

        final String queryString = String.format(TSDR_QUERY_FORMAT, tsdrKey, lastRequestTime.toString());
        final String tsdrUrl = String.format(TSDR_URL_FORMAT, String.valueOf(clusterMember.getValue()), queryString);

        LOG.debug("Generated tsdr url: {}", tsdrUrl);

        return tsdrUrl;
    }

    /**
     * Generate a URL for a the RemoteRpcBroker MBean endpoint.
     *
     * This MBean can be used to find the list of cluster members.
     *
     * @return A well-formed URL suitable for making HTTP requests toward for the purpose of identifying cluster members
     */
    @Nonnull
    public static String getClusterMemberUrl() {
        return String.format(CLUSTER_MEMBER_FORMAT, CLUSTER_MEMBER_IP);
    }

    /**
     * Generate a URL for the ShardManager MBean endpoint.
     *
     * @param clusterMember IP address of the cluster member from which data shard manager data should be collected
     * @return A well-formed URL suitable for making HTTP requests toward for collecting ShardManager data
     */
    @Nonnull
    public static String getShardManagerUrl(@Nonnull final IpAddress clusterMember) {
        Preconditions.checkNotNull(clusterMember);

        return String.format(SHARD_MANAGER_FORMAT, String.valueOf(clusterMember.getValue()));
    }

    /**
     * Generate DataStore type based on status
     */
    private static String getDataStoreType(String status) {
        return status.equals("operational") ? "DistributedOperationalDatastore" : "DistributedConfigDatastore";
    }

    /**
     * Generate a URL for the GeneralRuntimeInfo MBean endpoint.
     *
     * @param address IP address of the cluster member
     * @param status Status of the cluster member
     * @return A well-formed URL suitable for making HTTP requests to collect GeneralRuntimeInfo data
     */
    @Nonnull
    public static String getGeneralRuntimeInfoUrl(@Nonnull IpAddress address, @Nonnull String status) {
        Preconditions.checkNotNull(address);
        Preconditions.checkNotNull(status);

        String typeParam = getDataStoreType(status);

        return String.format(GENERAL_RUNTIME_INFO_FORMAT, String.valueOf(address.getValue()), typeParam);
    }

    /**
     * Generate a URL for the Shard MBean endpoint.
     *
     * @param address IP address of the cluster member
     * @param name Name of the cluster member
     * @param status Status of the cluster member
     * @param shard Shard of the cluster member
     * @return A well-formed URL suitable for making HTTP requests to collect Shard data
     */
    @Nonnull
    public static String getShardUrl(@Nonnull IpAddress address, @Nonnull String name, @Nonnull String status, @Nonnull String shard) {
        Preconditions.checkNotNull(address);
        Preconditions.checkNotNull(name);
        Preconditions.checkNotNull(status);
        Preconditions.checkNotNull(shard);

        String nameParam = String.format("%s-shard-%s-%s", name, shard, status);
        String typeParam = getDataStoreType(status);

        return String.format(SHARD_URL_FORMAT, String.valueOf(address.getValue()), nameParam, typeParam);
    }
}