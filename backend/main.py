from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Check GROQ_API_KEY
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # Just a warning or we can let Groq client throw an error later if it's not set
    print("Warning: GROQ_API_KEY is not set in the environment variables.")

# Initialize Groq client
client = Groq(api_key=api_key)

app = FastAPI(title="AI Blog Title Generator")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topic: str

@app.post("/generate")
async def generate_titles(request: TopicRequest):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
        
    try:
        # Prompt construction to instruct Llama3 to return a JSON array of strings
        prompt = (
            f"Generate 10 catchy, SEO-optimized blog titles for the topic: '{request.topic}'.\n"
            "Return ONLY a raw JSON format output containing a single object with a key 'titles' which contains an array of the 10 title strings. "
            "Do not include any extra text, markdown formatting like ```json, or explanations. Just the JSON object."
        )
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert SEO copywriter. You only reply with strictly formatted JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        
        # Parse the JSON response text
        content = chat_completion.choices[0].message.content
        import json
        result = json.loads(content)
        
        # Ensure it has the correct form
        if "titles" not in result:
            result = {"titles": list(result.values())[0] if isinstance(result, dict) and len(result)>0 else []}
            
        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to generate titles")


from typing import List

class Message(BaseModel):
    role: str
    content: str
    
class TopicChatRequest(BaseModel):
    topic: str
    title: str
    messages: List[Message]

@app.post("/chat")
async def chat_about_title(request: TopicChatRequest):
    if not request.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
        
    try:
        # Construct the system context to ground the LLM
        system_prompt = (
            f"You are an expert SEO copywriter and blog strategist. "
            f"The user is writing a blog post about '{request.topic}' and is considering using the title '{request.title}'. "
            f"Your job is to answer their questions about this title, explain why it's good for SEO, or help them outline the post."
        )
        
        api_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            api_messages.append({"role": msg.role, "content": msg.content})
            
        chat_completion = client.chat.completions.create(
            messages=api_messages,
            model="llama-3.1-8b-instant",
            temperature=0.7,
        )
        
        reply_content = chat_completion.choices[0].message.content
        return {"reply": reply_content}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to chat with AI")

@app.get("/")
def read_root():
    return {"message": "AI Blog Title Generator API is running!"}
