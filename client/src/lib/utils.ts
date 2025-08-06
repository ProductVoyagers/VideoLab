import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateSubmissionId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `VP-${year}-${randomNum}`;
}

export function getEstimatedDeliveryDate(packageType: string): Date {
  const deliveryDate = new Date();
  switch (packageType) {
    case 'lite':
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      break;
    case 'signature':
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      break;
    case 'immersive':
      deliveryDate.setDate(deliveryDate.getDate() + 10);
      break;
    default:
      deliveryDate.setDate(deliveryDate.getDate() + 7);
  }
  return deliveryDate;
}
