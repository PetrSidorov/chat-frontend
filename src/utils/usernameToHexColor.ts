export default function usernameToHexColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  let color = (hash & 0xffffff).toString(16).toUpperCase();

  return "#" + ("000000" + color).slice(-6);
}
