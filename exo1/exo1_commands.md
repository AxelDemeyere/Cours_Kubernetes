# Exercice 1

## Étape 1 — Créer le cluster

```bash
minikube start --driver=docker
```

## Étape 2 — Se connecter au cluster

* On vérifie l'état des nœuds
```bash
kubectl get nodes
```

## Étape 3 — Déployer NGINX avec le tag alpine

```bash
kubectl create deployment nginx-deployment --image=nginx:alpine
```

* Vérifier que le pod est bien lancé 

```bash
kubectl get pods
```

```
# Retour : 

NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7d74c5f744-72cgl   1/1     Running   0          34s
```

## Étape 4 — Créer un Service pour exposer le déploiement

```bash
kubectl expose deployment nginx-deployment --type=NodePort --port=80 --target-port=80
```

* Vérifier que le service est crée

```bash
kubectl get services
```

```
# Retour : 

NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
nginx-deployment   NodePort    10.108.194.189   <none>        80:31211/TCP   36s

```

## Étape 5 — Créer un tunnel minikube

```bash 
minikube service nginx-deployment
```
```
# Retour :

PS C:\Users\a.demeyere\WebstormProjects\Kubernetes> minikube service nginx-deployment
┌───────────┬──────────────────┬─────────────┬───────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │            URL            │
├───────────┼──────────────────┼─────────────┼───────────────────────────┤
│ default   │ nginx-deployment │ 80          │ http://192.168.49.2:31211 │
└───────────┴──────────────────┴─────────────┴───────────────────────────┘
* Tunnel de démarrage pour le service nginx-deployment.
┌───────────┬──────────────────┬─────────────┬────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │          URL           │
├───────────┼──────────────────┼─────────────┼────────────────────────┤
│ default   │ nginx-deployment │             │ http://127.0.0.1:55288 │
└───────────┴──────────────────┴─────────────┴────────────────────────┘
* Ouverture du service default/nginx-deployment dans le navigateur par défaut...
! Comme vous utilisez un pilote Docker sur windows, le terminal doit être ouvert pour l'exécuter.
```