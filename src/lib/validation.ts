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
