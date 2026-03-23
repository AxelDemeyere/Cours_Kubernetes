# Exercice 3

## Étape 1 — Créer l'image de l'applicatif

* Structure des fichiers du projet :

```
exo3/
├── index.html
├── about.html
├── styles.css
└── Dockerfile
```

* Construire l'image Docker

```bash
docker build -t axeldemeyere/exo3-site:latest .
```

## Étape 2 — Héberger l'image sur Docker Hub

```bash
docker login
```

```bash
docker push axeldemeyere/exo3-site:latest
```

## Étape 3 — Créer le cluster

```bash
minikube start --driver=docker
```

## Étape 4 — Se connecter au cluster

* On vérifie l'état des nœuds

```bash
kubectl get nodes
```

```
# Retour :

NAME       STATUS   ROLES           AGE     VERSION
minikube   Ready    control-plane   3h29m   v1.35.1
```

## Étape 5 — Déployer l'application via son image publique

```bash
kubectl create deployment exo3-site --image=axeldemeyere/exo3-site:latest
```

* Vérifier que le pod est bien lancé

```bash
kubectl get pods
```

```
# Retour :

NAME                         READY   STATUS    RESTARTS   AGE
exo3-site-6b556fd986-68z8x   1/1     Running   0              8s
```

## Étape 6 — Créer un Service LoadBalancer pour exposer le déploiement

```bash
kubectl expose deployment exo3-site --type=LoadBalancer --port=80
```

* Vérifier que le service est créé

```bash
kubectl get services
```

```
# Retour :

NAME        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
exo3-site   LoadBalancer   10.106.181.78    <pending>     80:32393/TCP   6s
```

## Étape 7 — Créer un tunnel minikube

```bash
minikube tunnel
```

```
# Retour :

* Tunnel démarré avec succès

* REMARQUE : veuillez ne pas fermer ce terminal car ce processus doit rester actif pour que le tunnel soit accessible...
```

* Dans un autre terminal, vérifier que l'EXTERNAL-IP est bien assignée

```bash
kubectl get services
```

```
# Retour :

NAME        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
exo3-site   LoadBalancer   10.106.181.78    127.0.0.1     80:32393/TCP   2m
```

* Accéder au site dans le navigateur :

```
http://127.0.0.1:80
```

## Étape 8 — Scaler l'applicatif à 3 réplicats

```bash
kubectl scale deployment exo3-site --replicas=3
```

* Vérifier que les 3 pods sont bien lancés

```bash
kubectl get pods
```

```
# Retour :

NAME                         READY   STATUS    RESTARTS   AGE
exo3-site-6b556fd986-68z8x   1/1     Running   0          2m32s
exo3-site-6b556fd986-cnmd9   1/1     Running   0          6s
exo3-site-6b556fd986-qsp56   1/1     Running   0          6s
```
