# Rock-Paper-Scissors-Lizard-Spock API and UI

## Overview

This project is a full-stack implementation of the "Rock-Paper-Scissors-Lizard-Spock" game as described in the coding challenge. It includes:

- A **C# ASP.NET Core Web API** backend implementing game logic and REST endpoints.
- A **React** frontend for user interaction (optional).

## Features

- Provides REST API endpoints to:
  - Get the list of choices (`/choices`)
  - Get a random choice (`/choices/random`)
  - Play a round against the computer (`/play`)
- Computer’s choice is determined using the provided external random number API.
- Swagger UI available for API exploration in Development mode.
- Dockerfile included for containerizing the backend service.

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
