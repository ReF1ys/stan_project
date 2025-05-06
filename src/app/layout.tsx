import { Metadata } from 'next'
import { Montserrat } from 'next/font/google' // Импортируем Montserrat
import './globals.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

const montserrat = Montserrat({ 
  weight: ['300', '400', '700'], // Укажите необходимые веса
  subsets: ['latin'], // Укажите подмножества
  variable: '--font-montserrat' // Задайте переменную для шрифта
})

export const metadata: Metadata = {
  title: 'Stan Project',
  description: 'Управление станками и оборудованием',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable}`}>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
