export const isPrime = (num: number): boolean => {
  if (num < 2) return false;

  // 2부터 num-1까지의 숫자로 num이 나누어 떨어지면 소수가 아님.
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }

  return true;
}

export const findPrimeNumbers = (max: number): number[] => {
  const primes: number[] = [];
  
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) primes.push(i);
  }

  return primes;
}