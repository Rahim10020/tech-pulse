// ===============================================
// 1. src/components/comments/InteractiveComments.js
// ===============================================

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import {
    MessageCircle,
    Heart,
    Reply,
    MoreVertical,
    Flag,
    Edit2,
    Trash2,
    Send,
    ChevronDown,
    ChevronUp,
    Award,
    X,
    Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function InteractiveComments({ articleSlug, initialComments = [], onCommentsCountChange, totalCount }) {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular
    const [showReplies, setShowReplies] = useState({});


    // Charger les commentaires
    useEffect(() => {
        loadComments();
    }, [articleSlug, sortBy]);

    // Mettre à jour le compteur de commentaires quand les commentaires changent
    useEffect(() => {
        const totalCount = calculateTotalComments(comments);
        onCommentsCountChange && onCommentsCountChange(totalCount);
    }, [comments, onCommentsCountChange]);

    const loadComments = async () => {
        try {
            const response = await fetch(`/api/articles/${articleSlug}/comments?sort=${sortBy}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error('Erreur chargement commentaires:', error);
        }
    };

    // Fonction pour calculer le nombre total de commentaires
    const calculateTotalComments = (commentsArray) => {
        return commentsArray.reduce((total, comment) =>
            total + 1 + (comment.replies ? comment.replies.length : 0), 0
        );
    };

    // Ajouter un commentaire
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast('Vous devez être connecté pour commenter', 'error');
            return;
        }

        if (!newComment.trim()) {
            showToast('Veuillez écrire un commentaire', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/articles/${articleSlug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    content: newComment.trim(),
                    parentId: replyingTo
                })
            });

            if (response.ok) {
                const data = await response.json();

                setComments(prev => {
                    let newComments;

                    if (replyingTo) {
                        // Ajouter la réponse au commentaire parent
                        newComments = prev.map(comment =>
                            comment.id === replyingTo
                                ? { ...comment, replies: [...(comment.replies || []), data.comment] }
                                : comment
                        );
                        setShowReplies(prevReplies => ({ ...prevReplies, [replyingTo]: true }));
                    } else {
                        // Ajouter le nouveau commentaire en haut
                        newComments = [data.comment, ...prev];
                    }

                    return newComments;
                });

                setNewComment('');
                setReplyingTo(null);
                showToast('Commentaire ajouté avec succès', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Erreur lors de l\'ajout du commentaire', 'error');
            }
        } catch (error) {
            console.error('Erreur ajout commentaire:', error);
            showToast('Erreur lors de l\'ajout du commentaire', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!user) {
            showToast('Vous devez être connecté pour liker', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/comments/${commentId}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                setComments(prev => prev.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: data.liked ? comment.likes + 1 : comment.likes - 1,
                            isLiked: data.liked
                        };
                    }

                    // Vérifier dans les réponses aussi
                    if (comment.replies) {
                        const updatedReplies = comment.replies.map(reply =>
                            reply.id === commentId
                                ? {
                                    ...reply,
                                    likes: data.liked ? reply.likes + 1 : reply.likes - 1,
                                    isLiked: data.liked
                                }
                                : reply
                        );
                        return { ...comment, replies: updatedReplies };
                    }

                    return comment;
                }));
            }
        } catch (error) {
            console.error('Erreur like commentaire:', error);
        }
    };

    const handleReportComment = async (commentId) => {
        // Logique de signalement à implémenter
        console.log('Signaler commentaire:', commentId);
        showToast('Commentaire signalé', 'info');
    };

    // Éditer un commentaire
    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) {
            showToast('Le commentaire ne peut pas être vide', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ content: editContent.trim() })
            });

            if (response.ok) {
                const data = await response.json();

                setComments(prev => prev.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, content: data.comment.content, edited: true };
                    }

                    // Vérifier dans les réponses aussi
                    if (comment.replies) {
                        const updatedReplies = comment.replies.map(reply =>
                            reply.id === commentId
                                ? { ...reply, content: data.comment.content, edited: true }
                                : reply
                        );
                        return { ...comment, replies: updatedReplies };
                    }

                    return comment;
                }));

                setEditingComment(null);
                setEditContent('');
                showToast('Commentaire modifié avec succès', 'success');
            }
        } catch (error) {
            console.error('Erreur édition commentaire:', error);
            showToast('Erreur lors de la modification', 'error');
        }
    };

    // Supprimer un commentaire
    const handleDeleteComment = async (commentId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setComments(prev => {
                    const newComments = prev.filter(comment => {
                        if (comment.id === commentId) {
                            // Supprimer le commentaire principal (avec ses réponses)
                            return false;
                        }

                        // Vérifier dans les réponses
                        if (comment.replies) {
                            comment.replies = comment.replies.filter(reply => reply.id !== commentId);
                        }

                        return true;
                    });

                    return newComments;
                });

                showToast('Commentaire supprimé', 'success');
            }
        } catch (error) {
            console.error('Erreur suppression commentaire:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    // Toggle affichage des réponses
    const toggleReplies = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Annuler l'édition
    const cancelEdit = () => {
        setEditingComment(null);
        setEditContent('');
    };

    return (
        <div className="space-y-6">
            {/* Header avec stats et tri */}
            <div className="flex items-center justify-between">
                <h3 className="h3-title text-gray-900 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Commentaires ({totalCount || 0})
                </h3>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-34 cursor-pointer pt-3 pb-3 pl-3 text-sm border-gray-300"
                >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                    <option value="popular">Plus populaires</option>
                </select>
            </div>

            {/* Formulaire de nouveau commentaire */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <form onSubmit={handleSubmitComment}>
                    <div className="flex space-x-4">
                        {user ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-5 h-5 text-gray-400" />
                            </div>
                        )}

                        <div className="flex-1">
                            {replyingTo && (
                                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="small-text text-blue-700 flex items-center">
                                            <Reply className="w-4 h-4 mr-1" />
                                            En réponse à <strong className="ml-1">
                                                {comments.find(c => c.id === replyingTo)?.author?.name}
                                            </strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setReplyingTo(null)}
                                            className="text-blue-600 hover:text-blue-800 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={user ? "Partagez votre opinion..." : "Connectez-vous pour commenter"}
                                disabled={!user}
                                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                                rows="3"
                                maxLength="500"
                            />

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-4">
                                    <span className={`small-text ${newComment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {newComment.length}/500
                                    </span>

                                    {!user && (
                                        <span className="small-text text-blue-600">
                                            <a href="/login" className="hover:underline">Connectez-vous</a> pour participer à la discussion
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    {replyingTo && (
                                        <button
                                            type="button"
                                            onClick={() => setReplyingTo(null)}
                                            className="btn-secondary text-sm"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!user || !newComment.trim() || loading || newComment.length > 500}
                                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 text-sm"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        <span>{replyingTo ? 'Répondre' : 'Publier'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h4 className="h4-title text-gray-900 mb-2">
                            Aucun commentaire pour le moment
                        </h4>
                        <p className="body-text text-gray-600 mb-4">
                            Soyez le premier à partager votre opinion !
                        </p>
                        {!user && (
                            <a href="/login" className="btn-primary inline-flex items-center space-x-2">
                                <MessageCircle className="w-4 h-4" />
                                <span>Se connecter pour commenter</span>
                            </a>
                        )}
                    </div>
                ) : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={user}
                            onLike={() => handleLikeComment(comment.id)}
                            onReply={() => setReplyingTo(comment.id)}
                            onEdit={(content) => {
                                setEditingComment(comment.id);
                                setEditContent(content);
                            }}
                            onSaveEdit={() => handleEditComment(comment.id)}
                            onCancelEdit={cancelEdit}
                            onDelete={() => handleDeleteComment(comment.id)}
                            onReport={() => handleReportComment(comment.id)}
                            onToggleReplies={() => toggleReplies(comment.id)}
                            showReplies={showReplies[comment.id]}
                            isEditing={editingComment === comment.id}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            onLikeReply={handleLikeComment}
                            onDeleteReply={handleDeleteComment}
                            onEditReply={(replyId, content) => {
                                setEditingComment(replyId);
                                setEditContent(content);
                            }}
                            onSaveEditReply={handleEditComment}
                            editingCommentId={editingComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Composant pour un commentaire individuel
function CommentItem({
    comment,
    currentUser,
    onLike,
    onReply,
    onEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onReport,
    onToggleReplies,
    showReplies,
    isEditing,
    editContent,
    setEditContent,
    onLikeReply,
    onDeleteReply,
    onEditReply,
    onSaveEditReply,
    editingCommentId,
    isReply = false
}) {
    const [showMenu, setShowMenu] = useState(false);
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr });

    const isOwner = currentUser?.id === comment.author.id;
    const canModerate = currentUser?.role === 'admin';
    const hasReplies = comment.replies && comment.replies.length > 0;

    // Fermer le menu quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = () => setShowMenu(false);
        if (showMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showMenu]);

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md ${isReply ? 'ml-12 mt-3 border-l-4 border-l-teal-500' : ''}`}>
            <div className="flex space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                        {comment.author.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div className="flex-1">
                    {/* Header du commentaire */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="h5-title text-gray-900">
                                {comment.author.name}
                            </span>
                            {comment.author.role === 'admin' && (
                                <Award className="w-4 h-4 text-yellow-500" title="Administrateur" />
                            )}
                            <span className="small-text text-gray-500">
                                {timeAgo}
                            </span>
                            {comment.edited && (
                                <span className="small-text text-gray-400">(modifié)</span>
                            )}
                        </div>

                        {/* Menu actions */}
                        {currentUser && (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(!showMenu);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        {isOwner && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        onEdit(comment.content);
                                                        setShowMenu(false);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onDelete();
                                                        setShowMenu(false);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Supprimer
                                                </button>
                                            </>
                                        )}
                                        {!isOwner && (
                                            <button
                                                onClick={() => {
                                                    onReport();
                                                    setShowMenu(false);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Flag className="w-4 h-4 mr-2" />
                                                Signaler
                                            </button>
                                        )}
                                        {canModerate && !isOwner && (
                                            <button
                                                onClick={() => {
                                                    onDelete();
                                                    setShowMenu(false);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Supprimer (Modération)
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contenu du commentaire */}
                    <div className="mb-4">
                        {isEditing ? (
                            <div className="space-y-3">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    rows="3"
                                    maxLength="500"
                                />
                                <div className="flex items-center justify-between">
                                    <span className={`small-text ${editContent.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {editContent.length}/500
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={onCancelEdit}
                                            className="btn-secondary text-sm flex items-center space-x-1"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Annuler</span>
                                        </button>
                                        <button
                                            onClick={onSaveEdit}
                                            disabled={!editContent.trim() || editContent.length > 500}
                                            className="btn-primary text-sm flex items-center space-x-1 disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Sauvegarder</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="body-text text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        )}
                    </div>

                    {/* Actions du commentaire */}
                    {!isEditing && (
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={onLike}
                                disabled={!currentUser}
                                className={`flex items-center space-x-1 text-sm transition-colors ${comment.isLiked
                                    ? 'text-red-500'
                                    : 'text-gray-500 hover:text-red-500'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                                <span>{comment.likes || 0}</span>
                            </button>

                            {!isReply && currentUser && (
                                <button
                                    onClick={onReply}
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-teal-600 transition-colors"
                                >
                                    <Reply className="w-4 h-4" />
                                    <span>Répondre</span>
                                </button>
                            )}

                            {hasReplies && (
                                <button
                                    onClick={onToggleReplies}
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showReplies ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                    <span>
                                        {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Réponses */}
            {hasReplies && showReplies && (
                <div className="mt-4 space-y-3">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUser={currentUser}
                            onLike={() => onLikeReply(reply.id)}
                            onEdit={(content) => onEditReply(reply.id, content)}
                            onSaveEdit={onSaveEditReply}
                            onCancelEdit={onCancelEdit}
                            onDelete={() => onDeleteReply(reply.id)}
                            onReport={() => onReport(reply.id)}
                            isEditing={editingCommentId === reply.id}
                            editContent={editingCommentId === reply.id ? editContent : ""}
                            setEditContent={setEditContent}
                            editingCommentId={editingCommentId}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}