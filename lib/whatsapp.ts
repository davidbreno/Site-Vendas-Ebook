const DEFAULT_WHATSAPP_NUMBER = '5500000000000'

export const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de mais informações.\n\nNome:\nEmail:\nWhatsApp:\nProduto/Serviço de interesse:'

export function getWhatsappLink(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  const text = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${text}`
}
