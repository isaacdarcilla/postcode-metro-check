// deno-lint-ignore-file
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // Logging setup
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const logData: Record<string, any> = {
    timestamp: new Date().toISOString(),
    requestMethod: request.method,
    requestHeaders: Object.fromEntries(request.headers),
    requestUrl: request.url
  };

  try {
    // Extract postcode from the URL path
    const url = new URL(request.url);
    const postcode = url.pathname.split('/').pop();

    // Log postcode extraction
    logData.extractedPostcode = postcode;

    // Validate postcode
    if (!postcode || !/^\d{4}$/.test(postcode)) {
      logData.validationError = "Invalid postcode format";
      console.error(JSON.stringify(logData));

      return new Response(JSON.stringify({ error: "invalid" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    try {
      // Make API call to OpenRouter
      const apiRequestBody = {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: `In Australia, my postcode is ${postcode}? Can you determine if my postcode is metro or non-metro? Output only 'metro' or 'non-metro'`
          }
        ],
        max_tokens: 10
      };

      logData.apiRequestBody = apiRequestBody;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("DEEPSEEK_API_KEY")}`,
        },
        body: JSON.stringify(apiRequestBody)
      });

      logData.apiResponseStatus = response.status;

      if (!response.ok) {
        throw new Error(`API response status: ${response.status}`);
      }

      const data = await response.json();
      logData.apiResponseData = data;

      const aiResponse = data.choices[0]?.message?.content?.trim().toLowerCase();
      logData.aiRawResponse = aiResponse;

      // Validate response
      const validResponse =
        aiResponse === 'metro' || aiResponse === 'non-metro'
          ? aiResponse
          : 'unknown';

      logData.finalResult = validResponse;

      // Log successful request
      console.log(JSON.stringify(logData));

      return new Response(JSON.stringify({ result: validResponse }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (apiError) {
      logData.apiErrorMessage = apiError.message;
      logData.apiErrorStack = apiError.stack;
      console.error(JSON.stringify(logData));

      return new Response(JSON.stringify({
        error: "Failed to process API request",
        details: apiError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

  } catch (error) {
    logData.generalErrorMessage = error.message;
    logData.generalErrorStack = error.stack;
    console.error(JSON.stringify(logData));

    return new Response(JSON.stringify({
      error: "Unexpected error occurred",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

// Edge Function configuration
export const config = {
  path: "/api/postcodes/:postcode"
};