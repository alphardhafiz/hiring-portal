export default function formatRupiah(value: string | number) {
  if (value === "" || value === null) return "";
  const numberString = value.toString().replace(/\D/g, "");
  const formatted = new Intl.NumberFormat("id-ID").format(Number(numberString));
  return formatted;
}
