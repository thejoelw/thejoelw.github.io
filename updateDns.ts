export const updateDns = (
  { username, password }: { username: string; password: string },
) =>
  fetch(`https://domains.google.com/nic/update?hostname=joelw.xyz`, {
    headers: {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'User-Agent': 'curl',
    },
  });
