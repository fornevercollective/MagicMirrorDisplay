import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock } from 'lucide-react';

interface CalendarWidgetProps {
  displayType: string;
  size: 'small' | 'medium' | 'large';
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ displayType, size }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(2025, 5, 14, 10, 0),
      end: new Date(2025, 5, 14, 11, 0),
      allDay: false,
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Review',
      start: new Date(2025, 5, 14, 14, 30),
      end: new Date(2025, 5, 14, 15, 30),
      allDay: false
    },
    {
      id: '3',
      title: 'Lunch with Client',
      start: new Date(2025, 5, 15, 12, 0),
      end: new Date(2025, 5, 15, 13, 30),
      allDay: false,
      location: 'Downtown Restaurant'
    }
  ]);

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.start.toDateString() === today.toDateString()
  );
  const upcomingEvents = events.filter(event => 
    event.start > today
  ).slice(0, size === 'large' ? 5 : 3);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short',
      day: 'numeric'
    });
  };

  const content = (
    <div className="space-y-4">
      {todayEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm opacity-80">Today</span>
          </div>
          <div className="space-y-2">
            {todayEvents.slice(0, size === 'small' ? 1 : 3).map(event => (
              <div key={event.id} className="border-l-2 border-blue-500 pl-3">
                <div className="text-sm">{event.title}</div>
                <div className="text-xs opacity-70 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {event.allDay ? 'All day' : `${formatTime(event.start)} - ${formatTime(event.end)}`}
                </div>
                {event.location && size !== 'small' && (
                  <div className="text-xs opacity-60">{event.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {size !== 'small' && upcomingEvents.length > 0 && (
        <div>
          <div className="text-sm opacity-80 mb-2">Upcoming</div>
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex justify-between items-start text-xs">
                <div className="flex-1 min-w-0">
                  <div className="truncate">{event.title}</div>
                  <div className="opacity-70">{formatDate(event.start)} at {formatTime(event.start)}</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1 ml-2 flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="text-center text-sm opacity-60">
          No upcoming events
        </div>
      )}
    </div>
  );

  if (displayType === 'mirror') {
    return <div className="text-white">{content}</div>;
  }

  return (
    <Card className="w-full h-full bg-transparent border-0">
      <CardContent className="p-4">
        {content}
      </CardContent>
    </Card>
  );
};