// src/app/firebase/config.js

// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Funções de autenticação serão importadas nos componentes
import { getFirestore } from "firebase/firestore"; // Funções do Firestore serão importadas nos componentes

// Variáveis globais fornecidas pelo ambiente Canvas (MANDATÓRIO USAR)
const __app_id = typeof window !== "undefined" ? window.__app_id : undefined;
const __firebase_config =
  typeof window !== "undefined" ? window.__firebase_config : undefined;
const __initial_auth_token =
  typeof window !== "undefined" ? window.__initial_auth_token : undefined;

// Configuração do Firebase.
// IMPORTANTE: SUBSTITUA ESTES VALORES COM AS CREDENCIAIS REAIS DO SEU PRÓPRIO PROJETO FIREBASE!
// Você pode encontrar estas credenciais no Console do Firebase > Configurações do Projeto > Seus apps > Adicionar app > Web (</>)
const firebaseConfig = __firebase_config
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "AIzaSyAyonWZ1kE5IDX6QesmlK89hP9QwOlfYRE",
      authDomain: "projeto-iphones.firebaseapp.com",
      projectId: "projeto-iphones",
      storageBucket: "projeto-iphones.firebasestorage.app",
      messagingSenderId: "944544108742",
      appId: "1:944544108742:web:c73da3e536fc42315207c7",
    };

// Define o appId que será usado para o caminho do Firestore (se necessário para outras funcionalidades).
// Forçamos o uso do projectId do firebaseConfig para garantir consistência.
const appId = firebaseConfig.projectId;

// Inicializa o aplicativo Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Obtém as instâncias dos serviços Firebase (Firestore e Authentication)
const db = getFirestore(app);
const auth = getAuth(app);

// Exporta as instâncias do banco de dados (db), autenticação (auth) e o appId.
// O gerenciamento do estado de autenticação (onAuthStateChanged) e login/logout
// será feito diretamente nos componentes que precisam dessas funcionalidades.
export { db, auth, appId, __initial_auth_token }; // Exporta __initial_auth_token para uso em componentes específicos
