import { AlertTriangle, X } from 'lucide-react';

/**
 * A modal dialog component for confirming user actions with customizable styling and messages.
 *
 * @param {Object} props - The component props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {string} [props.title='Confirmer l\'action'] - The dialog title
 * @param {string} [props.message='Êtes-vous sûr de vouloir continuer ?'] - The dialog message
 * @param {string} [props.confirmText='Confirmer'] - Text for the confirm button
 * @param {string} [props.cancelText='Annuler'] - Text for the cancel button
 * @param {Function} props.onConfirm - Callback when confirm button is clicked
 * @param {Function} props.onCancel - Callback when cancel button is clicked or dialog is closed
 * @param {'warning'|'danger'|'info'} [props.type='warning'] - The dialog type affecting styling
 * @returns {JSX.Element|null} The dialog element or null if not open
 */
export default function ConfirmDialog({
    isOpen,
    title = "Confirmer l'action",
    message = "Êtes-vous sûr de vouloir continuer ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    onCancel,
    type = "warning" // warning, danger, info
}) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                };
            case "info":
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-blue-500" />,
                    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                };
            default: // warning
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
                    button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        {styles.icon}
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}