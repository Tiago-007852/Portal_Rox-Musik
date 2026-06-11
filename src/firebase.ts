import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));

  // Extract human-readable message from the raw error
  const rawMessage = error instanceof Error ? error.message : String(error);

  // Common Firestore permission/authentication failures → readable Portuguese messages
  let readableMessage: string;
  if (/Permission Denied/i.test(rawMessage) || /permission_denied/i.test(rawMessage)) {
    readableMessage =
      "Permissão negada pelo Firestore. A sua sessão Firebase não tem credenciais de escrita válidas. " +
      "As alterações foram guardadas apenas no cache local (navegador). " +
      "Para sincronizar na nuvem, inicie sessão com uma Conta Google autorizada.";
  } else if (/Unauthenticated/i.test(rawMessage) || /unauthenticated/i.test(rawMessage)) {
    readableMessage =
      "Utilizador não autenticado no Firebase. " +
      "Não é possível guardar dados no banco online. " +
      "As alterações estão apenas em cache local.";
  } else if (/NOT_FOUND/i.test(rawMessage)) {
    readableMessage =
      "O documento ou coleção do Firestore não foi encontrado. " +
      "Verifique se a base de dados foi criada no console Firebase.";
  } else if (/Deadline exceeded/i.test(rawMessage) || /timeout/i.test(rawMessage) || /unavailable/i.test(rawMessage)) {
    readableMessage =
      "O servidor do Firestore não respondeu a tempo. " +
      "As alterações foram guardadas apenas localmente. " +
      "Verifique a sua conexão com a internet.";
  } else {
    readableMessage = rawMessage;
  }

  // Throw a structured error with both the original error info and the readable message
  const finalError = {
    ...errInfo,
    userMessage: readableMessage
  };
  throw new Error(JSON.stringify(finalError));
}
