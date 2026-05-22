// ── Helper functions ──────────────────────────────────────────────────────────

export const today = new Date();

// nextWeekday(dow, h, m, weeksAhead) — 0=Sun,1=Mon,…,5=Fri,6=Sat
export function nextWeekday(dow, h = 9, m = 0, weeksAhead = 0) {
  const d = new Date(today);
  let diff = (dow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff + weeksAhead * 7);
  d.setHours(h, m, 0, 0);
  return d;
}

export function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDateShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getWeekStart(offset = 0) {
  const d = new Date(today);
  const day = d.getDay();
  d.setDate(d.getDate() - day + 1 + offset * 7); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getISOWeek(d) {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
}

export function getWeekKey(d, dow, slot) {
  const yw = `${d.getFullYear()}-W${getISOWeek(d)}`;
  return `${yw}-${dow}-${slot}`;
}

// ── Platform config ───────────────────────────────────────────────────────────

export const PLATFORMS = {
  ig:  { name: 'Instagram',     short: 'IG',  maxChars: 2200 },
  fb:  { name: 'Facebook Page', short: 'FB',  maxChars: 63206 },
  fbp: { name: 'Personal FB',   short: 'M.F', maxChars: 63206 },
  fbg: { name: 'FB Group',      short: 'FBG', maxChars: 63206 },
  li:  { name: 'LinkedIn',      short: 'LI',  maxChars: 3000 },
  wa:  { name: 'WhatsApp',      short: 'WA',  maxChars: 1024 },
};

export const PLAT_COLORS = {
  ig: '#e1306c', fb: '#1877f2', fbp: '#1877f2', fbg: '#1877f2', li: '#0a66c2', wa: '#25d366',
};

export const PLAT_CHIP_LABELS = {
  ig: 'IG', fb: 'FB Page', fbp: 'Moshe', fbg: 'FB Group', li: 'LI', wa: 'WA', tw: 'TW',
};

// ── Brand config ──────────────────────────────────────────────────────────────

export const BRANDS = {
  sbf: {
    id: 'sbf', name: 'Sold By Fogel', sub: 'Real Estate · Morgan Hill',
    icon: '🏡', brandEmoji: '🏡', handle: '@soldbyfogel',
    class: 'brand-sbf', badgeClass: 'sbf', color: '#c9a84c',
    platforms: ['ig', 'fb', 'fbp', 'li'],
    defaultHashtags: ['soldbyfogel', 'bayarearealestate', 'morganhill', 'siliconvalleyhomes', 'realestate', 'homesales', 'luxuryhomes', 'realestateagent'],
    weeklySchedule: [
      { day: 'Mon', label: 'Market Insight',    icon: '📊', series: 'market-insight',  type: 'post',  color: '#3b82f6', desc: 'Educational tip or market update' },
      { day: 'Wed', label: 'Local / Listing',    icon: '🏡', series: 'mh-local-love',   type: 'post',  color: '#22c55e', desc: 'Morgan Hill content or listing spotlight' },
      { day: 'Wed', label: 'Client Love ⭐️',     icon: '⭐️', series: 'client-love',     type: 'story', color: '#f59e0b', desc: 'Weekly recurring story feature' },
      { day: 'Fri', label: 'Behind the Scenes',  icon: '🎬', series: 'behind-the-deal', type: 'post',  color: '#c9a84c', desc: 'Personal moment or behind-the-deal' },
    ],
    series: [
      { id: 'market-insight',  name: 'Market Insight',        icon: '📊', color: '#3b82f6', day: 'Mon', desc: 'Monday market education & tips' },
      { id: 'mh-local-love',   name: 'Morgan Hill Local Love', icon: '💚', color: '#22c55e', day: 'Wed', desc: 'Local content & listing spotlights' },
      { id: 'behind-the-deal', name: 'Behind the Deal',        icon: '🔑', color: '#c9a84c', day: 'Fri', desc: 'The story behind every transaction' },
      { id: 'client-love',     name: 'Client Love ⭐️',         icon: '⭐️', color: '#f59e0b', day: 'Wed', desc: 'Weekly story — client testimonials', isStory: true },
    ],
    pillars: [
      {
        day: 'Mon', dayFull: 'Monday', label: 'Useful', icon: '💡', color: '#3b82f6',
        desc: 'Educational content that builds expert authority',
        types: [
          { id: 'market-insight',      label: 'Market Insight',        icon: '📊' },
          { id: 'buyer-seller-tip',    label: 'Buyer / Seller Tip',    icon: '💡' },
          { id: 'mortgage-breakdown',  label: 'Mortgage Breakdown',    icon: '🏦' },
          { id: 're-myth',             label: 'Real Estate Myth',      icon: '❌' },
          { id: 'investment-explainer', label: 'Investment Explainer', icon: '📈' },
        ],
      },
      {
        day: 'Wed', dayFull: 'Wednesday', label: 'Trust', icon: '🤝', color: '#22c55e',
        desc: 'Personal content that builds credibility',
        types: [
          { id: 'client-review',     label: 'Client Review',     icon: '⭐️' },
          { id: 'behind-the-scenes', label: 'Behind the Scenes', icon: '🎬' },
          { id: 'family-community',  label: 'Family / Community', icon: '👨‍👩‍👧' },
          { id: 'day-in-the-life',   label: 'Day in the Life',   icon: '☀️' },
          { id: 'transaction-win',   label: 'Transaction Win',   icon: '🏆' },
        ],
      },
      {
        day: 'Fri/Sat', dayFull: 'Friday / Saturday', label: 'Reach', icon: '🚀', color: '#c9a84c',
        desc: 'Discovery content to grow your audience',
        types: [
          { id: 'reel',                label: 'Reel',                  icon: '🎥' },
          { id: 'mh-hidden-gem',       label: 'MH Hidden Gem',         icon: '💎' },
          { id: 'local-business',      label: 'Local Business',        icon: '🏪' },
          { id: 'property-walkthrough', label: 'Property Walkthrough', icon: '🏠' },
          { id: 'drone-footage',       label: 'Neighborhood Drone',    icon: '🚁' },
        ],
      },
    ],
    pillarSuggestions: {
      'market-insight': [
        "📊 Monday Market Insight\nBay Area inventory is down 18% — Morgan Hill remains the most accessible entry point in Santa Clara County. Median days on market: 14. List-to-sale: 103%.\nThe data is clear. DM me to talk strategy. 📲",
        "📊 Market Update\nMortgage rates dipped this week and buyer activity is picking up. If you've been waiting for the right moment — this might be it.\nLet's talk before inventory gets tighter. 💬",
        "📊 Quick market stat that could save you $50,000:\nHomes priced right sell 97% closer to list price.\nHomes that sit get low-balled.\nPricing strategy = money in your pocket. DM me for a free pricing consultation.",
      ],
      'buyer-seller-tip': [
        "💡 Buyer Tip of the Week:\nDon't skip the pre-approval letter before touring homes.\nIn Morgan Hill's market, the best homes go in 48-72 hours. Without pre-approval, you're watching from the sidelines.\nReady? Let's get you in the game. 🏡",
        "💡 Seller Tip:\nThe first 7 days on market are EVERYTHING.\nThat's when you have the most leverage, the most eyes, and the best chance at multiple offers.\nPricing right from day one isn't strategy — it's the only strategy. 🎯",
        "💡 Did you know?\nAs a buyer, you can negotiate more than just price.\n• Closing costs\n• Repair credits\n• Closing timeline\n• Appliances included\nLet me show you how to structure an offer that wins. 📲",
      ],
      'mortgage-breakdown': [
        "🏦 Mortgage Monday:\nWhat does $700K actually cost per month?\nAt today's rates (~6.8%), a 20% down payment = ~$3,650/mo\nProperty tax: ~$730/mo\nInsurance: ~$120/mo\nTotal: ~$4,500/mo\n\nNot as scary when you break it down. Questions? DM me.",
        "🏦 ARM vs Fixed Rate:\nA 30-year fixed = stability. Same payment for 30 years.\nA 5/1 ARM = lower rate for 5 years, then adjusts.\n\nWho wins with an ARM? Buyers who plan to move or refinance within 5 years.\nWho wins with fixed? Everyone who wants predictability.\n\nWhich one is right for you depends on YOUR plan. Let's talk. 💬",
        "🏦 First-time buyers: your down payment doesn't have to be 20%.\n• FHA loan: 3.5% down\n• Conventional: as low as 3%\n• VA/USDA: 0% down (if you qualify)\n\nDon't let the down payment myth keep you out of the market.\nDM me and let's find the right program for you. 🏡",
      ],
      're-myth': [
        "❌ Real Estate Myth:\n\"You have to wait for rates to drop before buying.\"\n\n✅ Reality: If rates drop, prices go UP (more competition). If you buy now, you can refinance later.\n\"Date the rate, marry the house.\"\n\nDon't time the market. Time your life. 📲",
        "❌ Myth: \"Spring is the only good time to buy.\"\n✅ Reality: Winter and fall buyers often get BETTER deals — less competition, more motivated sellers.\nThe best time to buy is when YOU are ready.\nLet's make a plan. 🏡",
        "❌ Myth: \"FSBO saves money.\"\n✅ Reality: NAR data shows FSBO homes sell for 26% LESS than agent-listed homes.\nThat 3% commission you \"saved\" cost you $50,000.\nCall me before you go it alone. 📞",
      ],
      'investment-explainer': [
        "📈 What is a 1031 Exchange and why should every Bay Area investor know about it?\nYou can defer capital gains taxes by rolling profits into a new property.\nInstead of paying the IRS, you keep your money working.\nDM me — I specialize in helping investors structure these correctly. 💰",
        "📈 Cap Rate 101:\nCap Rate = Net Operating Income ÷ Property Value\nA 5% cap rate on a $800K property = $40K/year net.\nMorgan Hill has some of the best cap rates in Santa Clara County right now.\nWant a list of investment properties? DM me. 📊",
        "📈 Why Morgan Hill for investment?\n✅ Strong rental demand (Apple/Google commuters)\n✅ Lower price point than San Jose / Sunnyvale\n✅ Consistent appreciation — 6.2% avg over 10 years\n✅ New Gilroy premium outlets bringing retail growth\n\nLet's find your next property. 📲",
      ],
      'client-review': [
        "⭐️⭐️⭐️⭐️⭐️\n\"Moshe was incredible from start to finish. We were first-time buyers and he made the whole process feel easy. He negotiated us a price we didn't think was possible and we closed in 21 days.\"\n— Sarah & Mark T., Morgan Hill\n\nThis is why I do what I do. 🙏🏡",
        "⭐️ Client Love Wednesday:\n\"After 4 failed offers with another agent, we switched to Moshe. First offer we wrote together — we won. 7% over asking, no contingencies waived.\"\n— The Ramirez Family, Gilroy\n\nStrategy matters. 💪",
        "⭐️⭐️⭐️⭐️⭐️\n\"Moshe sold our home in 9 days. 8% over asking. His construction background gave him insights that genuinely helped buyers see the value.\"\n— Linda K., Sunnyvale\n\nIf you're thinking of selling, let's talk. 📲",
      ],
      'behind-the-scenes': [
        "🎬 Behind the Deal:\nMy clients were outbid 3 times in a row. We regrouped, reworked the offer strategy — and on the very next one, we won. 8% over asking.\n\nWe stopped competing on price and started competing on terms. That's the game. 💪",
        "🎬 A day in escrow:\n✅ 7am — pre-approval confirmed\n✅ 10am — offer submitted\n✅ 2pm — counter received\n✅ 5pm — counter accepted\n✅ 6pm — clients popping champagne 🥂\n\nThis is what I do every day. Ready for your day? 📲",
        "🎬 Nobody talks about the deals that almost fell apart.\nInspection came back rough. $40K in repairs.\nI got a $28K credit AND kept the deal alive.\nClosing is a skill. Let's get yours done right.",
      ],
      'family-community': [
        "👨‍👩‍👧 Took my kids to Uvas Creek trail this morning before school.\nThe kind of morning that reminds you why you chose this place to build a life.\nMorgan Hill doesn't just have great real estate — it has a great life. 🌿☀️",
        "👨‍👩‍👧 Proud to call Morgan Hill home for 12 years.\nMy kids go to school here. My clients become neighbors. My neighbors become clients.\nThis is more than a job — it's my community. 🏡💚",
        "This is why I show up every day. 🙏\n[Share a personal moment or family photo with a short caption about what drives you in your work and community]",
      ],
      'day-in-the-life': [
        "☀️ 6am: Coffee + market reports\n9am: Showing in Morgan Hill\n11am: Offer strategy session with buyers\n1pm: Listing appt in Gilroy\n4pm: Client call — we got the house 🏡\n6pm: Family dinner\n\nNo two days are the same. I love this job. 💛",
        "☀️ What does a real estate day actually look like?\n→ 23 texts before 9am\n→ 2 showings, 1 inspection\n→ 4 offers reviewed\n→ 1 happy family with keys\n\nThis is why I wake up early. 🗝️",
        "☀️ Today's schedule:\n→ Pre-market listing walkthrough in Coyote Valley\n→ Meet with first-time buyers (they're nervous, I love it)\n→ Negotiating a repair credit on an active escrow\n\nDM me if you want to be on that schedule next week. 📲",
      ],
      'transaction-win': [
        "🏆 Just closed!\n4 Bed · 3 Bath · Morgan Hill\nList price: $1,175,000\nSold for: $1,241,000\n15 days on market · 3 offers\n\nMy sellers walked away with $66K over asking. That's strategy. 💪",
        "🏆 This week's win:\nBuyers had been searching for 8 months before they called me.\n3 weeks later — keys in hand, $14K under asking.\nTiming + strategy = results.\n\nReady to stop searching and start living? DM me. 🏡",
        "🏆 Numbers don't lie:\n• 97.3% list-to-sale ratio\n• 18 avg days on market\n• 100% client satisfaction\n\nIf you're interviewing agents, I'd love to earn your business. Let's talk. 📲",
      ],
      'reel': [
        "🎥 Ideas for this Reel:\n• '3 things I wish buyers knew before making an offer in Morgan Hill'\n• Speed walkthrough of a new listing\n• Before & after of a staged home\n• 'Day in the life' of a closing day\n\nPick one and let's film it! 🎬",
        "🎥 Reel hook ideas that perform:\n→ 'Stop doing this if you're house hunting in Morgan Hill'\n→ 'The offer that won in a bidding war (what we did differently)'\n→ 'Morgan Hill in 60 seconds — why people keep moving here'\n\nShort, punchy, valuable. That's the formula. 🏆",
        "🎥 Real estate reels that get saved:\n• Neighborhood tours\n• Market stat breakdowns\n• Myth-busting videos\n• 'Real talk' moments from the field\n\nGive people something worth sharing.",
      ],
      'mh-hidden-gem': [
        "💎 Morgan Hill Hidden Gem:\nLas Animas Park — most people drive past it and never stop.\nWalking trails, open fields, a creek path. Honestly one of the best Saturday morning spots in South County.\nDrop your favorite MH hidden gem below ⬇️",
        "💎 Hidden gem alert:\nEl Toro Coffee Roasters on Monterey Rd.\nLocal, family-owned, best latte in South County (don't @ me).\nThis is the kind of local spot that makes Morgan Hill feel like a small town inside a big opportunity. ☕🏡",
        "💎 Not many people know about the Uvas Canyon County Park trails — 45 minutes of redwoods and waterfalls, 5 minutes from downtown MH.\nThis is why people move here and never leave. 🌲",
      ],
      'local-business': [
        "🏪 Shoutout to a Morgan Hill local business this week!\n[Tag the business, share what you love about them, why supporting local matters]\n\nThis community thrives when we shop local. 💚🏡",
        "🏪 Supporting local is supporting community.\n[Feature a restaurant, shop, or service that makes Morgan Hill special. Include a photo and tag them.]\n\nThese are the places that make this town home. ❤️",
        "🏪 MH Local Love:\nEvery home I sell, I send my clients a guide to the best local spots — restaurants, parks, hidden gems.\nBecause finding the right home is just the beginning. The life you build here is the real prize. 🌟",
      ],
      'property-walkthrough': [
        "🏠 Property Walkthrough:\n[Walking through a listing — chef's kitchen, indoor/outdoor flow, vineyard views]\nThis one won't last. DM me for details or a private tour. 📲",
        "🏠 New to market — Morgan Hill:\n[Share listing details: beds/baths, standout features, lifestyle]\nOpen house this weekend or DM for a private showing. 🗝️",
        "🏠 Just listed — here's what makes this one special:\n[3 specific features that make the property unique]\nPriced at $[X]. Link in bio for full details + photos. 🏡",
      ],
      'drone-footage': [
        "🚁 Neighborhood Drone:\nMorgan Hill from above — vineyard hills, open space, that South Bay glow.\nThis is the backdrop my clients get to call home. 🌅",
        "🚁 Every listing tells a story from the air.\n[Aerial shot of the property / neighborhood]\nLocation + lifestyle. That's what you're really buying. 🏡📍",
        "🚁 Why Morgan Hill?\nZoom out and you'll see it — 45 min to San Jose, surrounded by hills and open space, one of the last truly livable Bay Area communities.\nSee it from above. Imagine living here. 🌄",
      ],
    },
    tones: ['Market Insight 📊', 'Local Love 💚', 'Behind the Deal 🔑', 'Listing Spotlight 🏠', 'Personal 🎬'],
    aiSuggestions: {
      'Market Insight 📊': [
        "📊 Monday Market Insight\nBay Area inventory is down 18% this quarter — but Morgan Hill remains one of the most accessible entry points in Santa Clara County.\nIf you've been waiting for the \"right time,\" here's what the data says: ➡️ Median days on market: 14. List-to-sale ratio: 103%. Now is the time. DM me to talk strategy.",
        "💡 Tip Tuesday → Monday Edition:\nDid you know that homes priced within 2% of market value sell 3x faster AND closer to asking price?\nOverpricing is the #1 mistake sellers make. Here's how I price every home I list:\n1️⃣ Hyper-local comps\n2️⃣ Condition-adjusted analysis\n3️⃣ Demand pulse check\nSave this. Your future self will thank you. 📌 #MarketInsight",
        "📌 What is a 1031 Exchange — and why should every Bay Area investor know about it?\nIt lets you defer capital gains taxes when you sell a property and reinvest into a like-kind property within 180 days.\nTranslate: you keep more money working for you.\nWant to know if it fits your situation? DM me. 📲 #SoldByFogel #MarketInsight",
      ],
      'Local Love 💚': [
        "💚 Morgan Hill Local Love\nFavorite spot this week: the Saturday farmers market on East Main. Local honey, fresh flowers, and the best tamales in Santa Clara County. 🌸🍯\nThis is the lifestyle Morgan Hill offers — and it's one of the reasons I'm proud to call it home.\nWhere's your favorite local spot? Drop it below ⬇️ #MorganHillLocalLove #SoldByFogel",
        "🏡 Listing Spotlight\nJust listed: a stunning 4BD/3BA in the heart of Morgan Hill. Vineyard views, open floor plan, and a backyard built for California living. 🍷☀️\nSwipe to see every detail ➡️\nDM me or call (408) 687-4880 for a private showing. These don't last. 🔑 #MorganHillLocalLove",
        "📍 Why Morgan Hill?\nGreat schools. Safe streets. Vineyard views. And a community that actually knows your name.\nI've lived here, raised my family here, and sold 100+ homes here — and I'm still convinced it's one of the most underrated places to live in all of Silicon Valley.\nThinking about making a move to Morgan Hill? Let's talk. 💬 #MorganHillLocalLove #SoldByFogel",
      ],
      'Behind the Deal 🔑': [
        "🔑 Behind the Deal — This week's story:\nMy clients were outbid 3 times before they came to me. We sat down, reworked their strategy, and on the very next offer — we won. 8% over asking, no contingencies waived.\nWhat changed? We stopped competing on price alone and started competing on terms.\nThis is the game. And this is why I love what I do. 💪 #BehindTheDeal #SoldByFogel",
        "🎬 Friday Behind the Scenes\nWhat does a showing day actually look like?\n6am → review comparable sales\n8am → walk the property before clients arrive\n10am → showing #1\n1pm → showings #2 & #3\n4pm → debrief calls\n7pm → offer prep\nEvery hour is intentional. Your biggest investment deserves nothing less. 🏡 #BehindTheDeal",
        "Here's something nobody tells you about the offer process: 📋\nThe strongest offer isn't always the highest number.\nI've won deals for clients at asking price — because the letter was personal, the terms were clean, and the timeline matched the seller's needs perfectly.\nNegotiation is an art. I've been studying it for years. 🖊️ #BehindTheDeal #SoldByFogel",
      ],
      'Listing Spotlight 🏠': [
        "🚨 JUST LISTED — Morgan Hill\n4 Bed · 3 Bath · 2,450 sqft · Vineyard Views\nThis is the one you've been waiting for. Open floor plan, chef's kitchen, and a backyard that makes you never want to leave California. 🍷☀️\nOpen house this Sunday 1–4PM. Link in bio for full details. 🔑 DM for private tour. #SoldByFogel",
        "🔥 JUST SOLD — and here's why it moved fast:\n✅ Priced strategically (not greedily)\n✅ Professional photos + staging consult\n✅ Launched on a Thursday for weekend traffic\n✅ 11 showings in 3 days\n✅ Multiple offers. Sold for 106% of asking.\nWant these results for your home? Let's talk. 📞 (408) 687-4880 #SoldByFogel",
        "📸 Property of the Week\nNestled in one of Morgan Hill's most sought-after neighborhoods — this 3BD/2BA has the natural light, the layout, and the location that buyers are actively searching for.\nSwipe for the full tour ➡️\nDM me to schedule your private showing before the weekend. 🏡 #SoldByFogel #MorganHillLocalLove",
      ],
      'Personal 🎬': [
        "🎬 Friday Personal\nTook my kids to the Uvas Creek trail this morning before school. The kind of morning that reminds you why you chose this place to build a life.\nMorgan Hill doesn't just have great real estate — it has a great life. That's what I'm really selling. 🌿☀️ #SoldByFogel",
        "Grateful this Friday. 🙏\nThis week I handed over keys to three families. Three different budgets, three different timelines — but the same look on every face when the door opens for the first time as homeowners.\nThat look is why I do this. Every single day. 🏡💛 #SoldByFogel",
        "Real talk on a Friday: ☕\nI get asked all the time — 'Is now a good time to buy?'\nMy honest answer: the best time to buy is when YOU are ready — financially stable, clear on your goals, and working with someone who puts your interests first.\nI've never told a client to rush. And I never will. Let's chat when the time is right. 📲 #SoldByFogel",
      ],
    },
    storyTemplates: [
      { id: 'client-love',  name: 'Client Love ⭐️',      icon: '⭐️', color: '#f59e0b', platforms: ['ig', 'fb', 'fbp'], slot: 'pm', desc: 'Wednesday recurring — client testimonial' },
      { id: 'market-tip',   name: 'Market Tip',           icon: '📊', color: '#3b82f6', platforms: ['ig', 'li'],        slot: 'am', desc: 'Quick market insight or stat' },
      { id: 'listing',      name: 'Listing Preview',      icon: '🏠', color: '#c9a84c', platforms: ['ig', 'fb', 'fbp'], slot: 'am', desc: 'Swipe-up listing or open house' },
      { id: 'bts',          name: 'Behind the Deal',      icon: '🎬', color: '#a78bfa', platforms: ['ig', 'fbp'],       slot: 'pm', desc: 'Personal moment or deal story' },
      { id: 'mh-moment',    name: 'MH Local Moment',      icon: '🌿', color: '#22c55e', platforms: ['ig', 'fb', 'fbp'], slot: 'pm', desc: 'Morgan Hill life & community' },
      { id: 'poll',         name: 'Poll / Q&A',           icon: '💬', color: '#fb7185', platforms: ['ig'],              slot: 'am', desc: 'Engage your audience' },
      { id: 'tip-tuesday',  name: 'Buyer/Seller Tip',     icon: '💡', color: '#fbbf24', platforms: ['ig', 'li', 'fbp'], slot: 'am', desc: 'Educational tip for buyers or sellers' },
      { id: 'motivation',   name: 'Quote / Motivation',  icon: '✨', color: '#60a5fa', platforms: ['ig', 'fbp'],       slot: 'am', desc: 'Inspirational quote for the morning' },
    ],
    defaultStoryWeek: [
      { dow: 1, slot: 'am', template: 'market-tip' },   { dow: 1, slot: 'pm', template: 'bts' },
      { dow: 2, slot: 'am', template: 'listing' },       { dow: 2, slot: 'pm', template: 'mh-moment' },
      { dow: 3, slot: 'am', template: 'tip-tuesday' },   { dow: 3, slot: 'pm', template: 'client-love' },
      { dow: 4, slot: 'am', template: 'market-tip' },    { dow: 4, slot: 'pm', template: 'poll' },
      { dow: 5, slot: 'am', template: 'listing' },       { dow: 5, slot: 'pm', template: 'bts' },
      { dow: 6, slot: 'am', template: 'mh-moment' },     { dow: 6, slot: 'pm', template: 'client-love' },
      { dow: 0, slot: 'am', template: 'motivation' },    { dow: 0, slot: 'pm', template: 'tip-tuesday' },
    ],
    stats: { followers: '18.4K', engagement: '7.2%', posts: 18, scheduled: 3 },
    platforms_data: [
      { name: 'Instagram',  icon: '📷', color: '#e1306c', followers: '8.2K',  growth: '+5.4%',  eng: '8.1%',  posts: 10 },
      { name: 'Facebook',   icon: '📘', color: '#6fa8dc', followers: '6.1K',  growth: '+2.2%',  eng: '4.9%',  posts: 5 },
      { name: 'LinkedIn',   icon: '💼', color: '#6aa3d5', followers: '4.1K',  growth: '+11.2%', eng: '9.8%',  posts: 3 },
    ],
    topPosts: [
      { text: 'JUST SOLD — 8% over asking in Morgan Hill 🔑', eng: '9.2%', icon: '🔑', plat: 'IG + FB' },
      { text: 'SB9: Is your lot eligible to split? 📐',        eng: '8.1%', icon: '📐', plat: 'LI + FB' },
      { text: 'Morgan Hill market update Q1 2025 📊',          eng: '7.4%', icon: '📊', plat: 'LI' },
      { text: '5 things every Bay Area seller should know 🏡', eng: '6.8%', icon: '🏡', plat: 'IG + FB + LI' },
    ],
    donut: [
      { label: 'Instagram', val: 8200, color: '#e1306c' },
      { label: 'Facebook',  val: 6100, color: '#6fa8dc' },
      { label: 'LinkedIn',  val: 4100, color: '#6aa3d5' },
    ],
    engData: { ig: [30, 55, 42, 70, 88, 72, 95], fb: [22, 30, 28, 45, 50, 40, 58], li: [15, 20, 18, 32, 28, 35, 42] },
    reachData: [
      [900, 1300, 1100, 1800, 2200, 1700, 2400],
      [600, 750,  680,  1100, 1200, 900,  1400],
      [300, 420,  380,  600,  580,  680,  750 ],
    ],
  },

  gm: {
    id: 'gm', name: 'Givat Morgan', sub: 'קהילה ישראלית · מורגן היל',
    icon: '✡️', brandEmoji: '🇮🇱', handle: '@givat_morgan',
    class: 'brand-gm', badgeClass: 'gm', color: '#4a9eff',
    platforms: ['ig', 'fbg', 'wa'],
    rtl: true,
    defaultHashtags: ['גבעתמורגן', 'קהילהישראלית', 'מורגןהיל', 'ישראלים_בקליפורניה', 'שבתשלום', 'חגשמח', 'עםישראלחי', 'ישראליםבבייאריאה'],
    tones: ['חם ❤️', 'קהילה 🤝', 'חגיגי 🎉', 'עדכונים 📋', 'שבת 🕯️'],
    aiSuggestions: {
      'חם ❤️': [
        "שבת שלום לכל משפחות גבעת מורגן! 🕯️✨\nיהי רצון שתהיה השבת הזאת מלאה בשלום, אהבה ונחת. שולחן ערוך, משפחה מסביב, וניחוח של בית. שבת שלום ומבורך לכולם 💙🤍",
        "אין כמו להיות בקהילה שמרגישה כמו בית 🏠❤️\nתודה לכולם שבאתם לאירוע של אתמול. הרגשנו ממש שאנחנו בישראל — רק עם שמש קליפורנית 😄☀️\nגבעת מורגן — הבית שלנו כאן. 💙",
        "מהמורגן היל לגבעות ירושלים — הלב תמיד מחובר 🇮🇱💙\nגאים להיות ישראלים בלב עמק הסיליקון. כי לא משנה כמה רחוק אנחנו — עם ישראל חי, גם כאן בקליפורניה. ✡️",
      ],
      'קהילה 🤝': [
        "📣 עדכון קהילתי!\nסעודת שבת חודשית — השבת, יום שישי בשעה 19:00 🕯️\nכולם מוזמנים — משפחות, רווקים, חדשים בסביבה.\nתביאו מנה לשיתוף, תביאו את המשפחה, תבואו כמות שאתם 🙏\nהרשמה בלינק בביו!",
        "חדשים בבאי אריאה מישראל? 🇮🇱\nגבעת מורגן כאן בשבילכם! 🤝\nאנחנו קהילה של יותר מ-200 משפחות ישראליות במורגן היל וסביבה.\nאירועים, חגים, ילדים, תמיכה — כל מה שצריך כדי להרגיש בבית.\nשלחו לנו הודעה ונשמח לחבר אתכם! 💙",
        "💙🤍 קהילה זה הכל.\nבין אם זה ראש השנה, יום העצמאות, או סתם ברביקיו של יום שלישי —\nאנחנו תמיד שם אחד לשני. זה הדרך של גבעת מורגן 🙌\nתייגו מישהו שחלק מהקהילה שלנו! ⬇️",
      ],
      'חגיגי 🎉': [
        "🎉 חג שמח מגבעת מורגן לכל הקהילה!\nשנה של בריאות, שמחה, ואהבה לכל המשפחות שלנו 🥂✨\nמי מוכן לחגוג? תגיבו עם האמוג'י האהוב עליכם מהחג! ⬇️",
        "🇮🇱 יום העצמאות שמח!\nשבעים ושמונה שנה למדינת ישראל — ואנחנו חוגגים יחד כאן בגבעת מורגן! 🎆💙🤍\nריקודים, אוכל, גאווה ישראלית — הפרטים בביו. תבואו! 🕺💃\nעם ישראל חי! 🇮🇱✡️",
        "פורים שמח לכל הקהילה! 🎭🍩\nמי כבר הכין תחפושת? 👀😄\nנשמח לראות את כל התחפושות שלכם — שתפו בתגובות! 🎪🌟\nמשלוח מנות, אוזני המן, ורעשנים — זה חג שלנו! חג שמח! 🎉",
      ],
      'עדכונים 📋': [
        "📅 אירועי גבעת מורגן — מאי 2025:\n• 2 מאי — סעודת שבת משותפת, שעה 19:00\n• 9 מאי — יום כיף לילדים (דוברי עברית מוזמנים!)\n• 14 מאי — ברביקיו יום העצמאות 🇮🇱🎉\n• 23 מאי — ערב קולנוע ישראלי 🎬\nשמרו את התאריכים! 🗓️",
        "📋 חדשים במורגן היל מישראל?\nכל מה שצריך לדעת:\n✅ בתי ספר מעולים (מהטובים במדינה)\n✅ קהילה ישראלית פעילה — זה אנחנו! 🙌\n✅ 45 דקות מרכז הייטק של סן חוזה\n✅ מחירי דיור נמוכים יחסית לבאי אריאה\nשלחו לנו הודעה — ישמח לעזור! 💙",
        "🌍 ידעתם?\nיש מעל 200 משפחות ישראליות באזור מורגן היל וגילרוי.\nגבעת מורגן הוקמה כדי לאחד אותנו — לחגים, לתמיכה, לחברויות, ולשמירה על תרבות ישראלית רחוק מהבית.\nהצטרפו אלינו! 💙🤍",
      ],
      'שבת 🕯️': [
        "שבת שלום! 🕯️🕯️\nהנרות דולקים, השולחן ערוך, והמשפחה מסביב.\nמאחלים לכל קהילת גבעת מורגן שבת של מנוחה, שלום ואהבה.\nשבת שלום ומבורך! 💙🤍✨",
        "ערב שבת מגיע 🕯️\nזמן להאט, לנשום, ולהיות עם האנשים שאנחנו אוהבים.\nיהי רצון שתהיה שבת שלווה ומחזקת לכל אחד ואחת מאיתנו.\nשבת שלום מגבעת מורגן! ✡️💙",
        "שבת שלום לכל בית ישראל! 🇮🇱✨\nבין אם אתם מדליקים נרות עם המשפחה, מארחים חברים, או נחים לבד —\nאנחנו מאחלים לכולם שבת של שלום, בריאות ושמחה.\nשבת שלום! 🕯️🕯️💙🤍",
      ],
    },
    pillars: [
      { day: 'שני',   label: 'שאלת שבוע',  desc: 'מה התוכניות שלכם לשבוע?', count: 1, slot: 'AM' },
      { day: 'רביעי', label: 'סקר מקומי', desc: 'איפה הקפה הכי טוב באזור?', count: 1, slot: 'AM' },
      { day: 'שישי',  label: 'שאלת שבת',  desc: 'מה עושים השבת?',            count: 1, slot: 'PM' },
      { day: 'ראשון', label: 'תמונות חיים', desc: 'עיר · משפחה · פארק',      count: 1, slot: 'AM' },
    ],
    storyTemplates: [
      { id: 'community-question', name: 'שאלת שבוע 💬',   icon: '💬', color: '#4a9eff', platforms: ['ig', 'fbg', 'wa'], slot: 'am', desc: 'שני — מה התוכניות שלכם לשבוע?' },
      { id: 'local-poll',         name: 'סקר מקומי ☕',    icon: '☕', color: '#f59e0b', platforms: ['ig', 'fbg'],        slot: 'am', desc: 'רביעי — איפה הקפה הכי טוב באזור?' },
      { id: 'shabbat-question',   name: 'שאלת שבת 🕯️',    icon: '🕯️', color: '#a78bfa', platforms: ['ig', 'fbg', 'wa'], slot: 'pm', desc: 'שישי — מה עושים השבת?' },
      { id: 'lifestyle',          name: 'תמונות חיים 📸',  icon: '📸', color: '#22c55e', platforms: ['ig', 'fbg'],        slot: 'am', desc: 'ראשון — עיר / משפחה / פארק' },
      { id: 'shabbat',    name: 'שבת שלום 🕯️',       icon: '🕯️', color: '#4a9eff', platforms: ['ig', 'fbg', 'wa'], slot: 'pm', desc: 'סטורי שבת — יום שישי בערב' },
      { id: 'event',      name: 'אירוע קרוב 📅',      icon: '📅', color: '#22c55e', platforms: ['ig', 'fbg', 'wa'], slot: 'am', desc: 'תזכורת לאירוע קהילתי' },
      { id: 'holiday',    name: 'חג ישראלי ✡️',       icon: '✡️', color: '#f59e0b', platforms: ['ig', 'fbg'],        slot: 'am', desc: 'ברכות לחג' },
      { id: 'community',  name: 'עדכון קהילתי 💙',    icon: '💙', color: '#60a5fa', platforms: ['ig', 'fbg', 'wa'], slot: 'pm', desc: 'עדכון שוטף לקהילה' },
      { id: 'recap',      name: 'סיכום אירוע 🎉',     icon: '🎉', color: '#fb7185', platforms: ['ig', 'fbg'],        slot: 'pm', desc: 'תמונות וסיכום מהאירוע האחרון' },
      { id: 'inspiration', name: 'השראה 🌟',          icon: '🌟', color: '#a78bfa', platforms: ['ig', 'wa'],         slot: 'am', desc: 'ציטוט בעברית לבוקר' },
      { id: 'reminder',   name: 'תזכורת 📢',          icon: '📢', color: '#f97316', platforms: ['ig', 'fbg', 'wa'], slot: 'am', desc: 'תזכורת לאירוע / שבת / חג' },
      { id: 'kids',       name: 'פינת הילדים 👦',     icon: '👦', color: '#34d399', platforms: ['ig', 'fbg'],        slot: 'pm', desc: 'תוכן לילדים ומשפחות' },
    ],
    storyCadence: [
      { dow: 1, dayHeb: 'שני',    icon: '💬', color: '#4a9eff', template: 'community-question', label: 'שאלת שבוע',  caption: 'מה התוכניות שלכם לשבוע? 🗓️',   slot: 'am', desc: 'שאלה מעוררת שיחה לתחילת השבוע' },
      { dow: 3, dayHeb: 'רביעי', icon: '☕', color: '#f59e0b', template: 'local-poll',         label: 'סקר מקומי',  caption: 'איפה הקפה הכי טוב באזור? ☕',    slot: 'am', desc: 'סקר קהילתי על ספוטים מקומיים' },
      { dow: 5, dayHeb: 'שישי',  icon: '🕯️', color: '#a78bfa', template: 'shabbat-question',  label: 'שאלת שבת',   caption: 'מה עושים השבת? 🕯️',             slot: 'pm', desc: 'שאלת שבת — קצת לפני כניסת החג' },
      { dow: 0, dayHeb: 'ראשון', icon: '📸', color: '#22c55e', template: 'lifestyle',          label: 'תמונות חיים', caption: 'עיר · משפחה · פארק 🌿',          slot: 'am', desc: 'תמונות רגועות שמראות את החיים כאן' },
    ],
    defaultStoryWeek: [
      { dow: 1, slot: 'am', template: 'community-question' }, { dow: 1, slot: 'pm', template: 'community' },
      { dow: 2, slot: 'am', template: 'inspiration' },         { dow: 2, slot: 'pm', template: 'reminder' },
      { dow: 3, slot: 'am', template: 'local-poll' },          { dow: 3, slot: 'pm', template: 'community' },
      { dow: 4, slot: 'am', template: 'inspiration' },         { dow: 4, slot: 'pm', template: 'kids' },
      { dow: 5, slot: 'am', template: 'reminder' },            { dow: 5, slot: 'pm', template: 'shabbat-question' },
      { dow: 6, slot: 'am', template: 'recap' },               { dow: 6, slot: 'pm', template: 'community' },
      { dow: 0, slot: 'am', template: 'lifestyle' },           { dow: 0, slot: 'pm', template: 'event' },
    ],
    stats: { followers: '9.8K', engagement: '11.4%', posts: 22, scheduled: 4 },
    platforms_data: [
      { name: 'Instagram',     icon: '📷', color: '#e1306c', followers: '4.8K', growth: '+18.2%', eng: '12.4%', posts: 14 },
      { name: 'Facebook Group', icon: '👥', color: '#6fa8dc', followers: '3.6K', growth: '+8.1%',  eng: '9.2%',  posts: 6 },
      { name: 'WhatsApp',      icon: '💬', color: '#25d366', followers: '1.4K', growth: '+22.0%', eng: '14.1%', posts: 2 },
    ],
    topPosts: [
      { text: 'ברביקיו יום העצמאות — תמונות מהאירוע 🎉🇮🇱', eng: '14.2%', icon: '🎉', plat: 'IG + קבוצת FB' },
      { text: 'שבת שלום מגבעת מורגן 🕯️💙',                   eng: '12.8%', icon: '🕯️', plat: 'IG + קבוצת FB + WA' },
      { text: 'חדשים בבאי אריאה מישראל? קראו כאן 🇮🇱',       eng: '11.1%', icon: '🇮🇱', plat: 'קבוצת FB' },
      { text: 'אירועי מאי — שמרו תאריכים! 📅',               eng: '10.4%', icon: '📅', plat: 'IG + קבוצת FB' },
    ],
    donut: [
      { label: 'Instagram',     val: 4800, color: '#e1306c' },
      { label: 'Facebook Group', val: 3600, color: '#6fa8dc' },
      { label: 'WhatsApp',      val: 1400, color: '#25d366' },
    ],
    engData: { ig: [88, 120, 105, 150, 175, 145, 190], fbg: [60, 80, 72, 110, 130, 95, 145], wa: [40, 55, 48, 70, 85, 78, 100] },
    reachData: [
      [1100, 1600, 1400, 2000, 2500, 2100, 2800],
      [750,  1000, 900,  1400, 1600, 1200, 1800],
      [300,  450,  390,  550,  650,  600,  780 ],
    ],
    accounts: [
      { platform: 'Instagram',     icon: '📷', iconBg: 'rgba(236,72,153,.2)',   name: 'Givat Morgan',       handle: '@givat_morgan',          followers: '4.8K' },
      { platform: 'Facebook Group', icon: '👥', iconBg: 'rgba(24,119,242,.15)', name: 'גבעת מורגן',          handle: 'קבוצת פייסבוק · גבעת מורגן', followers: '3.6K' },
      { platform: 'WhatsApp',      icon: '💬', iconBg: 'rgba(37,211,102,.15)', name: 'קבוצת גבעת מורגן', handle: 'קבוצת קהילה',            followers: '1.4K' },
    ],
  },
};

// ── Default posts ─────────────────────────────────────────────────────────────

export const DEFAULT_POSTS = {
  sbf: [
    { id: 101, text: '📊 Monday Market Insight\nBay Area inventory is down 18% this quarter — Morgan Hill remains the most accessible entry point in Santa Clara County.\nMedian days on market: 14. List-to-sale: 103%. The data is clear. DM me to talk strategy.', platforms: ['ig', 'li'], date: nextWeekday(1, 9, 0), status: 'scheduled', emoji: '📊', series: 'market-insight', type: 'post', media: [] },
    { id: 102, text: '💚 Morgan Hill Local Love\nSaturday at the farmers market: local honey, fresh flowers, best tamales in Santa Clara County. This is the lifestyle Morgan Hill offers — and why I\'m proud to call it home. 🌸🍯\nWhere\'s your favorite local spot? ⬇️', platforms: ['ig', 'fb'], date: nextWeekday(3, 11, 0), status: 'scheduled', emoji: '💚', series: 'mh-local-love', type: 'post', media: [] },
    { id: 103, text: '⭐️ Client Love\n"Moshe was incredible from start to finish. We were first-time buyers and he made the whole process feel easy. Closed in 21 days!\"\n— Sarah & Mark T., Morgan Hill', platforms: ['ig'], date: nextWeekday(3, 15, 0), status: 'scheduled', emoji: '⭐️', series: 'client-love', type: 'story', media: [] },
    { id: 104, text: '🔑 Behind the Deal\nMy clients were outbid 3 times. We reworked their strategy — and on the very next offer we won. 8% over asking, no contingencies waived.\nWe stopped competing on price and started competing on terms. This is the game. 💪', platforms: ['ig', 'fb'], date: nextWeekday(5, 9, 0), status: 'scheduled', emoji: '🔑', series: 'behind-the-deal', type: 'post', media: [] },
    { id: 105, text: '📌 What is a 1031 Exchange and why should every Bay Area investor know about it?\nDefer capital gains taxes. Keep more money working for you.\nWant to know if it fits your situation? DM me. 📲', platforms: ['li', 'ig'], date: nextWeekday(1, 9, 0, 1), status: 'scheduled', emoji: '📌', series: 'market-insight', type: 'post', media: [] },
    { id: 106, text: '🚨 JUST LISTED — Morgan Hill\n4 Bed · 3 Bath · Vineyard Views\nChef\'s kitchen, backyard built for California living. Open house Sunday 1–4PM. DM for private tour.', platforms: ['ig', 'fb'], date: nextWeekday(3, 11, 0, 1), status: 'draft', emoji: '🏠', series: 'mh-local-love', type: 'post', media: [] },
    { id: 107, text: 'Took my kids to Uvas Creek trail this morning before school. The kind of morning that reminds you why you chose this place to build a life. Morgan Hill doesn\'t just have great real estate — it has a great life. 🌿☀️', platforms: ['ig'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 9, 0), status: 'published', emoji: '🎬', series: 'behind-the-deal', type: 'post', media: [] },
    { id: 108, text: '⭐️ Client Love\n"Moshe sold our Sunnyvale home in under two weeks — 8% over asking. His construction background gave him insights that truly resonated with buyers."\n— Linda K., Sunnyvale', platforms: ['ig'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 15, 0), status: 'published', emoji: '⭐️', series: 'client-love', type: 'story', media: [] },
  ],
  gm: [
    { id: 201, text: 'שבת שלום לכל משפחות גבעת מורגן! 🕯️✨\nיהי רצון שתהיה השבת הזאת מלאה בשלום, אהבה ונחת. שבת שלום ומבורך לכולם 💙🤍', platforms: ['ig', 'fbg', 'wa'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0), status: 'scheduled', emoji: '🕯️', media: [] },
    { id: 202, text: '📣 סעודת שבת משותפת — יום שישי הקרוב, שעה 19:00!\nכולם מוזמנים — משפחות, רווקים, חדשים בסביבה. תביאו מנה לשיתוף ותבואו כמות שאתם 🙏\nהרשמה בלינק בביו!', platforms: ['ig', 'fbg'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0), status: 'scheduled', emoji: '📣', media: [] },
    { id: 203, text: '🇮🇱 ברביקיו יום העצמאות היה מדהים!\nתודה לכולם שבאו — איזה קהילה יפה יש לנו. גאים להיות ישראלים בלב קליפורניה! 💙🤍 עם ישראל חי!', platforms: ['ig', 'fbg'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 18, 0), status: 'published', emoji: '🇮🇱', media: [] },
    { id: 204, text: 'טיוטה: חדשים בבאי אריאה מישראל? 🌍\nכל מה שצריך לדעת על מורגן היל והקהילה הישראלית כאן — נשמח לעזור ולחבר!', platforms: ['fbg', 'wa'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 12, 0), status: 'draft', emoji: '🌍', media: [] },
    { id: 205, text: '📅 אירועי גבעת מורגן — מאי 2025:\n• 2 מאי — סעודת שבת, 19:00\n• 9 מאי — יום כיף לילדים\n• 14 מאי — ברביקיו יום העצמאות 🇮🇱\n• 23 מאי — ערב קולנוע ישראלי 🎬\nשמרו תאריכים! 🗓️', platforms: ['ig', 'fbg', 'wa'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 9, 0), status: 'scheduled', emoji: '📅', media: [] },
    { id: 206, text: 'חג פסח כשר ושמח לכל משפחות גבעת מורגן! 🍷🌿\nמאחלים לכולם ליל סדר מרגש, שולחן ערוך עם אהובים, וחג של חירות ושמחה. חג שמח! 🕍', platforms: ['ig', 'fbg'], date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 8, 0), status: 'scheduled', emoji: '🍷', media: [] },
  ],
};

