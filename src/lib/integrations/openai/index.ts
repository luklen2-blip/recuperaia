import { AiProvider } from '../types';
import { OpenAiProvider } from './client';
import { RuleBasedRecoveryProvider } from './fallback';

export function createAiProvider(apiKey?: string, model?: string): AiProvider {
  const hasValidKey = Boolean(apiKey && apiKey.trim().length > 10);

  if (hasValidKey) {
    return new OpenAiProvider(apiKey!.trim(), model);
  }

  // Fallback transparente e documentado
  return new RuleBasedRecoveryProvider();
}
