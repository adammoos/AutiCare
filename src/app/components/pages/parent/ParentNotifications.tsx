import { Link } from "react-router";
import { Bell, CheckCircle2 } from "lucide-react";
import { useNotifications } from "../../../contexts/NotificationContext";
import { Button } from "../../ui/button";

export function ParentNotifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* En-tête */}
      <div className="bg-white border-b mb-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Gérez vos notifications</p>
              </div>
            </div>
            {notifications.some(n => !n.read) && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="text-sm"
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">Vous êtes à jour ! Aucune nouvelle notification.</p>
          </div>
        ) : (
            notifications.map((notification) => (
            <div
              key={notification.id}
                onClick={() => markAsRead(notification.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    markAsRead(notification.id);
                  }
                }}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 transition-all cursor-pointer ${
                notification.read
                  ? 'border-gray-300'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  {'contactInfo' in notification && notification.contactInfo && (
                    <p className="text-sm text-gray-500 mb-3">
                      {notification.contactInfo}
                    </p>
                  )}
                  {notification.actionHref && (
                    notification.actionHref.startsWith('/') ? (
                      <Link
                        to={notification.actionHref}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
                      >
                        {notification.actionLabel ?? 'Ouvrir'}
                      </Link>
                    ) : (
                      <a
                        href={notification.actionHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
                      >
                        {notification.actionLabel ?? 'Ouvrir'}
                      </a>
                    )
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notification.read && (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
