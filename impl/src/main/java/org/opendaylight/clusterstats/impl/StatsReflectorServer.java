/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.instrumentation.output.Requests;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.instrumentation.output.RequestsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.Future;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.inet.types.rev130715.IpAddress;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.cluster.members.output.ClusterMembers;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.cluster.members.output.ClusterMembersBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.stats.output.DataPoints;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.stats.output.DataPointsBuilder;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

/**
 * @author Tyler Levine, tylevine@cisco.com
 * @version 1.0
 * @since 2016-08-10
 */
public class StatsReflectorServer implements StatsReflectorService {

    private static final Logger LOG = LoggerFactory.getLogger(StatsReflectorServer.class);
    private static Map<String, Long> numberOfRequests = new HashMap<>();
    private static Map<String, Double> averageLatency = new HashMap<>();

    private static void updateInstrumentation(String requestName, long latency) {
        long oldNum = numberOfRequests.getOrDefault(requestName, 0L);
        numberOfRequests.put(requestName, oldNum + 1);

        double oldLatency = averageLatency.getOrDefault(requestName, 0.0);
        double newLatency = (oldLatency * oldNum + latency) / (double)(oldNum + 1);
        averageLatency.put(requestName, newLatency);
    }

    /*

    private GetStatsOutput buildFakeStatsOutput() {

        final int NUM_DATAPOINTS = 5;

        final DataPointsBuilder dataPointsBuilder = new DataPointsBuilder();
        final List<DataPoints> dataPointsList = new ArrayList<>(NUM_DATAPOINTS);

        for (int i = 0; i < NUM_DATAPOINTS; i++) {
            dataPointsBuilder.setDataCategory("DC" + i);
            dataPointsBuilder.setMetricName("Metric" + i);
            dataPointsBuilder.setMetricValue(String.valueOf(i));
            dataPointsBuilder.setNodeId("Node" + i);
            dataPointsBuilder.setTimeStamp("TS" + i);

            dataPointsList.add(dataPointsBuilder.build());
        }

        GetStatsOutputBuilder output = new GetStatsOutputBuilder();
        output.setDataPoints(dataPointsList);

        return output.build();
    }

    private GetClusterMembersOutput buildFakeClusterMembersOutput() {
        final int NUM_CLUSTER_MEMBERS = 3;

        final ClusterMembersBuilder clusterMembersBuilder = new ClusterMembersBuilder();
        final List<ClusterMembers> clusterMembersList = new ArrayList<>(NUM_CLUSTER_MEMBERS);

        for (int i = 0; i < NUM_CLUSTER_MEMBERS; i++) {
            clusterMembersBuilder.setMemberAddress(new IpAddress(("1.2.3." + i).toCharArray()));
            clusterMembersBuilder.setMemberName("member" + i);

            clusterMembersList.add(clusterMembersBuilder.build());
        }

        final GetClusterMembersOutputBuilder output = new GetClusterMembersOutputBuilder();
        output.setClusterMembers(clusterMembersList);

        return output.build();
    }

    */

    @Override
    public Future<RpcResult<GetStatsOutput>> getStats(GetStatsInput input) {
        LOG.info("Get stats RPC called");

        GetStatsOutput output;

        try {
            long start = System.currentTimeMillis();
            output = StatsCollector.collectForRequest(input);
            long end = System.currentTimeMillis();

            updateInstrumentation("GetTsdrStats", end - start);

            return RpcResultBuilder.success(output).buildFuture();
        } catch (final IOException ex) {
            LOG.warn("Got exception while collecting stats!", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public Future<RpcResult<GetClusterMembersOutput>> getClusterMembers(GetClusterMembersInput input) {
        LOG.info("Get cluster members RPC called");

        GetClusterMembersOutput output;

        try {
            long start = System.currentTimeMillis();
            output = StatsCollector.getClusterMembers();
            long end = System.currentTimeMillis();

            updateInstrumentation("GetClusterMembers", end - start);

            return RpcResultBuilder.success(output).buildFuture();
        } catch (final IOException ex) {
            LOG.warn("Got exception while getting cluster members!", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public Future<RpcResult<GetGeneralRuntimeInfoMbeanOutput>> getGeneralRuntimeInfoMbean(GetGeneralRuntimeInfoMbeanInput input) {
        LOG.info("Get cluster stats RPC called");

        GetGeneralRuntimeInfoMbeanOutput output;

        try {
            long start = System.currentTimeMillis();
            output = StatsCollector.getGeneralRuntimeInfoStats(input);
            long end = System.currentTimeMillis();

            updateInstrumentation("GetGeneralRuntimeInfo", end - start);

            return RpcResultBuilder.success(output).buildFuture();
        } catch (IOException ex) {
            LOG.warn("Got exception while collecting GeneralRuntimeInfo MBean stats!", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public Future<RpcResult<GetShardMbeanOutput>> getShardMbean(GetShardMbeanInput input) {
        LOG.info("Get cluster stats RPC called");

        GetShardMbeanOutput output;

        try {
            long start = System.currentTimeMillis();
            output = StatsCollector.getShardStats(input);
            long end = System.currentTimeMillis();

            updateInstrumentation("GetShard", end - start);

            return RpcResultBuilder.success(output).buildFuture();
        } catch (IOException ex) {
            LOG.warn("Got exception while collecting Shard MBean stats!", ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public Future<RpcResult<GetInstrumentationOutput>> getInstrumentation(GetInstrumentationInput input) {
        LOG.info("Get instrumentation called");

        GetInstrumentationOutputBuilder outputBuilder = new GetInstrumentationOutputBuilder();

        List<Requests> requestsList = new ArrayList<>();

        for (final Map.Entry<String, Long> entry : numberOfRequests.entrySet()) {
            RequestsBuilder requestsBuilder = new RequestsBuilder()
                    .setRequestName(entry.getKey())
                    .setNumberOfRequests(entry.getValue())
                    .setAverageLatency(entry.getValue().toString() + " ms");

            requestsList.add(requestsBuilder.build());
        }

        outputBuilder.setRequests(requestsList);

        return RpcResultBuilder.success(outputBuilder.build()).buildFuture();
    }
}