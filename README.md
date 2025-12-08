# DeepDoc - Risk Assessment AI Platform

เว็บแอปสำหรับประเมินผลคะแนนโครงการความเสี่ยงด้วย AI (Google Gemini)

## Features

- 📄 Upload PDF project files with evidence
- 🤖 AI-powered scoring using Google Gemini
- 📊 View scored results by year
- ☁️ File storage on AWS S3

## Tech Stack

- **Frontend**: Next.js 15, React 19, Material-UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Storage**: AWS S3
- **AI**: Google Gemini 2.5 Flash

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- AWS S3 bucket
- Google Gemini API key

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `BUCKETNAME` | AWS S3 bucket name |
| `AWSREGION` | AWS region (e.g., ap-southeast-1) |
| `ACCESSKEYID` | AWS access key ID |
| `SECRETACCESSKEY` | AWS secret access key |
| `APIKEY` | Google Gemini API key |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### DigitalOcean App Platform

1. Push your code to GitHub
2. Create new App in [DigitalOcean](https://cloud.digitalocean.com/apps)
3. Connect your repository
4. Add environment variables
5. Deploy!

## Project Structure

```
src/
├── lib/                 # Shared utilities
│   ├── db.js           # MongoDB connection
│   ├── s3.js           # AWS S3 utilities
│   ├── fileModel.js    # Mongoose model
│   ├── scoring.js      # Scoring criteria
│   └── analyzer.js     # AI analysis
├── pages/
│   ├── api/            # API routes
│   │   ├── uploadFiles.js
│   │   └── resultlist.js
│   ├── submit.js       # Project submission form
│   ├── results.js      # View scored results
│   └── analyze.js      # Direct analyzer (legacy)
└── components/
    └── layout.js       # App layout
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploadFiles` | Upload PDF files |
| GET | `/api/resultlist?year=YYYY` | Get scored projects by year |

## License

MIT
