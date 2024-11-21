export const unReadNotificaionFunc = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
