const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  // Vercel may or may not auto-parse — handle both cases
  let parsed = req.body;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }

  const { imageData, mimeType = 'image/jpeg', brand = 'sbf' } = parsed || {};
  if (!imageData) {
    return res.status(400).json({ error: 'Missing imageData' });
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
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini error:', err);
      return res.status(response.status).json({ error: 'Gemini API error', detail: err });
    }

    const data = await response.json();
    const caption = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!caption) {
      return res.status(500).json({ error: 'No caption returned' });
    }

    return res.status(200).json({ caption });
  } catch (e) {
    console.error('Function error:', e);
    return res.status(500).json({ error: e.message });
  }
}
