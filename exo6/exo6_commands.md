# Exercice 6

## Prérequis — Nettoyer les ressources des exercices précédents

* Lister tout ce qui tourne dans le cluster

```bash
kubectl get all
```

* Supprimer les déploiements et services des anciens exercices qui utilisent le port 80

```bash
kubectl delete deployment --all
kubectl delete service --all
```

> ⚠️ Cela supprime toutes les ressources du namespace `default`. Si vous souhaitez ne supprimer qu'un seul exercice, utilisez son nom exact :
> ```bash
> kubectl delete deployment <nom> && kubectl delete service <nom>
> ```

* Vérifier que tout est bien supprimé (seul `kubernetes` doit rester dans les services)

```bash
kubectl get all
```

```
# Retour :

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   24h
```

---

## Étape 1 — Choisir l'image

L'image publique `nginxdemos/hello` répond au besoin.

## Étape 2 — Créer le cluster

```bash
minikube start --driver=docker
```

## Étape 3 — Se connecter au cluster

* On vérifie l'état des nœuds

```bash
kubectl get nodes
```

```
# Retour :

NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   24h   v1.35.1
```

## Étape 4 — Créer les fichiers de manifeste

Deux fichiers sont nécessaires :
* `deployment.yaml`
* `service.yaml` 

## Étape 5 — Appliquer les manifestes

```bash
kubectl apply -f deployment.yaml
```

```
# Retour :

deployment.apps/nginx-ip created
```

```bash
kubectl apply -f service.yaml
```

```
# Retour :

service/nginx-ip-service created
```

## Étape 6 — Vérifier que les pods sont bien lancés

```bash
kubectl get pods -o wide
```

```
# Retour :

NAME                        READY   STATUS    RESTARTS   AGE   IP
nginx-ip-b69c58d75-2zdkb            1/1     Running   0  14s   10.244.0.41   
nginx-ip-b69c58d75-rbdzh            1/1     Running   0  14s   10.244.0.43  
nginx-ip-b69c58d75-tx7b4            1/1     Running   0  14s   10.244.0.42
```

* Vérifier que le service est créé

```bash
kubectl get services
```

```
# Retour :

NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx-ip-service   LoadBalancer   10.109.243.210  <pending>     80:31082/TCP   71s
```

## Étape 7 — Créer un tunnel minikube

```bash
minikube tunnel
```

```
# Retour :

* Tunnel démarré avec succès

* REMARQUE : veuillez ne pas fermer ce terminal car ce processus doit rester actif pour que le tunnel soit accessible...

* Tunnel de démarrage pour le service nginx-ip-service.
```

* Dans un autre terminal, vérifier que l'EXTERNAL-IP est assignée

```bash
kubectl get services
```

```
# Retour :

NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx-ip-service   LoadBalancer   10.109.243.210   127.0.0.1    80:31082/TCP   105s
```

## Étape 8 — Tester le déploiement

```bash
http://127.0.0.1/
```