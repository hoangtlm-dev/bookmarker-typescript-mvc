import { TOAST } from '@/constants';

export type ToastMessage = (typeof TOAST.MESSAGE)[keyof typeof TOAST.MESSAGE];

export type ToastDescription = (typeof TOAST.DESCRIPTION)[keyof typeof TOAST.DESCRIPTION];

export type ToastType = (typeof TOAST.TYPE)[keyof typeof TOAST.TYPE];

// export type ToastOptions = {
//   type: ToastType;
//   closeButtonId: string;
// };
