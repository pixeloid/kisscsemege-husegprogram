
/// <reference types="vite/client" />



interface ImportMetaEnv {

  readonly VITE_API_URL: string;

}



interface ImportMeta {

  readonly env: ImportMetaEnv;

}

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5100/api';

export async function signUp(name: string, phoneNumber: string, pinCode: string) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phoneNumber, pinCode })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function signIn(phoneNumber: string, pinCode: string) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, pinCode })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}/profile`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getUserLevel(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}/level`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getUserPurchases(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}/purchases`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function addPurchase(userId: string, totalAmount: number, items: Array<{ name: string, quantity: number, price: number }>, receiptNumber: string) {
  const response = await fetch(`${API_URL}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, totalAmount, items, receiptNumber })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function getUserDataByBarcode(barcode: string) {
  const response = await fetch(`${API_URL}/barcode/${barcode}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}