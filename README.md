# NATS Subscriber Service

## Overview

This service implements a backend system that subscribes to a [NATS](https://nats.io) messaging queue and persists received messages to a PostgreSQL database using Sequelize ORM. 

## Prerequisites

- Docker installed and running
- Node.js (only for local script testing outside Docker)

## Setup and Execution

1. **Clone the Repository**
    ```bash
    git clone git@github.com:ZhannaSargsyan/SE_HW1_ZS.git
    cd SE_HW1_ZS
    ```

2. **Run the Application**
    ```bash
    docker-compose up --build -d
    ```

3. **Test the Application with CLI tool**
    ```bash
    npm run cli
    ```

    ## CLI usage
    
    Upon running the CLI tool, you will be presented with an interactive prompt. The following actions are available:

    1. Send Message

        Select Send Message to manually publish a message to the NATS subject:

        ```bash
        ? Choose an action: ›
        ❯ Send Message
        Show Message History
        Listen to Messages
        Exit
        ```
        You will then be prompted to enter a message:

        ```bash
        ? Enter message to send: Hello from CLI
        Message sent: Hello from CLI
        ```

    2. Show Message History

        Select Show Message History to query and display previously received messages from the database:

        ```bash
        ? Choose an action: ›
        ❯ Show Message History
        ```

        Output:
        ```
        Message history:
        [2025-04-12T12:34:56.789Z] Hello from CLI
        [2025-04-12T12:30:00.123Z] Test message from publisher
        ```

    3. Listen to Messages

        Select Listen to Messages to begin real-time message subscription to the NATS subject. All incoming messages will be displayed as they are received:

        ```
        ? Choose an action: ›
        ❯ Listen to Messages

        Listening for messages...
        Received message on 'nats.subscription': Hello from another service
        Received message on 'nats.subscription': System initialized
        ```
        Press Ctrl+C to stop listening and exit the process.

    4. Exit

        Choose Exit to quit the CLI.







## System Architecture

The system is built using a 3-layered architecture:

### 1. Subscriber (Application Layer)
- Connects to a NATS server.
- Listens for messages on a predefined subject.
- Forwards received payloads to the service layer.

### 2. Service Layer
- Validates and transforms incoming data.
- Handles application-specific logic (e.g., time formatting, error handling).

### 3. Data Access Layer
- Interacts with PostgreSQL using Sequelize ORM.
- Defines the `Message` model and its schema.

## Data Model

### Message

| Field       | Type      | Description                         |
|------------|-----------|-------------------------------------|
| `id`       | Integer   | Primary key                         |
| `content`  | String    | Message body                        |
| `received_at` | Date   | Timestamp when the message was received |
| `created_at` | Date    | Record creation timestamp (Sequelize managed) |
| `updated_at` | Date    | Record update timestamp (Sequelize managed) |

## Technologies Used

- **Node.js**
- **Sequelize**: ORM for PostgreSQL
- **NATS**: Lightweight publish-subscribe messaging system
- **Docker**: Containerized environment
- **PostgreSQL**: Relational database

## Configuration

Environment variables are defined via Docker Compose:

- `NATS_URL`: URL for the NATS server (`nats://nats:4222`)
- `POSTGRES_URL`: PostgreSQL connection string (`postgres://postgres:postgres@postgres:5432/postgres`)

These are injected into the app container automatically at runtime.

## Docker Components

| Service   | Role                              |
|-----------|-----------------------------------|
| `app`     | Node.js subscriber and processor  |
| `postgres`| PostgreSQL database               |
| `nats`    | NATS messaging server             |

## Project Scripts

| Command            | Description                                |
|--------------------|--------------------------------------------|
| `start`            | Starts the app (`src/app.js`)              |
| `db:migrate`       | Applies Sequelize migrations               |
| `cli`              | Enters the container for CLI tools         |

## Folder Structure

```
├── src/                # Application logic (subscriber, service)
├── models/             # Sequelize models
├── migrations/         # Sequelize migrations
├── config/             # Database config
├── docker-compose.yml  # Container orchestration
├── Dockerfile          # App container build config
```
