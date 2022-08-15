import { AssetType } from '@/composables/data';
import { invoke } from '@tauri-apps/api/tauri';

export type ValidationResult = {
  message: string,
  ok: boolean,
}

export function validateName(name: string, existence: boolean): ValidationResult {
  if (existence) {
    return { ok: false, message: 'Name already exists' };
  }

  if (!name.length) {
    return { ok: false, message: 'Name is empty' };
  }

  if (name.includes(' ')) {
    return { ok: false, message: 'Name can not contain spaces' };
  }

  if (name.includes('#')) {
    return { ok: false, message: 'Name can not contain #' };
  }

  if (name.includes('@')) {
    return { ok: false, message: 'Name can not contain @' };
  }

  return { ok: true, message: 'Name is valid' };
}

export async function validateValue(value: string, type: AssetType): Promise<ValidationResult> {
  const res = await invoke<boolean>('validate_value', {
    value: value,
    valueType: type,
  });

  if (!res) {
    return { ok: false, message: 'Value is not valid' };
  }

  return { ok: true, message: 'Value is valid' };
}
