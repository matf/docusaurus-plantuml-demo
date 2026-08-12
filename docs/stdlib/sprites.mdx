---
sidebar_position: 3
title: Icons and sprites
---

# Icon libraries

Five of the bundled namespaces are sprite libraries: icons you drop into a label with
`<$name>`, or macros that draw a labelled box around one.

Each namespace is a separate bundle, fetched only by the pages that include it. This page
loads five of them; the [C4 page](/docs/stdlib/c4) loads none of these.

## Kubernetes, with macros

`k8s` gives you a macro per resource type, drawing the icon, the name and a stereotype
together.

It also includes `<c4/…>` from inside its own `Common.puml`. The engine would only discover
that halfway through rendering, far too late to fetch anything, so the plugin resolves it up
front from an index built when the bundles were generated — the fence below says nothing about
C4.

```plantuml title="A request reaching a pod"
@startuml
!include <k8s/Common>
!include <k8s/OSS/KubernetesIng>
!include <k8s/OSS/KubernetesSvc>
!include <k8s/OSS/KubernetesPod>
!include <k8s/OSS/KubernetesDeploy>

left to right direction

KubernetesIng(ingress, "docs.example.com", "TLS")
KubernetesSvc(service, "web-svc", "ClusterIP")
KubernetesDeploy(deploy, "web", "3 replicas")
KubernetesPod(pod1, "web-1", "nginx")
KubernetesPod(pod2, "web-2", "nginx")

ingress -> service
service -> pod1
service -> pod2
deploy .> pod1 : manages
deploy .> pod2 : manages
@enduml
```

## Kubernetes, as bare sprites

The separate `kubernetes` namespace is the same icon set without the macros — one include
brings in every sprite at a chosen size, and you place them yourself. Useful when you want the
icons inside your own shapes rather than the library's.

```plantuml title="A namespace laid out by hand"
@startuml
!include <kubernetes/k8s-sprites-labeled-25pct>

left to right direction
skinparam rectangle {
  BackgroundColor White
  BorderColor #326CE5
}

rectangle "<$ing>\ningress" as ing
rectangle "<$svc>\nservice" as svc
rectangle "<$pod>\npod" as pod
rectangle "<$cm>\nconfig map" as cm
rectangle "<$pv>\nvolume" as pv

ing -> svc
svc -> pod
cm .> pod
pv .> pod
@enduml
```

## Azure

```plantuml title="An event-driven Azure workload"
@startuml
!include <azure/AzureCommon>
!include <azure/Analytics/AzureEventHub>
!include <azure/Compute/AzureFunction>
!include <azure/Databases/AzureCosmosDb>
!include <azure/Storage/AzureBlobStorage>

left to right direction

AzureEventHub(hub, "Event Hub", "Ingest")
AzureFunction(fn, "Processor", "Consumption plan")
AzureCosmosDb(db, "Cosmos DB", "Documents")
AzureBlobStorage(blob, "Blob Storage", "Archive")

hub --> fn : triggers
fn --> db : writes
fn --> blob : archives
@enduml
```

## Cloudinsight

A general-purpose set covering the software most infrastructure diagrams need to name —
databases, brokers, languages, runtimes. One include per icon, referenced as `<$name>`.

```plantuml title="A service and its dependencies"
@startuml
!include <cloudinsight/java>
!include <cloudinsight/tomcat>
!include <cloudinsight/kafka>
!include <cloudinsight/cassandra>
!include <cloudinsight/redis>
!include <cloudinsight/nginx>

left to right direction

rectangle "<$nginx>\nEdge" as edge
rectangle "<$tomcat>\nAPI" as api
rectangle "<$java>\nWorker" as worker
queue "<$kafka>\nEvents" as kafka
database "<$cassandra>\nOrders" as store
database "<$redis>\nSessions" as cache

edge -> api
api -> cache
api -> kafka
kafka -> worker
worker --> store
@enduml
```

## Office

Microsoft's stencil set, useful for deployment and network sketches. Sprites are referenced
with `<$name>` inside a label, so a single include gives you an icon you can put anywhere text
goes.

```plantuml title="A small deployment"
@startuml
!include <office/Servers/database_server>
!include <office/Servers/application_server>
!include <office/Concepts/firewall>
!include <office/Users/user>

left to right direction

rectangle "<$user>\nReader" as reader
rectangle "<$firewall>\nFirewall" as fw
rectangle "<$application_server>\nApp server" as app
rectangle "<$database_server>\nDatabase" as db

reader --> fw
fw --> app
app --> db
@enduml
```

## What is not included

The full standard library is 265 MB of source, most of it icon sets: `aws` alone is 114 MB,
and `ibm`, `tupadr3` and the Material icon sets account for most of the rest. Several other
namespaces declare no licence upstream at all, which makes redistributing them the site
owner's decision rather than the plugin's. None of those ship with the plugin.

Any of them can be added from a local checkout:

```bash
git clone --depth 1 https://github.com/plantuml/plantuml-stdlib vendor/plantuml-stdlib
```

```ts title="docusaurus.config.ts"
{
  stdlib: {
    include: ['aws', 'tupadr3'],
    source: 'vendor/plantuml-stdlib/stdlib',
  },
}
```

A diagram that includes a namespace the site does not provide says exactly that, naming the
namespace and the option that adds it, rather than showing PlantUML's grey parsing-error card:

```plantuml title="A namespace this site does not provide"
@startuml
!include <aws/Common>
A -> B
@enduml
```
