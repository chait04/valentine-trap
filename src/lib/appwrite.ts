import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID || '';
export const RESPONSES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_RESPONSES_COLLECTION_ID || '';
