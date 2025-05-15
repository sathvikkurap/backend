import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const logoFile = formData.get('logo') as File | null;
    const clubInfo = JSON.parse(formData.get('clubInfo') as string);
    const outputType = formData.get('outputType') as 'pdf' | 'social';

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.7 }
    });

    const prompt = createPrompt(clubInfo, outputType);
    const result = await model.generateContent([prompt]);
    let generatedContent = await result.response.text();
    
    // Extract HTML from markdown code blocks
    const htmlMatch = generatedContent.split("```")[1];
    generatedContent = htmlMatch.substring(4);

    if (logoFile) {
        const logoBuffer = await logoFile.arrayBuffer();
        const base64Logo = Buffer.from(logoBuffer).toString('base64');
        const mimeType = logoFile.type;
        generatedContent = generatedContent.replace(
            'absjd', 
            `<img src="data:${mimeType};base64,${base64Logo}" class="w-24 h-24 object-contain"/>`
        );
    }    

    return await generateOutput(generatedContent, outputType);
    
  } catch (error) {
    console.error(
        'Generation error:', error.message,
        '\nStack trace:', error.stack,
        '\nTimestamp:', new Date().toISOString()
    );
    return NextResponse.json(
        { error: 'Failed to generate document', details: error.message },
        { status: 500 }
    );
}
}

