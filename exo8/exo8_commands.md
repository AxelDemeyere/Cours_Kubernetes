# Exercice 8

## Étape 1 — Créer le cluster KinD

```bash
kind create cluster --config kind/kind-cluster.yaml
```

```
# Retour :

Creating cluster "exo8" ...
 ✓ Ensuring node image (kindest/node:v1.35.0) 🖼
 ✓ Preparing nodes 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-exo8"
```

## Étape 2 — Vérifier l'état du cluster

```bash
kubectl get nodes
```

```
# Retour :

NAME                 STATUS   ROLES           AGE    VERSION
exo8-control-plane   Ready    control-plane   110s   v1.35.0
exo8-worker          Ready    <none>          95s    v1.35.0
```

## Étape 3 — Construire l'image Docker

```bash
docker build -t log-api:v1 app/
```

```
# Retour :

[+] Building 12.4s (9/9) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/python:3.12-slim
 => [1/4] FROM docker.io/library/python:3.12-slim
 => [2/4] WORKDIR /app
 => [3/4] COPY requirements.txt .
 => [4/4] RUN pip install --no-cache-dir -r requirements.txt
 => [5/4] COPY app.py .
 => exporting to image
 => => naming to docker.io/library/log-api:v1
```

## Étape 4 — Charger l'image dans le cluster KinD

```bash
kind load docker-image log-api:v1 --name exo8
```

```
# Retour :

Image: "log-api:v1" with ID "sha256:805aff9dac8bff5fb392c5752fb0d141622ec36419e706b2f78d22f6f94eafcc" not yet present on node "exo8-worker", loading...
Image: "log-api:v1" with ID "sha256:805aff9dac8bff5fb392c5752fb0d141622ec36419e706b2f78d22f6f94eafcc" not yet present on node "exo8-control-plane", loading...
```

---

## Scénario 1 — Sans volume

### Étape 5 — Déployer l'API sans volume

```bash
kubectl apply -f manifests/deployment-no-volume.yaml
kubectl apply -f manifests/service.yaml
```

```
# Retour :

deployment.apps/log-api created
service/log-api-service created
```

### Étape 6 — Vérifier que le pod est Running

```bash
kubectl get pods -o wide
```

```
# Retour :

NAME                       READY   STATUS    RESTARTS   AGE   IP           NODE          NOMINATED NODE   READINESS GATES
log-api-7f8958c657-jrr67   1/1     Running   0          12s   10.244.1.2   exo8-worker   <none>           <none>
```

### Étape 7 — Écrire des logs puis simuler un crash

```powershell
# Écrire un message dans le fichier de logs
irm -Method Post http://localhost:30500/log -ContentType "application/json" -Body '{"message": "premier log avant crash"}'
```

```
# Retour :

message                 status
-------                 ------
premier log avant crash ok
```

```powershell
# Lire les logs pour confirmer
irm http://localhost:30500/log
```

```
# Retour :

logs
----
{premier log avant crash}
```

### Étape 8 — Observer le comportement après le crash

> ⚠️ Ouvrir **deux terminaux** : lancer la surveillance dans le Terminal 1, puis envoyer le crash depuis le Terminal 2.

**Terminal 1**
```bash
kubectl get pods -w
```

**Terminal 2**
```powershell
# Simuler un crash (le pod va redémarrer)
irm -Method Post http://localhost:30500/crash
```

```
# Retour Terminal 1 :

NAME                       READY   STATUS    RESTARTS      AGE
log-api-7f8958c657-jrr67   1/1     Running   0             2m10s
log-api-7f8958c657-jrr67   1/1     Running   1 (4s ago)    2m17s
```

```powershell
# Lire les logs après le redémarrage du conteneur
irm http://localhost:30500/log
```

```
# Retour :

logs
----
{}
```

> ✅ **Réponses — Sans volume :**
> - Le pod redémarre-t-il automatiquement ? **Oui**, le Deployment recrée le conteneur (RESTARTS passe à 1).
> - Les données sont-elles toujours présentes ? **Non**, le système de fichiers du conteneur est réinitialisé au redémarrage.

### Étape 9 — Supprimer les ressources du scénario 1

```bash
kubectl delete -f manifests/deployment-no-volume.yaml
```

```
# Retour :

deployment.apps "log-api" deleted
```

---

## Scénario 2 — Avec `emptyDir`

### Étape 10 — Déployer l'API avec un volume `emptyDir`

```bash
kubectl apply -f manifests/deployment-emptydir.yaml
```

```
# Retour :

deployment.apps/log-api created
```

### Étape 11 — Écrire des logs puis simuler un crash

```powershell
irm -Method Post http://localhost:30500/log -ContentType "application/json" -Body '{"message": "log avec emptyDir avant crash"}'

irm http://localhost:30500/log
```

