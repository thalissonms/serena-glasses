/** Valida CPF pelo algoritmo de dígitos verificadores */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos iguais

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (check !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(digits[10]);
}

/** Valida telefone BR — aceita (##) ####-#### ou (##) #####-#### */
export function isValidBRPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

/** Valida data ISO YYYY-MM-DD e idade mínima de 10 anos */
export function isValidBirthDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const minAge = new Date();
  minAge.setFullYear(minAge.getFullYear() - 10);
  return d <= minAge;
}
