
export const environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] || 'http://localhost:8080/api/v1',
  cloudinary: {
    cloudName: import.meta.env['NG_APP_CLOUDINARY_CLOUD_NAME'],
    uploadPreset: import.meta.env['NG_APP_CLOUDINARY_UPLOAD_PRESET']
  }
};