// series → pillar migration helper
export const SERIES_TO_PILLAR = {
  'market-insight': 'Useful', 'buyer-seller-tip': 'Useful', 'mortgage-breakdown': 'Useful',
  'investment-explainer': 'Useful', 're-myth': 'Useful',
  'client-love': 'Trust', 'behind-the-scenes': 'Trust', 'client-review': 'Trust',
  'family-community': 'Trust', 'day-in-the-life': 'Trust', 'transaction-win': 'Trust',
  'reel': 'Reach', 'mh-hidden-gem': 'Reach', 'local-business': 'Reach',
  'property-walkthrough': 'Reach', 'drone-footage': 'Reach',
};

// ── Peak times ─────────────────────────────────────────────────────────────────

export const PEAK_TIMES = {
  sbf: [
    { pillar: 'Useful', day: 'Tue', time: '9:00 AM',  lift: '2.1×', why: 'Educational posts hit professionals on their morning commute. LinkedIn shares peak here.',                                                    platforms: ['li', 'ig'] },
    { pillar: 'Trust',  day: 'Wed', time: '6:00 PM',  lift: '2.3×', why: 'Behind-the-scenes content gets longest dwell time after work hours. Your highest comment volume.',                                             platforms: ['ig', 'fb', 'fbp'] },
    { pillar: 'Reach',  day: 'Fri', time: '11:00 AM', lift: '1.7×', why: 'Friday morning is when people start dreaming about the weekend — Reels and listings get saved most.',                                         platforms: ['ig', 'fb'] },
    { pillar: 'Reach',  day: 'Sat', time: '10:00 AM', lift: '1.5×', why: 'Saturday open-house posts. Real-estate browsers are most active.',                                                                             platforms: ['ig', 'fb'] },
  ],
  gm: [
    { pillar: 'שאלת שבוע',  day: 'שני',   time: '9:00 AM',  lift: '3.0×', why: 'תחילת שבוע — האנשים פעילים בקבוצה. סטוריז של שאלות מקבלים פי 3 תגובות.',          platforms: ['ig', 'fbg', 'wa'] },
    { pillar: 'סקר מקומי',  day: 'רביעי', time: '9:00 AM',  lift: '2.4×', why: 'אמצע שבוע — קהילה פעילה ומחפשת המלצות.',                                          platforms: ['ig', 'fbg'] },
    { pillar: 'שאלת שבת',   day: 'שישי',  time: '4:00 PM',  lift: '2.8×', why: 'שעות לפני שבת — שיא של אינטראקציה ושיתוף בקבוצת ה-WhatsApp.',                    platforms: ['ig', 'fbg', 'wa'] },
    { pillar: 'תמונות חיים', day: 'ראשון', time: '10:00 AM', lift: '1.9×', why: 'יום ראשון רגוע — אנשים גוללים ומחפשים תוכן קליל.',                               platforms: ['ig', 'fbg'] },
  ],
};

