<p align="center">
  <img src="https://user-images.githubusercontent.com/55491354/127771279-28aba28e-f578-444c-b2e7-a54bbd852556.png" alt="stats" height="100" width="100"><br>
  <b>Github User Stats API</b><br>
  <a href="https://github.com/argon1025/Github-User-Stats-API/issues">💣Issue</a> |
  <a href="# EndPoint">📚EndPoint Document</a> |
  <a href="https://github.com/argon1025/TILog-server">🌌TILog Blog Project</a>
  <br><br>
</p>

# how It works?
Since the GitHub API only allows 5k requests per hour,  
This Project Uses multiple tokens to bypass the Github requests limit.

# How To run
## 1. Clone this Project
```
git clone https://github.com/argon1025/Github-User-Stats-API.git
```

## 2. Move Project folder and Install npm module
```
cd Github-User-Stats-API
npm install
```
### 3. Create .ENV File
```
cd Github-User-Stats-API
vi .env
```
```
// .env
SERVER_PORT=8484
SERVER_HOST=localhost
GITHUB_TOKEN_1=asdhj123hg12ghj12gjh21g31hj23
GITHUB_TOKEN_2=fgh87fgh687hfg687hfg786fgh867
```
Enter as many Github tokens as you have. `GITHUB_TOKEN_${number}`
### 4. Start Server
```
npm run start:dev
```


# EndPoint
## 1. UserStats
### /stats/{username}
Request User Stats data
#### CURL
```
curl -X 'GET' \
  'http://localhost/stats/{username}' \
  -H 'accept: */*'
```
#### Response
```
{
  "name": "Leeseongrok",
  "totalPRs": 67,
  "totalCommits": 1280,
  "totalIssues": 108,
  "totalStars": 5,
  "contributedTo": 0
}
```
### /stats/{username}/top-language
Request User Top language data
#### CURL
```
curl -X 'GET' \
  'http://localhost:8484/stats/{username}/top-language' \
  -H 'accept: */*'
```
#### Response
```
{
  "JavaScript": {
    "name": "JavaScript",
    "color": "#f1e05a",
    "size": 389697
  },
  "TypeScript": {
    "name": "TypeScript",
    "color": "#2b7489",
    "size": 147966
  },
  "Swift": {
    "name": "Swift",
    "color": "#ffac45",
    "size": 74436
  },
  "Python": {
    "name": "Python",
    "color": "#3572A5",
    "size": 30346
  },
  "Java": {
    "name": "Java",
    "color": "#b07219",
    "size": 9330
  },
}
```

## 2. Repositories
### /repo/{username}
Request All Repositories data
#### CURL
```
curl -X 'GET' \
  'http://localhost:8484/repo/{username}' \
  -H 'accept: */*'
```
#### Response
```
{
  "name": "Babelfish_API",
  "nameWithOwner": "argon1025/Babelfish_API",
  "isPrivate": false,
  "isArchived": false,
  "isTemplate": false,
  "stargazers": {
    "totalCount": 2
  },
  "description": "Babelfish_API",
  "primaryLanguage": {
    "color": "#f1e05a",
    "id": "MDg6TGFuZ3VhZ2UxNDA=",
    "name": "JavaScript"
  },
  "forkCount": 0
}
```
### /repo/{username}?reponame={Repositories Name}
Request Repositories data
#### CURL
```
curl -X 'GET' \
  'http://localhost:8484/repo/{username}?reponame={reponame}' \
  -H 'accept: */*'
```
#### Response
```
{
  "name": "Babelfish_API",
  "nameWithOwner": "argon1025/Babelfish_API",
  "isPrivate": false,
  "isArchived": false,
  "isTemplate": false,
  "stargazers": {
    "totalCount": 2
  },
  "description": "Babelfish_API",
  "primaryLanguage": {
    "color": "#f1e05a",
    "id": "MDg6TGFuZ3VhZ2UxNDA=",
    "name": "JavaScript"
  },
  "forkCount": 0
}
```
### /repo/{username}/pinned-repositories
Request pinned Repositories data
#### CURL
```
curl -X 'GET' \
  'http://localhost:8484/repo/argon1025/pinned-repositories' \
  -H 'accept: */*'
```
#### Response
```
[
  {
    "id": "MDEwOlJlcG9zaXRvcnkzMzA1OTM1MDc=",
    "name": "Babelfish_API",
    "nameWithOwner": "argon1025/Babelfish_API",
    "isPrivate": false,
    "isArchived": false,
    "isTemplate": false,
    "stargazers": {
      "totalCount": 2
    },
    "description": "Babelfish_API",
    "primaryLanguage": {
      "color": "#f1e05a",
      "id": "MDg6TGFuZ3VhZ2UxNDA=",
      "name": "JavaScript"
    },
    "forkCount": 0
  },
  {
    "id": "MDEwOlJlcG9zaXRvcnkzMzI3NTY4NTM=",
    "name": "babelfish",
    "nameWithOwner": "argon1025/babelfish",
    "isPrivate": false,
    "isArchived": false,
    "isTemplate": false,
    "stargazers": {
      "totalCount": 1
    },
    "description": "Babelfish Frontend project with React",
    "primaryLanguage": {
      "color": "#f1e05a",
      "id": "MDg6TGFuZ3VhZ2UxNDA=",
      "name": "JavaScript"
    },
    "forkCount": 0
  }
  ]
```


# +
> inspired by this project [here](https://github.com/anuraghazra/github-readme-stats)
> <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
