const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

const PROMPTS = {
  sbf: `You are a social media expert for Moshe Fogel, a real estate agent in Morgan Hill, CA (brand: Sold By Fogel).
Look at this image and write ONE engaging Instagram/Facebook caption for it.
- Tone: warm, professional, aspirational
- Length: 2-4 sentences + 3-5 relevant hashtags
- If it's a property/home: highlight lifestyle and location
- If it's a person or event: make it personal and relatable
- Always end with a call to action (DM, comment, etc.)
- Do NOT use generic real estate clichés unless the image is clearly a listing
Reply with just the caption text, nothing else.`,

  gm: `אתה מומחה רשתות חברתיות לקהילה הישראלית "גבעת מורגן" במורגן היל, קליפורניה.
תסתכל על התמונה הזאת וכתוב כיתוב אחד מעולה לאינסטגרם/פייסבוק.
- טון: חם, קהילתי, מחבר
- אורך: 2-3 משפטים + 3-5 האשטאגים רלוונטיים בעברית
- אם זו תמונה של אנשים/אירוע: תדגיש את הקהילה והשייכות
- אם זו תמונה של מקום: קשר לחיים הישראליים בקליפורניה
- סיים עם קריאה לפעולה (תגובה, תיוג, שיתוף)
ענה רק עם טקסט הכיתוב, ללא הסברים נוספים.`,
};

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not set' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { imageData, mimeType = 'image/jpeg', brand = 'sbf' } = body;
  if (!imageData) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing imageData' }) };
  }

  const prompt = PROMPTS[brand] || PROMPTS.sbf;

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: imageData } },
      ],
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 300,
    },
  };

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini error:', err);
      return { statusCode: res.status, body: JSON.stringify({ error: 'Gemini API error', detail: err }) };
    }

    const data = await res.json();
    const caption = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!caption) {
      return { statusCode: 500, body: JSON.stringify({ error: 'No caption returned' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption }),
    };
  } catch (e) {
    console.error('Function error:', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
