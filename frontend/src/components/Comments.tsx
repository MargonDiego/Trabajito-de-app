import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Box,
  Avatar,
  ListItemAvatar,
  Divider,
  IconButton,
  useTheme,
  Fade,
  Grow,
  Tooltip,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';

interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface CommentsProps {
  interventionId: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  transition: 'background-color 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Comments: React.FC<CommentsProps> = ({ interventionId }) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  const fetchComments = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await api.get(`/interventions/${interventionId}/comments`, {
        params: { page, pageSize: 10 },
      });
      const newComments = response.data.comments;
      if (page === 1) {
        setComments(newComments);
      } else {
        setComments((prevComments) => [...prevComments, ...newComments]);
      }
      setHasMore(newComments.length === 10);
      setPage((prevPage) => prevPage + 1);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Error al cargar los comentarios. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [interventionId, page, hasMore]);

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [interventionId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, interventionId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/interventions/${interventionId}/comments`, {
        userId: user.id,
        content: newComment.trim(),
      });
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error al añadir el comentario. Por favor, intente de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleSaveEditComment = async (commentId: number) => {
    if (!editingContent.trim()) return;

    try {
      await api.put(`/interventions/${interventionId}/comments/${commentId}`, {
        content: editingContent.trim(),
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editingContent } : comment
        )
      );
      setEditingCommentId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
      setError('Error al editar el comentario. Por favor, intente de nuevo.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/interventions/${interventionId}/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Error al eliminar el comentario. Por favor, intente de nuevo.');
    }
  };

  return (
    <StyledPaper elevation={3}>
      {error && (
        <Fade in={true}>
          <Chip
            label={error}
            color="error"
            onDelete={() => setError(null)}
            sx={{ mb: 2 }}
          />
        </Fade>
      )}
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Añadir un comentario"
          variant="outlined"
          multiline
          rows={2}
          InputProps={{
            sx: {
              borderRadius: theme.shape.borderRadius * 2,
            },
          }}
        />
        <Tooltip title="Enviar comentario">
          <IconButton
            onClick={handleAddComment}
            disabled={submitting}
            color="primary"
            sx={{
              ml: 1,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List sx={{ maxHeight: 400, overflow: 'auto', mt: 2 }}>
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={`${comment.id}-${comment.createdAt}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StyledListItem alignItems="flex-start">
                <ListItemAvatar>
                  <StyledAvatar>
                    {comment.user.firstName.charAt(0)}
                    {comment.user.lastName.charAt(0)}
                  </StyledAvatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    editingCommentId === comment.id ? (
                      <TextField
                        fullWidth
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        InputProps={{
                          sx: {
                            borderRadius: theme.shape.borderRadius,
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body1">{comment.content}</Typography>
                    )
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {comment.user.firstName} {comment.user.lastName}
                      </Typography>
                      {' — '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
                {editingCommentId === comment.id ? (
                  <Box>
                    <Tooltip title="Guardar cambios">
                      <IconButton
                        onClick={() => handleSaveEditComment(comment.id)}
                        color="primary"
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar edición">
                      <IconButton
                        onClick={() => setEditingCommentId(null)}
                        color="secondary"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box>
                    <Tooltip title="Editar comentario">
                      <IconButton
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar comentario">
                      <IconButton
                        onClick={() => handleDeleteComment(comment.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </StyledListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {!loading && hasMore && (
        <Grow in={true}>
          <Button
            onClick={fetchComments}
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<MoreHorizIcon />}
            sx={{ mt: 2 }}
          >
            Cargar más comentarios
          </Button>
        </Grow>
      )}
      {!loading && !hasMore && comments.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
          No hay comentarios disponibles.
        </Typography>
      )}
    </StyledPaper>
  );
};

export default Comments;