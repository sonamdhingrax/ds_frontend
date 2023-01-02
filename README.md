# Frontend Architecture with AWS Amplify

![Architecture](/Fronted.png?raw=true "Frontend Architecture")

## Description 
The frontend was created in `React` and uses API Calls to fetch server time from backend API hosted using API Gateway and AWS Lambda. Another API call is used to convert the time returned by backend to Eastern Standard Time.

## Deployment to AWS
The Single Page Application(SPA) is hosted by AWS Amplify which internally creates an S3 bucket to host the build created by the react app. The website is then served by AWS CloudFront which caches the website on edge locations. The Amplify Hosted application also creates a CI/CD Pipeline to build and deploy the react Application to S3.
