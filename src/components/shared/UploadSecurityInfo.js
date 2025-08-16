"use client";

import { Shield, FileCheck, Zap, Users, Clock } from 'lucide-react';

export default function UploadSecurityInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="h5-title text-blue-800 mb-2">
            🛡️ Upload sécurisé activé
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 small-text text-blue-700">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4" />
              <span>Validation stricte des types</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Scan anti-malware automatique</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Optimisation des images</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Quota 100MB par utilisateur</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>10 uploads max/minute</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-blue-600">
            <strong>Types autorisés:</strong> JPG, PNG, WebP, GIF, MP4, WebM
          </div>
        </div>
      </div>
    </div>
  );
}