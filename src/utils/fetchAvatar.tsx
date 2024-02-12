export function generateFetchAvatar() {
  const fetchSignedUrl = async (avatarUrl: string) => {
    if (avatarUrl) {
      try {
        const response = await fetch(
          `http://localhost:3007/api/signed-url?fileName=${encodeURIComponent(
            avatarUrl
          )}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        return data.signedUrl;
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    }
  };

  return fetchSignedUrl;
}
