# Kubernetes Deployment for Inventory Service

This directory contains Kubernetes manifests for deploying the Inventory Service application using Kustomize.

## Structure

- `base/`: Contains the base Kubernetes manifests

  - `deployment.yaml`: Defines the deployment for the application
  - `service.yaml`: Defines the service to expose the application
  - `configmap.yaml`: Contains non-sensitive configuration
  - `kustomization.yaml`: Defines the base resources

- `overlays/`: Contains environment-specific overlays
  - `examples/`: Default overlay for the 'examples' namespace
    - `kustomization.yaml`: Customizes the base for the examples environment with namespace 'examples', nameSuffix '-nest', and includes sealedsecret.yaml as a resource and configmap.yaml as a patch
    - `configmap.yaml`: Contains environment-specific configuration (used as a patch)
    - `secret.yaml`: Template for sensitive data (not to be committed)
    - `sealedsecret.yaml`: Encrypted version of secrets for secure storage

## Prerequisites

- Kubernetes cluster
- kubectl installed
- kustomize installed (or use kubectl with built-in kustomize)

## Deployment

### Deploy to the examples namespace

```bash
# Create the namespace if it doesn't exist
kubectl create namespace examples

# Deploy using kubectl with built-in kustomize
kubectl apply -k k8s/overlays/examples

# Or using standalone kustomize
kustomize build k8s/overlays/examples | kubectl apply -f -
```

This will deploy the application to the examples namespace with the name suffix "-nest" (e.g., inventory-service-nest).

### Creating Additional Overlays

To create additional overlays for different environments:

1. Create a new directory under `overlays/` for your environment
2. Create a `kustomization.yaml` file in the new directory
3. Customize as needed for your environment

Example for a 'production' overlay:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: production

resources:
  - ../../base

commonLabels:
  environment: production

patches:
  # Add production-specific patches here
  # Example: - path: configmap.yaml
```

## Configuration and Secrets

### ConfigMap

The application uses a ConfigMap to store non-sensitive configuration:

- `NODE_ENV`: Environment mode (production, development, etc.)
- `DATABASE_HOST`: Database hostname
- `DATABASE_PORT`: Database port
- `DATABASE_NAME`: Database name

You can customize these values for different environments by creating environment-specific ConfigMaps in your overlays and applying them as patches to the base ConfigMap. This is the recommended approach rather than including them as separate resources. For example:

```yaml
# In your overlay's kustomization.yaml
patches:
  - path: configmap.yaml
```

### SealedSecrets

For sensitive data, we use [Bitnami SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) to securely store encrypted secrets in Git.

To work with SealedSecrets:

1. Install the kubeseal CLI tool:

   ```bash
   # Using Homebrew
   brew install kubeseal

   # Using GitHub releases
   KUBESEAL_VERSION=0.24.5
   wget "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION}/kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz"
   tar -xvzf kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz
   sudo install -m 755 kubeseal /usr/local/bin/kubeseal
   ```

2. Create a regular Kubernetes Secret (do not commit this to Git):

   ```bash
   # Example secret.yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: inventory-service-secrets
     namespace: examples
   type: Opaque
   stringData:
     DATABASE_USER: "your-username"
     DATABASE_PASSWORD: "your-password"
   ```

3. Generate a SealedSecret using kubeseal:

   ```bash
   # Fetch the public key from your cluster
   kubeseal --fetch-cert > public-key-cert.pem

   # Create a SealedSecret for the examples overlay
   kubeseal --format yaml --cert=public-key-cert.pem --namespace examples < k8s/overlays/examples/secret.yaml > k8s/overlays/examples/sealedsecret.yaml
   ```

4. Commit the sealedsecret.yaml file to Git (it's safe to do so)

5. Apply the SealedSecret to your cluster:
   ```bash
   kubectl apply -f sealedsecret.yaml
   ```

The SealedSecret controller in your cluster will decrypt the SealedSecret and create the actual Secret.

## Customization

You can customize the deployment for different environments by:

1. Adding environment-specific patches in the overlay's `kustomization.yaml`
2. Creating environment-specific ConfigMaps or SealedSecrets
3. Adjusting resource limits, replicas, or other parameters

Refer to the [Kustomize documentation](https://kubectl.docs.kubernetes.io/references/kustomize/) for more details on customization options.
