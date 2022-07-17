# Zing Server

![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=flat-square&logo=Node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47a248?style=flat-square&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/-AWS-232f3e?style=flat-square&logo=amazonaws&logoColor=white)


### Table of Contents  
- [Introduction](https://github.com/zingithq/server#introduction)
- [Installation](https://github.com/zingithq/server#installation)
- [Contribute](https://github.com/zingithq/server#contribute)

## Introduction
Time is important but, so is food. Welcome **ZING**! A mobile application that allows you to pre-order your food and skip the queue.

**You can Check the landing page <a href='https://zingnow.in'>here</a>**

<img src='https://zingnow.in/M2.webp' width="320" height="600"/>

## Installation
- Clone the git repository using the below code snippet:
```javascript
git clone https://github.com/zingithq/server
```
- Change your current working directory to the project folder:
```javascript
cd server
```
- In the root of the project, make a new file **.env** to store the environment variables:
```javascript
touch .env
vi .env
```
- Copy the following content in the **.env** file and save it:
```javascript
// These are example values, but works well with these.
PORT= 8080 
MONGO_URI= mongodb://localhost:27017/zingit
JWT_SECRET= blablasecrethello123
ENVIRONMENT= development
CRYPTO_KEY= 11111111111111111111111111111111
CRYPTO_IV= 1111111111111111
ORIGIN_EXPIRY_TIME= 300
```

- Install the required dependencies and start the server in dev mode:
```javascript
npm i && npm run dev
```
**Note:**
You must have **_NodeJs_, _npm_, _mongodb_** installed in your system in order to run the project properly


## Contribute
Any kind of contributions are welcome to this project. Go through the below mentioned steps to contribute.
- Proceed by installing the project in your system. You can go through [Installation](https://github.com/zingithq/server#installation) for that.
- Create an issue for the feature/fix you are planning on implementing.
- To push the changes, create a new branch with the following scheme: YOUR NAME / Feature Summary
- Create a pull request with a proper commit heading and message. Add _AdityaKG-169_ as the reviewer.

### Got any questions?
Reach out to me on [email](mailto:adityakrishnaoff@gmail.com) or [linkedin](https://linkedin.com/in/adityakrishnagupta).
