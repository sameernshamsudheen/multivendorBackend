function getPublicIdFromUrl(url) {
  // Remove everything before and including /upload/
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  // Get the part after /upload/, remove version and extension
  const resourcePart = parts[1].split("/")[1]; // In case the version is there, get after the version
  const publicId = resourcePart.replace(/\.[^/.]+$/, ""); // Remove file extension

  return publicId;
}

export default getPublicIdFromUrl;