```
# Retour :

logs
----
{log avec emptyDir avant crash}
```

### Étape 12 — Observer le comportement après le crash (emptyDir)

**Terminal 1**
```bash
kubectl get pods -w
```

**Terminal 2**
```powershell
irm -Method Post http://localhost:30500/crash
```

```
# Retour Terminal 1 :

NAME                       READY   STATUS    RESTARTS      AGE
log-api-6b8d4f7c9-mn3lq   1/1     Running   0             45s
log-api-6b8d4f7c9-mn3lq   1/1     Running   1 (4s ago)    52s
```

```powershell
# Lire les logs après redémarrage du conteneur
irm http://localhost:30500/log
```

```
# Retour :

logs
----
{log avec emptyDir avant crash}
```

> ✅ **Réponse — `emptyDir` après crash :**
> - Les données sont-elles toujours présentes ? **Oui**.

### Étape 13 — Supprimer le pod et observer

```bash
kubectl delete pod -l app=log-api
```

```
# Retour :

pod "log-api-6b8d4f7c9-mn3lq" deleted
```

```bash
# Attendre que le nouveau pod soit Running
kubectl get pods -w
```

```
# Retour :

NAME                       READY   STATUS    RESTARTS   AGE
log-api-6b8d4f7c9-pq7rt   1/1     Running   0          5s
```

```bash
# Lire les logs dans le nouveau pod
irm http://localhost:30500/log
```

```
# Retour :

logs
----
{}
```

> ✅ **Réponses — `emptyDir` après suppression du pod :**
> - Un nouveau pod est-il recréé ? **Oui**.
> - Les données sont-elles présentes ? **Non**.

### Étape 14 — Supprimer les ressources du scénario 2

```bash
kubectl delete -f manifests/deployment-emptydir.yaml
```

```
# Retour :

deployment.apps "log-api" deleted
```

---

## Scénario 3 — Avec `hostPath`

### Étape 15 — Déployer l'API avec un volume `hostPath` et une affinité de nœud

```bash
kubectl apply -f manifests/deployment-hostpath.yaml
```

```
# Retour :

deployment.apps/log-api created
```

```bash
kubectl get pods -o wide
```

```
# Retour :

NAME                       READY   STATUS        RESTARTS      AGE    IP           NODE          NOMINATED NODE   READINESS GATES
log-api-5d989dc7b8-trnbq   1/1     Running   0          2m17s   10.244.1.7   exo8-worker   <none>           <none>
```

### Étape 16 — Écrire des logs

```powershell
irm -Method Post http://localhost:30500/log -ContentType "application/json" -Body '{"message": "log avec hostPath"}'

irm http://localhost:30500/log
```

```
# Retour :

logs
----
{log avec hostPath}
```

### Étape 17 — Supprimer le pod et observer la persistance

```bash
kubectl delete pod -l app=log-api
```

```
# Retour :

pod "log-api-5d989dc7b8-trnbq" deleted from default namespace
```

```bash
kubectl get pods -w
```

```
# Retour :

NAME                       READY   STATUS        RESTARTS   AGE
log-api-5d989dc7b8-5wbg9   1/1     Running       0          16s
log-api-5d989dc7b8-trnbq   1/1     Terminating   0          3m4s
```

```bash
# Le nouveau pod est bien sur le même nœud grâce à l'affinité
kubectl get pods -o wide
```

```
# Retour :

NAME                       READY   STATUS    RESTARTS   AGE   IP           NODE          NOMINATED NODE   READINESS GATES
log-api-5d989dc7b8-5wbg9   1/1     Running   0          69s   10.244.1.8   exo8-worker   <none>           <none>
```

```bash
# Lire les logs dans le nouveau pod
irm http://localhost:30500/log
```

```
# Retour :

logs
----
{log avec hostPath}
```

> ✅ **Réponses — `hostPath` après suppression du pod :**
> - Un nouveau pod est-il recréé ? **Oui**, le Deployment recrée le pod automatiquement.
> - Les données sont-elles présentes ? **Oui**, le fichier `/tmp/log-api/logs/events.log` est stocké sur le nœud et persiste entre les pods.
> - Et si le pod est déployé sur le même nœud via l'affinité ? Les données **sont bien présentes** car la `nodeAffinity` garantit que le pod atterrit toujours sur `exo8-worker`, qui possède le fichier hostPath. Sans cette contrainte, si le pod était schedulé sur un autre nœud, les données seraient perdues.

---


## Nettoyage — Supprimer le cluster

```bash
kind delete cluster --name exo8
```

```
# Retour :

Deleting cluster "exo8" ...
Deleted nodes: ["exo8-worker" "exo8-control-plane"]
```
