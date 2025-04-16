# Kubernetes Deployment for Node.js Application

This project demonstrates the deployment of a containerized application to a Kubernetes cluster using Minikube.

## Prerequisites

- Windows 10/11 (64-bit)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/desktop/install/windows-install/)
- Virtualization enabled in BIOS

## Installation

1. **Install Minikube**:
   ```powershell
   choco install minikube kubernetes-cli
## Start Minikube cluster:
minikube start
## Verify cluster status
   minikube status
kubectl cluster-info
## Apply the deployment
kubectl apply -f deployment.yaml

## Apply the service
kubectl apply -f service.yaml

## Accessing the Application
minikube service node-app-service