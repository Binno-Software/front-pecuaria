export default function getDescricaoEnum(enums, key) {
  return enums?.filter((item) => item.chave === key)[0].valor;
}
