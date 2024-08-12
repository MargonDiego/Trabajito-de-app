import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@mui/material/styles';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

interface Intervention {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  dateReported: string;
}

interface InterventionCalendarProps {
  interventions: Intervention[];
}

const getEventColor = (type: string, theme: any): string => {
  switch (type.toLowerCase()) {
    case 'académico': return theme.palette.info.main;
    case 'comportamiento': return theme.palette.warning.main;
    case 'asistencia': return theme.palette.success.main;
    case 'salud': return theme.palette.error.main;
    default: return theme.palette.primary.main;
  }
};

const CustomToolbar = ({ date, onNavigate }: ToolbarProps) => {
  const theme = useTheme();
  const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => onNavigate(action);

  const label = () => moment(date).format('MMMM YYYY');

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1),
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      borderRadius: 4,
      backdropFilter: 'blur(5px)'
    }}>
      <Button onClick={() => navigate('PREV')} sx={{ minWidth: 40, borderRadius: '12px' }}>&lt;</Button>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{label()}</Typography>
      <Button onClick={() => navigate('NEXT')} sx={{ minWidth: 40, borderRadius: '12px' }}>&gt;</Button>
      <Button onClick={() => navigate('TODAY')} sx={{ mx: 1, borderRadius: '12px' }}>Today</Button>
    </Box>
  );
};

const CustomDateHeader = ({ date }: { date: Date }) => {
  const theme = useTheme();
  const isToday = moment(date).isSame(moment(), 'day');
  return (
    <Box sx={{ 
      textAlign: 'center', 
      fontWeight: isToday ? 'bold' : 'normal',
      color: isToday ? theme.palette.primary.main : 'inherit',
      bgcolor: isToday ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
      borderRadius: 2,
      py: 0.5,
    }}>
      {moment(date).format('D')}
    </Box>
  );
};

const CustomEventWrapper = ({ event }: { event: Event }) => {
  const theme = useTheme();
  const backgroundColor = getEventColor(event.title, theme);
  return (
    <Box sx={{
      backgroundColor: alpha(backgroundColor, 0.8),
      color: theme.palette.getContrastText(backgroundColor),
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      boxShadow: `0 4px 12px ${alpha(backgroundColor, 0.4)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: `0 6px 16px ${alpha(backgroundColor, 0.6)}`,
      },
    }}>
      {event.title}
    </Box>
  );
};

const InterventionCalendar: React.FC<InterventionCalendarProps> = ({ interventions }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Intervention | null>(null);

  const calendarStyles = {
    height: 600,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    borderRadius: 20,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.37)}`,
    padding: theme.spacing(2),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  };

  const eventStyleGetter = (event: Event) => {
    const backgroundColor = getEventColor(event.title, theme); // Assuming the event type is stored in the title
    return {
      style: {
        backgroundColor: alpha(backgroundColor, 0.8),
        color: theme.palette.getContrastText(backgroundColor),
        border: 'none',
        borderRadius: '12px',
        padding: '6px 10px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        boxShadow: `0 4px 12px ${alpha(backgroundColor, 0.4)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 6px 16px ${alpha(backgroundColor, 0.6)}`,
        },
      }
    };
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event.resource as Intervention);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleViewDetails = () => {
    if (selectedEvent) {
      navigate(`/interventions/${selectedEvent.id}`);
    }
  };

  const calendarEvents = interventions.map(intervention => ({
    title: intervention.title,
    start: new Date(intervention.dateReported),
    end: new Date(intervention.dateReported),
    allDay: true,
    resource: intervention,
  }));

  return (
    <Box sx={{ position: 'relative' }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventStyleGetter}
        style={calendarStyles}
        components={{
          toolbar: CustomToolbar,
          month: {
            dateHeader: CustomDateHeader,
          },
          event: CustomEventWrapper,
        }}
      />
      <Dialog 
        open={!!selectedEvent} 
        onClose={handleCloseModal}
        PaperProps={{
          style: {
            borderRadius: 20,
            padding: theme.spacing(2),
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.37)}`,
          },
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: getEventColor(selectedEvent?.type || '', theme),
          color: 'white',
          borderRadius: '20px 20px 0 0',
          textAlign: 'center',
          py: 2,
        }}>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip 
              label={selectedEvent?.type} 
              color="primary" 
              size="small" 
              sx={{ borderRadius: '12px' }} 
            />
            <Chip 
              label={selectedEvent?.status} 
              color="secondary" 
              size="small" 
              sx={{ borderRadius: '12px' }} 
            />
          </Box>
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            <strong>Fecha:</strong> {moment(selectedEvent?.dateReported).format('LL')}
          </Typography>
                    <Typography variant="body1" sx={{ mt: 1, textAlign: 'justify' }}>
            <strong>Descripción:</strong> {selectedEvent?.description}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleCloseModal} color="inherit" sx={{ borderRadius: '12px' }}>
            Cerrar
          </Button>
          <Button onClick={handleViewDetails} color="primary" variant="contained" sx={{ borderRadius: '12px' }}>
            Ver Detalles Completos
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterventionCalendar;

