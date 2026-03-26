# Exercice 9

## Étape 1 — Créer le cluster KinD

```bash
kind create cluster --config kind/kind-config.yaml
```

```
# Retour :

Creating cluster "exo9" ...
 ✓ Ensuring node image (kindest/node:v1.35.0) 🖼
 ✓ Preparing nodes 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-exo9"
```

## Étape 2 — Vérifier l'état du cluster

```bash
kubectl get nodes
```

```
# Retour :

NAME                 STATUS   ROLES           AGE   VERSION
exo9-control-plane   Ready    control-plane   53s   v1.35.0
exo9-worker          Ready    <none>          42s   v1.35.0
```

## Étape 3 — Appliquer les manifestes

```bash
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests/pv.yaml
kubectl apply -f manifests/pvc.yaml
kubectl apply -f manifests/secret.yaml
kubectl apply -f manifests/deployment.yaml
kubectl apply -f manifests/service.yaml
```

```
# Retour :

namespace/postgres created
persistentvolume/postgres-pv created
persistentvolumeclaim/postgres-pvc created
secret/postgres-secret created
deployment.apps/postgres created
service/postgres-service created
```

## Étape 4 — Vérifier que le PV et le PVC sont liés

```bash
kubectl get pv
```

```
# Retour :

NAME          CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                   STORAGECLASS   VOLUMEATTRIBUTESCLASS   REASON   AGE
postgres-pv   1Gi        RWO            Retain           Bound    postgres/postgres-pvc   manual         <unset>                          34s
```

```bash
kubectl get pvc -n postgres
```

```
# Retour :

NAME           STATUS   VOLUME        CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
postgres-pvc   Bound    postgres-pv   1Gi        RWO            manual         <unset>                 53s
```

## Étape 5 — Vérifier que le pod est Running

```bash
kubectl get pods -n postgres -o wide
```

```
# Retour :

NAME                       READY   STATUS    RESTARTS   AGE   IP           NODE          NOMINATED NODE   READINESS GATES
postgres-fdbbfcf77-gwhk4   1/1     Running   0          69s   10.244.1.2   exo9-worker   <none>           <none>
```

## Étape 6 — Insérer des données dans PostgreSQL

```bash
# Créer une table
kubectl exec -n postgres deployment/postgres -- psql -U admin -d mydb -c "CREATE TABLE utilisateurs (id SERIAL PRIMARY KEY, nom TEXT);"
```

```
# Retour :

CREATE TABLE
```

```bash
# Insérer des données
kubectl exec -n postgres deployment/postgres -- psql -U admin -d mydb -c "INSERT INTO utilisateurs (nom) VALUES ('Axel'), ('Manon');"
```

```
# Retour :

INSERT 0 2
```

```bash
# Vérifier les données
kubectl exec -n postgres deployment/postgres -- psql -U admin -d mydb -c "SELECT * FROM utilisateurs;"
```

```
# Retour :

 id | nom
----+-------
  1 | Axel
  2 | Manon
(2 rows)
```

## Étape 7 — Supprimer le pod et vérifier la persistance

**Terminal 1**
```bash
kubectl get pods -n postgres -w
```

**Terminal 2**
```bash
kubectl delete pod -n postgres -l app=postgres
```

```
# Retour Terminal 2 :

pod "postgres-7d9c8f4b6-xk2pn" deleted
```

```
# Retour Terminal 1 :

NAME                        READY   STATUS    RESTARTS   AGE
postgres-7d9c8f4b6-xk2pn   1/1     Running   0          2m
postgres-7d9c8f4b6-xk2pn   1/1     Terminating   0       2m
postgres-7d9c8f4b6-nq8vt   0/1     Pending       0       0s
postgres-7d9c8f4b6-nq8vt   0/1     ContainerCreating   0   1s
postgres-7d9c8f4b6-nq8vt   1/1     Running   0          5s
```

## Étape 8 — Vérifier que les données sont toujours présentes

```bash
kubectl exec -n postgres deployment/postgres -- psql -U admin -d mydb -c "SELECT * FROM utilisateurs;"
```

```
# Retour :

 id | nom
----+-------
  1 | Axel
  2 | Manon
(2 rows)
```


## Étape 9 — Inspecter les ressources

```bash
# Voir le détail du PV
kubectl describe pv postgres-pv
```

```
# Retour :

Name:            postgres-pv
...
Status:          Bound
Claim:           postgres/postgres-pvc
Reclaim Policy:  Retain
Access Modes:    RWO
Capacity:        1Gi
...
```

```bash
# Voir le Secret
kubectl get secret postgres-secret -n postgres -o yaml
```

```
# Retour :

apiVersion: v1
data:
  POSTGRES_DB: bXlkYg==
  POSTGRES_PASSWORD: YWRtaW4xMjM0
  POSTGRES_USER: YWRtaW4=
kind: Secret
...
```

## Nettoyage — Supprimer le cluster

```bash
kind delete cluster --name exo9
```

```
# Retour :

Deleting cluster "exo9" ...
```



