import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

// Determine the current Pulumi stack (environment).
const stack = pulumi.getStack();

// Create a Kubernetes provider instance. If you need to specify a kubeconfig file,
// you can do so by providing the file path directly in the 'kubeconfig' property.
const k8sProvider = new k8s.Provider('k8s-provider', {
  // If your kubeconfig is not in the default location, you can specify the kubeconfig path like this:
  // kubeconfig: '/path/to/your/kubeconfig',
});

// Deploy the Nginx Helm chart from the helm-charts directory.
const nginxChart = new k8s.helm.v3.Chart('scrapper-admin', {
  path: 'helm-charts/scrapper-admin',
}, { provider: k8sProvider });

// Apply the Kustomize configuration from the kustomize directory.
const kustomizeConfig = new k8s.yaml.ConfigGroup('kustomize', {
  files: [`kustomize/overlays/${stack}/kustomization.yaml`],
}, { provider: k8sProvider });

// Export the name of the Nginx service.
export const serviceName = nginxChart.getResource('v1/Service', 'scrapper-admin').metadata.name;
