#!/bin/bash

# Path to the original kubeconfig file
KUBECONFIG_FILE="/home/ubuntu/.kube/config"

# Temporary file to store the modified kubeconfig
TEMP_KUBECONFIG_FILE="/home/ubuntu/kcfg"

ENCODED_KUBECONFIG_FILE="/home/ubuntu/ekcfg"

# Read and base64 encode the certificate authority, client certificate, and client key
CA_DATA=$(base64 -w 0 /home/ubuntu/.minikube/ca.crt)
CLIENT_CERT_DATA=$(base64 -w 0 /home/ubuntu/.minikube/profiles/minikube/client.crt)
CLIENT_KEY_DATA=$(base64 -w 0 /home/ubuntu/.minikube/profiles/minikube/client.key)

# Replace the file paths in the kubeconfig with the base64-encoded data
sed -e "s|certificate-authority: /home/ubuntu/.minikube/ca.crt|certificate-authority-data: ${CA_DATA}|" \
        -e "s|client-certificate: /home/ubuntu/.minikube/profiles/minikube/client.crt|client-certificate-data: ${CLIENT_CERT_DATA}|" \
        -e "s|client-key: /home/ubuntu/.minikube/profiles/minikube/client.key|client-key-data: ${CLIENT_KEY_DATA}|" \
        "$KUBECONFIG_FILE" > "$TEMP_KUBECONFIG_FILE"

# Overwrite the original kubeconfig file with the modified one
mv "$TEMP_KUBECONFIG_FILE" "$KUBECONFIG_FILE"
base64 $KUBECONFIG_FILE > $ENCODED_KUBECONFIG_FILE
echo "Kubeconfig file has been updated with certificate data."
