import xss from 'xss';

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return xss(input.trim());
};

export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const generateProjectId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `proj_${timestamp}_${randomStr}`.toUpperCase();
};

export const validatePDFFile = (filename: string, mimetype: string): boolean => {
  const validExtensions = ['.pdf'];
  const validMimeTypes = ['application/pdf'];
  
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  
  return (
    validExtensions.includes(extension) &&
    validMimeTypes.includes(mimetype)
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};
