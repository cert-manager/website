+++
title = "High Availability and Services with Kubernetes"
date = "2015-07-21T22:00:00+01:00"
Description = "High Availability and Services with Kubernetes"
Tags = ["Kubernetes", "Docker", "Service Discovery", "High Availability"]
Categories = ["Kubernetes", "Getting Started"]
authortwitter = "mattbates25"
author = "Matt Bates"
thumbnail = "/authors/matt-bates.jpg"
socialsharing = true
summary = "In our previous blog, 'Getting Started with a Local Deployment', we deployed an Nginx pod to a standalone (single-node) Kubernetes cluster. This pod was bound to a specified node. If the pod were to fail unexpectedly, Kubernetes (specifically, the Kubelet service) would restart the pod. By default, pods have an ‘Always’ restart policy, but only to the node that it is first bound; it will not be rebound to another node. This means of course that if the node fails then pods will not be rescheduled elsewhere."
image = "/blog/k8s-getting-started-part3/cover.jpg"
+++

In our previous blog, [Getting Started with a Local Deployment]({{< relref "blog/k8s-getting-started-part2.md" >}}), we deployed an Nginx pod to a standalone (single-node) Kubernetes cluster. This pod was bound to a specified node. If the pod were to fail unexpectedly, Kubernetes (specifically, the Kubelet service) would restart the pod. By default, pods have an ‘Always’ restart policy, but only to the node that it is first bound; it will not be rebound to another node. This means of course that if the node fails then pods will not be rescheduled elsewhere.

<!--more-->

# Replication Controllers

It is this very reason that Kubernetes has a higher-level controller - a replication controller - responsible for maintaining pod health across nodes. A replication controller will take a desired state, in this case a number of pod ‘replicas’, and ensure this state exists in the cluster at all times. So if a pod fails (e.g. a node fails or is being maintained), the controller kicks in and starts a pod elsewhere in the cluster. If too many replicas exist for some reason, it kills pods.

Just like pods, the desired state is specified using a declarative YAML (or JSON) configuration. The replication controller is often described as a ‘cookie cutter’; it takes a pod template, as part of this configuration, which includes the type and specification of a pod, and cuts cookies (pods) as needed. But it differs to a pod in so much that this configuration is higher-level, it does not deal with the specific semantics of a pod.

# A multi-node virtualised Kubernetes cluster

Now we’re dealing with HA of pods, we need to move to a Kubernetes with multiple nodes. The standalone Kubernetes cluster in Part II was a single node - lightweight and ideal for kicking the tyres but we now need more nodes, as would be the case in a production deployment, to see replication controllers and services more typically in action. Virtual machines would be ideal.

There are many ways to deploy Kubernetes to virtual machines, on a variety of OSes with different provisioning methods and networking plug-ins. For now, we will use the ready-made Kubernetes Vagrant deployment - it’s just a few lines at the shell to get started:

~~~ bash
export KUBERNETES_PROVIDER=vagrant
export NUM_MINIONS=2
curl -sS https://get.k8s.io | bash
~~~

