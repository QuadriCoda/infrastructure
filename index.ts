import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as aws from "@pulumi/aws";
import * as path from 'path';

const kubeconfig = process.env.KUBECONFIG || "";

const stack = pulumi.getStack();

const k8sProvider = new k8s.Provider('k8s-provider', {
  kubeconfig: kubeconfig,
});


const scrapperAdminName = 'scrapper-admin';
const scrapperAdminChart = new k8s.helm.v3.Chart(scrapperAdminName, {
  path: path.join(__dirname, `helm-charts/${scrapperAdminName}`),
}, { provider: k8sProvider });

const kustomizeConfigScrapperAdmin = new k8s.yaml.ConfigGroup('kustomize-scrapper-admin', {
  files: [path.join(__dirname, `kustomize/${scrapperAdminName}/overlays/${stack}/kustomization.yaml`)],
}, { provider: k8sProvider });

export const scrapperAdminServiceName = scrapperAdminChart.getResource('v1/Service', scrapperAdminName).metadata.name;
