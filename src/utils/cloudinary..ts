const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "task-manager");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();

  return data.secure_url;
};
