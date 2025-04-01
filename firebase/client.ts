import {initializeApp, getApps, getApp} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Configurações de Firebase para conectar ao projeto
const firebaseConfig = {
    apiKey: "AIzaSyAl-AtD_SiFNDQriilEvLzUBP234cec3j4", // Chave de API para autenticação
    authDomain: "prepwise-cier.firebaseapp.com", // Domínio de autenticação
    projectId: "prepwise-cier", // ID do projeto Firebase
    storageBucket: "prepwise-cier.firebasestorage.app", // URL do Storage Bucket
    messagingSenderId: "766786085759", // ID para serviço de mensagens
    appId: "1:766786085759:web:6c9a721909e0cf19c3f04a", // ID do aplicativo
    measurementId: "G-S535SN4P9F" // ID para o serviço de mensuração
};

// Inicializa o Firebase apenas uma vez, usando o app existente ou cria um novo
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Autenticação do Firebase
export const auth = getAuth(app);

// Instância do Firestore para manipulação de banco de dados
export const db = getFirestore(app);