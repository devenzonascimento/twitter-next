const isTwitterUsername = (input: string): boolean => {
  // Remove espaços extras
  const trimmedInput = input.trim();

  // Verifica se o comprimento está entre 5 e 15 caracteres
  if (trimmedInput.length < 5 || trimmedInput.length > 15) {
      return false;
  }

  // Verifica se contém apenas caracteres permitidos (letras, números e underscore)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(trimmedInput);
};

export enum InputType {
  Unknow = 0,
  Email = 1,
  Phone = 2,
  Username = 3,
}

export const getInputType = (input: string): InputType => {
  // Remove espaços extras
  const trimmedInput = input.trim();

  // Verifica se é um e-mail (contém @ e um domínio válido)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedInput)) {
      return 1;
  }

  // Verifica se é um número de telefone (apenas números, espaços, +, -, ())
  const phoneRegex = /^[+\d\s\-()]+$/;
  if (phoneRegex.test(trimmedInput)) {
    return 2;
  }
  
  return isTwitterUsername(trimmedInput) ? 3 : 0
};
