const JOBS_API_URL = "https://artificialintelligencejobs.co/api/jobs"; // O la API de AI Jobs asignada
const EMOJI_API_URL = "https://emojihub.yurace.pro/api/random"; 

/**
 * Obtiene los emojis desde EmojiHub
 */
export async function fetchEmoji() {
  try {
    const response = await fetch(EMOJI_API_URL);
    if (!response.ok) throw new Error("Error fetching emoji");
    const data = await response.json();
    // Unimos los códigos HTML del arreglo de htmlCode
    return data.htmlCode ? data.htmlCode.join("") : "💻";
  } catch (error) {
    console.warn("EmojiHub unavailable, using fallback emoji:", error);
    return "🤖";
  }
}

//Obtiene la lista de empleos de IA (máximo 15)
 
export async function fetchJobs() {
  try {
    const response = await fetch(JOBS_API_URL); 
    if (!response.ok) throw new Error("Failed to fetch jobs data");
    
    const data = await response.json();
    
    // La API devuelve un objeto con la propiedad .jobs
    return data.jobs.slice(0, 15); 
  } catch (error) {
    console.error("Error loading jobs:", error);
    return [];
  }
}