// ── AI Suggestions (dashboard cards) ─────────────────────────────────────────

export const SUGGESTIONS = {
  sbf: [
    { type: 'tip',  text: 'Wednesday 6PM gets 2.3× more engagement than your usual 9AM slot for Trust pillar posts.', action: 'Reschedule' },
    { type: 'idea', text: 'Reels are outperforming static posts by 4× on IG. You have 3 unused videos in your library — let\'s plan them.', action: 'Plan a Reel' },
    { type: 'warn', text: 'You haven\'t posted a Market Insight in 8 days. Your audience is overdue.', action: 'Draft one' },
  ],
  gm: [
    { type: 'tip',  text: 'סטוריז של שאלת שבוע מקבלים פי 3 תגובות מסקרים רגילים', action: 'תזמן עכשיו' },
    { type: 'idea', text: 'שבועות מתקרב בעוד 2 שבועות — הכנו 4 טיוטות לחג', action: 'ראה טיוטות' },
    { type: 'warn', text: 'הקבוצה בפייסבוק שקטה השבוע. שתפו עדכון או שאלה', action: 'צור פוסט' },
  ],
};

// ── Israeli holidays ───────────────────────────────────────────────────────────

export const ISRAELI_HOLIDAYS = [
  // ── 2025 ──
  { name: 'ראש השנה',    emoji: '🍎', color: '#f59e0b', dates: [[2025, 8, 22], [2025, 8, 23]] },
  { name: 'יום כיפור',   emoji: '🕊️', color: '#a78bfa', dates: [[2025, 9, 1],  [2025, 9, 2]] },
  { name: 'סוכות',       emoji: '🌿', color: '#34d399', dates: [[2025, 9, 6],  [2025, 9, 7]] },
  { name: 'הושענא רבה',  emoji: '🌿', color: '#34d399', dates: [[2025, 9, 12]] },
  { name: 'שמחת תורה',   emoji: '📖', color: '#60a5fa', dates: [[2025, 9, 13], [2025, 9, 14]] },
  { name: 'חנוכה',       emoji: '🕎', color: '#fbbf24', dates: [[2025, 11, 14], [2025, 11, 15], [2025, 11, 16], [2025, 11, 17], [2025, 11, 18], [2025, 11, 19], [2025, 11, 20], [2025, 11, 21]] },
  // ── 2026 ──
  { name: 'ט"ו בשבט',  emoji: '🌳', color: '#4ade80', dates: [[2026, 1, 1]] },
  { name: 'פורים',       emoji: '🎭', color: '#fb7185', dates: [[2026, 2, 13]] },
  { name: 'פסח',         emoji: '🍷', color: '#c084fc', dates: [[2026, 3, 1], [2026, 3, 2], [2026, 3, 3], [2026, 3, 4], [2026, 3, 5], [2026, 3, 6], [2026, 3, 7], [2026, 3, 8]] },
  { name: 'יום השואה',   emoji: '🕯️', color: '#94a3b8', dates: [[2026, 3, 19]] },
  { name: 'יום הזיכרון', emoji: '💙', color: '#60a5fa', dates: [[2026, 3, 29]] },
  { name: 'יום העצמאות', emoji: '🇮🇱', color: '#4a9eff', dates: [[2026, 3, 30]] },
  { name: 'ל"ג בעומר',  emoji: '🔥', color: '#fb923c', dates: [[2026, 4, 14]] },
  { name: 'שבועות',      emoji: '🌸', color: '#f472b6', dates: [[2026, 4, 21], [2026, 4, 22]] },
];

