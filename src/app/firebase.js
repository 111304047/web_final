// 初始化 Firebase 並匯出 Realtime Database 實例
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';


// 將下方 config 替換為你的 Firebase 專案設定
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 避免重複初始化
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// 取得 Realtime Database 實例
const db = getDatabase(app);


export { db }; 