import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';

export async function choiseDir(): Promise<string | null> {
  const selected = await open({
    directory: true,
    defaultPath: await appDir(),
  });

  return selected as string | null;
}

export async function choiseFile(): Promise<string | null> {
  const selected = await open({
    filters: [{
      name: 'Genesis',
      extensions: ['json'],
    }],
    defaultPath: await appDir(),
  });

  return selected as string | null;
}
