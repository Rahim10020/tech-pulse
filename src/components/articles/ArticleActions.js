import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';

/**
 * ArticleActions component provides like and comment interaction buttons for articles.
 *
 * @param {Object} props - The component props
 * @param {Object} props.article - The article object with slug, likesCount, isLikedByUser
 * @param {number} [props.commentsCount=[]] - Number of comments on the article
 * @param {Function} [props.onCommentsClick] - Callback when comments button is clicked
 * @returns {JSX.Element} The article actions element
 */
export default function ArticleActions({ article, commentsCount = [], onCommentsClick }) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [likes, setLikes] = useState(article.likesCount || 0);
    const [isLiked, setIsLiked] = useState(article.isLikedByUser || false);
    const [isLiking, setIsLiking] = useState(false);

    // Gérer le like de l'article
    const handleLikeArticle = async () => {
        if (!user) {
            showToast('Vous devez être connecté pour liker', 'error');
            return;
        }

        if (isLiking) return; // Éviter les clics multiples

        setIsLiking(true);
        try {
            const response = await fetch(`/api/articles/${article.slug}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                setLikes(data.likes);
                setIsLiked(data.liked);

                showToast(
                    data.liked ? 'Article ajouté aux favoris' : 'Article retiré des favoris',
                    'success'
                );
            } else {
                const errorData = await response.json();
                showToast(errorData.error || 'Erreur lors du like', 'error');
            }
        } catch (error) {
            console.error('Erreur like article:', error);
            showToast('Erreur lors du like', 'error');
        } finally {
            setIsLiking(false);
        }
    };

    // Scroller vers les commentaires
    const handleCommentsClick = () => {
        if (onCommentsClick) {
            onCommentsClick();
        } else {
            // Scroll automatique vers la section commentaires
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    return (
        <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
            {/* Like de l'article */}
            <button
                onClick={handleLikeArticle}
                disabled={isLiking}
                className={`flex items-center space-x-2 transition-colors font-sans disabled:opacity-50 ${isLiked
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                    }`}
                title={user ? (isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris') : 'Connectez-vous pour liker'}
            >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
                {isLiking && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-1" />
                )}
            </button>

            {/* Lien vers les commentaires */}
            <button
                onClick={handleCommentsClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors font-sans"
                title="Aller aux commentaires"
            >
                <MessageCircle className="w-5 h-5" />
                <span>{commentsCount}</span>
            </button>
        </div>
    );
}