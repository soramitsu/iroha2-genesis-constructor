export function saveFile(data: any, filename: string, type: string) {
  const file = new Blob([data], { type: type });

  const link = document.createElement('a');
  const url = URL.createObjectURL(file);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function readFile(file: File, type: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type !== type) {
      reject(new Error('Wrong file type'));
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Data reading error'));
    };
  });
}
