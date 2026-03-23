# Exercice 2

## Étape 1 — Créer le cluster

```bash
minikube start --driver=docker
```

## Étape 2 — Se connecter au cluster

* On vérifie l'état des nœuds
```bash
kubectl get nodes
```

```
# Retour :

NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   33m   v1.35.1
```

## Étape 3 — Déployer l'application 2048

```bash
kubectl create deployment app-2048 --image=quchaonet/2048
```

* Vérifier que le pod est bien lancé

```bash
kubectl get pods
```

```
# Retour :

NAME                        READY   STATUS    RESTARTS   AGE
app-2048-55f584887b-vjc2w           1/1     Running   0             9s
```

## Étape 4 — Créer un Service LoadBalancer pour exposer le déploiement

```bash
kubectl expose deployment app-2048 --type=LoadBalancer --port=8080
```

* Vérifier que le service est créé

```bash
kubectl get services
```

```
# Retour :

NAME         TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
app-2048     LoadBalancer   10.108.38.209    <pending>     8080:32022/TCP   6s
```

## Étape 5 — Créer un tunnel minikube

```bash
minikube tunnel
```

```
# Retour :

* Tunnel démarré avec succès

* REMARQUE : veuillez ne pas fermer ce terminal car ce processus doit rester actif pour que le tunnel soit accessible...

* Tunnel de démarrage pour le service app-2048.
```

* Dans un autre terminal, vérifier que l'EXTERNAL-IP est bien assignée

```bash
kubectl get services
```

```
# Retour :

NAME               TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
app-2048           LoadBalancer   10.108.38.209    127.0.0.1     8080:32022/TCP   3m17s
```

* Accéder à l'application dans le navigateur :

```
http://127.0.0.1:8080
```