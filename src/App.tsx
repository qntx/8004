import { ThemeProvider } from '@/providers/ThemeProvider'
import { WalletProvider } from '@/providers/WalletProvider'
import { SearchPage } from '@/components/SearchPage'

export default function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <SearchPage />
      </WalletProvider>
    </ThemeProvider>
  )
}
