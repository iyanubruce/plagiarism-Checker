# Plagiarism Checker - Research Assistant API

A comprehensive backend API for detecting plagiarism, managing citations, and providing academic paper recommendations. Built with Express.js and TypeScript, it uses advanced NLP algorithms including n-grams, Locality-Sensitive Hashing (LSH), and Jaccard similarity for accurate plagiarism detection.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Database Seeding](#-database-seeding)
- [License](#-license)

## ✨ Features

### Core Features

- **Plagiarism Detection**: Advanced similarity analysis using n-grams, LSH, and Jaccard similarity algorithms
- **Citation Management**: Format citations in APA and IEEE styles
- **Citation Conversion**: Convert citations between different formats
- **Paper Recommendations**: Get relevant paper recommendations based on query text
- **Multi-format Support**: Handle PDF and DOCX documents
- **Session Management**: Secure user sessions with MongoDB store
- **Admin Panel**: Authentication and paper management for administrators

### Technical Features

- **Text Chunking**: Intelligent text segmentation for better analysis
- **Natural Language Processing**: Text preprocessing and n-gram generation
- **Hashing Algorithms**: SimHash and Hamming distance for fast similarity detection
- **Error Handling**: Comprehensive error handling with custom middleware
- **Request Validation**: Zod validation for request bodies
- **Logging**: Winston logging for application events
- **Compression**: Response compression for optimal performance
- **CORS Support**: Cross-Origin Resource Sharing enabled

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose-style JSON storage
- **Authentication**: bcryptjs for password hashing
- **Session Management**: express-session with MongoDB store
- **File Processing**:
  - `mammoth` - DOCX parsing
  - `pdf-parse` - PDF text extraction
- **NLP**: Natural language processing library
- **Validation**: Zod schema validation
- **Logging**: Winston logger
- **Utilities**: Morgan (HTTP logging), Compression, CORS

## 📦 Prerequisites

- Node.js 16+
- npm or yarn package manager
- MongoDB (if using external database)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Iyanu-Industries/plagiarism-Checker.git
   cd plagiarism-Checker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables (see [Configuration](#-configuration) section)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
HOST=localhost

# Session
SESSION_SECRET=your-secret-key-here

# MongoDB (if using external DB)
MONGODB_URI=mongodb://localhost:27017/plagiarism-checker

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

**Environment Variables:**

- `NODE_ENV`: Application environment (development, production)
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)
- `SESSION_SECRET`: Secret key for session encryption
- `MONGODB_URI`: MongoDB connection string
- `MAX_FILE_SIZE`: Maximum file upload size in bytes

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

Starts the server with hot-reload using ts-node-dev on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Seed Admin User

```bash
npm run seed:admin
```

Initializes the admin user in the database

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Public API Endpoints

#### 1. Check Plagiarism

**POST** `/plagiarism/check`

Check text for plagiarism against the database.

**Request Body:**

```json
{
  "text": "Your text to check for plagiarism..."
}
```

**Response:**

```json
{
  "success": true,
  "textLength": 1500,
  "chunksAnalyzed": 15,
  "similarityScore": 45,
  "matchesFound": 3,
  "detailedMatches": [
    {
      "paperId": "paper_001",
      "title": "Research Paper Title",
      "matches": [
        {
          "chunkIndex": 0,
          "paperId": "paper_001",
          "title": "Research Paper Title",
          "similarity": 87,
          "matchingText": "...",
          "querySnippet": "...",
          "databaseSnippet": "..."
        }
      ],
      "maxSimilarity": 87
    }
  ]
}
```

#### 2. Get Citation

**GET** `/citations/:id?style=apa`

Get formatted citation for a paper.

**Parameters:**

- `id` (required): Paper ID
- `style` (optional): Citation style - "apa" or "ieee" (default: "apa")

**Response:**

```json
{
  "success": true,
  "paperId": "paper_001",
  "title": "Research Paper Title",
  "citation": {
    "style": "apa",
    "formatted": "Author, A. (2023). Title. Journal Name, 10(2), 123-145."
  }
}
```

#### 3. Convert Citation

**POST** `/citations/convert`

Convert citations between formats.

**Request Body:**

```json
{
  "title": "Research Paper Title",
  "authors": ["Author Name"],
  "year": 2023,
  "source": "Journal Name",
  "doi": "10.1234/example",
  "fromStyle": "apa",
  "toStyle": "ieee"
}
```

**Response:**

```json
{
  "success": true,
  "originalCitation": {
    "style": "apa",
    "formatted": "..."
  },
  "convertedCitation": {
    "style": "ieee",
    "formatted": "[1] ..."
  }
}
```

#### 4. Get Paper Recommendations

**POST** `/recommendations`

Get paper recommendations based on text.

**Request Body:**

```json
{
  "text": "Your text for finding recommendations..."
}
```

**Response:**

```json
{
  "success": true,
  "recommendations": [
    {
      "paperId": "paper_001",
      "title": "Relevant Paper",
      "relevance": 95,
      "citation": {
        "apa": "...",
        "ieee": "..."
      }
    }
  ]
}
```

### Admin Endpoints

#### Authentication

**Base URL:** `http://localhost:3000/admin`

**POST** `/auth/login`

```json
{
  "username": "admin",
  "password": "password"
}
```

**GET** `/auth/logout` - Logout user

**POST** `/papers/upload`
Upload a new paper (requires authentication)

**GET** `/papers` - List all papers

**DELETE** `/papers/:id` - Delete a paper

## 📁 Project Structure

```
plagiarism-Checker/
├── database/                 # JSON databases
│   ├── admins.json          # Admin credentials
│   └── chunks.json          # Paper chunks storage
├── public/                   # Frontend files
│   └── index.html           # Main HTML file
├── src/
│   ├── api/
│   │   ├── handlers/        # Request handlers
│   │   │   ├── citation.ts
│   │   │   ├── plagiarism.ts
│   │   │   ├── recommend.ts
│   │   │   └── admin/
│   │   │       ├── auth.ts
│   │   │       └── papers.ts
│   │   ├── middlewares/     # Express middlewares
│   │   │   ├── custom-error-middleware.ts
│   │   │   ├── session-middleware.ts
│   │   │   └── validate.ts
│   │   ├── routes/          # API routes
│   │   │   ├── citation.routes.ts
│   │   │   ├── plagiarism.routes.ts
│   │   │   ├── recommend.routes.ts
│   │   │   └── admin/
│   │   │       ├── auth.routes.ts
│   │   │       ├── index.routes.ts
│   │   │       └── papers.routes.ts
│   ├── config/              # Configuration files
│   │   ├── env.ts           # Environment setup
│   │   └── session.ts       # Session configuration
│   ├── controllers/         # Business logic
│   │   ├── citation.controller.ts
│   │   ├── plagiarism.controller.ts
│   │   ├── recommend.controller.ts
│   │   └── admin/
│   │       ├── auth.controller.ts
│   │       └── papers.controller.ts
│   ├── database/            # Database utilities
│   │   ├── AdminDatabase.ts
│   │   ├── PaperDatabase.ts
│   │   └── seeds/
│   │       └── admin-seed.ts
│   ├── errors/              # Error classes
│   │   ├── badRequestError.ts
│   │   └── errorHandler.ts
│   ├── helpers/             # Helper functions
│   │   └── utilities.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── chunker.ts       # Text chunking
│   │   ├── citationFormatter.ts
│   │   ├── logger.ts
│   │   ├── lsh.ts           # Locality Sensitive Hashing
│   │   ├── ngram.ts         # N-gram generation
│   │   ├── similarity.ts    # Similarity calculations
│   │   └── textExtractor.ts # PDF/DOCX extraction
│   ├── validations/         # Input validation schemas
│   │   ├── citation.ts
│   │   ├── plagiarism.ts
│   │   ├── recommended.ts
│   │   └── admin/
│   │       ├── auth.ts
│   │       └── papers.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md              # This file
```

## 🔧 Development

### Key Algorithm Components

#### N-Gram Generation

Breaks text into overlapping sequences of words for similarity comparison.

- File: [src/utils/ngram.ts](src/utils/ngram.ts)

#### Locality Sensitive Hashing (LSH)

Uses SimHash algorithm for fast approximate nearest neighbor search.

- File: [src/utils/lsh.ts](src/utils/lsh.ts)

#### Jaccard Similarity

Computes set similarity between n-gram sets.

- File: [src/utils/similarity.ts](src/utils/similarity.ts)

#### Text Chunking

Divides text into overlapping chunks for detailed analysis.

- File: [src/utils/chunker.ts](src/utils/chunker.ts)

### Plagiarism Detection Flow

1. **Text Preprocessing**: Clean and normalize input text
2. **Chunking**: Split text into overlapping chunks (100 words, 50-word overlap)
3. **N-gram Generation**: Create 5-grams from each chunk
4. **SimHash Calculation**: Generate hash fingerprint for similarity search
5. **Hamming Distance Check**: Find candidates with similar hashes (threshold: 8)
6. **Jaccard Similarity**: Calculate actual similarity (threshold: 0.2)
7. **Aggregation**: Group results by paper and calculate statistics

## 🗄️ Database Seeding

### Initialize Admin User

```bash
npm run seed:admin
```

This creates an initial admin user that can be used to authenticate with the admin panel.

## 📝 Type Definitions

### PaperChunk

```typescript
interface PaperChunk {
  id: string;
  paperId: string;
  title: string;
  text: string;
  ngrams: string[];
  simhash: string;
  position: number;
  authors?: string[];
  year?: number;
  source?: string;
  doi?: string;
}
```

### MatchResult

```typescript
interface MatchResult {
  chunkIndex: number;
  paperId: string;
  title: string;
  similarity: number;
  matchingText: string;
  querySnippet: string;
  databaseSnippet: string;
}
```

## 🐛 Error Handling

The application uses custom error middleware for consistent error responses. All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

## 📊 Logging

Winston logger is configured to log all application events:

- Server startup/shutdown
- HTTP requests (via Morgan)
- Database operations
- Error events

Logs are output to console and can be configured for file storage.

## 🔐 Security

- Password hashing using bcryptjs
- Session management with secure cookies
- CORS protection
- Input validation with Zod
- Error responses don't expose sensitive information

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Iyanu-Industries/plagiarism-Checker)
- [Issue Tracker](https://github.com/Iyanu-Industries/plagiarism-Checker/issues)

## ✉️ Support

For support and questions, please open an issue on the GitHub repository.
