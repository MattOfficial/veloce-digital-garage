-- Migration to add support for multiple LLM providers (OpenAI, Deepseek)
ALTER TABLE public.users 
ADD COLUMN encrypted_openai_key TEXT,
ADD COLUMN encrypted_deepseek_key TEXT,
ADD COLUMN preferred_llm_provider TEXT DEFAULT 'gemini';
