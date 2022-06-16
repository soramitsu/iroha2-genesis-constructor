import { NButton, useDialog } from 'naive-ui';
import { h } from 'vue';

export function useDialogWrapper() {
  const dialog = useDialog();

  function confirm(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      dialog.warning({
        title: 'Confirm',
        content: text,
        positiveText: 'Ok',

        onClose: () => resolve(false),

        action: () => h(NButton, {
          type: 'primary',
          size: 'small',
          onClick: () => {
            dialog.destroyAll();
            resolve(true);
          },
        }, () => 'Ok'),
      });
    });
  }

  return {
    confirm,
  };
};
