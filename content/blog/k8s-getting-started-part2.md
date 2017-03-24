+++
title = "Kubernetes: Getting Started With a Local Deployment"
date = "2015-07-07T22:00:00+01:00"
Description = "Kubernetes: Getting Started With a Local Deployment"
Tags = ["Kubernetes", "Docker", "Deployment"]
Categories = ["Kubernetes", "Getting Started"]
authortwitter = "mattbates25"
author = "Matt Bates"
thumbnail = "/authors/matt-bates.jpg"
socialsharing = true
image = "/blog/k8s-getting-started-part2/cover.png"
+++


In [Part 1]({{< relref "blog/k8s-getting-started-part1.md" >}}) of this series of blogs, we introduced [Kubernetes](http://www.kubernetes.io), an open source container management system from Google, based on operational systems that run over 2 billion containers a week. Kubernetes will very soon be production-ready with the 1.0 release scheduled for this month. In this second part, we will get hands-on, setup a local cluster and deploy a Nginx web server.

<!--more-->

An application and its desired state is described in terms of several fundamental units in Kubernetes.

- **Pods**: are the most basic unit in Kubernetes. Pods are collections of Docker containers co-located on the same host. These containers have shared fate (i.e. they start and stop together) and can share data using volumes. Typically, a pod may only contain a single container (e.g. a web server), but other containers may also exist in a pod and share network namespace and volumes; for example, a separate container may include an application to process HTTP access/error log files and ship elsewhere.

- **Replication Controllers**: manage the lifecycle of pods. The controller maintains a desired number of pod replicas and will automatically create or kill pods as necessary.

- **Services**: are collections of pods that are exposed with a single and stable name and network address. The service provides load balancing to the underlying pods, with or without an external load balancer.

{{<img src="/images/k8s/logo-small.png" alt="Kubernetes Logo" class="pure-img center" >}}

# Installing Kubernetes

As we will see in a future post, Google's Container Engine (GKE) is the easiest way to use Kubernetes in the cloud – it is effectively Kubernetes-as-a-Service. But spinning up Kubernetes locally (or using some cloud VMs, including EC2 or Azure) is the best way to see and understand all the components and how it all fits together.

Kubernetes runs almost everywhere, on different flavours of Linux and cloud. A page at the documentation summarises the status of the many OS/infrastructure deployment combinations in community development, with links to getting started guides.

Deploying a full Kubernetes cluster takes some effort, especially across hosts, so to get started quickly, Kubernetes can be deployed in standalone mode. You just need Linux with Docker installed. A container image called Hyperkube bundles the major components, and the backing datastore (etcd) is available as a separate Docker container image.

Note: If you're running Mac OS X or Windows, then don’t feel left out - you can just use a Linux VM. Boot2Docker will establish a lightweight Linux VM (~27MB) with Docker bundled. Your mileage might vary though, so be prepared to spin up a Linux VM with Virtualbox (or similar) or even in the cloud (GCE, EC2 etc).

## Kubernetes architecture - a high-level view

{{<img src="/images/k8s/architecture-small.png" class="pure-img center" link="/images/k8s/architecture.png" caption="Kubernetes Architecture (Credit: Kubernetes Project)" alt="Kubernetes Architecture" >}}

At a high-level, a Kubernetes cluster comprises a master and a set of nodes.

- The **master** is the Kubernetes ‘control plane’ and has a number of cluster-wide components, including an API server that tools (e.g. **kubectl**) use to interact with the cluster.
- Each **node** has a **kubelet** service which receives orders from the master and a container runtime (including but not limited to Docker) which it interfaces to manage container instances.
Let’s see this in action and describe these components further as we set them up.

As the [getting started guide](http://kubernetes.io/docs/getting-started-guides/docker/) describes, there are just three steps to getting a standalone cluster up and running..


## Step One: Run Etcd

~~~ bash
docker run -d \
    --net=host \
    gcr.io/google_containers/etcd:2.0.9 \
    /usr/local/bin/etcd \
        --addr=127.0.0.1:4001 \
        --bind-addr=0.0.0.0:4001 \
        --data-dir=/var/etcd/data
~~~

[Etcd](https://github.com/coreos/etcd), to anyone not already familiar, is a key-value store designed for strong consistency and high-availability. Kubernetes uses etcd to reliably store master state and configuration. The various master components 'watch' this data and act accordingly - for example, starting a new container to maintain a desired number of replicas.

*For the upcoming 1.0 release, etcd is deployed as single instance but in the future replicas will be added to support HA*


## Step Two: Run the Master

~~~ bash
docker run -d \
    --net=host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    jetstack/hyperkube:v0.20.1 \
    /hyperkube kubelet \
        --api_servers=http://localhost:8080 \
        --v=2 \
        --address=0.0.0.0 \
        --enable_server \
        --hostname_override=127.0.0.1 \
        --config=/etc/kubernetes/manifests
~~~

This step runs a kubelet container, which in this local deployment, in turn runs the cluster-wide components that form the Kubernetes master 'control plane'.

- **API Server**: provides RESTful Kubernetes API to manage cluster configuration, backed by the etcd datastore.
- **Scheduler**: places unscheduled pods on nodes according to rules (e.g. labels). At this stage, the scheduler is simple but it is, like most components in Kubernetes, pluggable.
- **Controller Manager**: manages all cluster-level functions, including creating/updating endpoints, nodes discovery, management and monitoring, and management of pods.

## Step Three: Run the Service Proxy

~~~ bash
docker run -d \
   --net=host \
   --privileged \
   jetstack/hyperkube:v0.20.1 \
   /hyperkube proxy \
        --master=http://127.0.0.1:8080 \
        --v=2
~~~

The proxy (**kube-proxy**) runs on each node and provides simple network proxy and load balancing capability. This proxy enables services to be exposed with a stable network address and name.

And that's it – we should now have a Kubernetes cluster running locally. To be sure everything is up, use docker ps to check the running container instances; it should look something similar to this (several columns have been omitted for brevity):


| IMAGE | COMMAND |
| :--- | :--- |
| `jetstack/hyperkube:v0.20.1` | `/hyperkube proxy` |
| `jetstack/hyperkube:v0.20.1` | `/hyperkube scheduler` |
| `jetstack/hyperkube:v0.20.1` | `/hyperkube apiserver` |
| `jetstack/hyperkube:v0.20.1` | `/hyperkube controller` |
| `gcr.io/google_containers/pause:0.8.0` | `/pause` |
| `jetstack/hyperkube:v0.20.1` | `/hyperkube kubelet` |
| `gcr.io/google_containers/etcd:2.0.9` | `/usr/local/bin/etcd` |

<br>

To interact with the cluster, we use the kubectl CLI tool. It can be downloaded pre-built direct from Google (note 0.20.1 is the latest release at the time of writing).

~~~ bash
wget https://storage.googleapis.com/kubernetes-release/release/v0.20.1/bin/linux/amd64/kubectl
chmod u+x kubetctl
sudo  mv kubectl /usr/local/bin/
~~~

*note: replace linux with darwin for the OS X binary and v0.20.1 with the latest release if you like*

The quickest way to start a container in the cluster is to use the **kubectl** run command. So, for example, to start a Nginx container, use the command and refer to the container image name.

~~~ bash
kubectl run web --image=nginx
~~~

Although this is convenient and suitable for experimentation, resources such as pods are more usually created using configuration artefacts that can benefit from version control, etc. Using YAML (or JSON), a pod and its desired state is declared and it is Kubernetes’ job to ensure this pod always exists based on this specification - until such time it’s deleted.

Here’s a simple example of a pod configuration for that nginx pod (file nginx-pod.yml).

~~~ yaml
apiVersion: v1
kind: Pod
metadata:
 name: nginx
 labels:
   app: web
spec:
 containers:
   - name: nginx
     image: nginx
~~~

This runs the same container image (nginx) as above, but in this case the resource configuration specifies some additional custom metadata: a label (key/value pair) that gives this pod an ‘app’ label of ‘web’. Labels are a powerful feature in Kubernetes and we’ll see in future posts how they are used for selection, grouping and more.

~~~ bash
kubectl create -f nginx-pod.yml
~~~

Kubernetes will work its magic in the background: instructing a node to pull the container image (from the Docker Hub by default but this could be from other registries like [quay.io](https://quay.io/) and [gcr.io](https://www.gcr.io/)) and start the container, and also of course register the pod and its status.

Use **kubectl** again moments later and you should be able to see the nginx pod running.

~~~ bash
$ kubectl get pods
POD    IP              CONTAINER(S)  IMAGE(S)   HOST                     LABELS     STATUS    CREATED
web1   172.17.0.1      nginx         nginx      127.0.0.1/127.0.0.1      app=web  Running   About a minute web1
~~~

As requested, an Nginx container is now running in a pod (web1-qtlc1 in this case) and it has been assigned an IP address. In Kubernetes, each pod is assigned an IP address from an internal network, and this means pods can inter-communicate. As we deployed Kubernetes with Docker using host networking (--net=host) in this case, these IP addresses will be accessible locally. In future posts, we will dig deeper into Kubernetes’ networking model and see how overlay networks, such as [Weave](http://www.weave.works/). can plug in to provide this functionality.

Let’s check nginx is really running and use wget (or a browser) to fetch the index page:

~~~ bash
wget http://172.17.0.1
~~~

All being well, you will see the nginx welcome page. You have now deployed your first Kubernetes pod!

In the [next post]({{< relref "blog/k8s-getting-started-part3.md" >}}), we will look at how to use a replication controller, which will instruct Kubernetes to ensure that multiple replicas of the Nginx pod exist and self-heal where necessary. A service will be created to expose the web server pods with an externally-accessible network address that is load balanced.

Stay tuned for the next post very soon.

Follow us on Twitter [@JetstackHQ](https://www.twitter.com/JetstackHQ) to hear more and please feel free to post questions or comments.
