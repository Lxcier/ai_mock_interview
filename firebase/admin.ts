import {initializeApp, cert, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

// Função para inicializar o Firebase Admin SDK
const initFirebaseAdmin = () => {
    const apps = getApps(); // Obtém as instâncias existentes do Firebase App

    // Se não houver instâncias, inicializa uma nova
    if (!apps.length) {
        initializeApp({
            credential: cert({ // Configura as credenciais usando variáveis de ambiente
                projectId: process.env.FIREBASE_PROJECT_ID, // ID do projeto Firebase
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Chave privada Firebase (formatada)
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL // Email do cliente Firebase
            })
        })
    }

    // Retorna as instâncias de autenticação e firestore
    return {
        auth: getAuth(), // Instância do serviço de autenticação do Firebase
        db: getFirestore(), // Instância do Firestore do Firebase
    }
}

// Inicializa e exporta as instâncias de autenticação e banco de dados
export const {auth, db} = initFirebaseAdmin();
