import { Link } from "react-router";
import { Bell, CheckCircle2, Briefcase, CalendarDays, Megaphone, FileText } from "lucide-react";
import { useNotifications } from "../../../contexts/NotificationContext";
import { Button } from "../../ui/button";

export function ProfessionalNotifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const typeMeta = {
    request: { label: 'Demande', icon: FileText, className: 'bg-orange-100 text-orange-700 border-orange-200' },
    response: { label: 'Réponse', icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    session: { label: 'Conférence', icon: CalendarDays, className: 'bg-blue-100 text-blue-700 border-blue-200' },
    message: { label: 'Offre', icon: Briefcase, className: 'bg-green-100 text-green-700 border-green-200' },
  } as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white border-b mb-8 rounded-2xl shadow-sm">
        <div className="py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 truncate">Notifications</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">Demandes, conférences et offres liées à votre activité</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
              <div className="text-right sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">Non lues</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              {notifications.some(n => !n.read) && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg"
                >
                  <span className="hidden sm:inline">Tout marquer comme lu</span>
                  <span className="sm:hidden">Tout lire</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">Aucune alerte pour le moment.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            notification.type === 'request' ? (
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
                className={`rounded-2xl border transition-all cursor-pointer p-3 sm:p-4 md:p-5 shadow-sm ${
                  notification.read ? 'bg-white border-blue-100' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const TypeIcon = typeMeta[notification.type].icon;
                      return <TypeIcon className="w-6 h-6 text-blue-600" />;
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                    {notification.contactInfo && (
                      <p className="text-xs md:text-sm text-gray-500 mt-1">{notification.contactInfo}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
                    {notification.actionHref && (
                      notification.actionHref.startsWith('/') ? (
                        <Link
                          to={notification.actionHref}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          {notification.actionLabel ?? 'Voir'}
                        </Link>
                      ) : (
                        <a
                          href={notification.actionHref}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          {notification.actionLabel ?? 'Voir'}
                        </a>
                      )
                    )}

                    {!notification.read && (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:bg-blue-50 p-1"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
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
                className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-4 transition-all cursor-pointer ${
                  notification.read ? 'border-gray-300' : 'border-green-500'
                }`}
              >
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold border ${typeMeta[notification.type].className}`}>
                      {(() => {
                        const TypeIcon = typeMeta[notification.type].icon;
                        return <TypeIcon className="w-3.5 h-3.5" />;
                      })()}
                      {typeMeta[notification.type].label}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 flex-1">{notification.title}</h3>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm md:text-base">{notification.message}</p>
                  {notification.contactInfo && (
                    <p className="text-xs md:text-sm text-gray-500">{notification.contactInfo}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {notification.actionHref && (
                      notification.actionHref.startsWith('/') ? (
                        <Link
                          to={notification.actionHref}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center text-xs md:text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          {notification.actionLabel ?? 'Ouvrir'}
                        </Link>
                      ) : (
                        <a
                          href={notification.actionHref}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center text-xs md:text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          {notification.actionLabel ?? 'Ouvrir'}
                        </a>
                      )
                    )}
                    <p className="text-xs text-gray-500 ml-auto">{new Date(notification.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-green-500 hover:bg-green-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
}
