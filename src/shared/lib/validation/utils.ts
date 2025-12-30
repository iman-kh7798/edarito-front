export const faToEnDigits = (input: string) =>
  input
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());

export const normalizeSpaces = (s: string) => s.replace(/\s+/g, " ").trim();

export const onlyDigits = (s: string) => /^\d+$/.test(s);

export const mod11NationalId = (nid: string) => {
  // nid: 10 digits
  const check = +nid[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += +nid[i] * (10 - i);
  const r = sum % 11;
  return (r < 2 && check === r) || (r >= 2 && check === 11 - r);
};

export const luhn = (num: string) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};
