'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { isAdmin } from '@/lib/auth-roles';
import { 
  Calendar, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Globe,
  MessageSquare,
  Users,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Badge
} from 'lucide-react';

export default function UserProfile({ user, articles }) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("articles");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Vérifier si l'utilisateur connecté est admin et consulte son propre profil
  const isOwnProfile = currentUser && currentUser.id === user.id;
  const showAdminTabs = isOwnProfile && isAdmin(currentUser);

  // Charger les messages de contact pour l'admin
  const loadMessages = async () => {
    if (!showAdminTabs) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUnreadCount(data.messages?.filter(m => !m.isRead).length || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger la liste des utilisateurs pour l'admin
  const loadUsers = async () => {
    if (!showAdminTabs) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : ''
      });
      
      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marquer un message comme lu/non lu
  const toggleMessageRead = async (messageId, isRead) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isRead: !isRead })
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: !isRead } : msg
        ));
        setUnreadCount(prev => isRead ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const deletedMessage = messages.find(m => m.id === messageId);
        setMessages(messages.filter(msg => msg.id !== messageId));
        if (deletedMessage && !deletedMessage.isRead) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
    }
  };

  // Changer le rôle d'un utilisateur
  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du changement de rôle');
      }
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    }
  };

  // Charger les données selon l'onglet actif
  useEffect(() => {
    if (activeTab === 'messages') {
      loadMessages();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab, searchTerm, roleFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Profil utilisateur */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            {/* Avatar et nom */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-600">@{user.username}</p>
              {isAdmin(user) && (
                <div className="flex items-center justify-center mt-2">
                  <Shield className="w-4 h-4 text-teal-600 mr-1" />
                  <span className="text-sm text-teal-600 font-medium">Administrateur</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{user.stats?.articles || 0}</div>
                <div className="text-xs text-gray-500">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Abonnés</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Abonnements</div>
              </div>
            </div>

            {/* Stats admin */}
            {showAdminTabs && (
              <div className="border-t pt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Administration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Messages non lus</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total utilisateurs</span>
                    <span className="text-sm font-medium text-gray-900">{totalUsers}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Date d'inscription */}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Rejoint en {new Date(user.createdAt).getFullYear()}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("articles")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "articles"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Articles ({articles.length})
              </button>
              
              {showAdminTabs && (
                <>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                      activeTab === "messages"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "users"
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Utilisateurs
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {/* Onglet Articles */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span>{article.readTime} de lecture</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                            <a href={`/articles/${article.slug}`}>
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{article.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun article publié pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Messages (Admin seulement) */}
            {activeTab === "messages" && showAdminTabs && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Messages de contact</h2>
                  <span className="text-sm text-gray-500">{messages.length} message(s)</span>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`bg-white rounded-lg border p-4 ${!message.isRead ? 'border-l-4 border-l-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">{message.subject}</h3>
                            <p className="text-sm text-gray-600">
                              De: {message.name} ({message.email})
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleMessageRead(message.id, message.isRead)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title={message.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                            >
                              {message.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{message.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun message de contact.</p>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Utilisateurs (Admin seulement) */}
            {activeTab === "users" && showAdminTabs && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h2>
                </div>

                {/* Filtres */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email ou username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="admin">Administrateurs</option>
                    <option value="reader">Lecteurs</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <div key={user.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">@{user.username} • {user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-teal-100 text-teal-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Lecteur'}
                            </span>
                            {user.id !== currentUser.id && (
                              <div className="flex space-x-1">
                                {user.role === 'reader' ? (
                                  <button
                                    onClick={() => changeUserRole(user.id, 'admin')}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Promouvoir en admin"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => changeUserRole(user.id, 'reader')}
                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                    title="Rétrograder en lecteur"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
