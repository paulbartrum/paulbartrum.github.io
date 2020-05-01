self.addEventListener('push', function (event) {
    // Payload: { title: "abc", body: "abc", icon: "https://abc.com", url: "https://abc.com" }
    const data = event.data.json();
    event.waitUntil(self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        data: {
            url: data.url
        }
    }));
});

self.addEventListener('notificationclick', function (event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
    event.waitUntil(clients.openWindow(clickedNotification.data.url));
});