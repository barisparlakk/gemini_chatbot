import os
from django.shortcuts import render
from django.http import JsonResponse
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

#Supabase Setup
supabase: Client = create_client(os.getenv("SUPABASE_URL")),
os.getenv("SUPABASE_KEY")

#Gemini Setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-pro-exp-02-05")

def get_conversation_history(user_id):
    response = supabase.table("Conversations").select("message,response").eq("user_id", user_id).order("created_at").execute()
    return response.data

def save_conversation(user_id, message, response):
    supabase.table("conversations").insert({
        "user_id": user_id,
        "message": message,
        "response": response
    }).execute()

def get_gemini_response(user_id, message):
    history = get_conversation_history(user_id)
    context = "\n".join([f"User: {item['message']}\nBot: {item['response']}" for item in history])
    prompt = f"{context}\nUser: {message}\nBot:"
    response = model.generate_content(prompt)
    return response.text

def index(request):
    return render(request, "index.html")

def chat(request):
    if request.method == "POST":
        data = request.POST
        user_id = data.get("user_id", "default_user") #Replace with session/auth later
        message = data.get("message")

        if not message:
            return JsonResponse({"error": "No messsage provided"},status=400)
        response = get_gemini_response(user_id, message)
        save_conversation(user_id, message, response)
        return JsonResponse({"response":response})
    return JsonResponse({"error": "Invalid request"}, status=400)