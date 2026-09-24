export const PHONE = "5593991666437"
export const ORDER_MESSAGE = "Olá, Carlão! Quero fazer um pedido."

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo, matches Date#getDay()

export const OPENING_HOURS: Record<Weekday, [number, number]> = {
  0: [7, 14],
  1: [7, 22],
  2: [7, 22],
  3: [7, 22],
  4: [7, 22],
  5: [7, 22],
  6: [8, 21],
}

export interface HoursRow {
  label: string
  days: Weekday[]
  opens: number
  closes: number
}

export const HOURS_TABLE: HoursRow[] = [
  { label: "Segunda a sexta", days: [1, 2, 3, 4, 5], opens: 7, closes: 22 },
  { label: "Sábado", days: [6], opens: 8, closes: 21 },
  { label: "Domingo", days: [0], opens: 7, closes: 14 },
]

export const BUSINESS = {
  name: "Carlão Gás e Água",
  legalName: "Carlão Gás e Água Distribuidora",
  tagline: "Distribuidora em Itaituba",
  since: 2014,
  cnpj: "00.000.000/0000-00",
  anp: "000000",
  instagram: "https://www.instagram.com/carlaogasagua",
  instagramHandle: "@carlaogasagua",
  address: {
    street: "Avenida Carleto Bemergui, 950",
    complement: "Esquina com a Rua Décima Quarta",
    neighborhood: "Jardim das Araras, Itaituba - PA",
    zip: "68180-400",
    mapsQuery: "Avenida+Carleto+Bemergui+950+Jardim+das+Araras+Itaituba+PA",
  },
}

export interface GasProduct {
  name: string
  description: string
  price: number
  whatsappMessage: string
}

export interface GasAccessory {
  name: string
  description: string
  whatsappMessage: string
}

export const GAS_PRODUCTS: GasProduct[] = [
  {
    name: "Botijão 13 kg",
    description: "Gás Paraguás, o tamanho de casa",
    price: 140,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 botijão de gás 13 kg Paraguás.",
  },
  {
    name: "Botijão 8 kg",
    description: "Gás Paraguás, para quem usa pouco",
    price: 110,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 botijão de gás 8 kg Paraguás.",
  },
]

export const GAS_ACCESSORY: GasAccessory = {
  name: "Registro, mangueira e suporte",
  description: "Acessórios para instalar com segurança",
  whatsappMessage: "Olá, Carlão! Queria saber o preço de registro, mangueira e suporte para botijão.",
}

export const WATER_PRODUCTS: GasProduct[] = [
  {
    name: "Bom Jesus",
    description: "Galão de 20 litros",
    price: 19,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 galão de água Bom Jesus 20 L.",
  },
  {
    name: "Cristal da Serra",
    description: "Galão de 20 litros",
    price: 21,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 galão de água Cristal da Serra 20 L.",
  },
]

export interface Step {
  title: string
  description: string
}

export const STEPS: Step[] = [
  { title: "Chame no WhatsApp", description: "Diga o que precisa, gás, água ou os dois, e o seu endereço." },
  { title: "A entrega sai daqui", description: "Nosso entregador leva até a sua porta, em qualquer bairro de Itaituba." },
  { title: "Pague como preferir", description: "Pix, cartão ou dinheiro, na hora da entrega." },
]

export interface Review {
  author: string
  neighborhood: string
  quote: string
}

// AVISO: avaliações de exemplo copiadas do site atual. Trocar por avaliações
// reais de clientes antes de divulgar o site (o mesmo aviso já existia no
// index.html original).
export const EXAMPLE_REVIEWS: Review[] = [
  { author: "Dona Raimunda", neighborhood: "Bela Vista", quote: "O gás acabou no meio do almoço de domingo. Chamei no WhatsApp e em pouco tempo o botijão já estava aqui." },
  { author: "Marcos A.", neighborhood: "Centro", quote: "Compro água toda semana aqui. Entregador educado, sobe com o galão e ainda aceita Pix na hora." },
  { author: "Juliana S.", neighborhood: "Jardim das Araras", quote: "Tenho restaurante e o Carlão nunca me deixou na mão. Preço justo e atendimento de quem conhece a gente." },
]
