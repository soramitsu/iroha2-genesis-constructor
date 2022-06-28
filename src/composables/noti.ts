import { useNotifications, Status } from '@soramitsu-ui/ui';

export function useNoti() {
  const noti = useNotifications();

  function success(text: string) {
    noti.show({
      title: text,
      status: Status.Success,
    });
  }

  function error(text: string) {
    noti.show({
      title: text,
      status: Status.Error,
    });
  }

  function warning(text: string) {
    noti.show({
      title: text,
      status: Status.Warning,
      showCloseBtn: true,
      timeout: 40000,
    });
  }

  return {
    success,
    error,
    warning,
  };
}
