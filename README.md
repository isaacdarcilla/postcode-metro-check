# Australian Postcode Metro/Non-Metro Classifier

## Overview

This Netlify Edge Function provides a simple API to classify Australian postcodes as either 'metro' or 'non-metro' using AI-powered classification.

## Features

- Validate 4-digit Australian postcodes
- Classify postcodes using an AI model
- Serverless edge function deployment
- CORS support
- Comprehensive error handling and logging

## Prerequisites

- Netlify account
- Netlify CLI
- Deno runtime
- OpenRouter API key (for DeepSeek model)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/isaacdarcilla/postcode-metro-check.git
cd postcode-metro-check
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```
DEEPSEEK_API_KEY=your_openrouter_api_key_here
```

Please refer to this [documentation](https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free/api).

### 3. Run Locally

```bash
npm install
netlify dev
```

### 4. Deploy to Netlify

```bash
netlify deploy --prod
```

### Endpoint

```
GET /api/postcodes/{postcode}
```

### Example Request

```bash
curl http://localhost:8888/api/postcodes/3000
curl https://your-site.netlify.app/api/postcodes/3000
```

### Response

```json
{
  "result": "metro"
}
```

### Possible Responses

- `{"result": "metro"}`: Postcode is in a metropolitan area
- `{"result": "non-metro"}`: Postcode is in a non-metropolitan area
- `{"result": "unknown"}`: Unable to classify
- `{"error": "invalid"}`: Invalid postcode format

## Error Handling

- 400 Bad Request: Invalid postcode format
- 500 Internal Server Error: API or processing failures

## Logging

The function includes comprehensive logging capturing:
- Request details
- Postcode validation
- AI model interactions
- Error scenarios

Logs are output to the Netlify function logs for debugging.

## Security

- CORS enabled for all origins
- API key securely stored in environment variables
- Input validation for postcodes

## Technologies

- Deno
- Netlify Edge Functions
- OpenRouter AI
- DeepSeek Chat Model

## Limitations

- Relies on AI model accuracy
- Limited to Australian postcodes
- Requires active OpenRouter API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## Support

For issues or questions, please [open an issue](https://github.com/isaacdarcilla/postcode-metro-check/issues)