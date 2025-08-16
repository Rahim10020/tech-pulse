"use client";

import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  FileCheck,
  ShieldCheck,
  Gauge
} from 'lucide-react';

export default function SecureUploadStatus({ uploadResult, error }) {
  if (error?.type === 'security') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="h5-title text-red-800 mb-1">
              🚨 Upload bloqué pour sécurité
            </h3>
            <p className="small-text text-red-700 mb-3">
              {error.error}
            </p>
            <div className="text-xs text-red-600">
              Code: <span className="font-mono">{error.code}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uploadResult?.success && uploadResult?.security) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="h5-title text-green-800 mb-2">
              ✅ Upload sécurisé réussi
            </h3>
            
            <div className="grid grid-cols-2 gap-3 small-text">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Type validé</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Scanné anti-malware</span>
              </div>
              
              {uploadResult.optimized && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Image optimisée</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-green-600" />
                <span className="text-green-700">{uploadResult.fileSizeMB}MB</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-green-600">
              Fichier: <span className="font-mono">{uploadResult.fileName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}