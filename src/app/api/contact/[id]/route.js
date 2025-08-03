// src/app/api/contact/[id]/route.js - API pour marquer un message comme lu
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';

const prisma = new PrismaClient();

// PATCH - Marquer un message comme lu/non lu
export async function PATCH(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { isRead } = await request.json();
    const contactId = parseInt(params.id);

    // Vérifier que le message existe
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: { isRead: Boolean(isRead) }
    });

    return NextResponse.json({
      success: true,
      contact: updatedContact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un message de contact
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification admin
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const contactId = parseInt(params.id);

    // Vérifier que le message existe
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le message
    await prisma.contact.delete({
      where: { id: contactId }
    });

    return NextResponse.json({
      success: true,
      message: 'Message supprimé avec succès'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
