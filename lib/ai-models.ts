// Verified against https://developers.openai.com/api/docs/models on 2026-09-06.
// Keep the picker and server allowlist on the same catalog.
export const AI_MODEL_IDS = ['gpt-6-astra', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-4.1', 'gpt-4.1-mini'] as const;
export type AIModel = typeof AI_MODEL_IDS[number];
export const DEFAULT_AI_MODEL: AIModel = 'gpt-5.6-sol';
export const AI_MODELS: Record<AIModel, {label: string; description: string}> = {
  'gpt-6-astra': {label: 'GPT-6 Astra · 최상위', description: '복잡한 질문을 깊이 다루는 최상위 모델이에요. 다른 선택지보다 토큰당 요금이 높아요.'},
  'gpt-5.6-sol': {label: 'GPT-5.6 Sol · 기본', description: '면담 답변의 품질을 우선한 기본 모델이에요.'},
  'gpt-5.6-terra': {label: 'GPT-5.6 Terra · 균형', description: '답변 품질과 비용을 함께 고려할 때 선택해요.'},
  'gpt-5.6-luna': {label: 'GPT-5.6 Luna · 경제적', description: '여러 번 체험할 때 비용을 낮추는 데 적합해요.'},
  'gpt-4.1': {label: 'GPT-4.1 · 이전 모델', description: '이전에 사용하던 GPT-4.1과 답변을 비교할 수 있어요.'},
  'gpt-4.1-mini': {label: 'GPT-4.1 mini · 이전 모델', description: '기존 앱에서 사용하던 소형 모델이에요.'},
};

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
