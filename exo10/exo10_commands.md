# Exercice 10

## Étape 1 — Créer le cluster KinD

```bash
kind create cluster --config kind/kind-config.yaml
```

```
# Retour :

Creating cluster "exo10" ...
 ✓ Ensuring node image (kindest/node:v1.35.0) 🖼
 ✓ Preparing nodes 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-exo10"
```

## Étape 2 — Vérifier l'état du cluster

```bash
kubectl get nodes
```

```
# Retour :

NAME                  STATUS   ROLES           AGE   VERSION
exo10-control-plane   Ready    control-plane   30s   v1.35.0
exo10-worker          Ready    <none>          18s   v1.35.0
```

## Étape 3 — Construire les images Docker

```bash
docker build -t auth-api:v1   apps/auth-api/
docker build -t tasks-api:v1  apps/tasks-api/
docker build -t users-api:v1  apps/users-api/
docker build -t frontend:v1   apps/frontend/
```

## Étape 4 — Charger les images dans le cluster KinD

```bash
kind load docker-image auth-api:v1  --name exo10
kind load docker-image tasks-api:v1 --name exo10
kind load docker-image users-api:v1 --name exo10
kind load docker-image frontend:v1  --name exo10
```

## Étape 5 — Appliquer les manifestes

```bash
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests/tasks-pv.yaml
kubectl apply -f manifests/
```

```
# Retour :

namespace/fullstack configured
persistentvolume/tasks-pv configured
configmap/auth-access-configmap created
deployment.apps/auth-deployment created
service/auth-service created
deployment.apps/frontend-deployment created
service/frontend-service created
namespace/fullstack unchanged
persistentvolume/tasks-pv unchanged
persistentvolumeclaim/tasks-pvc created
deployment.apps/tasks-deployment created
service/tasks-service created
deployment.apps/users-deployment created
service/users-service created
```

## Étape 6 — Vérifier que le PVC est lié au PV

```bash
kubectl get pv
kubectl get pvc -n fullstack
```

```
# Retour :

NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                 STORAGECLASS   AGE
tasks-pv   256Mi      RWO            Retain           Bound    fullstack/tasks-pvc   manual         11s

NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
tasks-pvc   Bound    tasks-pv   256Mi      RWO            manual         16s
```


## Étape 7 — Vérifier que tous les pods sont Running

```bash
kubectl get pods -n fullstack -o wide
```

```
# Retour :

NAME                                    READY   STATUS    RESTARTS   AGE   NODE
auth-deployment-b5bb45576-dwgl2         1/1     Running   0          30s   exo10-worker
frontend-deployment-5cff5765fb-9ck9w    1/1     Running   0          30s   exo10-worker
tasks-deployment-947997879-tvbqj        1/1     Running   0          30s   exo10-worker
users-deployment-76bdc459cc-zfdwk       1/1     Running   0          30s   exo10-worker
```

```bash
kubectl get services -n fullstack
```

```
# Retour :

NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
auth-service       ClusterIP   10.96.10.1      <none>        80/TCP         52s
frontend-service   NodePort    10.96.10.2      <none>        80:30000/TCP   52s
tasks-service      ClusterIP   10.96.10.3      <none>        8000/TCP       52s
users-service      ClusterIP   10.96.10.4      <none>        8080/TCP       52s
```

## Étape 8 — Tester l'application

```
http://localhost:30000
```

* Ajouter une tâche via le formulaire
* Cliquer sur "Fetch Tasks" pour recharger la liste

## Étape 9 — Vérifier la persistance des tâches

**Terminal 1**
```bash
kubectl get pods -n fullstack -w
```

**Terminal 2**
```bash
kubectl delete pod -n fullstack -l app=tasks
```

```
# Retour Terminal 1 :

tasks-deployment-7885fb48cc-fd5zd      1/1     Terminating   0          3m11s
tasks-deployment-7885fb48cc-zrdw7      0/1     Pending       0          0s
tasks-deployment-7885fb48cc-fd5zd      1/1     Terminating   0          3m11s
tasks-deployment-7885fb48cc-zrdw7      0/1     Pending       0          0s
tasks-deployment-7885fb48cc-zrdw7      0/1     Init:0/1      0          0s
tasks-deployment-7885fb48cc-zrdw7      0/1     PodInitializing   0          1s
tasks-deployment-7885fb48cc-zrdw7      1/1     Running           0          2s
```

* Recharger la pge du navigateur et cliquer sur "Fetch Tasks"

## Étape 10 — Tester l'API utilisateurs

```bash
kubectl port-forward -n fullstack service/users-service 8080:8080
```

```powershell
# Dans un autre terminal — Inscription
irm -Method Post http://localhost:8080/signup -ContentType "application/json" -Body '{"email":"test@test.com","password":"password123"}'
```

```
# Retour :

message
-------
User created!
```

```powershell
# Connexion
irm -Method Post http://localhost:8080/login -ContentType "application/json" -Body '{"email":"test@test.com","password":"password123"}'
```

```
# Retour :

token
-----
abc
```
