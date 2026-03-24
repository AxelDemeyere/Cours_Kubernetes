# Exercice 5

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
minikube   Ready    control-plane   22h   v1.35.1
```

## Étape 3 — Créer le fichier de manifeste

## Étape 4 — Déployer le pod via le manifeste

```bash
kubectl apply -f pod.yaml
```

```
# Retour :

pod/app-2048 created
```

* Vérifier que le pod est bien lancé

```bash
kubectl get pods
```

```
# Retour :

NAME       READY   STATUS    RESTARTS   AGE
app-2048   1/1     Running   0          31s
```

* Pour obtenir le détail du pod

```bash
kubectl describe pod app-2048
```