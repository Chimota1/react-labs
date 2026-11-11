import './Header.scss'

type HeaderProps = {
  title: string
  subtitle: string
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="app-header">
      <p className="app-header__eyebrow">Навчальний планувальник</p>
      <h1 className="app-header__title">{title}</h1>
      <p className="app-header__subtitle">{subtitle}</p>
    </header>
  )
}

export default Header
