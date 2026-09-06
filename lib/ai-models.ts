// Verified against https://developers.openai.com/api/docs/models on 2026-09-06.
// Keep the picker and server allowlist on the same catalog.
export const AI_PROVIDER_IDS = ['openai', 'gemini', 'claude'] as const;
export type AIProvider = typeof AI_PROVIDER_IDS[number];
export const AI_MODEL_IDS = ['gpt-6-astra', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-4.1', 'gpt-4.1-mini', 'gemini-3.8-flash', 'gemini-3.1-pro-preview', 'claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5-20251001'] as const;
export type AIModel = typeof AI_MODEL_IDS[number];
export const DEFAULT_AI_MODEL: AIModel = 'gpt-5.6-sol';
export const AI_MODELS: Record<AIModel, {provider: AIProvider; label: string; description: string}> = {
  'gpt-6-astra': {provider: 'openai', label: 'GPT-6 Astra · 최상위', description: '복잡한 질문을 깊이 다루는 최상위 모델이에요. 다른 선택지보다 토큰당 요금이 높아요.'},
  'gpt-5.6-sol': {provider: 'openai', label: 'GPT-5.6 Sol · 기본', description: '면담 답변의 품질을 우선한 기본 모델이에요.'},
  'gpt-5.6-terra': {provider: 'openai', label: 'GPT-5.6 Terra · 균형', description: '답변 품질과 비용을 함께 고려할 때 선택해요.'},
  'gpt-5.6-luna': {provider: 'openai', label: 'GPT-5.6 Luna · 경제적', description: '여러 번 체험할 때 비용을 낮추는 데 적합해요.'},
  'gpt-4.1': {provider: 'openai', label: 'GPT-4.1 · 이전 모델', description: '이전에 사용하던 GPT-4.1과 답변을 비교할 수 있어요.'},
  'gpt-4.1-mini': {provider: 'openai', label: 'GPT-4.1 mini · 이전 모델', description: '기존 앱에서 사용하던 소형 모델이에요.'},
  // Google and Anthropic catalogs verified on 2026-09-07.
  'gemini-3.8-flash': {provider: 'gemini', label: 'Gemini 3.8 Flash · 기본', description: 'Google의 최신 Flash 모델로 면담을 체험해요.'},
  'gemini-3.1-pro-preview': {provider: 'gemini', label: 'Gemini 3.1 Pro · 미리보기', description: '복잡한 질문을 다루는 Pro 모델이에요. 미리보기 모델은 제공 상태가 바뀔 수 있어요.'},
  'claude-opus-5': {provider: 'claude', label: 'Claude Opus 5 · 고성능', description: '복잡한 질문과 깊이 있는 답변을 다루는 모델이에요.'},
  'claude-sonnet-5': {provider: 'claude', label: 'Claude Sonnet 5 · 기본', description: '답변 품질과 속도를 함께 고려한 기본 모델이에요.'},
  'claude-haiku-4-5-20251001': {provider: 'claude', label: 'Claude Haiku 4.5 · 경제적', description: '빠른 응답과 낮은 비용이 필요할 때 선택해요.'},
};

export const AI_PROVIDERS: Record<AIProvider, {label: string; company: string; defaultModel: AIModel; placeholder: string; keyUrl: string; pricingUrl: string; dataUrl: string}> = {
  openai: {label: 'OpenAI', company: 'OpenAI', defaultModel: DEFAULT_AI_MODEL, placeholder: 'sk-…', keyUrl: 'https://platform.openai.com/api-keys', pricingUrl: 'https://developers.openai.com/api/docs/pricing', dataUrl: 'https://developers.openai.com/api/docs/guides/your-data'},
  gemini: {label: 'Gemini', company: 'Google', defaultModel: 'gemini-3.8-flash', placeholder: 'AIza…', keyUrl: 'https://aistudio.google.com/api-keys', pricingUrl: 'https://ai.google.dev/gemini-api/docs/pricing', dataUrl: 'https://ai.google.dev/gemini-api/terms'},
  claude: {label: 'Claude', company: 'Anthropic', defaultModel: 'claude-sonnet-5', placeholder: 'sk-ant-…', keyUrl: 'https://platform.claude.com/settings/keys', pricingUrl: 'https://platform.claude.com/docs/en/about-claude/pricing', dataUrl: 'https://platform.claude.com/docs/en/build-with-claude/zero-data-retention'},
};

export function modelsForProvider(provider: AIProvider) {
  return AI_MODEL_IDS.filter(model => AI_MODELS[model].provider === provider);
}

export function modelResponseOptions(model: AIModel, test: boolean) {
  if (model === 'gpt-6-astra') {
    // Astra requires reasoning; its output budget includes reasoning tokens.
    return {reasoning: {effort: 'low' as const}, max_output_tokens: test ? 4096 : 8192};
  }
  if (model.startsWith('gpt-5.6-')) {
    // Preserve the short, conversational latency of the original non-reasoning model.
    return {reasoning: {effort: 'none' as const}, max_output_tokens: test ? 128 : 1500};
  }
  return {max_output_tokens: test ? 40 : 700};
}
