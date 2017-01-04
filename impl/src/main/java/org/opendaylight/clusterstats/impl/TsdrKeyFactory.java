/*
 * Copyright © 2016 Cisco, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.clusterstats.impl;

import com.google.common.base.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Factory class for constructing well-formed TSDR keys suitable for using in Rest calls to the TSDR system.
 *
 */
public class TsdrKeyFactory {

    private static final Logger LOG = LoggerFactory.getLogger(TsdrKeyFactory.class);

    private static final String TSDR_KEY_FORMAT = "[NID=%s][DC=%s][MN=%s][RK=]";

    private TsdrKeyFactory() {}

    /**
     * Create a well-formed, but unencoded, TSDR key.
     *
     * @param nodeId TSDR node id
     * @param dataCategory TSDR data category
     * @param metricName TSDR metric name
     * @return The generated TSDR key
     */
    @Nonnull
    public static String createTsdrKey(@Nullable final String nodeId,
                                       @Nullable final String dataCategory,
                                       @Nullable final String metricName) {

        final Optional<String> nodeIdOp = Optional.fromNullable(nodeId);
        final Optional<String> dataCategoryOp = Optional.fromNullable(dataCategory);
        final Optional<String> metricNameOp = Optional.fromNullable(metricName);

        final String tsdrKey =
                String.format(TSDR_KEY_FORMAT, nodeIdOp.or(""), dataCategoryOp.or(""), metricNameOp.or(""));

        LOG.debug("Generated TSDR Key: {}", tsdrKey);

        return tsdrKey;
    }

    /**
     * Create a well-formed and correctly encoded TSDR key suitable for direct insertion
     * into a URL for making a HTTP request to a TSDR endpoint.
     *
     * @param nodeId TSDR node id
     * @param dataCategory TSDR data category
     * @param metricName TSDR metric name
     * @return The generated TSDR key, URL encoded in UTF-8 encoding
     */
    @Nonnull
    public static String createEncodedTsdrKey(@Nullable final String nodeId,
                                              @Nullable final String dataCategory,
                                              @Nullable final String metricName) {
        try {
            return URLEncoder.encode(createTsdrKey(nodeId, dataCategory, metricName), "UTF-8");
        } catch (final UnsupportedEncodingException ex) {
            LOG.error("UTF-8 encoding is not supported on this platform!", ex);
            throw new IllegalStateException(ex);
        }
    }
}
