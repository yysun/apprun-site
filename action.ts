type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export default async (name: string, data?: JsonValue) => {
  const response = !data ?
    await fetch(`/_/${name}`) :
    await fetch(`/_/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}