Alternatively, a pre-built Kubernetes release may be downloaded [here](https://github.com/kubernetes/kubernetes/releases) and started using a script.

~~~ bash
cd kubernetes
export KUBERNETES_PROVIDER=vagrant
export NUM_MINIONS=2
./cluster/kube-up.sh
~~~

Note with both methods, two Kubernetes nodes (they were previously called minions) are provisioned, with a default 1GB of memory per node, so ensure you have adequate RAM. There are more detailed instructions at the documentation [here](https://github.com/kubernetes/kubernetes/blob/release-1.0/docs/getting-started-guides/vagrant.md), including how to use a different virtualisation providers (e.g. VMWare) and tweak a number of settings.

Assuming the VMs started successfully, we can now use kubectl to see the status of the nodes:

~~~ bash
kubectl get nodes
NAME          LABELS                               STATUS
10.245.1.3    kubernetes.io/hostname=10.245.1.3    Ready
10.245.1.4    kubernetes.io/hostname=10.245.1.4    Ready
~~~

So with this small multi-node cluster, let’s add a replication controller that will ensure that two Nginx pod replicas are maintained, even in case of node failure.

~~~ yaml
apiVersion: v1
kind: ReplicationController
metadata:
 name: nginx-controller
spec:
 replicas: 2
 selector:
   name: nginx
 template:
   metadata:
     labels:
       name: nginx
   spec:
     containers:
       - name: nginx
         image: nginx
         ports:
           - containerPort: 80
kubectl create -f nginx-rc.yml
~~~

In this replication controller specification, the number of replicas (2) is specified, as well as a selector that informs Kubernetes of the pods it should manage. In this example, all pods with the ‘name’ ‘nginx’ can be used to fulfil the desired state. The selector effectively acts as a query on resource labels across the cluster. The controller then ‘cookie-cuts’ pods as needed with this ‘name’, as per the pod template.

Use Kubectl to check the replication controller was created and its status:

~~~ bash
kubectl get replicationcontrollers
# (or the shorter kubectl get rc)

CONTROLLER           CONTAINER(S)   IMAGE(S)   SELECTOR      REPLICAS
nginx-controller     nginx          nginx      name=nginx    2
~~~

Kubectl should also show the running pods under management of the controller (edited to just show these pods for brevity).

~~~ bash
kubectl get pods
# (or the shorter kubectl get po)

NAME                     READY     REASON    RESTARTS   AGE
nginx-controller-3qyv2   1/1       Running   0          51s
nginx-controller-y4nsj   1/1       Running   0          51s
~~~

As described in the previous blog, each pod is assigned an IP address. The controller in this example maintains two pods, both with unique IP addresses.. These addresses are routable in the cluster (that is, from one of the VMs).

With the controller now in operation, pods will be rescheduled on failure - but there is no guarantee that they will have the same IP addresses as before. It’s more dynamic: pods can come and go, and they can be scaled up and down as more or less replicas are requested.

# Services

Kubernetes to the rescue again! It solves this problem with another neat abstraction: Services. A service exposes a set of pods to a single network address that remains fixed and stable for the lifetime of the service. The group of pods targeted is specified using a label selector.

In our deployment of Nginx pods, as they are all replicas managed by the replication controller, a frontend application may not care which pod it accesses. The service acts as a proxy, and can be load balanced (as we’ll see), so the frontend and backend are neatly decoupled - adding or removing pods, either manual or automated, is completely transparent to the service consumer. Let’s see this in action and create an Nginx service to direct HTTP traffic to the pods:

~~~ yaml
kind: Service
apiVersion: v1
metadata:
  name: web-service
spec:
  selector:
    name: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
kubectl create -f nginx-service.yml
~~~

Next, list the services using kubectl and inspect the output:

~~~ bash
kubectl get services
# (or the shorter kubectl get se)

NAME          LABELS       SELECTOR     IP(S)            PORT(S)
web-service   <none>       name=nginx   10.247.122.216   80/TCP
~~~

The ‘web-service’ has been successfully created; it interfaces all pods that match the selector ‘name=nginx’ and exposes to the IP 10.247.122.216. This IP is virtual and requests are transparently proxied and load balanced across the matching Nginx container pods. This single network interface enables non-Kubernetes services to consume services managed by Kubernetes in a standard way, without being tightly coupled to the API.

How does the virtual IP (VIP) work? The Kubernetes proxy that runs on each node watches for changes to Services and Endpoints via the API. On creation of the Nginx service, the proxy sets up iptables rules to forward requests made to the VIP and port (HTTP 80) to a local port (randomly chosen) to the right backend pod(s).

As the VIP is cluster-only, use Vagrant to SSH to one of the nodes (or minions, as they were previously referred).

~~~ bash
vagrant ssh minion-1
curl -qa http://10.247.122.216
~~~

Voila - a load balanced, self-healing Nginx service, backed by two replica pods, accessible by IP.

It is not necessary to only use a VIP. The IP could also be real (i.e. routable), provided by the network or an overlay. In future posts, we’ll take a close look at Kubernetes’ approach to networking and explain how to plug-in overlay networks, such as Weave, Flannel and Project Calico, for inter- and intra-pod networking. The Vagrant Kubernetes cluster in this post uses Open vSwitch.


In this blog, we have introduced Kubernetes replication controllers and services. These powerful abstractions enable us to describe to Kubernetes the desired state of containerised applications, and for Kubernetes to actively maintain this state, auto-healing and scaling on request. Services provide network accessible interfaces to sets of pods, all transparently proxied and load balanced to service consumers inside and outside the cluster.

Stay tuned for the next blog in which we look at how Kubernetes supports data volumes, with a variety of volume types.

To keep up with Jetstack news, and to get early access to products, subscribe using the sign-up on our [home page](http://www.jetstack.io/#home-section).

