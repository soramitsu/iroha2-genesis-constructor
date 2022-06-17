export type ValidationResult = {
  status: 'success' | 'error' | 'info',
  message: string,
}

export function validateName(name: string, existence: boolean): ValidationResult {
  if (existence) {
    return { status: 'error', message: 'Name already exists' };
  }

  if (!name.length) {
    return { status: 'info', message: 'Name is empty' };
  }

  if (name.includes(' ')) {
    return { status: 'error', message: 'Name can not contain spaces' };
  }

  if (name.includes('#')) {
    return { status: 'error', message: 'Name can not contain #' };
  }

  if (name.includes('@')) {
    return { status: 'error', message: 'Name can not contain @' };
  }

  return { status: 'success', message: 'Name is valid' };
}
