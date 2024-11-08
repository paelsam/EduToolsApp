

export const getCookie = (name: string): string | null => {
  return document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='))[0]
    ?.split('=')[1] || null;
}
