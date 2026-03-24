# Exercice 7

## Étape 1 — Créer le cluster kind

```bash
kind create cluster --config kind/kind-cluster.yaml --name exo7
```

```
# Retour :

Creating cluster "exo7" ...
 ✓ Ensuring node image (kindest/node:v1.35.0) 🖼
 ✓ Preparing nodes 📦 📦 📦 📦 
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-exo7"
```

## Étape 2 — Se connecter au cluster

* On vérifie l'état des nœuds

```bash
kubectl get nodes
```

```
# Retour :

NAME                 STATUS   ROLES           AGE   VERSION
exo7-control-plane   Ready    control-plane   47s   v1.35.0
exo7-worker          Ready    <none>          36s   v1.35.0
exo7-worker2         Ready    <none>          36s   v1.35.0
exo7-worker3         Ready    <none>          36s   v1.35.0
```

## Étape 3 — Labelliser les nœuds workers

```bash
kubectl label node exo7-worker  country=france
kubectl label node exo7-worker2 country=japon
kubectl label node exo7-worker3 country=usa
```

```
# Retour :

node/exo7-worker labeled
node/exo7-worker2 labeled
node/exo7-worker3 labeled
```

* Vérifier que les labels sont bien appliqués

```bash
kubectl get nodes --show-labels
```

```
# Retour :

NAME                 STATUS   ROLES           AGE   LABELS
exo7-control-plane   Ready    control-plane   86s   ...
exo7-worker          Ready    <none>          75s   ...,country=france,...
exo7-worker2         Ready    <none>          75s   ...,country=japon,...
exo7-worker3         Ready    <none>          75s   ...,country=usa,...
```

## Étape 4 — Tainter les nœuds workers


```bash
kubectl taint node exo7-worker  country=france:NoSchedule
kubectl taint node exo7-worker2 country=japon:NoSchedule
kubectl taint node exo7-worker3 country=usa:NoSchedule
```

```
# Retour :

node/exo7-worker tainted
node/exo7-worker2 tainted
node/exo7-worker3 tainted
```

## Étape 5 — Créer les fichiers de manifeste

```
manifests/
├── france.yaml   (Deployment nginx:alpine     + Service NodePort 30080)
├── japon.yaml    (Deployment exo4-api:v2      + Service NodePort 30300)
└── usa.yaml      (Deployment quchaonet/2048   + Service NodePort 30808)
```

## Étape 6 — Appliquer les manifestes


```bash
kubectl apply -f manifests/
```

```
# Retour :

deployment.apps/nginx-france created
service/service-france created
deployment.apps/api-japon created
service/service-japon created
deployment.apps/app-2048-usa created
service/service-usa created
```

## Étape 7 — Vérifier que chaque pod est sur le bon nœud

```bash
kubectl get pods -o wide
```

```
# Retour :

NAME                            READY   STATUS    RESTARTS   AGE   IP           NODE           NOMINATED NODE   READINESS GATES
api-japon-74f59ddbd4-59hsh      1/1     Running   0          29s   10.244.3.2   exo7-worker2   <none>           <none>
app-2048-usa-d78c5ff99-zq87f    1/1     Running   0          28s   10.244.2.2   exo7-worker3   <none>           <none>
nginx-france-56bb957cf9-spkrv   1/1     Running   0          29s   10.244.1.2   exo7-worker    <none>           <none>
```

* Vérifier les services

```bash
kubectl get services
```

```
# Retour :

NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP          2m50s
service-france   NodePort    10.96.122.200   <none>        80:30080/TCP     51s
service-japon    NodePort    10.96.224.73    <none>        3000:30300/TCP   51s
service-usa      NodePort    10.96.142.146   <none>        8080:30808/TCP   50s
```

## Étape 8 — Tester les déploiements

```bash
# France - NGINX
http://localhost:30080

# Japon - API Express
http://localhost:30300

# USA - Jeu 2048
http://localhost:30808
```

