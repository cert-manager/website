+++
title = "Kubernetes 1.3: Hidden Gems TEST"
date = "2016-07-14T14:00:00+01:00"
Tags = ["Kubernetes", "1.3"]
Categories = ["Kubernetes"]
authortwitter = "mattbates25"
author = "Matthew Bates"
thumbnail = "/authors/matt-bates.jpg"
socialsharing = true
image = "/blog/kubernetes-1-3-hidden-gems/gems.jpg"
+++

With over 5000 commits and almost 350 contributors from the community and across industry, Kubernetes is now at version 1.3 and [launched last week](http://blog.kubernetes.io/2016/07/kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads.html). 

It is nearly two years ago that Kubernetes first launched. The scale of community engagement and innovation in the project has been staggering, with individuals collaborating alongside industry leaders (Google, RedHat et al) to push forward and bring production-grade container cluster management to all. This blog will investigate 1.3 and some of the hidden gems found in it.

<!--more-->

# What's new in 1.3

The focus of Kubernetes 1.3 has been to deploy and scale services across cluster, zone and cloud boundaries, run a greater range of workloads (including stateful services, such as databases), increase scale and automation and support rkt and OCI & CNI container standards.

## PetSet

Up until now, deploying stateful applications such as distributed databases, has been a tricky (albeit not impossible) affair. Jetstack spoke at KubeCon in London ([Recording: The State of State](https://www.youtube.com/watch?v=jsTQ24CLRhI)) and described these challenges, as well as common patterns to workaround.

The community came together to introduce a new alpha 'PetSet' object to describe such systems. Kubernetes now has fuctionality to deploys Pods that guarantees network and storage identity, and even dynamically provision storage on-demand in the cloud (limited to AWS EBS and GCE PD at this stage). 

## Cluster Federation ('Ubernetes')

Kubernetes 1.3 now makes it possible to discover services running in multiple clusters, that may span regions and/or cloud providers, to be used by containers or external clients. This 'Ubernetes' federation can be used for increased HA, geographic distribution and hybrid/multi-cloud, and is an exciting first stage that will be further developed into 1.4 and beyond. 

## Rktnetes 1.0

Kubernetes was built to ultimately be container runtime-agnostic. 1.3 sees the first stable release that integrates the rkt runtime, enabling it to be used in-place of Docker (which has been up until now the default runtime). And yes, it's another '-netes' - rktnetes.

[rkt] is a CoreOS project that has fast matured and now stands at [v1.10.0](https://github.com/coreos/rkt/releases). It implements the open App Container Spec and has a number of features that make it an attractive alternative to Docker. For example, compatability with init systems such as systemd (nspawn) and the ability to launch VMs in Pods for greater isolation guarantee (using LKVM stage1).

[rkt]:https://github.com/coreos/rkt

Read more about rktnetes at [this recent blog](http://blog.kubernetes.io/2016/07/rktnetes-brings-rkt-container-engine-to-Kubernetes.html) from the CoreOS team. 

## Scalability
Kubernetes now supports 2000-node clusters with decreased end-to-end Pod startup time. Under the bonnet, the biggest change that has resulted in the improvements in scalability is to use [Protocol Buffer](https://developers.google.com/protocol-buffers/)-based serialization in the API instead of JSON. 

This [recent blog post](http://blog.kubernetes.io/2016/07/kubernetes-updates-to-performance-and-scalability-in-1.3.html) details the improvements and the Kubemark performance testing tool used by the project.


In the weeks and months to come, Jetstack will blog in greater detail on these new user-facing features, and importantly, explain how to get started and use them in practice. For example, we'll show how to take Kubernetes multi-region/cloud. We'll also show how to make distributed databases deployable more natively (as 'Pets') - an area we are actively working with customers right now.

# Some hidden gems in Kubernetes 1.3

But for the main part of this blog post, we wanted to call out several new features we like that are lesser-known, but are useful and important nonetheless. Note that some features and enhancements are alpha and beta.

## Kubectl deployment

[Deployment] is an API that provides declarative, server-side updates of Pods and ReplicaSets. 
Although a beta feature, it is now more widely used and adopted, and is actively developed with new functionality in-flight and planned (see the [Deployment Roadmap]). In 1.3, new commands have been added to `kubectl` to more conveniently manage and watch an update to a deployment.

[Deployment]:http://kubernetes.io/docs/user-guide/deployments/
[Deployment Roadmap]:https://github.com/kubernetes/community/wiki/Roadmap:-Deployment

### Update a deployment container image
Previously, if you wanted to update a container image for Pods in a ReplicaSet, managed by a Deployment, you would use `kubectl edit` and directly edit the Deployment's YAML.

A new command `kubectl set` now allows the container image to be set in a single one-line command.

```
$ kubectl set image deployment/web nginx=nginx:1.9.1
```

### Watch a deployment rollout ([#19946])
To watch the update rollout and verify it succeeds, there is now a new convenient command: `rollout status`. So, for example, to see the rollout of `nginx/nginx:1.9.1` from `nginx/nginx:1.7.9`:

```
$ kubectl rollout status deployment/web

Waiting for rollout to finish: 2 out of 4 new replicas has been updated...
Waiting for rollout to finish: 2 out of 4 new replicas has been updated...
Waiting for rollout to finish: 2 out of 4 new replicas has been updated...
Waiting for rollout to finish: 3 out of 4 new replicas has been updated...
Waiting for rollout to finish: 3 out of 4 new replicas has been updated...
Waiting for rollout to finish: 3 out of 4 new replicas has been updated...
deployment nginx successfully rolled out
```

[#19946]:https://github.com/kubernetes/kubernetes/pull/19946

## Garbage collector ([#26341], *alpha*)

[#26341]:https://github.com/kubernetes/kubernetes/pull/26341

Kubernetes resources often depend on each other. For example, ReplicaSets create
Pods according to the specified template. If you want to delete such a
ReplicaSet, you have to find out which Pods match its selector and cascade the
delete to matching Pods. This deletion is currently implemented client-side
(`kubectl`).

In the future (1.4 or later), this cascading clean-up will be handled by the
KCM (kube controller manager). In preparation, 1.3 introduces the
additional metadata field `ownerReferences` for API objects. For the
ReplicaSet/Pods example the Pods would contain an owner reference to their
ReplicaSet. As soon as the ReplicaSet is removed, the garbage collector will
remove this Pods as well. There is a new DeleteOption called
`orphanDependents`, that allows to disable this cascading deletes.

The garbage collector is an alpha feature in 1.3 so it is disabled by default.
To enable it, you need to start the kube-apiserver and KCM with the flag
`--enable-garbage-collector`.

Read more about the [garbage collector] at the user guide and note the warning about using at your own risk (it's alpha, after all).

[garbage collector]:http://kubernetes.io/docs/user-guide/garbage-collector/

## Shell completion integrated into kubectl ([#23801](https://github.com/kubernetes/kubernetes/pull/23801))

As a frequent user of kubectl, you might have been aware of the completion
scripts for the shell, which where maintained in the `/contrib/completions`
folder in the core project. This provides not only completion of kubectl's
subcommands and arguments, but also names of resources like Namespace and Pods. 

As usual for Golang binaries, the distribution of kubectl typically just
consists of that single file. This makes it harder to maintain a compatible
completion file. For that reason this scripts are integrated into kubectl from
version 1.3 onwards. Loading the completion is now as easy as adding a single
line:

```
# line for .bashrc
source < (kubectl completion bash)

# line for .zshrc
source < (kubectl completion zsh)
```

## Init containers ([#23567], *alpha*)

[#23567]:https://github.com/kubernetes/kubernetes/pull/23567

The *alpha* feature init containers allows to run certain commands before the
long-running main Pod container(s) are launched. These commands are executed in
sequential order and only if these commands succeed do the main containers start. This enables you to download specific files to a volume, generate configuration files for the application without baking into the container image, etc.

Here is an example of a Pod that runs a specific version of kubectl. The
version is downloaded every time the Pod launches. For demonstration, a second init container then contains a command to make the kubectl binary executable. A Pod specification containing the necessary annotation looks like this:

```
apiVersion: v1
kind: Pod
metadata:
  name: kubectl
  annotations:
    pod.alpha.kubernetes.io/init-containers: '[
        {
            "name": "download",
            "image": "busybox",
            "command": [
                "wget", 
            "-O", 
                "/work-dir/kubectl", 
                "http://storage.googleapis.com/kubernetes-release/release/v1.2.4/bin/linux/amd64/kubectl"
            ],
            "volumeMounts": [
                {
                    "name": "workdir",
                    "mountPath": "/work-dir"
                }
            ]
        },
        {
            "name": "chmod",
            "image": "busybox",
            "command": ["chmod", "755", "/work-dir/kubectl"],
            "volumeMounts": [
                {
                    "name": "workdir",
                    "mountPath": "/work-dir"
                }
            ]
        }
    ]'
spec:
  containers:
  - name: kubectl
    image: busybox
    command:
    - /bin/sleep
    - "36000"
    volumeMounts:
    - name: workdir
      mountPath: /usr/local/bin
  dnsPolicy: Default
  volumes:
  - name: workdir
    emptyDir: {}
```

As soon as the Pod is in state Running, you can then use the downloaded kubectl
binary - `kubectl exec` into the Pod container to `kubectl` ;):

```
kubectl exec -t -i kubectl kubectl version
Client Version: version.Info{Major:"1", Minor:"2", GitVersion:"v1.2.4", GitCommit:"3eed1e3be6848b877ff80a93da3785d9034d0a4f", GitTreeState:"clean"}
Server Version: version.Info{Major:"1", Minor:"3+", GitVersion:"v1.3.0-beta.2", GitCommit:"caf9a4d87700ba034a7b39cced19bd5628ca6aa3", GitTreeState:"clean"}
```
Read more about init containers and how to use them in [Handling initialization](http://kubernetes.io/docs/user-guide/production-pods/#handling-initialization) at the docs.

## Use custom Seccomp Profiles for pods/containers ([#25324], *alpha*)

Since version 1.10 Docker supports [Seccomp Profiles] to lock down the
privileges of executed containers on a granular basis. [Seccomp] implements
this sandboxing by providing an ability to intercept syscalls. This filtering
is defined by [BPF] rules.

[Seccomp Profiles]:https://blog.docker.com/2016/02/docker-engine-1-10-security/
[Seccomp]:https://en.wikipedia.org/wiki/Seccomp
[BPF]:https://en.wikipedia.org/wiki/Berkeley_Packet_Filter
[#25324]:https://github.com/kubernetes/kubernetes/pull/25324

To bind a specific profile to a Pod, you can use the following alpha
annotations:

- Specify a Seccomp profile for all containers of the Pod:
  `seccomp.security.alpha.kubernetes.io/pod`
- Specify a Seccomp profile for an individual container:
  `container.seccomp.security.alpha.kubernetes.io/${container_name}`

For the value of the annotation you can use on of the following contents:

|Value|Description|
|---|---|
|`runtime/default`|the default profile for the container runtime|
|`unconfined`|unconfined profile, disable Seccomp sandboxing|
|`localhost/<profile-name>`|the profile installed to the node's local seccomp profile root|

If you want to use use custom profiles (prefixed with `localhost/`), you have
to copy these to all worker nodes in your cluster. The default folder for
profiles is `/var/lib/kubelet/seccomp`.

### Example: How to prevent `chmod` syscall

In this example we spin up two Pods. Both try to change the permissions on a
file. While the Pod `chmod-unconfined` runs with the default profile of Docker
and exits successfully, the same command in Pod `chmod-prevented` fails,
as it is not allowed by its Seccomp profile.

Please be aware that you have to support this prerequisites:

- Version of Docker 1.10 or higher
- Version of Kubernetes higher than 1.3.0-beta.2 (cf.
  [#28159](https://github.com/kubernetes/kubernetes/pull/28159/commits))
- Copy the prevent-chmod file to all worker nodes

#### Seccomp Profile `/var/lib/kubelet/seccomp/prevent-chmod`

```json
{
  "defaultAction": "SCMP_ACT_ALLOW",
  "syscalls": [
    {
      "name": "chmod",
      "action": "SCMP_ACT_ERRNO"
    }
  ]
}
```

#### Pod specification `seccomp-pods.yaml`
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: chmod-unconfined
spec:
  containers:
  - name: chmod
    image: busybox
    command:
      - "chmod"
    args:
      - "666"
      - /etc/hostname
  restartPolicy: Never
---
apiVersion: v1
kind: Pod
metadata:
  name: chmod-prevented
  annotations:
    seccomp.security.alpha.kubernetes.io/pod: localhost/prevent-chmod
spec:
  containers:
  - name: chmod
    image: busybox
    command:
      - "chmod"
    args:
      - "666"
      - /etc/hostname
  restartPolicy: Never
```

#### Create pods

```
$ kubectl create -f seccomp-pods.yaml
pod "chmod-unconfined" created
pod "chmod-prevented" created

$ kubectl get pods -a
NAME               READY     STATUS      RESTARTS   AGE
chmod-prevented    0/1       Error       0          8s
chmod-unconfined   0/1       Completed   0          8s
```

Let us know what you think of these 1.3 features and any other nuggets you find that are useful in the comments section below. Our blogs about PetSet and Ubernetes will be coming soon. In the meantime, happy Kube'ng in 1.3!