function createPrompt(clubInfo: any, outputType: 'pdf' | 'social' = 'pdf'): string {
    if (outputType === 'social') {
        return createSocialPrompt(clubInfo);
      }
    return `
  Generate a COMPLETE HTML document (including <!DOCTYPE html>, <html>, <head>, and <body>) styled with embedded Tailwind CSS for a ${outputType === 'pdf' ? 'single-page A4 poster (210mm x 297mm)' : 'square social media post (1080x1080px)'} using ALL the provided club details below.
  
  <<< Club Information >>>
  - Name: ${clubInfo.name}
  - Mission: ${clubInfo.description}
  - Founded: ${clubInfo.foundingDate}
  - Current Members: ${clubInfo.currentMemberCount}
  - Meeting Frequency: ${clubInfo.meetingFrequency}
  - Meeting Location: ${clubInfo.meetingLocation}
  - Upcoming Events: ${clubInfo.upcomingEvents}
  - Membership Benefits: ${clubInfo.benefits}
  - Achievements: ${clubInfo.achievements}
  - Leadership Team: ${clubInfo.leadershipTeam}
  - Social Media:
      Facebook: ${clubInfo.socialMedia.facebook}
      Twitter: ${clubInfo.socialMedia.twitter}
      Instagram: ${clubInfo.socialMedia.instagram}
  - Contact Email: ${clubInfo.contactEmail}
  - Contact Phone: ${clubInfo.contactPhone}
  - Website: ${clubInfo.websiteUrl}
  
  <<< Design Requirements >>>
  1. **Use ALL provided club information in relevant, visually distinct sections.**
  2. **Mandatory sections:**
     - Header with club name, logo placeholder (use the text 'absjd' as a placeholder), and founding date.
     - Mission statement.
     - Achievements timeline or highlights.
     - Contact information (email, phone, website).
     - Social media handles (as text, not icons, for print).
  3. **Recommended (choose at least 2-3, or more if space allows):**
     - Membership benefits grid or list.
     - Upcoming events section.
     - Meeting schedule card.
     - Member statistics infographic.
     - Leadership team display.
     - Any other creative, visually engaging elements that fit the data and page size.
     - If some data is missing, skip that section and use the space for more creative design elements.
  4. **Design and Layout:**
     - Use a professional, modern gradient background with high-contrast, readable text.
     - All measurements and sizing must be in millimeters (mm) for A4, or pixels (px) for social post. Do NOT use other units.
     - Ensure ALL content fits on a single ${outputType === 'pdf' ? 'A4 page (210mm x 297mm)' : '1080x1080px square'}; do the math and make sure the units add up. In fact leave a tiny bit of empty space as buffer.
     - Use Tailwind CSS for all styling.
     - For the logo, use a dynamic container that can auto-crop or fit any aspect ratio, or use object-fit: contain.
     - For print (PDF), do NOT use social media icons, only text handles. For social, you may use icons and emojis for visual appeal.
     - For social post, use large, bold text and mobile-friendly layout. Add decorative elements (e.g., sparkles, stars, gradients, emojis) for engagement.
     - Be creative! You may invent up to 50 potential design elements, but only include those that fit and enhance the poster/post.
     - Use whitespace and sectioning for clarity and visual hierarchy.
     - All content must be visually balanced and not overcrowded.
  5. **Technical:**
     - The HTML must be fully self-contained and ready for rendering in a headless browser.
     - The logo placeholder must be the text 'absjd' (to be replaced with a base64 image). Only just say absjd, no image tags or anything. I will insert the image after.
     - For A4, include: 
       <style>
         @page { size: A4; }
         body { -webkit-print-color-adjust: exact; }
       </style>
     - For social, set the body to 1080x1080px and use high-DPI friendly styles.
     - Do NOT use external images, fonts, or scripts except for Tailwind CDN.
     - Do NOT include any code blocks or markdown formatting in your output—output only the HTML.
  
  <<< Example Structure >>>
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      ${outputType === 'pdf'
        ? `@page { size: A4; }
           body { -webkit-print-color-adjust: exact; }`
        : `body { width: 1080px; height: 1080px; margin: 0; padding: 0; overflow: hidden; }`
      }
    </style>
  </head>
  <body class="${outputType === 'pdf'
      ? 'w-[210mm] h-[297mm] bg-gradient-to-br from-blue-100 to-purple-50 p-8 space-y-8'
      : 'w-[1080px] h-[1080px] bg-gradient-to-br from-pink-100 to-yellow-100 p-8 flex flex-col items-center justify-center space-y-6'
    }">
    <!-- Header with logo (replace 'absjd' with base64 image), club name, and founding date -->
    <header class="flex items-center gap-6 mb-8">
      <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
        absjd
      </div>
      <div>
        <h1 class="text-5xl font-bold text-blue-800">${clubInfo.name}</h1>
        <p class="text-xl text-blue-600 mt-2">Est. ${clubInfo.foundingDate}</p>
      </div>
    </header>
    <!-- ...other sections as described above, using the provided data... -->
  </body>
  </html>
  `;
  }
  
  function createSocialPrompt(clubInfo: any): string {
    return `
  Generate a COMPLETE HTML document (including <!DOCTYPE html>, <html>, <head>, and <body>) styled with embedded Tailwind CSS for a **square social media post (1080x1080px)** using ALL the provided club details below.
  
  <<< Club Information >>>
  - Name: ${clubInfo.name}
  - Mission: ${clubInfo.description}
  - Founded: ${clubInfo.foundingDate}
  - Current Members: ${clubInfo.currentMemberCount}
  - Meeting Frequency: ${clubInfo.meetingFrequency}
  - Meeting Location: ${clubInfo.meetingLocation}
  - Upcoming Events: ${clubInfo.upcomingEvents}
  - Membership Benefits: ${clubInfo.benefits}
  - Achievements: ${clubInfo.achievements}
  - Leadership Team: ${clubInfo.leadershipTeam}
  - Social Media:
      Facebook: ${clubInfo.socialMedia.facebook}
      Twitter: ${clubInfo.socialMedia.twitter}
      Instagram: ${clubInfo.socialMedia.instagram}
  - Contact Email: ${clubInfo.contactEmail}
  - Contact Phone: ${clubInfo.contactPhone}
  - Website: ${clubInfo.websiteUrl}
  
  <<< Social Media Post Design Requirements >>>
  1. **Make the post visually stunning and highly engaging for Instagram or similar platforms.**
  2. **Emphasize creative, colorful, and decorative border/edge designs** (e.g., gradients, sparkles, abstract shapes, confetti, doodles, stickers, or any fun elements around the edges).
  3. **Use large, bold, and playful typography** for the club name and key info.
  4. **Logo placeholder:** Use the text 'absjd' as a placeholder for the logo, centered or prominently placed, inside a dynamic container that fits any aspect ratio (object-fit: contain, rounded, shadow, etc).
  5. **Minimal constraints:** You do NOT need to include every data field—prioritize the most visually impactful info (e.g., club name, mission, 1-2 achievements, 1-2 benefits, and a call to action or event).
  6. **Creative freedom:** You may invent and use up to 50 different decorative HTML/CSS elements, but only include those that enhance the visual appeal and fit the square format.
  7. **Use emojis, icons, and playful color schemes** liberally, especially in headings and near the edges.
  8. **All measurements and sizing must be in pixels (px) for 1080x1080px.**
  9. **Do NOT use external images, fonts, or scripts except for Tailwind CDN.**
  10. **Do NOT include any code blocks or markdown formatting in your output—output only the HTML.**
  11. **Ensure the design is mobile-friendly, readable, and visually balanced.**
  12. **The logo placeholder ('absjd') must be easy to find and replace.**
  13. Try to space your text out as much as possible to fill up space. make it very clear what the name of the club is.
  
  <<< Example Structure >>>
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { width: 1080px; height: 1080px; margin: 0; padding: 0; overflow: hidden; }
      /* Add extra CSS for edge decorations if needed */
    </style>
  </head>
  <body class="relative w-[1080px] h-[1080px] bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 flex flex-col items-center justify-center overflow-hidden">
    <!-- Decorative edge elements -->
    <div class="absolute top-0 left-0 w-full h-24 flex justify-between px-8 pointer-events-none">
      <div class="w-24 h-24 rounded-full bg-pink-300 opacity-60 blur-2xl"></div>
      <div class="w-24 h-24 rounded-full bg-yellow-300 opacity-60 blur-2xl"></div>
    </div>
    <div class="absolute bottom-0 right-0 w-full h-24 flex justify-between px-8 pointer-events-none">
      <div class="w-24 h-24 rounded-full bg-blue-300 opacity-60 blur-2xl"></div>
      <div class="w-24 h-24 rounded-full bg-purple-300 opacity-60 blur-2xl"></div>
    </div>
    <!-- Sparkles and confetti -->
    <div class="absolute top-10 left-10 text-4xl animate-bounce">✨</div>
    <div class="absolute bottom-10 right-10 text-4xl animate-spin">🎉</div>
    <!-- Main content -->
    <div class="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 py-8">
      <div class="w-40 h-40 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 overflow-hidden">
        absjd
      </div>
      <h1 class="text-5xl font-extrabold text-pink-700 mb-2 text-center">${clubInfo.name}</h1>
      <p class="text-2xl text-blue-700 mb-4 text-center">${clubInfo.description}</p>
      ${clubInfo.upcomingEvents ? `<div class="bg-yellow-200 rounded-xl px-6 py-2 mb-4 text-lg font-semibold text-yellow-900 shadow">Next: ${clubInfo.upcomingEvents.split(',')[0]}</div>` : ''}
      ${clubInfo.benefits ? `<div class="flex flex-wrap gap-2 justify-center mb-4">${clubInfo.benefits.split(',').slice(0,2).map((b: string) => `<span class="bg-pink-200 rounded-full px-4 py-1 text-pink-800 text-base font-medium">${b.trim()}</span>`).join('')}</div>` : ''}
      ${clubInfo.achievements ? `<div class="text-lg text-purple-700 mb-4">🏆 ${clubInfo.achievements.split(',')[0]}</div>` : ''}
      <div class="flex gap-4 mt-4">
        ${clubInfo.socialMedia.instagram ? `<span class="text-2xl">📸 @${clubInfo.socialMedia.instagram}</span>` : ''}
        ${clubInfo.socialMedia.twitter ? `<span class="text-2xl">🐦 @${clubInfo.socialMedia.twitter}</span>` : ''}
      </div>
    </div>
  </body>
  </html>
  `;
  }
  
async function generateOutput(content: string, type: 'pdf' | 'social'): Promise<NextResponse> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });

  const page = await browser.newPage();
  
  if (type === 'social') {
    await page.setViewport({
      width: 1080,
      height: 1080,
      deviceScaleFactor: 2 // High DPI for crisp images
    });
  }

  await page.setContent(content, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  let result;
  if (type === 'pdf') {
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    result = new NextResponse(pdfBuffer, {
      headers: { 'Content-Type': 'application/pdf' }
    });
  } else {
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
      omitBackground: true
    });
    result = new NextResponse(screenshot, {
      headers: { 'Content-Type': 'image/png' }
    });
  }

  await browser.close();
  return result;
}
