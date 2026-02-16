# CMS Backend

A robust and scalable backend for a Content Management System (CMS), built with Node.js, Express, and MongoDB. This backend supports user authentication, artifact management, social interactions (likes, comments), and real-time chat functionality.

## 🚀 Features

-   **Secure Authentication**:
    -   Signup with email & OTP verification.
    -   Secure login using JWT (JSON Web Tokens).
    -   Password hashing with bcrypt.
-   **Role-Based Access Control (RBAC)**:
    -   Differentiated access for `ADMIN` and `USER` roles.
-   **Artifact Management**:
    -   Create and manage artifacts.
    -   File uploads using `multer` and cloud storage integration via **Cloudinary**.
-   **Social Interactions**:
    -   Like and comment on artifacts.
-   **Real-time Communication**:
    -   Integrated chat functionality using **Socket.io**.
-   **Security & Performance**:
    -   Rate limiting to prevent abuse.
    -   Input validation and sanitization.
    -   Structured logging with `morgan`.

> [!NOTE]
> Currently, the OTP for signup is returned in the API response or logs for development purposes. Email service integration is planned for future releases.

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (with Mongoose ODM)
-   **Real-time Engine**: Socket.io
-   **Authentication**: JWT, bcrypt
-   **File Storage**: Cloudinary
-   **Utilities**: 
    -   `dotenv` (Environment variables)
    -   `cors` (Cross-Origin Resource Sharing)
    -   `morgan` (HTTP request logger)
    -   `node-cron` (Scheduled tasks)

## 📋 Prerequisites

Ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)
-   A [Cloudinary](https://cloudinary.com/) account for image/video hosting.

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/debaprakash2021/cms-backend.git
    cd cms-backend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and configure the following variables:
    ```env
    PORT=8080
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_SECRET_KEY=your_api_secret
    ```

4.  **Start the Server**
    ```bash
    # Run in development mode (using nodemon if installed)
    npm run dev  # (Make sure you have a dev script or nodemon configured)
    
    # Or start normally
    npm start
    ```
    The server will start on port `8080` (or your defined PORT).

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup/initiate` | Initiate signup & generate OTP | No |
| `POST` | `/auth/signup/verify` | Verify OTP & register user | No |
| `POST` | `/auth/login` | Login user & return token | No |

### Artifacts (Content)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/artifacts` | Create a new artifact (with media) | Yes |
| `GET` | `/artifacts` | Get all artifacts (Rate Limited) | Yes (Admin) |

### Social Interactions

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/likes/:id/like` | Toggle like on an artifact | Yes |
| `GET` | `/likes/:id/likes` | Get like count for an artifact | No |
| `POST` | `/comments/:id/comments`| Add a comment to an artifact | Yes |
| `GET` | `/comments/:id/comments`| Get comments for an artifact | No |

### Chat

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/chat` | Send a chat message | Yes |
| `GET` | `/chat/:threadId` | Get chat history for a thread | Yes |

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

## 📄 License

This project is licensed under the ISC License.
