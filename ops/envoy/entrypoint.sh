#!/bin/sh

set -eu

echo "$CERT_CHAIN" > /certs/cert_chain.pem
echo "$CERT_KEY" > /certs/key.pem

chmod 400 /certs/*.pem

unset CERT_CHAIN
unset CERT_KEY

# Start Envoy
/usr/bin/agent
