import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as aws from "@pulumi/aws";
import * as path from 'path';

const kubeconfig = process.env.KUBECONFIG || "";

const stack = pulumi.getStack();

const awsProvider = new aws.Provider("quadricoda", {
  profile: "quadricoda",
  region: "eu-central-1",
});

const k8sProvider = new k8s.Provider('k8s-provider', {
  kubeconfig: kubeconfig,
});

// Create an ECR repository
const repo = new aws.ecr.Repository(
  "scrapper-admin-frontend", 
  {
    name: "scrapper-admin-frontend",
    imageScanningConfiguration: {
      scanOnPush: true
    },
    tags: {
      Name: "ScrapperAdminFrontend",
      Environment: stack,
    }
  }, 
  { provider: awsProvider }
);

const scrapperAdminName = 'scrapper-admin';
const scrapperAdminChart = new k8s.helm.v3.Chart(scrapperAdminName, {
  path: path.join(__dirname, `helm-charts/${scrapperAdminName}`),
}, { provider: k8sProvider });

const kustomizeConfigScrapperAdmin = new k8s.yaml.ConfigGroup('kustomize-scrapper-admin', {
  files: [path.join(__dirname, `kustomize/${scrapperAdminName}/overlays/${stack}/kustomization.yaml`)],
}, { provider: k8sProvider });

export const scrapperAdminServiceName = scrapperAdminChart.getResource('v1/Service', scrapperAdminName).metadata.name;
