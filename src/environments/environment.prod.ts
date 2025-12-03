
export const environment = {
  production: true,
  apiUrl: import.meta.env['NG_APP_API_URL'] || 'https://therma-trace-backend.onrender.com/api/v1',
  cloudinary: {
    cloudName: import.meta.env['NG_APP_CLOUDINARY_CLOUD_NAME'],
    uploadPreset: import.meta.env['NG_APP_CLOUDINARY_UPLOAD_PRESET']
  }
};