// Build fast lookup: "YYYY-M-D" → [holiday, ...]
export const HOLIDAY_MAP = {};
ISRAELI_HOLIDAYS.forEach(h => {
  h.dates.forEach(([yr, mo, dy]) => {
    const key = `${yr}-${mo}-${dy}`;
    if (!HOLIDAY_MAP[key]) HOLIDAY_MAP[key] = [];
    HOLIDAY_MAP[key].push(h);
  });
});

// Pre-made Hebrew holiday captions for quick-post
export const HOLIDAY_CAPTIONS = {
  'ראש השנה':   'שנה טובה ומתוקה מכל קהילת גבעת מורגן! 🍎🍯\nיהי רצון שתהיה השנה הזאת שנה של בריאות, אהבה, שמחה והצלחה לכל משפחותינו.\nתכתבו ותחתמו לאלתר לחיים טובים! שנה טובה! ✨💙🤍',
  'יום כיפור':   'גמר חתימה טובה לכל קהילת גבעת מורגן 🕊️\nביום הכי קדוש בשנה, אנחנו מאחלים לכולם צום קל ומשמעותי.\nיהי רצון שנצא מהיום הזה מחודשים ומחוזקים, כתובים וחתומים בספר החיים. 💙',
  'סוכות':       'חג סוכות שמח מגבעת מורגן! 🌿🍋\nמי כבר בנה סוכה? 🏠✨ מאחלים לכולם חג שמח, ארבעת המינים נאים, והרבה שמחה בסוכה!\nחג שמח! 💙🤍',
  'שמחת תורה':  'שמחת תורה שמחה! 📖💃🕺\nהורים סובבים עם ספרי תורה, ילדים רוקדים ושרים — זה אחד הרגעים היפים ביותר בשנה!\nמאחלים לכולם שמחה אמיתית. חג שמח מגבעת מורגן! 🎉💙',
  'חנוכה':       'חנוכה שמח מגבעת מורגן! 🕎✨\nחג האורות מגיע ואנחנו מדליקים נרות יחד!\nמי מוכן לסופגניות וסביבונים? 🍩🪆\nחנוכה שמח לכל הקהילה! 💙🤍🕎',
  'ט"ו בשבט':  'ט"ו בשבט שמח! 🌳🌱\nראש השנה לאילנות — יום לזכור שהאדמה היא הבית שלנו.\nנשמח אם תשתפו — איזה פרי ישראלי אתם הכי מתגעגעים אליו? 🍊🍇🥭\nחג שמח! 💙',
  'פורים':       'פורים שמח לכל הקהילה! 🎭🍩\nמי כבר בתחפושת? 👀😄 שלחו לנו את התמונות שלכם!\nמשלוח מנות, אוזני המן, ורעשנים — זה החג שלנו! 🎪\nפורים שמח מגבעת מורגן! 🎉💙🤍',
  'פסח':         'חג פסח כשר ושמח מגבעת מורגן! 🍷🌿\nמאחלים לכולם ליל סדר מרגש, שולחן ערוך עם אהובים, וחג של חירות ושמחה.\nחג פסח כשר ושמח! 🕍✨💙🤍',
  'יום השואה':   'זכור. לעולם לא עוד. 🕯️\nביום הזיכרון לשואה ולגבורה, אנחנו מכופים ראש לזכרם של שישה מיליון קדושים.\nיזכר זכרם לעולם ועד. 💙🤍✡️',
  'יום הזיכרון': 'יום הזיכרון לחללי מערכות ישראל ולנפגעי פעולות האיבה. 💙\nקהילת גבעת מורגן משתתפת בצערן של משפחות השכולות.\nזכרם ייחצב בליבנו לעד. יהי זכרם ברוך. 🕯️',
  'יום העצמאות': 'יום העצמאות שמח! 🇮🇱🎉\nשבעים ושמונה שנה למדינת ישראל — ואנחנו חוגגים יחד כאן בגבעת מורגן!\nריקודים, אוכל, גאווה ישראלית — מי בא? 🕺💃\nעם ישראל חי! 💙🤍🎆',
  'ל"ג בעומר':  'ל"ג בעומר שמח! 🔥\nהדורה דולקת, ילדים שמחים, וקהילה מתכנסת סביב המדורה.\nמאחלים לכולם ל"ג בעומר שמח ומחמם לב! 💙\nגבעת מורגן — יחד תמיד! 🤝',
  'שבועות':      'חג שבועות שמח מגבעת מורגן! 🌸🍦\nחג מתן תורה — לילות לימוד, בוקר של גבינות ועוגת גבינה 🧀😄\nמי מביא עוגת גבינה לאירוע שלנו? 🙋‍♀️🙋\nחג שמח לכל הקהילה! 💙🤍',
};

// ── Story slots ────────────────────────────────────────────────────────────────
// STORY_SLOTS[brand][weekKey] = templateId | null
export const STORY_SLOTS = { sbf: {}, gm: {} };

// ── Months ─────────────────────────────────────────────────────────────────────
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
