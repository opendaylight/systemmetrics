/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.inet.types.rev130715.IpAddress;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by tylevine on 8/17/16.
 */
public class RestUrlFactoryTest {

    @Test
    public void testGetTsdrUrl() throws Exception {
        final IpAddress clusterMember = new IpAddress("1.2.3.4".toCharArray());
        final String tsdrKey = "abcd";
        final Long lastRequest = 0L;
        final String expectedUrl = "http://1.2.3.4:8181/tsdr/metrics/query?tsdrkey=abcd&from=0";

        assertEquals(RestUrlFactory.getTsdrUrl(clusterMember, tsdrKey, lastRequest), expectedUrl);
    }

    @Test
    public void testGetTsdrUrlWithNullClusterMember() throws Exception {
        final IpAddress clusterMember = null;
        final String tsdrKey = "efgh";
        final Long lastRequest = 1L;

        try {
            RestUrlFactory.getTsdrUrl(clusterMember, tsdrKey, lastRequest);

            // if we got here, getTsdrUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (final NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetTsdrUrlWithNullTsdrKey() throws Exception {
        final IpAddress clusterMember = new IpAddress("1.2.3.4".toCharArray());
        final String tsdrKey = null;
        final Long lastRequest = 1L;

        try {
            RestUrlFactory.getTsdrUrl(clusterMember, tsdrKey, lastRequest);

            // if we got here, getTsdrUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (final NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetTsdrUrlWithNullLastRequest() throws Exception {
        final IpAddress clusterMember = new IpAddress("5.6.7.8".toCharArray());
        final String tsdrKey = "ghij";
        final Long lastRequest = null;

        try {
            RestUrlFactory.getTsdrUrl(clusterMember, tsdrKey, lastRequest);

            // if we got here, getTsdrUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (final NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetClusterMemberUrl() throws Exception {
        final String expected = "http://localhost:8181/jolokia/read/akka:type=Cluster";
        assertEquals(expected, RestUrlFactory.getClusterMemberUrl());
    }

    @Test
    public void testGetShardManagerUrl() throws Exception {
        final IpAddress clusterMember = new IpAddress("9.10.11.12".toCharArray());
        final String expected = "http://9.10.11.12:8181/jolokia/read/org.opendaylight.controller:" +
                "Category=ShardManager,name=shard-manager-operational,type=DistributedOperationalDatastore";

        assertEquals(expected, RestUrlFactory.getShardManagerUrl(clusterMember));
    }

    @Test
    public void testGetShardManagerUrlWithNullIp() throws Exception {
        final IpAddress clusterMember = null;

        try {
            RestUrlFactory.getShardManagerUrl(clusterMember);

            // if we got here, getShardManagerUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (final NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetGeneralRuntimeInfoUrl() {
        IpAddress address = new IpAddress("1.2.3.4".toCharArray());
        String status = "operational";

        String expected = "http://1.2.3.4:8181/jolokia/read/org.opendaylight.controller:" +
                "name=GeneralRuntimeInfo,type=DistributedOperationalDatastore";

        assertEquals(expected, RestUrlFactory.getGeneralRuntimeInfoUrl(address, status));
    }

    @Test
    public void testGetGeneralRuntimeInfoUrlWithNullIp() {
        try {
            RestUrlFactory.getGeneralRuntimeInfoUrl(null, "test");

            // if we got here, getGeneralRuntimeInfoUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetGeneralRuntimeInfoUrlWithNullStatus() {
        try {
            RestUrlFactory.getGeneralRuntimeInfoUrl(new IpAddress("1.2.3.4".toCharArray()), null);

            // if we got here, getGeneralRuntimeInfoUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetShardUrl() {
        IpAddress address = new IpAddress("1.2.3.4".toCharArray());
        String name = "member-1";
        String status = "operational";
        String shard = "inventory";

        String expected = "http://1.2.3.4:8181/jolokia/read/org.opendaylight.controller:" +
                "Category=Shards,name=member-1-shard-inventory-operational,type=DistributedOperationalDatastore";

        assertEquals(expected, RestUrlFactory.getShardUrl(address, name, status, shard));
    }

    @Test
    public void testGetShardUrlWithNullIp() {
        try {
            RestUrlFactory.getShardUrl(null, "test", "test", "test");

            // if we got here, getShardUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetShardUrlWithNullName() {
        try {
            RestUrlFactory.getShardUrl(new IpAddress("1.2.3.4".toCharArray()), null, "test", "test");

            // if we got here, getShardUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetShardUrlWithNullStatus() {
        try {
            RestUrlFactory.getShardUrl(new IpAddress("1.2.3.4".toCharArray()), "test", null, "test");

            // if we got here, getShardUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }

    @Test
    public void testGetShardUrlWithNullShard() {
        try {
            RestUrlFactory.getShardUrl(new IpAddress("1.2.3.4".toCharArray()), "test", "test", null);

            // if we got here, getShardUrl didn't throw NPE as it should have
            fail("No NPE thrown when one was expected");
        } catch (NullPointerException expected) {
            assertNotNull(expected);
        }
    }
}
