/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Nonnull;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * Created by tylevine on 8/17/16.
 */
public class TsdrKeyFactoryTest {

    private static final Pattern TSDR_PATTERN =
            Pattern.compile("^\\[NID=(\\w*)\\]\\[DC=(\\w*)\\]\\[MN=(\\w*)\\]\\[RK=\\]$");

    private static void assertCorrectTsdrKey(@Nonnull final String tsdrKey,
                                             @Nonnull final String nodeId,
                                             @Nonnull final String dataCategory,
                                             @Nonnull final String metricName) {
        final Matcher match = TSDR_PATTERN.matcher(tsdrKey);

        assertTrue("TSDR key " + tsdrKey + " does not match regex " + TSDR_PATTERN.pattern(), match.find());
        assertEquals(match.group(1), nodeId);
        assertEquals(match.group(2), dataCategory);
        assertEquals(match.group(3), metricName);
    }

    private static void assertCorrectEncodedTsdrKey(@Nonnull final String tsdrKey,
                                                    @Nonnull final String nodeId,
                                                    @Nonnull final String dataCategory,
                                                    @Nonnull final String metricName) {
        try {
            final String unencodedTsdrKey = URLDecoder.decode(tsdrKey, "UTF-8");

            assertCorrectTsdrKey(unencodedTsdrKey, nodeId, dataCategory, metricName);
        } catch (final UnsupportedEncodingException ex) {
            throw new IllegalStateException("Unsupported charset UTF-8", ex);
        }
    }

    @Test
    public void testCreateTsdrKey() throws Exception {
        final String nodeId = "testNodeId";
        final String dataCategory = "testCategory";
        final String metricName = "testMetric";

        final String tsdrKey = TsdrKeyFactory.createTsdrKey(nodeId, dataCategory, metricName);

        assertNotNull(tsdrKey);
        assertCorrectTsdrKey(tsdrKey, nodeId, dataCategory, metricName);
    }

    @Test
    public void testCreateTsdrKeyWithNulls() {
        final String nodeId = null;
        final String dataCategory = null;
        final String metricName = null;

        final String tsdrKey = TsdrKeyFactory.createTsdrKey(nodeId, dataCategory, metricName);

        assertNotNull(tsdrKey);
        assertCorrectTsdrKey(tsdrKey, "", "", "");
    }

    @Test
    public void testCreateEncodedTsdrKey() throws Exception {
        final String nodeId = "testEncodedNodeId";
        final String dataCategory = "testEncodedCategory";
        final String metricName = "testEncodedMetric";

        final String tsdrKey = TsdrKeyFactory.createEncodedTsdrKey(nodeId, dataCategory, metricName);

        assertNotNull(tsdrKey);
        assertCorrectEncodedTsdrKey(tsdrKey, nodeId, dataCategory, metricName);
    }

    @Test
    public void testCreateEncodedTsdrKeyWithNulls() throws Exception {
        final String nodeId = null;
        final String dataCategory = null;
        final String metricName = null;

        final String tsdrKey = TsdrKeyFactory.createEncodedTsdrKey(nodeId, dataCategory, metricName);

        assertNotNull(tsdrKey);
        assertCorrectEncodedTsdrKey(tsdrKey, "", "", "");
    }
}