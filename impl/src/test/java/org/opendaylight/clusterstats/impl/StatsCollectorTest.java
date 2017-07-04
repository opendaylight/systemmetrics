/*
 * Copyright © 2017 Ashish Kumar and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.inet.types.rev130715.IpAddress;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.get.cluster.members.output.ClusterMembers;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.stats.reflector.rev150105.GetClusterMembersOutput;

import org.mockito.Mockito;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;
import java.net.URLStreamHandlerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.IOException;

import java.util.ArrayList;
import java.util.List;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by ashishk1994 on 07/04/17.
 */

public class StatsCollectorTest {

    @Test
    public void testgetClusterMembers() throws Exception {
        String shardMemberResponse = "{\"value\":{\"LocalShards\":[\"member-1-shard-default-operational\"],\"SyncStatus\":true,\"MemberName\":\"member-1\"}}";
        // Direct string passing in getclustermembers is giving parsing error but building json object and then converting into String to input stream is working fine
        String value = new String("testing@127.0.0.1:2550");
        JsonObject addrObject = Json.createObjectBuilder().add("address", value).build();
        JsonObject membersObject = Json.createObjectBuilder().add("members", Json.createArrayBuilder().add(addrObject).build()).build();
        JsonObject statusObject = Json.createObjectBuilder().add("ClusterStatus", membersObject.toString()).build();
        JsonObject clusterResponseObject = Json.createObjectBuilder().add("value", statusObject).build();

        String clusterUrl = RestUrlFactory.getClusterMemberUrl();
        String shardMemberUrl = RestUrlFactory.getShardManagerUrl(new IpAddress("127.0.0.1".toCharArray()));

        HttpURLConnection mockClusterConn = Mockito.mock(HttpURLConnection.class);
        HttpURLConnection mockShardMemberConn = Mockito.mock(HttpURLConnection.class);

        //mocking httpconnection by URLStreamHandler since we can not mock URL class using Mockito
        URLStreamHandler stubURLStreamHandler = new URLStreamHandler() {
            @Override
            protected URLConnection openConnection(URL u ) throws IOException {
                String url = u.toString();
                if(url.equals(clusterUrl)){
                    return mockClusterConn;
                }
                else{
                    return mockShardMemberConn;
                }
            }
        };

        // Overriding URLStreamHandlerfactory to mock connection based on the passed argument
        URLStreamHandlerFactory urlStreamHandlerFactory = Mockito.mock(URLStreamHandlerFactory.class);
        URL.setURLStreamHandlerFactory(urlStreamHandlerFactory);
        Mockito.when(urlStreamHandlerFactory.createURLStreamHandler("http")).thenReturn(stubURLStreamHandler);

        // Building input streams for parameters of the request and mocking the connections
        String strCluster = clusterResponseObject.toString();
        String strShardMember = shardMemberResponse;
        InputStream isCluster = new ByteArrayInputStream(strCluster.getBytes());
        InputStream isShardMember = new ByteArrayInputStream(strShardMember.getBytes());
        Mockito.when(mockClusterConn.getInputStream()).thenReturn(isCluster);
        Mockito.when(mockShardMemberConn.getInputStream()).thenReturn(isShardMember);

        // Check if expected and observed responses are same
        GetClusterMembersOutput clusterMembersOutput = StatsCollector.getClusterMembers();
        List<ClusterMembers> clusterMembers = clusterMembersOutput.getClusterMembers();
        for(ClusterMembers clusterMember: clusterMembers){
            assertEquals(clusterMember.getMemberName(), "member-1");
            assertEquals(clusterMember.getMemberAddress().getIpv4Address().getValue().toString(), "127.0.0.1");
            ArrayList<String> expectedList = new ArrayList<String>();
            expectedList.add("member-1-shard-default-operational");
            assertEquals(clusterMember.getLocalShards().toArray(), expectedList.toArray());
            assertEquals(clusterMember.isVoter(), true);
        }
    }
}
