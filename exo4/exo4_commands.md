# Exercice 4

## Étape 1 — Créer l'image de l'applicatif

```bash
docker build -t axeldemeyere/exo4-api:v1 .
```

## Étape 2 — Héberger l'image sur Docker Hub

```bash
docker login
```

```bash
docker push axeldemeyere/exo4-api:v1
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

NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   4h17m   v1.35.1
```

## Étape 5 — Déployer l'application via son image publique

```bash
kubectl create deployment exo4-api --image=axeldemeyere/exo4-api:v1
```

* Vérifier que le pod est bien lancé

```bash
kubectl get pods
```

```
# Retour :

NAME                        READY   STATUS    RESTARTS   AGE
exo4-api-78cd565546-tdl5p   1/1     Running   0          91s
```

## Étape 6 — Créer un Service LoadBalancer pour exposer le déploiement

```bash
kubectl expose deployment exo4-api --type=LoadBalancer --port=3000
```

* Vérifier que le service est créé

```bash
kubectl get services
```

```
# Retour :

NAME       TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
exo4-api   LoadBalancer   10.107.113.208   127.0.0.1     3000:32685/TCP   25s
```

## Étape 7 — Créer un tunnel minikube

```bash
minikube tunnel
```

```
# Retour :

* Tunnel démarré avec succès

* REMARQUE : veuillez ne pas fermer ce terminal car ce processus doit rester actif pour que le tunnel soit accessible...

* Tunnel de démarrage pour le service exo4-api.
```

* Dans un autre terminal, vérifier que l'EXTERNAL-IP est bien assignée

```bash
kubectl get services
```

```
# Retour :

NAME       TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
exo4-api   LoadBalancer   10.107.113.208   127.0.0.1     3000:32685/TCP   74s
```

## Étape 8 — Tester l'API v1 via un client REST

```bash
http://127.0.0.1:3000/
```

```
# Retour :

{"message":"Bienvenue sur l'API","version":"1.0.0"}
```

```bash
http://127.0.0.1:3000/health
```

```
# Retour :

{"status":"ok","version":"1.0.0"}
```

## Étape 9 — Créer la v2 de l'applicatif avec de nouveaux endpoints

* Mettre à jour `app.js` avec les nouvelles routes `/users` et `/products`, puis builder et publier la v2

```bash
docker build -t axeldemeyere/exo4-api:v2 .
```

```bash
docker push axeldemeyere/exo4-api:v2
```

## Étape 10 — Mettre à jour le déploiement au sein du cluster

```bash
kubectl set image deployment/exo4-api exo4-api=axeldemeyere/exo4-api:v2
```

* Suivre l'avancement du rollout

```bash
kubectl rollout status deployment/exo4-api
```

```
# Retour :

deployment "exo4-api" successfully rolled out
```

## Étape 11 — Tester les nouvelles routes de l'API v2

```bash
http://127.0.0.1:3000/
```

```
# Retour :

{"message":"Bienvenue sur l'API","version":"2.0.0"}
```

```bash
http://127.0.0.1:3000/users
```

```
# Retour :

{"users":[{"id":1,"name":"Axel"},{"id":2,"name":"Manon"}]}
```

```bash
http://127.0.0.1:3000/products
```

```
# Retour :

{"items":[{"id":1,"label":"Téléphone"},{"id":2,"label":"Clavier"}]}
```
