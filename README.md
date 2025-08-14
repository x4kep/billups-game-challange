# Rock-Paper-Scissors-Lizard-Spock SERVER and CLIENT

## Overview

This project is a full-stack implementation of the "Rock-Paper-Scissors-Lizard-Spock" game as described in the coding challenge. It includes:

- A **C# ASP.NET Core Web API** backend implementing game logic and REST endpoints.
- A **React** frontend for user interaction (optional).

## Features

- Provides REST API endpoints (**CORS enabled for public testing**) to:

  - Get the list of choices: [GET /api/Choices](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Choices)
  - Get a random choice: [GET /api/Choices/random](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Choices/random)
  - Play a round against the computer: [POST /api/Game/play](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Game/play)
  - Check API health: [GET /api/Health](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Health)
  - Get the current scores: [GET /api/Scores](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Scores)
  - Reset all scores: [POST /api/Scores/reset](https://3q3wybpmda.us-east-1.awsapprunner.com/api/Scores/reset)

- Computer’s choice is determined using the provided external random number API.
- Swagger UI available for API exploration in Development mode.
- Dockerfiles are included for containerizing the backend service and client application in separate containers to improve scalability.

## Demo

- **Client App (AWS App Runner)**: [https://zhcbgmjnim.eu-central-1.awsapprunner.com](https://zhcbgmjnim.eu-central-1.awsapprunner.com)
- **Server API (AWS App Runner)**: [https://3q3wybpmda.us-east-1.awsapprunner.com](https://3q3wybpmda.us-east-1.awsapprunner.com)

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js and npm](https://nodejs.org/en/download/) (for frontend)
- [Docker](https://www.docker.com/get-started) (optional, for containerization)

### Running server locally

```bash
cd server
dotnet run

```

### Running client locally

```bash
cd client
npm run dev

```

### Running both locally

```bash
.\start.bat ( windows )

```

### CD / CD

#### deploy-client.yml

This workflow is triggered when code is pushed to the **main** branch in the **client** project.

**Purpose:**

- Builds the client Docker image.
- Pushes the image to AWS ECR.
- Triggers AWS App Runner deployment (automatic update is enabled in this demo).

**Notes:**

- For production, it’s recommended to disable automatic App Runner deployments and trigger them manually after QA.

---

#### deploy-server.yml

This workflow is triggered when code is pushed to the **main** branch in the **server** project.

**Purpose:**

- Builds the backend (API) Docker image.
- Pushes the image to AWS ECR.
- Triggers AWS App Runner deployment (automatic update is enabled in this demo).

**Notes:**

- In production, prefer manual deployment approval after tests pass.
