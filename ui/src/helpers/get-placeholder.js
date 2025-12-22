export default function getPlaceholder (type, defaultPlaceholder = 'Digite aqui...') {
  const placeholders = {
    'company-document': 'XX.XXX.XXX/XXXX-00',
    date: 'dd/mm/aaaa',
    datetime: 'dd/mm/aaaa hh:mm',
    decimal: '0,00',
    email: 'seuemail@exemplo.com',
    integer: '0',
    money: 'R$ 0,00',
    percent: '0,00%',
    'personal-document': '000.000.000-00',
    phone: '(00) 00000-0000',
    'postal-code': '00000-000',
    'square-area': '0,00 m²',
    time: 'hh:mm'
  }

  return placeholders[type] || defaultPlaceholder
}
